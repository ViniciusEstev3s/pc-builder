'use client';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import HelpDock from '@/components/HelpDock';
import Avisos from '@/components/ui/Avisos';
import Confirmacao from '@/components/ui/Confirmacao';
import Inicio from '@/components/telas/Inicio';
import Montar from '@/components/telas/Montar';
import Equipe from '@/components/telas/Equipe';
import { useEfeitosDaRota, useRota } from '@/lib/rotas';

function Carregando() {
  return (
    <div className="gutter tela" role="status">
      <p className="mx-auto max-w-[1180px] text-[0.95rem] text-[var(--muted)]">Carregando…</p>
    </div>
  );
}

// telas mais pesadas viram arquivos separados, baixados só quando a pessoa abre cada uma
const Aprender = dynamic(() => import('@/components/telas/Aprender'), { loading: Carregando });
const PcGamer = dynamic(() => import('@/components/telas/PcGamer'), { loading: Carregando });
const PcTrabalho = dynamic(() => import('@/components/telas/PcTrabalho'), { loading: Carregando });
const Prontos = dynamic(() => import('@/components/telas/Prontos'), { loading: Carregando });
const Quiz = dynamic(() => import('@/components/telas/Quiz'), { loading: Carregando });
const Duvidas = dynamic(() => import('@/components/telas/Duvidas'), { loading: Carregando });

const TELA = {
  inicio: Inicio,
  aprender: Aprender,
  montar: Montar,
  gamer: PcGamer,
  trabalho: PcTrabalho,
  prontos: Prontos,
  quiz: Quiz,
  duvidas: Duvidas,
  equipe: Equipe,
};

/**
 * Konoha Hardware: um só produto com seis telas (#inicio, #aprender, #montar, #prontos, #quiz, #duvidas).
 * A troca de tela usa o #hash, então Voltar/Avançar e links salvos funcionam em qualquer hospedagem estática.
 */
export default function Page() {
  const { tela } = useRota();
  useEfeitosDaRota();
  const Atual = TELA[tela];
  return (
    <>
      <Nav />
      <main id="conteudo" className="relative" tabIndex={-1}>
        <Atual key={tela} />
      </main>
      <Footer />
      <HelpDock />
      <Avisos />
      <Confirmacao />
    </>
  );
}
