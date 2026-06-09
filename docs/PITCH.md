# 🎤 Roteiro de Pitch — Somatórios (A3 · Squad 7823)

**Duração-alvo:** 10–15 minutos · **Regra:** todos os 7 integrantes apresentam.
**Formato sugerido:** ~10 slides + demonstração ao vivo do jogo.

---

## ⏱️ Divisão por integrante (todos falam)

| # | Integrante | Bloco | Tempo |
|---|---|---|---|
| 1 | **Marcelo Antonio Pereira Marcolino** | Abertura + Problema (matofobia / dados SAEB-PISA) | ~1,5 min |
| 2 | **Matheus Henrique Vieira da Silva** | A solução: o que é o Somatórios e seu diferencial cooperativo | ~1,5 min |
| 3 | **Gustavo de Oliveira Nascimento** | Alinhamento ODS 4 + BNCC (por que educação) | ~1,5 min |
| 4 | **Kauê Henrique Ganzarolli Da Silva** | Demonstração ao vivo (parte 1): início e mecânica de turnos | ~2 min |
| 5 | **Thiago Jorge de Oliveira** | Demonstração ao vivo (parte 2): vitória/derrota + telas | ~2 min |
| 6 | **Vinícius Fernandes Martins** | Tecnologia: React (hooks, componentes), Bootstrap, Axios/HTTP | ~2 min |
| 7 | **Rafael Daniel de Paula Fernandes** | Heurísticas de Nielsen aplicadas + organização do grupo + encerramento | ~2 min |

> Reserve ~1 min de respiro/perguntas. Ensaiem ao menos 1× cronometrando.

---

## 🖼️ Roteiro slide a slide

**Slide 1 — Capa.** "Somatórios — jogo cooperativo para aprender as 4 operações". Nome da UC, Squad 7823, integrantes, ODS 4.

**Slide 2 — O problema.** Aprendizado de matemática no Brasil é frágil e individualista:
- SAEB 2023 / PISA 2022: só **27%** dos estudantes brasileiros atingem proficiência mínima em matemática (vs. **69%** da média OCDE); só **16%** dos alunos do 9º ano têm aprendizado adequado.
- A *matofobia* (ansiedade matemática) cresce no ensino tradicional, silencioso e competitivo.

**Slide 3 — A nossa solução.** Um **jogo de cartas digital cooperativo**: todos ganham ou perdem juntos. Três diferenciais:
1. mecânica **cooperativa** (não competitiva);
2. **valor objetivo emergente** das próprias cartas;
3. **operadores matemáticos como naipes** do baralho.

**Slide 4 — Por que funciona (fundamentação).** Aprendizagem cooperativa (metanálise de **Johnson & Johnson**, 148+ estudos) e a **Zona de Desenvolvimento Proximal de Vygotsky**; PUC-SP (2021): aproveitamento saltou de **32% para 85%** com método cooperativo.

**Slide 5 — Alinhamento ODS 4 + BNCC.** Metas **4.1, 4.6, 4.7** da Agenda 2030; habilidades BNCC dos anos iniciais (EF03MA04, EF04MA03, EF05MA07…).

**Slide 6 — Demonstração ao vivo.** (Kauê + Thiago) Mostrar: tela inicial → distribuir cartas → barra de status (objetivo) → jogar número/operador → resultado parcial → vitória coletiva. Mostrar também o modal de regras e o "abandonar".
> 💡 **Dica de demo:** use **2 jogadores** (objetivo menor, rodadas mais curtas). Como no modo pass-and-play quem apresenta enxerga todas as mãos, dá para **conduzir a partida até a vitória** com calma. Ensaiem uma sequência que fecha no objetivo para não depender de sorte ao vivo.

**Slide 7 — Tecnologia.** React 19 com **hooks** (`useState`, `useEffect`), **12 componentes** com props/eventos/listas, **Bootstrap** responsivo, **Axios** (requisição HTTP de dados simulados), ambiente **NodeJS/npm**. Código no **GitHub**.

**Slide 8 — Usabilidade (Nielsen).** Citar as 7 heurísticas aplicadas (ver `RELATORIO.md`), com 1 print de cada exemplo principal (barra de status; confirmação de abandono; tableau).

**Slide 9 — Organização do grupo.** Papéis: desenvolvimento (front/lógica), design/usabilidade, documentação, testes, apresentação. Uso de Kanban e GitHub.

**Slide 10 — Encerramento.** Resultados da Sprint 2, próximos passos (estatísticas, multiplayer, WCAG AA) e agradecimento.

---

## 🗣️ Frases-âncora (para não travar)
- "O Somatórios transforma a conta em **conversa**: as crianças calculam juntas, em voz alta."
- "Cada carta tem dois papéis — número ou operador — então a estratégia muda a cada jogada."
- "Não há um vencedor individual: ou o **grupo todo** acerta o objetivo, ou todos tentam de novo."
