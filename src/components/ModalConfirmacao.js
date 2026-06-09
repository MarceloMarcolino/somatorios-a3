import React from 'react';
import { useDialogoAcessivel } from '../hooks/useDialogoAcessivel';

// HEURÍSTICAS - Controle/liberdade do usuário + prevenção de erros.
// Acessível por teclado (Passo 7): foco preso, Esc cancela, foco devolvido.
export default function ModalConfirmacao({ mensagem, onConfirmar, onCancelar }) {
  const ref = useDialogoAcessivel(onCancelar);

  return (
    <div className="modal-simples" onClick={onCancelar}>
      <div
        ref={ref}
        className="card card-ludico shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirma"
        tabIndex={-1}
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body text-center">
          <i className="fas fa-triangle-exclamation fa-2x txt-aviso mb-3" aria-hidden="true"></i>
          <h2 className="h5" id="titulo-confirma">{mensagem}</h2>
        </div>
        <div className="card-footer bg-white border-0 d-grid gap-2">
          <button className="btn btn-outline-secondary btn-grande" onClick={onCancelar}>
            Continuar jogando
          </button>
          <button className="btn btn-danger btn-grande" onClick={onConfirmar}>
            Abandonar partida
          </button>
        </div>
      </div>
    </div>
  );
}
