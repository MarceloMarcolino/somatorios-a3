"""Desenho vetorial (SVG) dos componentes do Somatórios — v0.2.

Tudo em milímetros (viewBox em mm). Usado por:
  * a folha de impressão das cartas (escala 1 = tamanho real 63 × 88 mm);
  * os diagramas do manual, da folha de venda e do guia (escala menor);
  * a exportação PNG para protótipo virtual (Dextrous / Screentop / Tabletopia).

Funções públicas (registradas como globais Jinja em gerar_kit.py):
  carta(valor, naipe, escala=1, deitada=False, sombra=False)
  verso(escala=1, deitada=False)
  marcador(lado='frente', diametro=64)
  sinal(naipe, tamanho_mm=6, cor=None, girar=0)      -> ícone inline do operador
  chip(naipe, tamanho_mm=7)                           -> quadradinho colorido com o sinal
  logo(altura_mm=14, cor='#14233b')                   -> marca "Somatórios" com os 4 sinais
"""
from __future__ import annotations

import itertools
from markupsafe import Markup

# ---------------------------------------------------------------- paleta ----
# Paleta escolhida por otimização para daltonismo (pior ΔE2000 = 17,2 entre
# visão normal, deuteranopia, protanopia e tritanopia; app = 6,6).
# Alterna luminosidade nos pares que o daltonismo confunde (+/− e ×/÷).
NAIPES = {
    'soma':          {'sinal': '+', 'nome': 'SOMA',          'cor': '#43a02a', 'claro': '#e3f3dd'},
    'subtracao':     {'sinal': '−', 'nome': 'SUBTRAÇÃO',     'cor': '#a51b1b', 'claro': '#f7dede'},
    'multiplicacao': {'sinal': '×', 'nome': 'MULTIPLICAÇÃO', 'cor': '#1d3a80', 'claro': '#dde4f5'},
    'divisao':       {'sinal': '÷', 'nome': 'DIVISÃO',       'cor': '#a774e0', 'claro': '#efe5fb'},
}
ORDEM_NAIPES = ['soma', 'subtracao', 'multiplicacao', 'divisao']
ALIAS = {'+': 'soma', '-': 'subtracao', '−': 'subtracao', 'x': 'multiplicacao', '×': 'multiplicacao',
         '/': 'divisao', '÷': 'divisao'}
TINTA = '#14233b'
TINTA_SUAVE = '#41506a'
FONTE = "'Fredoka', 'Segoe UI', sans-serif"

W, H = 63.0, 88.0          # carta pôquer
R = 3.5                    # raio do canto
INSET = 0.8                # margem branca até a linha de corte
FAIXA = 13.0               # largura das faixas laterais

_uid = itertools.count(1)


def _n(naipe: str) -> str:
    return ALIAS.get(naipe, naipe)


def _fmt(v: float) -> str:
    return f"{v:.3f}".rstrip('0').rstrip('.')


# -------------------------------------------------------------- sinais ------
def _sinal_shapes(naipe: str, cx: float, cy: float, s: float, cor: str, girar: float = 0) -> str:
    """Sinal geométrico (simétrico a 180°) centrado em (cx, cy), tamanho s (mm)."""
    naipe = _n(naipe)
    t = s * 0.24                          # espessura do traço
    def barra(rot):
        return (f'<rect x="{_fmt(cx - s/2)}" y="{_fmt(cy - t/2)}" width="{_fmt(s)}" height="{_fmt(t)}" '
                f'rx="{_fmt(t/2)}" transform="rotate({_fmt(rot)} {_fmt(cx)} {_fmt(cy)})"/>')
    if naipe == 'soma':
        corpo = barra(0) + barra(90)
    elif naipe == 'subtracao':
        corpo = barra(0)
    elif naipe == 'multiplicacao':
        s2 = s * 0.92
        t2 = t
        corpo = ''.join(
            f'<rect x="{_fmt(cx - s2/2)}" y="{_fmt(cy - t2/2)}" width="{_fmt(s2)}" height="{_fmt(t2)}" '
            f'rx="{_fmt(t2/2)}" transform="rotate({r} {_fmt(cx)} {_fmt(cy)})"/>' for r in (45, -45))
    else:  # divisao
        rp = t * 0.66
        d = s * 0.36
        corpo = (barra(0) + f'<circle cx="{_fmt(cx)}" cy="{_fmt(cy - d)}" r="{_fmt(rp)}"/>'
                 f'<circle cx="{_fmt(cx)}" cy="{_fmt(cy + d)}" r="{_fmt(rp)}"/>')
    return f'<g fill="{cor}" transform="rotate({_fmt(girar)} {_fmt(cx)} {_fmt(cy)})">{corpo}</g>'


