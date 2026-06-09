import React from 'react';
import Carta from './Carta';

// Mostra a mao do jogador da vez e instrui claramente o que jogar (Passo 4).
// Renderiza a lista de cartas com .map() + key (requisito de listas).
export default function Mao({ jogador, proximoTipo, onJogar }) {
  const ehOperador = proximoTipo === 'operador';

  return (
    <section className="mao text-center" aria-label={`Mão de ${jogador.nome}`}>
      <p className="mao__jogador">
        <i className="fas fa-user me-2" aria-hidden="true"></i>
        {jogador.nome}
      </p>

      {/* Prevencao de erros + reconhecimento: dizemos exatamente o que jogar */}
      <div
        className={'faixa-instrucao ' + (ehOperador ? 'faixa-instrucao--operador' : 'faixa-instrucao--numero')}
        role="status"
      >
        <i
          className={'fas me-2 ' + (ehOperador ? 'fa-arrows-left-right' : 'fa-hashtag')}
          aria-hidden="true"
        ></i>
        Sua vez de jogar {ehOperador ? <strong>um OPERADOR</strong> : <strong>um NÚMERO</strong>}
        <span className="faixa-instrucao__dica">
          {ehOperador
            ? ' — a carta deita e vale como sinal (+, −, ×, ÷).'
            : ' — a carta em pé vale pelo número.'}
        </span>
      </div>

      <div className="mao__cartas" style={{ minHeight: 140 }}>
        {jogador.mao.map((carta) => (
          <Carta key={carta.id} carta={carta} modo={proximoTipo} onJogar={onJogar} />
        ))}
      </div>
    </section>
  );
}
