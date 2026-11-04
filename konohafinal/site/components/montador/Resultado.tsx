'use client';
import { useMemo, useState } from 'react';
import { CATEGORIAS_MONTADOR } from '@/lib/konoha/pecas';
import { gerarRelatorioDesempenho } from '@/lib/konoha/desempenho';
import { validarMontagemCompleta } from '@/lib/konoha/compatibilidade';
import type { Finalidade, Selecao } from '@/lib/konoha/tipos';
import { formatarMoeda, montagem, useMontagem } from '@/lib/montagem';

const FINALIDADES: [Finalidade, string][] = [
  ['jogos', 'Jogos'],
  ['trabalho', 'Trabalho'],
  ['hibrido', 'Os dois'],
];

const CORES = ['#ff6a13', '#111111', '#ff9a52', '#57524d', '#ffc59a', '#8f8a85', '#c2410c', '#cfcac4'];

/** Para onde vai o dinheiro: divisão real do preço desta montagem, por peça. */
export function DivisaoOrcamento({ selecao }: { selecao: Selecao }) {
  const [foco, setFoco] = useState<number | null>(null);
  const itens = CATEGORIAS_MONTADOR.map((c) => ({ rotulo: c.tituloCurto, valor: selecao[c.id]?.preco || 0 }));
  const total = itens.reduce((t, i) => t + i.valor, 0);
  if (!total) return null;
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-[var(--ink)]" role="img" aria-label="Divisão do preço por peça">
        {itens.map((it, i) =>
          it.valor ? (
            <span
              key={it.rotulo}
              className="h-full transition-opacity"
              style={{ width: `${(it.valor / total) * 100}%`, background: CORES[i], opacity: foco === null || foco === i ? 1 : 0.3 }}
              onMouseEnter={() => setFoco(i)}
              onMouseLeave={() => setFoco(null)}
            />
          ) : null,
        )}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1.5 sm:grid-cols-4">
        {itens.map((it, i) => (
          <li
            key={it.rotulo}
            className="flex items-center gap-2 text-[0.82rem] text-[var(--fg2)]"
            style={{ opacity: foco === null || foco === i ? 1 : 0.45 }}
            onMouseEnter={() => setFoco(i)}
            onMouseLeave={() => setFoco(null)}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CORES[i] }} />
            <span className="min-w-0 flex-1 truncate">{it.rotulo}</span>
            <span className="tnum font-semibold text-[var(--fg)]">{Math.round((it.valor / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Resultado() {
  const { selecao, finalidade } = useMontagem();
  const validacao = validarMontagemCompleta(selecao);
  const r = useMemo(() => gerarRelatorioDesempenho(selecao, finalidade), [selecao, finalidade]);

  const trilha = (
    <nav aria-label="Você está aqui" className="flex items-center gap-2 text-[0.86rem] text-[var(--muted)]">
      <a href="#montar" className="link-texto">
        Montar seu PC
      </a>
      <span aria-hidden>›</span>
      <span aria-current="page" className="font-semibold text-[var(--fg)]">
        Resultado
      </span>
    </nav>
  );

  if (!validacao.completa) {
    return (
      <div className="grid gap-5 [&>*]:min-w-0">
        {trilha}
        <div className="cartao p-6">
          <h2 className="text-[1.25rem] font-bold">Sua montagem ainda não está pronta</h2>
          <p className="mt-2 max-w-[60ch] text-[0.95rem] text-[var(--fg2)]">
            {validacao.categoriasFaltantes.length
              ? `Faltam: ${validacao.categoriasFaltantes.map((c) => c.tituloCurto).join(', ')}.`
              : `Há um conflito entre as peças: ${validacao.conflitos[0]?.motivo}`}{' '}
            Volte ao montador para concluir; o resultado aparece assim que as 8 peças encaixarem.
          </p>
          <a href="#montar" className="btn btn-escuro mt-5">
            ← Voltar ao montador
          </a>
        </div>
      </div>
    );
  }

  const mostrarFps = r.finalidade !== 'trabalho';
  const mostrarTrabalho = r.finalidade !== 'jogos';

  const maxFps = Math.max(1, ...r.estimativasFps.map((j) => (j.fps1080p.disponivel && j.fps1080p.media) || 0));

  return (
    <div className="grid gap-6 [&>*]:min-w-0">
      {trilha}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="titulo-tela">Resultado da sua montagem</h2>
        <div className="flex items-center gap-2.5">
          <span className="text-[0.86rem] text-[var(--fg2)]">Analisar para</span>
          <div className="segmentado" role="group" aria-label="Analisar desempenho para">
            {FINALIDADES.map(([v, rotulo]) => (
              <button key={v} type="button" aria-pressed={finalidade === v} onClick={() => montagem.definirFinalidade(v)}>
                {rotulo}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="grid items-center gap-6 rounded-[22px] bg-[#111] p-6 text-[#e5e7eb] md:grid-cols-[1fr_auto] md:p-7" aria-label="Resumo do resultado">
        <div>
          <span className="inline-block rounded-full border border-[rgba(255,106,19,0.45)] bg-[rgba(255,106,19,0.16)] px-3 py-1 text-[0.8rem] font-semibold text-[#ffb27a]">
            Nível {r.classificacaoGeral}
          </span>
          <p className="mt-3 max-w-[62ch] text-[0.98rem] leading-relaxed text-[#d1d5db]">{r.descricaoDesempenho}</p>
        </div>
        <div className="md:text-right">
          <p className="text-[0.8rem] text-[#9ca3af]">Total à vista</p>
          <p className="tnum display text-[2rem] font-[800] leading-tight text-[var(--violet)]">{formatarMoeda(r.precoTotal)}</p>
        </div>
      </section>

      {mostrarFps && (
        <section aria-labelledby="titulo-fps">
          <h3 id="titulo-fps" className="text-[1.05rem] font-bold">
            FPS estimado
          </h3>
          <div className="cartao mt-3 overflow-x-auto px-4 py-1">
            <table className="w-full min-w-[420px] text-[0.9rem]">
              <thead>
                <tr className="text-left text-[0.76rem] text-[var(--muted)]">
                  <th scope="col" className="py-2.5 font-semibold">
                    Jogo
                  </th>
                  <th scope="col" className="w-[38%] py-2.5 font-semibold">
                    <span className="sr-only">Barra de 1080p</span>
                  </th>
                  <th scope="col" className="py-2.5 text-right font-semibold">
                    1080p
                  </th>
                  <th scope="col" className="py-2.5 text-right font-semibold">
                    1440p
                  </th>
                </tr>
              </thead>
              <tbody>
                {r.estimativasFps.map((j) => {
                  const largura = j.fps1080p.disponivel && j.fps1080p.media ? (j.fps1080p.media / maxFps) * 100 : 0;
                  const cel = (x: typeof j.fps1080p) =>
                    x.disponivel && x.media ? (
                      <span className="tnum font-bold">{x.media}</span>
                    ) : (
                      <span className="text-[var(--muted)]" title="Não roda de forma jogável">
                        —
                      </span>
                    );
                  return (
                    <tr key={j.nome} className="border-t border-[var(--line)]">
                      <th scope="row" className="py-2.5 pr-3 text-left font-semibold">
                        {j.nome}
                      </th>
                      <td className="py-2.5 pr-4">
                        <span className="block h-1.5 overflow-hidden rounded-full bg-[var(--ink)]">
                          <span className="block h-full rounded-full bg-[var(--violet)]" style={{ width: `${largura}%` }} />
                        </span>
                      </td>
                      <td className="py-2.5 text-right">{cel(j.fps1080p)}</td>
                      <td className="py-2.5 text-right">{cel(j.fps1440p)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[0.8rem] text-[var(--muted)]">Estimativas a partir de testes publicados; o valor real muda com drivers e configurações. “—” significa que o jogo não roda bem.</p>
        </section>
      )}

      {mostrarTrabalho && r.avaliacaoAplicacoesTrabalho.length > 0 && (
        <section aria-labelledby="titulo-trabalho">
          <h3 id="titulo-trabalho" className="text-[1.05rem] font-bold">
            Para trabalho
          </h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-3">
            {r.avaliacaoAplicacoesTrabalho.map((a) => {
              const cor = a.statusClasse === 'adequado-pleno' ? 'bg-[#f0fdf4] text-[#15803d]' : a.statusClasse === 'adequado-parcial' ? 'bg-[#fff8f1] text-[#b45309]' : 'bg-[#fef2f2] text-[#b91c1c]';
              return (
                <li key={a.area} className="cartao p-4">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[0.76rem] font-bold ${cor}`}>{a.nivelAdequacao}</span>
                  <p className="mt-2 text-[0.9rem] font-semibold">{a.area}</p>
                  <p className="mt-1 text-[0.82rem] leading-snug text-[var(--fg2)]">{a.detalhe}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2" aria-label="Pontos fortes e limitações">
        <div className="cartao p-5">
          <h3 className="text-[1.05rem] font-bold text-[#15803d]">Pontos fortes</h3>
          <ul className="lista-pontos mt-3 grid gap-2 text-[0.9rem] leading-snug text-[var(--fg2)]">
            {r.pontosFortes.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="cartao border-[#fed7aa] bg-[#fffaf5] p-5">
          <h3 className="text-[1.05rem] font-bold text-[#b45309]">Limitações</h3>
          <ul className="lista-pontos mt-3 grid gap-2 text-[0.9rem] leading-snug text-[var(--fg2)]">
            {r.limitacoes.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <details className="cartao group px-5">
        <summary className="cursor-pointer list-none py-4 text-[0.95rem] font-bold marker:hidden">
          <span className="mr-2 inline-block transition-transform group-open:rotate-90" aria-hidden>
            ›
          </span>
          Ver as 8 peças e para onde vai o dinheiro
        </summary>
        <ul className="border-t border-[var(--line)]">
          {CATEGORIAS_MONTADOR.map((c) => {
            const p = selecao[c.id]!;
            return (
              <li key={c.id} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-[var(--line)] py-2.5 text-[0.88rem] sm:grid-cols-[140px_1fr_auto]">
                <span className="col-span-2 text-[0.78rem] text-[var(--muted)] sm:col-span-1 sm:text-[0.88rem]">{c.tituloCurto}</span>
                <span className="min-w-0 truncate font-semibold" title={p.nome}>
                  {p.nomeCurto}
                </span>
                <span className="tnum font-semibold">{p.preco ? formatarMoeda(p.preco) : 'Incluso'}</span>
              </li>
            );
          })}
        </ul>
        <div className="py-5">
          <DivisaoOrcamento selecao={selecao} />
          {r.recomendacoesUso.length > 0 && (
            <p className="mt-4 text-[0.86rem] leading-relaxed text-[var(--fg2)]">
              <strong className="text-[var(--fg)]">Indicado para:</strong> {r.recomendacoesUso.join('; ')}.
            </p>
          )}
        </div>
      </details>

      <div>
        <a href="#montar" className="btn btn-secundario">
          ← Editar peças
        </a>
      </div>
    </div>
  );
}
