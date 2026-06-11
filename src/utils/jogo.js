// ====== Regras matematicas do Somatorios (logica pura, sem React) ======

export const EPSILON = 1e-9; // tolerancia para comparar resultados numericos (ponto flutuante)

// Aplica um operador ao valor acumulado. O calculo e da esquerda para a direita,
// SEM prioridade de operacoes (como na regra original do jogo de cartas).
export function aplicarOperacao(acumulado, operadorId, valor) {
  switch (operadorId) {
    case 'soma':          return acumulado + valor;
    case 'subtracao':     return acumulado - valor;
    case 'multiplicacao': return acumulado * valor;
    // divisao arredondada para o inteiro mais proximo (Math.round, metade para cima);
    // valor nunca e 0 (cartas vao de 1 a 9). Negativos seguem o Math.round do JS (-3,5 -> -3).
    case 'divisao':       return Math.round(acumulado / valor);
    default:              return acumulado;
  }
}

// Vitoria: o resultado parcial bate exatamente o valor objetivo.
export function ehVitoria(resultadoParcial, objetivo) {
  return resultadoParcial !== null && Math.abs(resultadoParcial - objetivo) < EPSILON;
}

// Soma os valores de uma lista de cartas (usado para calcular o objetivo coletivo).
export function somaValores(cartas) {
  return cartas.reduce((total, carta) => total + carta.valor, 0);
}

// Formata numeros para exibicao (inteiro vira "12"; fracao vira "12.5").
export function formatarNumero(n) {
  if (n === null || n === undefined) return '—'; // travessao
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}
