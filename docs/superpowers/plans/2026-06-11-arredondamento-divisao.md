# Arredondamento do resultado da divisão — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer a divisão do jogo produzir sempre um resultado inteiro (`Math.round(acumulado / valor)`), com testes que travam a regra e o texto do jogador atualizado.

**Architecture:** Mudança num único ponto — o caso `divisao` de `aplicarOperacao` em `src/utils/jogo.js`. Como as cartas são inteiras e `+ − ×` preservam inteiros, arredondar só a divisão mantém o resultado parcial inteiro durante toda a partida; nenhuma outra função muda. Texto do jogador (ModalRegras + 1 dica) é aditivo.

**Tech Stack:** React 19 + react-scripts 5 (CRA), Jest, git.

**Spec:** `docs/superpowers/specs/2026-06-11-arredondamento-divisao-design.md`

---

## ⛔ Gates (valem para TODAS as tasks)

1. **Nunca fazer `git push`.** Push é decisão de Marcelo após teste manual (inclui decidir se vai ao ar antes ou depois da apresentação de 12/06).
2. **Parar ao fim da Task 1** (Etapa 1 — lógica+testes) e **ao fim da Task 2** (Etapa 2 — texto): montar pacote de revisão para o Codex e aguardar.
3. **Não tocar** em baralho, cálculo do objetivo, turnos, pass-and-play, `useSomatorios.js` nem em qualquer componente fora dos listados.
4. **Não commitar `.vscode/`** (untracked).
5. Mensagens de commit em PT-BR, **sem trailer de IA**.
6. `node_modules/` já deve estar instalado (rodamos `npm ci` antes nesta sessão). Se `node_modules/.bin/react-scripts` não existir, rodar `npm ci` (usa o `.npmrc` com `legacy-peer-deps`) antes da Task 1, sem commitar nada.

---

# ETAPA 1 — Lógica + testes (`jogo.js` + `jogo.test.js`)

### Task 1: Arredondar a divisão com `Math.round`

**Files:**
- Modify: `src/utils/jogo.test.js` (bloco `describe('aplicarOperacao')`)
- Modify: `src/utils/jogo.js` (função `aplicarOperacao`, caso `divisao`)

- [ ] **Step 0: Baseline limpo**

Run: `git status --short && CI=true npm test 2>&1 | grep -E "^Tests:"`
Expected: working tree só com `?? .vscode/`; `Tests: 36 passed, 36 total`.

- [ ] **Step 1: Atualizar os testes (vermelho primeiro)**

Em `src/utils/jogo.test.js`, **substituir** esta linha:
```js
  test('divisao pode gerar fracao', () => expect(aplicarOperacao(10, 'divisao', 4)).toBeCloseTo(2.5));
```
por estes três testes:
```js
  test('divisao arredonda para o inteiro mais proximo (metade para cima)', () => {
    expect(aplicarOperacao(10, 'divisao', 4)).toBe(3); // 2,5 -> 3
    expect(aplicarOperacao(7, 'divisao', 2)).toBe(4);  // 3,5 -> 4
    expect(aplicarOperacao(10, 'divisao', 3)).toBe(3); // 3,33 -> 3
    expect(aplicarOperacao(10, 'divisao', 6)).toBe(2); // 1,67 -> 2
  });
  test('divisao arredonda resultado negativo conforme Math.round (em direcao ao +infinito)', () => {
    expect(aplicarOperacao(-7, 'divisao', 2)).toBe(-3); // -3,5 -> -3
  });
  test('arredondamento acontece na divisao, nao na exibicao (calculo sequencial)', () => {
    let r = aplicarOperacao(9, 'divisao', 2); // 4,5 -> 5
    r = aplicarOperacao(r, 'soma', 1);        // 6
    expect(r).toBe(6);
  });
```
(O teste `divisao exata`, `10 ÷ 5 = 2`, **continua** logo acima e segue válido — `Math.round(2) = 2`.)

- [ ] **Step 2: Rodar e confirmar que FALHA**

Run: `CI=true npm test 2>&1 | grep -E "^(Tests|Test Suites):"`
Expected: FALHA — pelo menos os 3 testes novos quebram com o código atual (ex.: `10÷4` devolve `2.5`, esperado `3`; sequencial devolve `5.5`, esperado `6`; negativo devolve `-3.5`, esperado `-3`). Algo como `Tests: 3 failed, 35 passed`.

- [ ] **Step 3: Implementar o arredondamento**

Em `src/utils/jogo.js`, **substituir** esta linha:
```js
    case 'divisao':       return acumulado / valor; // valor nunca e 0 (cartas vao de 1 a 9)
```
por:
```js
    // divisao arredondada para o inteiro mais proximo (Math.round, metade para cima);
    // valor nunca e 0 (cartas vao de 1 a 9). Negativos seguem o Math.round do JS (-3,5 -> -3).
    case 'divisao':       return Math.round(acumulado / valor);
```

- [ ] **Step 4: Rodar e confirmar que PASSA**

