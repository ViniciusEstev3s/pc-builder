'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

type Row = { label: string; a: number; b: number; aText: string; bText: string; better: 'high' | 'low'; note: string };
type Cmp = { id: string; title: string; a: string; b: string; aSub: string; bSub: string; verdict: string; rows: Row[] };

const COMPARES: Cmp[] = [
  {
    id: 'ssd-hd',
    title: 'SSD vs HD',
    a: 'SSD NVMe',
    b: 'HD',
    aSub: 'chips de memória flash',
    bSub: 'disco magnético girando',
    verdict: 'Sistema e jogos no SSD. Fotos, vídeos e backup no HD. Os dois juntos são a combinação clássica.',
    rows: [
      { label: 'Leitura', a: 7000, b: 180, aText: '7.000 MB/s', bText: '180 MB/s', better: 'high', note: 'Abrir um jogo de 50 GB: ~8 s no SSD contra ~5 min no HD.' },
      { label: 'Tempo de acesso', a: 0.1, b: 9, aText: '0,1 ms', bText: '9 ms', better: 'low', note: 'O HD precisa mover um braço mecânico até o dado.' },
      { label: 'Espaço por real', a: 3, b: 9, aText: 'menor', bText: '~3× maior', better: 'high', note: 'Pelo mesmo dinheiro, o HD guarda bem mais.' },
      { label: 'Resistência a impacto', a: 9, b: 3, aText: 'alta', bText: 'baixa', better: 'high', note: 'Sem partes móveis, o SSD aguenta quedas e vibração.' },
      { label: 'Ruído', a: 0, b: 26, aText: '0 dB', bText: '~26 dB', better: 'low', note: 'O HD faz um leve zumbido e "cliques" de leitura.' },
    ],
  },
  {
    id: 'water-air',
    title: 'Water cooler vs Air cooler',
    a: 'Water cooler',
    b: 'Air cooler',
    aSub: 'líquido + radiador',
    bSub: 'cobre + alumínio + vento',
    verdict: 'Para a maioria das CPUs, um bom air cooler basta. O water cooler compensa em processadores muito quentes ou quando o visual importa.',
    rows: [
      { label: 'Resfriamento máximo', a: 9, b: 7.5, aText: '360 mm: excelente', bText: 'torre dupla: muito bom', better: 'high', note: 'Em uso pesado e longo, o radiador grande leva vantagem.' },
      { label: 'Preço', a: 8, b: 4, aText: 'mais caro', bText: 'mais barato', better: 'low', note: 'Air coolers de qualidade custam bem menos.' },
      { label: 'Pontos de falha', a: 6, b: 2, aText: 'bomba + fans', bText: 'só a fan', better: 'low', note: 'Se a fan do air cooler quebrar, troca-se só ela.' },
      { label: 'Visual e espaço', a: 9, b: 5, aText: 'limpo, RGB', bText: 'torre grande', better: 'high', note: 'A água libera espaço em volta da CPU.' },
      { label: 'Vida útil', a: 6, b: 10, aText: '5–7 anos', bText: '10+ anos', better: 'high', note: 'O líquido evapora lentamente com os anos.' },
    ],
  },
  {
    id: 'ram-ssd',
    title: 'RAM vs SSD',
    a: 'RAM',
    b: 'SSD',
    aSub: 'a mesa de trabalho',
    bSub: 'a gaveta',
    verdict: 'São memórias com papéis diferentes. A RAM é rápida e temporária; o SSD é permanente e espaçoso. Uma não substitui a outra.',
    rows: [
      { label: 'Velocidade', a: 60000, b: 7000, aText: '~60.000 MB/s', bText: '7.000 MB/s', better: 'high', note: 'A RAM é cerca de 8× mais rápida que um SSD topo de linha.' },
      { label: 'Capacidade típica', a: 32, b: 1000, aText: '32 GB', bText: '1.000 GB', better: 'high', note: 'O SSD guarda cerca de 30× mais coisa.' },
      { label: 'Guarda ao desligar', a: 0, b: 10, aText: 'não', bText: 'sim', better: 'high', note: 'Por isso você precisa salvar o arquivo antes de desligar.' },
      { label: 'Custo por GB', a: 10, b: 1.5, aText: 'alto', bText: 'baixo', better: 'low', note: 'Memória rápida é cara; por isso existe a divisão.' },
    ],
  },
];

