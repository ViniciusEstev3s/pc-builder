'use client';
import { useMemo, useState } from 'react';
import { PCS_TRABALHO } from '@/lib/konoha/pcs-prontos';
import { CATEGORIAS_MONTADOR } from '@/lib/konoha/pecas';
import { gerarRelatorioDesempenho } from '@/lib/konoha/desempenho';
import type { PcPronto } from '@/lib/konoha/tipos';
import { formatarMoeda, montagem, precoTotal, quantidadeEscolhida, selecaoDoPc } from '@/lib/montagem';
import { avisar } from '@/lib/avisos';
import { irPara } from '@/lib/rotas';
import Modal from '@/components/ui/Modal';
import { confirmar } from '@/components/ui/Confirmacao';
import { DivisaoOrcamento } from '@/components/montador/Resultado';

type TierTrabalhoId = 'todos' | 'trabalho-basico' | 'trabalho-intermediario' | 'trabalho-profissional';

const MATRIZ_PRODUTIVIDADE = [
  {
    tarefa: 'AutoCAD 2D (Plantas Baixas)',
    basico: { ok: true, nota: 'Atende bem projetos simples' },
    intermediario: { ok: true, nota: 'Excelente e ágil' },
    profissional: { ok: true, nota: 'Desempenho máximo' },
  },
  {
    tarefa: 'AutoCAD 3D & Modelagem Técnica',
    basico: { ok: false, nota: 'Inadequado (sem VRAM dedicada)' },
    intermediario: { ok: false, nota: 'Limitado a modelos 3D simples' },
    profissional: { ok: true, nota: 'Fluido com GPU RTX 8GB' },
  },
  {
    tarefa: 'Revit / BIM / SolidWorks',
    basico: { ok: false, nota: 'Não recomendado' },
    intermediario: { ok: false, nota: 'Apenas visualização leve' },
    profissional: { ok: true, nota: 'Atende projetos estruturais' },
  },
  {
    tarefa: 'Programação & Docker Containers',
    basico: { ok: true, nota: 'Atende scripts e web leve' },
    intermediario: { ok: true, nota: 'Excelente (32GB DDR5 + Zen 4)' },
    profissional: { ok: true, nota: 'Excelente + compilação veloz' },
  },
  {
    tarefa: 'Planilhas Pesadas & Banco de Dados',
    basico: { ok: true, nota: 'Planilhas médias' },
    intermediario: { ok: true, nota: 'Ideal para milhões de linhas' },
    profissional: { ok: true, nota: 'Processamento rápido' },
  },
  {
    tarefa: 'Múltiplos Monitores (2 ou mais)',
    basico: { ok: false, nota: 'Limitado às saídas da placa-mãe' },
    intermediario: { ok: true, nota: '2 monitores digitais' },
    profissional: { ok: true, nota: 'Até 4 telas simultâneas' },
  },
];

async function levarParaMontador(pc: PcPronto, destino: 'montar' | 'resultado') {
  const atual = montagem.atual();
  const qtd = quantidadeEscolhida(atual.selecao);
  const mesma = Object.entries(pc.pecasIds).every(([c, id]) => atual.selecao[c as keyof typeof atual.selecao]?.id === id);
  if (qtd > 0 && !mesma) {
    const ok = await confirmar({
      titulo: 'Substituir sua montagem?',
      mensagem: `Você já escolheu ${qtd} peça(s). Carregar "${pc.tituloCard}" substitui todas as peças pelas deste PC de Trabalho.`,
      confirmar: 'Substituir',
      cancelar: 'Manter a minha',
    });
    if (!ok) return;
  }
  montagem.carregarPc(pc, 'trabalho');
  irPara(destino);
  if (qtd > 0 && !mesma) {
    avisar(`"${pc.tituloCard}" carregado no montador.`, {
      acao: { rotulo: 'Desfazer', fn: () => montagem.restaurar(atual) },
    });
  }
}

