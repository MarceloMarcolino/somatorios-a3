// Testes de integração do hook com o marcador "Início da rodada" (regra do protótipo físico).
// Rodar com: CI=true npm test
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useSomatorios } from './useSomatorios';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Monta o hook num componente mínimo e devolve um acesso à API mais recente.
function montarHook() {
  const api = {};
  function Sonda() {
    Object.assign(api, useSomatorios());
    return null;
  }
  const div = document.createElement('div');
  const root = createRoot(div);
  act(() => root.render(<Sonda />));
  return { api, desmontar: () => act(() => root.unmount()) };
}

// Joga uma partida inteira (sempre a 1ª carta da mão) e registra quem jogou cada vez,
// o tipo jogado e o marcador. Para na vitória ou na derrota.
function jogarPartida(qtd) {
  const { api, desmontar } = montarHook();
  act(() => api.iniciarPartida(Array(qtd).fill('')));
  const jogadas = [];
  let guarda = 0;
  while (api.estado.fase === 'jogando' && guarda++ < 100) {
    const e = api.estado;
    jogadas.push({ vez: e.vezAtual, tipo: e.proximoTipo, marcador: e.marcador, monte: e.baralhoCompra.length });
    act(() => api.revelarMao());
    act(() => api.jogarCarta(api.estado.jogadores[api.estado.vezAtual].mao[0].id));
  }
  const final = api.estado;
  desmontar();
  return { jogadas, final };
}

describe('useSomatorios + marcador Início da rodada', () => {
  test('3 jogadores: sem marcador, sentido horário', () => {
    const { jogadas } = jogarPartida(3);
    expect(jogadas[0].marcador).toBeNull();
    jogadas.slice(0, 9).forEach((j, i) => expect(j.vez).toBe(i % 3));
  });

  test('4 jogadores: rodadas A B C D → B C D A → C D A B enquanto há monte', () => {
    for (let rep = 0; rep < 20; rep++) {
      const { jogadas } = jogarPartida(4);
      const esperado = [0, 1, 2, 3, 1, 2, 3, 0, 2, 3, 0, 1, 3, 0, 1, 2];
      jogadas
        .filter((j) => j.monte > 0)
        .forEach((j, i) => expect(j.vez).toBe(esperado[i % 16]));
    }
  });

  test('2 jogadores: A B → B A → A B (quem recebe o marcador joga duas vezes seguidas)', () => {
    for (let rep = 0; rep < 20; rep++) {
      const { jogadas } = jogarPartida(2);
      const esperado = [0, 1, 1, 0];
      jogadas
        .filter((j) => j.monte > 0)
        .forEach((j, i) => expect(j.vez).toBe(esperado[i % 4]));
    }
  });

  test('com 2 ou 4 jogadores, cada um joga números E operadores enquanto há monte', () => {
    for (const qtd of [2, 4]) {
      for (let rep = 0; rep < 20; rep++) {
        const { jogadas } = jogarPartida(qtd);
        const comMonte = jogadas.filter((j) => j.monte > 0);
        if (comMonte.length < 2 * qtd + 1) continue; // partida curta demais (vitória cedo)
        for (let p = 0; p < qtd; p++) {
          const tipos = new Set(comMonte.filter((j) => j.vez === p).map((j) => j.tipo));
          expect(tipos).toEqual(new Set(['numero', 'operador']));
        }
      }
    }
  });

  test('quando o monte acaba, o marcador é guardado', () => {
    for (let rep = 0; rep < 20; rep++) {
      const { jogadas } = jogarPartida(4);
      jogadas.filter((j) => j.monte === 0).forEach((j) => expect(j.marcador).toBeNull());
    }
  });

  test('a partida sempre termina em vitória ou derrota', () => {
    for (const qtd of [2, 3, 4, 5]) {
      const { final } = jogarPartida(qtd);
      expect(final.fase).toBe('fim');
      expect(['vitoria', 'derrota']).toContain(final.resultado);
    }
  });
});