Run: `CI=true npm test 2>&1 | grep -E "^(Tests|Test Suites):"`
Expected: `Test Suites: 3 passed, 3 total` e `Tests: 38 passed, 38 total` (eram 36; o teste de fração saiu e entraram 3 novos → 38).

- [ ] **Step 5: Build**

Run: `npm run build 2>&1 | grep -E "(Compiled|Failed)"`
Expected: `Compiled successfully.`

- [ ] **Step 6: Commit**

```bash
git add src/utils/jogo.js src/utils/jogo.test.js
git commit -m "Arredonda o resultado da divisao para inteiro (Math.round)"
```

- [ ] **Step 7: PARAR — pacote de revisão para o Codex**

Reportar a Marcelo: outputs dos Steps 2 (vermelho) e 4 (verde), Step 5 (build), `git show --stat HEAD`, `git status --short`. **Não fazer push. Não iniciar a Etapa 2 sem OK.**

---

# ETAPA 2 — Texto do jogador (`ModalRegras.js` + `dicas.json`)
**Pré-condição: OK do Codex na Etapa 1.**

### Task 2: Regra no "Como jogar" + nova dica

**Files:**
- Modify: `src/components/ModalRegras.js` (item "Conta" da lista de regras)
- Modify: `public/dicas.json` (nova dica id 9)

- [ ] **Step 1: Acrescentar a regra no ModalRegras**

Em `src/components/ModalRegras.js`, **substituir** este bloco:
```jsx
            <li className="mb-2">
              <strong>Conta:</strong> o resultado é calculado da esquerda para a direita, sem
              prioridade de operações. Após jogar, você compra uma carta nova.
            </li>
```
por:
```jsx
            <li className="mb-2">
              <strong>Conta:</strong> o resultado é calculado da esquerda para a direita, sem
              prioridade de operações. Quando uma divisão não der exata, o resultado é arredondado
              para o inteiro mais próximo. Após jogar, você compra uma carta nova.
            </li>
```

- [ ] **Step 2: Adicionar a nova dica**

Em `public/dicas.json`, **substituir** a última linha de dado e o fechamento:
```json
  { "id": 8, "texto": "Errar faz parte: no jogo cooperativo, cada tentativa ensina o grupo inteiro." }
]
```
por:
```json
  { "id": 8, "texto": "Errar faz parte: no jogo cooperativo, cada tentativa ensina o grupo inteiro." },
  { "id": 9, "texto": "Divisões com decimal são arredondadas: 7 ÷ 2 vira 4, e 10 ÷ 3 vira 3." }
]
```

- [ ] **Step 3: Validar o JSON (9 dicas, sem 'quociente')**

Run: `node -e "const d=JSON.parse(require('fs').readFileSync('public/dicas.json','utf8')); console.log('JSON OK,', d.length, 'dicas'); console.log(d[8].texto); console.log('contem quociente?', JSON.stringify(d).includes('quociente'))"`
Expected:
```
JSON OK, 9 dicas
Divisões com decimal são arredondadas: 7 ÷ 2 vira 4, e 10 ÷ 3 vira 3.
contem quociente? false
```

- [ ] **Step 4: Testes e build**

Run: `CI=true npm test 2>&1 | grep -E "^Tests:" && npm run build 2>&1 | grep -E "(Compiled|Failed)"`
Expected: `Tests: 38 passed, 38 total` (texto não altera lógica) e `Compiled successfully.`

- [ ] **Step 5: Confirmar a regra no bundle servido**

Run:
```bash
cd build && grep -c "arredondado" $(ls static/js/main.*.js | head -1); cd ..
```
Expected: `1` ou mais (a frase do ModalRegras entrou no build).

- [ ] **Step 6: Commit**

```bash
git add src/components/ModalRegras.js public/dicas.json
git commit -m "Explica o arredondamento da divisao nas regras e numa dica"
```

- [ ] **Step 7: PARAR — pacote de revisão para o Codex**

Reportar: outputs dos Steps 3, 4 e 5, `git show --stat HEAD`, `git log --oneline -4`, `git status --short` (só `?? .vscode/`). Sugerir a Marcelo o teste manual: abrir "Como jogar" e ver a frase nova; numa partida, forçar uma divisão não-exata (ex.: resultado 7 ÷ 2) e confirmar `4` no Tableau, com o jogo seguindo a partir de `4`. **Sem push** — push das Etapas 1+2 é decisão de Marcelo após o teste manual.

---

## Verificação final (após ambas as etapas aprovadas)

- [ ] `CI=true npm test` → `Tests: 38 passed, 38 total`.
- [ ] `npm run build` → `Compiled successfully.`
- [ ] `git diff --stat <commit_anterior_a_etapa1>..HEAD` restrito a: `src/utils/jogo.js`, `src/utils/jogo.test.js`, `src/components/ModalRegras.js`, `public/dicas.json` (+ os specs/planos em `docs/`).
- [ ] `git status --short` → só `?? .vscode/`.
- [ ] Push fica a critério de Marcelo (re-deploy automático na Vercel).
