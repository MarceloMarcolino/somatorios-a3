# 📌 Status & Roadmap — Somatórios (A3)

> Documento de acompanhamento. Atualizado em **2026-06-09**.
> Apresentação da A3: **12/06/2026** (e **19/06/2026**).

## 🔗 Links
- **App ao vivo:** https://somatorios-a3.vercel.app
- **Repositório:** https://github.com/MarceloMarcolino/somatorios-a3
- **QR code** (para o slide de abertura): `Downloads/somatorios-a3-qrcode.png` (aponta para a URL ao vivo)

## 🧰 Stack & como rodar
- React 19 (hooks) · Bootstrap 5 · Axios · Font Awesome (CDN) · CRA (`react-scripts` 5).
- **Instalar:** `npm install` — o `.npmrc` já aplica `legacy-peer-deps` (React 19 + react-scripts 5).
- **Dev:** `npm start` · **Testes:** `CI=true npm test` (36 passando) · **Build:** `npm run build` (`homepage:"."`).
- **Deploy:** Vercel com **CI/CD** — todo `git push` na `main` re-deploya sozinho.

## ✅ Feito (sessão de 2026-06-08/09)
- **Passo 12 — Termômetro do objetivo** (`BarraStatus`): chip "Progresso" com "Faltam N" / "Passou N" + barra que enche. Decorativo p/ leitor de tela (só a trilha é `aria-hidden`; **sem** `role=progressbar` — a região `aria-live` da `TelaPartida` já anuncia o resultado). Aprovado (Codex + manual).
- **Entrega (Gates 1–3):**
  - **Gate 1:** `git init` (branch `main`), `.gitignore` (+ `.codex-*`), `homepage:"."` (paths relativos → funciona em raiz e subpath; corrige `dicas.json` em subpath/itch.io).
  - **Gate 1b:** commit inicial — identidade git **repo-local** `marcelo.marcolino.dev@gmail.com` (o git global tem typo `…@gmil.com`, **não** alterado); commits **sem** trailer de IA.
  - **Gate 2:** repositório **público** no GitHub + push.
  - **Gate 2b:** `.npmrc` (`legacy-peer-deps=true`) para o build da Vercel.
  - **Gate 3:** **deploy na Vercel** verificado (HTTP 200, assets `./static`, `dicas.json`) + **QR code** gerado.
- **RELATÓRIO — links:** preenchidos **repositório** + **app ao vivo** (campo de vídeo deixado para a squad).
- **Passo 13 — Recap da TelaFim:** medalhas de operadores (`+ − × ÷`) com contagem + pergunta reflexiva ("Conversem: qual operador ajudou mais?"); derrota com **"Boa tentativa!"** + linha gentil ("Faltaram/Passaram X… Da próxima…", **sem "Quase!"**); medalha de operador não usado atenuada **sem `opacity`** (contraste AA preservado). Aprovado (Codex) e **no ar**.
- **Histórico git:** `dd48231` (recap) → `b360a5e` (relatório) → `7b56166` (.npmrc) → `7603b26` (inicial).

## 🔄 Em andamento / aguardando
- **Passo 13:** aguardando o **teste manual final** do Marcelo (Codex já aprovou e já está no ar). Validar vitória/derrota no desktop e em **320px**.

## ⏳ A fazer (curto prazo — antes de 12/06)
1. **RELATÓRIO §1 (papéis):** a squad preencher quem fez o quê (placeholders `_<ex.: …>_`).
2. **RELATÓRIO — vídeo/evidência:** preencher o link quando gravarem a apresentação.
3. **RELATÓRIO §10:** atualizar "próximas sprints" — a tela de **estatísticas já existe**; citar **deploy/termômetro/recap** como entregues.
4. **Passe de acessibilidade (candidato a Passo 14):** `aria-live` "Vez de {nome}" na troca de turno (`PasseDispositivo`) + **Tableau semântico** (frase oculta "2 mais 3 vezes 4 igual a 20") + `role="group"` na `BarraStatus`. Markup aditivo, risco zero; reforça a nota de Usabilidade/IHC.
5. **ErrorBoundary:** componente de classe no topo para não dar **tela branca** na apresentação.

## 🔮 Futuro (fora de escopo por ora)
- **Dica sob demanda** in-game ("Pedir uma dica" sensível ao estado).
- **Juice:** destaque do operador pendente no Tableau + micro-animações (atrás de `prefers-reduced-motion`).
- **Profundidade de jogo:** níveis de dificuldade → soma secreta por jogador → tutorial. ⚠️ Toca nas **regras** — exige cuidado redobrado.
- **Redux:** o enunciado não exige; estado já centralizado em `useSomatorios`.
- **PWA/offline:** popular `public/manifest.json` (ícones) + service worker.
- **Engenharia:** GitHub Actions (CI); `.gitattributes` (`* text=auto eol=lf` p/ silenciar avisos LF/CRLF no Windows); testes de componente (hoje só há testes de lógica pura — `@testing-library/react` não instalado).

## ⚠️ Regras TRAVADAS (não alterar comportamento)
`src/utils/baralho.js`, `src/utils/jogo.js`, `src/hooks/useSomatorios.js` — baralho de 36 cartas; avaliação **esquerda→direita sem precedência**; **objetivo = soma de todas as cartas distribuídas**; vitória (`== objetivo`, tolerância `EPSILON`); derrota (cartas esgotadas); pass-and-play. Todo upgrade é **camada presentacional** que apenas **lê** o estado.

## 🛠️ Fluxo de trabalho (gated)
Claude implementa **um passo atômico** → **Codex** revisa/testa (`CI=true npm test` + `npm run build` + axe-core + 320–1440px + `prefers-reduced-motion`) → **Marcelo** testa manual → `git push` (CI/CD re-deploya) → próximo passo.
**Convenções de front-end:** alvos ≥48px; `letter-spacing:0` em títulos; `--acento` só decorativo (texto usa `--acento-ink`); sem overflow horizontal no mobile; foco visível; `aria-hidden` só no elemento **visual** (nunca em texto informativo); **sem `opacity`** que derrube o contraste de texto. **Commits sem** trailer `Co-Authored-By`.
