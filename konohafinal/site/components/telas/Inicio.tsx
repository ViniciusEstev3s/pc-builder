'use client';
import { quantidadeEscolhida, useMontagem } from '@/lib/montagem';

const CAMINHOS = [
  {
    href: '#aprender',
    titulo: 'Aprender as peças',
    texto: 'Um PC em 3D se desmonta enquanto você rola. Cada peça explicada com analogias do dia a dia.',
    icone: (
      <>
        <path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4Z" />
        <path d="M4 7.4 12 12l8-4.6M12 12v9.2" />
      </>
    ),
  },
  {
    href: '#montar',
    titulo: 'Monte seu PC',
    texto: 'Escolha peça por peça. Só aparecem as que encaixam, com preço e desempenho no final.',
    icone: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      </>
    ),
  },
  {
    href: '#gamer',
    titulo: 'PC Gamer & 3D',
    texto: 'Configurações para eSports e jogos AAA em 1080p e 1440p com visualizador 3D do setup.',
    icone: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
      </>
    ),
  },
  {
    href: '#trabalho',
    titulo: 'PC Trabalho & AutoCAD',
    texto: 'Produtividade corporativa, programação e estações técnicas para AutoCAD 2D/3D e Revit.',
    icone: (
      <>
        <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
        <path d="M8 21h8M12 16.5V21" />
        <path d="m8.5 10 2.4 2.4L15.8 7.6" />
      </>
    ),
  },
  {
    href: '#quiz',
    titulo: 'Testar o que sei',
    texto: '12 temas de Arquitetura da Computação, com perguntas interativas e explicação detalhada.',
    icone: (
      <>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.9-2.6 2.3-2.6 4" />
        <path d="M12 17.6v.1" />
      </>
    ),
  },
  {
    href: '#equipe',
    titulo: 'Sobre a equipe',
    texto: 'Conheça os acadêmicos de Engenharia de Software responsáveis pelo projeto.',
    icone: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
];

export default function Inicio() {
  const { selecao } = useMontagem();
  const qtd = quantidadeEscolhida(selecao);

  return (
    <div className="gutter tela">
      <div className="mx-auto max-w-[1180px]">
        <section className="grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" aria-labelledby="titulo-inicio">
          <div>
            <h1 id="titulo-inicio" className="display text-[clamp(2rem,5vw,3.4rem)] font-[800] leading-[1.02]">
              Monte seu PC <span className="text-gradient">sem medo de errar.</span>
            </h1>
            <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-[var(--fg2)]">
              Entenda o que cada peça faz, escolha só peças que funcionam juntas e veja o preço e o desempenho antes de comprar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#montar" className="btn btn-primario">
                {qtd > 0 ? `Continuar minha montagem (${qtd}/8)` : 'Montar meu PC'} <span aria-hidden>→</span>
              </a>
              <a href="#aprender" className="btn btn-secundario">
                Entender as peças primeiro
              </a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[22px] border border-[var(--line)] bg-[#0d0f12]">
            <img src="img/pecas/hero-pc-gamer.webp" alt="Gabinete gamer aberto, com fans iluminadas em laranja" className="aspect-square h-full w-full object-cover" />
          </div>
        </section>

        <section className="mt-14" aria-labelledby="titulo-caminhos">
          <h2 id="titulo-caminhos" className="text-[1.15rem] font-bold">
            Por onde você quer começar?
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CAMINHOS.map((c) => (
              <li key={c.href}>
                <a href={c.href} className="cartao neon-hover group flex h-full flex-col p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(255,106,19,0.35)] bg-[rgba(255,106,19,0.1)] text-[var(--lilac)]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {c.icone}
                    </svg>
                  </span>
                  <span className="mt-4 text-[1.02rem] font-bold">{c.titulo}</span>
                  <span className="mt-1.5 text-[0.88rem] leading-relaxed text-[var(--fg2)]">{c.texto}</span>
                  <span className="mt-auto pt-4 text-[0.82rem] font-semibold text-[var(--lilac)]" aria-hidden>
                    Abrir →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.92rem] text-[var(--fg2)]">
            Não conhece algum termo? Use a busca no topo ou abra as{' '}
            <a href="#duvidas" className="link-texto">
              dúvidas e o glossário
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
