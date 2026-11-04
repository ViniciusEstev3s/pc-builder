'use client';
/**
 * Visualizador 3D do PC Gamer (tela #gamer).
 *
 * - peças removíveis com encaixe (tirar a placa-mãe tira o que está preso nela)
 * - níveis Entrada / Intermediário / Avançado com cooler, GPU, RAM e fonte diferentes
 * - LED liga/desliga, cor, efeito e brilho
 * - fluxo de ar, temperatura estimada, nomes das peças, antigravidade
 * - câmera que voa até a peça, giro automático, captura de tela e tela cheia
 */
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, N8AO, Outline, SMAA, Selection, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import {
  CORES_LED,
  DEF,
  EFEITOS_LED,
  MAPA_PECA_CATEGORIA,
  PECAS,
  TODAS,
  apoiosDe,
  configDoNivel,
  dependentes,
  estimarTemperaturas,
  listarNomes,
  rpmDe,
  validarEncaixe3D,
  type CorChakra,
  type EfeitoLed,
  type LeituraTemp,
  type PecaId,
  type TierType,
} from './gamer/dados';
import { CATALOGO_PECAS, buscarPecaPorId } from '@/lib/konoha/pecas';
import type { Selecao } from '@/lib/konoha/tipos';
import { montagem, quantidadeEscolhida } from '@/lib/montagem';
import { ModeloGabinete, VivoCtx, type Vivo } from './gamer/Modelo';
import { DiretorCamera, FluxoDeAr, type Voo } from './gamer/Efeitos';
import { EntradaCamera, Palco } from './gamer/Palco';
import { CameraTermica, PALETA_TERMICA, TEMP_MAX, TEMP_MIN, extremos, fontesDeCalor } from './gamer/Termico';

export { CORES_LED };
export type { CorChakra, TierType };

type Qualidade = 'alta' | 'leve';
type Aba = 'pecas' | 'luz' | 'visao';

const POS_INICIAL: [number, number, number] = [-3.8, 1.6, 3.6];
const ANGULOS: { id: string; rotulo: string; pos: [number, number, number]; alvo?: [number, number, number] }[] = [
  { id: 'pan', rotulo: 'Panorâmica', pos: POS_INICIAL },
  { id: 'frente', rotulo: 'Vidro', pos: [0.15, 0.35, 4.6] },
  { id: 'lado', rotulo: 'Lateral', pos: [-4.4, 0.3, 0.6] },
  { id: 'cima', rotulo: 'De cima', pos: [-0.4, 4.8, 1.6] },
];

/* ---------------------------------------------------------------------------
   Utilitários
   --------------------------------------------------------------------------- */

const CHAVE_PREFS = 'konoha-3d-gamer';
type Prefs = Partial<{ cor: string; led: boolean; efeito: EfeitoLed; brilho: number; qualidade: Qualidade; fundo: 'estudio' | 'dark'; rotacao: number }>;

function lerPrefs(): Prefs {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PREFS) || '{}') as Prefs;
  } catch {
    return {};
  }
}
function salvarPrefs(p: Prefs) {
  try {
    localStorage.setItem(CHAVE_PREFS, JSON.stringify(p));
  } catch {
    /* navegação privada ou armazenamento bloqueado */
  }
}

function temWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function usePrefereMenosMovimento() {
  const [reduzir, setReduzir] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduzir(mq.matches);
    const f = () => setReduzir(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return reduzir;
}

type Tres = { gl?: THREE.WebGLRenderer; camera?: THREE.Camera; controls?: any };

/** Guarda câmera, controles e renderizador para uso fora do Canvas. */
function Captura({ alvo }: { alvo: React.MutableRefObject<Tres> }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  useEffect(() => {
    alvo.current = { gl, camera, controls };
  }, [gl, camera, controls, alvo]);
  return null;
}

/* ---------------------------------------------------------------------------
   Peças de interface
   --------------------------------------------------------------------------- */

function Interruptor({ ligado, aoMudar, rotulo, descricao }: { ligado: boolean; aoMudar: (v: boolean) => void; rotulo: string; descricao?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      onClick={() => aoMudar(!ligado)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition-colors hover:bg-white/[0.07]"
    >
      <span className="min-w-0">
        <span className="block text-[0.82rem] font-semibold text-white">{rotulo}</span>
        {descricao && <span className="block text-[0.7rem] leading-snug text-white/55">{descricao}</span>}
      </span>
      <span aria-hidden className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${ligado ? 'bg-[var(--violet)]' : 'bg-white/20'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${ligado ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </span>
    </button>
  );
}

function Deslizante({
  rotulo,
  valor,
  aoMudar,
  min = 0,
  max = 1,
  passo = 0.05,
  texto,
  desativado,
}: {
  rotulo: string;
  valor: number;
  aoMudar: (v: number) => void;
  min?: number;
  max?: number;
  passo?: number;
  texto: string;
  desativado?: boolean;
}) {
  return (
    <label className={`block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 ${desativado ? 'opacity-40' : ''}`}>
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-[0.82rem] font-semibold text-white">{rotulo}</span>
        <span className="tnum text-[0.72rem] text-white/60">{texto}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        disabled={desativado}
        onChange={(e) => aoMudar(Number(e.target.value))}
        className="mt-1.5 w-full accent-[var(--violet)]"
      />
    </label>
  );
}

const COR_TEMP: Record<LeituraTemp['nivel'], string> = {
  ok: 'text-emerald-300',
  morno: 'text-amber-300',
  quente: 'text-orange-400',
  critico: 'text-red-400',
  off: 'text-white/45',
};

/** Ícones desenhados (traço de 1,6 px, herdam a cor do texto). */
function Icone({ nome, className = 'h-4 w-4' }: { nome: 'foto' | 'expandir' | 'recolher' | 'termica'; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {nome === 'foto' && (
        <>
          <path {...p} d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z" />
          <circle {...p} cx="12" cy="13.2" r="3.6" />
        </>
      )}
      {nome === 'expandir' && <path {...p} d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
      {nome === 'recolher' && <path {...p} d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />}
      {nome === 'termica' && (
        <>
          <path {...p} d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z" />
          <path {...p} d="M12 9v7" />
          <path {...p} d="M17.5 6h2.5M17.5 9.5h2.5" />
        </>
      )}
    </svg>
  );
}

const GRADIENTE_TERMICO = `linear-gradient(90deg, ${PALETA_TERMICA.join(', ')})`;

/** Termômetro compacto: valor + régua de 20 a 100 °C na paleta térmica. */
function Termometro({ rotulo, leitura }: { rotulo: string; leitura: LeituraTemp }) {
  const pos = leitura.valor == null ? null : Math.min(1, Math.max(0, (leitura.valor - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)));
  return (
    <div
      className="w-[96px] rounded-xl border border-white/10 bg-[rgba(12,14,18,0.82)] px-2.5 pb-2 pt-1.5 text-white backdrop-blur-[12px]"
      title={leitura.alerta ?? 'Temperatura estimada em jogo'}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span className="text-[0.66rem] font-semibold text-white/55">{rotulo}</span>
        <span className={`tnum text-[0.84rem] font-bold leading-none ${COR_TEMP[leitura.nivel]} ${leitura.nivel === 'critico' ? 'animate-pulse' : ''}`}>
          {leitura.texto}
        </span>
      </div>
      <div className="relative mt-1.5 h-[3px] rounded-full opacity-90" style={{ background: GRADIENTE_TERMICO }}>
        {pos != null && (
          <span
            className="absolute top-1/2 h-2.5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.6)] transition-[left] duration-500"
            style={{ left: `${pos * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Componente principal
   --------------------------------------------------------------------------- */

export default function GamerChassis3D({ tier }: { tier: TierType }) {
  const [overrides, setOverrides] = useState<Partial<Selecao>>({});
  useEffect(() => {
    setOverrides({});
  }, [tier]);

  const config = useMemo(() => configDoNivel(tier, overrides), [tier, overrides]);
  const reduzir = usePrefereMenosMovimento();
  const [webgl, setWebgl] = useState(true);

  const [montadas, setMontadas] = useState<Set<PecaId>>(() => new Set(TODAS));
  const [selecionada, setSelecionada] = useState<PecaId | null>(null);
  const [sobre, setSobre] = useState<PecaId | null>(null);
  const [arrastandoId, setArrastandoId] = useState<PecaId | null>(null);
  const [pertoDoSlot, setPertoDoSlot] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [aba, setAba] = useState<Aba>('pecas');

  const [corAtiva, setCorAtiva] = useState<CorChakra>(CORES_LED[0]);
  const [ledLigado, setLedLigado] = useState(true);
  const [efeitoLed, setEfeitoLed] = useState<EfeitoLed>('fixo');
  const [brilho, setBrilho] = useState(1);
  const [rotacao, setRotacao] = useState(0.6);

  const [antigravidade, setAntigravidade] = useState(false);
  const [termica, setTermica] = useState(false);
  const [fluxoAr, setFluxoAr] = useState(false);
  const [mostrarNomes, setMostrarNomes] = useState(false);
  const [girar, setGirar] = useState(false);
  const [qualidade, setQualidade] = useState<Qualidade>('alta');
  const qualidadeEscolhida = useRef(false);
  const [temaFundo, setTemaFundo] = useState<'estudio' | 'dark'>('estudio');

  const [visivel, setVisivel] = useState(true);
  const [telaCheia, setTelaCheia] = useState(false);
  const [podeTelaCheia, setPodeTelaCheia] = useState(false);

  const [objetos, setObjetos] = useState<Partial<Record<PecaId, THREE.Group>>>({});
  const tres = useRef<Tres>({});
  const voo = useRef<Voo>(null);
  const vivo = useRef<Vivo>({ rotacao: 0.6 });
  const caixaRef = useRef<HTMLDivElement>(null);
  const painelRef = useRef<HTMLElement>(null);
  const prefsCarregadas = useRef(false);

  vivo.current.rotacao = rotacao;

  /* ---------- sombra: recalcula durante as animações e congela depois ---------- */
  const [animando, setAnimando] = useState(true);
  const [versaoCena, setVersaoCena] = useState(0);
  const chaveCena = `${tier}|${[...montadas].sort().join(',')}`;
  useEffect(() => {
    setAnimando(true);
    const t = setTimeout(() => {
      setAnimando(false);
      setVersaoCena((v) => v + 1);
    }, 2600);
    return () => clearTimeout(t);
  }, [chaveCena, antigravidade]);
  const sombraViva = animando || antigravidade || arrastandoId !== null;

  /* ---------- preferências salvas neste navegador ---------- */
  useEffect(() => {
    setWebgl(temWebGL());
    setPodeTelaCheia(!!document.fullscreenEnabled);
    const p = lerPrefs();
    const cor = CORES_LED.find((c) => c.id === p.cor);
    if (cor) setCorAtiva(cor);
    if (typeof p.led === 'boolean') setLedLigado(p.led);
    if (p.efeito && EFEITOS_LED.some((e) => e.id === p.efeito)) setEfeitoLed(p.efeito);
    if (typeof p.brilho === 'number') setBrilho(Math.min(1, Math.max(0.2, p.brilho)));
    if (typeof p.rotacao === 'number') setRotacao(Math.min(1, Math.max(0, p.rotacao)));
    if (p.qualidade === 'alta' || p.qualidade === 'leve') {
      setQualidade(p.qualidade);
      qualidadeEscolhida.current = true;
    }
    if (p.fundo === 'estudio' || p.fundo === 'dark') setTemaFundo(p.fundo);
    prefsCarregadas.current = true;
  }, []);

  useEffect(() => {
    if (!prefsCarregadas.current) return;
    salvarPrefs({
      cor: corAtiva.id,
      led: ledLigado,
      efeito: efeitoLed,
      brilho,
      rotacao,
      fundo: temaFundo,
      ...(qualidadeEscolhida.current ? { qualidade } : {}),
    });
  }, [corAtiva, ledLigado, efeitoLed, brilho, rotacao, temaFundo, qualidade]);

  /* ---------- só desenha quando está na tela ---------- */
  useEffect(() => {
    const el = caixaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let naTela = true;
    const aplicar = () => setVisivel(naTela && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        naTela = e.isIntersecting;
        aplicar();
      },
      { rootMargin: '120px' },
    );
    io.observe(el);
    document.addEventListener('visibilitychange', aplicar);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', aplicar);
    };
  }, []);

  useEffect(() => {
    const f = () => setTelaCheia(document.fullscreenElement === caixaRef.current);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);

  useEffect(() => {
    if (arrastandoId) {
      document.body.style.cursor = 'grabbing';
    } else if (sobre) {
      document.body.style.cursor = DEF[sobre]?.arrastavel ? 'grab' : 'pointer';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [sobre, arrastandoId]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 5000);
    return () => clearTimeout(t);
  }, [aviso]);

  useEffect(() => {
    if (selecionada) {
      setAba('pecas');
      painelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selecionada]);

  // Esc tira a seleção ou cancela arraste
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (arrastandoId) setArrastandoId(null);
        else if (selecionada && !document.fullscreenElement) setSelecionada(null);
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [selecionada, arrastandoId]);

  const registrar = useCallback((id: PecaId, g: THREE.Group | null) => {
    setObjetos((o) => (o[id] === (g ?? undefined) ? o : { ...o, [id]: g ?? undefined }));
  }, []);

  /* ---------- montar, desmontar e arrastar/encaixar ---------- */
  const retirar = useCallback((id: PecaId) => {
    setMontadas((atual) => {
      const nova = new Set(atual);
      nova.delete(id);
      const junto = dependentes(id).filter((d) => atual.has(d));
      junto.forEach((d) => nova.delete(d));
      setAviso(
        junto.length
          ? `${DEF[id].nome} retirado para a bancada 3D. Também saiu: ${listarNomes(junto)} (${junto.length > 1 ? 'ficam presos' : 'fica preso'} nele).`
          : `${DEF[id].nome} retirado para a bancada 3D. Arraste-o de volta até ${DEF[id].nomeSlot} para encaixar.`,
      );
      return nova;
    });
  }, []);

  const colocar = useCallback(
    (id: PecaId) => {
      setMontadas((atual) => {
        const nova = new Set(atual);
        const faltando = apoiosDe(id).filter((a) => !atual.has(a));
        faltando.forEach((a) => nova.add(a));
        const check = validarEncaixe3D(id, nova, config.selecao);
        if (!check.ok) {
          setAviso(check.motivo);
          return atual;
        }
        nova.add(id);
        const cat = MAPA_PECA_CATEGORIA[id];
        if (cat && config.selecao[cat] && quantidadeEscolhida(montagem.atual().selecao) > 0) {
          montagem.escolher(config.selecao[cat]!);
        }
        setAviso(
          faltando.length
            ? `Para encaixar ${DEF[id].nome.toLowerCase()}, recoloquei antes: ${listarNomes(faltando)}.`
            : `✓ ${DEF[id].nome} (${config.modelos[id]}) encaixado em ${DEF[id].nomeSlot}.`,
        );
        return nova;
      });
    },
    [config.selecao, config.modelos],
  );

  const alternar = (id: PecaId) => (montadas.has(id) ? retirar(id) : colocar(id));

  const validacaoSlotAtual = useMemo(() => {
    if (!arrastandoId) return { ok: true, motivo: '' };
    return validarEncaixe3D(arrastandoId, montadas, config.selecao);
  }, [arrastandoId, montadas, config.selecao]);

  const iniciarArraste = useCallback((id: PecaId) => {
    if (!DEF[id].arrastavel) return;
    setSelecionada(id);
    setArrastandoId(id);
  }, []);

  const finalizarArraste = useCallback(
    (id: PecaId, perto: boolean, distancia: number) => {
      setArrastandoId(null);
      setPertoDoSlot(false);
      const estavaMontada = montadas.has(id);
      const def = DEF[id];

      if (perto || (!estavaMontada && distancia <= def.raioEncaixe * 1.15)) {
        const check = validarEncaixe3D(id, montadas, config.selecao);
        if (!check.ok) {
          setAviso(check.motivo);
          return;
        }
        if (!estavaMontada) {
          setMontadas((atual) => {
            const nova = new Set(atual);
            nova.add(id);
            return nova;
          });
          const cat = MAPA_PECA_CATEGORIA[id];
          if (cat && config.selecao[cat] && quantidadeEscolhida(montagem.atual().selecao) > 0) {
            montagem.escolher(config.selecao[cat]!);
          }
          setAviso(`✓ ${def.nome} (${config.modelos[id]}) encaixado com sucesso em ${def.nomeSlot}!`);
        }
      } else if (estavaMontada && distancia > def.raioEncaixe * 1.15) {
        retirar(id);
      } else if (!estavaMontada) {
        setAviso(`Arraste ${def.nome.toLowerCase()} até o guia luminoso de "${def.nomeSlot}" para encaixar.`);
      }
    },
    [montadas, config.selecao, config.modelos, retirar],
  );

  /* ---------- câmera ---------- */
  const voarPara = (pos: [number, number, number], alvo: [number, number, number] = [0, 0, 0]) => {
    const largura = tres.current.gl?.domElement.clientWidth ?? 800;
    const fator = largura < 560 ? 1.45 : 1;
    voo.current = { posicao: new THREE.Vector3(...pos).multiplyScalar(fator), alvo: new THREE.Vector3(...alvo) };
  };

  const focar = useCallback(
    (id: PecaId) => {
      const obj = objetos[id];
      const { camera, controls } = tres.current;
      if (!obj || !camera || !controls) return;
      const caixa = new THREE.Box3().setFromObject(obj);
      if (caixa.isEmpty()) return;
      const centro = caixa.getCenter(new THREE.Vector3());
      const tamanho = caixa.getSize(new THREE.Vector3()).length();
      const dir = camera.position.clone().sub(controls.target).normalize();
      if (dir.z < 0.25) dir.set(-0.45, 0.25, 1).normalize(); // olha pelo lado do vidro
      const dist = THREE.MathUtils.clamp(tamanho * 1.5 + 0.9, 2.0, 6);
      voo.current = { posicao: centro.clone().addScaledVector(dir, dist), alvo: centro };
    },
    [objetos],
  );

  /* ---------- captura e tela cheia ---------- */
  const capturar = () => {
    const gl = tres.current.gl;
    if (!gl) return;
    try {
      const url = gl.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `konoha-pc-gamer-${tier.replace('gamer-', '')}.png`;
      a.click();
    } catch {
      setAviso('Não foi possível salvar a imagem neste navegador.');
    }
  };

  const alternarTelaCheia = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await caixaRef.current?.requestFullscreen();
    } catch {
      /* navegador recusou */
    }
  };

  /* ---------- atalhos de teclado (só com o mouse ou o foco dentro do visualizador) ---------- */
  const dentroRef = useRef(false);
  const atalhos = useRef<(e: KeyboardEvent) => void>(() => {});
  atalhos.current = (e: KeyboardEvent) => {
    const alvo = e.target as HTMLElement | null;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable)) return;
    const focoDentro = !!caixaRef.current?.contains(document.activeElement);
    if (!dentroRef.current && !focoDentro && !document.fullscreenElement) return;
    const k = e.key.toLowerCase();
    const angulo = ANGULOS[Number(k) - 1];
    if (angulo) voarPara(angulo.pos, angulo.alvo);
    else if (k === 't') setTermica((v) => !v);
    else if (k === 'l') setLedLigado((v) => !v);
    else if (k === 'n') setMostrarNomes((v) => !v);
    else if (k === 'f' && podeTelaCheia) alternarTelaCheia();
    else return;
    e.preventDefault();
  };
  useEffect(() => {
    const f = (e: KeyboardEvent) => atalhos.current(e);
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, []);

  /* ---------- dados derivados ---------- */
  const isEstudio = temaFundo === 'estudio';
  const alta = qualidade === 'alta';
  const qtdMontadas = montadas.size;
  const info = selecionada ? DEF[selecionada] : null;
  const destaque = sobre ?? selecionada;
  const temps = estimarTemperaturas(config, montadas, rotacao);
  const fontes = useMemo(() => fontesDeCalor(config, montadas, temps.cpu.valor, temps.gpu.valor), [config, montadas, temps.cpu.valor, temps.gpu.valor]);
  const leituraTermica = extremos(fontes);
  const [tituloNivel, ...restoNivel] = config.rotulo.split(' — ');
  const corFundo = termica ? PALETA_TERMICA[0] : isEstudio ? '#eef0f3' : '#0a0c10';

  const botaoFlutuante =
    'pointer-events-auto rounded-xl border border-white/10 bg-[rgba(15,17,21,0.82)] px-2.5 py-1 text-[0.72rem] font-medium text-white/85 backdrop-blur-[10px] transition-colors hover:bg-[#252a35] hover:text-white';

  if (!webgl) {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-[#0c0e12] p-6 text-white">
        <img src="img/pecas/hero-pc-gamer.webp" alt="PC gamer montado com iluminação RGB" className="mx-auto max-h-[320px] rounded-2xl object-contain" />
        <p className="mt-4 text-center text-[0.9rem] text-white/75">
          Seu navegador não liberou o 3D (WebGL). Ative a aceleração por hardware nas configurações do navegador para girar e desmontar o PC.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={caixaRef}
      onMouseEnter={() => (dentroRef.current = true)}
      onMouseLeave={() => (dentroRef.current = false)}
      className={`overflow-hidden border border-[var(--line)] bg-[#0c0e12] shadow-2xl ${telaCheia ? 'h-screen w-screen rounded-none' : 'rounded-[24px]'}`}
    >
      <div className={`grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_340px] ${telaCheia ? 'h-full' : ''}`}>
        {/* ======================= CENA 3D ======================= */}
        <div className={`relative w-full ${telaCheia ? 'h-[60vh] lg:h-full' : 'h-[440px] sm:h-[580px]'}`}>
          <Canvas
            frameloop={visivel ? 'always' : 'never'}
            dpr={alta ? [1, 2] : [1, 1.25]}
            camera={{ position: POS_INICIAL, fov: 40, near: 0.1, far: 60 }}
            gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
            onPointerMissed={() => setSelecionada(null)}
            aria-label="Gabinete gamer em 3D. Arraste para girar, role para aproximar, clique numa peça para ver o que ela faz e clique duas vezes para aproximar dela."
          >
            <VivoCtx.Provider value={vivo}>
              <color attach="background" args={[corFundo]} />
              <fog attach="fog" args={[corFundo, 9, 22]} />
              <PerformanceMonitor
                onDecline={() => {
                  if (!qualidadeEscolhida.current) setQualidade('leve');
                }}
              />
              <Captura alvo={tres} />
              <EntradaCamera voo={voo} destino={POS_INICIAL} reduzir={reduzir} />
              <CameraTermica ativa={termica} fontes={fontes} />

              <ambientLight intensity={isEstudio ? 0.35 : 0.12} />
              <directionalLight position={[-5, 8, 6]} intensity={isEstudio ? 1.4 : 0.7} />
              <directionalLight position={[6, 3, -4]} intensity={isEstudio ? 0.5 : 0.25} color="#dbe4ff" />

              <Suspense fallback={null}>
                <Environment resolution={alta ? 256 : 128} frames={1} environmentIntensity={isEstudio ? 0.9 : 0.35}>
                  <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, 0]} scale={[10, 4, 1]} rotation-x={Math.PI / 2} />
                  <Lightformer form="rect" intensity={2.2} color="#f1f4f8" position={[-6, 1.5, 2]} scale={[4, 6, 1]} rotation-y={Math.PI / 2} />
                  <Lightformer form="rect" intensity={1.6} color="#dfe6ee" position={[6, 1, -2]} scale={[4, 5, 1]} rotation-y={-Math.PI / 2} />
                  <Lightformer form="rect" intensity={5} color="#ffffff" position={[-2.5, 2, 6]} scale={[0.5, 7, 1]} rotation-z={0.5} />
                  <Lightformer form="rect" intensity={3} color="#ffffff" position={[2, 2.5, 6]} scale={[0.25, 7, 1]} rotation-z={-0.4} />
                  <Lightformer form="ring" intensity={2} color="#ffe1c7" position={[0, -3, 5]} scale={2} />
                </Environment>
              </Suspense>

              <Selection>
                <ModeloGabinete
                  config={config}
                  montadas={montadas}
                  corLedHex={corAtiva.hex}
                  isRainbow={corAtiva.isRainbow}
                  ledLigado={ledLigado}
                  efeitoLed={efeitoLed}
                  brilho={brilho}
                  antigravidade={antigravidade}
                  reduzir={reduzir}
                  destaque={destaque}
                  mostrarNomes={mostrarNomes}
                  termico={termica}
                  arrastandoId={arrastandoId}
                  pertoDoSlot={pertoDoSlot}
                  slotCompativel={validacaoSlotAtual.ok}
                  aoIniciarArraste={iniciarArraste}
                  aoAtualizarProximidade={setPertoDoSlot}
                  aoFinalizarArraste={finalizarArraste}
                  registrar={registrar}
                  aoClicar={(id) => setSelecionada((s) => (s === id ? null : id))}
                  aoFocar={(id) => {
                    setSelecionada(id);
                    focar(id);
                  }}
                  aoPassar={setSobre}
                />
                <FluxoDeAr ativo={fluxoAr && !termica} frontais={montadas.has('fans-frontais')} inferiores={montadas.has('fans-inferiores')} reduzir={reduzir} />

                <EffectComposer multisampling={0} enableNormalPass={false} autoClear={false}>
                  {alta ? <N8AO aoRadius={0.35} intensity={2.2} distanceFalloff={0.8} halfRes quality="medium" /> : <></>}
                  <Outline blur edgeStrength={5} visibleEdgeColor={0xff6a13} hiddenEdgeColor={0x9a3a10} xRay />
                  <Bloom mipmapBlur intensity={alta ? 0.9 : 0.7} luminanceThreshold={0.95} luminanceSmoothing={0.2} radius={0.7} />
                  <Vignette eskil={false} offset={0.3} darkness={termica ? 0.75 : isEstudio ? 0.32 : 0.6} />
                  <ToneMapping mode={ToneMappingMode.NEUTRAL} />
                  <SMAA />
                </EffectComposer>
              </Selection>

              {/* a sombra só é recalculada enquanto algo se mexe (peças entrando, saindo ou flutuando) */}
              <ContactShadows
                key={sombraViva ? 'viva' : `parada-${versaoCena}`}
                position={[0, -1.7, 0]}
                scale={7}
                blur={2.6}
                far={3.2}
                opacity={isEstudio ? 0.6 : 0.85}
                resolution={alta ? 512 : 256}
                frames={sombraViva ? Infinity : 1}
                color="#000000"
              />
              <Palco escuro={!isEstudio} alta={alta} />

              <OrbitControls
                makeDefault
                enabled={!arrastandoId}
                enableDamping
                dampingFactor={0.06}
                minDistance={1.6}
                maxDistance={antigravidade ? 10 : 9}
                maxPolarAngle={Math.PI / 2 + 0.06}
                autoRotate={girar && !reduzir && !arrastandoId}
                autoRotateSpeed={0.7}
              />
              <DiretorCamera voo={voo} />
            </VivoCtx.Provider>
          </Canvas>

          {/* topo: peça sob o cursor / arrastada + temperaturas */}
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[rgba(15,17,21,0.85)] px-3.5 py-1.5 text-white backdrop-blur-[12px]" aria-live="polite">
              {arrastandoId ? (
                <>
                  <span className="block truncate text-[0.8rem] font-bold leading-tight text-[var(--violet)]">
                    Arrastando: {DEF[arrastandoId].nome} ({config.modelos[arrastandoId]})
                  </span>
                  <span className="block truncate text-[0.68rem] text-white/75">
                    {!validacaoSlotAtual.ok
                      ? validacaoSlotAtual.motivo
                      : pertoDoSlot
                      ? `Solte agora para encaixar em ${DEF[arrastandoId].nomeSlot}`
                      : `Leve até o guia luminoso de ${DEF[arrastandoId].nomeSlot}`}
                  </span>
                </>
              ) : destaque ? (
                <>
                  <span className="block truncate text-[0.8rem] font-bold leading-tight">{DEF[destaque].nome}</span>
                  <span className="block truncate text-[0.68rem] text-white/60">{config.modelos[destaque]}</span>
                </>
              ) : (
                <>
                  <span className="block text-[0.8rem] font-bold leading-tight">Arraste peças ao slot ou clique</span>
                  <span className="hidden text-[0.68rem] text-white/60 sm:block">Arraste o fundo para girar · Arraste uma peça para montar/desmontar</span>
                </>
              )}
            </div>
            <div className="flex shrink-0 items-start gap-1.5">
              <Termometro rotulo="CPU" leitura={temps.cpu} />
              <Termometro rotulo="GPU" leitura={temps.gpu} />
            </div>
          </div>

          {/* visor da câmera térmica: cantos do visor, mira, régua e leituras */}
          {termica && (
            <div className="pointer-events-none absolute inset-0" aria-live="polite">
              {[
                'left-4 top-[74px] border-l-2 border-t-2',
                'right-4 top-[74px] border-r-2 border-t-2',
                'left-4 bottom-[58px] border-b-2 border-l-2',
                'right-4 bottom-[58px] border-b-2 border-r-2',
              ].map((c) => (
                <span key={c} className={`absolute h-6 w-6 border-white/70 ${c}`} />
              ))}
              <span className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-white/60" />
              <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-white/60" />
              <div className="absolute right-6 top-1/2 flex -translate-y-1/2 items-stretch gap-1.5">
                <div className="flex flex-col justify-between py-0.5 text-right text-[0.62rem] font-semibold text-white/80 tnum">
                  <span>{TEMP_MAX} °C</span>
                  <span>{(TEMP_MAX + TEMP_MIN) / 2} °C</span>
                  <span>{TEMP_MIN} °C</span>
                </div>
                <div className="h-32 w-2 rounded-full sm:h-44 ring-1 ring-white/30" style={{ background: `linear-gradient(0deg, ${PALETA_TERMICA.join(', ')})` }} />
              </div>
              <div className="absolute left-1/2 top-[74px] -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/55 px-3 py-1 text-[0.68rem] text-white backdrop-blur-[6px] sm:text-[0.72rem]">
                <span className="hidden font-semibold sm:inline">Câmera térmica</span>
                <span className="tnum text-white/75 sm:ml-3">máx. {leituraTermica.max} °C</span>
                <span className="tnum ml-2 text-white/75">mín. {leituraTermica.min} °C</span>
              </div>
            </div>
          )}

          {/* aviso de peças que saíram/voltaram juntas */}
          {aviso && (
            <div className="pointer-events-none absolute inset-x-3 bottom-14 flex justify-center">
              <p className="max-w-[460px] rounded-xl border border-[var(--violet)]/40 bg-[rgba(15,17,21,0.92)] px-3 py-2 text-center text-[0.76rem] leading-snug text-white backdrop-blur-[12px]">
                {aviso}
              </p>
            </div>
          )}

          {/* legenda do fluxo de ar */}
          {fluxoAr && (
            <div className="pointer-events-none absolute right-3 top-[64px] rounded-xl border border-white/10 bg-[rgba(15,17,21,0.85)] px-2.5 py-1.5 text-[0.68rem] text-white/80 backdrop-blur-[10px]">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-400" /> ar frio entra
              <span className="ml-2 mr-1 inline-block h-2 w-2 rounded-full bg-orange-500" /> ar quente sai
            </div>
          )}

          {/* rodapé: ângulos da câmera à esquerda, ferramentas à direita */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-1.5">
            <div className="pointer-events-auto flex rounded-xl border border-white/10 bg-[rgba(12,14,18,0.82)] p-0.5 backdrop-blur-[10px]" role="group" aria-label="Ângulos da câmera">
              {ANGULOS.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => voarPara(a.pos, a.alvo)}
                  title={`${a.rotulo} (tecla ${i + 1})`}
                  className="rounded-[10px] px-2.5 py-1 text-[0.72rem] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {a.rotulo}
                </button>
              ))}
            </div>
            <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/10 bg-[rgba(12,14,18,0.82)] p-0.5 backdrop-blur-[10px]">
              <button
                type="button"
                onClick={() => setTermica((v) => !v)}
                aria-pressed={termica}
                title="Câmera térmica (tecla T)"
                className={`flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 text-[0.72rem] font-semibold transition-colors ${
                  termica ? 'bg-[var(--violet)] text-[#111]' : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icone nome="termica" />
                <span>Térmica</span>
              </button>
              <button
                type="button"
                onClick={capturar}
                title="Salvar foto da cena"
                aria-label="Salvar foto da cena"
                className="rounded-[10px] p-1.5 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icone nome="foto" />
              </button>
              {podeTelaCheia && (
                <button
                  type="button"
                  onClick={alternarTelaCheia}
                  title={telaCheia ? 'Sair da tela cheia (tecla F)' : 'Tela cheia (tecla F)'}
                  aria-label={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}
                  className="rounded-[10px] p-1.5 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icone nome={telaCheia ? 'recolher' : 'expandir'} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ======================= PAINEL ======================= */}
        <aside
          ref={painelRef}
          className={`flex flex-col gap-3 border-t border-white/10 p-4 text-white lg:overflow-y-auto lg:border-l lg:border-t-0 ${
            telaCheia ? 'overflow-y-auto lg:max-h-none' : 'lg:max-h-[580px]'
          }`}
        >
          <div>
            <p className="display text-[1.02rem] font-bold leading-tight text-white">{tituloNivel}</p>
            {restoNivel.length > 0 && <p className="mt-1 text-[0.78rem] leading-snug text-white/60">{restoNivel.join(' — ')}</p>}
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.05] p-1" role="tablist" aria-label="Controles do 3D">
            {(
              [
                ['pecas', 'Peças'],
                ['luz', 'LED'],
                ['visao', 'Visualizar'],
              ] as const
            ).map(([id, rotulo]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={aba === id}
                onClick={() => setAba(id)}
                className={`rounded-lg px-2 py-1.5 text-[0.76rem] font-semibold transition-colors ${
                  aba === id ? 'bg-[var(--violet)] text-[#111]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {rotulo}
              </button>
            ))}
          </div>

          {/* -------- Aba: Peças -------- */}
          {aba === 'pecas' && (
            <>
              {info && (
                <div className="rounded-2xl border border-[var(--violet)]/50 bg-[var(--violet)]/10 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[0.9rem] font-bold">{info.nome}</span>
                      <span className="block truncate text-[0.72rem] text-white/60">{config.modelos[info.id]}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelecionada(null)}
                      className="rounded-lg px-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                      aria-label="Fechar detalhes da peça"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-[0.78rem] leading-relaxed text-white/80">{info.explicacao}</p>

                  {MAPA_PECA_CATEGORIA[info.id] && (
                    <label className="mt-2.5 block">
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-wider text-white/65">
                        Modelo da peça (testar encaixe no slot):
                      </span>
                      <select
                        aria-label={`Escolher modelo de ${info.nome}`}
                        value={config.selecao[MAPA_PECA_CATEGORIA[info.id]!]?.id ?? ''}
                        onChange={(e) => {
                          const cat = MAPA_PECA_CATEGORIA[info.id]!;
                          const novaPeca = buscarPecaPorId(e.target.value);
                          if (!novaPeca) return;
                          const novaSelecao = { ...config.selecao, [cat]: novaPeca };
                          setOverrides((prev) => ({ ...prev, [cat]: novaPeca }));
                          // Se a peça já está montada, valida se o novo modelo é compatível com o slot; se não for, move para a bancada 3D
                          if (montadas.has(info.id)) {
                            const check = validarEncaixe3D(info.id, montadas, novaSelecao);
                            if (!check.ok) {
                              setMontadas((atual) => {
                                const n = new Set(atual);
                                n.delete(info.id);
                                dependentes(info.id).forEach((d) => n.delete(d));
                                return n;
                              });
                              setAviso(`${novaPeca.nomeCurto} foi colocado na bancada 3D: ${check.motivo}`);
                            } else {
                              setAviso(`✓ ${novaPeca.nomeCurto} encaixado em ${info.nomeSlot}.`);
                            }
                          } else {
                            setAviso(`${novaPeca.nomeCurto} pronto na bancada 3D. Arraste-o até ${info.nomeSlot}!`);
                          }
                        }}
                        className="mt-1 w-full rounded-lg border border-white/15 bg-[#12151c] px-2 py-1.5 text-[0.74rem] text-white focus:border-[var(--violet)] focus:outline-none"
                      >
                        {CATALOGO_PECAS[MAPA_PECA_CATEGORIA[info.id]!].map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nomeCurto} ({item.resumoSpecs})
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => alternar(info.id)}
                      className="rounded-xl bg-[var(--violet)] px-3 py-1.5 text-[0.78rem] font-bold text-[#111] transition-opacity hover:opacity-90"
                    >
                      {montadas.has(info.id) ? 'Retirar à bancada' : 'Encaixar no slot'}
                    </button>
                    <button
                      type="button"
                      onClick={() => focar(info.id)}
                      disabled={!montadas.has(info.id) && !info.arrastavel}
                      className="rounded-xl border border-white/20 px-3 py-1.5 text-[0.78rem] font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-40"
                    >
                      Aproximar
                    </button>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[0.78rem] font-semibold text-white/60">Peças (arraste em 3D ao slot)</span>
                  <span className="tnum text-[0.72rem] text-white/55">
                    {qtdMontadas} de {PECAS.length} montadas
                  </span>
                </div>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
                  {PECAS.map((p) => {
                    const dentro = montadas.has(p.id);
                    const sel = selecionada === p.id;
                    return (
                      <li key={p.id}>
                        <div
                          className={`flex items-center gap-2 rounded-xl border px-2 py-1 transition-colors ${
                            sel ? 'border-[var(--violet)]/60 bg-white/[0.06]' : 'border-transparent hover:bg-white/[0.04]'
                          }`}
                          onMouseEnter={() => setSobre(p.id)}
                          onMouseLeave={() => setSobre(null)}
                        >
                          {p.arrastavel && (
                            <button
                              type="button"
                              onPointerDown={(e) => {
                                e.preventDefault();
                                iniciarArraste(p.id);
                              }}
                              title={`Arrastar ${p.nome.toLowerCase()} até ${p.nomeSlot}`}
                              aria-label={`Arrastar ${p.nome.toLowerCase()}`}
                              className="cursor-grab rounded px-1 text-[0.78rem] text-white/45 hover:bg-white/10 hover:text-[var(--violet)] active:cursor-grabbing"
                            >
                              ⠿
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelecionada(sel ? null : p.id)}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            aria-pressed={sel}
                          >
                            <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${dentro ? 'bg-emerald-400' : 'bg-amber-400/70'}`} />
                            <span className={`min-w-0 truncate text-[0.8rem] ${dentro ? 'text-white' : 'text-white/55'}`}>
                              {p.nome}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alternar(p.id)}
                            aria-label={`${dentro ? 'Retirar' : 'Colocar'} ${p.nome.toLowerCase()}`}
                            className={`shrink-0 rounded-lg border px-2 py-0.5 text-[0.7rem] font-semibold transition-colors ${
                              dentro
                                ? 'border-white/15 text-white/75 hover:border-red-400/60 hover:text-red-300'
                                : 'border-[var(--violet)]/60 text-[var(--violet)] hover:bg-[var(--violet)] hover:text-[#111]'
                            }`}
                          >
                            {dentro ? 'Retirar' : 'Encaixar'}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMontadas(new Set<PecaId>(['placa-mae']));
                      setAviso('Peças movidas para a bancada 3D! Arraste o processador, a RAM, o SSD e a placa de vídeo até seus slots na placa-mãe.');
                    }}
                    disabled={qtdMontadas <= 1}
                    className="rounded-xl border border-white/15 px-2 py-1.5 text-[0.74rem] font-semibold text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
                  >
                    Desmontar p/ bancada
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOverrides({});
                      setMontadas(new Set(TODAS));
                      setAviso('Todas as peças originais foram encaixadas nos seus slots.');
                    }}
                    disabled={qtdMontadas === PECAS.length && Object.keys(overrides).length === 0}
                    className="rounded-xl border border-white/15 px-2 py-1.5 text-[0.74rem] font-semibold text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
                  >
                    Montar tudo
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const selMontador = montagem.atual().selecao;
                    if (quantidadeEscolhida(selMontador) === 0) {
                      setAviso('Você ainda não selecionou peças na aba "Montar PC". Escolha peças lá ou troque o modelo clicando numa peça acima.');
                      return;
                    }
                    const parcial: Partial<Selecao> = {};
                    (Object.keys(selMontador) as (keyof Selecao)[]).forEach((k) => {
                      if (selMontador[k]) parcial[k] = selMontador[k]!;
                    });
                    setOverrides(parcial);
                    setAviso('Peças sincronizadas com a sua montagem ativa da aba "Montar PC"!');
                  }}
                  className="mt-1.5 w-full rounded-xl border border-[var(--violet)]/40 bg-[var(--violet)]/10 px-2.5 py-1.5 text-[0.73rem] font-semibold text-[var(--violet)] transition-colors hover:bg-[var(--violet)]/20"
                >
                  Sincronizar peças da aba &ldquo;Montar PC&rdquo;
                </button>
              </div>
            </>
          )}

          {/* -------- Aba: LED -------- */}
          {aba === 'luz' && (
            <div className="grid gap-2">
              <Interruptor
                ligado={ledLigado}
                aoMudar={setLedLigado}
                rotulo={ledLigado ? 'LED ligado' : 'LED desligado'}
                descricao="Fans, memória, placa de vídeo, water cooler e fita do gabinete"
              />
              <div className={`grid gap-2 transition-opacity ${ledLigado ? '' : 'pointer-events-none opacity-35'}`} aria-disabled={!ledLigado}>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  <span className="text-[0.82rem] font-semibold">Cor</span>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {CORES_LED.map((c) => {
                      const ativa = corAtiva.id === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          title={`${c.nome} — ${c.subtitulo}`}
                          aria-label={c.nome}
                          aria-pressed={ativa}
                          tabIndex={ledLigado ? 0 : -1}
                          onClick={() => setCorAtiva(c)}
                          className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${
                            ativa ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0c0e12]' : 'opacity-85 hover:opacity-100'
                          }`}
                          style={{ background: c.isRainbow ? 'linear-gradient(135deg, #ff0000, #ff8800, #00e5ff, #9d4edd, #ff00aa)' : c.hex }}
                        />
                      );
                    })}
                  </div>
                  <span className="mt-2 block text-[0.76rem] font-semibold text-white/85">{corAtiva.nome}</span>
                  <span className="block text-[0.7rem] text-white/50">{corAtiva.subtitulo}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  <span className="text-[0.82rem] font-semibold">Efeito</span>
                  <div className="mt-1.5 grid grid-cols-3 gap-1">
                    {EFEITOS_LED.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        aria-pressed={efeitoLed === e.id}
                        tabIndex={ledLigado ? 0 : -1}
                        onClick={() => setEfeitoLed(e.id)}
                        className={`rounded-lg border px-2 py-1 text-[0.74rem] font-semibold transition-colors ${
                          efeitoLed === e.id ? 'border-[var(--violet)] bg-[var(--violet)]/15 text-white' : 'border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {e.nome}
                      </button>
                    ))}
                  </div>
                </div>
                <Deslizante rotulo="Brilho" valor={brilho} aoMudar={setBrilho} min={0.2} max={1} texto={`${Math.round(brilho * 100)}%`} desativado={!ledLigado} />
              </div>
            </div>
          )}

          {/* -------- Aba: Visualizar -------- */}
          {aba === 'visao' && (
            <div className="grid gap-2">
              <Interruptor ligado={fluxoAr} aoMudar={setFluxoAr} rotulo="Fluxo de ar" descricao="Mostra o ar frio entrando pelas ventoinhas e o ar quente saindo pelo teto" />
              <Deslizante
                rotulo="Rotação das ventoinhas"
                valor={rotacao}
                aoMudar={setRotacao}
                texto={rotacao === 0 ? 'paradas' : `≈ ${rpmDe(rotacao).toLocaleString('pt-BR')} RPM`}
              />
              <p className="-mt-1 px-1 text-[0.68rem] leading-snug text-white/50">
                As temperaturas no topo da cena são estimativas ilustrativas: tire o cooler ou as ventoinhas e veja o que acontece.
              </p>
              <Interruptor ligado={mostrarNomes} aoMudar={setMostrarNomes} rotulo="Nomes das peças" descricao="Etiquetas sobre cada peça montada" />
              <Interruptor ligado={antigravidade} aoMudar={setAntigravidade} rotulo="Modo antigravidade" descricao="As peças se soltam e flutuam para você ver cada uma separada" />
              <Interruptor ligado={girar} aoMudar={setGirar} rotulo="Girar sozinho" descricao="A câmera dá a volta no gabinete devagar" />
              <Interruptor
                ligado={!isEstudio}
                aoMudar={(v) => setTemaFundo(v ? 'dark' : 'estudio')}
                rotulo={isEstudio ? 'Fundo claro (estúdio)' : 'Fundo escuro (arena)'}
                descricao="O fundo escuro destaca o LED"
              />
              <Interruptor
                ligado={alta}
                aoMudar={(v) => {
                  qualidadeEscolhida.current = true;
                  setQualidade(v ? 'alta' : 'leve');
                }}
                rotulo={alta ? 'Qualidade alta' : 'Qualidade leve'}
                descricao={alta ? 'Sombras em tempo real e oclusão de ambiente' : 'Mais leve para notebooks e celulares'}
              />
            </div>
          )}
          <dl className="mt-auto grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-1 border-t border-white/10 pt-3 text-[0.7rem] text-white/55">
            {(
              [
                ['1–4', 'ângulos da câmera'],
                ['T', 'câmera térmica'],
                ['L', 'liga ou desliga o LED'],
                ['N', 'nomes das peças'],
                ...(podeTelaCheia ? ([['F', 'tela cheia']] as const) : []),
              ] as const
            ).map(([tecla, acao]) => (
              <div key={tecla} className="contents">
                <dt>
                  <kbd className="tnum inline-block min-w-[1.6rem] rounded-md border border-white/20 bg-white/[0.06] px-1.5 py-px text-center text-[0.66rem] font-semibold text-white/80">
                    {tecla}
                  </kbd>
                </dt>
                <dd>{acao}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}
