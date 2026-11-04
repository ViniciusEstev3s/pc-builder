/**
 * Dados do visualizador 3D do PC Gamer: peças removíveis, dependências de encaixe,
 * configuração de cada nível e estimativa ilustrativa de temperatura.
 */
import { PCS_GAMER } from '@/lib/konoha/pcs-prontos';
import { avaliarCompatibilidadePeca } from '@/lib/konoha/compatibilidade';
import type { Peca, Selecao } from '@/lib/konoha/tipos';
import { selecaoDoPc } from '@/lib/montagem';

export type TierType = 'gamer-entrada' | 'gamer-intermediario' | 'gamer-avancado';

export interface CorChakra {
  id: string;
  nome: string;
  subtitulo: string;
  hex: string;
  isRainbow?: boolean;
}

export const CORES_LED: CorChakra[] = [
  { id: 'laranja', nome: 'Laranja Chakra', subtitulo: 'Konoha / Naruto', hex: '#ff6b00' },
  { id: 'ambar', nome: 'Âmbar Kyuubi', subtitulo: 'Modo Kurama', hex: '#ff9900' },
  { id: 'vermelho', nome: 'Vermelho Sharingan', subtitulo: 'Clã Uchiha / Mangekyo', hex: '#ff1744' },
  { id: 'roxo', nome: 'Roxo Susanoo', subtitulo: 'Sasuke / Rinnegan', hex: '#9d4edd' },
  { id: 'ciano', nome: 'Ciano Raio', subtitulo: 'Chidori / Kakashi', hex: '#00e5ff' },
  { id: 'azul', nome: 'Azul Rasengan', subtitulo: 'Chakra Espiral Puro', hex: '#0070f3' },
  { id: 'verde', nome: 'Verde Médico', subtitulo: 'Tsunade / Sakura', hex: '#00e676' },
  { id: 'dourado', nome: 'Dourado Rikudou', subtitulo: 'Sábio Seis Caminhos', hex: '#ffd000' },
  { id: 'rosa', nome: 'Rosa Sakura', subtitulo: 'Flores de Cerejeira', hex: '#ff4081' },
  { id: 'branco', nome: 'Branco Byakugan', subtitulo: 'Clã Hyuga / Neve', hex: '#ffffff' },
  { id: 'arcoiris', nome: 'Ciclo Chakra RGB', subtitulo: 'Fusão Todas as Naturezas', hex: '#ff00aa', isRainbow: true },
];

export type EfeitoLed = 'fixo' | 'respirar' | 'pulso';

export const EFEITOS_LED: { id: EfeitoLed; nome: string }[] = [
  { id: 'fixo', nome: 'Fixo' },
  { id: 'respirar', nome: 'Respirar' },
  { id: 'pulso', nome: 'Pulso' },
];

export type V3 = [number, number, number];

export type PecaId =
  | 'vidro'
  | 'placa-mae'
  | 'cpu'
  | 'cooler'
  | 'ram'
  | 'gpu'
  | 'ssd'
  | 'fonte'
  | 'cabos'
  | 'fans-frontais'
  | 'fans-inferiores';

export type DefPeca = {
  id: PecaId;
  nome: string;
  /** Peças sobre as quais esta fica presa (tirar o apoio tira esta junto; colocar esta recoloca o apoio). */
  apoio: PecaId[];
  explicacao: string;
  /** Centro aproximado da peça, usado como pivô da animação. */
  centro: V3;
  /** Direção para onde a peça flutua no modo antigravidade. */
  explode: V3;
  /** Posição da etiqueta com o nome, relativa ao centro. */
  rotulo: V3;
  /** Se a peça pode ser arrastada manualmente e encaixada no slot 3D. */
  arrastavel?: boolean;
  /** Posição de repouso na bancada 3D quando a peça está desmontada. */
  bancadaPos: V3;
  /** Centro visual do slot de encaixe para guia luminoso. */
  slotPos: V3;
  /** Dimensões da caixa de guia do slot [largura, altura, profundidade]. */
  slotTamanho: V3;
  /** Raio de proximidade (unidades 3D) para ativar o snap no slot. */
  raioEncaixe: number;
  /** Nome legível do slot onde a peça encaixa. */
  nomeSlot: string;
};

