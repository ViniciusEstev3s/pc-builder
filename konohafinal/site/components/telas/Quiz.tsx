'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { TEMAS_ARQUITETURA } from '@/lib/konoha/quiz';
import type { TemaQuiz } from '@/lib/konoha/tipos';
import { useUsuario, abrirModalLogin } from '@/lib/auth';
import {
  useProgressoQuiz,
  salvarResultadoQuiz,
  DADOS_PATENTES,
  NIVEIS_NINJA,
  calcularPatente,
  calcularNivelEProgressoXP,
  XP_POR_ACERTO,
  type PatenteNinja,
  tocarSomAcerto,
  tocarSomErro,
  tocarSomPatente,
  tocarSomSubirNivel,
  somHabilitado,
  alternarSom,
  limparHistoricoUsuario,
} from '@/lib/konoha/quizProgresso';
import Confetti from '@/components/ui/Confetti';
import Modal from '@/components/ui/Modal';

const LETRAS = ['A', 'B', 'C', 'D'];

function gerarTemaMaratona(): TemaQuiz {
  const todasPerguntas = TEMAS_ARQUITETURA.flatMap((t) =>
    t.perguntas.map((p) => ({ ...p, temaOrigem: t.titulo }))
  );
  // Embaralha e seleciona 10 perguntas representativas
  const embaralhadas = [...todasPerguntas].sort(() => Math.random() - 0.5).slice(0, 10);
  return {
    id: 'maratona-ranqueada',
    titulo: 'Desafio Ranqueado Geral (Maratona)',
    etiqueta: 'Modo Ranqueado',
    descricao: '10 perguntas sorteadas de toda a arquitetura de computadores para testar seu conhecimento geral e conceder até 500 XP.',
    perguntas: embaralhadas,
  };
}

