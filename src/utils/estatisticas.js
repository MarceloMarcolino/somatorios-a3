// ====== Persistência de estatísticas em localStorage (Passo 10) ======
// Observa o resultado das partidas e guarda agregados. NÃO altera regras do jogo.

const CHAVE = 'somatorios:estatisticas';

function vazio() {
  return {
    partidas: 0,
    vitorias: 0,
    derrotas: 0,
    tempoTotalMs: 0,
    operadores: { soma: 0, subtracao: 0, multiplicacao: 0, divisao: 0 },
  };
}

export function carregarEstatisticas() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return vazio();
    const dados = JSON.parse(bruto);
    const base = vazio();
    return {
      ...base,
      ...dados,
      operadores: { ...base.operadores, ...(dados.operadores || {}) },
    };
  } catch {
    // localStorage indisponível ou JSON corrompido: começa do zero
    return vazio();
  }
}

// Conta quantas vezes cada operador foi jogado (a partir do tableau da partida).
export function contarOperadores(tableau) {
  const contagem = { soma: 0, subtracao: 0, multiplicacao: 0, divisao: 0 };
  for (const item of tableau || []) {
    if (item.tipo === 'operador' && contagem[item.carta.operador.id] !== undefined) {
      contagem[item.carta.operador.id] += 1;
    }
  }
  return contagem;
}

// Registra uma partida finalizada e devolve as estatísticas atualizadas.
export function registrarPartida({ resultado, operadores, duracaoMs }) {
  const atual = carregarEstatisticas();
  const ops = operadores || {};
  const nova = {
    partidas: atual.partidas + 1,
    vitorias: atual.vitorias + (resultado === 'vitoria' ? 1 : 0),
    derrotas: atual.derrotas + (resultado === 'derrota' ? 1 : 0),
    tempoTotalMs: atual.tempoTotalMs + (duracaoMs || 0),
    operadores: {
      soma: atual.operadores.soma + (ops.soma || 0),
      subtracao: atual.operadores.subtracao + (ops.subtracao || 0),
      multiplicacao: atual.operadores.multiplicacao + (ops.multiplicacao || 0),
      divisao: atual.operadores.divisao + (ops.divisao || 0),
    },
  };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(nova));
  } catch {
    // ignora se o navegador bloquear o armazenamento (modo privado/quota)
  }
  return nova;
}

export function limparEstatisticas() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // noop
  }
  return vazio();
}

// Retorna { id, nome, total } do operador mais usado, ou null se nenhum foi jogado.
export function operadorMaisUsado(operadores) {
  const nomes = {
    soma: 'Soma (+)',
    subtracao: 'Subtração (−)',
    multiplicacao: 'Multiplicação (×)',
    divisao: 'Divisão (÷)',
  };
  let melhor = null;
  for (const id of Object.keys(operadores || {})) {
    const total = operadores[id];
    if (total > 0 && (melhor === null || total > melhor.total)) {
      melhor = { id, nome: nomes[id] || id, total };
    }
  }
  return melhor;
}
