'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Node = { id: string; x: number; y: number; w: number; label: string; sub: string; info: string };
const NODES: Node[] = [
  { id: 'tomada', x: 90, y: 480, w: 130, label: 'Tomada', sub: '127/220 V AC', info: 'Corrente alternada da rede elétrica. Nenhuma peça usa essa energia diretamente.' },
  { id: 'fonte', x: 290, y: 480, w: 150, label: 'Fonte', sub: '12 · 5 · 3,3 V DC', info: 'Converte a energia da tomada em corrente contínua e distribui por cabos para cada peça.' },
  { id: 'hdd', x: 120, y: 340, w: 130, label: 'HD', sub: 'SATA', info: 'Guarda arquivos grandes. Recebe energia SATA da fonte e manda dados pela placa-mãe.' },
  { id: 'ssd', x: 120, y: 200, w: 130, label: 'SSD', sub: 'M.2 · NVMe', info: 'Onde o sistema e os jogos moram. Fala com a CPU pelas linhas PCIe da placa-mãe.' },
  { id: 'mobo', x: 500, y: 300, w: 240, label: 'Placa-mãe', sub: 'as ruas da cidade', info: 'Conecta tudo. Leva dados entre as peças e distribui a energia de 24 pinos.' },
  { id: 'cpu', x: 400, y: 120, w: 130, label: 'CPU', sub: 'cérebro', info: 'Processa as instruções. Recebe energia própria (cabo EPS de 8 pinos) e conversa com a RAM o tempo todo.' },
  { id: 'ram', x: 620, y: 120, w: 130, label: 'RAM', sub: 'mesa de trabalho', info: 'Guarda temporariamente o que a CPU está usando agora.' },
  { id: 'gpu', x: 760, y: 300, w: 130, label: 'GPU', sub: 'PCIe x16', info: 'Desenha a imagem. Tem cabo de energia próprio vindo da fonte.' },
  { id: 'monitor', x: 920, y: 300, w: 130, label: 'Monitor', sub: 'HDMI · DP', info: 'Recebe a imagem pronta da GPU.' },
  { id: 'cool', x: 760, y: 480, w: 170, label: 'Refrigeração', sub: 'fans · coolers', info: 'Fans e coolers recebem energia e controle de velocidade (PWM) da placa-mãe.' },
];
const N = Object.fromEntries(NODES.map((n) => [n.id, n]));

type Edge = { id: string; from: string; to: string; kind: 'data' | 'power'; bend?: number; label?: string };
const EDGES: Edge[] = [
  { id: 'tomada-fonte', from: 'tomada', to: 'fonte', kind: 'power' },
  { id: 'fonte-mobo', from: 'fonte', to: 'mobo', kind: 'power', bend: -40, label: '24 pinos' },
  { id: 'fonte-cpu', from: 'fonte', to: 'cpu', kind: 'power', bend: 120, label: 'EPS 8 pinos' },
  { id: 'fonte-gpu', from: 'fonte', to: 'gpu', kind: 'power', bend: 60, label: '12V-2x6' },
  { id: 'fonte-hdd', from: 'fonte', to: 'hdd', kind: 'power', bend: 30, label: 'SATA' },
  { id: 'mobo-cool', from: 'mobo', to: 'cool', kind: 'power', bend: -30, label: 'PWM' },
  { id: 'ssd-ram', from: 'ssd', to: 'ram', kind: 'data', bend: -130 },
  { id: 'hdd-mobo', from: 'hdd', to: 'mobo', kind: 'data', bend: 20 },
  { id: 'ram-cpu', from: 'ram', to: 'cpu', kind: 'data', bend: 30 },
  { id: 'cpu-gpu', from: 'cpu', to: 'gpu', kind: 'data', bend: -40, label: 'PCIe' },
  { id: 'gpu-monitor', from: 'gpu', to: 'monitor', kind: 'data' },
];

function pathFor(e: Edge) {
  const a = N[e.from];
  const b = N[e.to];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const k = e.bend ?? 0;
  const cx = mx + (-dy / len) * k;
  const cy = my + (dx / len) * k;
  return { d: `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`, lx: (a.x + 2 * cx + b.x) / 4, ly: (a.y + 2 * cy + b.y) / 4 };
}

const STEPS = [
  { edges: ['ssd-ram'], nodes: ['ssd', 'ram'], text: 'Você clica no jogo. Os arquivos saem do SSD e são copiados para a RAM.' },
  { edges: ['ram-cpu'], nodes: ['ram', 'cpu'], text: 'A CPU lê da RAM as regras do jogo: física, inteligência dos inimigos, sons.' },
  { edges: ['cpu-gpu'], nodes: ['cpu', 'gpu'], text: 'A CPU envia para a GPU a lista do que desenhar, pelo slot PCIe da placa-mãe.' },
  { edges: ['gpu-monitor'], nodes: ['gpu', 'monitor'], text: 'A GPU pinta milhões de pixels e manda a imagem ao monitor, até 144 vezes por segundo.' },
  {
    edges: ['tomada-fonte', 'fonte-mobo', 'fonte-cpu', 'fonte-gpu', 'fonte-hdd', 'mobo-cool'],
    nodes: ['tomada', 'fonte', 'cool'],
    text: 'Enquanto isso, a fonte alimenta tudo e as fans tiram o calor gerado.',
  },
];

const COLORS = { data: 'var(--cyan)', power: 'var(--magenta)' };

