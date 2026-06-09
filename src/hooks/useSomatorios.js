// ====== Hook de estado do jogo Somatorios ======
// Concentra TODA a regra de fluxo do jogo em um unico useState + acoes (useCallback).
// Os componentes de tela so leem o "estado" e disparam as acoes - separacao limpa.

import { useState, useCallback } from 'react';
import { criarBaralho, embaralhar } from '../utils/baralho';
import { aplicarOperacao, ehVitoria, somaValores } from '../utils/jogo';

const CARTAS_POR_JOGADOR = 4;

export function useSomatorios() {
  // fase: 'inicio' | 'jogando' | 'fim'
  const [estado, setEstado] = useState({ fase: 'inicio' });

  // Inicia uma nova partida a partir de uma lista de nomes (2 a 5 jogadores).
  const iniciarPartida = useCallback((nomes) => {
    const baralho = embaralhar(criarBaralho());

    const jogadores = nomes.map((nome, i) => ({
      id: i,
      nome: (nome && nome.trim()) || `Jogador ${i + 1}`,
      mao: [],
    }));

    // distribui 4 cartas para cada jogador
    for (let rodada = 0; rodada < CARTAS_POR_JOGADOR; rodada++) {
      for (const jogador of jogadores) {
        jogador.mao.push(baralho.pop());
      }
    }

    // objetivo coletivo = soma dos valores de TODAS as cartas distribuidas
    const objetivo = jogadores.reduce((total, j) => total + somaValores(j.mao), 0);

    setEstado({
      fase: 'jogando',
      jogadores,
      baralhoCompra: baralho,
      objetivo,
      tableau: [],              // sequencia de cartas jogadas (numero/operador)
      resultadoParcial: null,   // resultado acumulado da operacao
      operadorPendente: null,   // operador aguardando o proximo numero
      vezAtual: 0,              // indice do jogador da vez
      proximoTipo: 'numero',    // 'numero' | 'operador' - o que deve ser jogado agora
      revelado: false,          // pass-and-play: a mao so aparece quando o jogador confirma
      resultado: null,          // 'vitoria' | 'derrota' ao fim
    });
  }, []);

  // Revela a mao do jogador da vez (depois do "passe o dispositivo").
  const revelarMao = useCallback(() => {
    setEstado((e) => (e.fase === 'jogando' ? { ...e, revelado: true } : e));
  }, []);

  // Joga uma carta da mao do jogador atual.
  const jogarCarta = useCallback((cartaId) => {
    setEstado((e) => {
      if (e.fase !== 'jogando' || !e.revelado) return e;

      // copias imutaveis do que sera alterado
      const jogadores = e.jogadores.map((j) => ({ ...j, mao: [...j.mao] }));
      const baralhoCompra = [...e.baralhoCompra];
      const tableau = [...e.tableau];
      const jogador = jogadores[e.vezAtual];

      const idx = jogador.mao.findIndex((c) => c.id === cartaId);
      if (idx === -1) return e; // carta nao esta na mao do jogador da vez
      const [carta] = jogador.mao.splice(idx, 1); // remove a carta jogada

      let { resultadoParcial, operadorPendente, proximoTipo } = e;

      if (proximoTipo === 'numero') {
        // joga como NUMERO
        if (resultadoParcial === null) {
          resultadoParcial = carta.valor; // primeiro numero da expressao
        } else {
          resultadoParcial = aplicarOperacao(resultadoParcial, operadorPendente.id, carta.valor);
          operadorPendente = null;
        }
        tableau.push({ tipo: 'numero', carta });
        proximoTipo = 'operador';
      } else {
        // joga como OPERADOR
        operadorPendente = carta.operador;
        tableau.push({ tipo: 'operador', carta });
        proximoTipo = 'numero';
      }

      // repoe a mao comprando do baralho (se houver carta)
      if (baralhoCompra.length > 0) {
        jogador.mao.push(baralhoCompra.pop());
      }

      const base = { ...e, jogadores, baralhoCompra, tableau, resultadoParcial, operadorPendente, proximoTipo };

      // VITORIA: so pode ocorrer logo apos jogar um numero (proximoTipo virou 'operador')
      if (proximoTipo === 'operador' && ehVitoria(resultadoParcial, e.objetivo)) {
        return { ...base, fase: 'fim', resultado: 'vitoria' };
      }

      // DERROTA: acabaram TODAS as cartas (baralho de compra + maos) sem atingir o objetivo
      const cartasRestantes = baralhoCompra.length + jogadores.reduce((s, j) => s + j.mao.length, 0);
      if (cartasRestantes === 0) {
        return { ...base, fase: 'fim', resultado: 'derrota' };
      }

      // passa a vez para o proximo jogador que ainda tenha cartas
      let prox = (e.vezAtual + 1) % jogadores.length;
      let voltas = 0;
      while (jogadores[prox].mao.length === 0 && voltas < jogadores.length) {
        prox = (prox + 1) % jogadores.length;
        voltas++;
      }

      return { ...base, vezAtual: prox, revelado: false };
    });
  }, []);

  // Volta para a tela inicial (abandonar ou nova partida).
  const voltarAoInicio = useCallback(() => setEstado({ fase: 'inicio' }), []);

  return { estado, iniciarPartida, revelarMao, jogarCarta, voltarAoInicio };
}
