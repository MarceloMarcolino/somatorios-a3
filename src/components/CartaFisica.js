import React, { useId } from 'react';
import { OPERADORES } from '../utils/baralho';

// ====== Desenho das cartas do protótipo físico v0.2 (SVG) ======
// Porta para React a mesma geometria de prototipo/Somatorios-fisico-v0.2/fonte/somatorios_svg.py:
// carta 63 × 88 mm, faixas laterais na cor do naipe com o índice, o sinal pequeno e o sinal grande
// girado 90° ("deite para qualquer lado"), número central, nome do naipe e 6/9 sublinhados.
// Tudo em milímetros no viewBox; o tamanho na tela vem do CSS.
// Os desenhos são decorativos (aria-hidden): quem usa o componente dá o rótulo acessível.

const W = 63;
const H = 88;
const R = 3.5; // raio do canto
const INSET = 0.8; // margem branca até a linha de corte (fica fora do viewBox recortado)
const FAIXA = 13; // largura das faixas laterais
const TINTA = '#14233b';
const TINTA_SUAVE = '#41506a';
const FONTE = "'Fredoka', 'Segoe UI', sans-serif";

const X0 = INSET;
const Y0 = INSET;
const LW = W - 2 * INSET; // 61,4
const LH = H - 2 * INSET; // 86,4

const POR_ID = Object.fromEntries(OPERADORES.map((op) => [op.id, op]));

// Sinal geométrico (simétrico a 180°) centrado em (cx, cy), tamanho s.
function Sinal({ naipe, cx, cy, s, cor, girar = 0 }) {
  const t = s * 0.24; // espessura do traço
  const barra = (rot, larg = s, chave = rot) => (
    <rect
      key={chave}
      x={cx - larg / 2}
      y={cy - t / 2}
      width={larg}
      height={t}
      rx={t / 2}
      transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined}
    />
  );
  let corpo;
  if (naipe === 'soma') corpo = [barra(0), barra(90)];
  else if (naipe === 'subtracao') corpo = [barra(0)];
  else if (naipe === 'multiplicacao') corpo = [barra(45, s * 0.92), barra(-45, s * 0.92)];
  else {
    const rp = t * 0.66;
    const d = s * 0.36;
    corpo = [
      barra(0),
      <circle key="c1" cx={cx} cy={cy - d} r={rp} />,
      <circle key="c2" cx={cx} cy={cy + d} r={rp} />,
    ];
  }
  return (
    <g fill={cor} transform={girar ? `rotate(${girar} ${cx} ${cy})` : undefined}>
      {corpo}
    </g>
  );
}

// Número em Fredoka; 6 e 9 ganham um traço embaixo para não confundir quando a carta gira.
function Numero({ x, y, valor, tam, cor, subLarg = 0.42, subEsp = 0.075, subDesl = 0.42 }) {
  const lw = tam * subLarg;
  const lh = Math.max(tam * subEsp, 0.45);
  return (
    <>
      <text
        x={x}
        y={y}
        fontFamily={FONTE}
        fontWeight="600"
        fontSize={tam}
        fill={cor}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {valor}
      </text>
      {(valor === 6 || valor === 9) && (
        <rect x={x - lw / 2} y={y + tam * subDesl} width={lw} height={lh} rx={lh / 2} fill={cor} />
      )}
    </>
  );
}

// Faixas com cantos externos arredondados (dispensa clipPath).
const FAIXA_ESQ =
  `M${X0 + R} ${Y0} H${X0 + FAIXA} V${Y0 + LH} H${X0 + R} ` +
  `A${R} ${R} 0 0 1 ${X0} ${Y0 + LH - R} V${Y0 + R} A${R} ${R} 0 0 1 ${X0 + R} ${Y0} Z`;
const FAIXA_DIR =
  `M${X0 + LW - FAIXA} ${Y0} H${X0 + LW - R} A${R} ${R} 0 0 1 ${X0 + LW} ${Y0 + R} ` +
  `V${Y0 + LH - R} A${R} ${R} 0 0 1 ${X0 + LW - R} ${Y0 + LH} H${X0 + LW - FAIXA} Z`;

