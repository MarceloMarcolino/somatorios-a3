import React from 'react';
import { useDialogoAcessivel } from '../hooks/useDialogoAcessivel';
import { operadorMaisUsado } from '../utils/estatisticas';

function formatarTempo(ms) {
  const seg = Math.round(ms / 1000);
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// Modal de Estatísticas (Passo 10): mostra agregados salvos em localStorage.
// Acessível por teclado (reusa o hook do Passo 7).
export default function Estatisticas({ estatisticas, onFechar, onLimpar }) {
  const ref = useDialogoAcessivel(onFechar);
  const semDados = estatisticas.partidas === 0;
  const maisUsado = operadorMaisUsado(estatisticas.operadores);
  const tempoMedio = estatisticas.partidas > 0 ? estatisticas.tempoTotalMs / estatisticas.partidas : 0;

  return (
    <div className="modal-simples" onClick={onFechar}>
      <div
        ref={ref}
        className="card card-ludico shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-estat"
        tabIndex={-1}
        style={{ maxWidth: 460, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="marca d-flex justify-content-between align-items-center px-3 py-3 text-white">
          <h2 className="h5 m-0" id="titulo-estat">
            <i className="fas fa-chart-simple me-2" aria-hidden="true"></i>Estatísticas
          </h2>
          <button className="btn-close btn-close-white" aria-label="Fechar" onClick={onFechar}></button>
        </div>

        <div className="card-body">
          {semDados ? (
            <p className="text-center text-muted m-0">
              Nenhuma partida registrada ainda. Joguem uma partida para começar!
            </p>
          ) : (
            <>
              <div className="estat-grade">
                <div className="estat-item">
                  <span className="estat-item__valor txt-brand">{estatisticas.partidas}</span>
                  <span className="estat-item__rotulo">Partidas</span>
                </div>
                <div className="estat-item">
                  <span className="estat-item__valor txt-sucesso">{estatisticas.vitorias}</span>
                  <span className="estat-item__rotulo">Vitórias</span>
                </div>
                <div className="estat-item">
                  <span className="estat-item__valor txt-perigo">{estatisticas.derrotas}</span>
                  <span className="estat-item__rotulo">Derrotas</span>
                </div>
                <div className="estat-item">
                  <span className="estat-item__valor">{formatarTempo(tempoMedio)}</span>
                  <span className="estat-item__rotulo">Tempo médio</span>
                </div>
              </div>
              <p className="mt-3 mb-0 text-center">
                Operador mais usado:{' '}
                <strong>{maisUsado ? `${maisUsado.nome} — ${maisUsado.total}x` : '—'}</strong>
              </p>
            </>
          )}
        </div>

        <div className="card-footer bg-white border-0 d-flex justify-content-between gap-2">
          <button
            className="btn btn-outline-danger btn-toque"
            onClick={onLimpar}
            disabled={semDados}
          >
            <i className="fas fa-trash me-1" aria-hidden="true"></i>Limpar
          </button>
          <button className="btn btn-primary btn-toque" onClick={onFechar}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
