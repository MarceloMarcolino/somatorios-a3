# Rodada pré-apresentação — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sincronizar os 2 commits do Kauê no repo principal (com correção do typo "Múltiplicar" e `.gitattributes`), blindar a demo de amanhã com um ErrorBoundary anti tela-branca e, condicionalmente, aplicar o passe de acessibilidade (Passo 14) — tudo no fluxo gated, sem push.

**Architecture:** Integração git via `fetch` + `rebase FETCH_HEAD` (commits do Kauê viram base com SHAs/autoria intactos; só os commits de documentação locais são reposicionados). ErrorBoundary é componente de classe envolvendo `<App />` em `src/index.js`, com fallback que reusa classes/tokens existentes. Etapa 3 é markup acessível aditivo em `TelaPartida`, `Tableau` e `BarraStatus`. Nenhuma dependência nova; regras travadas (`utils/baralho.js`, `utils/jogo.js`, `hooks/useSomatorios.js`) intocadas.

**Tech Stack:** React 19 + react-scripts 5 (CRA), Bootstrap 5, Jest (36 testes de lógica pura), git, `python3 -m http.server` para servir o build.

**Spec:** `docs/superpowers/specs/2026-06-11-rodada-pre-apresentacao-design.md`

---

## ⛔ Gates (valem para TODAS as tasks)

1. **Nunca fazer `git push`.** Push é decisão de Marcelo após teste manual.
2. **Parar ao fim da Etapa 1** (Task 5) e **ao fim da Etapa 2** (Task 8): montar pacote de revisão para o Codex e aguardar.
3. **Etapa 3 só executa** com OK do Codex nas etapas 1 e 2 **e** tempo disponível antes de 12/06.
4. **Não commitar `.vscode/`** (untracked, fica como está) **nem ruído CRLF**.
5. Mensagens de commit em PT-BR, padrão do repo, **sem trailer de IA** (`Co-Authored-By` etc.).
6. **SHAs dos commits locais de documentação mudam no rebase** — referenciá-los pela mensagem, nunca pelo SHA. Os SHAs do Kauê (`101dcd8`, `84fa7f7`) não mudam.
7. axe-core **não é executável** neste ambiente (4.12.0 só no lockfile, ausente de `node_modules`); critérios de acessibilidade usam o checklist manual da Task 8. Não instalar nada para isso.

---

# ETAPA 1 — Sincronizar trabalho do Kauê + typo + .gitattributes

### Task 0: Preflight operacional (node_modules ausente)

**Files:** nenhum arquivo versionado (instala dependências locais)

- [ ] **Step 1: Verificar se o react-scripts está instalado**

Run: `if [ -x node_modules/.bin/react-scripts ]; then echo "react-scripts OK"; else echo "react-scripts FALTA"; fi`
Expected: `react-scripts OK` → pular para a Task 1. `react-scripts FALTA` → Step 2.

- [ ] **Step 2: Instalar dependências com npm ci**

Run: `npm ci`
(`npm ci` instala exatamente o `package-lock.json` — falha em vez de modificá-lo se houver divergência — e usa o `.npmrc` com `legacy-peer-deps`. `node_modules/` é gitignorado: **não commitar**.)
Expected: instalação termina sem erro.

- [ ] **Step 3: Confirmar lockfile intacto e árvore limpa**

Run: `git status --short`
Expected: somente `?? .vscode/`. Se `package-lock.json` aparecer modificado ou o `npm ci` falhar: **PARAR e reportar** (não prosseguir para a Task 1).

### Task 1: Pré-checagens e baseline

**Files:** nenhum (somente leitura)

- [ ] **Step 1: Confirmar árvore limpa**

Run: `git status --short`
Expected: somente `?? .vscode/` (nada staged, nada modificado).

- [ ] **Step 2: Baseline dos testes**

Run: `CI=true npm test`
Expected: `Tests: 36 passed, 36 total` — suites `baralho.test.js`, `jogo.test.js`, `estatisticas.test.js`.

- [ ] **Step 3: Confirmar ponto de partida do histórico**

Run: `git log --oneline -3`
Expected (SHAs dos 2 do topo podem variar, mensagens não):
```
<sha> Adiciona plano de implementacao da rodada pre-apresentacao
<sha> Adiciona spec da rodada pre-apresentacao (sync Kaue + ErrorBoundary + a11y)
60340ff Adiciona docs/STATUS.md (status e roadmap do projeto)
```

### Task 2: Integrar commits do Kauê (fetch + rebase)

**Files:** nenhum arquivo editado manualmente (operação git)

- [ ] **Step 1: Buscar a branch da cópia**

