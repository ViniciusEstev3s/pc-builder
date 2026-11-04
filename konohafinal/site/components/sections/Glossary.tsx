'use client';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { GLOSSARY } from '@/lib/parts';
import { lerBuscaGlossario, limparBuscaGlossario } from '@/lib/buscaGlossario';

const POPULAR = ['VRAM', 'PCIe', 'TDP', 'NVMe', 'FPS', 'Soquete'];

/** Distância de edição simples, para sugerir o termo mais parecido quando a busca não acha nada. */
function lev(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function Glossary() {
  const [q, setQ] = useState(() => (typeof window === 'undefined' ? '' : lerBuscaGlossario()));

  // busca vinda do campo do topo da página
  useEffect(() => {
    const pendente = lerBuscaGlossario();
    if (pendente) {
      setQ(pendente);
      setTimeout(limparBuscaGlossario, 150);
    }
    const on = (e: Event) => {
      const val = (e as CustomEvent<string>).detail ?? '';
      setQ(val);
      setTimeout(limparBuscaGlossario, 150);
    };
    window.addEventListener('glossary-search', on);
    return () => window.removeEventListener('glossary-search', on);
  }, []);
  const list = useMemo(() => {
    const n = norm(q.trim());
    return n ? GLOSSARY.filter((g) => norm(g.term + ' ' + g.def).includes(n)) : GLOSSARY;
  }, [q]);
  const suggestions = useMemo(() => {
    const n = norm(q.trim());
    if (!n || list.length) return [];
    return GLOSSARY.map((g) => ({ g, d: Math.min(...norm(g.term).split(/[\s/()]+/).filter(Boolean).map((w) => lev(n, w))) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map((x) => x.g.term);
  }, [q, list.length]);
  return (
    <section id="glossario" className="scroll-mt-24" aria-labelledby="titulo-glossario">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="titulo-glossario" className="text-[1.5rem] font-bold">
              Glossário
            </h2>
            <p className="mt-1 text-[0.95rem] text-[var(--fg2)]">As siglas do mundo do hardware, em português claro.</p>
          </div>
          <div className="w-full max-w-[380px]">
            <label htmlFor="glossary-search" className="mb-2 flex justify-between text-[0.82rem] font-semibold text-[var(--fg2)]">
              Buscar termo
              <span className="normal-case tracking-normal">
                atalho <kbd className="rounded border border-[var(--line)] px-1">/</kbd>
              </span>
            </label>
            <div className="flex items-center rounded-full border-[1.5px] border-[var(--line)] bg-white pr-1.5 focus-within:border-[var(--fg)]">
              <input
                id="glossary-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ex.: VRAM, PCIe, FPS"
                className="w-full min-w-0 rounded-full bg-transparent px-5 py-3 text-[0.95rem] text-[var(--fg)] placeholder:text-[#8a837c] focus:outline-none"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="mono shrink-0 rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.12em] hover:border-[var(--fg)]"
                >
                  Limpar ×
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[0.82rem] font-semibold text-[var(--muted)]">Mais buscados:</span>
          {POPULAR.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={q === t}
              onClick={() => setQ(q === t ? '' : t)}
              className={`mono rounded-full border px-3 py-1 text-[0.72rem] transition-colors ${
                q === t ? 'border-[var(--fg)] bg-[var(--violet)]' : 'border-[var(--line)] bg-white hover:border-[var(--fg)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mono mt-4 text-[0.72rem] text-[var(--muted)]" aria-live="polite">
          {q.trim() ? `${list.length} de ${GLOSSARY.length} termos para “${q.trim()}”` : `${GLOSSARY.length} termos`}
        </p>
        <motion.dl layout className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((g) => (
            <motion.div
              layout
              key={g.term}
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              className="glass neon-hover min-w-0 rounded-2xl p-5"
            >
              <dt className="mono text-[0.85rem] font-semibold text-[var(--lilac)]">{g.term}</dt>
              <dd className="mt-2 text-[0.92rem] leading-snug text-[var(--fg2)]">{g.def}</dd>
            </motion.div>
          ))}
        </motion.dl>
        {list.length === 0 && (
          <div className="glass mt-2 rounded-2xl p-5">
            <p className="text-[var(--fg)]">
              Nenhum termo com “{q.trim()}”. Confira a grafia ou tente uma palavra mais curta.
            </p>
            {suggestions.length > 0 && (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-[0.9rem] text-[var(--fg2)]">
                Você quis dizer:
                {suggestions.map((t) => (
                  <button key={t} type="button" onClick={() => setQ(t)} className="mono rounded-full border border-[var(--fg)] px-3 py-1 text-[0.75rem] hover:bg-[var(--violet)]">
                    {t}
                  </button>
                ))}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
