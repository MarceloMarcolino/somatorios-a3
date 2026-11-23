# AGENTS.md — Somatórios (instruções para Codex e Claude)

Projeto de **Marcelo Antonio Pereira Marcolino** (autor). Jogo de cartas **cooperativo** de cálculo mental: 36 cartas
(números 1–9 em 4 naipes que são os operadores + − × ÷); carta **em pé = número**, **deitada = operador**; o objetivo
é a soma das mãos. Há duas frentes neste repositório:

1. **App React** (`src/`) — trabalho acadêmico da A3 (USJT, 2026/1), no ar em <https://somatorios-a3.vercel.app>.
2. **Protótipo físico v0.2** (`prototipo/Somatorios-fisico-v0.2/`) — kit print-and-play para a Área Catarse de
   Protótipos do Diversão Offline 2027 (inscrição até **24/11/2026**).

## Comece por aqui

- **Onde o trabalho parou:** [`docs/HANDOFF_2026-11-23_prototipo-fisico.md`](docs/HANDOFF_2026-11-23_prototipo-fisico.md)
  (estado, mapa de arquivos, decisões, pendências, armadilhas). Leia antes de agir.
- **Regras do jogo (fonte única):** `prototipo/Somatorios-fisico-v0.2/fonte/REGRAS_CANONICAS.md`.
- **Kit físico, uso e impressão:** `prototipo/Somatorios-fisico-v0.2/LEIA-ME.md`.
- **Roadmap do app:** `docs/STATUS.md`.

## Regras de trabalho do usuário (obrigatórias)

- **Commits sem atribuição de IA:** nunca inclua `Co-Authored-By: Claude…` (nem equivalente do Codex) neste repositório.
  Identidade git repo-local: `marcelo.marcolino.dev@gmail.com`.
- **App React — fluxo gated:** um passo atômico por vez → revisão do Codex (`CI=true npm test`, `npm run build`,
  validação visual 320–1440 px, axe-core, `prefers-reduced-motion`) → teste manual do Marcelo → só então commit/push.
  O `git push` na `main` re-deploya sozinho na Vercel.
- **Regras do app travadas:** não altere o comportamento de `src/utils/baralho.js`, `src/utils/jogo.js` e
  `src/hooks/useSomatorios.js` sem pedido explícito. Upgrades de UI só leem o estado.
- **Convenções de front-end do app:** alvos de toque ≥ 48 px; `letter-spacing: 0` em títulos; cor de acento só
  decorativa (texto usa `--acento-ink`); sem overflow horizontal no mobile; foco visível; `aria-hidden` só em elementos
  puramente visuais; nada de `opacity` que derrube o contraste de texto; não use `role="progressbar"` se já houver
  `aria-live` anunciando o mesmo.
- **Kit físico:** toda mudança de regra vai **primeiro** em `REGRAS_CANONICAS.md`, depois nos templates
  (`fonte/templates/*.html`), depois `python gerar_kit.py`, depois `python analises/verificar_kit.py` — e **olhe as
  páginas geradas** (`fonte/build/qa/`). Termos fixos: "pessoa" (nunca "jogador"), "objetivo", "resultado parcial",
  "carta em pé", "carta deitada", "monte de compra", "marcador Início da rodada"; sinais − × ÷ tipográficos.
- **Não publique material de terceiros ou de curso pago** neste repositório público: a pasta
  `prototipo/Exemplos Vídeo & Folha de Vendas/` (gitignored) e os resumos/transcrições do curso (ficam fora, no repo
  privado `estudos-pos-e-tcc`).
- **Não sobrescreva** `prototipo/Somatorios-fisico/` (kit 0.1 do Codex, histórico).
- **Não rode** `git add --renormalize .` (decisão do usuário).
- Escreva em **português do Brasil**.
