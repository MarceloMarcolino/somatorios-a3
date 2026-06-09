import React from 'react';
import Tableau from './Tableau';
import { formatarNumero } from '../utils/jogo';
import Confete from './Confete';

// Respeita quem pede menos movimento: não dispara o confete.
function prefereReduzirMovimento() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// Tela de fim de partida (Passo 6): vitória/derrota, a conta construída,
// uma dica (dado da requisição HTTP) e o botão de nova partida.
// Bloco com max-width centralizado (sem .row do Bootstrap).
export default function TelaFim({ estado, dicas, onNova }) {
  const venceu = estado.resultado === 'vitoria';

  // escolha estável da dica (sem Math.random no render): baseada no objetivo
  const dica = dicas && dicas.length ? dicas[estado.objetivo % dicas.length] : null;

  return (
    <div className="tela-fim mx-auto text-center">
      {venceu && !prefereReduzirMovimento() && <Confete />}

      {/* Anuncio do desfecho para leitores de tela (Passo 8) */}
      <div role="alert" className="visually-hidden">
        {venceu
          ? 'Vitória coletiva! O grupo atingiu o valor objetivo.'
          : 'Fim de jogo. As cartas acabaram antes do objetivo. Tentem novamente.'}
      </div>
      <div className="card card-ludico shadow-sm overflow-hidden">
        <div className={'fim-faixa ' + (venceu ? 'fim-faixa--vitoria' : 'fim-faixa--derrota')}>
          <i className={'fas ' + (venceu ? 'fa-trophy' : 'fa-face-smile')} aria-hidden="true"></i>
          <h2 className="m-0">{venceu ? 'Vitória coletiva!' : 'Quase lá!'}</h2>
        </div>

        <div className="card-body">
          <p className="lead">
            {venceu
              ? 'O grupo chegou exatamente ao valor objetivo. Todos venceram juntos!'
              : 'As cartas acabaram antes de atingir o objetivo. Joguem de novo e tentem outra combinação!'}
          </p>

          <div className="fim-placar">
            <div>
              <span className="fim-placar__rotulo">Objetivo</span>
              <span className="fim-placar__valor txt-brand">{formatarNumero(estado.objetivo)}</span>
            </div>
            <div>
              <span className="fim-placar__rotulo">Resultado final</span>
              <span className={'fim-placar__valor ' + (venceu ? 'txt-sucesso' : 'txt-perigo')}>
                {formatarNumero(estado.resultadoParcial)}
              </span>
            </div>
          </div>

          <p className="text-muted small mb-1">Operação construída:</p>
          <Tableau tableau={estado.tableau} resultadoParcial={estado.resultadoParcial} />

          {dica && (
            <div className="dica-inicial text-start mt-3" role="note">
              <i className="fas fa-lightbulb" aria-hidden="true"></i>
              <span>
                <strong className="dica-inicial__rotulo">Dica:</strong> {dica.texto}
              </span>
            </div>
          )}

          <div className="d-grid mt-3">
            <button className="btn btn-primary btn-grande" onClick={onNova}>
              <i className="fas fa-rotate-right me-2" aria-hidden="true"></i>Nova partida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
