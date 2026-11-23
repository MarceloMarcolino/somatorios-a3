# Avalia paletas de naipe: contraste WCAG contra branco e separacao (CIEDE2000)
# sob visao normal e simulacoes de daltonismo (Machado et al. 2009, severidade 1.0).
import itertools, math
import numpy as np

def hex2rgb(h):
    h = h.lstrip('#'); return np.array([int(h[i:i+2], 16) / 255 for i in (0, 2, 4)])

def lin(c): return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def delin(c): return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(np.clip(c, 0, 1), 1 / 2.4) - 0.055)

M = {
    'normal': np.eye(3),
    'protan': np.array([[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]]),
    'deutan': np.array([[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]]),
    'tritan': np.array([[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]),
}

def sim(rgb, kind):
    return delin(np.clip(M[kind] @ lin(rgb), 0, 1))

def to_lab(rgb):
    l = lin(rgb)
    X, Y, Z = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]) @ l
    xn, yn, zn = 0.95047, 1.0, 1.08883
    f = lambda t: t ** (1 / 3) if t > 216 / 24389 else (24389 / 27 * t + 16) / 116
    fx, fy, fz = f(X / xn), f(Y / yn), f(Z / zn)
    return np.array([116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)])

def de2000(l1, l2):
    L1, a1, b1 = l1; L2, a2, b2 = l2
    C1 = math.hypot(a1, b1); C2 = math.hypot(a2, b2); Cb = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360; h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dLp = L2 - L1; dCp = C2p - C1p
    dhp = 0 if C1p * C2p == 0 else (h2p - h1p if abs(h2p - h1p) <= 180 else (h2p - h1p - 360 if h2p > h1p else h2p - h1p + 360))
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dhp / 2))
    Lbp = (L1 + L2) / 2; Cbp = (C1p + C2p) / 2
    hbp = (h1p + h2p) / 2 if abs(h1p - h2p) <= 180 else ((h1p + h2p + 360) / 2 if h1p + h2p < 360 else (h1p + h2p - 360) / 2)
    T = 1 - 0.17 * math.cos(math.radians(hbp - 30)) + 0.24 * math.cos(math.radians(2 * hbp)) + 0.32 * math.cos(math.radians(3 * hbp + 6)) - 0.20 * math.cos(math.radians(4 * hbp - 63))
    dth = 30 * math.exp(-(((hbp - 275) / 25) ** 2))
    Rc = 2 * math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7))
    Sl = 1 + 0.015 * (Lbp - 50) ** 2 / math.sqrt(20 + (Lbp - 50) ** 2); Sc = 1 + 0.045 * Cbp; Sh = 1 + 0.015 * Cbp * T
    Rt = -math.sin(math.radians(2 * dth)) * Rc
    return math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))

def contraste(h, fundo='#ffffff'):
    def L(c): r, g, b = lin(hex2rgb(c)); return 0.2126 * r + 0.7152 * g + 0.0722 * b
    a, b = L(h), L(fundo); a, b = max(a, b), min(a, b); return (a + 0.05) / (b + 0.05)

PALETAS = {
    'app (baralho.js)':          {'+': '#2e7d32', '-': '#c62828', 'x': '#1565c0', '/': '#6a1b9a'},
    'app tokens CSS':            {'+': '#1b7f3b', '-': '#c62828', 'x': '#1457a8', '/': '#6a1b9a'},
    'rascunho (fundos)':         {'+': '#ff3131', '-': '#00bf63', 'x': '#1a0099', '/': '#ffde59'},
    'A: app, ÷ ambar':           {'+': '#2e7d32', '-': '#c62828', 'x': '#1565c0', '/': '#b26a00'},
    'B: + verde-azulado, ÷ ambar': {'+': '#00796b', '-': '#c62828', 'x': '#1565c0', '/': '#a35c00'},
    'C: + verde-azulado, ÷ roxo':  {'+': '#00796b', '-': '#c62828', 'x': '#1565c0', '/': '#7b1fa2'},
    'D: + verde-azulado, - vermelhao, x azul, ÷ ambar escuro': {'+': '#00796b', '-': '#d1361b', 'x': '#1450a3', '/': '#8f5a00'},
    'E: + verde, - vermelho, x azul-escuro, ÷ magenta': {'+': '#2e7d32', '-': '#c62828', 'x': '#0d47a1', '/': '#ad1457'},
    'F: + teal, - vermelho, x azul-escuro, ÷ ambar': {'+': '#00796b', '-': '#c62828', 'x': '#0d47a1', '/': '#a35c00'},
}

for nome, p in PALETAS.items():
    print(f"\n== {nome}  " + '  '.join(f"{k}{v}" for k, v in p.items()))
    print('   contraste vs branco: ' + '  '.join(f"{k}:{contraste(v):.2f}" for k, v in p.items()))
    piores = []
    for kind in ['normal', 'deutan', 'protan', 'tritan']:
        labs = {k: to_lab(sim(hex2rgb(v), kind)) for k, v in p.items()}
        pares = {f"{a}{b}": de2000(labs[a], labs[b]) for a, b in itertools.combinations(p, 2)}
        mn = min(pares, key=pares.get)
        piores.append(pares[mn])
        print(f"   {kind:7s} min dE00={pares[mn]:5.1f} ({mn})   " + ' '.join(f"{k}={v:4.1f}" for k, v in pares.items()))
    print(f"   >>> pior caso entre todos os tipos: {min(piores):.1f}")
