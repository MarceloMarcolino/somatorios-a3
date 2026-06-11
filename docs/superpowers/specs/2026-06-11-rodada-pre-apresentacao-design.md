# Spec — Rodada pré-apresentação (sync Kauê + ErrorBoundary + a11y condicional)

**Data:** 2026-06-11 · **Status:** aprovado por Marcelo (gate de escopo/design via Codex)
**Contexto:** apresentação da A3 em 12/06/2026. Objetivo da rodada: reduzir risco da demo ao vivo. Nada de redesenho visual nesta rodada.

## Objetivo

1. Incorporar ao repo principal os 2 commits do Kauê feitos na cópia `somatorios-a3 2`, preservando autoria e histórico linear.
2. Corrigir o erro de português introduzido ("Múltiplicar") e eliminar a classe de problemas de CRLF com `.gitattributes`.
3. Adicionar um ErrorBoundary no topo da árvore React para impedir tela branca durante a apresentação.
4. (Condicional) Passo 14 de acessibilidade, apenas se as etapas 1–2 passarem com folga.

## Fora de escopo

- Juice visual (destaque do operador pendente, micro-animações) — fica para depois da apresentação.
- Qualquer mudança nas regras travadas (`utils/baralho.js`, `utils/jogo.js`, `hooks/useSomatorios.js`).
- Novas dependências (inclui `@testing-library/react` — continua como melhoria futura).
- Push/deploy automático: **nenhuma etapa faz push**.

## Fluxo gated (critério transversal)

Uma etapa por vez: Claude implementa → para → Codex revisa/testa (`CI=true npm test`, `npm run build`, checagens da etapa) → Marcelo testa manualmente → só então push (CI/CD da Vercel re-deploya). Commits em PT-BR no padrão do repo, **sem trailer de IA**.

---

## Etapa 1 — Sincronizar trabalho do Kauê + typo + .gitattributes

### Estado de partida

- Repo principal: `main` em `60340ff` + 1 commit novo com este spec (ver "Ordem dos commits").
- Cópia `../somatorios-a3 2`: `main` em `84fa7f7` = `60340ff` + `101dcd8` ("Ajustando posição dos símbolos das cartas", só `src/index.css`) + `84fa7f7` ("Corrigindo erros de portugues", só `public/dicas.json`). Working tree da cópia tem ruído CRLF **não commitado** em todos os arquivos — `git diff --ignore-cr-at-eol` vazio — que **não entra** (fetch traz apenas commits).

### Integração (decisão técnica)

`git fetch "../somatorios-a3 2" main` seguido de `git rebase FETCH_HEAD` na `main` local. Como o commit do spec entra antes da sincronização, a `main` diverge da cópia e um `--ff-only` puro deixa de ser possível; o rebase mantém o resultado desejado: os commits do Kauê (`101dcd8`, `84fa7f7`) entram como base **com SHAs e autoria originais**, e somente o commit do spec (de Marcelo) é reposicionado por cima. Histórico permanece linear, sem merge commit. Conflitos não são esperados (o spec não existe na cópia).

### Ordem final dos commits na `main` local (de baixo para cima)

1. `7603b26` … `60340ff` (histórico já existente, intacto)
2. `101dcd8` — Kauê, CSS do símbolo da carta-operador (SHA preservado)
3. `84fa7f7` — Kauê, acentos no `dicas.json` (SHA preservado)
4. *(novo)* spec desta rodada (commit reposicionado pelo rebase)
5. *(novo)* "Corrige acento de 'Multiplicar' na dica 4" — só `public/dicas.json`, troca `"Múltiplicar"` → `"Multiplicar"`
6. *(novo)* "Adiciona .gitattributes (eol=lf) para normalizar fim de linha" — arquivo novo com:

   ```
   * text=auto eol=lf
   ```

   Efeito: no Windows do Kauê, checkout passa a materializar LF e commits normalizam para LF. O repo já é 100% LF, então nada é renormalizado aqui. `text=auto` deixa binários de fora automaticamente.

### Critérios de aceite (Codex)

- `CI=true npm test` → 36 testes passando; `npm run build` → sucesso.
- `git log --oneline` confere com a ordem acima; autoria dos commits do Kauê preservada (`kauahenr1`).
- `git ls-files --eol` → nenhum arquivo versionado com `i/crlf`.
- **Diff esperado** (não vazio) entre as pastas, via `diff -ru --strip-trailing-cr` excluindo `node_modules`, `.git`, `build`, `package-lock.json`. Diferenças permitidas, e somente elas:
  - `public/dicas.json` — dica 4: "Multiplicar" (principal, correto) vs "Múltiplicar" (cópia);
  - `.gitattributes` — existe só no principal;
  - `docs/superpowers/specs/2026-06-11-rodada-pre-apresentacao-design.md` — existe só no principal;
  - `.vscode/settings.json` — existe só no principal (untracked; cores do Peacock, fora do escopo git).
  Qualquer outra diferença de conteúdo = reprovado.
