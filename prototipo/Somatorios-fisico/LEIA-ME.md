# Somatórios físico · Protótipo 0.1

Jogo cooperativo de cálculo para 2 a 5 pessoas. Cada carta mostra um número e um operador. O grupo alterna os dois usos para chegar à soma das mãos iniciais.

## Montagem

| Arquivo | O que imprimir |
|---|---|
| [Cartas e marcadores](Somatorios_Cartas_A4.pdf) | Páginas 1–4 para as 36 frentes e página 6 para os dois marcadores e as cinco ajudas de turno. A página 5 contém nove versos idênticos. Imprima quatro cópias se for colar os versos. |
| [Mesa de jogo](Somatorios_Mesa_A4.pdf) | Uma cópia em A4 paisagem. A régua impressa deve medir 50 mm. |
| [Guia de regras e teste](Somatorios_Guia_A4.pdf) | Uma cópia. As duas primeiras páginas ensinam o jogo. A terceira tem uma demonstração e uma ficha de teste que pode ser reimpressa. |

Use **A4, tamanho real (100%)**. Recorte as cartas de **63 × 88 mm** com a ajuda de uma régua. Para a montagem rápida, encaixe as frentes em 36 capas de tamanho pôquer com fundo opaco e use cartas comuns como suporte. Outra opção é colar os versos idênticos às frentes em papel firme. Separe lápis, borracha e uma moeda para indicar se a próxima carta vale como número ou operador.

A demonstração usa duas mãos preparadas que somam **32**. Em cinco jogadas, o grupo faz **7 ÷ 2 → 4** e depois **4 × 8 → 32**. Ela mostra o giro da carta, a reposição da mão, o arredondamento e a troca de quem começa a rodada.

## Origem das regras

| Fonte | O que determina para a mesa |
|---|---|
| [Rascunho Somatoriás](../../../Somatori%C3%A1s.txt) e [apresentação da A3](<../../../A3 Usabilidade.pdf>) | A pessoa anuncia a soma da mão inicial. A carta deitada vale como operador. O marcador muda o primeiro jogador a cada volta com 2 ou 4 pessoas. |
| [Arte das cartas no rascunho](../../../Cartas.jpeg) e [baralho do app](../../src/utils/baralho.js) | Nove cartas por naipe, valores de 1 a 9. As frentes conservam números em destaque e usam o verde, o vermelho, o azul e o roxo do app. Cada naipe também tem nome e símbolo. |
| [Fluxo de partida no app](../../src/hooks/useSomatorios.js) e [relatório da A3](../../docs/RELATORIO.md) | 2 a 5 pessoas, quatro cartas iniciais por pessoa, um turno por carta, uma compra se disponível, mãos vazias puladas, vitória após um número e derrota quando se esgotam a compra e todas as mãos. |
| [Revisão de divisão de 11/06](https://github.com/MarceloMarcolino/somatorios-a3/blob/c24fffbaa1f6b996754e63c43ceb5c9feddbc603/docs/superpowers/specs/2026-06-11-arredondamento-divisao-design.md) | O cálculo usa o resultado acumulado da esquerda para a direita. Em cada divisão, arredonda-se ao inteiro mais próximo. Em caso de empate, vale o maior inteiro, inclusive com resultado negativo. |

O ZIP e o checkout local ainda permitem frações. O commit remoto **c24fffb**, confirmado na referência pública, usa divisão arredondada e segue uma ordem fixa de assentos, pulando mãos vazias. A versão física combina o cálculo remoto com o marcador do rascunho e da apresentação. Com duas pessoas, isso produz **A B | B A | A B**. Com quatro, **A B C D | B C D A**. Assim, quem completou a primeira volta alterna de papel na segunda.

Para tornar esse procedimento aplicável até o fim, a rodada em uma mesa par percorre os assentos, incluindo os que ficaram sem cartas. A alternância número/operador avança a cada carta efetivamente jogada. Manter as mãos escondidas e discutir a estratégia em voz alta é a convenção deste protótipo. A mesa guarda o resultado a lápis e empilha as cartas já resolvidas para ocupar só uma folha A4. Uma folha de rascunho pode registrar a sequência completa.

## Materiais consultados

- **Código e histórico.** Revisão dos 24 arquivos de código e testes do checkout, da interface, dos arquivos públicos, das configurações, do histórico e da documentação da A3. Os planos e os commits posteriores esclarecem a diferença entre a apresentação e o que o aplicativo efetivamente executa. As 20 capturas locais mostram a evolução da interface em desktop e celular. Os mapas dos dois builds confirmam o fluxo e a regra de divisão das versões antigas. [Repositório público](https://github.com/MarceloMarcolino/somatorios-a3)
- **Arquivo compactado.** O ZIP contém 41.737 entradas, das quais 37.184 são arquivos. A integridade do ZIP passou na leitura. A comparação dos arquivos do projeto encontrou diferenças de interface e configuração, como a barra de status, a tela final, o CSS e o homepage. A pasta de prototipagem está no checkout. As 37.116 dependências empacotadas foram inventariadas, com a inspeção de código concentrada nos arquivos do jogo. [ZIP](../../../Somatorios-A3.zip)
- **Referências de prototipagem.** Consultei os dez exemplos de folhas de venda, os três documentos e os três vídeos locais, com quadros e transcrição automática. *Assista!* distingue folha de venda, vídeo demonstrativo e teste com o protótipo. Os pitches de *321* e *Neighborhoods* apresentam ações com componentes à vista. A demonstração do Somatórios segue essa ideia e mostra a mudança do resultado a cada operação. [Pasta de referências](<../Exemplos Vídeo & Folha de Vendas>)
- **Atalhos externos.** Conferi o regulamento público e o destino do formulário, cujo acesso retornou uma tela de autorização. A Kiwify apresentou o portal sem conteúdo de aula. A consulta ao YouTube confirmou o título e o canal da aula externa sobre folha de venda. [Aula especial de Tomás Queiroz](https://www.youtube.com/watch?v=XoEglwu0Azc)
- **Pós-graduação.** A consulta se concentrou nos capítulos sobre gamificação, aprendizagem ativa e colaborativa, no mapeamento de gamificação na educação e na revisão da unidade. O protótipo aplica as ideias de objetivo explícito, feedback a cada operação e discussão em grupo. A ficha observa onde o grupo pede ajuda e como explica a própria jogada. [Revisão da unidade de Gamificação](<../../../../../../Pós-Graduação/Gamificação - Conceito e Aplicação/Gamificação - conceito e aplicação/Revisão - Gamificação Conceito e Aplicação.md>)

## O que foi verificado

- Conferência de renderização das 10 páginas, dimensões A4, áreas de corte, encaixe das cartas e legibilidade do operador ao girar a carta.
- Verificação das 36 combinações e das jogadas da demonstração. Simulação de 1.000 partidas com 2 a 5 pessoas, usando as operações do código remoto, para conferir transição de turno, mãos vazias, vitória e esgotamento das cartas.
- Impressão, recorte e teste com um grupo presencial ficam para a primeira sessão. A ficha do guia registra duração, dificuldades de cálculo e de turno e dúvidas sobre a leitura das cartas.

### Referência do Diversão Offline 2027

A seção do regulamento com inscrições de **29/09 a 24/11/2026** pede protótipo funcional testado por terceiros, manual, folha de venda A4 de uma página e vídeo demonstrativo. O edital também menciona restrições a jogos já publicados. Como há uma versão web pública do Somatórios, é preciso confirmar com a organização como esse critério se aplica à adaptação física. [Área Catarse de Protótipos](https://diversaooffline.com.br/area-catarse-de-prototipos/)

