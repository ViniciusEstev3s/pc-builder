'use client';
import { useSyncExternalStore } from 'react';

export type PatenteNinja =
  | 'ESTUDANTE'
  | 'GENIN'
  | 'CHUNIN'
  | 'JONIN'
  | 'ANBU'
  | 'SANNIN'
  | 'KAGE'
  | 'HOKAGE';

export type Patente = PatenteNinja;

export interface InfoPatente {
  nivel: number;
  id: PatenteNinja;
  patente: PatenteNinja;
  nome: string;
  rotulo: string;
  emoji: string;
  cor: string;
  bgGradiente: string;
  borderCor: string;
  xpMinimo: number;
  xpProximo: number;
  descricao: string;
  requisito: string;
  mensagemVitoria: string;
}

export const NIVEIS_NINJA: InfoPatente[] = [
  {
    nivel: 1,
    id: 'ESTUDANTE',
    patente: 'ESTUDANTE',
    nome: 'Estudante da Academia',
    rotulo: 'Iniciante Ninja',
    emoji: '🎒',
    cor: '#94a3b8',
    bgGradiente: 'from-[#64748b]/20 via-[#94a3b8]/10 to-transparent',
    borderCor: '#94a3b8',
    xpMinimo: 0,
    xpProximo: 150,
    descricao: 'Iniciando o treinamento ninja de hardware na Vila de Konoha.',
    requisito: '0 a 149 XP · Patente inicial de todo estudante de Konoha',
    mensagemVitoria: 'Você está na Academia Ninja! Continue respondendo para acumular XP e se graduar como Genin!',
  },
  {
    nivel: 2,
    id: 'GENIN',
    patente: 'GENIN',
    nome: 'Genin',
    rotulo: 'Graduado de Konoha',
    emoji: '🍃',
    cor: '#22c55e',
    bgGradiente: 'from-[#16a34a]/20 via-[#22c55e]/10 to-transparent',
    borderCor: '#22c55e',
    xpMinimo: 150,
    xpProximo: 400,
    descricao: 'Ninja oficial formado na academia, dominando os componentes básicos do computador.',
    requisito: '150 a 399 XP · Requer 150 XP acumulados',
    mensagemVitoria: 'PARABÉNS! Você alcançou a patente GENIN! A bandana da Folha é sua!',
  },
  {
    nivel: 3,
    id: 'CHUNIN',
    patente: 'CHUNIN',
    nome: 'Chūnin',
    rotulo: 'Estrategista de Esquadrão',
    emoji: '🛡️',
    cor: '#3b82f6',
    bgGradiente: 'from-[#2563eb]/20 via-[#3b82f6]/10 to-transparent',
    borderCor: '#3b82f6',
    xpMinimo: 400,
    xpProximo: 800,
    descricao: 'Líder tático com compreensão aprofundada de barramentos, memórias e fluxo de dados.',
    requisito: '400 a 799 XP · Requer 400 XP acumulados',
    mensagemVitoria: 'APROVADO NO EXAME CHŪNIN! Sua visão técnica e liderança estratégica foram comprovadas!',
  },
  {
    nivel: 4,
    id: 'JONIN',
    patente: 'JONIN',
    nome: 'Jōnin',
    rotulo: 'Elite de Konoha',
    emoji: '⚔️',
    cor: '#8b5cf6',
    bgGradiente: 'from-[#7c3aed]/20 via-[#8b5cf6]/10 to-transparent',
    borderCor: '#8b5cf6',
    xpMinimo: 800,
    xpProximo: 1400,
    descricao: 'Ninja de elite com alto domínio da CPU, ciclo de busca, registradores e execução.',
    requisito: '800 a 1.399 XP · Requer 800 XP acumulados',
    mensagemVitoria: 'INCRÍVEL! Patente JŌNIN conquistada! Você domina as técnicas mais avançadas da arquitetura!',
  },
  {
    nivel: 5,
    id: 'ANBU',
    patente: 'ANBU',
    nome: 'ANBU',
    rotulo: 'Forças Especiais',
    emoji: '🎭',
    cor: '#ec4899',
    bgGradiente: 'from-[#db2777]/20 via-[#ec4899]/10 to-transparent',
    borderCor: '#ec4899',
    xpMinimo: 1400,
    xpProximo: 2200,
    descricao: 'Força tática secreta especializada em operações críticas de baixo nível e hardware profundo.',
    requisito: '1.400 a 2.199 XP · Requer 1.400 XP acumulados',
    mensagemVitoria: 'ELITE ANBU! Suas habilidades com computação operam nas sombras dos registradores e Von Neumann!',
  },
  {
    nivel: 6,
    id: 'SANNIN',
    patente: 'SANNIN',
    nome: 'Sannin',
    rotulo: 'Sannin Lendário',
    emoji: '🐸',
    cor: '#f97316',
    bgGradiente: 'from-[#ea580c]/20 via-[#f97316]/10 to-transparent',
    borderCor: '#f97316',
    xpMinimo: 2200,
    xpProximo: 3200,
    descricao: 'Um dos três ninjas lendários de Konoha, autoridade respeitada em todo o mundo tecnológico.',
    requisito: '2.200 a 3.199 XP · Requer 2.200 XP acumulados',
    mensagemVitoria: 'LENDÁRIO! Você alcançou o posto de SANNIN! Seus conhecimentos inspiram toda a vila!',
  },
  {
    nivel: 7,
    id: 'KAGE',
    patente: 'KAGE',
    nome: 'Kage',
    rotulo: 'Líder Guardião',
    emoji: '⚡',
    cor: '#eab308',
    bgGradiente: 'from-[#ca8a04]/20 via-[#eab308]/10 to-transparent',
    borderCor: '#eab308',
    xpMinimo: 3200,
    xpProximo: 4500,
    descricao: 'Pilar soberano de sabedoria, capaz de proteger e orientar toda a comunidade de hardware.',
    requisito: '3.200 a 4.499 XP · Requer 3.200 XP acumulados',
    mensagemVitoria: 'PATENTE KAGE! O poder e a precisão do seu conhecimento estão no ápice das grandes nações!',
  },
  {
    nivel: 8,
    id: 'HOKAGE',
    patente: 'HOKAGE',
    nome: 'Hokage',
    rotulo: 'Líder Supremo de Konoha',
    emoji: '🔥',
    cor: '#ef4444',
    bgGradiente: 'from-[#dc2626]/20 via-[#ef4444]/10 to-transparent',
    borderCor: '#ef4444',
    xpMinimo: 4500,
    xpProximo: 4500,
    descricao: 'A patente máxima da Vila da Folha! O maior líder e especialista em arquitetura de toda Konoha.',
    requisito: '4.500+ XP · Nível Máximo do Universo Konoha',
    mensagemVitoria: 'A VONTADE DO FOGO! Você é oficialmente o HOKAGE DE KONOHA! O mestre supremo absoluto do hardware!',
  },
];

