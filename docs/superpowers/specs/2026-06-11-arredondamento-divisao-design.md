# Spec — Arredondamento do resultado da divisão para inteiro

**Data:** 2026-06-11 · **Status:** aprovado por Marcelo (gate de design via Codex)
**Contexto:** mudança de **regra de jogo** no Somatórios. A divisão passa a produzir sempre um resultado inteiro. Toca `src/utils/jogo.js`, arquivo marcado como TRAVADO em `docs/STATUS.md` — por isso passou pelo fluxo de design completo.

## Regra oficial

Sempre que uma divisão **não der exata**, o resultado parcial vira o **inteiro mais próximo** (arredondamento padrão, metade para cima): `Math.round(acumulado / valor)`.

Exemplos: `7÷2 = 3,5 → 4` · `10÷3 = 3,33 → 3` · `10÷6 = 1,67 → 2` · `10÷4 = 2,5 → 3` · `10÷5 = 2 → 2` (exata, inalterada).

**Resultados negativos.** Como o jogo permite subtração, o resultado parcial pode ficar **negativo** antes de uma divisão. A regra segue **exatamente** o comportamento do `Math.round` do JavaScript, que arredonda o `,5` em direção ao **+∞** (não "para longe do zero"): `Math.round(-7 / 2) = Math.round(-3,5) = -3`. Outros exemplos: `-10÷3 = -3,33 → -3` · `-9÷2 = -4,5 → -4`. Adotar o comportamento nativo (sem normalização extra) mantém a regra simples e previsível.

## Por que um único ponto basta

As cartas têm valores inteiros (1–9) e a primeira jogada é sempre um número (inteiro). `+`, `−` e `×` entre inteiros resultam em inteiros. A **única** operação que introduz fração é a divisão. Logo, arredondando **somente** o resultado da divisão, o resultado parcial é inteiro após cada jogada, durante toda a partida. Consequência: toda divisão é sempre `inteiro ÷ inteiro`, e nenhuma outra função precisa mudar.

## Mudança na lógica

**Arquivo:** `src/utils/jogo.js` — função `aplicarOperacao`, caso `divisao`:

```js
// antes
case 'divisao': return acumulado / valor;
// depois
case 'divisao': return Math.round(acumulado / valor);
```

Atualizar o comentário do caso para registrar a regra de arredondamento.

**Inalterados (decisão explícita):**
- `ehVitoria` e `EPSILON` ficam como estão. Com resultados sempre inteiros, a comparação `Math.abs(resultadoParcial - objetivo) < EPSILON` vira praticamente igualdade de inteiros; o `EPSILON` permanece como rede de segurança (custo zero, sem risco).
- `formatarNumero` fica intacto: continua usado na exibição (Tableau, BarraStatus, TelaFim). O ramo que formata fração deixa de ser exercitado pelo jogo, mas segue correto como utilitário e mantém seus testes.

## Testes — `src/utils/jogo.test.js`

1. **Mantém:** `divisao exata` — `aplicarOperacao(10, 'divisao', 5)` → `2`.
2. **Substitui** o teste `divisao pode gerar fracao` (esperava `2.5`, agora inválido) por casos de arredondamento, com `toBe` (resultados inteiros):
   - `aplicarOperacao(10, 'divisao', 4)` → `3`  (2,5 → 3)
   - `aplicarOperacao(7, 'divisao', 2)` → `4`  (3,5 → 4)
   - `aplicarOperacao(10, 'divisao', 3)` → `3`  (3,33 → 3)
   - `aplicarOperacao(10, 'divisao', 6)` → `2`  (1,67 → 2)
   - `aplicarOperacao(-7, 'divisao', 2)` → `-3`  (negativo: -3,5 → -3, conforme o `Math.round` do JS, que arredonda em direção ao +∞)
