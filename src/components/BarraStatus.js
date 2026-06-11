import React from 'react';
import { formatarNumero, EPSILON } from '../utils/jogo';

// HEURISTICA 1 - Visibilidade do status do sistema (Passo 5):
// Objetivo em destaque (heroi) + chips de resultado parcial, cartas e vez.
// Passo 12: termometro do objetivo (distancia ate o alvo) — reforco VISUAL.
export default function BarraStatus({ objetivo, resultadoParcial, cartasNoBaralho, jogadorAtual }) {
  // Termometro: derivado SO de props ja recebidas (nao toca nas regras do jogo).
  const temResultado = resultadoParcial !== null;
  const atual = temResultado ? resultadoParcial : 0;
  const distancia = objetivo - atual;
  const acima = distancia < -EPSILON; // passou do alvo (overshoot)
  const progresso = objetivo > 0 ? Math.max(0, Math.min(1, atual / objetivo)) : 0;
  const larguraPct = Math.round(progresso * 100); // 0..100, nunca NaN
  const estado = acima
    ? `Passou ${formatarNumero(Math.abs(distancia))}`
    : `Faltam ${formatarNumero(distancia)}`;

  return (
    <div className="barra-status__wrap mb-3" role="group" aria-label="Status da partida">
      <div className="barra-status">
        <div className="status-objetivo">
          <i className="fas fa-bullseye" aria-hidden="true"></i>
          <span className="status-objetivo__rotulo">Objetivo</span>
          <span className="status-objetivo__valor">{formatarNumero(objetivo)}</span>
        </div>

        <div className="status-chips">
          <div className="status-chip">
            <span className="status-chip__rotulo">
              <i className="fas fa-equals me-1" aria-hidden="true"></i>Resultado
            </span>
            <span className="status-chip__valor">{formatarNumero(resultadoParcial)}</span>
          </div>
          <div className="status-chip">
            <span className="status-chip__rotulo">
              <i className="fas fa-layer-group me-1" aria-hidden="true"></i>Baralho
            </span>
            <span className="status-chip__valor">{cartasNoBaralho}</span>
          </div>
          <div className="status-chip">
            <span className="status-chip__rotulo">
              <i className="fas fa-user-clock me-1" aria-hidden="true"></i>Vez de
            </span>
            <span className="status-chip__valor status-chip__valor--nome">{jogadorAtual}</span>
          </div>
        </div>
      </div>

      {/* Termometro do objetivo: TEXTO acessivel; so a BARRA visual e decorativa (aria-hidden).
          Nao usa role=progressbar/aria-valuenow p/ nao duplicar a regiao aria-live da TelaPartida. */}
      <div className="termometro">
        <div className="termometro__cabecalho">
          <span className="termometro__rotulo">Progresso</span>
          <span className={'termometro__estado' + (acima ? ' termometro__estado--acima' : '')}>
            {estado}
            {acima && <span className="termometro__dica"> · tentem subtrair ou dividir</span>}
          </span>
        </div>
        <div className="termometro__trilha" aria-hidden="true">
          <div
            className={'termometro__preenchimento' + (acima ? ' termometro__preenchimento--acima' : '')}
            style={{ width: `${larguraPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