function Bar({ value, max, color, label, win }: { value: number; max: number; color: string; label: string; win: boolean }) {
  const pct = max === 0 ? 0 : Math.max(2, (value / max) * 100);
  return (
    <div className="min-w-0">
      <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(17,17,17,0.07)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: win ? `0 0 14px ${color}` : 'none' }}
          initial={{ width: `${pct * 0.15}%` }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className={`mono mt-1.5 text-[0.75rem] ${win ? 'text-[var(--fg)]' : 'text-[var(--muted)]'}`}>
        {label}
        {win && <span className="ml-1.5 text-[var(--lilac)]">▲ vence</span>}
      </p>
    </div>
  );
}

export default function Comparisons() {
  const [tab, setTab] = useState(0);
  const c = COMPARES[tab];
  return (
    <section id="comparar" className="gutter relative bg-[var(--void)] py-28">
      <div className="bg-pcb mask-radial pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-[1180px]">
        <p className="eyebrow">Lado a lado</p>
        <h2 className="display mt-4 text-[clamp(2.2rem,6vw,4.6rem)] font-[800] uppercase">
          Qual <span className="text-gradient">escolher?</span>
        </h2>
        <div role="tablist" aria-label="Comparativos" className="mt-8 flex flex-wrap gap-2">
          {COMPARES.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={tab === i}
              aria-controls="cmp-panel"
              onClick={() => setTab(i)}
              className={`neon-hover mono rounded-full border px-5 py-2.5 text-[0.8rem] uppercase tracking-[0.12em] ${
                tab === i ? 'border-[var(--neon)] bg-[var(--violet)] text-[var(--fg)]' : 'border-[var(--line)] text-[var(--lilac)]'
              }`}
            >
              {x.title}
            </button>
          ))}
        </div>

        <motion.div
          key={c.id}
          id="cmp-panel"
          role="tabpanel"
          aria-labelledby={`tab-${c.id}`}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          {[
            { name: c.a, sub: c.aSub, color: 'var(--neon)', side: 'a' as const },
            { name: c.b, sub: c.bSub, color: 'var(--cyan)', side: 'b' as const },
          ].map((side) => (
            <article key={side.name} className="glass neon-hover min-w-0 rounded-[26px] p-6 md:p-8">
              <p className="mono text-[0.7rem] uppercase tracking-[0.2em]" style={{ color: side.side === 'a' ? 'var(--lilac)' : 'var(--fg)' }}>
                {side.sub}
              </p>
              <h3 className="display mt-2 text-[clamp(1.7rem,4vw,2.6rem)] font-[800] text-[var(--fg)]">{side.name}</h3>
              <div className="mt-6 grid gap-5">
                {c.rows.map((r) => {
                  const max = Math.max(r.a, r.b);
                  const mine = side.side === 'a' ? r.a : r.b;
                  const other = side.side === 'a' ? r.b : r.a;
                  const win = r.better === 'high' ? mine > other : mine < other;
                  return (
                    <div key={r.label} className="group">
                      <p className="mb-2 text-[0.88rem] font-semibold text-[var(--fg2)]">{r.label}</p>
                      <Bar value={mine} max={max} color={side.color} label={side.side === 'a' ? r.aText : r.bText} win={win} />
                      <p className="mt-1 text-[0.8rem] leading-snug text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--lilac)]">
                        {r.note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
          <p className="glass rounded-2xl p-5 text-[1rem] leading-relaxed text-[var(--fg2)] md:col-span-2">
            <span className="mono mr-2 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--lilac)]">Veredito</span>
            {c.verdict}
          </p>
        </motion.div>
        <p className="mono mt-3 text-[0.7rem] text-[var(--muted)]">
          Barras em escala dentro de cada linha. Valores típicos e aproximados.
        </p>
      </div>
    </section>
  );
}
