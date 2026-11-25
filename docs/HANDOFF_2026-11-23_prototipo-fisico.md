# Handoff — Protótipo físico do Somatórios (sessão de 22–23/11/2026)

> **Para Claude e Codex:** leia este arquivo inteiro antes de agir. Ele registra onde o trabalho parou, o que já foi
> decidido (e por quê), onde está cada arquivo e o que falta. As regras de trabalho do usuário estão em `AGENTS.md`.

---

## 1. Retome por aqui (TL;DR)

- **Objetivo atual:** inscrever o **protótipo físico v0.2** do Somatórios na **Área Catarse de Protótipos do Diversão
  Offline (DOFF) 2027** — inscrições **até 24/11/2026**. Também serve para escola/TCC (guia do professor).
- **Estado:** o kit print-and-play está **completo, revisado e verificado** (0 problemas bloqueantes na verificação
  automática). O curso de game design do usuário (Kiwify, CapyCat Games) foi **assistido por inteiro** e as lições
  aplicáveis já entraram no kit.
- **Só o usuário pode fazer (antes de 24/11):**
  1. Teste com pessoas de fora do grupo (exigido pelo DOFF) usando `prototipo/Somatorios-fisico-v0.2/06_Kit_de_Playtest_A4.pdf`.
     Sem impressora: baralho comum, Ás a 9 dos 4 naipes (♥ = +, ♠ = −, ♦ = ×, ♣ = ÷).
  2. Gravar o vídeo (≤ 3 min) pelo `07_Roteiro_do_Video_Pitch_A4.pdf` e publicar no YouTube (pode ser não listado).
  3. Preencher `url_video` em `prototipo/Somatorios-fisico-v0.2/fonte/config.json`; rodar `python gerar_kit.py` (gera o
     QR do vídeo; o único "PREENCHER" restante nos PDFs é esse link) e enviar ao GitHub. O `url_manual` já está
     preenchido (23/11): é o próprio `Inscricao_DOFF_Folha_de_Venda_e_Manual.pdf` neste repositório (link `blob/main`,
     que abre o PDF no navegador e não muda quando o arquivo é regerado). QR do manual lidos e conferidos.
  4. Formulário do DOFF (login Google) + Pix de R$ 45. Modelo do campo livre no `LEIA-ME.md` do kit.
- **Se o usuário voltar com dados do playtest:** registrar, ajustar regras **primeiro** em
  `prototipo/Somatorios-fisico-v0.2/fonte/REGRAS_CANONICAS.md`, depois os templates, depois `python gerar_kit.py`,
  depois `python analises/verificar_kit.py`.

---

## 2. Mapa: onde está cada coisa

### Neste repositório (público: github.com/MarceloMarcolino/somatorios-a3)

| Caminho | O que é |
|---|---|
| `prototipo/Somatorios-fisico-v0.2/` | **Kit v0.2 (o entregável).** PDFs 01–07, PDF de inscrição, `png/` (36 cartas + verso + marcador, 300 dpi), `LEIA-ME.md` |
| `prototipo/Somatorios-fisico-v0.2/fonte/` | Gerador: `gerar_kit.py` (Jinja2 → HTML → PDF via Chrome headless; PyMuPDF para PNG/QA), `somatorios_svg.py` (desenho das cartas), `estilo.css`, `templates/*.html`, `config.json`, `REGRAS_CANONICAS.md` (**fonte única da verdade**), `fonts/` (Fredoka, OFL), `vendor/segno` (QR) |
| `prototipo/Somatorios-fisico-v0.2/fonte/analises/` | Simulação Monte Carlo (`simular.py`, `resultado.txt`), paleta para daltonismo (`paleta.py`, `otimiza_paleta.py`), `verificar_kit.py` |
| `prototipo/Somatorios-fisico/` | **Kit 0.1 feito pelo Codex** em paralelo (22/11). Não é o entregável; mantido como histórico. **Não sobrescrever.** |
| `prototipo/*.url` | Atalhos públicos: regulamento/área do DOFF, formulário de inscrição 2027, aula de sell sheet (YouTube) |
| `docs/STATUS.md` | Roadmap do **app** React (jun/2026) + ponteiro para este handoff |
| `src/` | App React (A3 da USJT). Regras em `src/utils/baralho.js`, `src/utils/jogo.js`, `src/hooks/useSomatorios.js` |

### Fora deste repositório (não publicar)

