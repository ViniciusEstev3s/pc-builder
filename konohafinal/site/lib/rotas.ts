'use client';
/**
 * Navegação por seções do site via #hash (funciona em qualquer hospedagem estática,
 * inclusive dentro de um artefato, e mantém os botões Voltar/Avançar do navegador).
 *
 * #montar, #prontos... trocam de tela. Âncoras internas (#part-cpu, #glossario...) abrem a
 * tela que as contém e rolam até elas.
 */
import { useEffect, useSyncExternalStore } from 'react';

export type Tela = 'inicio' | 'aprender' | 'montar' | 'gamer' | 'trabalho' | 'prontos' | 'quiz' | 'duvidas' | 'equipe';

export const TELAS: { id: Tela; rotulo: string; titulo: string }[] = [
  { id: 'inicio', rotulo: 'Início', titulo: 'Konoha Hardware' },
  { id: 'aprender', rotulo: 'Aprender', titulo: 'Anatomia do PC' },
  { id: 'montar', rotulo: 'Monte seu PC', titulo: 'Montar seu PC' },
  { id: 'gamer', rotulo: 'PC Gamer', titulo: 'PC Gamer' },
  { id: 'trabalho', rotulo: 'PC Trabalho', titulo: 'PC Trabalho' },
  { id: 'quiz', rotulo: 'Quiz', titulo: 'Quiz de Arquitetura' },
  { id: 'duvidas', rotulo: 'Dúvidas', titulo: 'Dúvidas e glossário' },
  { id: 'equipe', rotulo: 'Sobre a equipe', titulo: 'Sobre a equipe' },
  { id: 'prontos', rotulo: 'PCs prontos', titulo: 'PCs prontos' },
];

/** Em qual tela mora cada âncora interna. */
function telaDaAncora(ancora: string): Tela | null {
  if (TELAS.some((t) => t.id === ancora)) return ancora as Tela;
  if (ancora === 'resultado' || ancora === 'conferir') return 'montar';
  if (ancora === 'hero' || ancora === 'explode' || ancora.startsWith('part-') || ['comparar', 'conexoes', 'resumo'].includes(ancora)) return 'aprender';
  if (['glossario', 'faq', 'artigos', 'como-usar'].includes(ancora)) return 'duvidas';
  if (ancora === 'escolha' || ancora === 'pcs-gamer' || ancora === 'viewer3d') return 'gamer';
  if (ancora === 'pcs-trabalho' || ancora === 'autocad') return 'trabalho';
  return null;
}

type Rota = { tela: Tela; ancora: string };

let rota: Rota = { tela: 'inicio', ancora: '' };
const ouvintes = new Set<() => void>();

function ler(): Rota {
  const ancora = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  const tela = telaDaAncora(ancora);
  if (tela) return { tela, ancora };
  // âncora desconhecida: continua na tela atual (pode ser um id dentro dela)
  return { tela: rota.tela, ancora };
}

function atualizar() {
  const nova = ler();
  if (nova.tela !== rota.tela || nova.ancora !== rota.ancora) {
    rota = nova;
    ouvintes.forEach((l) => l());
  }
}

let iniciado = false;
function iniciar() {
  if (iniciado || typeof window === 'undefined') return;
  iniciado = true;
  rota = ler();
  window.addEventListener('hashchange', atualizar);
}

const SERVIDOR: Rota = { tela: 'inicio', ancora: '' };
export function useRota() {
  return useSyncExternalStore(
    (cb) => {
      iniciar();
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    () => {
      iniciar();
      return rota;
    },
    () => SERVIDOR,
  );
}

/** Vai para uma tela ou âncora. Usa o hash, então o histórico do navegador funciona. */
export function irPara(destino: string) {
  const alvo = destino.replace(/^#/, '');
  if (window.location.hash === '#' + alvo) {
    // mesmo hash: reaplica a rolagem
    rota = { ...rota };
    atualizar();
    rolarPara(alvo);
    return;
  }
  try {
    window.location.hash = alvo;
  } catch {
    /* ambiente que bloqueia o hash: troca só o estado */
    const tela = telaDaAncora(alvo) ?? rota.tela;
    rota = { tela, ancora: alvo };
    ouvintes.forEach((l) => l());
  }
}

export function rolarPara(ancora: string) {
  if (!ancora || TELAS.some((t) => t.id === ancora)) {
    window.scrollTo({ top: 0 });
    return;
  }
  const el = document.getElementById(ancora);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Depois de trocar de tela, rola até a âncora (ou ao topo) e atualiza o título da aba. */
export function useEfeitosDaRota() {
  const { tela, ancora } = useRota();
  useEffect(() => {
    const t = TELAS.find((x) => x.id === tela)!;
    document.title = tela === 'inicio' ? 'Konoha Hardware' : `${t.titulo} · Konoha Hardware`;
  }, [tela]);
  useEffect(() => {
    // espera a nova tela montar antes de rolar
    const id = window.setTimeout(() => rolarPara(ancora), 60);
    return () => window.clearTimeout(id);
  }, [tela, ancora]);
}