// Contraste WCAG entre duas cores #rrggbb.
function luminancia(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
// Índice do canto (texto pequeno): branco quando passa de 4,5:1 sobre a faixa; senão, a tinta escura.
// Na paleta atual: branco no − e no ×; tinta no + (4,7:1) e no ÷ (4,7:1), onde o branco daria ~3,3:1.
// Os sinais continuam brancos: são elementos gráficos (≥ 3:1).
export const COR_INDICE = Object.fromEntries(
  OPERADORES.map((op) => [op.id, contraste('#ffffff', op.cor) >= 4.5 ? '#fff' : TINTA])
);

function conteudoFrente(valor, naipe) {
  const op = POR_ID[naipe];
  const cor = op.cor;
  const nome = op.nome.toUpperCase();
  const fx = X0 + FAIXA / 2;
  const faixa = (
    <>
      <Numero x={fx} y={Y0 + 8.6} valor={valor} tam={10.5} cor={COR_INDICE[naipe]} subLarg={0.34} subEsp={0.06} subDesl={0.48} />
      <Sinal naipe={naipe} cx={fx} cy={Y0 + 21} s={5.6} cor="#fff" />
      <Sinal naipe={naipe} cx={fx} cy={H / 2} s={9.6} cor="#fff" girar={90} />
    </>
  );
  const textoNaipe = {
    fontFamily: FONTE,
    fontWeight: '600',
    fontSize: 3.1,
    letterSpacing: 0.25,
    fill: TINTA_SUAVE,
    textAnchor: 'middle',
    dominantBaseline: 'central',
  };
  return (
    <>
      <rect x={X0} y={Y0} width={LW} height={LH} rx={R} fill="#fff" />
      <path d={FAIXA_ESQ} fill={cor} />
      <path d={FAIXA_DIR} fill={cor} />
      <g>{faixa}</g>
      <g transform={`rotate(180 ${W / 2} ${H / 2})`}>{faixa}</g>
      <Numero x={W / 2} y={H / 2 - 1.2} valor={valor} tam={40} cor={TINTA} />
      <text x={W / 2} y={Y0 + LH - 5.2} {...textoNaipe}>
        {nome}
      </text>
      <text x={W / 2} y={Y0 + 5.2} {...textoNaipe} transform={`rotate(180 ${W / 2} ${Y0 + 5.2})`}>
        {nome}
      </text>
      <rect x={X0} y={Y0} width={LW} height={LH} rx={R} fill="none" stroke={cor} strokeWidth="0.5" />
    </>
  );
}

// Envolve o conteúdo (desenhado em pé) num <svg>; "deitada" gira 90° no sentido horário.
// O viewBox recorta a margem de corte: a carta ocupa a caixa inteira.
function svgCarta(conteudo, deitada, className) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={deitada ? `${INSET} ${INSET} ${LH} ${LW}` : `${INSET} ${INSET} ${LW} ${LH}`}
      aria-hidden="true"
      focusable="false"
    >
      {deitada ? <g transform={`translate(${H} 0) rotate(90)`}>{conteudo}</g> : conteudo}
    </svg>
  );
}

// Frente da carta. naipe = id do operador ('soma' | 'subtracao' | 'multiplicacao' | 'divisao').
export function FrenteCarta({ valor, naipe, deitada = false, className = 'carta-fisica' }) {
  return svgCarta(conteudoFrente(valor, naipe), deitada, className);
}