// ----------------------------------------------------
// TELA ATIVA DE PERGUNTAS E RESPOSTAS DO QUIZ
// ----------------------------------------------------
function ArenaQuiz({
  tema,
  aoSair,
}: {
  tema: TemaQuiz;
  aoSair: () => void;
}) {
  const usuario = useUsuario();
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [historicoRespostas, setHistoricoRespostas] = useState<
    { indicePergunta: number; escolha: number; correta: number; acertou: boolean }[]
  >([]);
  const [somAtivo, setSomAtivo] = useState(true);

  // Anti-exploit: runId único para cada partida para não duplicar XP
  const runIdRef = useRef('run_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
  const salvoRef = useRef(false);
  const [resultadoPartida, setResultadoPartida] = useState<{
    patente: PatenteNinja;
    xpGanho: number;
    subiuDeNivel: boolean;
    nivelAnterior: number;
    nivelAtual: number;
    totalXpFinal: number;
  } | null>(null);

  const painel = useRef<HTMLDivElement>(null);
  const total = tema.perguntas.length;
  const fim = indice >= total;
  const q = tema.perguntas[Math.min(indice, total - 1)];

  useEffect(() => {
    setSomAtivo(somHabilitado());
  }, []);

  const alternarMudo = () => {
    const novo = alternarSom();
    setSomAtivo(novo);
  };

  const confirmar = () => {
    if (escolha === null || confirmada) return;
    setConfirmada(true);
    const correta = escolha === q.correta;
    if (correta) {
      setAcertos((a) => a + 1);
      tocarSomAcerto();
    } else {
      tocarSomErro();
    }
    setHistoricoRespostas((ant) => [
      ...ant,
      { indicePergunta: indice, escolha, correta: q.correta, acertou: correta },
    ]);
  };

  const proxima = () => {
    setIndice((i) => i + 1);
    setEscolha(null);
    setConfirmada(false);
  };

  const reiniciar = () => {
    setIndice(0);
    setEscolha(null);
    setConfirmada(false);
    setAcertos(0);
    setHistoricoRespostas([]);
    setResultadoPartida(null);
    salvoRef.current = false;
    runIdRef.current = 'run_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  };

  // Atalhos de teclado: A–D ou 1–4 para selecionar, Enter para confirmar ou avançar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || e.ctrlKey || e.metaKey || e.altKey || fim) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      const mapa: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      const i = mapa[e.key.toLowerCase()];
      if (i !== undefined && !confirmada && i < q.alternativas.length) {
        e.preventDefault();
        setEscolha(i);
      } else if (e.key === 'Enter' && el.tagName !== 'BUTTON') {
        e.preventDefault();
        if (!confirmada) confirmar();
        else proxima();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    painel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [indice]);

  const patenteFinal = useMemo(() => calcularPatente(acertos, total), [acertos, total]);

  // Ao chegar ao fim, concede XP e salva o progresso de forma persistente (anti-duplicação via runIdRef)
  useEffect(() => {
    if (fim && !salvoRef.current) {
      salvoRef.current = true;
      const res = salvarResultadoQuiz(
        usuario?.email,
        tema.id,
        tema.titulo,
        acertos,
        total,
        runIdRef.current,
        {
          nome: usuario?.nome,
          foto: usuario?.foto,
        }
      );

      setResultadoPartida({
        patente: res.patente,
        xpGanho: res.xpGanho,
        subiuDeNivel: res.subiuDeNivel,
        nivelAnterior: res.nivelAnterior,
        nivelAtual: res.nivelAtual,
        totalXpFinal: res.progresso.totalXp,
      });

      if (res.subiuDeNivel) {
        tocarSomSubirNivel();
      } else {
        tocarSomPatente(patenteFinal);
      }
    }
  }, [fim, patenteFinal, acertos, total, tema.id, tema.titulo, usuario]);

  // ----------------------------------------------------
  // TELA DE RESULTADO FINAL DO QUIZ (PATENTE NINJA & XP)
  // ----------------------------------------------------
  if (fim) {
    const infoPatente = DADOS_PATENTES[patenteFinal];
    const pct = Math.round((acertos / total) * 100);
    const xpGanho = acertos * XP_POR_ACERTO;
    const infoNivelConta = calcularNivelEProgressoXP(resultadoPartida?.totalXpFinal || 0);

    return (
      <div ref={painel} className="cartao mx-auto max-w-[800px] scroll-mt-24 p-6 md:p-9 relative overflow-hidden">
        {(patenteFinal === 'HOKAGE' || resultadoPartida?.subiuDeNivel) && <Confetti />}

        {/* Notificação especial caso tenha subido de nível */}
        {resultadoPartida?.subiuDeNivel && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1 shadow-lg animate-bounce">
            <div className="rounded-[14px] bg-white px-5 py-3.5 text-center">
              <p className="text-[1.2rem] font-black text-orange-600">
                ⚡ LEVEL UP! VOCÊ SUBIU DE NÍVEL!
              </p>
              <p className="text-[0.95rem] font-bold text-[var(--fg)] mt-0.5">
                Nova Patente Ninja: {infoNivelConta.dadosPatente.emoji} {infoNivelConta.dadosPatente.nome} (Nível {infoNivelConta.nivel})
              </p>
            </div>
          </div>
        )}

        {/* Banner de Classificação da Rodada */}
        <div
          className={`rounded-2xl border-2 p-6 md:p-8 text-center bg-gradient-to-b ${infoPatente.bgGradiente} transition-all`}
          style={{ borderColor: infoPatente.borderCor }}
        >
          <div className="inline-flex items-center justify-center text-[3.8rem] mb-2 drop-shadow-md">
            {infoPatente.emoji}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-[0.8rem] font-black uppercase tracking-wider text-black font-mono"
              style={{ backgroundColor: infoPatente.borderCor }}
            >
              Classificação do Exame Ninja
            </span>
            <span className="px-3 py-1 rounded-full text-[0.8rem] font-black uppercase tracking-wider bg-emerald-600 text-white font-mono shadow-sm">
              +{xpGanho} XP Ganhos
            </span>
          </div>

          <h2
            className="text-[2.2rem] md:text-[2.8rem] font-[900] tracking-tight mt-2"
            style={{ color: infoPatente.borderCor }}
          >
            {infoPatente.nome.toUpperCase()}
          </h2>
          <p className="text-[1.05rem] font-semibold text-[var(--fg)] mt-1">{infoPatente.rotulo}</p>

          <p className="mt-3 max-w-[560px] mx-auto text-[0.95rem] md:text-[1rem] leading-relaxed text-[var(--fg2)]">
            {infoPatente.mensagemVitoria}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 py-4 border-y border-[var(--line)]">
            <div>
              <p className="text-[0.78rem] uppercase font-bold text-[var(--muted)]">Acertos</p>
              <p className="text-[1.8rem] font-extrabold tnum">
                {acertos} <span className="text-[1rem] text-[var(--muted)]">/ {total}</span>
              </p>
            </div>
            <div className="h-10 w-[1px] bg-[var(--line)] hidden sm:block" />
            <div>
              <p className="text-[0.78rem] uppercase font-bold text-[var(--muted)]">Aproveitamento</p>
              <p className="text-[1.8rem] font-extrabold tnum">{pct}%</p>
            </div>
            <div className="h-10 w-[1px] bg-[var(--line)] hidden sm:block" />
            <div>
              <p className="text-[0.78rem] uppercase font-bold text-[var(--muted)]">Experiência Ninja</p>
              <p className="text-[1.8rem] font-extrabold tnum text-emerald-600">+{xpGanho} XP</p>
            </div>
          </div>

          {/* Barra de Progresso de XP da Conta Atualizada */}
          <div className="mt-5 rounded-xl border border-[var(--line)] bg-white p-4 text-left shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[0.84rem] font-bold">
              <span className="text-[var(--fg)]">
                Status da Conta: Nível {infoNivelConta.nivel} · {infoNivelConta.dadosPatente.nome} {infoNivelConta.dadosPatente.emoji}
              </span>
              <span className="text-emerald-700 font-mono">
                {infoNivelConta.xpAtual.toLocaleString()} XP Acumulados
              </span>
            </div>

            <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-[var(--ink)] border border-[var(--line)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[var(--violet)] transition-all duration-700"
                style={{ width: `${infoNivelConta.porcentagemBarra}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[0.78rem] text-[var(--muted)]">
              <span>
                {infoNivelConta.isMaximo
                  ? '🔥 Patente Máxima: Hokage Supremo de Konoha alcançado!'
                  : `Faltam ${infoNivelConta.xpFaltaProximo} XP para subir para Nível ${infoNivelConta.nivel + 1} (${NIVEIS_NINJA[infoNivelConta.nivel]?.nome})`}
              </span>
              <span className="font-mono font-bold text-[var(--fg)]">
                {infoNivelConta.porcentagemBarra}%
              </span>
            </div>
          </div>

          {/* Notificação de Sincronização Google */}
          <div className="mt-5">
            {usuario ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 px-4 py-2 text-[0.86rem] text-emerald-800 font-medium">
                <span className="text-[1rem]">✅</span>
                <span>
                  Progresso e XP salvos na sua conta Google: <strong>{usuario.email}</strong>
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 rounded-xl bg-amber-50 border border-amber-300 p-3.5 text-[0.88rem] text-amber-900">
                <span>⚠️ Você está jogando como visitante. Conecte sua conta do Google para não perder seu Nível e XP:</span>
                <button
                  type="button"
                  onClick={abrirModalLogin}
                  className="btn btn-primario btn-pequeno shrink-0 font-bold"
                >
                  Salvar na Conta Google
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resumo e Gabarito das Perguntas */}
        <div className="mt-8">
          <h3 className="text-[1.1rem] font-bold text-[var(--fg)] mb-3">Revisão das Questões do Treinamento:</h3>
          <div className="space-y-3">
            {tema.perguntas.map((perg, idx) => {
              const resp = historicoRespostas.find((r) => r.indicePergunta === idx);
              const acertouQuestao = resp?.acertou;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 text-left transition ${
                    acertouQuestao ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[0.92rem] font-semibold text-[var(--fg)]">
                      {idx + 1}. {perg.enunciado}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded text-[0.72rem] font-bold uppercase shrink-0 ${
                        acertouQuestao ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {acertouQuestao ? `Correto (+${XP_POR_ACERTO} XP)` : 'Incorreto (0 XP)'}
                    </span>
                  </div>
                  <div className="mt-2 text-[0.84rem] text-[var(--fg2)]">
                    <p>
                      <strong>Resposta correta:</strong> {LETRAS[perg.correta]}) {perg.alternativas[perg.correta]}
                    </p>
                    <p className="mt-1 text-[0.82rem] text-[var(--muted)]">{perg.explicacao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ações pós-jogo */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-secundario" onClick={reiniciar}>
            Refazer este tema
          </button>
          <button type="button" className="btn btn-primario" onClick={aoSair}>
            Escolher outro tema
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PERGUNTA EM ANDAMENTO
  // ----------------------------------------------------
  const acertou = confirmada && escolha === q.correta;

  return (
    <div ref={painel} className="cartao mx-auto max-w-[760px] scroll-mt-24 p-5 md:p-7">
      {/* Cabeçalho da Rodada */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="min-w-0">
          <span className="text-[0.78rem] font-bold uppercase tracking-wider text-[var(--lilac)]">
            {tema.etiqueta}
          </span>
          <h2 className="text-[1.2rem] font-extrabold leading-snug">{tema.titulo}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={alternarMudo}
            className="rounded-lg border border-[var(--line)] bg-[var(--ink)] px-2.5 py-1.5 text-[0.82rem] font-semibold text-[var(--fg2)] hover:border-[var(--fg)] transition"
            title={somAtivo ? 'Desativar som do quiz' : 'Ativar som do quiz'}
          >
            {somAtivo ? '🔊 Som Ativo' : '🔇 Mudo'}
          </button>
          <button type="button" className="btn btn-secundario btn-pequeno" onClick={aoSair}>
            ← Sair
          </button>
        </div>
      </div>

      {/* Indicadores de Progresso e XP em tempo real */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.85rem] text-[var(--fg2)]">
        <span>
          Pergunta <strong>{indice + 1}</strong> de <strong>{total}</strong>
        </span>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-emerald-600">
            ✓ <strong>{acertos}</strong> acertos (+{acertos * XP_POR_ACERTO} XP)
          </span>
          <span className="text-[0.8rem] text-[var(--muted)]">
            {indice > 0 ? `Taxa atual: ${Math.round((acertos / indice) * 100)}%` : 'Gabarite para Hokage 🔥'}
          </span>
        </div>
      </div>

      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--ink)]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={indice + 1}
        aria-label="Progresso do quiz"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--lilac)] transition-all duration-300"
          style={{ width: `${((indice + 1) / total) * 100}%` }}
        />
      </div>

      {/* Enunciado */}
      <div className="mt-6 rounded-xl bg-[var(--ink)] p-4 sm:p-5">
        <p className="text-[1.08rem] font-bold leading-relaxed text-[var(--fg)]" id="enunciado">
          {q.enunciado}
        </p>
      </div>

      {/* Alternativas */}
      <div className="mt-4 grid gap-2.5" role="radiogroup" aria-labelledby="enunciado">
        {q.alternativas.map((alt, i) => {
          const correta = confirmada && i === q.correta;
          const errada = confirmada && i === escolha && i !== q.correta;
          const marcada = !confirmada && escolha === i;

          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={escolha === i}
              disabled={confirmada}
              onClick={() => setEscolha(i)}
              className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] px-4 py-3.5 text-left text-[0.95rem] text-[var(--fg)] transition-all ${
                correta
                  ? 'border-[#15803d] bg-[#f0fdf4] font-semibold text-[#15803d] shadow-sm'
                  : errada
                  ? 'border-[#b91c1c] bg-[#fef2f2] font-semibold text-[#b91c1c]'
                  : marcada
                  ? 'border-[var(--fg)] bg-[rgba(255,106,19,0.08)] ring-2 ring-[var(--violet)]/30 font-medium'
                  : 'border-[var(--line)] bg-white hover:border-[rgba(17,17,17,0.4)]'
              } disabled:cursor-default`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.8rem] font-bold transition ${
                  correta
                    ? 'bg-[#15803d] text-white'
                    : errada
                    ? 'bg-[#b91c1c] text-white'
                    : marcada
                    ? 'bg-[var(--fg)] text-white'
                    : 'bg-[var(--ink)] text-[var(--fg)]'
                }`}
                aria-hidden
              >
                {correta ? '✓' : errada ? '✕' : LETRAS[i]}
              </span>
              <span className="min-w-0 flex-1 leading-snug">{alt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback e Explicação Técnica */}
      {confirmada && (
        <div
          role="status"
          className={`mt-4 rounded-xl border p-4 transition-all ${
            acertou ? 'border-[#bbf7d0] bg-[#f0fdf4]' : 'border-[#fecaca] bg-[#fef2f2]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[1.2rem]">{acertou ? '🎉' : '❌'}</span>
            <p className={`font-bold ${acertou ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>
              {acertou
                ? `Resposta correta! (+${XP_POR_ACERTO} XP)`
                : `Incorreto. A alternativa correta é a letra ${LETRAS[q.correta]}.`}
            </p>
          </div>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--fg2)]">
            <strong>Conceito:</strong> {q.explicacao}
          </p>
        </div>
      )}

      {/* Rodapé da Pergunta */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <p className="hidden text-[0.78rem] text-[var(--muted)] sm:block">
          Atalhos: <kbd className="rounded border border-[var(--line)] px-1 bg-white">A</kbd>–
          <kbd className="rounded border border-[var(--line)] px-1 bg-white">D</kbd> escolhem,{' '}
          <kbd className="rounded border border-[var(--line)] px-1 bg-white">Enter</kbd> confirma
        </p>

        {!confirmada ? (
          <button
            type="button"
            className="btn btn-escuro ml-auto"
            onClick={confirmar}
            disabled={escolha === null}
          >
            Confirmar resposta
          </button>
        ) : (
          <button type="button" className="btn btn-primario ml-auto" onClick={proxima}>
            {indice + 1 < total ? 'Próxima pergunta →' : '🏆 Ver meu resultado final →'}
          </button>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// COMPONENTE PRINCIPAL DA TELA DO QUIZ GAME
// ----------------------------------------------------
export default function Quiz() {
  const usuario = useUsuario();
  const progresso = useProgressoQuiz(usuario?.email);
  const [temaAtivo, setTemaAtivo] = useState<TemaQuiz | null>(null);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState(false);
  const [modalRegrasAberto, setModalRegrasAberto] = useState(false);

  const infoNivel = useMemo(
    () => calcularNivelEProgressoXP(progresso.totalXp),
    [progresso.totalXp]
  );

  const iniciarMaratona = () => {
    setTemaAtivo(gerarTemaMaratona());
  };

  return (
    <div className="gutter tela">
      <div className="mx-auto max-w-[1180px]">
        {/* Título & Banner do Jogo */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mono text-[0.78rem] font-bold uppercase tracking-wider text-[var(--violet)]">
              Academia Ninja de Hardware de Konoha
            </span>
            <h1 className="titulo-tela mt-1">Quiz Ninja de Hardware</h1>
            <p className="subtitulo-tela">
              Acumule pontos de experiência (XP) com cada resposta certa para subir de nível e ascender pelas patentes ninja: de <strong>Estudante da Academia</strong> até o posto supremo de <strong>Hokage 🔥</strong>!
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModalRegrasAberto(true)}
              className="btn btn-secundario btn-pequeno"
            >
              📜 Sistema de Patentes & XP
            </button>
            <button
              type="button"
              onClick={() => setModalHistoricoAberto(true)}
              className="btn btn-secundario btn-pequeno"
            >
              📖 Histórico Ninja ({progresso.historico.length})
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* PAINEL DO JOGADOR: NÍVEL, PATENTE, XP E BARRA DE PROGRESSO */}
        {/* ==================================================== */}
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5 md:p-6 shadow-sm">
          {usuario ? (
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Perfil Google */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {usuario.foto ? (
                    <img
                      src={usuario.foto}
                      alt={usuario.nome}
                      className="h-14 w-14 rounded-full border-2 border-[var(--violet)] object-cover shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-tr from-[var(--violet)] to-[var(--lilac)] text-[1.4rem] font-black text-white shrink-0 shadow-sm">
                      {usuario.nome ? usuario.nome[0].toUpperCase() : 'N'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[1.1rem] font-black truncate">{usuario.nome}</p>
                      <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[0.7rem] font-bold text-emerald-800">
                        Sincronizado
                      </span>
                    </div>
                    <p className="text-[0.82rem] text-[var(--muted)] truncate">{usuario.email}</p>
                    <p className="text-[0.78rem] text-emerald-700 font-medium mt-0.5">
                      ● Nível, Patente e XP salvos na Conta Google
                    </p>
                  </div>
                </div>

                {/* Patente e Nível da Conta */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-[var(--line)] pt-3 lg:pt-0 lg:pl-6">
                  <div className="flex items-center gap-3">
                    <div className="text-[2.5rem] drop-shadow-sm">{infoNivel.dadosPatente.emoji}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[var(--ink)] px-2 py-0.5 text-[0.7rem] font-black uppercase text-[var(--muted)]">
                          Nível {infoNivel.nivel}
                        </span>
                        <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                          Patente Atual
                        </span>
                      </div>
                      <p className="text-[1.25rem] font-black" style={{ color: infoNivel.dadosPatente.borderCor }}>
                        {infoNivel.dadosPatente.nome.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[var(--ink)] px-4 py-2 text-center">
                    <p className="text-[0.7rem] font-bold text-[var(--muted)] uppercase">XP Acumulado</p>
                    <p className="text-[1.2rem] font-black text-emerald-700 font-mono">
                      {infoNivel.xpAtual.toLocaleString()} XP
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--ink)] px-3 py-2 text-center">
                    <p className="text-[0.7rem] font-bold text-[var(--muted)] uppercase">Acertos</p>
                    <p className="text-[1.1rem] font-extrabold text-[var(--fg)]">
                      {progresso.totalAcertos}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso de XP da Conta */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--ink)]/60 p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[0.84rem]">
                  <span className="font-bold text-[var(--fg)]">
                    Progresso de Nível: {infoNivel.dadosPatente.nome} ({infoNivel.nivel}/8)
                  </span>
                  <span className="font-mono font-bold text-[var(--fg2)]">
                    {infoNivel.isMaximo
                      ? `${infoNivel.xpAtual.toLocaleString()} XP · NÍVEL MÁXIMO`
                      : `${infoNivel.xpProgressoNivel} / ${infoNivel.xpNecessarioNivel} XP neste nível`}
                  </span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white border border-[var(--line)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${infoNivel.porcentagemBarra}%`,
                      backgroundColor: infoNivel.dadosPatente.borderCor,
                    }}
                  />
                </div>

                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[0.78rem] text-[var(--muted)]">
                  <span>
                    {infoNivel.isMaximo ? (
                      <strong className="text-red-600">🔥 Patente Suprema de Konoha! Você é o Hokage!</strong>
                    ) : (
                      <>
                        Faltam <strong className="text-[var(--fg)]">{infoNivel.xpFaltaProximo} XP</strong> para subir para o{' '}
                        <strong>Nível {infoNivel.nivel + 1} ({NIVEIS_NINJA[infoNivel.nivel]?.nome} {NIVEIS_NINJA[infoNivel.nivel]?.emoji})</strong>
                      </>
                    )}
                  </span>
                  <span className="font-mono font-bold text-[var(--fg)]">{infoNivel.porcentagemBarra}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-orange-50 via-white to-sky-50 rounded-xl p-4 border border-[var(--line)]">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white border border-[var(--line)] shadow-sm shrink-0">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-bold text-[var(--fg)]">
                      Conecte sua conta Google para salvar seu Nível e XP permanente
                    </h3>
                    <p className="text-[0.85rem] text-[var(--fg2)]">
                      Sua patente ninja ({infoNivel.dadosPatente.nome}) e seus {infoNivel.xpAtual} XP serão preservados para quando você retornar!
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={abrirModalLogin}
                    className="btn btn-primario font-bold inline-flex items-center gap-2"
                  >
                    <span>Conectar com Google</span>
                  </button>
                </div>
              </div>

              {/* Barra de Progresso Visitante */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--ink)]/60 p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[0.84rem]">
                  <span className="font-bold text-[var(--fg)]">
                    Progresso da Conta Ninja: Nível {infoNivel.nivel} · {infoNivel.dadosPatente.nome} {infoNivel.dadosPatente.emoji}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {infoNivel.xpAtual.toLocaleString()} XP Acumulados
                  </span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white border border-[var(--line)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${infoNivel.porcentagemBarra}%`,
                      backgroundColor: infoNivel.dadosPatente.borderCor,
                    }}
                  />
                </div>

                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[0.78rem] text-[var(--muted)]">
                  <span>
                    Faltam <strong className="text-[var(--fg)]">{infoNivel.xpFaltaProximo} XP</strong> para o Nível {infoNivel.nivel + 1} ({NIVEIS_NINJA[infoNivel.nivel]?.nome})
                  </span>
                  <span className="font-mono font-bold text-[var(--fg)]">{infoNivel.porcentagemBarra}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* BANNER DO MODO MARATONA RANQUEADA GERAL */}
        {/* ==================================================== */}
        <div className="mt-6 rounded-2xl border-2 border-[var(--violet)] bg-gradient-to-r from-[rgba(162,75,255,0.08)] via-[rgba(255,106,19,0.06)] to-white p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--violet)] text-white text-[0.75rem] font-black uppercase">
                Grande Exame Ninja
              </span>
              <span className="text-[0.82rem] font-semibold text-[var(--muted)]">10 perguntas aleatórias · Até +500 XP</span>
            </div>
            <h3 className="text-[1.25rem] font-black mt-1 text-[var(--fg)]">
              Maratona Konoha: Desafio Geral de Arquitetura
            </h3>
            <p className="text-[0.9rem] text-[var(--fg2)] mt-0.5 max-w-[650px]">
              Um teste completo sorteado de todos os 12 temas de hardware. Ganhe até +500 XP de uma vez para subir rápido para Jōnin, ANBU e Hokage!
            </p>
          </div>
          <button
            type="button"
            onClick={iniciarMaratona}
            className="btn btn-primario shrink-0 font-extrabold text-[0.95rem] px-5 py-2.5 shadow-md hover:scale-[1.02] transition"
          >
            🔥 Jogar Maratona (+500 XP)
          </button>
        </div>

        {/* ==================================================== */}
        {/* ÁREA DE JOGO / SELEÇÃO DE TEMAS */}
        {/* ==================================================== */}
        <div className="mt-8">
          {temaAtivo ? (
            <ArenaQuiz key={temaAtivo.id} tema={temaAtivo} aoSair={() => setTemaAtivo(null)} />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[1.15rem] font-black text-[var(--fg)]">
                  Temas de Treinamento Ninja (3 perguntas · até +150 XP cada)
                </h2>
                <span className="text-[0.82rem] text-[var(--muted)]">
                  {Object.keys(progresso.temas).length} de {TEMAS_ARQUITETURA.length} temas concluídos
                </span>
              </div>

              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {TEMAS_ARQUITETURA.map((t, i) => {
                  const statusTema = progresso.temas[t.id];
                  const patente = statusTema?.melhorPatente;
                  const dadosP = patente ? DADOS_PATENTES[patente] : null;

                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => setTemaAtivo(t)}
                        className={`cartao neon-hover group flex h-full min-h-[160px] w-full flex-col p-4 text-left border transition-all ${
                          patente === 'HOKAGE'
                            ? 'border-[#ef4444] bg-[#fef2f2]/40 shadow-sm'
                            : patente === 'CHUNIN' || patente === 'JONIN'
                            ? 'border-[#3b82f6] bg-[#eff6ff]/40'
                            : patente
                            ? 'border-[var(--line)] bg-[#fafafa]'
                            : 'border-[var(--line)] bg-white hover:border-[var(--violet)]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="tnum text-[0.78rem] font-bold text-[var(--lilac)]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {dadosP ? (
                            <span
                              className="px-2 py-0.5 rounded-full text-[0.72rem] font-black uppercase inline-flex items-center gap-1 border"
                              style={{
                                borderColor: dadosP.borderCor,
                                color: dadosP.borderCor,
                                backgroundColor: 'white',
                              }}
                            >
                              <span>{dadosP.emoji}</span>
                              <span>{dadosP.nome}</span>
                              <span className="font-mono text-[0.68rem] font-semibold text-[var(--muted)]">
                                ({statusTema.melhorAcertos}/{statusTema.totalPerguntas})
                              </span>
                            </span>
                          ) : (
                            <span className="text-[0.72rem] font-semibold text-[var(--muted)]">
                              +150 XP
                            </span>
                          )}
                        </div>

                        <span className="mt-2 text-[1rem] font-bold leading-snug group-hover:text-[var(--violet)] transition">
                          {t.titulo}
                        </span>

                        <p className="mt-1 text-[0.8rem] text-[var(--muted)] line-clamp-2 leading-relaxed">
                          {t.descricao}
                        </p>

                        <div className="mt-auto pt-3 flex items-center justify-between text-[0.8rem] font-semibold text-[var(--muted)] border-t border-[var(--line)]/60">
                          <span>{t.perguntas.length} questões</span>
                          <span className="group-hover:translate-x-1 transition text-[var(--violet)]">Jogar →</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODAL: HISTÓRICO DE PARTIDAS E XP */}
      {/* ==================================================== */}
      <Modal
        aberto={modalHistoricoAberto}
        aoFechar={() => setModalHistoricoAberto(false)}
        titulo="Histórico de Treinamento Ninja & XP"
      >
        <div className="space-y-4">
          <p className="text-[0.88rem] text-[var(--fg2)]">
            Aqui estão suas últimas partidas salvas{' '}
            {usuario ? (
              <>
                na conta Google <strong>{usuario.email}</strong>.
              </>
            ) : (
              <>no navegador (como visitante).</>
            )}
          </p>

          {progresso.historico.length === 0 ? (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--ink)] p-8 text-center text-[var(--muted)]">
              <p className="text-[1.5rem]">🍃</p>
              <p className="mt-2 font-semibold">Nenhum exame ninja registrado ainda.</p>
              <p className="text-[0.82rem] mt-1">Conclua um tema ou a Maratona para acumular XP e subir de patente!</p>
            </div>
          ) : (
            <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
              {progresso.historico.map((partida) => {
                const infoP = DADOS_PATENTES[partida.patente] || NIVEIS_NINJA[0];
                return (
                  <div
                    key={partida.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-white p-3.5 text-[0.88rem]"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--fg)] truncate">{partida.temaTitulo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[0.75rem] text-[var(--muted)]">{partida.dataFormatada}</span>
                        <span className="text-[0.72rem] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                          +{partida.xpGanho || partida.acertos * XP_POR_ACERTO} XP
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="tnum font-extrabold text-[0.95rem]">
                        {partida.acertos} / {partida.total}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-full text-[0.75rem] font-black uppercase inline-flex items-center gap-1 border"
                        style={{
                          borderColor: infoP.borderCor,
                          color: infoP.borderCor,
                          backgroundColor: `${infoP.borderCor}15`,
                        }}
                      >
                        <span>{infoP.emoji}</span>
                        <span>{infoP.nome}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-3">
            {progresso.historico.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Tem certeza que deseja zerar o histórico deste perfil?')) {
                    limparHistoricoUsuario(usuario?.email);
                  }
                }}
                className="text-[0.82rem] text-rose-600 hover:underline font-semibold"
              >
                Limpar histórico
              </button>
            )}
            <button
              type="button"
              onClick={() => setModalHistoricoAberto(false)}
              className="btn btn-secundario btn-pequeno ml-auto"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL: COMO FUNCIONAM AS PATENTES DE NARUTO E O SISTEMA DE XP */}
      {/* ==================================================== */}
      <Modal
        aberto={modalRegrasAberto}
        aoFechar={() => setModalRegrasAberto(false)}
        titulo="Sistema de Patentes Ninja & Níveis de XP"
      >
        <div className="space-y-4 text-[0.92rem] leading-relaxed text-[var(--fg2)]">
          <p>
            No <strong>Konoha Hardware</strong>, você sobe de nível acumulando <strong>pontos de experiência (XP)</strong> a cada resposta correta. Cada nível corresponde a uma patente ninja oficial do universo Naruto:
          </p>

          <div className="rounded-xl border border-[var(--line)] bg-emerald-50/50 p-3 text-[0.88rem] text-emerald-900 font-medium">
            ⭐ <strong>Regra de XP:</strong> Cada resposta correta concede <strong>+{XP_POR_ACERTO} XP</strong> de experiência. Patentes mais altas exigem progressivamente mais experiência para serem alcançadas.
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
            {NIVEIS_NINJA.map((n) => (
              <div
                key={n.nivel}
                className="rounded-xl border p-3 text-[0.86rem]"
                style={{
                  borderColor: `${n.borderCor}60`,
                  backgroundColor: `${n.borderCor}08`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[1.3rem]">{n.emoji}</span>
                    <h4 className="font-black text-[0.95rem]" style={{ color: n.borderCor }}>
                      Nível {n.nivel}: {n.nome}
                    </h4>
                  </div>
                  <span className="font-mono text-[0.78rem] font-bold px-2 py-0.5 rounded bg-white border border-[var(--line)]">
                    {n.xpMinimo === 0 ? '0 XP' : `${n.xpMinimo} XP`}
                  </span>
                </div>
                <p className="mt-1 text-[0.8rem] text-[var(--fg2)]">{n.descricao}</p>
                <p className="mt-0.5 text-[0.74rem] text-[var(--muted)]">
                  <strong>Requisito:</strong> {n.requisito}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[var(--ink)] p-3.5 border border-[var(--line)] text-[0.86rem]">
            <p className="font-bold text-[var(--fg)]">🔐 Salvamento na Conta Google:</p>
            <p className="mt-0.5">
              Ao conectar sua conta Google, seu nível, patente ninja e XP acumulado ficam permanentemente salvos na nuvem. Você pode fechar o navegador, desligar o computador e retornar quando quiser sem perder seu progresso!
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setModalRegrasAberto(false)}
              className="btn btn-primario btn-pequeno"
            >
              Entendido, vamos treinar!
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