export const DADOS_PATENTES: Record<PatenteNinja, InfoPatente> = NIVEIS_NINJA.reduce(
  (acc, n) => {
    acc[n.patente] = n;
    return acc;
  },
  {} as Record<PatenteNinja, InfoPatente>
);

export const XP_POR_ACERTO = 50;

export interface InfoNivelConta {
  nivel: number;
  patente: PatenteNinja;
  dadosPatente: InfoPatente;
  xpAtual: number;
  xpNivelAtual: number;
  xpProximoNivel: number;
  xpNecessarioNivel: number;
  xpProgressoNivel: number;
  xpFaltaProximo: number;
  porcentagemBarra: number;
  isMaximo: boolean;
}

export function calcularNivelEProgressoXP(totalXp: number): InfoNivelConta {
  const xp = Math.max(0, Math.floor(totalXp || 0));
  let defAtual = NIVEIS_NINJA[0];

  for (let i = NIVEIS_NINJA.length - 1; i >= 0; i--) {
    if (xp >= NIVEIS_NINJA[i].xpMinimo) {
      defAtual = NIVEIS_NINJA[i];
      break;
    }
  }

  const isMaximo = defAtual.nivel === NIVEIS_NINJA.length;
  const xpNivelAtual = defAtual.xpMinimo;
  const xpProximoNivel = defAtual.xpProximo;
  const xpNecessarioNivel = isMaximo ? 1 : Math.max(1, xpProximoNivel - xpNivelAtual);
  const xpProgressoNivel = isMaximo ? xpNecessarioNivel : Math.max(0, xp - xpNivelAtual);
  const xpFaltaProximo = isMaximo ? 0 : Math.max(0, xpProximoNivel - xp);
  const porcentagemBarra = isMaximo
    ? 100
    : Math.min(100, Math.max(0, Math.round((xpProgressoNivel / xpNecessarioNivel) * 100)));

  return {
    nivel: defAtual.nivel,
    patente: defAtual.patente,
    dadosPatente: defAtual,
    xpAtual: xp,
    xpNivelAtual,
    xpProximoNivel,
    xpNecessarioNivel,
    xpProgressoNivel,
    xpFaltaProximo,
    porcentagemBarra,
    isMaximo,
  };
}

