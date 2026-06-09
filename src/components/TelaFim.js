import React from 'react';
import Tableau from './Tableau';
import { formatarNumero, EPSILON } from '../utils/jogo';
import { OPERADORES } from '../utils/baralho';
import { contarOperadores } from '../utils/estatisticas';
import Confete from './Confete';

// Respeita quem pede menos movimento: não dispara o confete.
function prefereReduzirMovimento() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// Nomes acentuados dos operadores (rotulo acessivel + nome visivel da medalha).
const NOMES_OP = {
  soma: 'Soma',
  subtracao: 'Subtração',
  multiplicacao: 'Multiplicação',
  divisao: 'Divisão',
};
const contagemVezes = (n) => `${n} ${n === 1 ? 'vez' : 'vezes'}`;
const rotuloMedalha = (id, n) => `${NOMES_OP[id]}: ${n === 0 ? 'nenhuma vez' : contagemVezes(n)}`;

// Tela de fim de partida (Passo 6 + recap Passo 13): vitória/derrota, a conta
// construída, o recap de operadores, uma dica (HTTP) e o botão de nova partida.
// Bloco com max-width centralizado (sem .row do Bootstrap).
export default function TelaFim({ estado, dicas, onNova }) {
  const venceu = estado.resultado === 'vitoria';

  // escolha estável da dica (sem Math.random no render): baseada no objetivo
  const dica = dicas && dicas.length ? dicas[estado.objetivo % dicas.length] : null;

  // Recap (Passo 13): contagem de operadores usados (helper puro ja testado).
  const ops = contarOperadores(estado.tableau);
  const totalOps = OPERADORES.reduce((soma, op) => soma + (ops[op.id] || 0), 0);

  // Feedback gentil de derrota: o quanto faltou (ou passou) do alvo, sem "quase".
  let faltouTexto = null;
  if (!venceu && estado.resultadoParcial != null) {
    const diff = estado.objetivo - estado.resultadoParcial; // >0 faltou ; <0 passou
    const mag = Math.abs(diff);
    if (mag >= EPSILON) {
      const valor = formatarNumero(mag);
      faltouTexto =
        diff > 0
          ? `Faltaram ${valor} para o alvo. Da próxima vocês chegam lá!`
          : `Vocês passaram ${valor} do alvo. Da próxima vocês acertam!`;
    }
  }

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
          <h2 className="m-0">{venceu ? 'Vitória coletiva!' : 'Boa tentativa!'}</h2>
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

          {!venceu && faltouTexto && (
            <p className="fim-faltou">
              <i className="fas fa-heart" aria-hidden="true"></i>
              <span>{faltouTexto}</span>
            </p>
          )}

          <p className="text-muted small mb-1">Operação construída:</p>
          <Tableau tableau={estado.tableau} resultadoParcial={estado.resultadoParcial} />

          {totalOps > 0 && (
            <section className="fim-recap" aria-labelledby="fim-recap-titulo">
              <h3 id="fim-recap-titulo" className="fim-recap__titulo">Operadores que vocês usaram</h3>
              <div className="fim-recap__lista" role="list">
                {OPERADORES.map((op) => {
                  const n = ops[op.id] || 0;
                  return (
                    <div
                      key={op.id}
                      role="listitem"
                      aria-label={rotuloMedalha(op.id, n)}
                      className={'fim-medalha fim-medalha--' + op.id + (n === 0 ? ' fim-medalha--zero' : '')}
                    >
                      <span className="fim-medalha__simbolo" aria-hidden="true">{op.simbolo}</span>
                      <span className="fim-medalha__contagem" aria-hidden="true">{n}</span>
                      <span className="fim-medalha__nome" aria-hidden="true">{NOMES_OP[op.id]}</span>
                    </div>
                  );
                })}
              </div>
              <p className="fim-recap__prompt">Conversem: qual operador ajudou mais?</p>
            </section>
          )}

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
