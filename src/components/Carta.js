import React from 'react';

// Componente de apresentacao de UMA carta (Passo 4).
// props:
//  - carta: { id, valor, operador }
//  - modo: 'numero' | 'operador'  -> como a carta sera jogada nesta vez
//  - onJogar: funcao chamada com o id da carta (callback recebido via props)
//  - desabilitada: bloqueia o clique
// Numero = carta em pe (retrato). Operador = carta deitada (paisagem).
export default function Carta({ carta, modo, onJogar, desabilitada }) {
  const ehOperador = modo === 'operador';

  const jogar = () => {
    if (!desabilitada && onJogar) onJogar(carta.id);
  };

  const aoTeclar = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !desabilitada && onJogar) {
      e.preventDefault();
      onJogar(carta.id);
    }
  };

  const rotuloAcessivel = ehOperador
    ? `Jogar como operador ${carta.operador.nome} (carta deitada, valor ${carta.valor})`
    : `Jogar o numero ${carta.valor} (naipe ${carta.operador.nome})`;

  return (
    <div
      className={
        'carta' +
        (ehOperador ? ' carta--operador' : ' carta--numero') +
        (desabilitada ? ' carta--desabilitada' : '')
      }
      style={{ '--cor-carta': carta.operador.cor }}
      role="button"
      tabIndex={desabilitada ? -1 : 0}
      aria-label={rotuloAcessivel}
      aria-disabled={desabilitada}
      title={rotuloAcessivel}
      onClick={jogar}
      onKeyDown={aoTeclar}
    >
      <span className="carta__canto carta__canto--tl">{carta.operador.simbolo}</span>

      <span className="carta__centro">
        {ehOperador ? carta.operador.simbolo : carta.valor}
      </span>

      {/* quando jogada como operador, um chip mostra o numero da carta */}
      {ehOperador && <span className="carta__chip">{carta.valor}</span>}

      <span className="carta__canto carta__canto--br">{carta.operador.simbolo}</span>
    </div>
  );
}
