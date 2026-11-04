'use client';
import { motion } from 'framer-motion';

/* ---------- ícones de linha (24×24) ---------- */
const I = {
  cube: (
    <>
      <path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4Z" />
      <path d="M4 7.4 12 12l8-4.6M12 12v9.2" />
    </>
  ),
  compare: (
    <>
      <path d="M7 4v11a3 3 0 0 0 3 3h3" />
      <path d="m10.5 15.5 2.5 2.5-2.5 2.5" />
      <path d="M17 20V9a3 3 0 0 0-3-3h-3" />
      <path d="M13.5 8.5 11 6l2.5-2.5" />
      <circle cx="7" cy="4" r="1.6" />
      <circle cx="17" cy="20" r="1.6" />
    </>
  ),
  flow: (
    <>
      <rect x="3" y="3.5" width="7" height="5" rx="1.2" />
      <rect x="14" y="15.5" width="7" height="5" rx="1.2" />
      <path d="M6.5 8.5v4a2 2 0 0 0 2 2h9v1" />
      <path d="M17.5 3.5v2.5M17.5 9.5V12" />
      <path d="m15.8 5.2 1.7-1.7 1.7 1.7" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
      <path d="M8.5 7.5h7M8.5 11h5" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.9-2.6 2.3-2.6 4" />
      <path d="M12 17.6v.1" />
    </>
  ),
  done: (
    <>
      <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
      <path d="M8 21h8M12 16.5V21" />
      <path d="m8.5 10 2.4 2.4L15.8 7.6" />
    </>
  ),
};

type Tile = { href: string; label: string; hint: string; icon: keyof typeof I };
const LEFT: Tile[] = [
  { href: '#comparar', label: 'Comparar', hint: 'SSD × HD, água × ar, RAM × SSD', icon: 'compare' },
  { href: '#conexoes', label: 'Conexões', hint: 'Como dados e energia circulam', icon: 'flow' },
  { href: '#glossario', label: 'Glossário', hint: 'Siglas explicadas', icon: 'book' },
];
const RIGHT: Tile[] = [
  { href: '#resumo', label: 'PC montado', hint: 'Tudo rotulado no final', icon: 'done' },
  { href: '#montar', label: 'Montar', hint: 'Escolha as suas peças', icon: 'cube' },
];

function TileLink({ t, i, side }: { t: Tile; i: number; side: 'l' | 'r' }) {
  return (
    <motion.a
      href={t.href}
      initial={{ x: side === 'l' ? -24 : 24 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.9, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="hud-tile group relative block"
    >
      <span className="hud-tile__inner">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {I[t.icon]}
        </svg>
        <span className="mono mt-1.5 text-[0.6rem] uppercase leading-tight tracking-[0.14em]">{t.label}</span>
      </span>
      <span
        className={`hud-hint mono pointer-events-none absolute top-1/2 hidden w-max -translate-y-1/2 text-[0.68rem] uppercase tracking-[0.12em] md:block ${
          side === 'l' ? 'left-[calc(100%+14px)]' : 'right-[calc(100%+14px)] text-right'
        }`}
      >
        {t.hint}
      </span>
    </motion.a>
  );
}

export default function Hero() {
  const hex = '#ff6a13';

  return (
    <section
      id="hero"
      className="hud relative flex min-h-[100svh] flex-col justify-end md:block md:h-[100svh] md:min-h-[640px]"
      style={{ '--hud': hex } as React.CSSProperties}
    >
      {/* atalhos laterais (desktop) */}
      <nav aria-label="Atalhos" className="absolute left-[max(40px,env(safe-area-inset-left,0px))] top-[15%] hidden flex-col gap-4 md:flex">
        {LEFT.map((t, i) => (
          <TileLink key={t.href} t={t} i={i} side="l" />
        ))}
      </nav>
      <nav aria-label="Mais atalhos" className="absolute right-[max(40px,env(safe-area-inset-right,0px))] top-[15%] hidden flex-col gap-4 md:flex">
        {RIGHT.map((t, i) => (
          <TileLink key={t.href} t={t} i={i + 3} side="r" />
        ))}
      </nav>

      {/* barra de HUD inferior */}
      <div className="relative w-full md:absolute md:inset-x-0 md:bottom-0">
        {/* mobile: atalhos em linha */}
        <nav aria-label="Atalhos" className="gutter mb-5 grid grid-cols-5 gap-2 md:hidden">
          {[...LEFT, ...RIGHT].map((t, i) => (
            <TileLink key={t.href} t={t} i={i} side="l" />
          ))}
        </nav>

        <div className="grid items-end md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* painel esquerdo */}
          <div className="hud-panel hud-panel--l gutter relative pb-6 pt-8 md:pb-9 md:pr-16 md:pt-10">
            <p className="mono text-[0.62rem] uppercase tracking-[0.24em] text-[var(--lilac)]">
              Anatomia do PC · do zero
            </p>
            <h1 className="display mt-2.5 text-[clamp(1.35rem,2.4vw,2.15rem)] font-[800] uppercase leading-[1.05]">
              <motion.span className="block" initial={{ y: 18 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                Abra a caixa.
              </motion.span>
              <motion.span
                className="text-gradient block"
                initial={{ y: 18 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Entenda cada peça.
              </motion.span>
            </h1>
          </div>

          {/* centro: cores + botões */}
          <div className="gutter flex flex-col items-start gap-4 pb-7 md:items-center md:px-6 md:pb-8">
            <div className="flex flex-wrap gap-3">
              <a href="#explode" className="hud-btn hud-btn--primary display">
                Começar a desmontar
              </a>
              <a href="#montar" className="hud-btn display">
                Montar meu PC
              </a>
            </div>
          </div>

          {/* painel direito */}
          <div className="hud-panel hud-panel--r gutter relative hidden pb-9 pt-10 text-right md:block md:pl-16">
            <p className="mono ml-auto mr-16 max-w-[34ch] text-[0.74rem] uppercase leading-[1.7] tracking-[0.14em] text-[var(--fg2)]">
              12 peças explicadas com analogias do dia a dia e especificações em português claro
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

