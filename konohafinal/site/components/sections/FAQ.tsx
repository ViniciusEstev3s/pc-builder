'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FAQ as FAQ_BASE, FAQ_EXTRA } from '@/lib/site';

const ITEMS = [...FAQ_BASE, ...FAQ_EXTRA];

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" className="scroll-mt-24" aria-labelledby="titulo-faq">
      <div className="max-w-[860px]">
        <div>
          <h2 id="titulo-faq" className="text-[1.5rem] font-bold">
            Perguntas frequentes
          </h2>
          <p className="mt-1 text-[0.95rem] text-[var(--fg2)]">O que mais perguntam antes de montar o primeiro PC.</p>
        </div>
        <ul className="mt-5 border-t border-[var(--line)]">
          {ITEMS.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className="border-b border-[var(--line)]">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={on}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(on ? -1 : i)}
                    className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className={`text-[clamp(1rem,1.8vw,1.15rem)] font-semibold transition-colors ${on ? 'text-[var(--fg)]' : 'text-[var(--fg2)] group-hover:text-[var(--fg)]'}`}>
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[1rem] transition-all duration-300 ${
                        on ? 'rotate-45 border-[var(--neon)] bg-[var(--violet)] text-[var(--fg)] shadow-[0_0_16px_rgba(255,106,19,0.6)]' : 'border-[var(--line)] text-[var(--lilac)] group-hover:border-[var(--neon)]'
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[68ch] pb-6 text-[0.98rem] leading-relaxed text-[var(--fg2)]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
