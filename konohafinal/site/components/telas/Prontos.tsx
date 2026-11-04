'use client';
import { useState } from 'react';
import { PCS_GAMER, PCS_TRABALHO } from '@/lib/konoha/pcs-prontos';
import { CATEGORIAS_MONTADOR } from '@/lib/konoha/pecas';
import { gerarRelatorioDesempenho } from '@/lib/konoha/desempenho';
import type { Finalidade, PcPronto } from '@/lib/konoha/tipos';
import { formatarMoeda, montagem, precoTotal, quantidadeEscolhida, selecaoDoPc } from '@/lib/montagem';
import { avisar } from '@/lib/avisos';
import { irPara } from '@/lib/rotas';
import Modal from '@/components/ui/Modal';
import { confirmar } from '@/components/ui/Confirmacao';
import { DivisaoOrcamento } from '@/components/montador/Resultado';
import Choice from '@/components/sections/Choice';

type Tipo = 'gamer' | 'trabalho';

/** Carrega um PC pronto no montador, perguntando antes se isso apagaria uma montagem em andamento. */
async function levarParaMontador(pc: PcPronto, tipo: Tipo, destino: 'montar' | 'resultado') {
  const atual = montagem.atual();
  const qtd = quantidadeEscolhida(atual.selecao);
  const mesma = Object.entries(pc.pecasIds).every(([c, id]) => atual.selecao[c as keyof typeof atual.selecao]?.id === id);
  if (qtd > 0 && !mesma) {
    const ok = await confirmar({
      titulo: 'Substituir sua montagem?',
      mensagem: `Você já escolheu ${qtd} peça(s). Carregar "${pc.tituloCard}" troca todas elas pelas peças deste PC.`,
      confirmar: 'Substituir',
      cancelar: 'Manter a minha',
    });
    if (!ok) return;
  }
  const finalidade: Finalidade = tipo === 'gamer' ? 'jogos' : 'trabalho';
  montagem.carregarPc(pc, finalidade);
  irPara(destino);
  if (qtd > 0 && !mesma) avisar(`"${pc.tituloCard}" carregado no montador.`, { acao: { rotulo: 'Desfazer', fn: () => montagem.restaurar(atual) } });
}

