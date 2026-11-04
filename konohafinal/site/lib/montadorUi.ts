'use client';
/** Estado de tela do montador (etapa aberta, busca e peça em destaque). Separado da montagem salva. */
import { useSyncExternalStore } from 'react';
import type { Categoria } from './konoha/tipos';

export type MontadorUi = { categoria: Categoria; busca: string; destaque: string | null };

let ui: MontadorUi = { categoria: 'cpu', busca: '', destaque: null };
const ouvintes = new Set<() => void>();

export const montadorUi = {
  atual: () => ui,
  set(patch: Partial<MontadorUi>) {
    ui = { ...ui, ...patch };
    ouvintes.forEach((l) => l());
  },
};

export function useMontadorUi() {
  return useSyncExternalStore(
    (cb) => {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    () => ui,
    () => ui,
  );
}
