import { TELAS } from '@/lib/rotas';

export default function Footer() {
  return (
    <footer className="gutter relative z-10 border-t border-[var(--line)] bg-[var(--ink)] pb-[max(28px,env(safe-area-inset-bottom,0px))] pt-10">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-start justify-between gap-8">
        <div className="max-w-[40ch]">
          <a href="#inicio" className="display text-[1rem] font-[800] uppercase tracking-wide">
            Konoha<span className="text-[var(--violet)]">.</span>HW
          </a>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--muted)]">
            Projeto acadêmico de Engenharia de Software. Preços de referência e desempenho estimado: confira sempre nas lojas e nos fabricantes.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-4">
            {TELAS.filter((t) => t.id !== 'prontos').map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="inline-flex min-h-[40px] items-center text-[0.9rem] text-[var(--fg2)] hover:text-[var(--lilac)]">
                  {t.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
