'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PARTS } from '@/lib/parts';
import { scene } from '@/lib/store';
import { OPEN_HELP, SHORTCUTS } from '@/lib/site';
import { irPara, useRota, type Tela } from '@/lib/rotas';
import { useFocusTrap } from '@/lib/useFocusTrap';

/** Ajuda contextual: o passo a passo muda conforme a tela em que a pessoa está. */
const PASSOS: Record<Tela, [string, string][]> = {
  inicio: [
    ['Escolha um caminho', 'Aprender as peças, montar o seu PC, ver PCs prontos ou testar o que sabe no quiz.'],
    ['Use a busca do topo', 'Ela encontra peças do catálogo e termos do glossário ao mesmo tempo.'],
    ['Seu progresso fica salvo', 'A montagem é guardada neste navegador. O número ao lado de "Montar PC" mostra quantas peças você já escolheu.'],
  ],
  aprender: [
    ['Role a página', 'O PC se desmonta sozinho. Cada peça aparece com analogia, função, especificações e dica de compra.'],
    ['Pule quando quiser', 'Use a trilha à direita (ou as setas ← →) para ir de uma peça a outra, ou "Pular peças".'],
    ['Termos com "?"', 'Toque nas etiquetas com "?" para ver o significado sem sair da página.'],
  ],
  montar: [
    ['Uma peça por etapa', 'Comece pelo processador. Ao escolher, o montador abre a próxima etapa sozinho.'],
    ['Só aparecem peças que encaixam', 'As que conflitam com sua montagem ficam escondidas. Marque "Mostrar peças que não encaixam" para ver o motivo.'],
    ['Errou?', 'Clique em "✓ Escolhida" para remover. Remover, trocar e limpar sempre oferecem "Desfazer".'],
    ['Veja o resultado', 'Com as 8 peças, o botão "Ver resultado" mostra preço, nível, FPS estimado e limitações.'],
  ],
  prontos: [
    ['Compare as opções', 'Alterne entre PCs para jogos e para trabalho. Cada cartão mostra as peças principais e o preço.'],
    ['Abra os detalhes', '"Ver detalhes" lista as 8 peças, mostra para onde vai o dinheiro e as limitações.'],
    ['Personalize', '"Personalizar no montador" carrega o PC no montador para você trocar o que quiser.'],
  ],
  gamer: [
    ['Explore os níveis', 'Nível Entrada (1080p), Intermediário (1080p Ultra) e Avançado (1440p Quad HD).'],
    ['Visualizador 3D', 'Gire o chassi em 360°, teste as cores de iluminação Chakra e inspecione o setup.'],
    ['Médias de FPS', 'Confira o desempenho estimado nos principais jogos competitivos e títulos AAA.'],
    ['Personalize', 'Leve qualquer configuração para o montador clicando em "Personalizar".'],
  ],
  trabalho: [
    ['Identifique seu perfil', 'Máquinas para escritório, desenvolvimento de software e projetos no AutoCAD.'],
    ['Atenção ao AutoCAD', 'Consulte o guia técnico para entender os requisitos de GPU dedicada e memória RAM.'],
    ['Personalize', 'Carregue a configuração no montador para ajustar armazenamento ou memória conforme sua necessidade.'],
  ],
  quiz: [
    ['Escolha um tema', 'Cada tema tem 3 perguntas de múltipla escolha.'],
    ['Responda e confirme', 'Depois de confirmar, você vê se acertou e uma explicação curta.'],
    ['Pelo teclado', 'A–D escolhem a alternativa e Enter confirma ou avança.'],
  ],
  duvidas: [
    ['Procure um termo', 'Digite no campo do glossário. Se não achar, ele sugere o termo mais parecido.'],
    ['Perguntas frequentes', 'As dúvidas mais comuns de quem vai montar o primeiro PC.'],
    ['Artigos', 'Guias curtos de compatibilidade, periféricos e manutenção.'],
  ],
  equipe: [['Sobre o projeto', 'Projeto acadêmico de Engenharia de Software. Use o menu para voltar a qualquer seção.']],
};

const ORDEM_ATALHO: Tela[] = ['inicio', 'aprender', 'montar', 'prontos', 'quiz', 'duvidas'];

function isTyping(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
}

