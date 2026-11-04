'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';

/** Termo técnico com tooltip explicativo (hover, foco ou toque). */
export default function Term({ term, tip }: { term: string; tip: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="mono neon-hover rounded-full border border-[var(--line)] bg-[rgba(255,106,19,0.1)] px-3 py-1 text-[0.75rem] text-[var(--lilac)]"
      >
        {term}
        <span aria-hidden className="ml-1.5 text-[var(--lilac)]">
          ?
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="glass pointer-events-none absolute bottom-[calc(100%+10px)] left-0 z-30 w-64 rounded-xl p-3 text-[0.82rem] leading-snug text-[var(--fg)] shadow-neon"
          >
            <strong className="mb-1 block text-[var(--lilac)]">{term}</strong>
            {tip}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
