'use client';
/** Caixa de confirmação para ações que apagam algo (prevenção de erros). */
import { useSyncExternalStore } from 'react';
import Modal from './Modal';

type Pedido = {
  titulo: string;
  mensagem: string;
  confirmar: string;
  cancelar: string;
  perigo?: boolean;
  responder: (ok: boolean) => void;
};

let pedido: Pedido | null = null;
const ouvintes = new Set<() => void>();
const emitir = () => ouvintes.forEach((l) => l());

export function confirmar(opcoes: { titulo: string; mensagem: string; confirmar?: string; cancelar?: string; perigo?: boolean }): Promise<boolean> {
  return new Promise((resolve) => {
    pedido?.responder(false);
    pedido = {
      confirmar: 'Confirmar',
      cancelar: 'Cancelar',
      ...opcoes,
      responder: (ok) => {
        pedido = null;
        emitir();
        resolve(ok);
      },
    };
    emitir();
  });
}

export default function Confirmacao() {
  const atual = useSyncExternalStore(
    (cb) => {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    () => pedido,
    () => null,
  );
  return (
    <Modal aberto={!!atual} aoFechar={() => atual?.responder(false)} titulo={atual?.titulo ?? ''} largura={460} papel="alertdialog">
      {atual && (
        <>
          <p className="text-[0.95rem] leading-relaxed text-[var(--fg2)]">{atual.mensagem}</p>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            {/* foco inicial na opção segura, para um Enter distraído não apagar nada */}
            <button type="button" data-foco-inicial className="btn btn-secundario" onClick={() => atual.responder(false)}>
              {atual.cancelar}
            </button>
            <button type="button" className={`btn ${atual.perigo ? 'btn-perigo' : 'btn-escuro'}`} onClick={() => atual.responder(true)}>
              {atual.confirmar}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