def sinal(naipe: str, tamanho_mm: float = 6, cor: str | None = None, girar: float = 0) -> Markup:
    """Ícone inline (SVG) do operador, para usar no meio do texto."""
    n = _n(naipe)
    c = cor or NAIPES[n]['cor']
    s = tamanho_mm
    svg = (f'<svg class="sinal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {s} {s}" '
           f'width="{_fmt(s)}mm" height="{_fmt(s)}mm" aria-label="{NAIPES[n]["nome"].lower()}" role="img">'
           f'{_sinal_shapes(n, s/2, s/2, s*0.78, c, girar)}</svg>')
    return Markup(svg)


def chip(naipe: str, tamanho_mm: float = 7) -> Markup:
    """Quadrado arredondado na cor do naipe com o sinal branco."""
    n = _n(naipe)
    s = tamanho_mm
    svg = (f'<svg class="chip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {s} {s}" '
           f'width="{_fmt(s)}mm" height="{_fmt(s)}mm" role="img" aria-label="{NAIPES[n]["nome"].lower()}">'
           f'<rect width="{s}" height="{s}" rx="{_fmt(s*0.22)}" fill="{NAIPES[n]["cor"]}"/>'
           f'{_sinal_shapes(n, s/2, s/2, s*0.56, "#fff")}</svg>')
    return Markup(svg)


# --------------------------------------------------------------- carta ------
def _numero_txt(x, y, valor, tam, cor, peso=600, sublinhar=True, ancora='middle',
                sub_larg=0.42, sub_esp=0.075, sub_desl=0.42):
    out = (f'<text x="{_fmt(x)}" y="{_fmt(y)}" font-family="{FONTE}" font-weight="{peso}" '
           f'font-size="{_fmt(tam)}" fill="{cor}" text-anchor="{ancora}" dominant-baseline="central">{valor}</text>')
    if sublinhar and valor in (6, 9, '6', '9'):
        lw, lh = tam * sub_larg, max(tam * sub_esp, 0.45)
        out += (f'<rect x="{_fmt(x - lw/2)}" y="{_fmt(y + tam*sub_desl)}" width="{_fmt(lw)}" height="{_fmt(lh)}" '
                f'rx="{_fmt(lh/2)}" fill="{cor}"/>')
    return out


