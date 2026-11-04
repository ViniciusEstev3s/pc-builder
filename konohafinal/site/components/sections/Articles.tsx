'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ARTICLES } from '@/lib/site';
import { useFocusTrap } from '@/lib/useFocusTrap';

/* Capas geradas em SVG: cada uma com um motivo do tema do artigo */
function Cover({ id }: { id: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`g-${id}`} cx="70%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ff6a13" stopOpacity={id === 'perifericos' ? '.22' : id === 'manutencao' ? '.32' : '.28'} />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`p-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0v20" fill="none" stroke="#111111" strokeOpacity=".07" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill="#faf8f5" />
      <rect width="320" height="180" fill={`url(#p-${id})`} />
      <rect width="320" height="180" fill={`url(#g-${id})`} />
      <g className="text-[var(--fg)]" {...common}>
        {id === 'checklist' && (
          <>
            <rect x="110" y="34" width="100" height="120" rx="8" />
            <rect x="140" y="26" width="40" height="16" rx="4" />
            {[66, 92, 118].map((y) => (
              <g key={y}>
                <rect x="128" y={y - 8} width="14" height="14" rx="3" />
                <path d={`m131 ${y - 1} 4 4 7-8`} className="text-[var(--lilac)]" stroke="currentColor" strokeWidth="2.2" />
                <path d={`M152 ${y}h40`} opacity=".7" />
              </g>
            ))}
          </>
        )}
        {id === 'perifericos' && (
          <>
            <rect x="70" y="30" width="150" height="90" rx="6" />
            <path d="M130 120v16M110 140h60" />
            <path d="M84 104l30-26 22 16 34-36 32 22" className="text-[var(--lilac)]" stroke="currentColor" strokeWidth="2.4" />
            <path d="M232 92c0-9 7-16 14-16s14 7 14 16v26c0 9-7 16-14 16s-14-7-14-16Z" />
            <path d="M246 76v16" />
          </>
        )}
        {id === 'manutencao' && (
          <>
            <rect x="100" y="40" width="96" height="96" rx="10" />
            <circle cx="148" cy="88" r="34" />
            <circle cx="148" cy="88" r="8" className="text-[var(--lilac)]" stroke="currentColor" />
            <path d="M210 56c18 4 30 18 30 36" className="text-[var(--lilac)]" stroke="currentColor" strokeWidth="2.2" />
            <path d="M238 86l2 8 7-5" className="text-[var(--lilac)]" stroke="currentColor" strokeWidth="2.2" />
            <path d="M226 128h28M232 120h16M236 136h8" opacity=".6" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function Articles() {
  const [open, setOpen] = useState<string | null>(null);
  const art = ARTICLES.find((a) => a.id === open);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLElement>(null);
  useFocusTrap(dialog, !!open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lastFocus.current?.focus();
    };
  }, [open]);

  return (
    <section id="artigos" className="scroll-mt-24" aria-labelledby="titulo-artigos">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="titulo-artigos" className="text-[1.5rem] font-bold">
              Artigos
            </h2>
            <p className="mt-1 text-[0.95rem] text-[var(--fg2)]">Guias curtos para antes, durante e depois da montagem.</p>
          </div>
        </div>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {ARTICLES.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={(e) => {
                  lastFocus.current = e.currentTarget;
                  setOpen(a.id);
                }}
                className="group glass neon-hover flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[22px] text-left"
              >
                <span className="block aspect-[16/9] w-full max-w-full overflow-hidden">
                  <span className="block h-full w-full transition-transform duration-700 group-hover:scale-[1.05]">
                    <Cover id={a.id} />
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="mono text-[0.64rem] uppercase tracking-[0.18em] text-[var(--lilac)]">
                    {a.tag} · {a.read} de leitura
                  </span>
                  <span className="display mt-2 text-[1.08rem] font-[700] leading-snug text-[var(--fg)]">{a.title}</span>
                  <span className="mt-2 text-[0.9rem] leading-snug text-[var(--muted)]">{a.blurb}</span>
                  <span className="mono mt-auto pt-4 text-[0.66rem] uppercase tracking-[0.16em] text-[var(--lilac)] group-hover:text-[var(--fg)]">Ler artigo →</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {art && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(17,17,17,0.4)] backdrop-blur-sm md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.article
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="art-title"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-h-[88svh] w-full max-w-[680px] overflow-y-auto rounded-t-[26px] pb-[max(24px,env(safe-area-inset-bottom,0px))] md:rounded-[26px]"
            >
              <div className="aspect-[16/7] w-full overflow-hidden">
                <Cover id={art.id} />
              </div>
              <div className="px-6 pt-6 md:px-8">
                <div className="flex items-start justify-between gap-4">
                  <p className="mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--lilac)]">
                    {art.tag} · {art.read} de leitura
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(null)}
                    className="mono -mt-1 rounded-full border border-[var(--line)] px-3 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-[var(--lilac)] hover:border-[var(--neon)]"
                  >
                    Fechar ×
                  </button>
                </div>
                <h3 id="art-title" className="display mt-3 text-[clamp(1.4rem,3.4vw,2rem)] font-[800] leading-tight text-[var(--fg)]">
                  {art.title}
                </h3>
                {art.body.map((p) => (
                  <p key={p.slice(0, 20)} className="mt-4 text-[1rem] leading-relaxed text-[var(--fg2)]">
                    {p}
                  </p>
                ))}
                <ul className="mt-5 grid gap-3">
                  {art.list.map((li, i) => (
                    <li key={li} className="flex gap-3 text-[0.96rem] leading-relaxed text-[var(--fg2)]">
                      <span className="mono mt-[2px] text-[0.72rem] text-[var(--lilac)]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="min-w-0">{li}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
