import React from 'react';
import { formatarNumero } from '../utils/jogo';

// Mostra a conta em construcao: numeros (mini-cartas) e operadores em sequencia,
// terminando com "= resultado parcial" (Passo 5). Lista com .map() + key.
export default function Tableau({ tableau, resultadoParcial }) {
  return (
    <div className="tableau mb-3">
      {tableau.length === 0 ? (
        <span className="tableau__vazio">
          <i className="fas fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
          A conta aparece aqui conforme as cartas forem jogadas...
        </span>
      ) : (
        <div className="tableau__expressao">
          {tableau.map((item) => (
            <span key={item.carta.id} className="tableau__item">
              {item.tipo === 'numero' ? (
                <span className="mini-carta" style={{ '--cor-carta': item.carta.operador.cor }}>
                  {item.carta.valor}
                </span>
              ) : (
                <span className="tableau__operador" style={{ color: item.carta.operador.cor }}>
                  {item.carta.operador.simbolo}
                </span>
              )}
            </span>
          ))}
          <span className="tableau__igual">=</span>
          <span className="tableau__resultado">{formatarNumero(resultadoParcial)}</span>
        </div>
      )}
    </div>
  );
}
