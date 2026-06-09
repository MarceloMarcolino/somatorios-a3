# 📄 Relatório de Projeto — Somatórios (A3)

**UC:** Usabilidade, Desenvolvimento Web, Mobile e Jogos — USJT (2026/1)
**Squad:** 7823 — Bacharelado em Engenharia de Software
**Tema (ODS):** ODS 4 — Educação de Qualidade
**Repositório:** https://github.com/MarceloMarcolino/somatorios-a3 · **App ao vivo:** https://somatorios-a3.vercel.app · **Vídeo/evidências:** _<inserir link do drive/YouTube não listado>_

---

## 1. Integrantes e papéis

| Integrante | RA | Papel principal |
|---|---|---|
| Marcelo Antonio Pereira Marcolino | 824144456 | _<ex.: lógica do jogo / coordenação>_ |
| Matheus Henrique Vieira da Silva | 824136558 | _<ex.: componentes React>_ |
| Gustavo de Oliveira Nascimento | 824130662 | _<ex.: design/usabilidade>_ |
| Kauê Henrique Ganzarolli Da Silva | 824132179 | _<ex.: front-end/Bootstrap>_ |
| Thiago Jorge de Oliveira | 8251132451 | _<ex.: testes/QA>_ |
| Vinícius Fernandes Martins | 8251130989 | _<ex.: integração HTTP/Axios>_ |
| Rafael Daniel de Paula Fernandes | 825227892 | _<ex.: documentação/pitch>_ |

> Ajustem os papéis conforme o que cada um realmente fez.

---

## 2. Introdução e justificativa

O ensino das quatro operações matemáticas no Brasil ainda é predominantemente **individual e competitivo**, com resultados frágeis: segundo o **SAEB 2023** e o **PISA 2022**, apenas **27%** dos estudantes brasileiros atingem a proficiência mínima em matemática (contra **69%** da média da OCDE), e somente **16%** dos alunos do 9º ano apresentam aprendizado adequado. Esse cenário reforça a **matofobia** (ansiedade matemática).

O **Somatórios** propõe um caminho complementar: um **jogo de cartas digital cooperativo** que transforma o cálculo mental em atividade social, dialogada e lúdica, voltado a estudantes do **Ensino Fundamental I (6–10 anos)**.

---

## 3. Objetivo

Desenvolver uma aplicação web cooperativa em **React e Bootstrap** para a prática das quatro operações fundamentais por meio de um jogo de cartas, com alinhamento explícito à **BNCC**, à **ODS 4** da Agenda 2030 e a pelo menos **5 das 10 heurísticas de Jakob Nielsen**.

---

## 4. Fundamentação

- **Aprendizagem cooperativa:** metanálise de **David e Roger Johnson** (Univ. de Minnesota, 148+ estudos) mostra desempenho superior ao modelo competitivo; estudo da **PUC-SP (2021)** ("Tutoria entre Iguais") elevou o aproveitamento de **32% para 85%**.
- **Vygotsky — Zona de Desenvolvimento Proximal:** jogadores mais avançados verbalizam o raciocínio e ajudam os demais.
- **Alinhamento institucional:** Agenda 2030 — Metas **4.1** (aprendizagem relevante), **4.6** (conhecimento básico de matemática) e **4.7** (cooperação/cidadania); habilidades **BNCC** EF03MA04, EF03MA05, EF04MA03, EF04MA04, EF05MA07, EF05MA08.

---

## 5. Análise de concorrentes

| Produto | Modelo | Limitação principal | Vantagem do Somatórios |
|---|---|---|---|
| **24® Game** | cartas físicas, competitivo, meta fixa em 24 | competitivo, meta sempre 24, sem web multiplayer em PT-BR | cooperativo, meta dinâmica, 100% web, alinhado à BNCC/ODS 4 |
| **Matific** | plataforma adaptativa por IA, paga | individual, licenciamento institucional | interação social, gratuito, foco nas 4 operações |
| **Prodigy Math** | RPG freemium | individual, freemium (queixa na FTC), matemática vira barreira | cooperativo, sem freemium, sem coletar dados sensíveis de crianças |

