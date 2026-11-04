'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CHOICE, CHOICE_QUIZ } from '@/lib/site';

type Ans = 'sim' | 'não' | null;

export default function Choice() {
  const [ans, setAns] = useState<Ans[]>(CHOICE_QUIZ.map(() => null));
  const answered = ans.filter(Boolean).length;
  const score = ans.reduce((s, a, i) => (a && a === CHOICE_QUIZ[i].montar ? s + 1 : s), 0);
  const pick = answered < CHOICE_QUIZ.length ? null : score >= 2 ? 'montar' : 'pronto';

  return (
    <section id="escolha" className="scroll-mt-24" aria-labelledby="titulo-escolha">
      <div>
        <div>
          <h2 id="titulo-escolha" className="text-[1.5rem] font-bold">Pronto ou montado?</h2>
          <p className="mt-2 max-w-[62ch] text-[0.98rem] leading-relaxed text-[var(--fg2)]">
            Nenhum caminho é errado: cada um troca praticidade por controle. Compare e responda três perguntas para ver qual combina com você.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {CHOICE.map((c) => {
            const on = pick === c.id;
            return (
              <article
                key={c.id}
                className={`glass neon-hover relative min-w-0 overflow-hidden rounded-[26px] p-6 md:p-8 ${on ? 'shadow-neon' : ''}`}
                style={on ? { borderColor: 'var(--neon)' } : undefined}
              >
                <AnimatePresence>
                  {on && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mono absolute right-5 top-5 rounded-full bg-[var(--violet)] px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--fg)]"
                    >
                      Combina com você
                    </motion.span>
                  )}
                </AnimatePresence>
                <p className="mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--lilac)]">{c.sub}</p>
                <h3 className="mt-1 text-[1.35rem] font-bold text-[var(--fg)]">{c.title}</h3>
                <p className="mt-3 max-w-[48ch] text-[0.98rem] leading-relaxed text-[var(--fg2)]">{c.lead}</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <h4 className="mono mb-2 text-[0.66rem] uppercase tracking-[0.18em] text-[var(--cyan)]">Vantagens</h4>
                    <ul className="grid gap-2 text-[0.9rem] leading-snug text-[var(--fg2)]">
                      {c.pros.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-[3px] text-[var(--cyan)]" aria-hidden>
                            ✓
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mono mb-2 text-[0.66rem] uppercase tracking-[0.18em] text-[var(--lilac)]">Pontos de atenção</h4>
                    <ul className="grid gap-2 text-[0.9rem] leading-snug text-[var(--fg2)]">
                      {c.cons.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-[1px] text-[var(--lilac)]" aria-hidden>
                            –
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 border-t border-[var(--line)] pt-4 text-[0.9rem] text-[var(--lilac)]">
                  <span className="mono mr-2 text-[0.66rem] uppercase tracking-[0.18em] text-[var(--muted)]">Ideal para</span>
                  {c.ideal}
                </p>
              </article>
            );
          })}
        </div>

        <div className="glass mt-4 rounded-[26px] p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-[1.1rem] font-bold text-[var(--fg)]">Qual combina com você?</h3>
            <button
              type="button"
              onClick={() => setAns(CHOICE_QUIZ.map(() => null))}
              className="mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Recomeçar
            </button>
          </div>
          <ol className="mt-5 grid gap-3">
            {CHOICE_QUIZ.map((item, i) => (
              <li key={item.q} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3 last:border-0">
                <span className="min-w-0 flex-1 text-[0.95rem] text-[var(--fg2)]">
                  <span className="mono mr-2 text-[0.7rem] text-[var(--lilac)]">{i + 1}.</span>
                  {item.q}
                </span>
                <span className="flex gap-2" role="group" aria-label={`Resposta ${i + 1}`}>
                  {(['sim', 'não'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={ans[i] === v}
                      onClick={() => setAns((a) => a.map((x, k) => (k === i ? v : x)))}
                      className={`mono rounded-full border px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
                        ans[i] === v ? 'border-[var(--neon)] bg-[var(--violet)] text-[var(--fg)]' : 'border-[var(--line)] text-[var(--lilac)] hover:border-[var(--neon)]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 min-h-[1.6em] text-[1rem] text-[var(--lilac)]" aria-live="polite">
            {pick === 'montar' && (
              <>
                <strong className="text-[var(--fg)]">Montar você mesmo</strong> parece o seu caminho.{' '}
                <a href="#montar" className="link-texto">
                  Abrir o montador
                </a>
              </>
            )}
            {pick === 'pronto' && (
              <>
                Um <strong className="text-[var(--fg)]">PC pronto</strong> deve te atender melhor. As opções acima já vêm com peças compatíveis.
              </>
            )}
            {!pick && <span className="text-[var(--muted)]">Responda as {CHOICE_QUIZ.length} perguntas para ver a sugestão.</span>}
          </p>
        </div>
      </div>
    </section>
  );
}
