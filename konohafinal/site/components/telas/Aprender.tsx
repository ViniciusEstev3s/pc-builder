'use client';
import SceneLayer from '@/components/SceneLayer';
import Story from '@/components/Story';
import Hero from '@/components/sections/Hero';
import ExplodeIntro from '@/components/sections/ExplodeIntro';
import PartSection from '@/components/sections/PartSection';
import Comparisons from '@/components/sections/Comparisons';
import FlowDiagram from '@/components/sections/FlowDiagram';
import Summary from '@/components/sections/Summary';
import { PARTS } from '@/lib/parts';

/** "Anatomia do PC": a narrativa 3D. O PC se desmonta com a rolagem e cada peça é explicada. */
export default function Aprender() {
  return (
    <>
      <SceneLayer />
      <Story />
      <div className="relative z-10">
        <Hero />
        <ExplodeIntro />
        <div id="pecas">
          {PARTS.map((p, i) => (
            <PartSection key={p.id} part={p} total={PARTS.length} prev={PARTS[i - 1]} next={PARTS[i + 1]} />
          ))}
        </div>
        <Comparisons />
        <FlowDiagram />
        <Summary />
        <section className="gutter relative bg-[var(--void)] pb-24 pt-6" aria-labelledby="titulo-proximo">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 rounded-[22px] bg-[#111] p-6 text-white md:p-8">
            <div>
              <h2 id="titulo-proximo" className="display text-[clamp(1.3rem,3vw,1.9rem)] font-[800]">
                Agora monte o seu.
              </h2>
              <p className="mt-2 max-w-[52ch] text-[0.98rem] text-[#d1d5db]">Escolha uma peça por etapa: o montador só mostra as que encaixam e calcula preço e desempenho.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="#montar" className="btn btn-primario">
                Montar meu PC →
              </a>
              <a href="#prontos" className="btn border-white bg-transparent text-white hover:shadow-[3px_3px_0_var(--violet)]">
                Ver PCs prontos
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
