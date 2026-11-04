'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Part } from '@/lib/parts';
import Counter from '@/components/ui/Counter';
import Term from '@/components/ui/Term';

const rise = {
  initial: { y: 28 },
  whileInView: { y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
} as const;

export default function PartSection({ part, total, prev, next }: { part: Part; total: number; prev?: Part; next?: Part }) {
  const [spec, setSpec] = useState(0);
  return (
    <section
      id={`part-${part.id}`}
      data-part
      className="gutter relative flex min-h-[135svh] items-end py-[18svh] md:min-h-[120vh] md:items-center md:py-[10vh]"
      aria-labelledby={`h-${part.id}`}
    >
      <motion.article
        {...rise}
        className="glass relative w-full max-w-[560px] rounded-[28px] p-6 md:p-8"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">
              Peça {part.index} / {String(total).padStart(2, '0')} · {part.short}
            </p>
            <h2 id={`h-${part.id}`} className="display mt-3 text-[clamp(1.9rem,4.2vw,3rem)] font-[800] [overflow-wrap:anywhere]">
              <span className="text-gradient">{part.name}</span>
            </h2>
          </div>
          <span className="display hidden select-none text-[3.5rem] font-[800] leading-none text-[rgba(255,106,19,0.14)]" aria-hidden>
            {part.index}
          </span>
        </header>

        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(255,106,19,0.4)] bg-[rgba(255,106,19,0.14)] px-4 py-2 text-[0.95rem] font-semibold text-[var(--lilac)]">
          <span className="h-2 w-2 rounded-full bg-[var(--neon)] shadow-[0_0_12px_var(--neon)]" aria-hidden />
          Analogia: {part.analogy}
        </p>

        <div className="mt-6 grid gap-5 text-[1rem] leading-relaxed text-[var(--fg2)]">
          <div>
            <h3 className="eyebrow mb-2">O que é</h3>
            <p className="max-w-[60ch]">{part.what}</p>
          </div>
          <div>
            <h3 className="eyebrow mb-2">Para que serve e como se conecta</h3>
            <p className="max-w-[60ch]">{part.role}</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Conexões">
              {part.connects.map((c) => (
                <li key={c} className="mono rounded-md border border-[var(--line)] px-2.5 py-1 text-[0.72rem] text-[var(--muted)]">
                  ↔ {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7">
          <h3 className="eyebrow mb-3">Especificações em linguagem leiga</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {part.specs.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onMouseEnter={() => setSpec(i)}
                onFocus={() => setSpec(i)}
                onClick={() => setSpec(i)}
                aria-pressed={spec === i}
                className={`neon-hover min-w-0 rounded-2xl border p-3.5 text-left ${
                  spec === i ? 'border-[rgba(255,106,19,0.65)] bg-[rgba(255,106,19,0.08)]' : 'border-[var(--line)] bg-[rgba(255,255,255,0.4)]'
                }`}
              >
                <span className="mono block text-[0.66rem] uppercase tracking-[0.16em] text-[var(--muted)]">{s.label}</span>
                <span className="display mt-1.5 block text-[clamp(1.25rem,3vw,1.7rem)] font-[700] text-[var(--fg)]">
                  <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} />
                  {s.unit && <span className="ml-1 text-[0.55em] font-[500] text-[var(--lilac)]">{s.unit}</span>}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 min-h-[3.2em] text-[0.9rem] leading-snug text-[var(--lilac)]" aria-live="polite">
            <span className="mono text-[var(--lilac)]">{part.specs[spec].label} →</span> {part.specs[spec].explain}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[rgba(17,17,17,0.18)] bg-[rgba(17,17,17,0.03)] p-4">
          <h3 className="mono mb-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-[var(--cyan)]">Dica na hora de escolher</h3>
          <p className="text-[0.95rem] leading-relaxed text-[var(--fg2)]">{part.tip}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {part.terms.map((t) => (
            <Term key={t.term} term={t.term} tip={t.tip} />
          ))}
        </div>

        {/* onde estou e para onde vou (heurísticas 1 e 3) */}
        <nav aria-label={`Navegar a partir de ${part.name}`} className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <a
            href={prev ? `#part-${prev.id}` : '#explode'}
            className="mono min-w-[44px] truncate text-[0.68rem] uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--fg)]"
          >
            ← {prev ? prev.name : 'Início'}
          </a>
          <span className="mono shrink-0 text-[0.68rem] text-[var(--fg)]">
            {Number(part.index)} de {total}
          </span>
          <a
            href={next ? `#part-${next.id}` : '#comparar'}
            className="mono min-w-[44px] justify-end truncate text-right text-[0.68rem] uppercase tracking-[0.12em] text-[var(--lilac)] hover:text-[var(--fg)]"
          >
            {next ? next.name : 'Comparativos'} →
          </a>
        </nav>
      </motion.article>
    </section>
  );
}
