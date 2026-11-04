'use client';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { PCS_GAMER } from '@/lib/konoha/pcs-prontos';
import { CATEGORIAS_MONTADOR } from '@/lib/konoha/pecas';
import { gerarRelatorioDesempenho } from '@/lib/konoha/desempenho';
import type { PcPronto } from '@/lib/konoha/tipos';
import { formatarMoeda, montagem, precoTotal, quantidadeEscolhida, selecaoDoPc } from '@/lib/montagem';
import { avisar } from '@/lib/avisos';
import { irPara } from '@/lib/rotas';
import Modal from '@/components/ui/Modal';
import { confirmar } from '@/components/ui/Confirmacao';
import { DivisaoOrcamento } from '@/components/montador/Resultado';

const GamerChassis3D = dynamic(() => import('@/components/three/GamerChassis3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[580px] w-full items-center justify-center rounded-[24px] border border-[var(--line)] bg-[#0f1115] text-[var(--muted)]">
      Carregando Visualizador 3D…
    </div>
  ),
});

type TierId = 'todos' | 'gamer-entrada' | 'gamer-intermediario' | 'gamer-avancado';

async function levarParaMontador(pc: PcPronto, destino: 'montar' | 'resultado') {
  const atual = montagem.atual();
  const qtd = quantidadeEscolhida(atual.selecao);
  const mesma = Object.entries(pc.pecasIds).every(([c, id]) => atual.selecao[c as keyof typeof atual.selecao]?.id === id);
  if (qtd > 0 && !mesma) {
    const ok = await confirmar({
      titulo: 'Substituir sua montagem?',
      mensagem: `Você já escolheu ${qtd} peça(s). Carregar "${pc.tituloCard}" substitui todas as peças pelas deste PC Gamer.`,
      confirmar: 'Substituir',
      cancelar: 'Manter a minha',
    });
    if (!ok) return;
  }
  montagem.carregarPc(pc, 'jogos');
  irPara(destino);
  if (qtd > 0 && !mesma) {
    avisar(`"${pc.tituloCard}" carregado no montador.`, {
      acao: { rotulo: 'Desfazer', fn: () => montagem.restaurar(atual) },
    });
  }
}

