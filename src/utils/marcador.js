// ====== Marcador "Início da rodada" (lógica pura, sem React) ======
// Mesma regra do protótipo físico v0.2 (prototipo/Somatorios-fisico-v0.2/fonte/REGRAS_CANONICAS.md):
//  - só com número PAR de jogadores (2 ou 4). Sem ele, cada jogador jogaria sempre o mesmo
//    tipo de carta (só números ou só operadores); o marcador faz os papéis se alternarem;
//  - a rodada começa com quem está com o marcador; quando todos jogaram 1 vez, o marcador
//    passa para o próximo jogador (à esquerda), que começa a nova rodada:
//    4 jogadores: A B C D → B C D A → C D A B…   2 jogadores: A B → B A → A B…
//    (com 2, quem recebe o marcador joga duas vezes seguidas — está certo!);
//  - quando o monte de compra acaba, o marcador é guardado e a vez segue em sentido horário,
//    pulando quem ficou sem cartas.

// O marcador só é usado com número par de jogadores (no app: 2 ou 4).
export function usaMarcador(qtdJogadores) {
  return qtdJogadores % 2 === 0;
}

// Quem começa a partida pega o marcador (ou null, se a partida não usa marcador).
export function marcadorInicial(qtdJogadores, quemComeca = 0) {
  return usaMarcador(qtdJogadores) ? quemComeca : null;
}

// Decide quem joga depois de uma jogada (que não terminou a partida).
// Recebe o estado DEPOIS da compra:
//  - vezAtual: índice de quem acabou de jogar
//  - marcador: índice de quem está com o marcador (null = partida sem marcador ou já guardado)
//  - jogadasNaRodada: jogadas já feitas na rodada ANTES desta
//  - cartasNaMao: quantidade de cartas na mão de cada jogador
//  - cartasNoMonte: cartas que restam no monte de compra
// Devolve { vez, marcador, jogadasNaRodada, evento }, com evento:
//  'novaRodada' (o marcador passou e o novo dono começa) | 'marcadorGuardado' (o monte acabou) | null
export function proximaVez({ vezAtual, marcador, jogadasNaRodada, cartasNaMao, cartasNoMonte }) {
  const n = cartasNaMao.length;

  if (marcador !== null && cartasNoMonte > 0) {
    const feitas = jogadasNaRodada + 1;
    if (feitas >= n) {
      const novoDono = (marcador + 1) % n;
      return { vez: novoDono, marcador: novoDono, jogadasNaRodada: 0, evento: 'novaRodada' };
    }
    return { vez: (vezAtual + 1) % n, marcador, jogadasNaRodada: feitas, evento: null };
  }

  // Sem marcador (3 ou 5 jogadores) ou monte acabou: sentido horário, pulando mãos vazias.
  let prox = (vezAtual + 1) % n;
  let voltas = 0;
  while (cartasNaMao[prox] === 0 && voltas < n) {
    prox = (prox + 1) % n;
    voltas++;
  }
  return {
    vez: prox,
    marcador: null,
    jogadasNaRodada: 0,
    evento: marcador !== null ? 'marcadorGuardado' : null,
  };
}