def _frente_conteudo(valor: int, naipe: str, economica: bool = False) -> str:
    n = _n(naipe)
    info = NAIPES[n]
    cor = info['cor']
    uid = next(_uid)
    x0, y0, w, h = INSET, INSET, W - 2*INSET, H - 2*INSET
    cor_faixa = info['claro'] if economica else cor
    cor_texto_faixa = cor if economica else '#ffffff'

    # faixa esquerda (índice + sinal pequeno + sinal grande girado); a direita é a mesma girada 180°
    fx = x0 + FAIXA / 2
    faixa = (
        _numero_txt(fx, y0 + 8.6, valor, 10.5, cor_texto_faixa, 600, sub_larg=0.34, sub_esp=0.06, sub_desl=0.48)
        + _sinal_shapes(n, fx, y0 + 21.0, 5.6, cor_texto_faixa)
        + _sinal_shapes(n, fx, H / 2, 9.6, cor_texto_faixa, girar=90)
    )
    partes = [
        f'<defs><clipPath id="cl{uid}"><rect x="{_fmt(x0)}" y="{_fmt(y0)}" width="{_fmt(w)}" height="{_fmt(h)}" rx="{R}"/></clipPath></defs>',
        f'<rect x="{_fmt(x0)}" y="{_fmt(y0)}" width="{_fmt(w)}" height="{_fmt(h)}" rx="{R}" fill="#fff"/>',
        f'<g clip-path="url(#cl{uid})">',
        f'<rect x="{_fmt(x0)}" y="{_fmt(y0)}" width="{FAIXA}" height="{_fmt(h)}" fill="{cor_faixa}"/>',
        f'<rect x="{_fmt(x0 + w - FAIXA)}" y="{_fmt(y0)}" width="{FAIXA}" height="{_fmt(h)}" fill="{cor_faixa}"/>',
        '</g>',
        f'<g id="fx{uid}">{faixa}</g>',
        f'<g transform="rotate(180 {_fmt(W/2)} {_fmt(H/2)})">{faixa}</g>',
        # número central
        _numero_txt(W / 2, H / 2 - 1.2, valor, 40, TINTA, 600),
        # nome do naipe (embaixo e, girado, em cima)
        f'<text x="{_fmt(W/2)}" y="{_fmt(y0 + h - 5.2)}" font-family="{FONTE}" font-weight="600" font-size="3.1" '
        f'letter-spacing="0.25" fill="{TINTA_SUAVE}" text-anchor="middle" dominant-baseline="central">{info["nome"]}</text>',
        f'<text x="{_fmt(W/2)}" y="{_fmt(y0 + 5.2)}" font-family="{FONTE}" font-weight="600" font-size="3.1" '
        f'letter-spacing="0.25" fill="{TINTA_SUAVE}" text-anchor="middle" dominant-baseline="central" '
        f'transform="rotate(180 {_fmt(W/2)} {_fmt(y0 + 5.2)})">{info["nome"]}</text>',
        # contorno fino na cor do naipe
        f'<rect x="{_fmt(x0)}" y="{_fmt(y0)}" width="{_fmt(w)}" height="{_fmt(h)}" rx="{R}" fill="none" '
        f'stroke="{cor}" stroke-width="0.5"/>',
    ]
    return ''.join(partes)