function ModalDetalhesGamer({ pc, aoFechar }: { pc: PcPronto; aoFechar: () => void }) {
  const selecao = selecaoDoPc(pc);
  const r = gerarRelatorioDesempenho(selecao, 'jogos');
  const total = precoTotal(selecao);
  const parcela10x = total / 10;

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block rounded-full bg-[var(--violet)] px-2.5 py-0.5 text-[0.72rem] font-bold text-[#111]">
          {pc.etiquetaTopo}
        </span>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--fg2)]">{pc.perfilUso}</p>
        <p className="mt-2 text-[0.88rem] font-semibold text-[var(--lilac)]">
          Classificação Geral: <span className="font-bold text-[var(--fg)]">{r.classificacaoGeral}</span>
        </p>
      </div>

      <div>
        <h3 className="text-[0.95rem] font-bold">Componentes do Sistema</h3>
        <ul className="mt-2 border-t border-[var(--line)]">
          {CATEGORIAS_MONTADOR.map((c) => {
            const p = selecao[c.id];
            if (!p) return null;
            return (
              <li key={c.id} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-[var(--line)] py-2 text-[0.88rem] sm:grid-cols-[130px_1fr_auto]">
                <span className="col-span-2 text-[0.76rem] text-[var(--muted)] sm:col-span-1 sm:text-[0.88rem]">{c.tituloCurto}</span>
                <span className="min-w-0 truncate font-semibold" title={p.nome}>
                  {p.nomeCurto}
                </span>
                <span className="tnum font-medium">{p.preco ? formatarMoeda(p.preco) : 'Incluso'}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink)] p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[0.88rem] font-semibold text-[var(--muted)]">Valor à vista no PIX:</span>
          <span className="tnum display text-[1.45rem] font-[800] text-[var(--fg)]">{formatarMoeda(total)}</span>
        </div>
        <p className="mt-1 text-right text-[0.82rem] text-[var(--muted)]">ou até 10x de {formatarMoeda(parcela10x)} sem juros</p>
      </div>

      <div>
        <h3 className="text-[0.95rem] font-bold">Distribuição do Investimento</h3>
        <div className="mt-3">
          <DivisaoOrcamento selecao={selecao} />
        </div>
      </div>

      <div>
        <h3 className="text-[0.95rem] font-bold">Estimativas de FPS em Jogos</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {r.estimativasFps.map((j) => (
            <div key={j.nome} className="rounded-xl border border-[var(--line)] bg-[var(--ink)] p-3">
              <span className="block truncate text-[0.86rem] font-bold text-[var(--fg)]">{j.nome}</span>
              <span className="block text-[0.75rem] text-[var(--muted)]">{j.genero}</span>
              <div className="mt-2 flex items-center justify-between text-[0.82rem]">
                <span className="text-[var(--fg2)]">1080p:</span>
                <span className="font-bold text-[var(--violet)]">{j.fps1080p.media ? `${j.fps1080p.media} FPS` : j.fps1080p.qualidade}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[0.82rem]">
                <span className="text-[var(--fg2)]">1440p:</span>
                <span className="font-semibold text-[var(--fg)]">{j.fps1440p.media ? `${j.fps1440p.media} FPS` : j.fps1440p.qualidade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-[var(--line)]">
        <button
          type="button"
          className="btn btn-secundario"
          onClick={() => {
            aoFechar();
            levarParaMontador(pc, 'montar');
          }}
        >
          Personalizar no montador
        </button>
        <button
          type="button"
          className="btn btn-primario"
          onClick={() => {
            aoFechar();
            levarParaMontador(pc, 'resultado');
          }}
        >
          Ver relatório completo
        </button>
      </div>
    </div>
  );
}

function CardGamer({ pc, aoAbrir, aoSelecionar3D }: { pc: PcPronto; aoAbrir: () => void; aoSelecionar3D: () => void }) {
  const selecao = selecaoDoPc(pc);
  const total = precoTotal(selecao);
  const parcela10x = total / 10;
  const relatorio = useMemo(() => gerarRelatorioDesempenho(selecao, 'jogos'), [selecao]);

  // Seleciona 4 jogos principais para o resumo do card
  const jogosDestaque = relatorio.estimativasFps.slice(0, 4);

  return (
    <li className="cartao flex min-w-0 flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--ink)]">
        <img src={pc.imagem} alt={pc.nome || pc.tituloCard} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-[rgba(15,17,21,0.85)] px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-[var(--violet)] backdrop-blur-[6px] border border-[var(--line)]">
          {pc.etiquetaTopo}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.18rem] font-bold leading-snug">{pc.tituloCard}</h3>
        <p className="mt-1 text-[0.86rem] leading-relaxed text-[var(--fg2)]">{pc.chamadaCurta}</p>

        {/* Peças-chave */}
        <div className="mt-4">
          <span className="text-[0.74rem] font-bold uppercase tracking-wider text-[var(--muted)]">Configuração Base:</span>
          <ul className="mt-1.5 grid gap-1 text-[0.82rem] text-[var(--fg2)]">
            {pc.componentesPrincipais.slice(0, 4).map((c) => (
              <li key={c} className="truncate">
                • {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Estimativa de FPS em jogos com barras */}
        <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--ink)] p-3.5">
          <span className="block text-[0.74rem] font-bold uppercase tracking-wider text-[var(--muted)]">Média Estimada (1080p):</span>
          <div className="mt-2 space-y-2">
            {jogosDestaque.map((j) => {
              const fps = j.fps1080p.media || 0;
              const pct = Math.min(100, Math.round((fps / 240) * 100));
              return (
                <div key={j.nome}>
                  <div className="flex items-center justify-between text-[0.78rem]">
                    <span className="truncate font-medium text-[var(--fg)]">{j.nome.split('(')[0]}</span>
                    <span className="font-bold text-[var(--violet)]">{fps ? `${fps} FPS` : j.fps1080p.qualidade}</span>
                  </div>
                  {fps > 0 && (
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(17,17,17,0.1)] dark:bg-[rgba(255,255,255,0.1)]">
                      <div
                        className="h-full rounded-full bg-[var(--violet)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé com Preço e Ações */}
        <div className="mt-auto pt-5 border-t border-[var(--line)]">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.78rem] text-[var(--muted)]">À vista no PIX</span>
            <span className="tnum text-[1.28rem] font-extrabold text-[var(--fg)]">{formatarMoeda(total)}</span>
          </div>
          <p className="text-right text-[0.76rem] text-[var(--muted)]">ou 10x de {formatarMoeda(parcela10x)}</p>

          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="btn btn-primario btn-pequeno w-full justify-center" onClick={aoAbrir}>
                Ver detalhes
              </button>
              <button
                type="button"
                className="btn btn-secundario btn-pequeno w-full justify-center"
                onClick={() => levarParaMontador(pc, 'montar')}
              >
                Personalizar
              </button>
            </div>
            <button
              type="button"
              className="text-center text-[0.78rem] font-semibold text-[var(--muted)] hover:text-[var(--violet)] transition-colors py-1"
              onClick={aoSelecionar3D}
            >
              🔍 Ver no Visualizador 3D ↑
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function PcGamer() {
  const [tierFiltro, setTierFiltro] = useState<TierId>('todos');
  const [tier3D, setTier3D] = useState<'gamer-entrada' | 'gamer-intermediario' | 'gamer-avancado'>('gamer-intermediario');
  const [aberto, setAberto] = useState<PcPronto | null>(null);

  const listaFiltrada = useMemo(() => {
    const base =
      tierFiltro === 'todos'
        ? PCS_GAMER
        : PCS_GAMER.filter((p) => {
            if (p.id === tierFiltro) return true;
            if (tierFiltro === 'gamer-entrada' && p.nivel === 'Entrada') return true;
            if (tierFiltro === 'gamer-intermediario' && p.nivel === 'Intermediário') return true;
            if (tierFiltro === 'gamer-avancado' && p.nivel === 'Avançado') return true;
            return false;
          });
    return [...base].sort((a, b) => precoTotal(selecaoDoPc(a)) - precoTotal(selecaoDoPc(b)));
  }, [tierFiltro]);

  return (
    <div className="gutter tela">
      <div className="mx-auto max-w-[1180px]">
        {/* Cabeçalho */}
        <div>
          <span className="mono text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[var(--violet)]">
            Konoha Hardware · Linha Gamer
          </span>
          <h1 className="titulo-tela mt-1">PC Gamer</h1>
          <p className="subtitulo-tela">
            Configurações balanceadas para eSports em alta taxa de quadros (144Hz+) e títulos AAA pesados em Full HD e Quad HD. Peças testadas, sem gargalos e com fluxo de ar planejado.
          </p>
        </div>

        {/* Visualizador 3D do Gabinete e Hardware */}
        <div id="viewer3d" className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[1.05rem] font-bold text-[var(--fg)]">Visualizador 3D do Setup Gamer (Gabinete Aquário)</h2>
              <p className="text-[0.82rem] text-[var(--muted)]">
                Troque o nível para ver o cooler e a placa de vídeo de cada PC. Clique numa peça para saber o que ela faz, retire ou recoloque qualquer uma, controle o LED e veja o caminho do ar e a temperatura mudarem.
              </p>
            </div>
            <div className="segmentado text-[0.8rem]" role="tablist" aria-label="Nível no 3D">
              {(
                [
                  ['gamer-entrada', 'Entrada'],
                  ['gamer-intermediario', 'Intermediário'],
                  ['gamer-avancado', 'Avançado'],
                ] as const
              ).map(([id, rotulo]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tier3D === id}
                  onClick={() => setTier3D(id)}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          </div>
          <GamerChassis3D tier={tier3D} />
        </div>

        {/* Filtro de Categorias / Níveis */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div className="segmentado" role="tablist" aria-label="Filtrar por nível gamer">
            {(
              [
                ['todos', 'Todos os Níveis'],
                ['gamer-entrada', 'Nível Entrada (1080p)'],
                ['gamer-intermediario', 'Nível Intermediário (1080p Ultra)'],
                ['gamer-avancado', 'Nível Avançado (1440p Quad HD)'],
              ] as const
            ).map(([id, rotulo]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tierFiltro === id}
                onClick={() => setTierFiltro(id)}
              >
                {rotulo}
              </button>
            ))}
          </div>
          <span className="text-[0.82rem] text-[var(--muted)]">
            Exibindo <strong>{listaFiltrada.length}</strong> de <strong>{PCS_GAMER.length}</strong> máquinas
          </span>
        </div>

        {/* Lista de PCs Gamer */}
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {listaFiltrada.map((pc) => (
            <CardGamer
              key={pc.id}
              pc={pc}
              aoAbrir={() => setAberto(pc)}
              aoSelecionar3D={() => {
                const mapTier =
                  pc.nivel === 'Entrada'
                    ? 'gamer-entrada'
                    : pc.nivel === 'Avançado'
                    ? 'gamer-avancado'
                    : 'gamer-intermediario';
                setTier3D(mapTier);
                document.getElementById('viewer3d')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </ul>

        {/* Nota explicativa de metodologia */}
        <div className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--ink)] p-5 text-[0.84rem] leading-relaxed text-[var(--muted)]">
          <p>
            <strong>Nota técnica de estimativas:</strong> As médias de FPS são calculadas cruzando benchmarks públicos confiáveis (TechPowerUp e Tom&apos;s Hardware) com a largura de banda de memória em Dual-Channel e escalonamento de processador. O desempenho em jogos reais varia conforme temperatura ambiente, resolução e drivers de vídeo.
          </p>
        </div>
      </div>

      <Modal aberto={!!aberto} aoFechar={() => setAberto(null)} titulo={aberto?.tituloCard ?? ''}>
        {aberto && <ModalDetalhesGamer pc={aberto} aoFechar={() => setAberto(null)} />}
      </Modal>
    </div>
  );
}
