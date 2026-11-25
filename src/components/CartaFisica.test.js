// Contraste dos índices das cartas (texto pequeno nas faixas coloridas): mínimo 4,5:1 (WCAG 1.4.3).
// Rodar com: CI=true npm test
import { COR_INDICE, contraste } from './CartaFisica';
import { OPERADORES } from '../utils/baralho';

describe('contraste', () => {
  test('branco sobre preto = 21:1 e cor igual = 1:1', () => {
    expect(contraste('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contraste('#43a02a', '#43a02a')).toBeCloseTo(1, 5);
  });
});

describe('índice do canto das cartas', () => {
  test.each(OPERADORES.map((op) => [op.id, op.cor]))('%s: índice legível sobre a faixa (>= 4,5:1)', (id, cor) => {
    const tinta = COR_INDICE[id] === '#fff' ? '#ffffff' : COR_INDICE[id];
    expect(contraste(tinta, cor)).toBeGreaterThanOrEqual(4.5);
  });

  test('na paleta do kit: tinta escura no + e no ÷, branco no − e no ×', () => {
    expect(COR_INDICE.soma).not.toBe('#fff');
    expect(COR_INDICE.divisao).not.toBe('#fff');
    expect(COR_INDICE.subtracao).toBe('#fff');
    expect(COR_INDICE.multiplicacao).toBe('#fff');
  });
});
