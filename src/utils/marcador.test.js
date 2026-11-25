// Testes do marcador "Início da rodada" (regra do protótipo físico v0.2).
// Rodar com: CI=true npm test
import { usaMarcador, marcadorInicial, proximaVez } from './marcador';

// Simula a ordem das vezes enquanto há cartas no monte (mãos sempre com 4 cartas).
function ordemDasVezes(qtd, jogadas) {
  let estado = { vezAtual: 0, marcador: marcadorInicial(qtd), jogadasNaRodada: 0 };
  const ordem = [estado.vezAtual];
  const eventos = [];
  for (let i = 1; i < jogadas; i++) {
    const r = proximaVez({ ...estado, cartasNaMao: Array(qtd).fill(4), cartasNoMonte: 10 });
    estado = { vezAtual: r.vez, marcador: r.marcador, jogadasNaRodada: r.jogadasNaRodada };
    ordem.push(r.vez);
    eventos.push(r.evento);
  }
  return { ordem, eventos };
}

describe('usaMarcador', () => {
  test('só com número par de jogadores (2 ou 4)', () => {
    expect(usaMarcador(2)).toBe(true);
    expect(usaMarcador(3)).toBe(false);
    expect(usaMarcador(4)).toBe(true);
    expect(usaMarcador(5)).toBe(false);
  });
});

describe('marcadorInicial', () => {
  test('quem começa pega o marcador com 2 ou 4 jogadores', () => {
    expect(marcadorInicial(2)).toBe(0);
    expect(marcadorInicial(4, 2)).toBe(2);
  });
  test('sem marcador com 3 ou 5 jogadores', () => {
    expect(marcadorInicial(3)).toBeNull();
    expect(marcadorInicial(5)).toBeNull();
  });
});

describe('proximaVez com marcador', () => {
  test('4 jogadores: A B C D → B C D A → C D A B → D A B C', () => {
    const { ordem } = ordemDasVezes(4, 16);
    expect(ordem).toEqual([0, 1, 2, 3, 1, 2, 3, 0, 2, 3, 0, 1, 3, 0, 1, 2]);
  });

  test('2 jogadores: A B → B A → A B (quem recebe o marcador joga duas vezes seguidas)', () => {
    const { ordem } = ordemDasVezes(2, 8);
    expect(ordem).toEqual([0, 1, 1, 0, 0, 1, 1, 0]);
  });

  test('com marcador, cada jogador alterna número e operador', () => {
    for (const qtd of [2, 4]) {
      const { ordem } = ordemDasVezes(qtd, 40);
      for (let j = 0; j < qtd; j++) {
        // jogada i (0, 1, 2…) é número quando i é par
        const tipos = new Set(ordem.map((v, i) => (v === j ? i % 2 : null)).filter((t) => t !== null));
        expect(tipos).toEqual(new Set([0, 1]));
      }
    }
  });

  test('avisa "novaRodada" quando o marcador passa', () => {
    const { eventos } = ordemDasVezes(2, 5);
    expect(eventos).toEqual([null, 'novaRodada', null, 'novaRodada']);
  });

  test('exemplo canônico de 2 jogadores (manual): Ana, Beto, Beto, Ana, Ana', () => {
    expect(ordemDasVezes(2, 5).ordem).toEqual([0, 1, 1, 0, 0]);
  });

  test('exemplo canônico de 4 jogadores (folha de venda): Ana, Beto, Caio, Duda, Beto', () => {
    expect(ordemDasVezes(4, 5).ordem).toEqual([0, 1, 2, 3, 1]);
  });
});

describe('proximaVez sem marcador ou com o monte vazio', () => {
  test('3 jogadores seguem em sentido horário (os papéis já se alternam)', () => {
    let vez = 0;
    const ordem = [vez];
    for (let i = 0; i < 6; i++) {
      vez = proximaVez({ vezAtual: vez, marcador: null, jogadasNaRodada: 0, cartasNaMao: [4, 4, 4], cartasNoMonte: 5 }).vez;
      ordem.push(vez);
    }
    expect(ordem).toEqual([0, 1, 2, 0, 1, 2, 0]);
  });

  test('quando o monte acaba, o marcador é guardado e a vez segue em sentido horário', () => {
    // fim da rodada (3 jogadas já feitas de 4): com monte, a vez iria para o novo dono do marcador (1);
    // sem monte, guarda o marcador e passa para o próximo em sentido horário (0).
    const comMonte = proximaVez({ vezAtual: 3, marcador: 0, jogadasNaRodada: 3, cartasNaMao: [4, 4, 4, 4], cartasNoMonte: 1 });
    expect(comMonte).toEqual({ vez: 1, marcador: 1, jogadasNaRodada: 0, evento: 'novaRodada' });

    const semMonte = proximaVez({ vezAtual: 3, marcador: 0, jogadasNaRodada: 3, cartasNaMao: [4, 4, 4, 3], cartasNoMonte: 0 });
    expect(semMonte).toEqual({ vez: 0, marcador: null, jogadasNaRodada: 0, evento: 'marcadorGuardado' });
  });

  test('depois de guardado, não volta a avisar', () => {
    const r = proximaVez({ vezAtual: 0, marcador: null, jogadasNaRodada: 0, cartasNaMao: [3, 3], cartasNoMonte: 0 });
    expect(r.evento).toBeNull();
  });

  test('pula quem ficou sem cartas', () => {
    const r = proximaVez({ vezAtual: 0, marcador: null, jogadasNaRodada: 0, cartasNaMao: [2, 0, 0, 1], cartasNoMonte: 0 });
    expect(r.vez).toBe(3);
  });
});