// Verso: os 4 triângulos do rascunho original + Σ no centro.
export function VersoCarta({ deitada = false, className = 'carta-fisica' }) {
  const id = 'verso' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const cx = W / 2;
  const cy = H / 2;
  const x1 = X0 + LW;
  const y1 = Y0 + LH;
  const tri = {
    soma: `${X0},${Y0} ${x1},${Y0} ${cx},${cy}`,
    divisao: `${x1},${Y0} ${x1},${y1} ${cx},${cy}`,
    subtracao: `${x1},${y1} ${X0},${y1} ${cx},${cy}`,
    multiplicacao: `${X0},${y1} ${X0},${Y0} ${cx},${cy}`,
  };
  const pos = {
    soma: [cx, Y0 + 15],
    divisao: [x1 - 10.5, cy],
    subtracao: [cx, y1 - 15],
    multiplicacao: [X0 + 10.5, cy],
  };
  const s = 9;
  const sigma =
    `M${cx + s * 0.42} ${cy - s * 0.5} L${cx - s * 0.42} ${cy - s * 0.5} L${cx + s * 0.08} ${cy} ` +
    `L${cx - s * 0.42} ${cy + s * 0.5} L${cx + s * 0.42} ${cy + s * 0.5}`;
  const conteudo = (
    <>
      <defs>
        <clipPath id={id}>
          <rect x={X0} y={Y0} width={LW} height={LH} rx={R} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {OPERADORES.map((op) => (
          <polygon key={op.id} points={tri[op.id]} fill={op.cor} stroke="#fff" strokeWidth="1.1" strokeLinejoin="round" />
        ))}
      </g>
      {OPERADORES.map((op) => (
        <Sinal key={op.id} naipe={op.id} cx={pos[op.id][0]} cy={pos[op.id][1]} s={8.5} cor="#fff" />
      ))}
      <circle cx={cx} cy={cy} r="10.5" fill="#fff" />
      <circle cx={cx} cy={cy} r="8.9" fill="none" stroke={TINTA} strokeWidth="0.5" />
      <path d={sigma} fill="none" stroke={TINTA} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={X0} y={Y0} width={LW} height={LH} rx={R} fill="none" stroke="#fff" strokeWidth="0.9" />
    </>
  );
  return svgCarta(conteudo, deitada, className);
}

// Chip: quadrado arredondado na cor do naipe com o sinal branco (como nos diagramas do kit).
export function ChipOperador({ naipe, className = 'chip-operador' }) {
  const s = 7;
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${s} ${s}`} aria-hidden="true" focusable="false">
      <rect width={s} height={s} rx={s * 0.22} fill={POR_ID[naipe].cor} />
      <Sinal naipe={naipe} cx={s / 2} cy={s / 2} s={s * 0.56} cor="#fff" />
    </svg>
  );
}

// Ficha redonda "Início da rodada" (frente), como a do kit físico.
export function MarcadorRodada({ className = 'marcador-rodada' }) {
  const d = 64;
  const c = d / 2;
  // seta circular (sentido horário) acima do texto
  const r = 9.5;
  const sw = 2.4;
  const sx = c;
  const sy = c - 7.5;
  const a0 = (-60 * Math.PI) / 180;
  const a1 = (225 * Math.PI) / 180;
  const p0 = [sx + r * Math.cos(a0), sy + r * Math.sin(a0)];
  const p1 = [sx + r * Math.cos(a1), sy + r * Math.sin(a1)];
  const ang = a1 + Math.PI / 2;
  const tip = [p1[0] + 0.2 * sw * Math.cos(ang), p1[1] + 0.2 * sw * Math.sin(ang)];
  const L = sw * 2.1;
  const q1 = [tip[0] - L * Math.cos(ang - 0.55), tip[1] - L * Math.sin(ang - 0.55)];
  const q2 = [tip[0] - L * Math.cos(ang + 0.55), tip[1] - L * Math.sin(ang + 0.55)];
  const txt = { fontFamily: FONTE, textAnchor: 'middle' };
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${d} ${d}`} aria-hidden="true" focusable="false">
      <circle cx={c} cy={c} r={c - 0.3} fill="#0f3f7a" />
      <circle cx={c} cy={c} r={c - 2.2} fill="#1457a8" />
      <circle cx={c} cy={c} r={c - 3.6} fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="1.2 1.2" />
      <path d={`M${p0[0]} ${p0[1]} A${r} ${r} 0 1 1 ${p1[0]} ${p1[1]}`} fill="none" stroke="#ffd591" strokeWidth={sw} strokeLinecap="round" />
      <path
        d={`M${q1[0]} ${q1[1]} L${tip[0]} ${tip[1]} L${q2[0]} ${q2[1]}`}
        fill="none"
        stroke="#ffd591"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x={c} y={c + 10} {...txt} fontWeight="700" fontSize="6.4" fill="#fff">
        INÍCIO DA
      </text>
      <text x={c} y={c + 17.5} {...txt} fontWeight="700" fontSize="6.4" fill="#fff">
        RODADA
      </text>
      <text x={c} y={c + 23.5} {...txt} fontWeight="500" fontSize="3.1" fill="#dce9f9">
        2 ou 4 pessoas
      </text>
    </svg>
  );
}
