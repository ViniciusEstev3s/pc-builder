import { PARTS } from '@/lib/parts';

export default function Summary() {
  return (
    <>
      <section id="resumo" className="gutter relative min-h-[200vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-start pt-[12svh] text-center">
          <p className="eyebrow">Resumo</p>
          <h2 className="display mt-4 text-[clamp(2.4rem,7vw,6rem)] font-[800] uppercase">
            Montado <span className="text-gradient">de novo</span>
          </h2>
          <p className="mt-4 max-w-[48ch] text-[1.02rem] leading-relaxed text-[var(--fg2)]">
            Agora cada peça tem nome. O PC volta a se fechar, com todas as peças rotuladas.
          </p>
        </div>
      </section>
      <section className="gutter relative bg-[linear-gradient(180deg,transparent,var(--void)_30%)] pb-20 pt-10">
        <div className="mx-auto max-w-[1180px]">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PARTS.map((p) => (
              <li key={p.id}>
                <a href={`#part-${p.id}`} className="glass neon-hover flex h-full min-w-0 items-start gap-4 rounded-2xl p-4">
                  <span className="display text-[1.4rem] font-[800] text-[rgba(255,106,19,0.55)]">{p.index}</span>
                  <span className="min-w-0">
                    <strong className="block text-[1rem] text-[var(--fg)]">{p.name}</strong>
                    <span className="block text-[0.85rem] leading-snug text-[var(--muted)]">{p.analogy}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
