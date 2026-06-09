import React, { useState } from 'react';
import ModalRegras from './ModalRegras';

const MIN_JOGADORES = 2;
const OPCOES_JOGADORES = [2, 3, 4, 5];

// Tela inicial (Passo 3): identidade visual + layout responsivo SEM overflow.
// Usa um bloco com max-width centralizado (sem .row do Bootstrap, que tinha
// margens negativas e causava corte horizontal no mobile). Lógica/estado intactos.
export default function TelaInicial({ dicas, onIniciar, onAbrirEstatisticas }) {
  const [quantidade, setQuantidade] = useState(MIN_JOGADORES);
  const [nomes, setNomes] = useState(['', '', '', '', '']);
  const [mostrarRegras, setMostrarRegras] = useState(false);

  const alterarNome = (i, valor) => {
    setNomes((anterior) => {
      const novo = [...anterior];
      novo[i] = valor;
      return novo;
    });
  };

  const aoEnviar = (e) => {
    e.preventDefault(); // impede o recarregamento da página (boa prática de forms em React)
    onIniciar(nomes.slice(0, quantidade));
  };

  const dica = dicas && dicas.length ? dicas[0] : null;

  return (
    <div className="tela-inicial mx-auto">
      <div className="card card-ludico shadow-sm overflow-hidden">
        {/* Cabeçalho de marca */}
        <div className="marca text-center text-white px-3 py-4">
          <div className="marca__mascote" aria-hidden="true">
            <i className="fas fa-dice"></i>
            <i className="fas fa-plus"></i>
            <i className="fas fa-equals"></i>
          </div>
          <h2 className="marca__titulo m-0">Somatórios</h2>
          <p className="marca__tagline m-0">
            Cheguem juntos ao número-alvo somando, subtraindo, multiplicando e dividindo!
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={aoEnviar}>
            {/* Quantidade de jogadores: botões grandes (alvo de toque >= 48px) */}
            <fieldset className="mb-3 border-0 p-0 m-0">
              <legend className="form-label fw-semibold fs-6 mb-2">Quantos jogadores?</legend>
              <div className="seletor-jogadores" role="group" aria-label="Quantidade de jogadores">
                {OPCOES_JOGADORES.map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={'btn btn-opcao' + (quantidade === n ? ' btn-opcao--ativo' : '')}
                    aria-pressed={quantidade === n}
                    onClick={() => setQuantidade(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Nomes (opcional) */}
            <p className="form-label fw-semibold fs-6 mb-2">Nomes (opcional):</p>
            {Array.from({ length: quantidade }).map((_, i) => (
              <div className="input-group input-group-grande mb-2" key={i}>
                <span className="input-group-text" aria-hidden="true">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Jogador ${i + 1}`}
                  value={nomes[i]}
                  onChange={(e) => alterarNome(i, e.target.value)}
                  maxLength={16}
                  aria-label={`Nome do jogador ${i + 1}`}
                />
              </div>
            ))}

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary btn-grande">
                <i className="fas fa-play me-2" aria-hidden="true"></i>Iniciar partida
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-grande"
                onClick={() => setMostrarRegras(true)}
              >
                <i className="fas fa-circle-question me-2" aria-hidden="true"></i>Como jogar
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-grande"
                onClick={onAbrirEstatisticas}
              >
                <i className="fas fa-chart-simple me-2" aria-hidden="true"></i>Estatísticas
              </button>
            </div>
          </form>
        </div>
      </div>

      {dica && (
        <div className="dica-inicial mt-3" role="note">
          <i className="fas fa-lightbulb" aria-hidden="true"></i>
          <span>
            <strong className="dica-inicial__rotulo">Dica:</strong> {dica.texto}
          </span>
        </div>
      )}

      {mostrarRegras && <ModalRegras onFechar={() => setMostrarRegras(false)} />}
    </div>
  );
}
