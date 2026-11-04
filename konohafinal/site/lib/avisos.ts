'use client';
/** Avisos curtos (toasts). Usados só quando algo sai da montagem, sempre com "Desfazer". */
import { useSyncExternalStore } from 'react';

export type Aviso = { id: number; texto: string; tipo: 'info' | 'aviso' | 'sucesso'; acao?: { rotulo: string; fn: () => void } };

let lista: Aviso[] = [];
let seq = 0;
const ouvintes = new Set<() => void>();
const emitir = () => ouvintes.forEach((l) => l());

export function avisar(texto: string, opcoes: { tipo?: Aviso['tipo']; acao?: Aviso['acao']; duracao?: number } = {}) {
  const id = ++seq;
  // só o "Desfazer" mais recente vale; avisos antigos com ação seriam ambíguos
  const base = opcoes.acao ? lista.filter((a) => !a.acao) : lista;
  lista = [...base.slice(-2), { id, texto, tipo: opcoes.tipo ?? 'info', acao: opcoes.acao }];
  emitir();
  setTimeout(() => fecharAviso(id), opcoes.duracao ?? 6000);
  return id;
}

export function fecharAviso(id: number) {
  const antes = lista.length;
  lista = lista.filter((a) => a.id !== id);
  if (lista.length !== antes) emitir();
}

const VAZIO: Aviso[] = [];
export function useAvisos() {
  return useSyncExternalStore(
    (cb) => {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    () => lista,
    () => VAZIO,
  );
}
