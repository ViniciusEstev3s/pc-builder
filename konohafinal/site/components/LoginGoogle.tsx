'use client';
import { useState } from 'react';
import {
  useUsuario,
  useModalLoginAberto,
  abrirModalLogin,
  fecharModalLogin,
  executarFluxoGoogle,
  entrarVisitanteDemo,
  sairUsuario,
  obterClientId,
  salvarClientId,
} from '@/lib/auth';
import { avisar } from '@/lib/avisos';
import Modal from './ui/Modal';

export default function LoginGoogle() {
  const usuario = useUsuario();
  const modalAberto = useModalLoginAberto();
  const [carregando, setCarregando] = useState(false);
  const [clientIdInput, setClientIdInput] = useState('');

  const clicarEntrar = async () => {
    const idAtual = obterClientId();
    if (idAtual) {
      setCarregando(true);
      await executarFluxoGoogle(idAtual);
      setCarregando(false);
    } else {
      abrirModalLogin();
    }
  };

  const salvarClientIdEEntrar = async () => {
    const limpo = clientIdInput.trim();
    if (!limpo) {
      avisar('Cole um Client ID válido antes de continuar.', { tipo: 'aviso' });
      return;
    }
    salvarClientId(limpo);
    setCarregando(true);
    await executarFluxoGoogle(limpo);
    setCarregando(false);
  };

  if (usuario) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--ink)] px-2.5 py-1 text-[0.8rem] font-semibold text-[var(--fg)]"
          title={usuario.email}
        >
          {usuario.foto ? (
            <img src={usuario.foto} alt="" className="h-4 w-4 rounded-full object-cover" />
          ) : (
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--violet)] text-[0.6rem] font-bold text-[#111]">
              {usuario.email[0].toUpperCase()}
            </span>
          )}
          <span className="max-w-[14ch] truncate">{usuario.email}</span>
        </span>
        <button type="button" onClick={sairUsuario} className="btn btn-secundario btn-pequeno">
          Sair
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={clicarEntrar}
        disabled={carregando}
        className="btn btn-secundario btn-pequeno inline-flex items-center gap-1.5"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden>
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
        <span>{carregando ? 'Conectando…' : 'Entrar com Google'}</span>
      </button>

      <Modal aberto={modalAberto} aoFechar={fecharModalLogin} titulo="Autenticação com Google (OAuth 2.0)">
        <div className="space-y-4 text-[0.92rem] leading-relaxed text-[var(--fg2)]">
          <p>
            O <strong>Konoha Hardware</strong> utiliza a biblioteca oficial do Google Identity Services (OAuth 2.0 com escopos{' '}
            <code className="mono rounded bg-[var(--ink)] px-1.5 py-0.5 text-[0.82rem]">openid email profile</code>) para identificar o usuário e sincronizar seu progresso, medalhas e patentes do quiz.
          </p>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--ink)] p-4 text-[0.86rem]">
            <p className="font-semibold text-[var(--fg)]">Para conectar seu próprio Client ID do Google Cloud:</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Acesse o Google Cloud Console &gt; APIs e Serviços &gt; Credenciais.</li>
              <li>Crie um <em>ID do cliente OAuth 2.0 (Aplicativo Web)</em>.</li>
              <li>Adicione a origem JavaScript autorizada (ex.: <code className="mono text-[var(--violet)]">http://localhost:3000</code>).</li>
              <li>Cole o Client ID no campo abaixo.</li>
            </ol>
          </div>

          <div>
            <label htmlFor="input-google-id" className="block text-[0.84rem] font-bold text-[var(--fg)]">
              Google Client ID:
            </label>
            <input
              id="input-google-id"
              type="text"
              placeholder="Ex: 123456789-exemplo.apps.googleusercontent.com"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5 text-[0.88rem] text-[var(--fg)] outline-none transition focus:border-[var(--violet)]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={entrarVisitanteDemo}
              className="text-[0.84rem] font-semibold text-[var(--muted)] hover:text-[var(--fg)] underline underline-offset-2"
            >
              Entrar como visitante (demonstração)
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={fecharModalLogin} className="btn btn-secundario btn-pequeno">
                Cancelar
              </button>
              <button type="button" onClick={salvarClientIdEEntrar} disabled={carregando} className="btn btn-primario btn-pequeno">
                {carregando ? 'Conectando…' : 'Salvar e conectar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
