'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATALOGO_PECAS, CATEGORIAS_MONTADOR } from '@/lib/konoha/pecas';
import { avaliarCompatibilidadePeca, calcularConsumoSistema, validarMontagemCompleta } from '@/lib/konoha/compatibilidade';
import { ORDEM_CATEGORIAS, type Categoria, type Peca } from '@/lib/konoha/tipos';
import { formatarMoeda, montagem, precoTotal, quantidadeEscolhida, useMontagem } from '@/lib/montagem';
import { montadorUi, useMontadorUi } from '@/lib/montadorUi';
import { avisar } from '@/lib/avisos';
import { irPara } from '@/lib/rotas';
import { confirmar } from '@/components/ui/Confirmacao';
import { buscarPecas } from '@/components/BuscaGlobal';

/** Cada etapa do montador aponta para a explicação da peça em "Aprender". */
export const PARTE_DA_CATEGORIA: Record<Categoria, string> = {
  cpu: 'cpu',
  placamae: 'mobo',
  ram: 'ram',
  gpu: 'gpu',
  armazenamento: 'ssd',
  fonte: 'psu',
  gabinete: 'case',
  cooler: 'air',
};

const INFO = Object.fromEntries(CATEGORIAS_MONTADOR.map((c) => [c.id, c])) as Record<Categoria, (typeof CATEGORIAS_MONTADOR)[number]>;

function Icone({ svg, className = '' }: { svg: string; className?: string }) {
  // ícones vêm do catálogo como SVG estático do próprio projeto
  return <span className={`inline-flex h-5 w-5 [&>svg]:h-full [&>svg]:w-full ${className}`} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />;
}

type Alerta = { texto: string; acao?: { rotulo: string; fn: () => void } } | null;

