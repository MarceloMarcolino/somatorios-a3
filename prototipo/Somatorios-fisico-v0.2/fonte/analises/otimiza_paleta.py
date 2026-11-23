# Busca paleta de 4 naipes mantendo familias de matiz (+ verde, - vermelho, x azul, ÷ roxo|ambar)
# restricao: contraste com branco >= 3.0 (simbolo branco sobre faixa colorida) e <= 16
# objetivo: maximizar o PIOR dE2000 entre pares, em normal/deutan/protan/tritan.
import itertools, math, random, sys
import numpy as np
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from paleta import hex2rgb, sim, to_lab, de2000, contraste, lin, delin

def lch_to_hex(L, C, h):
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    fy = (L + 16) / 116; fx = fy + a / 500; fz = fy - b / 200
    finv = lambda t: t ** 3 if t ** 3 > 216 / 24389 else (116 * t - 16) / (24389 / 27)
    X, Y, Z = finv(fx) * 0.95047, finv(fy), finv(fz) * 1.08883
    rgb_lin = np.array([[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]]) @ np.array([X, Y, Z])
    if np.any(rgb_lin < -0.001) or np.any(rgb_lin > 1.001):
        return None
    rgb = delin(np.clip(rgb_lin, 0, 1))
    return '#' + ''.join(f"{int(round(c * 255)):02x}" for c in rgb)

FAM = {
    '+': (125, 165), '-': (22, 42), 'x': (255, 290),
}
DIV = {'roxo': (295, 330), 'ambar': (55, 80), 'magenta': (340, 360)}

def cand(hr, n=600, rng=random.Random(3)):
    out = []
    while len(out) < n:
        h = rng.uniform(*hr); L = rng.uniform(25, 62); C = rng.uniform(30, 80)
        hx = lch_to_hex(L, C, h)
        if hx and 3.0 <= contraste(hx) <= 16:
            out.append(hx)
    return out

def score(p):
    worst = 1e9
    for kind in ['normal', 'deutan', 'protan', 'tritan']:
        labs = [to_lab(sim(hex2rgb(v), kind)) for v in p]
        for a, b in itertools.combinations(range(4), 2):
            worst = min(worst, de2000(labs[a], labs[b]))
    return worst

rng = random.Random(11)
pools = {k: cand(v, 250, rng) for k, v in FAM.items()}
for dn, dr in DIV.items():
    dpool = cand(dr, 250, rng)
    best = (0, None)
    for _ in range(25000):
        p = (rng.choice(pools['+']), rng.choice(pools['-']), rng.choice(pools['x']), rng.choice(dpool))
        s = score(p)
        if s > best[0]:
            best = (s, p)
    # refinamento local
    s0, p0 = best
    for _ in range(6000):
        i = rng.randrange(4)
        pool = [pools['+'], pools['-'], pools['x'], dpool][i]
        q = list(p0); q[i] = rng.choice(pool); q = tuple(q)
        s = score(q)
        if s > s0:
            s0, p0 = s, q
    print(f"÷ {dn:8s} pior dE00={s0:5.1f}  + {p0[0]}  - {p0[1]}  x {p0[2]}  ÷ {p0[3]}  | contraste c/ branco: " + ' '.join(f"{contraste(c):.2f}" for c in p0), flush=True)
