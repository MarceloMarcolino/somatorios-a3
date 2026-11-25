import React from 'react';
import { useDialogoAcessivel } from '../hooks/useDialogoAcessivel';
import { MarcadorRodada, VersoCarta } from './CartaFisica';

// Tela de transição "pass-and-play". Acessível por teclado (Passo 7):
// foco vai para o botão ao abrir e fica preso (não há Esc: não se pula a vez).
// Com 2 ou 4 jogadores, avisa quando o marcador "Início da rodada" passa (evento 'novaRodada')
// ou é guardado porque o monte acabou ('marcadorGuardado'). Com 2 jogadores, quem recebe o
// marcador joga duas vezes seguidas (jogaDeNovo).
export default function PasseDispositivo({ nome, evento = null, jogaDeNovo = false, onRevelar }) {
  const ref = useDialogoAcessivel();

  return (
    <div className="overlay-passe">
      <div
        ref={ref}
        className="overlay-passe__caixa"
        role="dialog"
        aria-modal="true"
        aria-label={`Vez de ${nome}`}
        tabIndex={-1}
      >
        {/* versos das cartas: a mão fica escondida até a pessoa certa confirmar */}
        <div className="overlay-passe__versos" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <VersoCarta key={i} />
          ))}
        </div>
        <p className="overlay-passe__rotulo">{jogaDeNovo ? 'É de novo a vez de' : 'Passe o dispositivo para'}</p>
        <p className="overlay-passe__nome">{nome}</p>

        {evento === 'novaRodada' && (
          <p className="overlay-passe__rodada">
            <MarcadorRodada />
            <span>
              <strong>Nova rodada!</strong> {nome} está com o marcador Início da rodada e começa.
              {jogaDeNovo && ' Por isso joga duas vezes seguidas — está certo!'}
            </span>
          </p>
        )}
        {evento === 'marcadorGuardado' && (
          <p className="overlay-passe__rodada">
            <MarcadorRodada />
            <span>O monte de compra acabou: o marcador foi guardado e a vez segue em ordem.</span>
          </p>
        )}

        <p className="overlay-passe__aviso">
          As cartas dos outros jogadores ficam escondidas. Só <strong>{nome}</strong> deve ver a
          próxima tela.
        </p>
        <div className="d-grid">
          <button className="btn btn-light btn-grande" onClick={onRevelar}>
            <i className="fas fa-eye me-2" aria-hidden="true"></i>
            Sou {nome}, ver minhas cartas
          </button>
        </div>
      </div>
    </div>
  );
}
