// ====== Baralho do Somatorios (logica pura, sem React) ======
// 36 cartas = valores de 1 a 9 em 4 "naipes", onde cada naipe e um operador matematico.

export const OPERADORES = [
  { id: 'soma',           simbolo: '+', nome: 'Soma',           cor: '#2e7d32' },
  { id: 'subtracao',      simbolo: '−', nome: 'Subtracao', cor: '#c62828' }, // sinal de menos
  { id: 'multiplicacao',  simbolo: '×', nome: 'Multiplicacao', cor: '#1565c0' }, // x
  { id: 'divisao',        simbolo: '÷', nome: 'Divisao',   cor: '#6a1b9a' }, // divisao
];

// Cria as 36 cartas do baralho (cada carta tem id unico, valor 1-9 e um operador).
export function criarBaralho() {
  const cartas = [];
  let id = 0;
  for (const operador of OPERADORES) {
    for (let valor = 1; valor <= 9; valor++) {
      cartas.push({ id: id++, valor, operador });
    }
  }
  return cartas; // 4 operadores x 9 valores = 36 cartas
}

// Embaralhamento de Fisher-Yates (retorna um novo array, nao muta o original).
export function embaralhar(cartas) {
  const copia = [...cartas];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