function ModalDetalhesTrabalho({ pc, aoFechar }: { pc: PcPronto; aoFechar: () => void }) {
  const selecao = selecaoDoPc(pc);
  const r = gerarRelatorioDesempenho(selecao, 'trabalho');
  const total = precoTotal(selecao);
  const parcela10x = total / 10;

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block rounded-full bg-[var(--violet)] px-2.5 py-0.5 text-[0.72rem] font-bold text-[#111]">
          {pc.etiquetaTopo}
        </span>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--fg2)]">{pc.finalidade}</p>
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

      {pc.limitacoes && pc.limitacoes.length > 0 && (
        <div className="rounded-2xl border border-[#b45309]/30 bg-[#b45309]/10 p-4">
          <h3 className="text-[0.9rem] font-bold text-[#b45309]">Limitações Técnicas a Considerar:</h3>
          <ul className="mt-2 space-y-1.5 text-[0.84rem] leading-relaxed text-[var(--fg2)]">
            {pc.limitacoes.map((lim, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#b45309] font-bold" aria-hidden>
                  •
                </span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-[0.95rem] font-bold">Avaliação por Área de Trabalho</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {r.avaliacaoAplicacoesTrabalho.map((app) => (
            <div key={app.area} className="rounded-xl border border-[var(--line)] bg-[var(--ink)] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[0.86rem] font-bold text-[var(--fg)]">{app.area}</span>
                <span className="rounded-full bg-[var(--line)] px-2 py-0.5 text-[0.72rem] font-semibold">
                  {app.nivelAdequacao}
                </span>
              </div>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-[var(--muted)]">{app.detalhe}</p>
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

function CardTrabalho({ pc, aoAbrir }: { pc: PcPronto; aoAbrir: () => void }) {
  const selecao = selecaoDoPc(pc);
  const total = precoTotal(selecao);
  const parcela10x = total / 10;

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

        {/* Resumo de Memória e Armazenamento */}
        <div className="mt-3 flex flex-wrap gap-2 text-[0.78rem]">
          {pc.memoriaResumo && (
            <span className="rounded-lg border border-[var(--line)] bg-[var(--ink)] px-2.5 py-1 font-semibold text-[var(--fg)]">
              RAM: {pc.memoriaResumo}
            </span>
          )}
          {pc.armazenamentoResumo && (
            <span className="rounded-lg border border-[var(--line)] bg-[var(--ink)] px-2.5 py-1 font-semibold text-[var(--fg)]">
              SSD: {pc.armazenamentoResumo}
            </span>
          )}
        </div>

        {/* Especificações */}
        <div className="mt-4">
          <span className="text-[0.74rem] font-bold uppercase tracking-wider text-[var(--muted)]">Configuração Base:</span>
          <ul className="mt-1.5 grid gap-1 text-[0.82rem] text-[var(--fg2)]">
            {(pc.especificacoesLista || pc.componentesPrincipais).slice(0, 4).map((c) => (
              <li key={c} className="truncate">
                • {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Alerta de Limitação em Destaque */}
        {pc.limitacaoCurta && (
          <div className="mt-4 rounded-xl border border-[#b45309]/30 bg-[#b45309]/10 p-3 text-[0.8rem] leading-snug text-[#b45309]">
            <strong>Atenção técnica:</strong> {pc.limitacaoCurta}
          </div>
        )}

        {/* Rodapé com Preço e Ações */}
        <div className="mt-auto pt-5 border-t border-[var(--line)]">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.78rem] text-[var(--muted)]">À vista no PIX</span>
            <span className="tnum text-[1.28rem] font-extrabold text-[var(--fg)]">{formatarMoeda(total)}</span>
          </div>
          <p className="text-right text-[0.76rem] text-[var(--muted)]">ou 10x de {formatarMoeda(parcela10x)}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
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
        </div>
      </div>
    </li>
  );
}

export default function PcTrabalho() {
  const [tierFiltro, setTierFiltro] = useState<TierTrabalhoId>('todos');
  const [aberto, setAberto] = useState<PcPronto | null>(null);

  const listaFiltrada = useMemo(() => {
    const base =
      tierFiltro === 'todos'
        ? PCS_TRABALHO
        : PCS_TRABALHO.filter((p) => {
            if (p.id === tierFiltro) return true;
            if (tierFiltro === 'trabalho-basico' && p.nivel === 'Básico') return true;
            if (tierFiltro === 'trabalho-intermediario' && p.nivel === 'Intermediário') return true;
            if (tierFiltro === 'trabalho-profissional' && p.nivel === 'Profissional') return true;
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
            Konoha Hardware · Produtividade & Engenharia
          </span>
          <h1 className="titulo-tela mt-1">PC Trabalho & Produtividade</h1>
          <p className="subtitulo-tela">
            Configurações balanceadas para cada perfil produtivo: do uso corporativo essencial (estudos e navegação) à multitarefa avançada em programação e projetos técnicos no AutoCAD 2D e 3D.
          </p>
        </div>

        {/* Guia Técnico e Alertas de Requisitos para AutoCAD */}
        <section id="autocad" className="mt-8 rounded-[24px] border border-[var(--line)] bg-[var(--ink)] p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--line)] pb-4">
            <div>
              <h2 className="text-[1.2rem] font-bold text-[var(--fg)]">Guia de Requisitos Técnicos: AutoCAD & Softwares Profissionais</h2>
              <p className="text-[0.86rem] text-[var(--muted)]">
                Entenda a diferença real entre vídeo integrado e placa dedicada para não errar na escolha.
              </p>
            </div>
            <span className="rounded-full bg-[var(--violet)] px-2.5 py-0.5 text-[0.72rem] font-bold text-[#111]">
              Arquitetura de Hardware
            </span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5 dark:bg-[#121417]">
              <span className="text-[0.78rem] font-bold text-[var(--muted)] uppercase tracking-wider">Perfil Básico</span>
              <h3 className="mt-1 font-bold text-[1.05rem]">Uso Corporativo e 2D Leve</h3>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-[var(--fg2)]">
                Vídeo integrado (Radeon Vega 7) divide a memória RAM do sistema. É perfeito para planilhas, sistemas web e plantas baixas 2D leves no AutoCAD, mas <strong>não possui VRAM dedicada</strong> para órbitas 3D fluidas.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-white p-5 dark:bg-[#121417]">
              <span className="text-[0.78rem] font-bold text-[var(--muted)] uppercase tracking-wider">Perfil Intermediário</span>
              <h3 className="mt-1 font-bold text-[1.05rem]">Multitarefa & Programação</h3>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-[var(--fg2)]">
                Equipado com <strong>32GB DDR5</strong> e processador Zen 4 com alto clock single-core. Roda Docker, dezenas de abas e compilações velozes. Atende perfeitamente 2 monitores simultâneos.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--violet)] bg-white p-5 shadow-sm dark:bg-[#121417]">
              <span className="text-[0.78rem] font-bold text-[var(--violet)] uppercase tracking-wider">Perfil Profissional</span>
              <h3 className="mt-1 font-bold text-[1.05rem]">AutoCAD 2D/3D & Engenharia</h3>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-[var(--fg2)]">
                Com <strong>GeForce RTX dedicada (8GB GDDR6)</strong> e 32GB de RAM, acelera o motor DirectX do AutoCAD, Revit e SolidWorks. Permite trabalhar com modelos 3D complexos, malhas e sombreado em tempo real.
              </p>
            </div>
          </div>

          {/* Matriz de Adequação por Tarefa */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left text-[0.84rem]">
              <thead>
                <tr className="border-b border-[var(--line)] text-[0.75rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                  <th className="py-2.5 pr-4">Aplicação / Tarefa</th>
                  <th className="px-4 py-2.5">Básico · R$ 2.400</th>
                  <th className="px-4 py-2.5">Intermediário · R$ 4.700</th>
                  <th className="px-4 py-2.5">Profissional · R$ 6.300</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {MATRIZ_PRODUTIVIDADE.map((row) => (
                  <tr key={row.tarefa} className="hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="py-3 pr-4 font-semibold text-[var(--fg)]">{row.tarefa}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${row.basico.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {row.basico.ok ? '✓' : '⚠️'} {row.basico.nota}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${row.intermediario.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {row.intermediario.ok ? '✓' : '⚠️'} {row.intermediario.nota}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {row.profissional.nota}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Filtro de Níveis */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div className="segmentado" role="tablist" aria-label="Filtrar por nível de trabalho">
            {(
              [
                ['todos', 'Todos os Níveis'],
                ['trabalho-basico', 'Básico (Escritório)'],
                ['trabalho-intermediario', 'Intermediário (Multitarefa)'],
                ['trabalho-profissional', 'Profissional (AutoCAD)'],
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
            Exibindo <strong>{listaFiltrada.length}</strong> de <strong>{PCS_TRABALHO.length}</strong> máquinas
          </span>
        </div>

        {/* Lista de PCs para Trabalho */}
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {listaFiltrada.map((pc) => (
            <CardTrabalho key={pc.id} pc={pc} aoAbrir={() => setAberto(pc)} />
          ))}
        </ul>
      </div>

      <Modal aberto={!!aberto} aoFechar={() => setAberto(null)} titulo={aberto?.tituloCard ?? ''}>
        {aberto && <ModalDetalhesTrabalho pc={aberto} aoFechar={() => setAberto(null)} />}
      </Modal>
    </div>
  );
}
