import React, { useState, useEffect, useRef } from 'react';
import { useSomatorios } from './hooks/useSomatorios';
import { buscarDicas } from './services/dicasClient';
import {
  carregarEstatisticas,
  registrarPartida,
  limparEstatisticas,
  contarOperadores,
} from './utils/estatisticas';
import TelaInicial from './components/TelaInicial';
import TelaPartida from './components/TelaPartida';
import TelaFim from './components/TelaFim';
import Estatisticas from './components/Estatisticas';

// Componente raiz: decide qual TELA mostrar conforme a fase do jogo,
// busca (HTTP) as dicas e registra estatísticas ao fim de cada partida.
export default function App() {
  const { estado, iniciarPartida, revelarMao, jogarCarta, voltarAoInicio } = useSomatorios();

  // Requisito HTTP: dicas matemáticas simuladas (axios), uma vez na montagem.
  const [dicas, setDicas] = useState([]);
  useEffect(() => {
    buscarDicas()
      .then((lista) => setDicas(lista))
      .catch(() => setDicas([])); // fallback: o jogo funciona mesmo se o fetch falhar
  }, []);

  // Estatísticas persistidas em localStorage (Passo 10).
  const [estatisticas, setEstatisticas] = useState(() => carregarEstatisticas());
  const [mostrarEstat, setMostrarEstat] = useState(false);

  // Registra a partida ao TERMINAR. Apenas OBSERVA o estado do jogo (não altera regras).
  const faseAnteriorRef = useRef(estado.fase);
  const inicioRef = useRef(null);
  useEffect(() => {
    const anterior = faseAnteriorRef.current;
    if (estado.fase === 'jogando' && anterior !== 'jogando') {
      inicioRef.current = Date.now(); // marca o início da partida
    }
    if (estado.fase === 'fim' && anterior !== 'fim') {
      const duracaoMs = inicioRef.current ? Date.now() - inicioRef.current : 0;
      const nova = registrarPartida({
        resultado: estado.resultado,
        operadores: contarOperadores(estado.tableau),
        duracaoMs,
      });
      setEstatisticas(nova);
    }
    faseAnteriorRef.current = estado.fase;
  }, [estado.fase, estado.resultado, estado.tableau]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container d-flex align-items-center gap-2">
          <i className="fas fa-calculator fa-lg" aria-hidden="true"></i>
          <h1 className="h4 m-0">Somatorios</h1>
          <span className="ms-2 badge bg-light text-primary d-none d-sm-inline">
            Jogo cooperativo de matematica
          </span>
        </div>
      </header>

      <main className="container py-4 flex-grow-1">
        {estado.fase === 'inicio' && (
          <TelaInicial
            dicas={dicas}
            onIniciar={iniciarPartida}
            onAbrirEstatisticas={() => setMostrarEstat(true)}
          />
        )}

        {estado.fase === 'jogando' && (
          <TelaPartida
            estado={estado}
            onRevelar={revelarMao}
            onJogar={jogarCarta}
            onAbandonar={voltarAoInicio}
          />
        )}

        {estado.fase === 'fim' && (
          <TelaFim estado={estado} dicas={dicas} onNova={voltarAoInicio} />
        )}
      </main>

      <footer className="text-center text-muted py-3 small">
        Projeto A3 - Squad 7823 - UC Usabilidade, Desenvolvimento Web, Mobile e Jogos - ODS 4
      </footer>

      {mostrarEstat && (
        <Estatisticas
          estatisticas={estatisticas}
          onFechar={() => setMostrarEstat(false)}
          onLimpar={() => setEstatisticas(limparEstatisticas())}
        />
      )}
    </div>
  );
}