export default function Montador() {
  const { selecao } = useMontagem();
  const ui = useMontadorUi();
  const [mostrarIncompat, setMostrarIncompat] = useState(false);
  const [alerta, setAlerta] = useState<Alerta>(null);
  const topoCatalogo = useRef<HTMLDivElement>(null);
  const qtd = quantidadeEscolhida(selecao);
  const total = precoTotal(selecao);
  const buscando = ui.busca.trim().length > 0;
  const info = INFO[ui.categoria];

  // peça vinda da busca do topo: rola até ela e destaca por alguns segundos
  useEffect(() => {
    if (!ui.destaque) return;
    const t1 = setTimeout(() => document.getElementById(`peca-${ui.destaque}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    const t2 = setTimeout(() => montadorUi.set({ destaque: null }), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ui.destaque]);

  useEffect(() => setMostrarIncompat(false), [ui.categoria]);

  const lista = useMemo(() => (buscando ? buscarPecas(ui.busca) : CATALOGO_PECAS[ui.categoria]), [buscando, ui.busca, ui.categoria]);
  const avaliadas = useMemo(
    () => lista.map((peca) => ({ peca, av: avaliarCompatibilidadePeca(peca, selecao), escolhida: selecao[peca.categoria]?.id === peca.id })),
    [lista, selecao],
  );
  const escondidas = avaliadas.filter((x) => !x.av.compativel && !x.escolhida).length;
  const visiveis = avaliadas.filter((x) => mostrarIncompat || x.av.compativel || x.escolhida || x.peca.id === ui.destaque);

  const abrirEtapa = (c: Categoria) => {
    montadorUi.set({ categoria: c, busca: '' });
    setAlerta(null);
  };

  const rolarParaCatalogo = () => {
    const el = topoCatalogo.current;
    if (!el) return;
    const topo = el.getBoundingClientRect().top;
    if (topo < 70 || topo > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + topo - 140, behavior: 'smooth' });
  };

  const escolher = (peca: Peca) => {
    const foto = montagem.atual();
    const anterior = selecao[peca.categoria];
    montagem.escolher(peca);
    setAlerta(null);
    if (anterior) {
      avisar(`${INFO[peca.categoria].tituloCurto} trocado por ${peca.nomeCurto}.`, { acao: { rotulo: 'Desfazer', fn: () => montagem.restaurar(foto) } });
    }
    if (!buscando) {
      const novo = { ...selecao, [peca.categoria]: peca };
      const proxima = ORDEM_CATEGORIAS.find((c) => !novo[c]);
      if (proxima && !anterior) {
        montadorUi.set({ categoria: proxima });
        rolarParaCatalogo();
      }
    }
  };

  const remover = (peca: Peca) => {
    const foto = montagem.atual();
    montagem.remover(peca.categoria);
    avisar(`${INFO[peca.categoria].tituloCurto} removido.`, { acao: { rotulo: 'Desfazer', fn: () => montagem.restaurar(foto) } });
  };

  const limpar = async () => {
    if (qtd === 0) return;
    const ok = await confirmar({
      titulo: 'Limpar toda a montagem?',
      mensagem: `As ${qtd} peças escolhidas serão removidas. Você ainda pode desfazer logo depois.`,
      confirmar: 'Limpar tudo',
      cancelar: 'Manter peças',
      perigo: true,
    });
    if (!ok) return;
    const foto = montagem.atual();
    montagem.limpar();
    montadorUi.set({ categoria: 'cpu', busca: '' });
    avisar('Montagem limpa.', { acao: { rotulo: 'Desfazer', fn: () => montagem.restaurar(foto) } });
  };

  const verResultado = () => {
    const v = validarMontagemCompleta(selecao);
    if (v.categoriasFaltantes.length) {
      const primeira = v.categoriasFaltantes[0];
      abrirEtapa(primeira.id);
      setAlerta({
        texto: `Ainda ${v.categoriasFaltantes.length === 1 ? 'falta 1 peça' : `faltam ${v.categoriasFaltantes.length} peças`}: ${v.categoriasFaltantes
          .map((c) => c.tituloCurto)
          .join(', ')}. Abrimos a etapa "${primeira.tituloCurto}" para você continuar.`,
      });
      rolarParaCatalogo();
      return;
    }
    if (v.conflitos.length) {
      const c = v.conflitos[0];
      setAlerta({ texto: `Há um conflito: ${c.motivo}`, acao: { rotulo: `Trocar ${INFO[c.categoria].tituloCurto}`, fn: () => abrirEtapa(c.categoria) } });
      return;
    }
    irPara('resultado');
  };

  const faltam = 8 - qtd;
  const rotuloResultado = faltam > 0 ? `Ver resultado (falta${faltam > 1 ? 'm' : ''} ${faltam})` : 'Ver resultado';
  const consumo = calcularConsumoSistema(selecao);
  const descricao =
    !buscando && ui.categoria === 'fonte'
      ? `Sua montagem consome cerca de ${consumo.consumoWatts} W. Escolha uma fonte de pelo menos ${consumo.fonteMinimaRecomendada} W.`
      : info.descricao;

  const etapas = CATEGORIAS_MONTADOR.map((c, i) => {
    const p = selecao[c.id];
    const conflito = p ? !avaliarCompatibilidadePeca(p, selecao).compativel : false;
    return { c, i, p, conflito, ativa: !buscando && ui.categoria === c.id };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
      {/* ---------- etapas + resumo ---------- */}
      <aside className="cartao min-w-0 p-4 lg:sticky lg:top-24" aria-label="Etapas e resumo da montagem">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[1rem] font-bold">Etapas</h2>
          <div className="flex items-center gap-2">
            <span className="tnum rounded-full border border-[var(--line)] px-2 py-0.5 text-[0.78rem] font-semibold">{qtd}/8</span>
            <button type="button" onClick={limpar} disabled={qtd === 0} className="text-[0.82rem] font-semibold text-[var(--muted)] underline underline-offset-2 hover:text-[var(--fg)] disabled:no-underline disabled:opacity-40">
              Limpar
            </button>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--ink)]" role="progressbar" aria-label="Progresso da montagem" aria-valuemin={0} aria-valuemax={8} aria-valuenow={qtd}>
          <div className="h-full rounded-full bg-[var(--violet)] transition-[width] duration-300" style={{ width: `${(qtd / 8) * 100}%` }} />
        </div>

        {/* celular: etapas em linha rolável; computador: lista */}
        <ol className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:gap-1.5 lg:overflow-visible lg:px-0">
          {etapas.map(({ c, i, p, conflito, ativa }) => (
            <li key={c.id} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => abrirEtapa(c.id)}
                aria-current={ativa ? 'step' : undefined}
                className={`flex w-[172px] items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors lg:w-full ${
                  ativa
                    ? 'border-[var(--fg)] bg-[rgba(255,106,19,0.08)] shadow-[inset_3px_0_0_var(--violet)]'
                    : conflito
                      ? 'border-[#fecaca] bg-[#fef2f2]'
                      : 'border-[var(--line)] hover:border-[rgba(17,17,17,0.35)]'
                }`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-[var(--line)] bg-white text-[var(--muted)]">
                  {p ? <img src={p.imagem} alt="" className="h-full w-full object-cover" /> : <Icone svg={c.iconeSvg} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-[0.84rem] font-semibold">
                    <span className="truncate">
                      {i + 1}. {c.tituloCurto}
                    </span>
                    {p && !conflito && <span className="text-[#15803d]" aria-label="escolhido">✓</span>}
                    {conflito && <span className="text-[#b91c1c]" aria-label="com conflito">✕</span>}
                  </span>
                  <span className={`block truncate text-[0.76rem] ${p ? 'text-[var(--fg2)]' : 'text-[var(--muted)]'}`}>{p ? p.nomeCurto : 'Escolher'}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-4 hidden rounded-2xl bg-[#111] p-4 text-white lg:block">
          <p className="text-[0.78rem] text-[#9ca3af]">Total à vista</p>
          <p className="tnum display mt-1 text-[1.6rem] font-[800] text-[var(--violet)]">{formatarMoeda(total)}</p>
        </div>
        <button type="button" onClick={verResultado} className={`btn mt-3 hidden w-full lg:flex ${faltam ? 'btn-escuro' : 'btn-primario'}`}>
          {rotuloResultado} <span aria-hidden>→</span>
        </button>
      </aside>

      {/* ---------- catálogo da etapa ---------- */}
      <section aria-labelledby="titulo-etapa" className="min-w-0">
        {alerta && (
          <div role="alert" className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#fed7aa] bg-[#fff8f1] px-4 py-3 text-[0.9rem] text-[#9a3412]">
            <span className="min-w-0 flex-1">{alerta.texto}</span>
            {alerta.acao && (
              <button
                type="button"
                className="btn btn-secundario btn-pequeno"
                onClick={() => {
                  alerta.acao!.fn();
                  setAlerta(null);
                }}
              >
                {alerta.acao.rotulo}
              </button>
            )}
            <button type="button" onClick={() => setAlerta(null)} aria-label="Fechar aviso" className="px-2 text-[1rem]">
              ✕
            </button>
          </div>
        )}

        {qtd === 0 && !buscando && (
          <p className="mb-4 rounded-2xl border border-[var(--line)] bg-[var(--ink)] px-4 py-3 text-[0.9rem] text-[var(--fg2)]">
            <strong className="text-[var(--fg)]">Primeira vez?</strong> Comece por um{' '}
            <a href="#prontos" className="link-texto">
              PC pronto
            </a>{' '}
            e troque só o que quiser, ou escolha peça por peça a partir do processador.
          </p>
        )}

        <div ref={topoCatalogo} className="cartao scroll-mt-28 p-5">
          {buscando ? (
            <>
              <h2 id="titulo-etapa" className="text-[1.25rem] font-bold">
                Resultados para “{ui.busca}”
              </h2>
              <p className="mt-1 text-[0.92rem] text-[var(--fg2)]">
                {lista.length} peça(s) em todas as etapas.{' '}
                <button type="button" className="link-texto" onClick={() => montadorUi.set({ busca: '' })}>
                  Voltar às etapas
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 id="titulo-etapa" className="text-[1.25rem] font-bold">
                {info.nome}
              </h2>
              <p className="mt-1 max-w-[70ch] text-[0.92rem] leading-relaxed text-[var(--fg2)]">
                {descricao}{' '}
                <a href={`#part-${PARTE_DA_CATEGORIA[ui.categoria]}`} className="link-texto whitespace-nowrap">
                  Entenda esta peça
                </a>
              </p>
            </>
          )}
          {escondidas > 0 && (
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-[0.86rem] text-[var(--fg2)]">
              <input id="mostrar-incompativeis" type="checkbox" checked={mostrarIncompat} onChange={(e) => setMostrarIncompat(e.target.checked)} className="h-4 w-4 accent-[#111]" />
              Mostrar {escondidas} {escondidas === 1 ? 'peça que não encaixa' : 'peças que não encaixam'} na sua montagem
            </label>
          )}
        </div>

        {visiveis.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[rgba(17,17,17,0.25)] bg-white p-6 text-center">
            <p className="font-semibold">{buscando ? `Nenhuma peça encontrada para “${ui.busca}”.` : 'Nenhuma peça desta etapa encaixa na sua montagem.'}</p>
            <p className="mt-1 text-[0.9rem] text-[var(--fg2)]">
              {buscando ? 'Tente um termo mais curto, como Ryzen, RTX ou DDR5.' : 'Elas conflitam com algo que você já escolheu. Mostre todas para ver o motivo de cada uma.'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {buscando ? (
                ['Ryzen', 'RTX', 'DDR5', 'NVMe', '750W'].map((s) => (
                  <button key={s} type="button" className="btn btn-secundario btn-pequeno" onClick={() => montadorUi.set({ busca: s })}>
                    {s}
                  </button>
                ))
              ) : (
                <button type="button" className="btn btn-secundario btn-pequeno" onClick={() => setMostrarIncompat(true)}>
                  Mostrar todas as peças
                </button>
              )}
            </div>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visiveis.map(({ peca, av, escolhida }) => {
              const trocar = !escolhida && !!selecao[peca.categoria];
              const destaque = ui.destaque === peca.id;
              return (
                <li
                  key={peca.id}
                  id={`peca-${peca.id}`}
                  className={`flex min-w-0 flex-col rounded-2xl border bg-white p-4 transition-shadow ${
                    escolhida ? 'border-[var(--fg)] shadow-[4px_4px_0_var(--violet)]' : av.compativel ? 'border-[var(--line)]' : 'border-[#fecaca]'
                  } ${destaque ? 'ring-4 ring-[rgba(255,106,19,0.45)]' : ''}`}
                >
                  <div className="grid h-[110px] place-items-center overflow-hidden rounded-xl bg-[var(--ink)]">
                    <img src={peca.imagem} alt="" loading="lazy" className="max-h-[96px] max-w-[85%] object-contain" />
                  </div>
                  {buscando && <p className="mt-3 text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">{INFO[peca.categoria].tituloCurto}</p>}
                  <h3 className={`${buscando ? 'mt-0.5' : 'mt-3'} text-[0.98rem] font-bold leading-snug`} title={peca.nome}>
                    {peca.nomeCurto}
                  </h3>
                  <p className="mt-1 text-[0.82rem] text-[var(--fg2)]">{peca.resumoSpecs}</p>
                  {!av.compativel && !escolhida && (
                    <p className="mt-2 rounded-lg bg-[#fef2f2] px-2.5 py-2 text-[0.8rem] leading-snug text-[#b91c1c]">
                      <strong>Não encaixa:</strong> {av.motivos.join(' ')}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--line)] pt-3">
                    <span className="tnum text-[1.05rem] font-bold">{peca.preco ? formatarMoeda(peca.preco) : 'Incluso'}</span>
                    {escolhida ? (
                      <button type="button" onClick={() => remover(peca)} className="btn btn-escuro btn-pequeno" aria-label={`Remover ${peca.nomeCurto} da montagem`} title="Clique para remover">
                        ✓ Escolhida
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => escolher(peca)}
                        disabled={!av.compativel}
                        className="btn btn-primario btn-pequeno"
                        aria-label={`${trocar ? 'Trocar por' : 'Escolher'} ${peca.nomeCurto}`}
                      >
                        {av.compativel ? (trocar ? 'Trocar' : 'Escolher') : 'Não encaixa'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* celular: total e próximo passo sempre à mão */}
      <div
        className="gutter fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--line)] bg-white py-3 lg:hidden"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[0.74rem] text-[var(--muted)]">Total · {qtd}/8 peças</p>
          <p className="tnum truncate text-[1.05rem] font-bold">{formatarMoeda(total)}</p>
        </div>
        <button type="button" onClick={verResultado} className={`btn btn-pequeno ${faltam ? 'btn-escuro' : 'btn-primario'}`}>
          {rotuloResultado}
        </button>
      </div>
    </div>
  );
}
