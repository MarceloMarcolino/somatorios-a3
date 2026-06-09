import React from 'react';
import { useDialogoAcessivel } from '../hooks/useDialogoAcessivel';

// HEURÍSTICA - Ajuda e documentação. Acessível por teclado (Passo 7):
// foco preso no diálogo, Esc fecha, foco devolvido ao botão de origem.
export default function ModalRegras({ onFechar }) {
  const ref = useDialogoAcessivel(onFechar);

  return (
    <div className="modal-simples" onClick={onFechar}>
      <div
        ref={ref}
        className="card card-ludico shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-regras"
        tabIndex={-1}
        style={{ maxWidth: 640, maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="marca d-flex justify-content-between align-items-center px-3 py-3 text-white">
          <h2 className="h5 m-0" id="titulo-regras">
            <i className="fas fa-book me-2" aria-hidden="true"></i>Como jogar
          </h2>
          <button className="btn-close btn-close-white" aria-label="Fechar" onClick={onFechar}></button>
        </div>
        <div className="card-body">
          <ol className="m-0">
            <li className="mb-2">
              <strong>Objetivo:</strong> todos jogam JUNTOS para que o resultado da conta chegue
              exatamente ao <strong>valor objetivo</strong>.
            </li>
            <li className="mb-2">
              <strong>Baralho:</strong> 36 cartas com números de 1 a 9 em quatro naipes, que são os
              operadores <span style={{ color: 'var(--cor-soma)' }}>+</span>,{' '}
              <span style={{ color: 'var(--cor-subtracao)' }}>−</span>,{' '}
              <span style={{ color: 'var(--cor-multiplicacao)' }}>×</span> e{' '}
              <span style={{ color: 'var(--cor-divisao)' }}>÷</span>.
            </li>
            <li className="mb-2">
              <strong>Início:</strong> cada jogador recebe 4 cartas. O objetivo é a soma dos valores
              de todas as cartas distribuídas.
            </li>
            <li className="mb-2">
              <strong>Na sua vez:</strong> jogue uma carta. A sequência é sempre{' '}
              <em>número, operador, número, operador...</em> A mesma carta vale como número (em pé)
              ou como operador (deitada).
            </li>
            <li className="mb-2">
              <strong>Conta:</strong> o resultado é calculado da esquerda para a direita, sem
              prioridade de operações. Após jogar, você compra uma carta nova.
            </li>
            <li>
              <strong>Vitória:</strong> o resultado parcial bate o objetivo (todos vencem juntos).{' '}
              <strong>Derrota:</strong> as cartas acabam antes disso.
            </li>
          </ol>
        </div>
        <div className="card-footer bg-white border-0 text-end">
          <button className="btn btn-primary btn-grande" onClick={onFechar}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
