// ====== Baralho do Somatorios (logica pura, sem React) ======
// 36 cartas = valores de 1 a 9 em 4 "naipes", onde cada naipe e um operador matematico.

// Cores = paleta das cartas do protótipo físico v0.2 (fonte/somatorios_svg.py), escolhida por
// otimização para daltonismo (pior ΔE2000 = 17,2 sob deuteranopia/protanopia/tritanopia; a antiga = 6,6).
// "cor" pinta as faixas da carta e os chips; "claro" é o fundo suave do naipe. Texto pequeno não usa "cor"
// (o + e o ÷ ficam abaixo de 4,5:1 sobre branco): use os chips ou as faixas, que são elementos gráficos (≥ 3:1).
export const OPERADORES = [
  { id: 'soma',           simbolo: '+', nome: 'Soma',          cor: '#43a02a', claro: '#e3f3dd' },
  { id: 'subtracao',      simbolo: '−', nome: 'Subtração',     cor: '#a51b1b', claro: '#f7dede' }, // sinal de menos
  { id: 'multiplicacao',  simbolo: '×', nome: 'Multiplicação', cor: '#1d3a80', claro: '#dde4f5' }, // x
  { id: 'divisao',        simbolo: '÷', nome: 'Divisão',       cor: '#a774e0', claro: '#efe5fb' }, // divisao
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
