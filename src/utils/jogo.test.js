// Testes unitarios das regras matematicas do jogo (Passo 1 do plano de upgrades).
// Rodar com: CI=true npm test  (usa o Jest que ja vem no react-scripts).
import { EPSILON, aplicarOperacao, ehVitoria, somaValores, formatarNumero } from './jogo';

describe('aplicarOperacao', () => {
  test('soma', () => expect(aplicarOperacao(10, 'soma', 5)).toBe(15));
  test('subtracao', () => expect(aplicarOperacao(10, 'subtracao', 5)).toBe(5));
  test('multiplicacao', () => expect(aplicarOperacao(10, 'multiplicacao', 5)).toBe(50));
  test('divisao exata', () => expect(aplicarOperacao(10, 'divisao', 5)).toBe(2));
  test('divisao pode gerar fracao', () => expect(aplicarOperacao(10, 'divisao', 4)).toBeCloseTo(2.5));
  test('calculo e da esquerda para a direita (sem prioridade)', () => {
    // 2 + 3 = 5 ; depois 5 x 4 = 20  (e nao 2 + (3x4) = 14)
    let r = aplicarOperacao(2, 'soma', 3);
    r = aplicarOperacao(r, 'multiplicacao', 4);
    expect(r).toBe(20);
  });
  test('operador desconhecido devolve o acumulado inalterado', () => {
    expect(aplicarOperacao(7, 'inexistente', 3)).toBe(7);
  });
});

describe('ehVitoria', () => {
  test('verdadeiro quando o resultado bate o objetivo', () => {
    expect(ehVitoria(40, 40)).toBe(true);
  });
  test('falso quando o resultado e diferente do objetivo', () => {
    expect(ehVitoria(39, 40)).toBe(false);
  });
  test('falso quando ainda nao ha resultado (null)', () => {
    expect(ehVitoria(null, 40)).toBe(false);
  });
  test('tolera erro de ponto flutuante dentro de EPSILON', () => {
    const quase = 0.1 + 0.2; // 0.30000000000000004
    expect(ehVitoria(quase, 0.3)).toBe(true);
  });
  test('EPSILON e um valor pequeno', () => {
    expect(EPSILON).toBeGreaterThan(0);
    expect(EPSILON).toBeLessThan(1e-6);
  });
});

describe('somaValores', () => {
  test('soma os valores das cartas', () => {
    const cartas = [{ valor: 3 }, { valor: 5 }, { valor: 1 }];
    expect(somaValores(cartas)).toBe(9);
  });
  test('lista vazia soma 0', () => {
    expect(somaValores([])).toBe(0);
  });
});

describe('formatarNumero', () => {
  test('inteiro vira string simples', () => expect(formatarNumero(12)).toBe('12'));
  test('zero vira "0"', () => expect(formatarNumero(0)).toBe('0'));
  test('fracao e arredondada para 2 casas', () => expect(formatarNumero(12.345)).toBe('12.35'));
  test('null vira travessao', () => expect(formatarNumero(null)).toBe('—'));
  test('undefined vira travessao', () => expect(formatarNumero(undefined)).toBe('—'));
});
