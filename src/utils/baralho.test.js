// Testes unitarios da logica pura do baralho (Passo 1 do plano de upgrades).
// Rodar com: CI=true npm test  (usa o Jest que ja vem no react-scripts).
import { OPERADORES, criarBaralho, embaralhar } from './baralho';

describe('OPERADORES', () => {
  test('tem exatamente 4 operadores, na ordem esperada', () => {
    expect(OPERADORES).toHaveLength(4);
    expect(OPERADORES.map((o) => o.id)).toEqual([
      'soma',
      'subtracao',
      'multiplicacao',
      'divisao',
    ]);
  });

  test('cada operador tem simbolo, nome e cor hexadecimal', () => {
    for (const op of OPERADORES) {
      expect(typeof op.simbolo).toBe('string');
      expect(op.simbolo.length).toBeGreaterThan(0);
      expect(typeof op.nome).toBe('string');
      expect(op.nome.length).toBeGreaterThan(0);
      expect(op.cor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});

describe('criarBaralho', () => {
  test('cria 36 cartas (4 operadores x 9 valores)', () => {
    expect(criarBaralho()).toHaveLength(36);
  });

  test('cada operador aparece com os valores de 1 a 9', () => {
    const baralho = criarBaralho();
    for (const op of OPERADORES) {
      const valores = baralho
        .filter((c) => c.operador.id === op.id)
        .map((c) => c.valor)
        .sort((a, b) => a - b);
      expect(valores).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  });

  test('todos os ids das cartas sao unicos', () => {
    const ids = criarBaralho().map((c) => c.id);
    expect(new Set(ids).size).toBe(36);
  });

  test('cada carta referencia um operador valido de OPERADORES', () => {
    for (const carta of criarBaralho()) {
      expect(OPERADORES).toContain(carta.operador);
      expect(carta.valor).toBeGreaterThanOrEqual(1);
      expect(carta.valor).toBeLessThanOrEqual(9);
    }
  });
});

describe('embaralhar', () => {
  test('mantem o mesmo multiconjunto de cartas', () => {
    const original = criarBaralho();
    const misturado = embaralhar(original);
    expect(misturado).toHaveLength(original.length);
    const idsOriginais = original.map((c) => c.id).sort((a, b) => a - b);
    const idsMisturados = misturado.map((c) => c.id).sort((a, b) => a - b);
    expect(idsMisturados).toEqual(idsOriginais);
  });

  test('nao muta o array original', () => {
    const original = criarBaralho();
    const copia = [...original];
    embaralhar(original);
    expect(original).toEqual(copia);
  });

  test('retorna um novo array (referencia diferente do original)', () => {
    const original = criarBaralho();
    expect(embaralhar(original)).not.toBe(original);
  });
});