Run: `git fetch "../somatorios-a3 2" main && git rev-parse --short FETCH_HEAD`
Expected: última linha `84fa7f7`.

- [ ] **Step 2: Rebase sobre FETCH_HEAD**

Run: `git rebase FETCH_HEAD`
Expected: `Successfully rebased and updated refs/heads/main.` — sem conflitos. Se houver conflito: `git rebase --abort` e **parar** (decisão humana).

- [ ] **Step 3: Verificar ordem e autoria do histórico**

Run: `git log --format='%h %an %s' -7`
Expected (de cima para baixo; `<sha>` = novo, varia):
```
<sha> Marcelo Antonio Pereira Marcolino Adiciona plano de implementacao da rodada pre-apresentacao
<sha> Marcelo Antonio Pereira Marcolino Adiciona spec da rodada pre-apresentacao (sync Kaue + ErrorBoundary + a11y)
84fa7f7 kauahenr1 Corrigindo erros de portugues
101dcd8 kauahenr1 Ajustando posição dos símbolos das cartas
60340ff Marcelo Antonio Pereira Marcolino Adiciona docs/STATUS.md (status e roadmap do projeto)
dd48231 Marcelo Antonio Pereira Marcolino Adiciona recap de operadores e feedback gentil na TelaFim
b360a5e Marcelo Antonio Pereira Marcolino Preenche links do RELATORIO (repo GitHub + app na Vercel)
```
Os commits do Kauê **mantêm os SHAs originais** `84fa7f7`/`101dcd8`.

- [ ] **Step 4: Confirmar árvore limpa e sem CRLF**

Run: `git status --short && git ls-files --eol | grep 'i/crlf' ; echo "grep exit=$?"`
Expected: status mostra só `?? .vscode/`; grep não imprime nada e `grep exit=1` (nenhum arquivo com CRLF no index).

### Task 3: Corrigir typo "Múltiplicar" na dica 4

**Files:**
- Modify: `public/dicas.json` (linha da dica 4)

- [ ] **Step 1: Aplicar a correção**

Em `public/dicas.json`, trocar exatamente:
```json
  { "id": 4, "texto": "Múltiplicar por 1 ou dividir por 1 não muda o resultado - útil para ajustar a vez sem ultrapassar o alvo." },
```
por:
```json
  { "id": 4, "texto": "Multiplicar por 1 ou dividir por 1 não muda o resultado - útil para ajustar a vez sem ultrapassar o alvo." },
```
(única mudança: `Múltiplicar` → `Multiplicar`; o resto da linha fica idêntico.)

- [ ] **Step 2: Verificar que o JSON continua válido e sem o typo**

Run: `node -e "const d=JSON.parse(require('fs').readFileSync('public/dicas.json','utf8')); console.log('JSON OK,', d.length, 'dicas'); console.log(d[3].texto)"`
Expected:
```
JSON OK, 8 dicas
Multiplicar por 1 ou dividir por 1 não muda o resultado - útil para ajustar a vez sem ultrapassar o alvo.
```

- [ ] **Step 3: Commit**

```bash
git add public/dicas.json
git commit -m "Corrige acento de 'Multiplicar' na dica 4"
```

### Task 4: Adicionar .gitattributes

**Files:**
- Create: `.gitattributes`

- [ ] **Step 1: Criar o arquivo**

Conteúdo exato de `.gitattributes` (1 linha):
```
* text=auto eol=lf
```

- [ ] **Step 2: Confirmar que nada é renormalizado**

Run: `git add .gitattributes && git status --short`
Expected: somente `A  .gitattributes` e `?? .vscode/`. Se qualquer outro arquivo aparecer como modificado, **parar** (renormalização inesperada).

- [ ] **Step 3: Commit**

```bash
git commit -m "Adiciona .gitattributes (eol=lf) para normalizar fim de linha"
```

### Task 5: Verificação final da Etapa 1 → **PARADA (Codex)**

**Files:** nenhum

- [ ] **Step 1: Testes**

Run: `CI=true npm test`
Expected: `Tests: 36 passed, 36 total`.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `Compiled successfully.` e pasta `build/` gerada.

- [ ] **Step 3: Sem CRLF no index**

Run: `git ls-files --eol | grep 'i/crlf' ; echo "grep exit=$?"`
Expected: nada impresso, `grep exit=1`.

- [ ] **Step 4: Diff esperado contra a cópia (critério do spec)**