- Checagem visual (consequência do commit `101dcd8` do Kauê, única mudança com efeito visual): carta jogada como **operador** (deitada) com símbolo central legível, sem sobrepor o chip do número, em 320px e desktop.

### Parada

Fim da etapa 1: parar, montar pacote de revisão para o Codex. Sem push.

---

## Etapa 2 — ErrorBoundary anti tela-branca

**Pré-condição:** OK do Codex na etapa 1.

### Design

- Novo arquivo `src/components/ErrorBoundary.js`, componente **de classe** (exigência da API de boundaries; sem equivalente em hook no React 19):
  - `static getDerivedStateFromError(erro)` → `{ temErro: true }`;
  - `componentDidCatch(erro, info)` → `console.error` (diagnóstico em produção);
  - render normal: `this.props.children`.
- Integração em `src/index.js`: `<ErrorBoundary><App /></ErrorBoundary>` dentro do `StrictMode` existente.
- Fallback em PT-BR, com `role="alert"`, reusando classes/tokens existentes (`card-ludico`, `btn-grande`, tokens de cor — contraste AA): ícone Font Awesome, título "Ops! Algo deu errado.", texto curto explicando que recarregar volta à tela inicial e que as estatísticas ficam salvas (localStorage não é afetado), botão primário **Recarregar** → `window.location.reload()`.
- CSS novo: idealmente zero; no máximo ~3 linhas (centralização), sem tokens novos.
- Nenhuma dependência nova. Nenhuma mudança em regras do jogo ou nas telas.

### Critérios de aceite (Codex)

- `CI=true npm test` e `npm run build` passam.
- Validação do fallback: **no build de produção servido estaticamente** (em dev o overlay do webpack cobre o fallback; fecha com ESC), aplicar patch temporário local que força `throw` no render da `TelaInicial`, conferir fallback (texto, contraste, foco/teclado, botão recarrega e volta à tela inicial) e **reverter o patch antes de entregar à revisão** — `git status` ao final mostra apenas os arquivos da etapa (`src/components/ErrorBoundary.js`, `src/index.js`).
- `package.json` sem dependências novas.
- Fallback passa axe-core e não tem overflow horizontal em 320px.

### Parada

Fim da etapa 2: parar, pacote de revisão para o Codex → teste manual de Marcelo → push das etapas 1+2 juntas (decisão de push é de Marcelo).

---

## Etapa 3 (condicional) — Passo 14: passe de acessibilidade

**Pré-condição:** OK do Codex nas etapas 1 **e** 2, e tempo disponível antes da apresentação. Caso contrário, não entra nesta rodada.

Markup aditivo, zero mudança visual ou de lógica:

1. **Troca de turno anunciada:** região `aria-live="polite"` (texto `visually-hidden`) na `TelaPartida` anunciando "Vez de {nome}" quando `vezAtual` muda — complementa o `aria-live` de resultado já existente.
2. **Tableau semântico:** frase oculta (`visually-hidden`) com a expressão por extenso — mapa: soma → "mais", subtração → "menos", multiplicação → "vezes", divisão → "dividido por"; sufixo "igual a {resultado}". O bloco visual da expressão (mini-cartas/símbolos) passa a `aria-hidden="true"` por se tornar redundante — exceção consciente à convenção "aria-hidden só em elemento visual": a informação completa permanece disponível na frase oculta adjacente.
3. **BarraStatus agrupada:** `role="group"` + `aria-label="Status da partida"` no contêiner.

Critérios de aceite: testes e build passam; axe-core sem regressão; leitura coerente com VoiceOver (anúncio de turno na troca, expressão por extenso no Tableau); nenhuma mudança visual (screenshot antes/depois idêntico).

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Rebase com conflito inesperado | Improvável (spec não existe na cópia); se ocorrer, abortar (`git rebase --abort`) e parar para decisão |
| Mudança visual do Kauê quebra layout da carta em telas pequenas | Checagem visual explícita em 320px na etapa 1; se reprovar, discutir correção como nova etapa (não reverter silenciosamente) |
| Overlay de dev esconde o fallback do boundary | Validação no build de produção servido (documentado na etapa 2) |
| Patch de erro forçado esquecido no código | Critério de aceite exige `git status` limpo exceto arquivos da etapa |
| CRLF reaparecer em commits futuros do Windows | `.gitattributes` com `* text=auto eol=lf` (etapa 1) |
