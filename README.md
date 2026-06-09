# 🃏 Somatórios — Jogo Cooperativo de Matemática

Projeto **A3** da UC *Usabilidade, Desenvolvimento Web, Mobile e Jogos* (USJT) — **Squad 7823**.
Jogo de cartas **cooperativo** para praticar as quatro operações matemáticas, alinhado à **ODS 4** (Educação de Qualidade) e às **heurísticas de Nielsen**.

Construído em **React 19 (hooks) + Bootstrap 5 + Axios + Font Awesome**.

---

## ▶️ Como rodar

Pré-requisitos: **Node.js** (18+) e **npm** instalados.

```bash
cd Somatorios-A3
npm install          # se der conflito de peer deps do React 19, use: npm install --legacy-peer-deps
npm start            # abre em http://localhost:3000
```

Build de produção: `npm run build` (gera a pasta `build/`).

---

## 🎮 Regras do jogo

1. **Objetivo:** o grupo joga **junto** para que o resultado da conta chegue **exatamente** ao *valor objetivo*.
2. **Baralho:** 36 cartas (números **1–9** em 4 naipes = operadores **+ − × ÷**).
3. **Início:** cada jogador recebe 4 cartas; o **objetivo** é a soma dos valores de todas as cartas distribuídas.
4. **Turnos:** a sequência é sempre *número → operador → número → operador…*; a mesma carta vale como **número** (em pé) ou **operador** (deitada).
5. **Cálculo:** da esquerda para a direita, sem prioridade de operações; após jogar, compra-se uma carta nova.
6. **Vitória:** resultado parcial = objetivo. **Derrota:** as cartas acabam antes disso.

> Modo **pass-and-play**: as cartas de cada jogador ficam escondidas até ele confirmar "Sou *fulano*, ver minhas cartas".

---

## ✅ Mapa de cumprimento dos requisitos (enunciado A3)

| Requisito do enunciado | Onde está implementado |
|---|---|
| **Interface Web HTML/CSS + Bootstrap responsivo** | `public/index.html`, `index.css`, classes Bootstrap (`container`, `row`, `col-*`, `card`, grid responsivo) em todas as telas |
| **≥ 3 componentes React em JSX** | 12 componentes: `App`, `TelaInicial`, `TelaPartida`, `TelaFim`, `BarraStatus`, `Tableau`, `Mao`, `Carta`, `PasseDispositivo`, `ModalRegras`, `ModalConfirmacao` |
| **Props entre componentes** | `App → Telas → BarraStatus/Tableau/Mao → Carta` (ex.: `carta`, `objetivo`, `onJogar`) |
| **Eventos do usuário** | `onClick` nas cartas/botões, `onChange`/`onSubmit` no formulário (`TelaInicial`), teclado (`onKeyDown` em `Carta`) |
| **Listas (renderização)** | `.map()` com `key` em `Mao` (cartas), `Tableau` (jogadas), `BarraStatus` (status), `TelaInicial` (inputs) |
| **Hooks `useState` e `useEffect`** | `useState` em `hooks/useSomatorios.js`, `TelaInicial`, `TelaPartida`; `useEffect` em `App.js` (busca das dicas) |
| **Requisição HTTP (fetch/axios)** | `services/dicasClient.js` (axios) busca `public/dicas.json` (dados simulados) chamado no `useEffect` de `App` |
| **Ambiente NodeJS (npm/npx)** | `package.json` (react-scripts); criado no padrão `create-react-app` |
| **Tema dentro de um ODS** | **ODS 4 — Educação de Qualidade** (metas 4.1, 4.6, 4.7) |
| **≥ 5 heurísticas de Nielsen** | 7 aplicadas — ver tabela abaixo |
| **Grupo 4–7 com papéis** | Squad 7823 (7 integrantes) — ver `docs/RELATORIO.md` e `docs/PITCH.md` |
| **Entrega GitHub + apresentação 10–15 min** | repositório + roteiro em `docs/PITCH.md` |
| **Extra opcional: Redux** | não implementado (o estado centralizado vive no hook `useSomatorios`) |

---

## 🧭 Heurísticas de Nielsen aplicadas

| # | Heurística | Onde aparece |
|---|---|---|
| 1 | **Visibilidade do status do sistema** | `BarraStatus`: objetivo, resultado parcial, cartas restantes e de quem é a vez, sempre visíveis |
| 2 | **Correspondência com o mundo real** | cartas, naipes = operadores, "deitar a carta" para usar como operador, linguagem simples |
| 3 | **Controle e liberdade do usuário** | botão **Abandonar** com `ModalConfirmacao`; **Nova partida** |
| 4 | **Prevenção de erros** | só é possível jogar a carta no papel certo (número/operador); confirmação de ações destrutivas |
| 5 | **Reconhecimento em vez de memorização** | `Tableau` mostra a operação em construção; instrução clara do que jogar; regras sempre acessíveis |
| 6 | **Estética e design minimalista** | layout limpo Bootstrap, foco no essencial |
| 7 | **Ajuda e documentação** | `ModalRegras` ("Como jogar") acessível na tela inicial e durante a partida |

---

## 🗂️ Estrutura de pastas

```
Somatorios-A3/
├── public/
│   ├── index.html        # HTML base + Bootstrap (via npm) e Font Awesome (CDN)
│   └── dicas.json        # dados SIMULADOS consumidos via HTTP (axios)
├── src/
│   ├── index.js          # ponto de entrada (createRoot)
│   ├── index.css         # estilos próprios das cartas/tableau
│   ├── App.js            # roteador de telas + useEffect (HTTP)
│   ├── hooks/
│   │   └── useSomatorios.js   # TODA a regra do jogo (estado + ações)
│   ├── services/
│   │   └── dicasClient.js     # cliente axios (requisição HTTP)
│   ├── utils/
│   │   ├── baralho.js         # baralho + embaralhar (lógica pura)
│   │   └── jogo.js            # operações + vitória (lógica pura)
│   └── components/            # 11 componentes de tela/UI
└── docs/
    ├── PITCH.md          # roteiro de apresentação (Sprint 2)
    └── RELATORIO.md      # relatório do projeto (Sprint 2)
```

---

## 💡 Melhorias futuras (próximas sprints)
- Tela de **estatísticas** (tempo por jogada, operador mais usado, taxa de vitória) — já prevista no pré-projeto.
- Entrada da **soma secreta** por cada jogador (hoje o objetivo é calculado automaticamente).
- **Multiplayer online** (sincronização) e persistência via back-end.
- Acessibilidade **WCAG 2.1 AA** completa (contraste, navegação por teclado em 100% dos fluxos, leitor de tela).
