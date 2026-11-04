'use client';
import { useRota } from '@/lib/rotas';
import Montador from '@/components/montador/Montador';
import Resultado from '@/components/montador/Resultado';
import ConferirPecas from '@/components/montador/ConferirPecas';

export default function Montar() {
  const { ancora } = useRota();
  const resultado = ancora === 'resultado';
  const conferir = ancora === 'conferir';

  return (
    <div className="gutter tela pb-28 lg:pb-20">
      <div className="mx-auto max-w-[1280px]">
        {resultado ? (
          <Resultado />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="titulo-tela">Montar seu PC</h1>
                <p className="subtitulo-tela">
                  {conferir
                    ? 'Confira se peças que você já tem ou viu em outra loja funcionam juntas.'
                    : 'Escolha uma peça em cada etapa. Só aparecem as que encaixam no que você já escolheu.'}
                </p>
              </div>
              <div className="segmentado grid w-full grid-cols-2 sm:inline-flex sm:w-auto" role="tablist" aria-label="Modo do montador">
                <a href="#montar" role="tab" aria-selected={!conferir} className={`rounded-full px-4 py-2 text-center text-[0.86rem] font-semibold ${!conferir ? 'bg-[#111] text-white' : 'text-[var(--fg2)]'}`}>
                  Montar pelo catálogo
                </a>
                <a href="#conferir" role="tab" aria-selected={conferir} className={`rounded-full px-4 py-2 text-center text-[0.86rem] font-semibold ${conferir ? 'bg-[#111] text-white' : 'text-[var(--fg2)]'}`}>
                  Conferir minhas peças
                </a>
              </div>
            </div>
            <div className="mt-6">{conferir ? <ConferirPecas /> : <Montador />}</div>
          </>
        )}
      </div>
    </div>
  );
}