| Onde (relativo à pasta da UC `…/USJT/UCs/Usabilidade, Desenvolvimento Web, Mobile e Jogos/`) | O que é | Versionado em |
|---|---|---|
| `Curso-Game-Design-CapyCat/` | Resumos das 15 aulas do curso pago (Módulos 1–4, Bônus 1–5, atividades), transcrições completas e o PDF da Atividade 1.1 (licenciado ao usuário) | repo **privado** `estudos-pos-e-tcc` |
| `Somatorios-pesquisa/` | Relatórios da leitura de todo o repositório (A–K), transcrições dos vídeos de exemplo do DOFF (`Assista!`, pitches), auditorias | repo **privado** `estudos-pos-e-tcc` |
| `Somatorios-A3/prototipo/Exemplos Vídeo & Folha de Vendas/` | Material do curador do DOFF (vídeos, 10 sell sheets de outros autores) — terceiros, 274 MB | não versionado (gitignore) |
| `tmp/pdfs/somatorios/` | Artefatos da sessão do Codex (scripts, transcrições antigas, modelo whisper base) | não versionado |
| `Cartas.jpeg`, `Somatoriás.txt`, `A3 Usabilidade.pptx/pdf`, pré-projeto | Rascunho original das cartas, mensagem do idealizador, apresentação da A3 | não versionado |

---

## 3. Como gerar e verificar o kit

```powershell
cd prototipo/Somatorios-fisico-v0.2/fonte
python gerar_kit.py                 # tudo; ou: python gerar_kit.py folha manual video playtest mesa professor cartas png
python analises/verificar_kit.py    # páginas, termos proibidos, PREENCHER, medidas dos espaços da Mesa
```

- Requisitos: Python 3 com `jinja2`, `pypdf`, `PyMuPDF` (`fitz`); Google Chrome ou Edge. No Windows do usuário o PyMuPDF
  está no *site-packages do usuário*: rode `python` **sem** `-I`.
- O gerador usa perfil temporário do Chrome (não interfere no Chrome aberto) e páginas nomeadas para misturar A4 retrato/paisagem.
- Prévias de cada página: `fonte/build/qa/` (gerado, fora do git). **Sempre olhe as páginas** depois de mudar template:
  cada `.pagina` tem altura fixa e conteúdo a mais é cortado em silêncio.
- O PDF de inscrição (folha + manual) é refeito sempre que `folha` ou `manual` é gerado.

---

## 4. Decisões de design (e por quê)

| Tema | Decisão | Evidência |
|---|---|---|
| Carta | 63 × 88 mm; faixas laterais com o sinal **girado 90°** (requisito do idealizador: "operadores na vertical"); índices nos 2 cantos; 6/9 sublinhados; "deite para qualquer lado" (sinais simétricos a 180°) | `Somatoriás.txt`; app |
| Paleta | + `#43a02a` · − `#a51b1b` · × `#1d3a80` · ÷ `#a774e0` | pior ΔE2000 sob daltonismo 17,2 (app 6,6; rascunho 9,7) — `analises/paleta.py` |
| Verso | 4 triângulos do rascunho `Cartas.jpeg` + Σ | homenagem ao idealizador |
| Objetivo | soma **falada** das mãos (cada um diz só o total) | design original; núcleo pedagógico |
| Divisão | arredonda ao inteiro mais próximo, meio para cima | igual ao app publicado (`c24fffb`) |
| Marcador "Início da rodada" | só 2 ou 4 pessoas; passa à esquerda; guardado quando o monte acaba | sem ele, com nº par, 100% das pessoas ficam presas a um papel; +20–28 p.p. de vitória (simulação) |
| Conversa | mãos escondidas; conversa livre sobre a conta; proibido dizer/mostrar as próprias cartas | "sem falar quais são eles" |
| Ficha | 2–5 pessoas (ideal 3–4) · 10–20 min · 8+ (Iniciante 6+ com um adulto) | simulação; **confirmar no playtest** |
| Exemplos canônicos | **2 pessoas** (Ana/Beto, objetivo 38) no manual e no vídeo; **4 pessoas** (Ana/Beto/Caio/Duda, objetivo 79) na folha de venda | o de 4 mostra a dependência entre pessoas (cobrança do curso) |
| Autoria | **Marcelo Antonio Pereira Marcolino**, marcelo.marcolino.dev@gmail.com; `grupo` vazio de propósito | decisão do usuário; o jogo nunca foi publicado (app = trabalho acadêmico) |

---

## 5. O que foi feito nesta sessão (22–23/11/2026)

1. **Leitura exaustiva** de todo o material (app, docs, zip, pasta `prototipo`, aulas da UC, Pós-Graduação em Gamificação)
   por 10 leitores + crítico (relatórios em `Somatorios-pesquisa/leitura-do-repositorio/`).
2. **Simulação Monte Carlo** das regras e **otimização da paleta** para daltonismo (`fonte/analises/`).
3. **Kit v0.2** gerado por código: cartas, marcadores, cartas de ajuda, Mesa, Folha de registro, Placar, manual, folha de
   venda, guia do professor, kit de playtest, roteiro do vídeo, PNGs. Duas rodadas de revisão independente por documento
   (regras/língua e visual/público) + auditoria de consistência entre documentos.