export default function HelpDock() {
  const { tela, ancora } = useRota();
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement>(null);
  useFocusTrap(panel, open);

  // abrir pelo menu/rodapé (links "#como-usar")
  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href="#como-usar"]');
      if (a) {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener(OPEN_HELP, onOpen);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener(OPEN_HELP, onOpen);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // atalhos de teclado (heurística 7: aceleradores para quem já conhece)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && /^Digit[1-6]$/.test(e.code)) {
        e.preventDefault();
        setOpen(false);
        irPara(ORDEM_ATALHO[Number(e.code.slice(-1)) - 1]);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (isTyping(e.target)) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]:not(#help-panel), [role="alertdialog"]')) return;
      if (e.key === '?') {
        e.preventDefault();
        opener.current = document.activeElement as HTMLElement;
        setOpen((o) => !o);
      } else if (e.key === '/') {
        e.preventDefault();
        setOpen(false);
        const topo = document.getElementById('busca-topo');
        if (topo && topo.offsetParent !== null) {
          topo.focus();
        } else {
          irPara('glossario');
          setTimeout(() => document.getElementById('glossary-search')?.focus({ preventScroll: true }), 300);
        }
      } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && scene.phase === 'parts' && scene.active >= 0 && document.getElementById('explode')) {
        e.preventDefault();
        const next = scene.active + (e.key === 'ArrowRight' ? 1 : -1);
        const target = next >= PARTS.length ? 'comparar' : next < 0 ? 'explode' : `part-${PARTS[next].id}`;
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else opener.current?.focus?.();
  }, [open]);

  const btn =
    'grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-[var(--fg)] bg-white text-[var(--fg)] shadow-[3px_3px_0_var(--violet)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5';

  return (
    <>
      <div
        className={`fixed z-50 flex flex-col gap-3 ${tela === 'montar' && ancora !== 'resultado' ? 'max-lg:!bottom-[calc(max(16px,env(safe-area-inset-bottom,0px))+76px)]' : ''}`}
        style={{ right: 'max(16px, env(safe-area-inset-right, 0px))', bottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
      >
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={btn}
              aria-label="Voltar ao topo"
              title="Voltar ao topo"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
        <button
          type="button"
          className={btn + ' display text-[1.1rem] font-[800]'}
          aria-expanded={open}
          aria-controls="help-panel"
          aria-label="Ajuda: como usar esta tela"
          title="Ajuda (tecla ?)"
          onClick={() => {
            opener.current = document.activeElement as HTMLElement;
            setOpen((o) => !o);
          }}
        >
          ?
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-[rgba(17,17,17,0.25)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.section
              ref={panel}
              id="help-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-title"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed z-[60] max-h-[80svh] w-[min(420px,calc(100vw-32px))] overflow-y-auto rounded-[22px] border-[1.5px] border-[var(--fg)] bg-white p-6 shadow-[6px_6px_0_var(--violet)]"
              style={{ right: 'max(16px, env(safe-area-inset-right, 0px))', bottom: 'calc(max(16px, env(safe-area-inset-bottom, 0px)) + 64px)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 id="help-title" className="display text-[1.15rem] font-[800]">
                  Como usar esta tela
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-secundario btn-pequeno shrink-0"
                >
                  Fechar ×
                </button>
              </div>
              <ol className="mt-4 grid gap-3">
                {PASSOS[tela].map(([t, d], i) => (
                  <li key={t} className="flex gap-3">
                    <span className="display grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--violet)] text-[0.8rem] font-[800]">{i + 1}</span>
                    <span className="min-w-0">
                      <strong className="block text-[0.95rem]">{t}</strong>
                      <span className="block text-[0.88rem] leading-snug text-[var(--fg2)]">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <h3 className="eyebrow mt-6">Atalhos de teclado</h3>
              <dl className="mt-2 grid gap-2">
                {SHORTCUTS.map(([k, d]) => (
                  <div key={k} className="flex items-center gap-3 text-[0.88rem]">
                    <dt className="w-24 shrink-0">
                      <kbd className="mono rounded border border-[var(--fg)] bg-[var(--ink)] px-1.5 py-0.5 text-[0.72rem] shadow-[0_2px_0_var(--fg)]">{k}</kbd>
                    </dt>
                    <dd className="text-[var(--fg2)]">{d}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                {[
                  ['#faq', 'Perguntas frequentes'],
                  ['#glossario', 'Glossário'],
                  ['#equipe', 'Sobre a equipe'],
                ].map(([h, l]) => (
                  <a
                    key={h}
                    href={h}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--lilac)] hover:border-[var(--fg)] hover:text-[var(--fg)]"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