def _sigma(cx, cy, s, cor, sw):
    """Letra Σ desenhada (orientação neutra o bastante para o verso)."""
    pts = [(cx + s*0.42, cy - s*0.5), (cx - s*0.42, cy - s*0.5), (cx + s*0.08, cy),
           (cx - s*0.42, cy + s*0.5), (cx + s*0.42, cy + s*0.5)]
    d = 'M' + ' L'.join(f'{_fmt(x)} {_fmt(y)}' for x, y in pts)
    return (f'<path d="{d}" fill="none" stroke="{cor}" stroke-width="{_fmt(sw)}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def _verso_conteudo() -> str:
    uid = next(_uid)
    x0, y0, w, h = INSET, INSET, W - 2*INSET, H - 2*INSET
    cx, cy = W / 2, H / 2
    x1, y1 = x0 + w, y0 + h
    tri = {
        'soma':          f'{_fmt(x0)},{_fmt(y0)} {_fmt(x1)},{_fmt(y0)} {_fmt(cx)},{_fmt(cy)}',
        'divisao':       f'{_fmt(x1)},{_fmt(y0)} {_fmt(x1)},{_fmt(y1)} {_fmt(cx)},{_fmt(cy)}',
        'subtracao':     f'{_fmt(x1)},{_fmt(y1)} {_fmt(x0)},{_fmt(y1)} {_fmt(cx)},{_fmt(cy)}',
        'multiplicacao': f'{_fmt(x0)},{_fmt(y1)} {_fmt(x0)},{_fmt(y0)} {_fmt(cx)},{_fmt(cy)}',
    }
    pos = {'soma': (cx, y0 + 15), 'divisao': (x1 - 10.5, cy), 'subtracao': (cx, y1 - 15), 'multiplicacao': (x0 + 10.5, cy)}
    partes = [f'<defs><clipPath id="cv{uid}"><rect x="{_fmt(x0)}" y="{_fmt(y0)}" width="{_fmt(w)}" height="{_fmt(h)}" rx="{R}"/></clipPath></defs>',
              f'<g clip-path="url(#cv{uid})">']
    for n in ORDEM_NAIPES:
        partes.append(f'<polygon points="{tri[n]}" fill="{NAIPES[n]["cor"]}" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/>')
    partes.append('</g>')
    for n in ORDEM_NAIPES:
        px, py = pos[n]
        partes.append(_sinal_shapes(n, px, py, 8.5, '#fff'))
    partes += [
        f'<circle cx="{_fmt(cx)}" cy="{_fmt(cy)}" r="10.5" fill="#fff"/>',
        f'<circle cx="{_fmt(cx)}" cy="{_fmt(cy)}" r="8.9" fill="none" stroke="{TINTA}" stroke-width="0.5"/>',
        _sigma(cx, cy, 9.0, TINTA, 1.7),
        f'<rect x="{_fmt(x0)}" y="{_fmt(y0)}" width="{_fmt(w)}" height="{_fmt(h)}" rx="{R}" fill="none" stroke="#fff" stroke-width="0.9"/>',
    ]
    return ''.join(partes)


def _svg(conteudo: str, escala: float, deitada: bool, sombra: bool, classe: str, rotulo: str) -> Markup:
    if deitada:
        vw, vh = H, W
        inner = f'<g transform="translate({_fmt(H)} 0) rotate(90)">{conteudo}</g>'
    else:
        vw, vh = W, H
        inner = conteudo
    estilo = ' style="filter: drop-shadow(0 0.6mm 0.8mm rgba(20,35,59,.28))"' if sombra else ''
    return Markup(
        f'<svg class="{classe}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {_fmt(vw)} {_fmt(vh)}" '
        f'width="{_fmt(vw*escala)}mm" height="{_fmt(vh*escala)}mm" role="img" aria-label="{rotulo}"{estilo}>{inner}</svg>')


def carta(valor: int, naipe: str, escala: float = 1.0, deitada: bool = False, sombra: bool = False,
          economica: bool = False) -> Markup:
    n = _n(naipe)
    rot = f'carta {valor} de {NAIPES[n]["nome"].lower()}' + (' deitada' if deitada else '')
    return _svg(_frente_conteudo(int(valor), n, economica), escala, deitada, sombra, 'carta-svg', rot)


def verso(escala: float = 1.0, deitada: bool = False, sombra: bool = False) -> Markup:
    return _svg(_verso_conteudo(), escala, deitada, sombra, 'verso-svg', 'verso da carta')


# ------------------------------------------------------------ marcador ------
def _seta_circular(cx, cy, r, cor, sw):
    import math
    a0, a1 = math.radians(-60), math.radians(225)
    x0, y0 = cx + r*math.cos(a0), cy + r*math.sin(a0)
    x1, y1 = cx + r*math.cos(a1), cy + r*math.sin(a1)
    arco = (f'<path d="M{_fmt(x0)} {_fmt(y0)} A{_fmt(r)} {_fmt(r)} 0 1 1 {_fmt(x1)} {_fmt(y1)}" fill="none" '
            f'stroke="{cor}" stroke-width="{_fmt(sw)}" stroke-linecap="round"/>')
    # ponta da seta no fim do arco (sentido horário)
    ang = a1 + math.pi/2
    tip = (x1 + 0.2*sw*math.cos(ang), y1 + 0.2*sw*math.sin(ang))
    L = sw * 2.1
    p1 = (tip[0] - L*math.cos(ang - 0.55), tip[1] - L*math.sin(ang - 0.55))
    p2 = (tip[0] - L*math.cos(ang + 0.55), tip[1] - L*math.sin(ang + 0.55))
    ponta = (f'<path d="M{_fmt(p1[0])} {_fmt(p1[1])} L{_fmt(tip[0])} {_fmt(tip[1])} L{_fmt(p2[0])} {_fmt(p2[1])}" '
             f'fill="none" stroke="{cor}" stroke-width="{_fmt(sw)}" stroke-linecap="round" stroke-linejoin="round"/>')
    return arco + ponta


def marcador(lado: str = 'frente', diametro: float = 64) -> Markup:
    """Ficha redonda 'Início da rodada' (formato diferente das cartas, para não misturar)."""
    d = diametro
    c = d / 2
    k = d / 64.0
    azul, azul2 = '#1457a8', '#0f3f7a'
    if lado == 'frente':
        corpo = (
            f'<circle cx="{c}" cy="{c}" r="{_fmt(c - 0.3)}" fill="{azul2}"/>'
            f'<circle cx="{c}" cy="{c}" r="{_fmt(c - 2.2*k)}" fill="{azul}"/>'
            f'<circle cx="{c}" cy="{c}" r="{_fmt(c - 3.6*k)}" fill="none" stroke="#fff" stroke-width="{_fmt(0.5*k)}" stroke-dasharray="{_fmt(1.2*k)} {_fmt(1.2*k)}"/>'
            + _seta_circular(c, c - 7.5*k, 9.5*k, '#ffd591', 2.4*k)
            + f'<text x="{c}" y="{_fmt(c + 10*k)}" font-family="{FONTE}" font-weight="700" font-size="{_fmt(6.4*k)}" fill="#fff" text-anchor="middle">INÍCIO DA</text>'
            + f'<text x="{c}" y="{_fmt(c + 17.5*k)}" font-family="{FONTE}" font-weight="700" font-size="{_fmt(6.4*k)}" fill="#fff" text-anchor="middle">RODADA</text>'
            + f'<text x="{c}" y="{_fmt(c + 23.5*k)}" font-family="{FONTE}" font-weight="500" font-size="{_fmt(3.1*k)}" fill="#dce9f9" text-anchor="middle">2 ou 4 pessoas</text>'
        )
        rot = 'marcador Início da rodada, frente'
    else:
        linhas = [('Quem está com', 500), ('o marcador', 500), ('começa a rodada.', 600)]
        txt = ''.join(
            f'<text x="{c}" y="{_fmt(c - 15*k + i*5.6*k)}" font-family="{FONTE}" font-weight="{p}" font-size="{_fmt(4.3*k)}" '
            f'fill="{TINTA}" text-anchor="middle">{t}</text>' for i, (t, p) in enumerate(linhas))
        txt += (f'<text x="{c}" y="{_fmt(c + 6.5*k)}" font-family="{FONTE}" font-weight="500" font-size="{_fmt(3.6*k)}" '
                f'fill="{TINTA_SUAVE}" text-anchor="middle">Cada pessoa jogou 1 vez?</text>'
                f'<text x="{c}" y="{_fmt(c + 11.6*k)}" font-family="{FONTE}" font-weight="700" font-size="{_fmt(4.3*k)}" '
                f'fill="{azul2}" text-anchor="middle">Passe para a esquerda ↻</text>'
                f'<text x="{c}" y="{_fmt(c + 18.6*k)}" font-family="{FONTE}" font-weight="500" font-size="{_fmt(3.1*k)}" '
                f'fill="{TINTA_SUAVE}" text-anchor="middle">ABCD → BCDA → CDAB</text>')
        corpo = (f'<circle cx="{c}" cy="{c}" r="{_fmt(c - 0.3)}" fill="#fff" stroke="{azul2}" stroke-width="{_fmt(1.6*k)}"/>'
                 f'<circle cx="{c}" cy="{c}" r="{_fmt(c - 3.6*k)}" fill="#eef4fc"/>' + txt)
        rot = 'marcador Início da rodada, verso'
    return Markup(f'<svg class="marcador-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {d} {d}" '
                  f'width="{d}mm" height="{d}mm" role="img" aria-label="{rot}">{corpo}</svg>')


# ---------------------------------------------------------------- logo ------
def logo(altura_mm: float = 14, cor: str = TINTA, mostrar_chips: bool = True) -> Markup:
    """Marca 'Somatórios' + faixa de 4 sinais coloridos."""
    hgt = 20.0
    largura_txt = 78.0
    chips = ''
    if mostrar_chips:
        for i, n in enumerate(ORDEM_NAIPES):
            x = 81 + i * 9.6
            chips += (f'<rect x="{_fmt(x)}" y="5" width="8.4" height="8.4" rx="1.9" fill="{NAIPES[n]["cor"]}"/>'
                      + _sinal_shapes(n, x + 4.2, 9.2, 4.6, '#fff'))
    largura = 81 + (4 * 9.6 if mostrar_chips else 0)
    svg = (f'<svg class="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {_fmt(largura)} {hgt}" '
           f'height="{_fmt(altura_mm)}mm" width="{_fmt(altura_mm * largura / hgt)}mm" role="img" aria-label="Somatórios">'
           f'<text x="0" y="15.2" font-family="{FONTE}" font-weight="700" font-size="17.5" fill="{cor}" '
           f'textLength="{largura_txt}" lengthAdjust="spacingAndGlyphs">Somatórios</text>{chips}</svg>')
    return Markup(svg)


def todas_as_cartas():
    """Lista ordenada (naipe, valor) das 36 cartas."""
    return [(n, v) for n in ORDEM_NAIPES for v in range(1, 10)]
