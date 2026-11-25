# Spec — Marcador "Início da rodada" e cartas do protótipo físico no app

**Data:** 2026-11-24 · **Status:** implementado na branch `claude/marcador-e-cartas-fisicas`, aguardando revisão do
Codex e teste manual do Marcelo (fluxo gated do `AGENTS.md`).
**Pedido do Marcelo:** "Modifique a versão online para que ela utilize as regras do marcador para quantidade de
jogadores pares e utilize as cartas do físico." Toca `src/hooks/useSomatorios.js` e `src/utils/baralho.js` (travados):
mudança autorizada por pedido explícito.

## 1. Regra do marcador (igual a `prototipo/Somatorios-fisico-v0.2/fonte/REGRAS_CANONICAS.md`)

- Só com **2 ou 4 jogadores** (número par). Sem ele, cada jogador jogaria sempre o mesmo tipo de carta.
- Quem começa (Jogador 1) pega o marcador. A rodada começa com quem está com ele; quando todos jogaram 1 vez,
  o marcador passa para o próximo jogador, que começa a nova rodada.
  - 4 jogadores: `A B C D → B C D A → C D A B → D A B C…`
  - 2 jogadores: `A B → B A → A B…` (quem recebe o marcador joga duas vezes seguidas).
- Quando o **monte de compra acaba**, o marcador é guardado e a vez segue em ordem, pulando quem ficou sem cartas
  (comportamento antigo do app).
- 3 ou 5 jogadores: nada muda.

**Lógica pura:** `src/utils/marcador.js` — `usaMarcador(qtd)`, `marcadorInicial(qtd, quemComeca)`,
`proximaVez({ vezAtual, marcador, jogadasNaRodada, cartasNaMao, cartasNoMonte })` → `{ vez, marcador,
jogadasNaRodada, evento }`, com `evento` = `'novaRodada' | 'marcadorGuardado' | null`.

**Hook:** `useSomatorios` ganha `usaMarcador`, `marcador`, `jogadasNaRodada` e `eventoRodada` no estado; o trecho
"passa a vez" usa `proximaVez`. Cálculo, vitória, derrota, compra e objetivo **não mudam**.

## 2. Cartas do físico

- `src/components/CartaFisica.js` porta para SVG/React a geometria de `fonte/somatorios_svg.py`: `FrenteCarta`
  (63 × 88 mm, faixas com índice, sinal pequeno e sinal grande girado 90°, número central, nome do naipe, 6/9
  sublinhados; `deitada` gira 90°), `VersoCarta` (4 triângulos + Σ), `ChipOperador` e `MarcadorRodada`.
  Desenhos decorativos (`aria-hidden`); o rótulo acessível continua no elemento que os usa.
- **Paleta** do kit em `OPERADORES` (`baralho.js`) e nas variáveis `--cor-*` do CSS:
  + `#43a02a` · − `#a51b1b` · × `#1d3a80` · ÷ `#a774e0` (pior ΔE2000 sob daltonismo 17,2; a antiga, 6,6).
  Essas cores são usadas só em elementos gráficos (faixas, chips, símbolos grandes ≥ 3:1). Por isso, os sinais
  coloridos em texto pequeno do modal de regras viraram chips.
- **Mão:** a carta usa o desenho físico, em pé (número) ou deitada (operador). Tamanho pelo CSS (`--l` = lado menor:
  88 px; 104 px a partir de 576 px; 116 px a partir de 992 px).
- **Tableau:** números como mini-cartas físicas em pé; operadores como chips (como nos diagramas do kit), porque o sinal
  de uma mini-carta deitada ficaria ilegível.
- **Passe o dispositivo:** 4 versos de carta e o aviso de nova rodada ou de marcador guardado. Com 2 jogadores, o título
  muda para "É de novo a vez de".
- **Barra de status:** 4º chip "Início da rodada" com quem está com o marcador (ou "guardado").
- **Tela inicial:** com 2 ou 4 jogadores, uma dica explica o marcador. **Regras:** novo item sobre o marcador.
- **Leitor de tela:** a região `aria-live` da vez acrescenta "Nova rodada: X está com o marcador…" ou "O monte de compra
  acabou: o marcador foi guardado…".

## 3. Verificação (feita em 24/11/2026)

- `CI=true npm test`: **57 testes** passam. São 18 novos: `marcador.test.js` (ordens 2 e 4, alternância de papéis,
  exemplos canônicos do manual e da folha de venda, monte vazio) e `useSomatorios.test.js` (partidas inteiras com 2–5
  jogadores pelo hook).
- `CI=true npm run build`: compila sem avisos.
- Playwright em 320, 768 e 1440 px (início, passe, mão de número, mão de operador, nova rodada, regras): **sem overflow
  horizontal**. O axe-core (WCAG 2.1 AA + boas práticas) não acusa nenhuma violação nova. A única ocorrência
  (`color-contrast` no selo "Jogo cooperativo de matematica" do cabeçalho, ≥ 576 px) já existe no site publicado.
- `prefers-reduced-motion: reduce`: animação e transição das cartas zeradas pela regra global.

## 4. Revisão do Codex (24/11/2026) e correções

A lógica do marcador passou: viradas com 2 e 4 jogadores, marcador guardado depois da última compra e ordem normal com
3 e 5. A revisão também repetiu os 57 testes e o build em modo CI. Pediu dois ajustes de interface:

1. **[P1] Tela de passe no celular deitado.** Com o aviso de nova rodada, o botão "Sou X, ver minhas cartas" ficava
   cortado em 568 × 320 px e sumia com 270 px de altura útil (tela fixa, sem rolagem).
   **Correção:** `.overlay-passe` rola (`overflow-y: auto`, `align-items: flex-start`) e a caixa centra com
   `margin: auto` (não corta o topo). Com até 560 px de altura, os versos somem e a caixa fica mais compacta e mais larga.
   **Verificado:** em 568 × 320, o botão aparece inteiro sem rolar. Em 568 × 270, a tela rola 5 px e o botão, que já
   recebe o foco ao abrir, fica inteiro à vista. Retrato (320 × 568, 390 × 844) sem mudança.
2. **[P2] Contraste dos índices das cartas verdes e roxas** (branco: 3,33:1 e 3,38:1, abaixo de 4,5:1).
   **Correção:** `COR_INDICE` em `CartaFisica.js` escolhe branco quando passa de 4,5:1 sobre a faixa; senão, a tinta
   `#14233b`. Na paleta do kit: tinta no + e no ÷ (4,7:1), branco no − e no ×. Os sinais continuam brancos (elementos
   gráficos, ≥ 3:1). Coberto por `src/components/CartaFisica.test.js`.

Depois das correções: `CI=true npm test` com **63 testes** passando; `CI=true npm run build` sem avisos; axe-core sem
violações novas nas telas alteradas.

> Para a v0.3 do kit físico: avaliar a mesma troca (índice escuro no + e no ÷) nas cartas impressas.

## 5. Fora do escopo (decisão explícita)

- Objetivo continua calculado pelo app (no físico é a soma falada).
- Termos do app continuam "jogador" (o kit usa "pessoa"), para manter a consistência interna do app.