3. **Adiciona** teste de cálculo **sequencial** (prova que o arredondamento ocorre no momento da divisão, não na exibição):
   - `9 ÷ 2 = 5`; depois `5 + 1 = 6`:
     ```js
     let r = aplicarOperacao(9, 'divisao', 2); // 4,5 → 5
     r = aplicarOperacao(r, 'soma', 1);        // 6
     expect(r).toBe(6);
     ```
   - Se o arredondamento não acontecesse na divisão, `r` seria `4,5` e o resultado final `5,5` — o teste falharia, garantindo a propriedade.

Os demais testes de `jogo.test.js` (incl. `calculo e da esquerda para a direita`, que usa soma e multiplicação) não são afetados.

## Texto para o jogador

Linguagem curta, adequada a crianças, usando **"resultado"** (nunca "quociente").

- **`src/components/ModalRegras.js`** — no item "Conta", acrescentar a frase:
  > "Quando uma divisão não der exata, o resultado é arredondado para o inteiro mais próximo."
- **`public/dicas.json`** — nova dica `{ "id": 9, "texto": "Divisões com decimal são arredondadas: 7 ÷ 2 vira 4, e 10 ÷ 3 vira 3." }`.
  - Efeito colateral benigno: `App.js` usa `dicas[estado.objetivo % dicas.length]` (TelaFim) e `dicas[0]` (TelaInicial); passar de 8 para 9 dicas só muda a distribuição do módulo. Sem impacto funcional.

## Fora de escopo

- Baralho, cálculo do objetivo, turnos, pass-and-play, `useSomatorios.js`, demais componentes.
- Nenhuma dependência nova.
- README.md / RELATORIO.md (docs): não descrevem a divisão gerando fração, então não contradizem a regra; atualização opcional fica para depois, se Marcelo quiser. Não entra nesta mudança.

## Estrutura gated (2 passos atômicos)

1. **Lógica + testes** — `src/utils/jogo.js` + `src/utils/jogo.test.js`. Núcleo da mudança; a regra e seus testes viajam juntos.
2. **Texto do jogador** — `src/components/ModalRegras.js` + `public/dicas.json`. Aditivo.

Cada passo: implementar → `CI=true npm test` + `npm run build` → revisão do Codex → teste manual de Marcelo → push. **Nenhum passo faz push automático.**

## Critérios de aceite

- `CI=true npm test`: todos os testes passam, incluindo os novos casos de arredondamento e o teste sequencial.
- `npm run build`: sucesso.
- Verificação manual rápida: numa partida, uma divisão não-exata (ex.: resultado 7, dividir por 2) mostra `4` no Tableau/resultado parcial, e o jogo segue a partir de `4`.
- ModalRegras exibe a nova frase; `dicas.json` parseia com 9 dicas.
- `git diff` restrito aos 4 arquivos acima (+ este spec); baralho/objetivo/turnos/pass-and-play intocados.

## Timing (decisão de Marcelo no gate do push)

Esta mudança **reabre as regras travadas** congeladas para a apresentação de 12/06. A implementação e a revisão do Codex podem ocorrer já; **se vai ao ar antes ou depois da apresentação é decisão de Marcelo no momento do push.** A mudança é mínima e isolada, mas mexe em comportamento percebido pelo jogador.

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Arredondamento aplicado só na exibição, não no cálculo | Teste sequencial (`9÷2` → `+1` = 6) trava a propriedade |
| Resultado parcial fracionário escapar para alguma tela | Arredondar na origem (`aplicarOperacao`) garante inteiro em todo o estado |
| Arredondamento de `,5` negativo divergir do esperado | Documentado (o `Math.round` do JS vai p/ +∞: `-3,5 → -3`) e travado por teste (`-7÷2 → -3`) |
| Mudança de regra na véspera da apresentação | Escopo mínimo, 2 passos gated, push sob decisão de Marcelo |
| Texto confuso para crianças | Usa "resultado", frase curta, exemplo concreto (7÷2 vira 4) |