export const PECAS: DefPeca[] = [
  {
    id: 'vidro',
    nome: 'Vidro lateral',
    apoio: [],
    explicacao: 'Painéis de vidro temperado. Tire para enxergar melhor o interior; com eles no lugar, ainda dá para clicar nas peças.',
    centro: [-0.4, 0, 0.6],
    explode: [-0.9, 0.1, 1.7],
    rotulo: [-0.95, 1.25, 0.45],
    arrastavel: false,
    bancadaPos: [-2.4, 0.0, 1.8],
    slotPos: [-0.4, 0, 0.6],
    slotTamanho: [2.76, 3.0, 0.1],
    raioEncaixe: 0.9,
    nomeSlot: 'Lateral do Gabinete',
  },
  {
    id: 'placa-mae',
    nome: 'Placa-mãe',
    apoio: [],
    explicacao: 'Liga todas as peças entre si. Processador, memória, SSD e placa de vídeo encaixam nela.',
    centro: [-0.35, 0.28, -1.0],
    explode: [0, 0.05, 0.12],
    rotulo: [-0.65, -0.95, 0.05],
    arrastavel: true,
    bancadaPos: [-2.35, -0.25, 0.85],
    slotPos: [-0.35, 0.28, -1.0],
    slotTamanho: [1.82, 2.24, 0.08],
    raioEncaixe: 0.85,
    nomeSlot: 'Bandeja ATX da Placa-mãe',
  },
  {
    id: 'cpu',
    nome: 'Processador',
    apoio: ['placa-mae'],
    explicacao: 'O cérebro do PC: executa os programas e a lógica dos jogos. Fica no soquete, debaixo do cooler.',
    centro: [-0.6, 0.74, -0.97],
    explode: [-0.1, 0.35, 0.55],
    rotulo: [0, -0.28, 0.05],
    arrastavel: true,
    bancadaPos: [-1.65, -1.32, 1.55],
    slotPos: [-0.6, 0.74, -0.97],
    slotTamanho: [0.42, 0.42, 0.08],
    raioEncaixe: 0.65,
    nomeSlot: 'Soquete da CPU',
  },
  {
    id: 'cooler',
    nome: 'Cooler do processador',
    apoio: ['cpu'],
    explicacao: 'Tira o calor do processador. Sem ele, o processador se desliga em segundos para não queimar.',
    centro: [-0.45, 0.95, -0.7],
    explode: [-0.1, -0.25, 1.45],
    rotulo: [-0.15, 0.1, 0.3],
    arrastavel: true,
    bancadaPos: [1.55, -1.12, 1.55],
    slotPos: [-0.6, 0.78, -0.78],
    slotTamanho: [0.54, 0.54, 0.38],
    raioEncaixe: 0.75,
    nomeSlot: 'Suporte do Cooler (sobre a CPU)',
  },
  {
    id: 'ram',
    nome: 'Memória RAM',
    apoio: ['placa-mae'],
    explicacao: 'Memória rápida e temporária para o que está aberto agora. O conteúdo some quando o PC desliga.',
    centro: [-0.1, 0.76, -0.92],
    explode: [0.45, 0.45, 0.9],
    rotulo: [0.15, 0.42, 0.05],
    arrastavel: true,
    bancadaPos: [-0.95, -1.26, 1.55],
    slotPos: [-0.1, 0.76, -0.92],
    slotTamanho: [0.34, 0.74, 0.12],
    raioEncaixe: 0.68,
    nomeSlot: 'Slots DIMM de Memória RAM',
  },
  {
    id: 'gpu',
    nome: 'Placa de vídeo',
    apoio: ['placa-mae'],
    explicacao: 'Desenha as imagens do jogo. Em PC gamer, é a peça que mais pesa no FPS.',
    centro: [-0.4, -0.18, -0.62],
    explode: [0.1, -0.05, 1.6],
    rotulo: [0.1, -0.05, 0.45],
    arrastavel: true,
    bancadaPos: [0.55, -1.28, 1.62],
    slotPos: [-0.4, -0.18, -0.62],
    slotTamanho: [1.45, 0.36, 0.62],
    raioEncaixe: 0.82,
    nomeSlot: 'Slot PCIe x16 Principal',
  },
  {
    id: 'ssd',
    nome: 'SSD NVMe',
    apoio: ['placa-mae'],
    explicacao: 'Guarda o sistema, os jogos e os arquivos, mesmo com o PC desligado. O NVMe encaixa direto na placa-mãe.',
    centro: [-0.32, 0.2, -0.97],
    explode: [-0.55, 0.15, 1.1],
    rotulo: [0, 0.12, 0.05],
    arrastavel: true,
    bancadaPos: [-0.25, -1.38, 1.58],
    slotPos: [-0.32, 0.2, -0.97],
    slotTamanho: [0.58, 0.16, 0.07],
    raioEncaixe: 0.65,
    nomeSlot: 'Slot M.2 NVMe',
  },
  {
    id: 'fonte',
    nome: 'Fonte',
    apoio: [],
    explicacao: 'Converte a energia da tomada e alimenta todas as peças. Fica no porão do gabinete, embaixo da cobertura.',
    centro: [-0.7, -1.24, -0.15],
    explode: [-0.4, -0.15, 1.7],
    rotulo: [0, 0.05, 0.6],
    arrastavel: true,
    bancadaPos: [-2.15, -1.24, 1.35],
    slotPos: [-0.7, -1.24, -0.15],
    slotTamanho: [1.06, 0.54, 1.14],
    raioEncaixe: 0.8,
    nomeSlot: 'Compartimento Inferior da Fonte (PSU)',
  },
  {
    id: 'cabos',
    nome: 'Cabos de energia',
    apoio: ['fonte'],
    explicacao: 'Levam a energia da fonte até a placa-mãe (cabo de 24 pinos e o de 8 pinos do processador) e até a placa de vídeo. Passam por trás da placa-mãe para não atrapalhar o ar.',
    centro: [0.55, 0.2, -0.85],
    explode: [0.7, 0.1, 1.2],
    rotulo: [0.12, 0.35, 0.1],
    arrastavel: false,
    bancadaPos: [2.1, -1.1, 1.2],
    slotPos: [0.55, 0.2, -0.85],
    slotTamanho: [0.5, 1.2, 0.3],
    raioEncaixe: 0.75,
    nomeSlot: 'Conectores ATX 24-pin / EPS / PCIe',
  },
  {
    id: 'fans-frontais',
    nome: 'Ventoinhas frontais',
    apoio: [],
    explicacao: 'Três ventoinhas de 120 mm que puxam ar frio de fora para dentro do gabinete.',
    centro: [1.25, 0.22, -0.1],
    explode: [1.1, 0.05, 0.4],
    rotulo: [-0.15, 1.0, 0.3],
    arrastavel: true,
    bancadaPos: [2.25, -0.45, 1.15],
    slotPos: [1.25, 0.22, -0.1],
    slotTamanho: [0.22, 1.98, 0.68],
    raioEncaixe: 0.8,
    nomeSlot: 'Suporte Lateral/Frontal de 3×120mm',
  },
  {
    id: 'fans-inferiores',
    nome: 'Ventoinhas inferiores',
    apoio: [],
    explicacao: 'Três ventoinhas que empurram ar frio de baixo direto para a placa de vídeo.',
    centro: [0, -0.82, -0.1],
    explode: [0.1, -0.35, 1.2],
    rotulo: [0.4, 0.05, 0.55],
    arrastavel: true,
    bancadaPos: [2.15, -1.35, 0.85],
    slotPos: [0, -0.82, -0.1],
    slotTamanho: [1.98, 0.18, 0.68],
    raioEncaixe: 0.8,
    nomeSlot: 'Base Inferior de 3×120mm',
  },
];

