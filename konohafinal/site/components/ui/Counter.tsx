'use client';
import { animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

/** Número que "conta" até o valor final quando entra na tela. Começa já mostrando o valor final. */
export default function Counter({ value, decimals = 0, prefix = '' }: { value: number; decimals?: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const fmt = (n: number) =>
    prefix + n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    const c = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = fmt(v)),
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return (
    <span ref={ref} className="tnum">
      {fmt(value)}
    </span>
  );
}