export interface ItemHistoricoQuiz {
  id: string;
  temaId: string;
  temaTitulo: string;
  acertos: number;
  total: number;
  xpGanho: number;
  patente: PatenteNinja;
  dataISO: string;
  dataFormatada: string;
}

export interface ResumoTemaProgresso {
  temaId: string;
  temaTitulo: string;
  melhorAcertos: number;
  totalPerguntas: number;
  melhorPatente: PatenteNinja;
  tentativas: number;
  ultimaTentativaISO: string;
}

export interface PerfilProgressoQuiz {
  email: string;
  nome?: string;
  foto?: string;
  totalXp: number;
  nivel: number;
  patenteGeral: PatenteNinja;
  totalJogos: number;
  totalAcertos: number;
  totalPerguntasRespondidas: number;
  taxaAcertosGeral: number; // 0 a 100
  temas: Record<string, ResumoTemaProgresso>;
  historico: ItemHistoricoQuiz[];
}

const CHAVE_PREFIXO = 'konoha_quiz_v2_';
const CHAVE_AUDIO = 'konoha_quiz_som_ativo';
const ouvintes = new Set<() => void>();

function emitirMudanca() {
  ouvintes.forEach((fn) => fn());
}

/**
 * Avalia o desempenho na rodada atual do quiz:
 * - Acertou todas (100%): HOKAGE (Desempenho Ninja Perfeito!)
 * - Acertou metade ou mais (>= 50%): CHUNIN (Aprovado no Exame Ninja!)
 * - Não acertou nada ou abaixo da metade: ESTUDANTE (Treinar na Academia!)
 */
export function calcularPatente(acertos: number, total: number): PatenteNinja {
  if (total <= 0) return 'ESTUDANTE';
  if (acertos === total) return 'HOKAGE';
  if (acertos >= Math.ceil(total / 2)) return 'CHUNIN';
  return 'ESTUDANTE';
}

function obterChaveStorage(email?: string | null): string {
  const identificador = (email || 'visitante').trim().toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
  return `${CHAVE_PREFIXO}${identificador}`;
}

export function criarPerfilVazio(email: string = 'visitante', nome?: string): PerfilProgressoQuiz {
  const infoNivel = calcularNivelEProgressoXP(0);
  return {
    email,
    nome: nome || (email === 'visitante' ? 'Visitante' : email.split('@')[0]),
    totalXp: 0,
    nivel: infoNivel.nivel,
    patenteGeral: infoNivel.patente,
    totalJogos: 0,
    totalAcertos: 0,
    totalPerguntasRespondidas: 0,
    taxaAcertosGeral: 0,
    temas: {},
    historico: [],
  };
}

