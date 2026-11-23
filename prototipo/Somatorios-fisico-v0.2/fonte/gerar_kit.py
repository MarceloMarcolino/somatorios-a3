"""Gera o kit do protótipo físico do Somatórios (v0.2).

Uso (dentro da pasta fonte/):
    python gerar_kit.py              # gera tudo
    python gerar_kit.py manual cartas  # só alguns documentos (ids abaixo)
    python gerar_kit.py --sem-png    # pula a exportação PNG

Requisitos: Python 3 com jinja2, pypdf e PyMuPDF (fitz); Google Chrome ou Microsoft Edge.
QR codes: usa a biblioteca 'segno' (incluída em fonte/vendor). Sem URL no config.json,
o lugar do QR aparece marcado como PREENCHER.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
KIT = AQUI.parent
sys.path.insert(0, str(AQUI / 'vendor'))
sys.path.insert(0, str(AQUI))

from jinja2 import Environment, FileSystemLoader, select_autoescape  # noqa: E402
from markupsafe import Markup, escape  # noqa: E402

import somatorios_svg as S  # noqa: E402

BUILD = AQUI / 'build'
QA = BUILD / 'qa'

# id -> (template, pdf de saída, título)
DOCS = {
    'cartas':    ('cartas.html',         '01_Cartas_e_Marcadores_A4.pdf', 'Cartas e marcadores'),
    'mesa':      ('mesa.html',           '02_Mesa_e_Folha_de_Registro_A4.pdf', 'Mesa e Folha de registro'),
    'manual':    ('manual.html',         '03_Manual_de_Regras_A4.pdf', 'Manual de regras'),
    'folha':     ('folha_venda.html',    '04_Folha_de_Venda_A4.pdf', 'Folha de venda'),
    'professor': ('guia_professor.html', '05_Guia_do_Professor_A4.pdf', 'Guia do professor'),
    'playtest':  ('playtest.html',       '06_Kit_de_Playtest_A4.pdf', 'Kit de playtest'),
    'video':     ('roteiro_video.html',  '07_Roteiro_do_Video_Pitch_A4.pdf', 'Roteiro do vídeo pitch'),
    'png':       ('cartas_png.html',     None, 'Cartas individuais (PNG)'),
}


# ----------------------------------------------------------------- config --
def carregar_config() -> dict:
    cfg = json.loads((AQUI / 'config.json').read_text(encoding='utf-8'))
    cfg.setdefault('autores', [])
    return cfg


def preencher(rotulo: str) -> Markup:
    return Markup(f'<span class="preencher">PREENCHER: {escape(rotulo)}</span>')


def valor_ou_preencher(cfg: dict, chave: str, rotulo: str | None = None):
    v = cfg.get(chave)
    if isinstance(v, list):
        v = ', '.join(x for x in v if x)
    return escape(v) if v else preencher(rotulo or chave)


def autores(cfg: dict):
    nomes = [a for a in cfg.get('autores', []) if a and a.strip()]
    if not nomes:
        return preencher('autores (config.json → "autores")')
    if len(nomes) == 1:
        return escape(nomes[0])
    return escape(', '.join(nomes[:-1]) + ' e ' + nomes[-1])


def qr(url: str | None, tamanho_mm: float = 24, rotulo: str = '') -> Markup:
    """QR code em SVG (segno). Sem URL: caixa PREENCHER do mesmo tamanho."""
    s = tamanho_mm
    if url:
        try:
            import segno
            q = segno.make(url, error='m')
            svg = q.svg_inline(scale=1, border=2, dark='#14233b', light='#ffffff', omitsize=True)
            return Markup(f'<span class="qr" style="display:inline-block;width:{s}mm;height:{s}mm">{svg}</span>')
        except Exception as e:  # pragma: no cover
            print(f'  ! QR não gerado ({e}); usando caixa PREENCHER')
    return Markup(
        f'<span class="qr qr-vazio" style="display:inline-flex;align-items:center;justify-content:center;'
        f'width:{s}mm;height:{s}mm;border:0.4mm dashed #c79a00;background:#fff3a6;color:#6b4e00;'
        f'font-size:7pt;font-weight:600;text-align:center;line-height:1.12;padding:0.8mm;border-radius:1.5mm">'
        f'QR<br>PREENCHER<br>{escape(rotulo)}</span>')


# ------------------------------------------------------------------ jinja --
def ambiente(cfg: dict) -> Environment:
    env = Environment(loader=FileSystemLoader(str(AQUI / 'templates')),
                      autoescape=select_autoescape(['html']), trim_blocks=True, lstrip_blocks=True)
    env.globals.update(
        cfg=cfg, carta=S.carta, verso=S.verso, marcador=S.marcador, sinal=S.sinal, chip=S.chip, logo=S.logo,
        NAIPES=S.NAIPES, ORDEM_NAIPES=S.ORDEM_NAIPES, todas_as_cartas=S.todas_as_cartas,
        preencher=preencher, autores=autores(cfg), qr=qr,
        v=lambda chave, rotulo=None: valor_ou_preencher(cfg, chave, rotulo),
        economica=bool(cfg.get('faixas_economicas')),
    )
    return env


# ----------------------------------------------------------------- chrome --
def achar_navegador() -> str:
    candidatos = [
        os.environ.get('CHROME'),
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
        shutil.which('chrome'), shutil.which('google-chrome'), shutil.which('chromium'), shutil.which('msedge'),
    ]
    for c in candidatos:
        if c and Path(c).exists():
            return c
    raise SystemExit('Chrome/Edge não encontrado. Defina a variável de ambiente CHROME com o caminho.')


def imprimir_pdf(html: Path, pdf: Path, navegador: str, perfil: str) -> None:
    cmd = [navegador, '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
           f'--user-data-dir={perfil}', '--no-pdf-header-footer', '--run-all-compositor-stages-before-draw',
           '--virtual-time-budget=8000', '--allow-file-access-from-files',
           f'--print-to-pdf={pdf}', html.resolve().as_uri()]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    if not pdf.exists() or pdf.stat().st_size < 1000:
        raise RuntimeError(f'Falha ao imprimir {html.name}:\n{r.stderr[-2000:]}')


# -------------------------------------------------------------- pós-build --
def qa_render(pdf: Path, prefixo: str, dpi: int = 55) -> list[str]:
    import fitz
    QA.mkdir(parents=True, exist_ok=True)
    out = []
    with fitz.open(pdf) as d:
        for i, p in enumerate(d, 1):
            f = QA / f'{prefixo}-p{i}.png'
            p.get_pixmap(dpi=dpi).save(f)
            out.append(f'{f.name} ({p.rect.width/72*25.4:.0f}×{p.rect.height/72*25.4:.0f} mm)')
    return out


def exportar_png(pdf: Path) -> int:
    """Cada página de build/cartas_png.pdf vira um PNG 300 dpi em ../png/."""
    import fitz
    nomes = [f'carta_{n}_{v}' for n, v in S.todas_as_cartas()] + ['verso', 'marcador_frente', 'marcador_verso']
    destino = KIT / 'png'
    destino.mkdir(exist_ok=True)
    n = 0
    with fitz.open(pdf) as d:
        if d.page_count != len(nomes):
            print(f'  ! cartas_png.pdf tem {d.page_count} páginas; esperado {len(nomes)}')
        for p, nome in zip(d, nomes):
            p.get_pixmap(dpi=300, alpha=False).save(destino / f'{nome}.png')
            n += 1
    return n


def juntar_inscricao() -> Path | None:
    from pypdf import PdfWriter
    folha, manual = KIT / DOCS['folha'][1], KIT / DOCS['manual'][1]
    if not (folha.exists() and manual.exists()):
        return None
    w = PdfWriter()
    for f in (folha, manual):
        w.append(str(f))
    w.add_metadata({'/Title': 'Somatórios — Folha de venda e Manual de regras', '/Subject': 'Protótipo físico'})
    alvo = KIT / 'Inscricao_DOFF_Folha_de_Venda_e_Manual.pdf'
    with open(alvo, 'wb') as fh:
        w.write(fh)
    return alvo


# ------------------------------------------------------------------- main --
def main(argv: list[str]) -> int:
    sem_png = '--sem-png' in argv
    pedidos = [a for a in argv if not a.startswith('--')] or list(DOCS)
    desconhecidos = [p for p in pedidos if p not in DOCS]
    if desconhecidos:
        print('Ids desconhecidos:', desconhecidos, '| válidos:', list(DOCS))
        return 2
    if sem_png and 'png' in pedidos:
        pedidos.remove('png')

    cfg = carregar_config()
    env = ambiente(cfg)
    BUILD.mkdir(exist_ok=True)
    navegador = achar_navegador()
    perfil = tempfile.mkdtemp(prefix='somatorios-chrome-')
    gerados = []
    try:
        for doc in pedidos:
            tpl, saida, titulo = DOCS[doc]
            if not (AQUI / 'templates' / tpl).exists():
                print(f'- {doc}: template {tpl} ainda não existe (pulado)')
                continue
            html = BUILD / f'{doc}.html'
            html.write_text(env.get_template(tpl).render(titulo=titulo, doc=doc), encoding='utf-8')
            pdf = (KIT / saida) if saida else (BUILD / 'cartas_png.pdf')
            imprimir_pdf(html, pdf, navegador, perfil)
            if saida:
                paginas = qa_render(pdf, doc)
                print(f'+ {saida}: {len(paginas)} pág. -> ' + '; '.join(paginas))
                gerados.append(saida)
            else:
                n = exportar_png(pdf)
                print(f'+ png/: {n} imagens 300 dpi')
        # o PDF de inscrição (folha + manual) é refeito sempre que um dos dois for gerado
        if {'folha', 'manual'} & set(pedidos):
            try:
                insc = juntar_inscricao()
                if insc:
                    print(f'+ {insc.name}')
            except Exception as e:
                print(f'  ! não juntei o PDF de inscrição: {e}')
    finally:
        shutil.rmtree(perfil, ignore_errors=True)
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1:]))
