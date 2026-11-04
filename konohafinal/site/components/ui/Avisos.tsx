'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { fecharAviso, useAvisos } from '@/lib/avisos';

const COR = { info: 'var(--violet)', aviso: '#f59e0b', sucesso: '#22c55e' } as const;

export default function Avisos() {
  const lista = useAvisos();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed z-[90] flex flex-col gap-2"
      style={{
        left: 'max(16px, env(safe-area-inset-left, 0px))',
        bottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
        maxWidth: 'min(420px, calc(100vw - 96px))',
      }}
    >
      <AnimatePresence>
        {lista.map((a) => (
          <motion.div
            key={a.id}
            role={a.tipo === 'aviso' ? 'alert' : 'status'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-[#111] py-2.5 pl-4 pr-2 text-[0.88rem] text-white shadow-[0_12px_28px_rgba(17,17,17,0.3)]"
            style={{ borderLeft: `4px solid ${COR[a.tipo]}` }}
          >
            <span className="min-w-0 flex-1">{a.texto}</span>
            {a.acao && (
              <button
                type="button"
                onClick={() => {
                  a.acao!.fn();
                  fecharAviso(a.id);
                }}
                className="shrink-0 rounded-full border border-[#4b5160] px-3 py-1.5 text-[0.82rem] font-bold text-[#ffb27a] hover:border-[var(--violet)]"
              >
                {a.acao.rotulo}
              </button>
            )}
            <button type="button" onClick={() => fecharAviso(a.id)} aria-label="Fechar aviso" className="shrink-0 px-2 py-1 text-[#9ca3af] hover:text-white">
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