const cachePerfil: Record<string, PerfilProgressoQuiz> = {};

function normalizarPerfilSalvo(perfil: any, email: string): PerfilProgressoQuiz {
  const totalAcertos = Number(perfil.totalAcertos) || 0;
  // Se o perfil antigo não tinha XP gravado, calcula com base nos acertos históricos
  const totalXp = Number(perfil.totalXp) >= 0 ? Number(perfil.totalXp) : totalAcertos * XP_POR_ACERTO;
  const infoNivel = calcularNivelEProgressoXP(totalXp);

  // Mapeia eventuais patentes antigas para as patentes de Naruto
  const mapaAntigo: Record<string, PatenteNinja> = {
    DIAMANTE: 'HOKAGE',
    OURO: 'CHUNIN',
    FERRO: 'ESTUDANTE',
  };

  const temasNormalizados: Record<string, ResumoTemaProgresso> = {};
  if (perfil.temas && typeof perfil.temas === 'object') {
    Object.entries(perfil.temas).forEach(([chave, val]: [string, any]) => {
      temasNormalizados[chave] = {
        ...val,
        melhorPatente: mapaAntigo[val.melhorPatente] || val.melhorPatente || 'ESTUDANTE',
      };
    });
  }

  const historicoNormalizado: ItemHistoricoQuiz[] = Array.isArray(perfil.historico)
    ? perfil.historico.map((h: any) => ({
        ...h,
        xpGanho: Number(h.xpGanho) >= 0 ? Number(h.xpGanho) : (Number(h.acertos) || 0) * XP_POR_ACERTO,
        patente: mapaAntigo[h.patente] || h.patente || 'ESTUDANTE',
      }))
    : [];

  return {
    email,
    nome: perfil.nome || (email === 'visitante' ? 'Visitante' : email.split('@')[0]),
    foto: perfil.foto,
    totalXp,
    nivel: infoNivel.nivel,
    patenteGeral: infoNivel.patente,
    totalJogos: Number(perfil.totalJogos) || 0,
    totalAcertos,
    totalPerguntasRespondidas: Number(perfil.totalPerguntasRespondidas) || 0,
    taxaAcertosGeral: Number(perfil.taxaAcertosGeral) || 0,
    temas: temasNormalizados,
    historico: historicoNormalizado,
  };
}

export function obterProgressoUsuario(email?: string | null): PerfilProgressoQuiz {
  const chave = obterChaveStorage(email);
  if (cachePerfil[chave]) {
    return cachePerfil[chave];
  }
  if (typeof window === 'undefined') {
    const vazio = criarPerfilVazio(email || 'visitante');
    cachePerfil[chave] = vazio;
    return vazio;
  }
  try {
    const dados = localStorage.getItem(chave);
    if (dados) {
      const parsed = JSON.parse(dados);
      const normalizado = normalizarPerfilSalvo(parsed, email || 'visitante');
      cachePerfil[chave] = normalizado;
      return normalizado;
    }
  } catch {
    /* fallback se houver falha de leitura */
  }
  const novoVazio = criarPerfilVazio(email || 'visitante');
  cachePerfil[chave] = novoVazio;
  return novoVazio;
}

