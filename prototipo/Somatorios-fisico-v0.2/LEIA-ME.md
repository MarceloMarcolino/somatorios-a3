# Somatórios — Protótipo físico v0.2 (print-and-play)

Kit completo para **imprimir, montar, testar e inscrever** o Somatórios como jogo de cartas físico.
Gerado em 22/11/2026 a partir de **todo** o material do repositório: app React, `Somatoriás.txt`,
rascunho `Cartas.jpeg`, apresentação e documentos da A3, pasta `prototipo` (regulamento DOFF,
folhas de venda, vídeos, dicas) e Pós-Graduação em Gamificação.

> ⏰ **Prazo:** as inscrições da **Área Catarse de Protótipos — Diversão Offline 2027** vão **até 24/11/2026**.
> Veja o [checklist da inscrição](#checklist-da-inscrição-no-doff-2027-até-24112026) no fim deste arquivo.

---

## O que tem nesta pasta

| Arquivo | O que é | Como usar |
|---|---|---|
| `01_Cartas_e_Marcadores_A4.pdf` | 36 cartas (4 págs.), versos opcionais, 1 marcador **Início da rodada** (+ 1 reserva), cartas de ajuda **Sua vez** | Imprima em **100%**; recorte nas marcas |
| `02_Mesa_e_Folha_de_Registro_A4.pdf` | Mesa (A4 paisagem), Folha de registro e Placar da turma | Mesa numa capa plástica; registros: várias cópias |
| `03_Manual_de_Regras_A4.pdf` | Manual de regras (estrutura "Manual de Manual" do avaliador do DOFF) | Vai junto no upload do DOFF |
| `04_Folha_de_Venda_A4.pdf` | Folha de venda (*sell sheet*), 1 página | Upload do DOFF; repasse a editoras |
| `05_Guia_do_Professor_A4.pdf` | Plano de aula de 50 min, BNCC, avaliação, fundamentação | Escola, TCC, relatório |
| `06_Kit_de_Playtest_A4.pdf` | Protocolo, termos de autorização (LGPD), ficha de observação, questionário, registro de testes e, na pág. 6, experiência (PLEX), momento mágico e cooperação, conforme o curso de game design (6 págs.) | Teste com terceiros (exigido pelo DOFF) |
| `07_Roteiro_do_Video_Pitch_A4.pdf` | Roteiro narrado de ~3 min, com tempos e checklist | Gravação do vídeo do DOFF |
| `Inscricao_DOFF_Folha_de_Venda_e_Manual.pdf` | Folha de venda (pág. 1) + manual num único PDF | Só se o campo do formulário aceitar **um único arquivo** (prefira enviar `04` e `03` separados: o regulamento pede folha de venda de 1 página) |
| `png/` | 36 frentes, verso e marcador em PNG 300 dpi | Protótipo virtual (2ª fase do DOFF): Dextrous + Dustin's Designer Den, recomendados pelo curador (ou Screentop/Tabletopia) |
| `fonte/` | Gerador (Python + HTML/CSS), regras canônicas, fonte Fredoka (OFL), `config.json` | Para editar e regerar tudo |

**Campos em amarelo "PREENCHER"** nos PDFs = dados que só você pode decidir (autores, e-mail, links do
vídeo e do manual). Preencha `fonte/config.json` e regere (veja [Como regerar](#como-regerar-os-pdfs)).

---

## Como imprimir e montar (1–2 horas)

1. **Imprima em tamanho real / 100%** (nunca "Ajustar à página"). Confira a régua de **50 mm** no topo de cada página.
2. **Cartas** (`01`, págs. 1–4) — escolha uma opção:
   - **Rápida e durável (recomendada):** papel sulfite comum + *sleeves* padrão (66 × 91 mm) com **uma carta de outro
     jogo por trás** como suporte (Magic, Pokémon e similares têm 6,4 × 8,9 cm — a sua coleção tem vários). Dispensa o verso.
   - **Cartão:** papel 180–240 g/m² fosco. Para versos, imprima a pág. 5 **4 vezes**, frente e verso, virando pela
     borda longa — **teste o alinhamento numa folha** antes.
   - Recorte com régua e estilete (ou guilhotina) seguindo as marcas. Cantos arredondados (3,5 mm) são opcionais.
3. **Marcador** (pág. 6): recorte frente e verso, cole costas com costas sobre papelão. É **redondo de propósito**,
   para nunca se misturar às cartas.
4. **Cartas de ajuda** (pág. 7): imprima **2 vezes** (8 cartas: 5 + reservas), recorte, dobre na linha tracejada e cole.
5. **Mesa** (`02`, pág. 1): dentro de uma capa plástica, use caneta de quadro branco. **Folha de registro**: várias cópias.
6. **Economia de tinta:** em `fonte/config.json`, `"faixas_economicas": true` gera faixas claras em vez de cheias.

### Playtest zero — hoje, sem impressora

Pegue um **baralho comum** e separe **Ás a 9 dos 4 naipes = 36 cartas** (foi assim que o idealizador planejou a
primeira demonstração). Combine: **♥ = +, ♠ = −, ♦ = ×, ♣ = ÷**. O Ás vale 1. Carta em pé = número; deitada = sinal do naipe.
Anote objetivo e resultado parcial num papel.

---

## Regras em 30 segundos

Cada pessoa recebe 4 cartas, soma em silêncio e diz **só o total**; os totais somados formam o **objetivo**.
Na sua vez, jogue 1 carta — a ordem é sempre **número (carta em pé) → operador (carta deitada) → número…** — e compre 1 carta do monte de compra (se ainda houver).
Depois de cada número, façam a conta (**uma operação por vez, da esquerda para a direita**; ÷ não exata arredonda,
meio → para cima). **Vitória:** resultado parcial = objetivo logo após um número. **Derrota:** acabaram todas as cartas.
Com **2 ou 4 pessoas**, o **marcador Início da rodada** passa para a esquerda no fim de cada rodada.
Conversem sobre a conta, mas **não digam nem mostrem as cartas da mão**.

Texto completo e único: [`fonte/REGRAS_CANONICAS.md`](fonte/REGRAS_CANONICAS.md).

---

## Decisões de design (e por quê)

| Tema | Decisão na v0.2 | Por quê (evidência) |
|---|---|---|
| Nome | **Somatórios** | Grafia correta, usada no app, na apresentação e no repositório (o .txt dizia "Somatoriás") |
| Tamanho | **63 × 88 mm** (pôquer) | Mesma proporção da carta do app (0,717); *sleeves* padrão; o idealizador demonstrou com baralho de pôquer |
| Orientação do sinal | **Faixas laterais com o sinal girado 90°** + índices normais nos cantos | Requisito do idealizador: "operadores desenhados na vertical, pois o jogador deverá jogar a carta de lado". O − sem girar viraria "\|" |
| Sentido do giro | **"Deite para qualquer lado"** | Os 4 sinais são desenhados simétricos a 180° |
| 6 e 9 | **Sublinhados** | A carta gira na mesa e é vista do outro lado |
| Paleta | **+ verde `#43a02a` · − vermelho `#a51b1b` · × azul-marinho `#1d3a80` · ÷ lilás `#a774e0`** | Mesmas famílias de cor do app, mas com **luminosidade alternada** nos pares que o daltonismo confunde. Pior separação (CIEDE2000) entre visão normal, deuteranopia, protanopia e tritanopia: **17,2**, contra **6,6** do app e **9,7** do rascunho. Contraste com o sinal branco ≥ 3,3:1 (o rascunho tinha 1,3–2,4:1). Forma do sinal + nome por extenso continuam sendo o código principal |
| Verso | **4 triângulos do rascunho** (+ ÷ − ×) com **Σ** ao centro | Homenagem ao `Cartas.jpeg`, na paleta acessível |
| Objetivo | **Soma falada das mãos** | Design original e núcleo pedagógico (no app o cálculo é automático) |
| Divisão | **Arredondar ao inteiro mais próximo; meio → para cima** | Igual ao **app publicado** (commit `c24fffb`). Com frações, a vitória cai 4–8 pontos percentuais e aparecem frações em até 37–58% das partidas |
| Marcador | **Só com 2 ou 4 pessoas**, formato redondo | Sem ele, com número par, **100% das pessoas ficam presas a um só tipo de carta**; com ele, a vitória sobe 20–28 p.p. (simulação). Não existe no app |
| Monte acabou | **Guardar o marcador** e seguir em sentido horário | Mais simples de ensinar; só afeta o fim — **validar no playtest** |
| Conversa | **Mãos escondidas; conversa livre sobre a conta; proibido dizer/mostrar as próprias cartas** | Fiel a "sem falar quais são eles" (`Somatoriás.txt`) e ao diálogo cooperativo da pedagogia |
| Negativos e zero | **Permitidos** | Raros com jogo pensado (< 3% das partidas); "travar em zero" ensinaria conta errada |
| Idade / tempo | **8+** (Iniciante **6+ com um adulto**) · **10–20 min** | Contas de até 3–4 dígitos; mediana de 9–15 jogadas até vencer (simulação) — **confirmar no playtest** |
| Variante Iniciante | **Carta deitada vale + ou −** (36 cartas) | A versão "só + e − com 18 cartas" é inviável: vitória de 0–2% com 3–4 pessoas |
| Moeda "Próxima carta" e "Vez de jogar" (kit 0.1) | **Removidos** | Redundantes com a Mesa; o idealizador previu só o marcador "sem outra função" |

### Balanceamento (simulação Monte Carlo, 2.000–5.000 partidas por cenário)

| Pessoas | Objetivo médio | Vitória sem marcador | Vitória com marcador | Mediana de jogadas até vencer |
|---|---|---|---|---|
| 2 | 40 (18–63) | 65% | **91%** | 9 |
| 3 | 60 (34–85) | 89% | — | 11 |
| 4 | 80 (55–108) | 54% | **82%** | 13 |
| 5 | 100 (74–127) | 65% | — | 15 |

Política simulada: escolhas "gulosas" com mãos escondidas. Jogando **ao acaso** vence-se só **1–4%**: o jogo
premia o raciocínio. Os números servem para comparar variantes, não para prever pessoas reais — por isso o playtest.

---

## Diferenças em relação a…

**…ao kit 0.1** (`prototipo/Somatorios-fisico/`, gerado por outra ferramenta em 22/11, não testado — **não foi alterado**):
identidade visual do jogo (Fredoka, cores, verso de 4 triângulos) em vez de layout genérico; sinal girado em faixas
coloridas (no 0.1 o "−" girado parecia um "I" solto); índices nos dois cantos e 6/9 sublinhados; paleta acessível
medida; marcador redondo (no 0.1 tinha o tamanho das cartas); regra de conversa explícita; "deite para qualquer lado";
sem moeda e sem "Vez de jogar"; **mais** folha de venda, manual completo, roteiro de vídeo, kit de playtest, guia do
professor, PNGs para protótipo virtual e um gerador editável.

**…ao app React:** marcador de rodada, objetivo pela soma falada, carta física de dois usos, paleta acessível e verso.
A regra da divisão é a mesma do app **publicado**.
⚠️ A cópia local de `Somatorios-A3` está **14 commits atrás** do GitHub (`origin/main` = `c24fffb`): o código local
ainda gera frações. Antes de mexer no código, atualize (o `.gitattributes` local não versionado vai conflitar no `git pull`).

---

## Checklist da inscrição no DOFF 2027 (até 24/11/2026)

Regulamento: <https://diversaooffline.com.br/area-catarse-de-prototipos/> · Evento: 9–11/07/2027, Expo Center Norte (SP).

- [x] **Autoria:** Marcelo Antonio Pereira Marcolino · marcelo.marcolino.dev@gmail.com (já em `fonte/config.json`).
- [ ] Imprimir e montar o kit; fazer o **playtest zero**.
- [ ] **Teste com terceiros** (obrigatório, ao menos 1) usando `06_Kit_de_Playtest_A4.pdf`. Ideal: um grupo par e um ímpar.
- [ ] Gravar o **vídeo** (`07_Roteiro…`), em português e narrado, com até 3 min (máx. 5). Publicar no YouTube, horizontal (pode ser "não listado").
- [ ] Hospedar `Inscricao_DOFF_Folha_de_Venda_e_Manual.pdf` (folha + manual; ex.: link público do Google Drive) e colocar esse link em `url_manual` e o do vídeo em `url_video`, no `config.json`.
- [ ] Rodar `python gerar_kit.py` para gerar os **QR codes** reais e o PDF de inscrição atualizado.
      O PDF de inscrição traz um QR para o próprio link: **substitua o arquivo mantendo o mesmo link**
      (no Google Drive: botão direito → *Gerenciar versões* → *Enviar nova versão*).
- [ ] Formulário (exige login Google): tipo **Cartas**; título **Somatórios**; upload de `04_Folha_de_Venda_A4.pdf` (1 página) e
      `03_Manual_de_Regras_A4.pdf` como arquivos separados — ou, se o campo aceitar um só arquivo, `Inscricao_DOFF_Folha_de_Venda_e_Manual.pdf`;
      link do vídeo; no campo livre, os **testes feitos**, os **ajustes previstos até julho/2027** e os **coautores**.
- [ ] Pix de **R$ 45** + comprovante; aceitar o regulamento.

**Modelo para o campo livre do formulário** (troque os colchetes por dados **reais** dos testes):

> Somatórios é um jogo de cartas cooperativo e de cálculo mental para 2 a 5 pessoas (8+, 10–20 min). Protótipo v0.2:
> 36 cartas de dois usos (em pé = número, deitada = operador), marcador de rodada para 2 ou 4 pessoas, Mesa e Folha de
> registro. Testes: [N] sessões com [N] pessoas de fora do grupo ([idades]), [N] partidas, [N] vitórias, duração média
> de [X] min. Ajustes já feitos: [...]. Ajustes previstos até julho de 2027: [...]. A versão digital (app) foi um trabalho
> acadêmico e não foi publicada; esta inscrição é da versão física. Autor: Marcelo Antonio Pereira Marcolino.

---

## O que veio do curso de game design (CapyCat Games)

O curso "Game Design para RPG de Mesa, Card Game e Board Game" foi assistido por inteiro (4 lives, 5 avaliações de jogos
de alunos e 6 atividades). Os resumos e as transcrições são material de curso pago e **não ficam neste repositório
público**: estão na pasta da UC, em `Curso-Game-Design-CapyCat\`, versionada só no repositório privado de estudos.
O que já entrou no kit:

- **Folha de venda:** exemplo de **4 pessoas** no diagrama, mostrando quem joga cada carta ("Duda aposta no 7"), porque
  o professor cobra que o cooperativo **force dependência do outro**; destaque "Ninguém joga sozinho"; referências
  (Hanabi, The Mind, Regicide); "ideal 3–4".
- **Roteiro do vídeo:** ponto forte cooperativo com 3 ou mais pessoas, comemoração no **encaixe exato** (o momento
  mágico), título com "cálculo mental" e "apresentação".
- **Manual:** FAQ com "Posso passar a vez?", "As cartas jogadas voltam para o monte de compra?" e "E se alguém
  revelar uma carta sem querer?".
- **Playtest:** página 6, com experiência (PLEX), momento mágico, estimar ou chutar e cooperação com 2 pessoas
  contra 3 ou mais.
- **Documento-matriz** (`fonte/REGRAS_CANONICAS.md`, seção Proposta): pitch de 75 palavras (rubrica nível A),
  mecânica central, mecânicas adicionais, magic moment, experiência PLEX, componentes ativos e reativos, desejo, lacuna
  e um segundo exemplo canônico de 4 pessoas.
- **Para estudar depois da inscrição** (não muda regra agora): com 2 pessoas, o marcador faz quem deita o operador jogar
  também o número seguinte, o que deixa a partida menos interdependente. Vale observar no playtest e, se confirmado,
  pensar numa variante ou num exemplo de 3 pessoas na v0.3.
- [x] **Elegibilidade:** o jogo **não foi publicado** — o app web foi só um trabalho de faculdade (A3) e o que será
      inscrito é a versão física. Se quiser, mencione isso no campo livre do formulário.
- [ ] 2ª fase (se selecionado): protótipo virtual — use os PNGs de `png/` no Dextrous + Dustin's Designer Den (ou Screentop/Tabletopia).

---

## Como regerar os PDFs

Requisitos: Python 3 com `jinja2`, `pypdf` e `PyMuPDF`; Google Chrome ou Microsoft Edge. A biblioteca de QR (`segno`)
já está em `fonte/vendor/`.

```powershell
cd fonte
python gerar_kit.py              # tudo
python gerar_kit.py folha manual # só alguns (ids: cartas mesa manual folha professor playtest video png)
```

- Textos e regras: `fonte/REGRAS_CANONICAS.md` (fonte única) e `fonte/templates/*.html`.
- Desenho das cartas: `fonte/somatorios_svg.py`. Estilo: `fonte/estilo.css`. Prévias: `fonte/build/qa/` (gerado, fora do git).
- Análises que fundamentam as decisões: `fonte/analises/` (simulação Monte Carlo `simular.py` + `resultado.txt`,
  paleta para daltonismo `paleta.py`/`otimiza_paleta.py`, verificação automática do kit `verificar_kit.py`).
- Fonte tipográfica: Fredoka (SIL Open Font License, `fonte/fonts/OFL.txt`).

---

## Perguntas em aberto (decisão de vocês)

1. Links do vídeo e do manual: não estão no repositório (o RELATÓRIO da A3 ainda tem o campo de vídeo vazio). Os vídeos
   antigos (demo do app e demonstração com baralho de pôquer) servem de referência, mas o DOFF pede um vídeo narrado do
   **protótipo físico** — use o roteiro `07_…` e depois preencha `url_video` e `url_manual`.
2. A paleta acessível (que difere do app e do rascunho) está aprovada? O app deveria adotá-la também (heurística de consistência)?
3. Regra de conversa (sem citar as próprias cartas) e "guardar o marcador quando o monte acaba": aprovadas para o teste?
4. O QR da versão digital entra na folha de venda? Hoje fica desligado (`mostrar_versao_digital_na_folha`), porque o app tem regras diferentes (sem marcador, objetivo automático).