---

## 6. Descrição do jogo (mecânica)

Baralho de **36 cartas** (1–9 em 4 naipes = operadores **+ − × ÷**). Partidas de **2 a 5 jogadores**, 4 cartas cada. O **valor objetivo** é a soma dos valores de todas as cartas distribuídas. Os jogadores se alternam jogando **número, operador, número…**, formando uma operação calculada da **esquerda para a direita**; cada carta pode ser usada como número (em pé) ou operador (deitada). **Vitória:** o resultado parcial bate o objetivo. **Derrota:** as cartas se esgotam antes.

**Telas:** Inicial (configuração + regras) · Partida (barra de status, tableau, mão, pass-and-play) · Fim de partida (vitória/derrota + dica + nova partida).

---

## 7. Arquitetura técnica

- **React 19** com **hooks** (`useState`, `useEffect`) — sem Redux (estado centralizado no hook `useSomatorios`).
- **12 componentes** funcionais (props, eventos, listas com `.map`/`key`).
- **Camadas:** lógica pura (`utils/`), estado/regras (`hooks/useSomatorios.js`), HTTP (`services/dicasClient.js` com **Axios**), telas e UI (`components/`).
- **Bootstrap 5** (grid responsivo) + **Font Awesome** (ícones).
- **Requisição HTTP:** `axios` busca `public/dicas.json` (dados simulados) no `useEffect` do `App`.
- Ambiente **NodeJS** (create-react-app, `npm`, `npx`).

---

## 8. Usabilidade — heurísticas de Nielsen aplicadas (7)

1. **Visibilidade do status do sistema** — barra com objetivo, resultado parcial, cartas restantes e a vez.
2. **Correspondência com o mundo real** — cartas, naipes como operadores, "deitar a carta".
3. **Controle e liberdade do usuário** — abandonar com confirmação; nova partida.
4. **Prevenção de erros** — só joga a carta no papel correto; confirmação de ações destrutivas.
5. **Reconhecimento em vez de memorização** — tableau visível; instrução do que jogar; regras sempre à mão.
6. **Estética e design minimalista** — interface limpa.
7. **Ajuda e documentação** — modal "Como jogar".

---

## 9. Aspectos legais e de acessibilidade
- **LGPD (Art. 14)** — dados de menores: o MVP **não coleta dados pessoais**; nicknames são opcionais e locais. Consentimento parental seria necessário em versões com persistência.
- **Acessibilidade** — alvo WCAG 2.1 AA: já há rótulos `aria`, navegação por teclado nas cartas e contraste de cores; cobertura completa fica para a próxima sprint.

---

## 10. Resultados e próximos passos
- **Entregue (MVP):** jogo cooperativo funcional, responsivo, com todos os requisitos técnicos do enunciado cumpridos.
- **Próximas sprints:** tela de estatísticas, entrada da soma secreta por jogador, multiplayer online, WCAG 2.1 AA completo.

---

## 11. Referências (NBR 6023)
- BRASIL. **Base Nacional Comum Curricular (BNCC)**. Brasília: MEC, 2018.
- INEP. **Relatório SAEB 2023**. Brasília, 2024.
- OCDE. **PISA 2022 Results**. Paris, 2023.
- JOHNSON, D. W.; JOHNSON, R. T. **Cooperative Learning**. Interaction Book Company, 2017.
- VYGOTSKY, L. S. **A formação social da mente**. São Paulo: Martins Fontes, 1989.
- NIELSEN, J. **10 Usability Heuristics for User Interface Design**. Nielsen Norman Group, 1994.
- REACT. **Documentation**. Disponível em: react.dev.
- BOOTSTRAP. **Documentation v5**. Disponível em: getbootstrap.com.
