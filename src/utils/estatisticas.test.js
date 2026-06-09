// Testes das estatísticas (Passo 10). localStorage é provido pelo jsdom no Jest.
import {
  carregarEstatisticas,
  registrarPartida,
  limparEstatisticas,
  contarOperadores,
  operadorMaisUsado,
} from './estatisticas';

beforeEach(() => {
  limparEstatisticas();
});

describe('contarOperadores', () => {
  test('conta operadores por id, ignorando cartas jogadas como número', () => {
    const tableau = [
      { tipo: 'numero', carta: { operador: { id: 'soma' } } },
      { tipo: 'operador', carta: { operador: { id: 'soma' } } },
      { tipo: 'operador', carta: { operador: { id: 'multiplicacao' } } },
      { tipo: 'operador', carta: { operador: { id: 'soma' } } },
    ];
    expect(contarOperadores(tableau)).toEqual({
      soma: 2,
      subtracao: 0,
      multiplicacao: 1,
      divisao: 0,
    });
  });

  test('tableau vazio retorna tudo zero', () => {
    expect(contarOperadores([])).toEqual({ soma: 0, subtracao: 0, multiplicacao: 0, divisao: 0 });
  });
});

describe('operadorMaisUsado', () => {
  test('retorna o operador de maior contagem', () => {
    const r = operadorMaisUsado({ soma: 1, subtracao: 5, multiplicacao: 2, divisao: 0 });
    expect(r.id).toBe('subtracao');
    expect(r.total).toBe(5);
  });

  test('retorna null quando nenhum operador foi usado', () => {
    expect(operadorMaisUsado({ soma: 0, subtracao: 0, multiplicacao: 0, divisao: 0 })).toBeNull();
  });
});

describe('persistência (localStorage)', () => {
  test('carregar sem dados retorna estatísticas zeradas', () => {
    const e = carregarEstatisticas();
    expect(e.partidas).toBe(0);
    expect(e.vitorias).toBe(0);
    expect(e.derrotas).toBe(0);
    expect(e.operadores).toEqual({ soma: 0, subtracao: 0, multiplicacao: 0, divisao: 0 });
  });

  test('registrarPartida acumula partidas, resultado, tempo e operadores', () => {
    registrarPartida({
      resultado: 'vitoria',
      operadores: { soma: 2, subtracao: 0, multiplicacao: 1, divisao: 0 },
      duracaoMs: 5000,
    });
    const e = registrarPartida({
      resultado: 'derrota',
      operadores: { soma: 1, subtracao: 3, multiplicacao: 0, divisao: 0 },
      duracaoMs: 3000,
    });
    expect(e.partidas).toBe(2);
    expect(e.vitorias).toBe(1);
    expect(e.derrotas).toBe(1);
    expect(e.tempoTotalMs).toBe(8000);
    expect(e.operadores).toEqual({ soma: 3, subtracao: 3, multiplicacao: 1, divisao: 0 });
  });

  test('persiste entre chamadas (carregar reflete o salvo)', () => {
    registrarPartida({
      resultado: 'vitoria',
      operadores: { soma: 1, subtracao: 0, multiplicacao: 0, divisao: 0 },
      duracaoMs: 1000,
    });
    expect(carregarEstatisticas().partidas).toBe(1);
  });

  test('limparEstatisticas zera tudo', () => {
    registrarPartida({
      resultado: 'vitoria',
      operadores: { soma: 1, subtracao: 0, multiplicacao: 0, divisao: 0 },
      duracaoMs: 1000,
    });
    const e = limparEstatisticas();
    expect(e.partidas).toBe(0);
    expect(carregarEstatisticas().partidas).toBe(0);
  });
});