export function salvarResultadoQuiz(
  email: string | null | undefined,
  temaId: string,
  temaTitulo: string,
  acertos: number,
  total: number,
  runId?: string,
  dadosUsuario?: { nome?: string; foto?: string }
): {
  patente: PatenteNinja;
  xpGanho: number;
  subiuDeNivel: boolean;
  novoRecorde: boolean;
  progresso: PerfilProgressoQuiz;
  nivelAnterior: number;
  nivelAtual: number;
} {
  const patente = calcularPatente(acertos, total);
  const xpGanho = Math.max(0, acertos) * XP_POR_ACERTO;

  if (typeof window === 'undefined') {
    return {
      patente,
      xpGanho,
      subiuDeNivel: false,
      novoRecorde: false,
      progresso: criarPerfilVazio(email || 'visitante'),
      nivelAnterior: 1,
      nivelAtual: 1,
    };
  }

  const chave = obterChaveStorage(email);
  const perfil = obterProgressoUsuario(email);

  // Anti-exploit: verifica se este runId já foi processado neste histórico
  if (runId && perfil.historico?.some((h) => h.id === runId)) {
    return {
      patente,
      xpGanho: 0,
      subiuDeNivel: false,
      novoRecorde: false,
      progresso: perfil,
      nivelAnterior: perfil.nivel,
      nivelAtual: perfil.nivel,
    };
  }

  if (dadosUsuario?.nome) perfil.nome = dadosUsuario.nome;
  if (dadosUsuario?.foto) perfil.foto = dadosUsuario.foto;
  if (email) perfil.email = email;

  const nivelAnterior = perfil.nivel;

  // Atualiza métricas e concede XP das respostas corretas
  perfil.totalJogos += 1;
  perfil.totalAcertos += acertos;
  perfil.totalPerguntasRespondidas += total;
  perfil.totalXp = (perfil.totalXp || 0) + xpGanho;
  perfil.taxaAcertosGeral =
    perfil.totalPerguntasRespondidas > 0
      ? Math.round((perfil.totalAcertos / perfil.totalPerguntasRespondidas) * 100)
      : 0;

  // Atualiza nível e patente com base no novo XP acumulado
  const infoNivel = calcularNivelEProgressoXP(perfil.totalXp);
  perfil.nivel = infoNivel.nivel;
  perfil.patenteGeral = infoNivel.patente;
  const subiuDeNivel = perfil.nivel > nivelAnterior;

  const ordemPatente: Record<PatenteNinja, number> = {
    ESTUDANTE: 1,
    GENIN: 2,
    CHUNIN: 3,
    JONIN: 4,
    ANBU: 5,
    SANNIN: 6,
    KAGE: 7,
    HOKAGE: 8,
  };
  let novoRecorde = false;

  const temaAnterior = perfil.temas[temaId];
  if (!temaAnterior) {
    perfil.temas[temaId] = {
      temaId,
      temaTitulo,
      melhorAcertos: acertos,
      totalPerguntas: total,
      melhorPatente: patente,
      tentativas: 1,
      ultimaTentativaISO: new Date().toISOString(),
    };
    novoRecorde = true;
  } else {
    temaAnterior.tentativas += 1;
    temaAnterior.ultimaTentativaISO = new Date().toISOString();
    if (
      ordemPatente[patente] > (ordemPatente[temaAnterior.melhorPatente] || 0) ||
      (patente === temaAnterior.melhorPatente && acertos > temaAnterior.melhorAcertos)
    ) {
      temaAnterior.melhorPatente = patente;
      temaAnterior.melhorAcertos = acertos;
      novoRecorde = true;
    }
  }

  const agora = new Date();
  const idPartida = runId || 'partida_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const novoItemHistorico: ItemHistoricoQuiz = {
    id: idPartida,
    temaId,
    temaTitulo,
    acertos,
    total,
    xpGanho,
    patente,
    dataISO: agora.toISOString(),
    dataFormatada: agora.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Mantém os últimos 30 registros no histórico
  perfil.historico = [novoItemHistorico, ...(perfil.historico || [])].slice(0, 30);

  try {
    localStorage.setItem(chave, JSON.stringify(perfil));
  } catch {
    /* storage cheio ou desabilitado */
  }

  cachePerfil[chave] = { ...perfil };
  emitirMudanca();
  return {
    patente,
    xpGanho,
    subiuDeNivel,
    novoRecorde,
    progresso: perfil,
    nivelAnterior,
    nivelAtual: perfil.nivel,
  };
}