export const DEF = Object.fromEntries(PECAS.map((p) => [p.id, p])) as Record<PecaId, DefPeca>;
export const TODAS: PecaId[] = PECAS.map((p) => p.id);

/** Tudo que sai junto quando `id` sai (as peças presas nele, em cadeia). */
export function dependentes(id: PecaId): PecaId[] {
  const fora: PecaId[] = [];
  const visitar = (alvo: PecaId) => {
    for (const p of PECAS) {
      if (p.apoio.includes(alvo) && !fora.includes(p.id)) {
        fora.push(p.id);
        visitar(p.id);
      }
    }
  };
  visitar(id);
  return fora;
}

/** Tudo que precisa voltar para `id` poder voltar (os apoios, em cadeia). */
export function apoiosDe(id: PecaId): PecaId[] {
  const lista: PecaId[] = [];
  const visitar = (alvo: PecaId) => {
    for (const a of DEF[alvo].apoio) {
      if (!lista.includes(a)) {
        lista.push(a);
        visitar(a);
      }
    }
  };
  visitar(id);
  return lista;
}

export function listarNomes(ids: PecaId[]) {
  const nomes = ids.map((i) => DEF[i].nome.toLowerCase());
  if (nomes.length <= 1) return nomes.join('');
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

/** Mapeia o ID da peça 3D para a categoria correspondente do catálogo. */
export const MAPA_PECA_CATEGORIA: Partial<Record<PecaId, keyof Selecao>> = {
  'placa-mae': 'placamae',
  cpu: 'cpu',
  cooler: 'cooler',
  ram: 'ram',
  gpu: 'gpu',
  ssd: 'armazenamento',
  fonte: 'fonte',
};

/**
 * Valida se uma peça arrastada em 3D pode ser encaixada no seu slot atual,
 * verificando tanto pré-requisitos físicos (ex.: placa-mãe antes de CPU/RAM/GPU/SSD)
 * quanto compatibilidade técnica de hardware (soquete, DDR4/DDR5, TDP, dimensões).
 */
export function validarEncaixe3D(
  id: PecaId,
  montadas: Set<PecaId>,
  selecaoAtiva: Selecao,
): { ok: boolean; motivo: string } {
  const def = DEF[id];
  // 1. Verifica apoios físicos diretos (ex.: placa-mãe precisa estar no gabinete antes de encaixar CPU, RAM, GPU, SSD; CPU antes de Cooler)
  const apoiosFaltantes = def.apoio.filter((a) => !montadas.has(a));
  if (apoiosFaltantes.length > 0) {
    return {
      ok: false,
      motivo: `Encaixe recusado: instale ${listarNomes(apoiosFaltantes)} antes de encaixar ${def.nome.toLowerCase()} em "${def.nomeSlot}".`,
    };
  }

  // 2. Verifica compatibilidade técnica entre a peça candidata e as peças já montadas no gabinete 3D
  const cat = MAPA_PECA_CATEGORIA[id];
  if (cat && selecaoAtiva[cat]) {
    const candidata: Peca = selecaoAtiva[cat]!;
    if (id === 'gpu' && candidata.requerVideoIntegradoCpu) {
      return {
        ok: false,
        motivo: 'Você selecionou "Vídeo Integrado (iGPU)". Escolha uma placa de vídeo dedicada para encaixar no slot PCIe x16.',
      };
    }

    const selecaoMontada: Selecao = {
      cpu: montadas.has('cpu') ? selecaoAtiva.cpu : null,
      placamae: montadas.has('placa-mae') ? selecaoAtiva.placamae : null,
      ram: montadas.has('ram') ? selecaoAtiva.ram : null,
      gpu: montadas.has('gpu') ? selecaoAtiva.gpu : null,
      armazenamento: montadas.has('ssd') ? selecaoAtiva.armazenamento : null,
      fonte: montadas.has('fonte') ? selecaoAtiva.fonte : null,
      gabinete: selecaoAtiva.gabinete,
      cooler: montadas.has('cooler') ? selecaoAtiva.cooler : null,
    };

    const aval = avaliarCompatibilidadePeca(candidata, selecaoMontada);
    if (!aval.compativel && aval.motivos.length > 0) {
      return {
        ok: false,
        motivo: `Peça incompatível com o slot: ${aval.motivos[0]}`,
      };
    }
  }

  return {
    ok: true,
    motivo: `${def.nome} encaixado em ${def.nomeSlot}.`,
  };
}

/* ---------------------------------------------------------------------------
   Níveis (lidos do preset 3D de cada PC pronto + overrides de peças)
   --------------------------------------------------------------------------- */

export type TipoCooler = 'air-compact' | 'air-tower' | 'water-240';
export type TamanhoGpu = 'dual-fan' | 'triple-fan';

export type ConfigNivel = {
  tier: TierType;
  rotulo: string;
  tipoCooler: TipoCooler;
  tamanhoGpu: TamanhoGpu;
  ramRgb: boolean;
  /** Cor do selo 80 Plus da fonte (bronze ou gold). */
  seloFonte: string;
  modelos: Record<PecaId, string>;
  selecao: Selecao;
};

export function configDoNivel(tier: TierType, overrides?: Partial<Selecao>): ConfigNivel {
  const pc = PCS_GAMER.find((p) => p.id === tier) ?? PCS_GAMER[0];
  const preset = (pc.preset3D ?? {}) as { labelNivel?: string; tipoCooler?: TipoCooler; tamanhoGpu?: TamanhoGpu };
  const baseSelecao = selecaoDoPc(pc);
  const s: Selecao = { ...baseSelecao, ...(overrides ?? {}) };
  const nome = (p: { nomeCurto?: string; nome?: string } | null) => p?.nomeCurto ?? p?.nome ?? '';
  const fonte = nome(s.fonte);

  let tipoCooler: TipoCooler = preset.tipoCooler ?? 'air-tower';
  if (s.cooler) {
    if (/water|liquid|kraken|galahad|nautilus|ls720|ml/i.test(s.cooler.nome)) tipoCooler = 'water-240';
    else if (s.cooler.id === 'cooler-box-padrao' || Number(s.cooler.tdpMaximoWatts ?? 200) <= 95) tipoCooler = 'air-compact';
    else tipoCooler = 'air-tower';
  }

  let tamanhoGpu: TamanhoGpu = preset.tamanhoGpu ?? 'dual-fan';
  if (s.gpu) {
    tamanhoGpu = Number(s.gpu.comprimentoMm ?? 240) >= 260 ? 'triple-fan' : 'dual-fan';
  }

  const ramRgb = s.ram ? s.ram.tipoRam === 'DDR5' || Number(s.ram.capacidadeGb ?? 16) >= 32 : tier !== 'gamer-entrada';

  return {
    tier,
    rotulo: preset.labelNivel ?? pc.tituloCard,
    tipoCooler,
    tamanhoGpu,
    ramRgb,
    seloFonte: /gold|platinum|titanium/i.test(`${fonte} ${s.fonte?.nome ?? ''}`) ? '#d4af37' : '#b87333',
    modelos: {
      vidro: `${nome(s.gabinete)} · vidro temperado`,
      'placa-mae': nome(s.placamae),
      cpu: nome(s.cpu),
      cooler: nome(s.cooler),
      ram: nome(s.ram),
      gpu: nome(s.gpu),
      ssd: nome(s.armazenamento),
      fonte,
      cabos: '24 pinos · 8 pinos CPU · PCIe',
      'fans-frontais': '3 × 120 mm ARGB',
      'fans-inferiores': '3 × 120 mm ARGB',
    },
    selecao: s,
  };
}

/* ---------------------------------------------------------------------------
   Temperatura estimada (ilustrativa, para mostrar o efeito de cada peça)
   --------------------------------------------------------------------------- */

export type LeituraTemp = { valor: number | null; texto: string; alerta?: string; nivel: 'ok' | 'morno' | 'quente' | 'critico' | 'off' };

function classificar(c: number): LeituraTemp['nivel'] {
  if (c >= 90) return 'critico';
  if (c >= 80) return 'quente';
  if (c >= 70) return 'morno';
  return 'ok';
}

/** `rotacao` vai de 0 (paradas) a 1 (máximo); 0,6 é o padrão. */
export function estimarTemperaturas(config: ConfigNivel, montadas: Set<PecaId>, rotacao: number) {
  const tem = (id: PecaId) => montadas.has(id);
  const semEnergia = !tem('fonte') || !tem('cabos');
  const fluxo = (tem('fans-frontais') ? 0.6 : 0) + (tem('fans-inferiores') ? 0.4 : 0);

  let cpu: LeituraTemp;
  if (!tem('cpu')) cpu = { valor: null, texto: '—', nivel: 'off', alerta: 'Sem processador' };
  else if (semEnergia) cpu = { valor: null, texto: 'desligado', nivel: 'off', alerta: 'Sem energia' };
  else if (!tem('cooler')) cpu = { valor: 100, texto: '100 °C+', nivel: 'critico', alerta: 'Sem cooler: desliga em segundos' };
  else {
    const base = { 'air-compact': 76, 'air-tower': 66, 'water-240': 60 }[config.tipoCooler];
    const c = Math.round(base + (1 - fluxo) * 9 + (0.6 - rotacao) * 14);
    cpu = { valor: c, texto: `${c} °C`, nivel: classificar(c) };
  }

  let gpu: LeituraTemp;
  if (!tem('gpu')) gpu = { valor: null, texto: '—', nivel: 'off', alerta: 'Sem placa de vídeo' };
  else if (semEnergia) gpu = { valor: null, texto: 'desligada', nivel: 'off', alerta: 'Sem energia' };
  else {
    const base = { 'gamer-entrada': 71, 'gamer-intermediario': 66, 'gamer-avancado': 64 }[config.tier];
    const c = Math.round(base + (tem('fans-inferiores') ? 0 : 9) + (tem('fans-frontais') ? 0 : 5) + (0.6 - rotacao) * 12);
    gpu = { valor: c, texto: `${c} °C`, nivel: classificar(c) };
  }

  return { cpu, gpu };
}

/** RPM aproximado das ventoinhas de gabinete para a rotação escolhida. */
export function rpmDe(rotacao: number) {
  return Math.round((rotacao * 1800) / 50) * 50;
}
