'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';
import { useFocusTrap } from '@/lib/useFocusTrap';

/**
 * Janela modal padrão do site: Esc fecha, clique fora fecha, o foco fica preso dentro
 * e volta para quem abriu ao fechar.
 */
export default function Modal({
  aberto,
  aoFechar,
  titulo,
  children,
  largura = 640,
  papel = 'dialog',
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: React.ReactNode;
  largura?: number;
  papel?: 'dialog' | 'alertdialog';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quemAbriu = useRef<HTMLElement | null>(null);
  const tituloId = useId();
  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;
  useFocusTrap(ref, aberto);

  useEffect(() => {
    if (!aberto) return;
    quemAbriu.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        fechar.current();
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      const alvo = ref.current?.querySelector<HTMLElement>('[data-foco-inicial]') ?? ref.current?.querySelector<HTMLElement>('button, a[href], input');
      alvo?.focus();
    });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      quemAbriu.current?.focus?.();
    };
  }, [aberto]);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="gutter fixed inset-0 z-[80] flex items-end justify-center bg-[rgba(17,17,17,0.45)] pb-[max(16px,env(safe-area-inset-bottom,0px))] pt-[max(16px,env(safe-area-inset-top,0px))] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) aoFechar();
          }}
        >
          <motion.div
            ref={ref}
            role={papel}
            aria-modal="true"
            aria-labelledby={tituloId}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-h-[88svh] w-full overflow-y-auto rounded-[22px] border-[1.5px] border-[var(--fg)] bg-white p-5 shadow-[6px_6px_0_var(--violet)] sm:p-7"
            style={{ maxWidth: largura }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={tituloId} className="display text-[1.25rem] font-[800] leading-tight">
                {titulo}
              </h2>
              <button type="button" onClick={aoFechar} className="btn btn-secundario btn-pequeno shrink-0" aria-label="Fechar">
                ✕
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