export function migrarProgressoConvidadoParaGoogle(emailGoogle: string, nome?: string, foto?: string): void {
  if (typeof window === 'undefined' || !emailGoogle) return;
  const perfilConvidado = obterProgressoUsuario('visitante');
  if (perfilConvidado.totalJogos === 0 && perfilConvidado.totalXp === 0) return;

  const chaveGoogle = obterChaveStorage(emailGoogle);
  const perfilGoogle = obterProgressoUsuario(emailGoogle);

  perfilGoogle.nome = nome || perfilGoogle.nome || emailGoogle.split('@')[0];
  if (foto) perfilGoogle.foto = foto;
  perfilGoogle.email = emailGoogle;

  Object.values(perfilConvidado.temas).forEach((tConvidado) => {
    const tGoogle = perfilGoogle.temas[tConvidado.temaId];
    if (!tGoogle) {
      perfilGoogle.temas[tConvidado.temaId] = { ...tConvidado };
    } else {
      const ordem: Record<PatenteNinja, number> = {
        ESTUDANTE: 1,
        GENIN: 2,
        CHUNIN: 3,
        JONIN: 4,
        ANBU: 5,
        SANNIN: 6,
        KAGE: 7,
        HOKAGE: 8,
      };
      tGoogle.tentativas += tConvidado.tentativas;
      if (
        (ordem[tConvidado.melhorPatente] || 0) > (ordem[tGoogle.melhorPatente] || 0) ||
        tConvidado.melhorAcertos > tGoogle.melhorAcertos
      ) {
        tGoogle.melhorPatente = tConvidado.melhorPatente;
        tGoogle.melhorAcertos = tConvidado.melhorAcertos;
      }
    }
  });

  perfilGoogle.totalJogos += perfilConvidado.totalJogos;
  perfilGoogle.totalAcertos += perfilConvidado.totalAcertos;
  perfilGoogle.totalPerguntasRespondidas += perfilConvidado.totalPerguntasRespondidas;
  perfilGoogle.totalXp = (perfilGoogle.totalXp || 0) + (perfilConvidado.totalXp || 0);
  perfilGoogle.taxaAcertosGeral =
    perfilGoogle.totalPerguntasRespondidas > 0
      ? Math.round((perfilGoogle.totalAcertos / perfilGoogle.totalPerguntasRespondidas) * 100)
      : 0;

  const infoNivel = calcularNivelEProgressoXP(perfilGoogle.totalXp);
  perfilGoogle.nivel = infoNivel.nivel;
  perfilGoogle.patenteGeral = infoNivel.patente;

  perfilGoogle.historico = [...(perfilConvidado.historico || []), ...(perfilGoogle.historico || [])].slice(0, 40);

  try {
    localStorage.setItem(chaveGoogle, JSON.stringify(perfilGoogle));
    localStorage.removeItem(obterChaveStorage('visitante'));
  } catch {
    /* segue */
  }

  cachePerfil[chaveGoogle] = { ...perfilGoogle };
  delete cachePerfil[obterChaveStorage('visitante')];
  emitirMudanca();
}

export function limparHistoricoUsuario(email?: string | null): void {
  if (typeof window === 'undefined') return;
  const chave = obterChaveStorage(email);
  try {
    localStorage.removeItem(chave);
  } catch {
    /* segue */
  }
  delete cachePerfil[chave];
  emitirMudanca();
}

export function useProgressoQuiz(email?: string | null): PerfilProgressoQuiz {
  return useSyncExternalStore(
    (cb) => {
      ouvintes.add(cb);
      return () => {
        ouvintes.delete(cb);
      };
    },
    () => obterProgressoUsuario(email),
    () => criarPerfilVazio(email || 'visitante'),
  );
}