Run:
```bash
cd "/Users/marcolino/UCs/Usabilidade, Desenvolvimento Web, Mobile e Jogos" && \
diff -ru --strip-trailing-cr --exclude=node_modules --exclude=.git --exclude=build \
  --exclude=package-lock.json "somatorios-a3" "somatorios-a3 2"
```
Expected — **exatamente estas 4 diferenças, nada mais**:
1. `Only in somatorios-a3: .gitattributes`
2. `Only in somatorios-a3: .vscode`
3. `Only in somatorios-a3/docs: superpowers`
4. Hunk único em `public/dicas.json`, com a linha da dica 4 saindo como `Multiplicar` (principal, com `-`) e `Múltiplicar` (cópia, com `+`).

Qualquer linha além dessas = **reprovado**; parar e investigar.

- [ ] **Step 5: Checagem visual da carta-operador (mudança do commit 101dcd8)**

Run: `npm start` → http://localhost:3000 → iniciar partida com 2 jogadores → revelar mão → jogar 1 carta (número) → na 2ª vez do mesmo fluxo a instrução pede **OPERADOR**: as cartas aparecem deitadas.
Conferir: símbolo central legível, sem sobrepor o chip do número na borda inferior; repetir com DevTools em **320px**. Encerrar o `npm start` ao final.

- [ ] **Step 6: PARAR — pacote de revisão para o Codex**

Reportar a Marcelo (que repassa ao Codex): outputs dos Steps 1–4, print/descrição do Step 5, `git log --oneline -8`. **Não fazer push. Não iniciar a Etapa 2 sem OK.**

---

# ETAPA 2 — ErrorBoundary anti tela-branca
**Pré-condição: OK do Codex na Etapa 1.**

### Task 6: Criar ErrorBoundary e integrar no index.js

**Files:**
- Create: `src/components/ErrorBoundary.js`
- Modify: `src/index.js`

- [ ] **Step 1: Criar `src/components/ErrorBoundary.js`**

Conteúdo completo do arquivo:
```jsx
import React from 'react';

// ErrorBoundary (classe): captura erros de render da arvore abaixo dele e
// mostra um fallback amigavel em vez de tela branca. Precisa ser componente
// de classe: getDerivedStateFromError nao tem equivalente em hook.
export default class ErrorBoundary extends React.Component {
  state = { temErro: false };

  static getDerivedStateFromError() {
    return { temErro: true };
  }

  componentDidCatch(erro, info) {
    // diagnostico no console (vale tambem em producao); o MVP nao tem telemetria
    console.error('Erro capturado pelo ErrorBoundary:', erro, info);
  }

  render() {
    if (!this.state.temErro) return this.props.children;

    return (
      <main className="container py-5" role="alert">
        <div className="card card-ludico shadow-sm mx-auto text-center" style={{ maxWidth: 480 }}>
          <div className="card-body p-4">
            <i className="fas fa-triangle-exclamation fa-2x txt-aviso mb-3" aria-hidden="true"></i>
            <h1 className="h4">Ops! Algo deu errado.</h1>
            <p className="text-muted">
              Recarregue a página para voltar à tela inicial. As estatísticas das
              partidas continuam salvas.
            </p>
            <div className="d-grid mt-3">
              <button
                className="btn btn-primary btn-grande"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-rotate-right me-2" aria-hidden="true"></i>Recarregar
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
```

- [ ] **Step 2: Integrar em `src/index.js`**