function Detalhes({ pc, tipo, aoFechar }: { pc: PcPronto; tipo: Tipo; aoFechar: () => void }) {
  const selecao = selecaoDoPc(pc);
  const r = gerarRelatorioDesempenho(selecao, tipo === 'gamer' ? 'jogos' : 'trabalho');
  return (
    <>
      <p className="text-[0.95rem] leading-relaxed text-[var(--fg2)]">{pc.perfilUso || pc.finalidade}</p>
      <p className="mt-3 inline-block rounded-full bg-[var(--ink)] px-3 py-1 text-[0.82rem] font-semibold">Nível {r.classificacaoGeral}</p>

      <h3 className="mt-5 text-[0.95rem] font-bold">Peças</h3>
      <ul className="mt-2 border-t border-[var(--line)]">
        {CATEGORIAS_MONTADOR.map((c) => {
          const p = selecao[c.id];
          if (!p) return null;
          return (
            <li key={c.id} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-[var(--line)] py-2 text-[0.88rem] sm:grid-cols-[120px_1fr_auto]">
              <span className="col-span-2 text-[0.76rem] text-[var(--muted)] sm:col-span-1 sm:text-[0.88rem]">{c.tituloCurto}</span>
              <span className="min-w-0 truncate font-semibold" title={p.nome}>
                {p.nomeCurto}
              </span>
              <span className="tnum">{p.preco ? formatarMoeda(p.preco) : 'Incluso'}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-semibold">Total à vista</span>
        <span className="tnum display text-[1.4rem] font-[800]">{formatarMoeda(r.precoTotal)}</span>
      </div>

      <h3 className="mt-6 text-[0.95rem] font-bold">Para onde vai o dinheiro</h3>
      <div className="mt-3">
        <DivisaoOrcamento selecao={selecao} />
      </div>

      {pc.limitacoes && pc.limitacoes.length > 0 && (
        <>
          <h3 className="mt-6 text-[0.95rem] font-bold text-[#b45309]">Limitações</h3>
          <ul className="lista-pontos mt-2 grid gap-1.5 text-[0.88rem] leading-snug text-[var(--fg2)]">
            {pc.limitacoes.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-7 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          className="btn btn-secundario"
          onClick={() => {
            aoFechar();
            levarParaMontador(pc, tipo, 'montar');
          }}
        >
          Personalizar no montador
        </button>
        <button
          type="button"
          data-foco-inicial
          className="btn btn-primario"
          onClick={() => {
            aoFechar();
            levarParaMontador(pc, tipo, 'resultado');
          }}
        >
          Ver desempenho completo
        </button>
      </div>
    </>
  );
}

function Cartao({ pc, tipo, aoAbrir }: { pc: PcPronto; tipo: Tipo; aoAbrir: () => void }) {
  const total = precoTotal(selecaoDoPc(pc));
  const descricao = tipo === 'gamer' ? pc.perfilUso : pc.chamadaCurta;
  return (
    <li className="cartao flex min-w-0 flex-col overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden bg-[var(--ink)]">
        <img src={pc.imagem} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.1rem] font-bold leading-snug">{pc.tituloCard}</h3>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-[var(--fg2)]">{descricao}</p>
        <ul className="lista-pontos mt-3 grid gap-1 text-[0.82rem] text-[var(--fg2)]">
          {(pc.especificacoesLista || pc.componentesPrincipais).slice(0, 4).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        {pc.limitacaoCurta && (
          <p className="mt-3 text-[0.82rem] leading-snug text-[#b45309]">
            <strong>Limite:</strong> {pc.limitacaoCurta}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <span className="tnum text-[1.2rem] font-bold">{formatarMoeda(total)}</span>
          <div className="flex flex-col items-end gap-1">
            <button type="button" className="btn btn-primario btn-pequeno" onClick={aoAbrir}>
              Ver detalhes
            </button>
            <button type="button" className="text-[0.8rem] font-semibold text-[var(--fg2)] underline underline-offset-2 hover:text-[var(--fg)]" onClick={() => levarParaMontador(pc, tipo, 'montar')}>
              Personalizar no montador
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Prontos() {
  const [tipo, setTipo] = useState<Tipo>('gamer');
  const [aberto, setAberto] = useState<PcPronto | null>(null);
  const lista = [...(tipo === 'gamer' ? PCS_GAMER : PCS_TRABALHO)].sort(
    (a, b) => precoTotal(selecaoDoPc(a)) - precoTotal(selecaoDoPc(b)),
  );

  return (
    <div className="gutter tela">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="titulo-tela">PCs prontos</h1>
        <p className="subtitulo-tela">Configurações completas e compatíveis. Abra uma para ver as peças e o preço, ou leve para o montador e troque o que quiser.</p>

        <div className="mt-6 segmentado" role="tablist" aria-label="Tipo de PC">
          {(
            [
              ['gamer', 'Para jogos'],
              ['trabalho', 'Para trabalho e estudo'],
            ] as [Tipo, string][]
          ).map(([v, rotulo]) => (
            <button key={v} type="button" role="tab" aria-selected={tipo === v} aria-controls="lista-prontos" onClick={() => setTipo(v)}>
              {rotulo}
            </button>
          ))}
        </div>

        <div id="lista-prontos" role="tabpanel" aria-label={tipo === 'gamer' ? 'PCs para jogos' : 'PCs para trabalho e estudo'}>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {lista.map((pc) => (
              <Cartao key={pc.id} pc={pc} tipo={tipo} aoAbrir={() => setAberto(pc)} />
            ))}
          </ul>
        </div>
        <p className="mt-3 text-[0.82rem] text-[var(--muted)]">Preços de referência do catálogo do projeto. Confira o valor na loja antes de comprar.</p>
      </div>

      <div className="mx-auto mt-16 max-w-[1180px]">
        <Choice />
      </div>

      <Modal aberto={!!aberto} aoFechar={() => setAberto(null)} titulo={aberto?.tituloCard ?? ''}>
        {aberto && <Detalhes pc={aberto} tipo={tipo} aoFechar={() => setAberto(null)} />}
      </Modal>
    </div>
  );
}
