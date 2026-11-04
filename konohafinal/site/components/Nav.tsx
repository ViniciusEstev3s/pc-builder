'use client';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PARTS } from '@/lib/parts';
import { useSceneState } from '@/lib/store';
import { TELAS, useRota, type Tela } from '@/lib/rotas';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { quantidadeEscolhida, useMontagem } from '@/lib/montagem';
import BuscaGlobal from './BuscaGlobal';
import LoginGoogle from './LoginGoogle';

const MENU: { id: Tela; rotulo: string }[] = [
  { id: 'aprender', rotulo: 'Aprender' },
  { id: 'montar', rotulo: 'Monte seu PC' },
  { id: 'gamer', rotulo: 'PC Gamer' },
  { id: 'trabalho', rotulo: 'PC Trabalho' },
  { id: 'quiz', rotulo: 'Quiz' },
  { id: 'duvidas', rotulo: 'Dúvidas' },
  { id: 'equipe', rotulo: 'Sobre a equipe' },
];

function Marca() {
  return (
    <a href="#inicio" className="display shrink-0 py-3 text-[0.95rem] font-[800] uppercase tracking-wide" aria-label="Konoha Hardware, ir para o início">
      Konoha<span className="text-[var(--violet)]">.</span>HW
    </a>
  );
}

/** Contador de peças ao lado de "Monte seu PC": mostra o progresso de qualquer lugar do site. */
function SeloMontagem() {
  const { selecao } = useMontagem();
  const n = quantidadeEscolhida(selecao);
  if (!n) return null;
  return (
    <span className="tnum ml-1.5 rounded-full bg-[var(--violet)] px-1.5 py-[1px] text-[0.68rem] font-bold text-[#111]" aria-label={`${n} de 8 peças escolhidas`}>
      {n}/8
    </span>
  );
}

function LinkTela({ id, rotulo, atual, aoClicar, grande }: { id: Tela; rotulo: string; atual: boolean; aoClicar?: () => void; grande?: boolean }) {
  if (grande) {
    return (
      <a
        href={`#${id}`}
        onClick={aoClicar}
        aria-current={atual ? 'page' : undefined}
        className={`display flex items-center justify-between border-b border-[var(--line)] py-3.5 text-[1.15rem] font-[700] ${atual ? 'text-[var(--lilac)]' : 'text-[var(--fg)]'}`}
      >
        <span>
          {rotulo}
          {id === 'montar' && <SeloMontagem />}
        </span>
        <span aria-hidden className="text-[var(--muted)]">
          {atual ? '●' : '→'}
        </span>
      </a>
    );
  }
  return (
    <a
      href={`#${id}`}
      aria-current={atual ? 'page' : undefined}
      className={`relative flex items-center rounded-full px-2 py-1.5 text-[0.82rem] font-semibold transition-colors xl:px-3 xl:py-2 xl:text-[0.86rem] ${
        atual ? 'text-[var(--fg)]' : 'text-[var(--muted)] hover:text-[var(--fg)]'
      }`}
    >
      {rotulo}
      {id === 'montar' && <SeloMontagem />}
      {atual && <motion.span layoutId="nav-dot" className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded bg-[var(--violet)] xl:inset-x-3" />}
    </a>
  );
}

function BarraProgresso() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="h-[2px] origin-left bg-[var(--violet)]" style={{ scaleX: x }} />;
}

export default function Nav() {
  const { tela } = useRota();
  const { phase, active } = useSceneState();
  const [menu, setMenu] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(menuRef, menu);
  const naHistoria = tela === 'aprender';
  const mostrarTrilho = naHistoria && phase === 'parts';
  const telaAtual = TELAS.find((t) => t.id === tela)!;

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      menuBtn.current?.focus();
    };
  }, [menu]);

  // fecha o menu quando a tela muda (ex.: pela busca)
  useEffect(() => setMenu(false), [tela]);

  const rotuloCelular =
    naHistoria && phase === 'parts' && active >= 0 ? `${active + 1}/${PARTS.length} · ${PARTS[active].name}` : telaAtual.rotulo;

  return (
    <>
      <a href="#conteudo" className="sr-only sr-only-focusable">
        Pular para o conteúdo
      </a>
      <header className="gutter fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,255,255,0.94)] pt-[env(safe-area-inset-top,0px)] backdrop-blur-[8px]">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-2 xl:gap-3">
          <Marca />

          <nav aria-label="Seções do site" className="ml-2 hidden gap-0.5 lg:flex xl:ml-4">
            {MENU.map((t) => (
              <LinkTela key={t.id} id={t.id} rotulo={t.rotulo} atual={tela === t.id} />
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <BuscaGlobal id="busca-topo" />
            <LoginGoogle />
          </div>

          <span className="ml-auto min-w-0 truncate text-[0.82rem] font-semibold text-[var(--lilac)] lg:hidden" aria-live="polite">
            {rotuloCelular}
          </span>
          <button
            ref={menuBtn}
            type="button"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu(true)}
            className="btn btn-secundario btn-pequeno shrink-0 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            Menu
          </button>
        </div>
        {naHistoria && <BarraProgresso />}
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gutter fixed inset-0 z-[70] overflow-y-auto bg-white pb-[max(24px,env(safe-area-inset-bottom,0px))] pt-[env(safe-area-inset-top,0px)]"
          >
            <div className="flex h-16 items-center justify-between">
              <Marca />
              <button type="button" onClick={() => setMenu(false)} className="btn btn-secundario btn-pequeno">
                Fechar ×
              </button>
            </div>
            <div className="mt-3">
              <BuscaGlobal id="busca-menu" aoConcluir={() => setMenu(false)} />
            </div>
            <nav aria-label="Seções do site" className="mt-6">
              {TELAS.filter((t) => t.id !== 'prontos').map((t) => (
                <LinkTela key={t.id} id={t.id} rotulo={t.rotulo} atual={tela === t.id} aoClicar={() => setMenu(false)} grande />
              ))}
            </nav>
            <div className="mt-6">
              <LoginGoogle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {naHistoria && (
        <nav
          aria-label="Peças"
          className={`fixed right-[max(16px,env(safe-area-inset-right,0px))] top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 transition-opacity duration-500 lg:flex ${
            mostrarTrilho ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <span className="mono mb-1 text-[0.66rem] uppercase tracking-[0.14em] text-[var(--muted)]">{active >= 0 ? `${active + 1} de ${PARTS.length}` : ''}</span>
          {PARTS.map((p, i) => (
            <a key={p.id} href={`#part-${p.id}`} className="group flex items-center justify-end gap-3" aria-current={active === i ? 'step' : undefined}>
              <span
                className={`text-[0.78rem] font-semibold transition-all ${
                  active === i ? 'text-[var(--fg)] opacity-100' : 'text-[var(--muted)] opacity-0 group-hover:opacity-100'
                }`}
              >
                {p.name}
              </span>
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  active === i ? 'w-6 bg-[var(--violet)]' : i < active ? 'w-2 bg-[var(--fg)]' : 'w-2 bg-[rgba(17,17,17,0.2)] group-hover:bg-[var(--fg)]'
                }`}
              />
            </a>
          ))}
          <a href="#comparar" className="mt-2 text-[0.75rem] font-semibold text-[var(--lilac)] hover:text-[var(--fg)]">
            Pular peças ↓
          </a>
        </nav>
      )}
    </>
  );
}
