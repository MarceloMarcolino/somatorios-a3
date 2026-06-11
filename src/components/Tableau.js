import React from 'react';
import { formatarNumero } from '../utils/jogo';

// Palavras faladas dos operadores (frase acessivel do tableau - Passo 14).
const PALAVRA_OP = {
  soma: 'mais',
  subtracao: 'menos',
  multiplicacao: 'vezes',
  divisao: 'dividido por',
};

// Frase por extenso da expressao para leitores de tela.
// Ex.: "Operação em construção: 2 mais 3 vezes 4 igual a 20."
function fraseExpressao(tableau, resultadoParcial) {
  const partes = tableau.map((item) =>
    item.tipo === 'numero' ? String(item.carta.valor) : PALAVRA_OP[item.carta.operador.id]
  );
  const pendente = tableau[tableau.length - 1].tipo === 'operador';
  const fim = pendente
    ? ', aguardando o próximo número'
    : ` igual a ${formatarNumero(resultadoParcial)}`;
  return `Operação em construção: ${partes.join(' ')}${fim}.`;
}

// Mostra a conta em construcao: numeros (mini-cartas) e operadores em sequencia,
// terminando com "= resultado parcial" (Passo 5). Lista com .map() + key.
// Passo 14: a frase oculta acima carrega a informacao completa; o bloco visual
// fica decorativo (aria-hidden) para o leitor nao ler a expressao duas vezes.
export default function Tableau({ tableau, resultadoParcial }) {
  return (
    <div className="tableau mb-3">
      {tableau.length === 0 ? (
        <span className="tableau__vazio">
          <i className="fas fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
          A conta aparece aqui conforme as cartas forem jogadas...
        </span>
      ) : (
        <>
          <span className="visually-hidden">{fraseExpressao(tableau, resultadoParcial)}</span>
          <div className="tableau__expressao" aria-hidden="true">
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
        </>
      )}
    </div>
  );
}