4. **Vídeos da pasta `prototipo`** transcritos localmente (ffmpeg 9 tem filtro `whisper`; modelo `ggml-large-v3-turbo-q5_0.bin`
   do Hugging Face, 547 MB, **não versionado**) e kit auditado contra a aula "Assista!" do curador do DOFF.
5. **Curso Kiwify** "Game Design para RPG de Mesa, Card Game e Board Game" (prof. Pedro Coimbra, CapyCat Games) assistido
   por inteiro: lives do YouTube pela transcrição + capturas de slides; vídeos hospedados na Kiwify por gravação de áudio
   no navegador (autorizada pelo usuário) + whisper; áudios apagados depois.
6. **Lições do curso aplicadas:** exemplo de 4 pessoas e destaque "Ninguém joga sozinho" na folha; referências
   (Hanabi, The Mind, Regicide); magic moment = **encaixe exato**; condição de vitória dita antes da partida no vídeo;
   FAQ (passar a vez, cartas jogadas, revelação sem querer); pág. 6 do playtest (PLEX, momento mágico, estimar × chutar,
   cooperação com 2 × 3+); seção **Proposta** em `REGRAS_CANONICAS.md` (pitch de 75 palavras, mecânica central, PLEX etc.).

---

## 6. Pendências e próximos passos

### Do usuário (DOFF, até 24/11/2026)
Ver §1. Checklist completo no `LEIA-ME.md` do kit.

### Para a v0.3 (depois da inscrição — não mudar regras antes do playtest)
- **2 pessoas e interdependência:** com 2 pessoas, o marcador faz quem deita o operador jogar também o número seguinte.
  Observar na pág. 6 do playtest; se confirmado, pensar numa variante ou num exemplo de 3 pessoas.
- Validar ficha técnica (tempo e idade) com dados reais; preencher a pág. 5 do kit de playtest (simulação × observado).
- Folha de venda com **foto real** do protótipo na mesa; versão em inglês depois do DOFF.
- **Protótipo virtual** (2ª fase do DOFF): importar `png/` no Dextrous e exportar para Dustin's Designer Den.
- Tema opcional "cofre cuja senha é o somatório" — só se entrar em componente/regra (o curso aceita abstrato assumido;
  meio-termo temático é pior).
- FAQ de automações esquecidas (esqueceu de comprar / de passar o marcador); revisar escrita em positivo.
- Avaliar Folha de registro opcional; cartas de ajuda em 63 × 88 (41 cartas cabem numa folha de 54).
- ~~App React: consistência com o físico~~ — **feito e publicado em 24/11/2026** (commit `64aaae9`): marcador Início
  da rodada (2 ou 4 jogadores), desenho das cartas do kit e paleta acessível. Revisado pelo Codex e testado pelo Marcelo.
  Spec: `docs/superpowers/specs/2026-11-24-marcador-e-cartas-fisicas-design.md`. Lógica do marcador em
  `src/utils/marcador.js`; desenhos em `src/components/CartaFisica.js` (mesma geometria de `fonte/somatorios_svg.py`:
  se mudar o desenho do kit, mude os dois). Ainda diferente do físico, por decisão: objetivo calculado pelo app e o
  termo "jogador".

---

## 7. Armadilhas conhecidas (para não repetir)

- **Kiwify:** o player avança sozinho para a próxima aula no fim do vídeo e o Chrome bloqueia um 2º download automático
  na mesma aba. Para gravar áudio: aba nova por vídeo, `captureStream()` + `MediaRecorder`, parar 0,6 s antes do fim.
  Não use o token de sessão nem a API da Kiwify (o controle de permissões bloqueia, com razão).
- **YouTube:** a saída do `javascript_tool` é truncada (~1000 caracteres). Para transcrições: abrir "Mostrar transcrição",
  montar o texto via JS num `<article>` e ler com `get_page_text`.
- **Whisper local:** `ffmpeg -i in -af "atempo=0.5,aresample=16000,whisper=model=ggml-large-v3-turbo-q5_0.bin:language=pt:queue=25:format=srt:destination=out.srt" -f null -`
  (`atempo=0.5` só para áudio gravado a 2×). ~45× tempo real nesta máquina.
- **Revisões em workflow:** passe revisões longas por **arquivo**, não embutidas e truncadas no prompt.
- **Git deste repo:** o `.gitattributes` local antigo foi guardado como `.gitattributes.local-2026-06` (ignorado). Não
  rodar `git add --renormalize .` (decisão do usuário). `CONTRIBUTING.md` e `.vscode/` locais **não** foram versionados
  (o `CONTRIBUTING.md` ainda aguarda revisão do Codex no fluxo gated).

---

## 8. Links

- Regulamento DOFF 2027: <https://diversaooffline.com.br/area-catarse-de-prototipos/> · evento 9–11/07/2027 (Expo Center Norte, SP)
- App (versão acadêmica): <https://somatorios-a3.vercel.app> · Repositório: <https://github.com/MarceloMarcolino/somatorios-a3>
