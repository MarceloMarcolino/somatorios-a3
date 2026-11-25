import React, { useState } from 'react';
import BarraStatus from './BarraStatus';
import Tableau from './Tableau';
import Mao from './Mao';
import PasseDispositivo from './PasseDispositivo';
import ModalRegras from './ModalRegras';
import ModalConfirmacao from './ModalConfirmacao';
import { formatarNumero } from '../utils/jogo';

// Tela principal da partida: junta barra de status, tableau e mao do jogador,
// alem dos botoes de regras e de abandonar (com confirmacao).
export default function TelaPartida({ estado, onRevelar, onJogar, onAbandonar }) {
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);

  const jogador = estado.jogadores[estado.vezAtual];
  const donoMarcador = estado.marcador !== null && estado.marcador !== undefined
    ? estado.jogadores[estado.marcador].nome
    : null;

  // Aviso do marcador "Inicio da rodada" (so com 2 ou 4 jogadores)
  let avisoRodada = '';
  if (estado.eventoRodada === 'novaRodada') {
    avisoRodada = ` Nova rodada: ${jogador.nome} está com o marcador Início da rodada e começa.`;
  } else if (estado.eventoRodada === 'marcadorGuardado') {
    avisoRodada = ' O monte de compra acabou: o marcador foi guardado e a vez segue em ordem.';
  }

  return (
    <div>
      {/* Live region (Passo 8): anuncia o resultado parcial a leitores de tela */}
      <p className="visually-hidden" aria-live="polite">
        {estado.resultadoParcial === null
          ? 'Resultado parcial ainda não iniciado.'
          : `Resultado parcial: ${formatarNumero(estado.resultadoParcial)} de objetivo ${formatarNumero(estado.objetivo)}.`}
      </p>

      {/* Live region (Passo 14): anuncia a troca de turno a leitores de tela */}
      <p className="visually-hidden" aria-live="polite">
        Vez de {jogador.nome}.{avisoRodada}
      </p>

      <BarraStatus
        objetivo={estado.objetivo}
        resultadoParcial={estado.resultadoParcial}
        cartasNoBaralho={estado.baralhoCompra.length}
        jogadorAtual={jogador.nome}
        usaMarcador={estado.usaMarcador}
        donoMarcador={donoMarcador}
      />

      <Tableau tableau={estado.tableau} resultadoParcial={estado.resultadoParcial} />

      {estado.revelado ? (
        <Mao jogador={jogador} proximoTipo={estado.proximoTipo} onJogar={onJogar} />
      ) : (
        <PasseDispositivo
          nome={jogador.nome}
          evento={estado.eventoRodada}
          jogaDeNovo={estado.eventoRodada === 'novaRodada' && estado.jogadores.length === 2}
          onRevelar={onRevelar}
        />
      )}

      <div className="d-flex justify-content-center gap-2 mt-4">
        <button className="btn btn-outline-secondary btn-toque" onClick={() => setMostrarRegras(true)}>
          <i className="fas fa-circle-question me-1" aria-hidden="true"></i>Regras
        </button>
        <button className="btn btn-outline-danger btn-toque" onClick={() => setMostrarConfirma(true)}>
          <i className="fas fa-right-from-bracket me-1" aria-hidden="true"></i>Abandonar
        </button>
      </div>

      {mostrarRegras && <ModalRegras onFechar={() => setMostrarRegras(false)} />}
      {mostrarConfirma && (
        <ModalConfirmacao
          mensagem="Deseja mesmo abandonar a partida atual?"
          onConfirmar={onAbandonar}
          onCancelar={() => setMostrarConfirma(false)}
        />
      )}
    </div>
  );
}
