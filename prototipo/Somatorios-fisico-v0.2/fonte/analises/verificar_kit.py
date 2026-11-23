# Verificação final automática do kit Somatórios v0.2
import re, sys, fitz
from pathlib import Path

KIT = Path(__file__).resolve().parents[2]  # pasta Somatorios-fisico-v0.2
PT = 72 / 25.4
ESPERADO = {  # arquivo: (min pags, max pags)
    '01_Cartas_e_Marcadores_A4.pdf': (7, 7),
    '02_Mesa_e_Folha_de_Registro_A4.pdf': (3, 3),
    '03_Manual_de_Regras_A4.pdf': (4, 4),
    '04_Folha_de_Venda_A4.pdf': (1, 1),
    '05_Guia_do_Professor_A4.pdf': (3, 3),
    '06_Kit_de_Playtest_A4.pdf': (6, 6),
    '07_Roteiro_do_Video_Pitch_A4.pdf': (3, 3),
}
PROIBIDOS = [
    (r'\bjogador(?:a|es|as)?\b', 'use "pessoa(s)"'),
    (r'\bvalor[- ]alvo\b|\balvo\b', 'use "objetivo"'),
    (r'\bSomatori[aá]s\b|\bSomatorios\b', 'grafia: Somatórios'),
    (r'\binovador[a]?\b|\bincr[ií]vel\b|\brevolucion', 'adjetivo vazio'),
    (r'(?<=\d) ?[xX] ?(?=\d)', 'use × entre números'),
    (r'(?<=\d) - (?=\d)', 'use − (sinal de menos) entre números'),
    (r'(?<=\d) ?/ ?(?=\d)(?!\d{2,4}\b)', 'use ÷ (cuidado: datas são ok)'),
]
OBRIGATORIOS = {
    '03_Manual_de_Regras_A4.pdf': ['2–5', '10–20', '8+', '38', 'Início da rodada', 'objetivo', 'resultado parcial'],
    '04_Folha_de_Venda_A4.pdf': ['2–5', '10–20', '8+', '36 cartas', '63 × 88', 'cooperativ'],
}

def txt(doc):
    return '\n'.join(p.get_text() for p in doc)

def retangulos_carta(page, tol=1.2):
    achados = []
    for d in page.get_drawings():
        r = d.get('rect')
        if not r:
            continue
        w, h = r.width / PT, r.height / PT
        for alvo in [(63, 88), (88, 63)]:
            if abs(w - alvo[0]) <= tol and abs(h - alvo[1]) <= tol:
                achados.append((round(w, 1), round(h, 1)))
    return achados

problemas = 0
for nome, (mn, mx) in ESPERADO.items():
    f = KIT / nome
    if not f.exists():
        print(f'XX {nome}: NÃO EXISTE'); problemas += 1; continue
    d = fitz.open(f)
    tamanhos = sorted({f'{p.rect.width/PT:.0f}×{p.rect.height/PT:.0f}' for p in d})
    ok_pag = mn <= d.page_count <= mx
    t = txt(d)
    print(f"\n== {nome}: {d.page_count} pág. {'OK' if ok_pag else 'FORA DO ESPERADO'} | tamanhos {tamanhos} | {f.stat().st_size/1e6:.2f} MB")
    if not ok_pag: problemas += 1
    for pat, msg in PROIBIDOS:
        hits = sorted({m.group(0) for m in re.finditer(pat, t, flags=re.I)})
        if hits:
            ctx = []
            for m in list(re.finditer(pat, t, flags=re.I))[:4]:
                ctx.append(t[max(0, m.start()-35):m.end()+35].replace('\n', ' '))
            print(f'  ! {msg}: {hits} -> ' + ' | '.join(ctx))
    for termo in OBRIGATORIOS.get(nome, []):
        if termo.lower() not in t.lower():
            print(f'  ! faltando: "{termo}"'); problemas += 1
    print(f"  PREENCHER: {t.count('PREENCHER')} ocorrências")
    if nome.startswith('04_'):
        palavras = len(re.findall(r'[A-Za-zÀ-ÿ0-9]+', t.replace('PREENCHER', '')))
        print(f'  palavras (aprox., inclui rótulos): {palavras}')
    if nome.startswith('02_'):
        for i, p in enumerate(d, 1):
            r = retangulos_carta(p)
            if r: print(f'  pág. {i}: espaços de carta medidos {r}')
        if not any(retangulos_carta(p) for p in d):
            print('  ! não achei retângulos de 63×88/88×63 (pode ser borda tracejada desenhada por CSS — conferir visualmente)')
print(f'\nProblemas bloqueantes: {problemas}')


