/** Termo pedido ao glossário antes de a tela de Dúvidas terminar de carregar. */
let pendente = '';

declare global {
  interface Window {
    __buscaGlossarioPendente?: string;
  }
}

export function pedirBuscaGlossario(termo: string) {
  pendente = termo;
  if (typeof window !== 'undefined') {
    window.__buscaGlossarioPendente = termo;
    window.dispatchEvent(new CustomEvent('glossary-search', { detail: termo }));
  }
}

export function lerBuscaGlossario(): string {
  return pendente || (typeof window !== 'undefined' ? window.__buscaGlossarioPendente : '') || '';
}

export function limparBuscaGlossario() {
  pendente = '';
  if (typeof window !== 'undefined') {
    window.__buscaGlossarioPendente = '';
  }
}

export function consumirBuscaGlossario(): string {
  const t = lerBuscaGlossario();
  limparBuscaGlossario();
  return t;
}
