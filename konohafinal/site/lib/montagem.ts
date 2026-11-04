'use client';
/**
 * Estado da montagem do usuário: peças escolhidas e finalidade.
 * Fica salvo no navegador (localStorage) para o usuário não perder o progresso.
 */
import { useSyncExternalStore } from 'react';
import { buscarPecaPorId } from './konoha/pecas';
import { ORDEM_CATEGORIAS, type Categoria, type Finalidade, type Peca, type PcPronto, type Selecao } from './konoha/tipos';

const CHAVE = 'konoha-montagem-v2';

export type EstadoMontagem = { selecao: Selecao; finalidade: Finalidade };

const vazia = (): Selecao => Object.fromEntries(ORDEM_CATEGORIAS.map((c) => [c, null])) as Selecao;

let estado: EstadoMontagem = { selecao: vazia(), finalidade: 'jogos' };
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === 'undefined') return;
  carregado = true;
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return;
    const salvo = JSON.parse(bruto) as { ids?: Partial<Record<Categoria, string>>; finalidade?: Finalidade };
    const selecao = vazia();
    for (const c of ORDEM_CATEGORIAS) {
      const p = buscarPecaPorId(salvo.ids?.[c]);
      if (p && p.categoria === c) selecao[c] = p;
    }
    const finalidade = salvo.finalidade && ['jogos', 'trabalho', 'hibrido'].includes(salvo.finalidade) ? salvo.finalidade : 'jogos';
    estado = { selecao, finalidade };
  } catch {
    /* armazenamento indisponível: começa vazio */
  }
}

function salvar() {
  try {
    const ids: Partial<Record<Categoria, string>> = {};
    for (const c of ORDEM_CATEGORIAS) if (estado.selecao[c]) ids[c] = estado.selecao[c]!.id;
    window.localStorage.setItem(CHAVE, JSON.stringify({ ids, finalidade: estado.finalidade }));
  } catch {
    /* segue sem salvar */
  }
}

function definir(novo: EstadoMontagem) {
  estado = novo;
  salvar();
  ouvintes.forEach((l) => l());
}

const SERVIDOR: EstadoMontagem = { selecao: vazia(), finalidade: 'jogos' };

export function useMontagem() {
  return useSyncExternalStore(
    (cb) => {
      carregar();
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    () => {
      carregar();
      return estado;
    },
    () => SERVIDOR,
  );
}

export const montagem = {
  atual: () => estado,
  escolher(peca: Peca) {
    definir({ ...estado, selecao: { ...estado.selecao, [peca.categoria]: peca } });
  },
  remover(categoria: Categoria) {
    definir({ ...estado, selecao: { ...estado.selecao, [categoria]: null } });
  },
  limpar() {
    definir({ ...estado, selecao: vazia() });
  },
  restaurar(foto: EstadoMontagem) {
    definir(foto);
  },
  definirFinalidade(finalidade: Finalidade) {
    definir({ ...estado, finalidade });
  },
  carregarPc(pc: PcPronto, finalidade: Finalidade) {
    const selecao = vazia();
    for (const c of ORDEM_CATEGORIAS) selecao[c] = buscarPecaPorId(pc.pecasIds[c]);
    definir({ selecao, finalidade });
  },
};

export function quantidadeEscolhida(s: Selecao) {
  return ORDEM_CATEGORIAS.filter((c) => s[c]).length;
}

export function selecaoDoPc(pc: PcPronto): Selecao {
  const s = vazia();
  for (const c of ORDEM_CATEGORIAS) s[c] = buscarPecaPorId(pc.pecasIds[c]);
  return s;
}

export function precoTotal(s: Selecao) {
  return ORDEM_CATEGORIAS.reduce((t, c) => t + (s[c]?.preco || 0), 0);
}

export const formatarMoeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
