'use client';
import { useId, useMemo, useRef, useState } from 'react';
import { CATALOGO_PECAS } from '@/lib/konoha/pecas';
import type { Peca } from '@/lib/konoha/tipos';
import { GLOSSARY } from '@/lib/parts';
import { irPara } from '@/lib/rotas';
import { montadorUi } from '@/lib/montadorUi';
import { formatarMoeda } from '@/lib/montagem';
import { pedirBuscaGlossario } from '@/lib/buscaGlossario';

const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const TODAS: Peca[] = Object.values(CATALOGO_PECAS).flat();

export function buscarPecas(texto: string) {
  const n = norm(texto.trim());
  if (!n) return [];
  return TODAS.filter((p) => norm(`${p.nome} ${p.marca} ${p.especificacoes.join(' ')}`).includes(n));
}

export function abrirGlossario(termo: string) {
  // guarda o termo: a tela de Dúvidas lê ao abrir (ou recebe pelo evento, se já estiver aberta)
  pedirBuscaGlossario(termo);
  irPara('glossario');
}

type Item = { tipo: 'peca'; peca: Peca } | { tipo: 'termo'; termo: string; def: string };

/**
 * Uma busca só para o site inteiro: encontra peças do catálogo e termos do glossário.
 * Mostra sugestões enquanto digita (reconhecer em vez de lembrar).
 */
export default function BuscaGlobal({ id, aoConcluir, autoFocus }: { id: string; aoConcluir?: () => void; autoFocus?: boolean }) {
  const [texto, setTexto] = useState('');
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const listaId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const itens = useMemo<Item[]>(() => {
    const n = norm(texto.trim());
    if (n.length < 2) return [];
    const pecas = buscarPecas(texto).slice(0, 5).map((peca) => ({ tipo: 'peca' as const, peca }));
    const termos = GLOSSARY.filter((g) => norm(g.term + ' ' + g.def).includes(n))
      .slice(0, 4)
      .map((g) => ({ tipo: 'termo' as const, termo: g.term, def: g.def }));
    return [...pecas, ...termos];
  }, [texto]);

  const escolher = (item: Item) => {
    if (item.tipo === 'peca') {
      montadorUi.set({ categoria: item.peca.categoria, busca: '', destaque: item.peca.id });
      irPara('montar');
    } else {
      abrirGlossario(item.termo);
    }
    setTexto('');
    setAberto(false);
    setAtivo(-1);
    inputRef.current?.blur();
    aoConcluir?.();
  };

  const enviar = () => {
    const t = texto.trim();
    if (!t) {
      inputRef.current?.focus();
      return;
    }
    if (ativo >= 0 && itens[ativo]) return escolher(itens[ativo]);
    if (buscarPecas(t).length > 0) {
      montadorUi.set({ busca: t, destaque: null });
      irPara('montar');
    } else {
      abrirGlossario(t);
    }
    setTexto('');
    setAberto(false);
    inputRef.current?.blur();
    aoConcluir?.();
  };

  const mostrarLista = aberto && texto.trim().length >= 2;

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
    >
      <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white py-1 pl-3.5 pr-1 transition-colors focus-within:border-[var(--fg)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <label htmlFor={id} className="sr-only">
          Buscar peça ou termo
        </label>
        <input
          ref={inputRef}
          id={id}
          type="search"
          role="combobox"
          aria-expanded={mostrarLista}
          aria-controls={listaId}
          aria-autocomplete="list"
          aria-activedescendant={ativo >= 0 ? `${listaId}-${ativo}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAberto(true);
            setAtivo(-1);
          }}
          onFocus={() => setAberto(true)}
          onBlur={() => setTimeout(() => setAberto(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setAberto(true);
              setAtivo((a) => Math.min(itens.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setAtivo((a) => Math.max(-1, a - 1));
            } else if (e.key === 'Escape') {
              setAberto(false);
              setAtivo(-1);
            }
          }}
          placeholder="Buscar peça ou termo"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[0.9rem] text-[var(--fg)] placeholder:text-[#7a736c] focus:outline-none xl:w-52 xl:flex-none"
        />
        <button type="submit" className="btn btn-primario btn-pequeno !min-h-[34px] !px-3.5 !text-[0.78rem]">
          Buscar
        </button>
      </div>

      {mostrarLista && (
        <div
          id={listaId}
          role="listbox"
          aria-label="Sugestões"
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-[min(420px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_18px_40px_-18px_rgba(17,17,17,0.35)]"
        >
          {itens.length === 0 ? (
            <p className="px-4 py-3 text-[0.88rem] text-[var(--fg2)]">
              Nada encontrado para “{texto.trim()}”. Tente um nome mais curto, como <strong>Ryzen</strong>, <strong>RTX</strong> ou <strong>VRAM</strong>.
            </p>
          ) : (
            <ul>
              {itens.map((item, i) => {
                const primeiroDoGrupo = i === 0 || itens[i - 1].tipo !== item.tipo;
                return (
                  <li key={item.tipo === 'peca' ? item.peca.id : item.termo}>
                    {primeiroDoGrupo && (
                      <p className="border-t border-[var(--line)] px-4 pb-1 pt-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--muted)] first:border-0">
                        {item.tipo === 'peca' ? 'Peças' : 'Termos do glossário'}
                      </p>
                    )}
                    <button
                      type="button"
                      id={`${listaId}-${i}`}
                      role="option"
                      aria-selected={ativo === i}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => escolher(item)}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left ${ativo === i ? 'bg-[var(--ink)]' : 'hover:bg-[var(--ink)]'}`}
                    >
                      {item.tipo === 'peca' ? (
                        <>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[0.9rem] font-semibold">{item.peca.nomeCurto}</span>
                            <span className="block truncate text-[0.78rem] text-[var(--muted)]">{item.peca.resumoSpecs}</span>
                          </span>
                          <span className="tnum shrink-0 text-[0.82rem] font-semibold">{item.peca.preco ? formatarMoeda(item.peca.preco) : 'Incluso'}</span>
                        </>
                      ) : (
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.9rem] font-semibold">{item.termo}</span>
                          <span className="block truncate text-[0.78rem] text-[var(--muted)]">{item.def}</span>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
