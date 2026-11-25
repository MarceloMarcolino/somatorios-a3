import React from 'react';
import { FrenteCarta } from './CartaFisica';

// Componente de apresentacao de UMA carta (Passo 4), com o desenho da carta do protótipo físico.
// props:
//  - carta: { id, valor, operador }
//  - modo: 'numero' | 'operador'  -> como a carta sera jogada nesta vez
//  - onJogar: funcao chamada com o id da carta (callback recebido via props)
//  - desabilitada: bloqueia o clique
// Numero = carta em pe (retrato). Operador = carta deitada (paisagem): o sinal grande das faixas
// fica "de pe" quando a carta deita, como no baralho impresso.
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
    : `Jogar o número ${carta.valor} (naipe ${carta.operador.nome})`;

  return (
    <div
      className={
        'carta' +
        (ehOperador ? ' carta--operador' : ' carta--numero') +
        (desabilitada ? ' carta--desabilitada' : '')
      }
      role="button"
      tabIndex={desabilitada ? -1 : 0}
      aria-label={rotuloAcessivel}
      aria-disabled={desabilitada}
      title={rotuloAcessivel}
      onClick={jogar}
      onKeyDown={aoTeclar}
    >
      <FrenteCarta
        valor={carta.valor}
        naipe={carta.operador.id}
        deitada={ehOperador}
        className="carta__desenho"
      />
    </div>
  );
}
