import React from 'react';
import { useDialogoAcessivel } from '../hooks/useDialogoAcessivel';

// Tela de transição "pass-and-play". Acessível por teclado (Passo 7):
// foco vai para o botão ao abrir e fica preso (não há Esc: não se pula a vez).
export default function PasseDispositivo({ nome, onRevelar }) {
  const ref = useDialogoAcessivel();

  return (
    <div className="overlay-passe">
      <div
        ref={ref}
        className="overlay-passe__caixa"
        role="dialog"
        aria-modal="true"
        aria-label={`Vez de ${nome}`}
        tabIndex={-1}
      >
        <i className="fas fa-mobile-screen-button fa-3x mb-3" aria-hidden="true"></i>
        <p className="overlay-passe__rotulo">Passe o dispositivo para</p>
        <p className="overlay-passe__nome">{nome}</p>
        <p className="overlay-passe__aviso">
          As cartas dos outros jogadores ficam escondidas. Só <strong>{nome}</strong> deve ver a
          próxima tela.
        </p>
        <div className="d-grid">
          <button className="btn btn-light btn-grande" onClick={onRevelar}>
            <i className="fas fa-eye me-2" aria-hidden="true"></i>
            Sou {nome}, ver minhas cartas
          </button>
        </div>
      </div>
    </div>
  );
}