export default function FlowDiagram() {
  const [mode, setMode] = useState<'all' | 'data' | 'power'>('all');
  const [hover, setHover] = useState<string | null>(null);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (step < 0) return;
    const t = setTimeout(() => setStep((s) => (s + 1 >= STEPS.length ? -1 : s + 1)), 3200);
    return () => clearTimeout(t);
  }, [step]);

  const cur = step >= 0 ? STEPS[step] : null;
  const info = hover ? N[hover] : null;

  return (
    <section id="conexoes" className="gutter relative bg-[var(--ink)] py-28">
      <div className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-[1180px]">
        <p className="eyebrow">Como tudo se conecta</p>
        <h2 className="display mt-4 max-w-[18ch] text-[clamp(2.2rem,6vw,4.6rem)] font-[800] uppercase">
          Dados e <span className="text-gradient">energia</span>
        </h2>
        <p className="mt-5 max-w-[60ch] text-[1.05rem] leading-relaxed text-[var(--fg2)]">
          Dois tipos de "trânsito" correm dentro do PC. As linhas{' '}
          <span className="font-semibold text-[var(--fg)]">pretas</span> levam informação; as{' '}
          <span className="font-semibold text-[var(--lilac)]">laranja</span> levam energia. Passe o mouse ou toque numa peça.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {(
            [
              ['all', 'Ver tudo'],
              ['data', 'Só dados'],
              ['power', 'Só energia'],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => {
                setMode(k);
                setStep(-1);
              }}
              aria-pressed={mode === k && step < 0}
              className={`neon-hover mono rounded-full border px-4 py-2 text-[0.75rem] uppercase tracking-[0.12em] ${
                mode === k && step < 0 ? 'border-[var(--neon)] bg-[rgba(255,106,19,0.35)] text-[var(--fg)]' : 'border-[var(--line)] text-[var(--lilac)]'
              }`}
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => setStep(step >= 0 ? -1 : 0)}
            className="neon-hover display ml-auto rounded-full bg-[var(--violet)] px-5 py-2.5 text-[0.78rem] font-[600] uppercase tracking-wide text-[var(--fg)]"
          >
            {step >= 0 ? 'Parar' : '▶ Simular: abrir um jogo'}
          </button>
        </div>

        <div className="glass mt-6 overflow-x-auto rounded-[26px] p-3 md:p-6">
          <svg viewBox="0 0 1010 560" className="block w-full min-w-[720px]" role="group" aria-label="Diagrama do fluxo de dados e energia entre as peças do PC">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {EDGES.map((e) => {
              const { d, lx, ly } = pathFor(e);
              const inStep = cur ? cur.edges.includes(e.id) : null;
              const visibleByMode = mode === 'all' || mode === e.kind;
              const touchesHover = hover ? e.from === hover || e.to === hover : false;
              const lit = cur ? inStep : visibleByMode && (!hover || touchesHover);
              const color = COLORS[e.kind];
              return (
                <g key={e.id} style={{ opacity: lit ? 1 : 0.1, transition: 'opacity .4s' }}>
                  <path d={d} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={6} />
                  <path d={d} fill="none" stroke={color} strokeWidth={2.2} className={`flow-line ${e.kind === 'power' ? 'slow' : ''}`} filter="url(#glow)" />
                  {lit && (
                    <circle r={4.5} fill={color} filter="url(#glow)">
                      <animateMotion dur={e.kind === 'data' ? '1.4s' : '2.4s'} repeatCount="indefinite" path={d} />
                    </circle>
                  )}
                  {e.label && (
                    <text x={lx} y={ly - 8} textAnchor="middle" fill="var(--muted)" fontSize="12" className="mono">
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}
            {NODES.map((n) => {
              const lit = cur ? cur.nodes.includes(n.id) : !hover || hover === n.id || EDGES.some((e) => (e.from === hover && e.to === n.id) || (e.to === hover && e.from === n.id));
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="button"
                  aria-describedby={`flow-desc-${n.id}`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => setHover(hover === n.id ? null : n.id)}
                  style={{ cursor: 'pointer', opacity: lit ? 1 : 0.35, transition: 'opacity .3s' }}
                >
                  <rect
                    x={n.x - n.w / 2}
                    y={n.y - 32}
                    width={n.w}
                    height={64}
                    rx={16}
                    fill="#ffffff"
                    stroke={hover === n.id || (cur && cur.nodes.includes(n.id)) ? 'var(--neon)' : 'rgba(255,106,19,.35)'}
                    strokeWidth={hover === n.id ? 2 : 1.2}
                    filter={hover === n.id ? 'url(#glow)' : undefined}
                  />
                  <desc id={`flow-desc-${n.id}`}>{n.info}</desc>
                  <text x={n.x} y={n.y - 2} textAnchor="middle" fill="#fff" fontSize="17" fontWeight="700" className="display">
                    {n.label}
                  </text>
                  <text x={n.x} y={n.y + 18} textAnchor="middle" fill="var(--lilac)" fontSize="11.5" className="mono">
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-4 min-h-[4.5rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={cur ? `s${step}` : info ? info.id : 'idle'}
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[1.02rem] leading-relaxed text-[var(--fg2)]"
            >
              {cur ? (
                <>
                  <span className="mono mr-2 text-[0.75rem] text-[var(--lilac)]">
                    PASSO {step + 1}/{STEPS.length}
                  </span>
                  {cur.text}
                </>
              ) : info ? (
                <>
                  <strong className="text-[var(--lilac)]">{info.label}: </strong>
                  {info.info}
                </>
              ) : (
                <span className="text-[var(--muted)]">
                  Toque em <strong className="text-[var(--fg)]">Simular</strong> para seguir o caminho de um jogo, do SSD até a sua tela.
                </span>
              )}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
