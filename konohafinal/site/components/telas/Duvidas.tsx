'use client';
import Glossary from '@/components/sections/Glossary';
import FAQ from '@/components/sections/FAQ';
import Articles from '@/components/sections/Articles';
import { OPEN_HELP } from '@/lib/site';

export default function Duvidas() {
  return (
    <div className="gutter tela">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="titulo-tela">Dúvidas</h1>
        <p className="subtitulo-tela">Procure um termo, veja as perguntas mais comuns ou leia um guia curto.</p>
        <nav aria-label="Nesta página" className="mt-5 flex flex-wrap gap-2">
          {[
            ['#glossario', 'Glossário'],
            ['#faq', 'Perguntas frequentes'],
            ['#artigos', 'Artigos'],
          ].map(([h, l]) => (
            <a key={h} href={h} className="btn btn-secundario btn-pequeno">
              {l}
            </a>
          ))}
          <button type="button" className="btn btn-secundario btn-pequeno" onClick={() => window.dispatchEvent(new Event(OPEN_HELP))}>
            Como usar o site
          </button>
        </nav>
        <div className="mt-12 grid gap-16">
          <Glossary />
          <FAQ />
          <Articles />
        </div>
      </div>
    </div>
  );
}
