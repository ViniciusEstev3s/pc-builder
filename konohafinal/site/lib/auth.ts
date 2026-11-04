'use client';
import { useSyncExternalStore } from 'react';
import { avisar } from './avisos';

export const CHAVE_SESSAO = 'konoha-usuario-google';
export const CHAVE_CLIENT_ID = 'konoha_google_client_id';

export interface UsuarioGoogle {
  email: string;
  nome: string;
  token: string;
  foto?: string;
  demo?: boolean;
}

type GoogleOAuth = {
  accounts: {
    oauth2: {
      initTokenClient: (cfg: {
        client_id: string;
        scope: string;
        callback: (r: { access_token?: string; error?: string; error_description?: string }) => void;
        error_callback?: (e: { type?: string }) => void;
      }) => { requestAccessToken: (o?: { prompt?: string }) => void };
      revoke: (token: string, done: () => void) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleOAuth;
  }
}

let usuarioAtual: UsuarioGoogle | null = null;
let inicializado = false;
let modalLoginAberto = false;
const ouvintesAuth = new Set<() => void>();
const ouvintesModal = new Set<() => void>();

function notificarAuth() {
  ouvintesAuth.forEach((cb) => cb());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('konoha:auth-change', { detail: usuarioAtual }));
  }
}

function notificarModal() {
  ouvintesModal.forEach((cb) => cb());
}

export function inicializarAuth(): void {
  if (inicializado || typeof window === 'undefined') return;
  inicializado = true;

  try {
    const salvoLocal = localStorage.getItem(CHAVE_SESSAO);
    const salvoSessao = sessionStorage.getItem(CHAVE_SESSAO);
    const dados = salvoLocal || salvoSessao;
    if (dados) {
      usuarioAtual = JSON.parse(dados);
      // Assegura paridade entre storages
      if (!salvoLocal && salvoSessao) localStorage.setItem(CHAVE_SESSAO, salvoSessao);
      if (!salvoSessao && salvoLocal) sessionStorage.setItem(CHAVE_SESSAO, salvoLocal);
    }
  } catch {
    /* sem sessão válida */
  }

  window.addEventListener('storage', (e) => {
    if (e.key === CHAVE_SESSAO) {
      try {
        usuarioAtual = e.newValue ? JSON.parse(e.newValue) : null;
        notificarAuth();
      } catch {
        usuarioAtual = null;
        notificarAuth();
      }
    }
  });
}

export function obterUsuarioAtual(): UsuarioGoogle | null {
  if (!inicializado && typeof window !== 'undefined') {
    inicializarAuth();
  }
  return usuarioAtual;
}

export function salvarUsuario(u: UsuarioGoogle): void {
  usuarioAtual = u;
  if (typeof window !== 'undefined') {
    try {
      const serializado = JSON.stringify(u);
      localStorage.setItem(CHAVE_SESSAO, serializado);
      sessionStorage.setItem(CHAVE_SESSAO, serializado);
    } catch {
      /* quota ou storage desabilitado */
    }
  }
  notificarAuth();
}

export function sairUsuario(): void {
  if (typeof window !== 'undefined' && usuarioAtual && !usuarioAtual.demo && window.google?.accounts?.oauth2) {
    try {
      window.google.accounts.oauth2.revoke(usuarioAtual.token, () => {});
    } catch {
      /* segue */
    }
  }
  usuarioAtual = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CHAVE_SESSAO);
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {
      /* segue */
    }
  }
  notificarAuth();
  avisar('Você saiu da sua conta Google.', { tipo: 'info' });
}

export function abrirModalLogin(): void {
  modalLoginAberto = true;
  notificarModal();
}

export function fecharModalLogin(): void {
  modalLoginAberto = false;
  notificarModal();
}

export function useUsuario(): UsuarioGoogle | null {
  return useSyncExternalStore(
    (cb) => {
      inicializarAuth();
      ouvintesAuth.add(cb);
      return () => {
        ouvintesAuth.delete(cb);
      };
    },
    () => {
      inicializarAuth();
      return usuarioAtual;
    },
    () => null,
  );
}

export function useModalLoginAberto(): boolean {
  return useSyncExternalStore(
    (cb) => {
      ouvintesModal.add(cb);
      return () => {
        ouvintesModal.delete(cb);
      };
    },
    () => modalLoginAberto,
    () => false,
  );
}

export function obterClientId(): string {
  if (typeof window === 'undefined') return '';
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || localStorage.getItem(CHAVE_CLIENT_ID) || '';
}

export function salvarClientId(id: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CHAVE_CLIENT_ID, id.trim());
    } catch {
      /* segue */
    }
  }
}

export function carregarScriptGoogle(): Promise<void> {
  if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((ok, falha) => {
    const scriptExistente = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (scriptExistente) {
      ok();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => ok();
    s.onerror = () => falha(new Error('Falha ao carregar script do Google'));
    document.head.appendChild(s);
  });
}

export async function executarFluxoGoogle(clientId: string): Promise<UsuarioGoogle | null> {
  return new Promise(async (resolve) => {
    try {
      await carregarScriptGoogle();
      if (!window.google?.accounts?.oauth2) {
        avisar('Serviço do Google indisponível no momento.', { tipo: 'aviso' });
        resolve(null);
        return;
      }

      const cliente = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (r) => {
          if (r.error || !r.access_token) {
            avisar('O Google não autorizou o login. Verifique as credenciais.', { tipo: 'aviso' });
            resolve(null);
            return;
          }
          try {
            const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${r.access_token}` },
            });
            if (!resp.ok) throw new Error('Falha no userinfo');
            const perfil = await resp.json();
            const u: UsuarioGoogle = {
              email: perfil.email,
              nome: perfil.name || perfil.email,
              token: r.access_token,
              foto: perfil.picture,
            };
            salvarUsuario(u);
            fecharModalLogin();
            avisar(`Autenticado com sucesso como ${u.email}!`, { tipo: 'sucesso' });
            resolve(u);
          } catch {
            avisar('Não foi possível ler as informações de perfil do Google.', { tipo: 'aviso' });
            resolve(null);
          }
        },
        error_callback: () => {
          avisar('A janela de autenticação foi fechada ou bloqueada por pop-up.', { tipo: 'aviso' });
          resolve(null);
        },
      });

      cliente.requestAccessToken({ prompt: 'select_account' });
    } catch {
      avisar('Erro de conexão ao contatar o Google Identity.', { tipo: 'aviso' });
      resolve(null);
    }
  });
}

export function entrarVisitanteDemo(): UsuarioGoogle {
  const demo: UsuarioGoogle = {
    email: 'estudante.demo@konohahardware.com.br',
    nome: 'Usuário Acadêmico (Demo)',
    token: 'demo-token-' + Date.now(),
    foto: undefined,
    demo: true,
  };
  salvarUsuario(demo);
  fecharModalLogin();
  avisar('Sessão acadêmica de demonstração iniciada!', { tipo: 'sucesso' });
  return demo;
}