// Ouvinte de mudança de autenticação para migração automática de visitante para conta Google
if (typeof window !== 'undefined') {
  window.addEventListener('konoha:auth-change', (e: Event) => {
    const custom = e as CustomEvent<{ email?: string; nome?: string; foto?: string } | null>;
    const usuario = custom.detail;
    if (usuario?.email) {
      migrarProgressoConvidadoParaGoogle(usuario.email, usuario.nome, usuario.foto);
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(CHAVE_PREFIXO)) {
      delete cachePerfil[e.key];
      emitirMudanca();
    }
  });
}

// ==========================================
// EFEITOS SONOROS COM WEB AUDIO API
// ==========================================

let audioCtx: AudioContext | null = null;

function obterAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtxClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function somHabilitado(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(CHAVE_AUDIO) !== '0';
}

export function alternarSom(): boolean {
  if (typeof window === 'undefined') return true;
  const atual = somHabilitado();
  const novo = !atual;
  try {
    localStorage.setItem(CHAVE_AUDIO, novo ? '1' : '0');
  } catch {
    /* segue */
  }
  emitirMudanca();
  return novo;
}

function tocarTom(
  frequencia: number,
  inicio: number,
  duracao: number,
  tipo: OscillatorType = 'sine',
  volume: number = 0.15
) {
  const ctx = obterAudioContext();
  if (!ctx || !somHabilitado()) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = tipo;
    osc.frequency.setValueAtTime(frequencia, ctx.currentTime + inicio);

    gain.gain.setValueAtTime(0, ctx.currentTime + inicio);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + inicio + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + inicio + duracao);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + inicio);
    osc.stop(ctx.currentTime + inicio + duracao);
  } catch {
    /* navegadores com autoplay restrito */
  }
}

export function tocarSomAcerto() {
  tocarTom(698.46, 0.0, 0.12, 'triangle', 0.2);
  tocarTom(880.0, 0.08, 0.22, 'triangle', 0.22);
}

export function tocarSomErro() {
  tocarTom(277.18, 0.0, 0.16, 'sawtooth', 0.12);
  tocarTom(220.0, 0.12, 0.28, 'sawtooth', 0.12);
}

export function tocarSomSubirNivel() {
  if (!somHabilitado()) return;
  // Arpeggio triunfante de Level Up: C5 -> E5 -> G5 -> B5 -> C6
  tocarTom(523.25, 0.0, 0.12, 'triangle', 0.22);
  tocarTom(659.25, 0.1, 0.12, 'triangle', 0.22);
  tocarTom(783.99, 0.2, 0.14, 'triangle', 0.25);
  tocarTom(987.77, 0.32, 0.16, 'sine', 0.26);
  tocarTom(1046.5, 0.46, 0.55, 'sine', 0.3);
}

export function tocarSomPatente(patente: PatenteNinja) {
  if (!somHabilitado()) return;
  if (patente === 'HOKAGE' || patente === 'KAGE' || patente === 'SANNIN') {
    tocarTom(523.25, 0.0, 0.15, 'sine', 0.25);
    tocarTom(659.25, 0.12, 0.15, 'sine', 0.25);
    tocarTom(783.99, 0.24, 0.2, 'sine', 0.25);
    tocarTom(1046.5, 0.38, 0.55, 'triangle', 0.3);
  } else if (patente === 'JONIN' || patente === 'CHUNIN' || patente === 'ANBU') {
    tocarTom(587.33, 0.0, 0.14, 'triangle', 0.22);
    tocarTom(739.99, 0.12, 0.18, 'triangle', 0.22);
    tocarTom(880.0, 0.26, 0.45, 'triangle', 0.26);
  } else {
    tocarTom(330.0, 0.0, 0.18, 'triangle', 0.15);
    tocarTom(392.0, 0.14, 0.35, 'sine', 0.18);
  }
}
