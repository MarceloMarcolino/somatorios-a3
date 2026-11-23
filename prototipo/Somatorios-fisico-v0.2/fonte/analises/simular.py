# Simulacao Monte Carlo do Somatorios com as regras travadas do app
# (baralho 36, 4 cartas/jogador, objetivo = soma das cartas distribuidas,
#  numero->operador->numero, esquerda->direita, compra apos jogar,
#  vitoria so apos numero, derrota quando acabam todas as cartas).
# Variantes: politica (aberta / silenciosa / aleatoria), divisao (fracao / inteira), marcador de rodada.
import random, statistics
from fractions import Fraction

OPS = ['+', '-', 'x', '/']

def baralho():
    return [(v, op) for op in OPS for v in range(1, 10)]

def aplicar(r, op, v, div):
    if op == '+': return r + v
    if op == '-': return r - v
    if op == 'x': return r * v
    if div == 'inteira':
        q = abs(r) // v
        return q if r >= 0 else -q
    return Fraction(r) / v

def ordem(n, marcador, tam=400):
    seq = []; inicio = 0
    while len(seq) < tam:
        for k in range(n):
            seq.append((inicio + k) % n)
        if marcador and n % 2 == 0:
            inicio = (inicio + 1) % n
    return seq

def jogar(n, politica, div, marcador, rng):
    deck = baralho(); rng.shuffle(deck)
    maos = [[] for _ in range(n)]
    for _ in range(4):
        for j in range(n):
            maos[j].append(deck.pop())
    alvo = sum(v for m in maos for v, _ in m)
    seq = ordem(n, marcador)
    pos = 0
    r = None; pend = None; prox = 'num'
    turnos = 0; fr = False; neg = False; resto = False
    tipos = [set() for _ in range(n)]

    def proximo_com_cartas(p):
        for k in range(p, len(seq)):
            if maos[seq[k]]:
                return k
        return None

    while True:
        k = proximo_com_cartas(pos)
        if k is None:
            return dict(v=False, t=turnos, alvo=alvo, fr=fr, neg=neg, resto=resto, tipos=tipos)
        j = seq[k]; pos = k + 1
        mao = maos[j]
        if prox == 'num':
            cands = []
            for i, (v, op) in enumerate(mao):
                nr = Fraction(v) if r is None else aplicar(r, pend, v, div)
                cands.append((abs(nr - alvo), i, nr, v))
            if politica == 'aleatoria':
                _, i, nr, v = rng.choice(cands)
            else:
                cands.sort(key=lambda c: c[0]); _, i, nr, v = cands[0]
            if pend == '/' and div == 'inteira' and r % v != 0:
                resto = True
            mao.pop(i); r = nr; pend = None; prox = 'op'; tipos[j].add('num')
        else:
            if politica == 'aberta':
                # cooperacao aberta: o grupo combina o operador olhando a mao de quem joga o proximo numero
                k2 = proximo_com_cartas(pos)
                quem = seq[k2] if k2 is not None else j
                alvo_mao = [c for c in maos[quem]] if quem != j else [c for c in mao]
                best = None
                for i, (v, op) in enumerate(mao):
                    for idx2, (w, _) in enumerate(alvo_mao):
                        if quem == j and idx2 == i:
                            continue
                        d = abs(aplicar(r, op, w, div) - alvo)
                        if best is None or d < best[0]:
                            best = (d, i)
                if best is None:
                    best = (0, 0)
            elif politica == 'silenciosa':
                best = None
                for i, (v, op) in enumerate(mao):
                    exp = statistics.mean(float(abs(aplicar(r, op, w, div) - alvo)) for w in range(1, 10))
                    if best is None or exp < best[0]:
                        best = (exp, i)
            else:
                best = (0, rng.randrange(len(mao)))
            v, op = mao.pop(best[1]); pend = op; prox = 'num'; tipos[j].add('op')
        turnos += 1
        if deck:
            mao.append(deck.pop())
        if r is not None and Fraction(r).denominator != 1: fr = True
        if r is not None and r < 0: neg = True
        if prox == 'op' and r == alvo:
            return dict(v=True, t=turnos, alvo=alvo, fr=fr, neg=neg, resto=resto, tipos=tipos)
        if not deck and all(not m for m in maos):
            return dict(v=False, t=turnos, alvo=alvo, fr=fr, neg=neg, resto=resto, tipos=tipos)

def resumo(n, politica, div, marcador, N):
    rng = random.Random(1234 + 17 * n + (5 if marcador else 0))
    res = [jogar(n, politica, div, marcador, rng) for _ in range(N)]
    vit = [x for x in res if x['v']]
    tv = sorted(x['t'] for x in vit) or [0]
    longas = [x for x in res if x['t'] >= 2 * n]
    tot = sum(1 for x in longas for t in x['tipos'] if t)
    um = sum(1 for x in longas for t in x['tipos'] if len(t) == 1)
    return dict(wr=len(vit) / N, tmed=statistics.mean(tv), tp90=tv[int(0.9 * (len(tv) - 1))],
                alvo=statistics.mean(x['alvo'] for x in res), amin=min(x['alvo'] for x in res), amax=max(x['alvo'] for x in res),
                fr=sum(x['fr'] for x in res) / N, neg=sum(x['neg'] for x in res) / N, resto=sum(x['resto'] for x in res) / N,
                um=(um / tot if tot else 0))

if __name__ == '__main__':
    for pol in ['aberta', 'silenciosa', 'aleatoria']:
        for div in ['fracao', 'inteira']:
            for n in [2, 3, 4, 5, 6]:
                for marc in ([False, True] if n % 2 == 0 else [False]):
                    s = resumo(n, pol, div, marc, N=2000)
                    print(f"{pol:10s} div={div:7s} n={n} marcador={'sim' if marc else 'nao'} | vitoria={s['wr']*100:5.1f}% | "
                          f"turnos ate vencer med={s['tmed']:4.1f} p90={s['tp90']:2d} | alvo med={s['alvo']:5.1f} [{s['amin']}-{s['amax']}] | "
                          f"fracao={s['fr']*100:4.1f}% resto={s['resto']*100:4.1f}% negativo={s['neg']*100:4.1f}% | so-1-tipo={s['um']*100:5.1f}%", flush=True)
