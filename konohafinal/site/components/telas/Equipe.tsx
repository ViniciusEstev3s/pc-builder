import { EQUIPE_DESENVOLVIMENTO } from '@/lib/konoha/pcs-prontos';

export default function Equipe() {
  return (
    <div className="gutter tela">
      <div className="mx-auto max-w-[1180px]">
        {/* Cabeçalho */}
        <div>
          <span className="mono text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[var(--violet)]">
            Projeto Acadêmico · Engenharia de Software
          </span>
          <h1 className="titulo-tela mt-1">Sobre a equipe</h1>
          <p className="subtitulo-tela">
            O <strong>Konoha Hardware</strong> foi idealizado e construído por estudantes de Engenharia de Software como uma plataforma educacional para democratizar o entendimento da Arquitetura da Computação e simplificar a montagem de computadores com compatibilidade 100% verificada.
          </p>
        </div>

        {/* Grade de Integrantes */}
        <div className="mt-10">
          <h2 className="text-[1.1rem] font-bold text-[var(--fg)]">Integrantes do Projeto</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EQUIPE_DESENVOLVIMENTO.map((m) => (
              <li
                key={m.nome}
                className="cartao group relative flex flex-col justify-between overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl border border-[rgba(255,106,19,0.35)] bg-[rgba(255,106,19,0.1)] text-[1rem] font-extrabold text-[var(--violet)] shadow-sm group-hover:scale-105 transition-transform"
                    aria-hidden
                  >
                    {m.iniciais}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-[1.02rem] leading-snug text-[var(--fg)]">{m.nome}</span>
                    <span className="mt-1 inline-block rounded-full bg-[var(--ink)] px-2.5 py-0.5 text-[0.75rem] font-semibold text-[var(--lilac)]">
                      {m.funcao}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-[var(--line)] pt-3 text-[0.78rem] text-[var(--muted)]">
                  Engenharia de Software · Konoha Hardware
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Informações do Projeto e Tecnologias */}
        <div className="mt-14 rounded-[24px] border border-[var(--line)] bg-[var(--ink)] p-6 sm:p-8">
          <h3 className="text-[1.15rem] font-bold text-[var(--fg)]">Stack Tecnológica & Metodologia</h3>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--fg2)]">
            A aplicação foi concebida unificando o aprendizado visual em 3D de Arquitetura de Computadores com uma ferramenta prática de recomendação e conferência de peças de hardware em tempo real.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              'Next.js 15 (App Router)',
              'React 19',
              'Three.js & React Three Fiber',
              'TypeScript',
              'Tailwind CSS',
              'Framer Motion',
              'Google Identity Services OAuth 2.0',
              'Arquitetura da Computação (Von Neumann)',
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-[var(--fg)] shadow-xs dark:bg-[#121417]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