Conteúdo completo do arquivo após a mudança (importa o boundary e envolve `<App />`):
```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

// CSS do Bootstrap 5 (design responsivo - requisito do enunciado) + estilos proprios.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Ponto de entrada (React 19): monta o componente App na div #root do index.html.
// ErrorBoundary no topo: qualquer erro de render vira fallback amigavel
// em vez de tela branca (importante para a demo ao vivo).
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

- [ ] **Step 3: Testes e build**

Run: `CI=true npm test && npm run build`
Expected: `Tests: 36 passed, 36 total` e `Compiled successfully.` (sem teste automatizado novo: `@testing-library/react` não está instalado e não entra — decisão do spec).

- [ ] **Step 4: Commit**

```bash
git add src/components/ErrorBoundary.js src/index.js
git commit -m "Adiciona ErrorBoundary anti tela-branca no topo do app"
```

### Task 7: Validar o fallback no build de produção (patch temporário)

**Files:**
- Modify (temporário, **não commitar**): `src/components/TelaInicial.js`

- [ ] **Step 1: Aplicar patch temporário de erro forçado**

Em `src/components/TelaInicial.js`, logo após a linha `export default function TelaInicial({ dicas, onIniciar, onAbrirEstatisticas }) {`, inserir:
```jsx
  throw new Error('Teste do ErrorBoundary');
```
(Validamos no **build de produção** porque em `npm start` o overlay de erro do webpack cobre o fallback — ele some no ESC, mas o build reflete o que o público veria.)

- [ ] **Step 2: Build com o erro forçado**

Run: `npm run build`
Expected: `Compiled successfully.` (o `throw` é erro de runtime, não de compilação).

- [ ] **Step 3: Servir o build e validar o fallback**

Run: `cd build && python3 -m http.server 4173` (em background) → abrir `http://localhost:4173`.
Conferir:
- fallback aparece (sem tela branca): ícone, **"Ops! Algo deu errado."**, texto e botão **Recarregar**;
- console do navegador mostra `Erro capturado pelo ErrorBoundary: Error: Teste do ErrorBoundary`;
- `Tab` leva o foco ao botão com contorno visível; `Enter` recarrega a página (volta ao fallback — esperado, o `throw` continua lá);
- DevTools em **320px**: sem overflow horizontal.
Encerrar o servidor ao final.

- [ ] **Step 4: Reverter o patch e confirmar árvore limpa**

Run: `git checkout -- src/components/TelaInicial.js && git status --short`
Expected: somente `?? .vscode/`.

- [ ] **Step 5: Rebuild limpo (build/ não pode ficar com o throw)**

Run: `npm run build`
Expected: `Compiled successfully.`

### Task 8: Checklist de acessibilidade do fallback → **PARADA (Codex)**

**Files:** nenhum

- [ ] **Step 1: Checklist manual (substitui axe-core, indisponível no ambiente — Gate 7)**

Verificar no código e no build servido (repetir o servidor da Task 7 Step 3 **sem** o patch — para ver o fallback, reaplicar e reverter o patch como na Task 7, ou validar os itens estáticos direto no JSX):
- [ ] contêiner do fallback tem `role="alert"`;
- [ ] textos usam tokens/classes do tema (`txt-aviso`, `text-muted`, `btn-primary`) — contraste AA já garantido pelo design system do projeto;
- [ ] foco visível no botão (outline azul global de `:focus-visible`);
- [ ] ativação por teclado: `Tab` alcança, `Enter`/`Espaço` ativa;
- [ ] 320px sem overflow horizontal;
- [ ] sem animações no fallback (nada a fazer para `prefers-reduced-motion`).

- [ ] **Step 2: PARAR — pacote de revisão para o Codex**

Reportar: outputs da Task 6 Step 3, evidência da Task 7 (descrição/prints do fallback, console, 320px), checklist acima preenchido, `git log --oneline -3`, `git status --short`. O Codex pode rodar o axe do ambiente dele se quiser (não é pré-requisito do plano). **Não fazer push. Etapa 3 só com OK explícito + tempo disponível.**

---

# ETAPA 3 (CONDICIONAL) — Passo 14: passe de acessibilidade
**Pré-condições: OK do Codex nas Etapas 1 e 2 + tempo antes de 12/06. Se não houver, a rodada termina na Etapa 2.**

### Task 9: Anunciar a troca de turno (TelaPartida)

**Files:**
- Modify: `src/components/TelaPartida.js`

- [ ] **Step 1: Adicionar a live region de turno**

Em `src/components/TelaPartida.js`, logo abaixo do `<p className="visually-hidden" aria-live="polite">` existente (que anuncia o resultado parcial) e antes de `<BarraStatus`, inserir:
```jsx
      {/* Live region (Passo 14): anuncia a troca de turno a leitores de tela */}
      <p className="visually-hidden" aria-live="polite">
        Vez de {jogador.nome}.
      </p>
```
(O texto muda quando `estado.vezAtual` muda → o leitor anuncia o novo turno. Nenhuma mudança visual.)

- [ ] **Step 2: Testes e build**

Run: `CI=true npm test && npm run build`
Expected: `Tests: 36 passed, 36 total`; `Compiled successfully.`

- [ ] **Step 3: Commit**

```bash
git add src/components/TelaPartida.js
git commit -m "Anuncia a troca de turno para leitores de tela"
```

### Task 10: Frase por extenso no Tableau

**Files:**
- Modify: `src/components/Tableau.js`

- [ ] **Step 1: Reescrever `src/components/Tableau.js`**

Conteúdo completo do arquivo após a mudança:
```jsx
import React from 'react';
import { formatarNumero } from '../utils/jogo';

// Palavras faladas dos operadores (frase acessivel do tableau - Passo 14).
const PALAVRA_OP = {
  soma: 'mais',
  subtracao: 'menos',
  multiplicacao: 'vezes',
  divisao: 'dividido por',
};

// Frase por extenso da expressao para leitores de tela.
// Ex.: "Operação em construção: 2 mais 3 vezes 4 igual a 20."
function fraseExpressao(tableau, resultadoParcial) {
  const partes = tableau.map((item) =>
    item.tipo === 'numero' ? String(item.carta.valor) : PALAVRA_OP[item.carta.operador.id]
  );
  const pendente = tableau[tableau.length - 1].tipo === 'operador';
  const fim = pendente
    ? ', aguardando o próximo número'
    : ` igual a ${formatarNumero(resultadoParcial)}`;
  return `Operação em construção: ${partes.join(' ')}${fim}.`;
}

// Mostra a conta em construcao: numeros (mini-cartas) e operadores em sequencia,
// terminando com "= resultado parcial" (Passo 5). Lista com .map() + key.
// Passo 14: a frase oculta acima carrega a informacao completa; o bloco visual
// fica decorativo (aria-hidden) para o leitor nao ler a expressao duas vezes.
export default function Tableau({ tableau, resultadoParcial }) {
  return (
    <div className="tableau mb-3">
      {tableau.length === 0 ? (
        <span className="tableau__vazio">
          <i className="fas fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
          A conta aparece aqui conforme as cartas forem jogadas...
        </span>
      ) : (
        <>
          <span className="visually-hidden">{fraseExpressao(tableau, resultadoParcial)}</span>
          <div className="tableau__expressao" aria-hidden="true">
            {tableau.map((item) => (
              <span key={item.carta.id} className="tableau__item">
                {item.tipo === 'numero' ? (
                  <span className="mini-carta" style={{ '--cor-carta': item.carta.operador.cor }}>
                    {item.carta.valor}
                  </span>
                ) : (
                  <span className="tableau__operador" style={{ color: item.carta.operador.cor }}>
                    {item.carta.operador.simbolo}
                  </span>
                )}
              </span>
            ))}
            <span className="tableau__igual">=</span>
            <span className="tableau__resultado">{formatarNumero(resultadoParcial)}</span>
          </div>
        </>
      )}
    </div>
  );
}
```
Mudanças em relação ao atual: adiciona `PALAVRA_OP` + `fraseExpressao`, o `<span className="visually-hidden">` com a frase, e `aria-hidden="true"` no `div.tableau__expressao` (exceção consciente registrada no spec: a informação completa está na frase adjacente). O JSX visual interno fica **idêntico** ao atual.

- [ ] **Step 2: Testes e build**

Run: `CI=true npm test && npm run build`
Expected: `Tests: 36 passed, 36 total`; `Compiled successfully.`

- [ ] **Step 3: Commit**

```bash
git add src/components/Tableau.js
git commit -m "Adiciona frase por extenso da operacao no Tableau"
```

### Task 11: Agrupar a BarraStatus

**Files:**
- Modify: `src/components/BarraStatus.js`

- [ ] **Step 1: Adicionar role e rótulo ao contêiner**

Em `src/components/BarraStatus.js`, trocar:
```jsx
    <div className="barra-status__wrap mb-3">
```
por:
```jsx
    <div className="barra-status__wrap mb-3" role="group" aria-label="Status da partida">
```

- [ ] **Step 2: Testes e build**

Run: `CI=true npm test && npm run build`
Expected: `Tests: 36 passed, 36 total`; `Compiled successfully.`

- [ ] **Step 3: Commit**

```bash
git add src/components/BarraStatus.js
git commit -m "Agrupa a BarraStatus com role e rotulo acessiveis"
```

### Task 12: Verificação da Etapa 3 → **PARADA (Codex)**

**Files:** nenhum

- [ ] **Step 1: Nenhuma mudança visual**

Run: `npm start` → comparar tela da partida com o estado pré-Etapa 3 (ou screenshot): layout pixel-idêntico em desktop e 320px (as mudanças são só de árvore de acessibilidade).

- [ ] **Step 2: Roteiro VoiceOver (macOS, Cmd+F5)**

- iniciar partida com 2 jogadores → ao revelar e jogar uma carta, o leitor anuncia o resultado parcial **e** "Vez de {nome}" na troca;
- navegar até o tableau: lê "Operação em construção: … igual a …" (ou "aguardando o próximo número" se terminou em operador), sem ler as mini-cartas individualmente;
- navegar até a barra de status: anuncia o grupo "Status da partida".

- [ ] **Step 3: PARAR — pacote de revisão para o Codex**

Reportar: outputs de testes/build das Tasks 9–11, resultado do roteiro VoiceOver, `git log --oneline -6`, `git status --short` (só `?? .vscode/`). **Sem push** — push final das etapas 1+2+3 é decisão de Marcelo após teste manual.
