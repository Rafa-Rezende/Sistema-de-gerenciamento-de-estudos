"""Gera a marca do Rota de Estudos em SVG (texto convertido em contornos).

Precisa das fontes em marca/fonte/ (não vão para o git; licença OFL, Google Fonts):
Caveat 700 (Caveat.ttf) e Plus Jakarta Sans 600 (PlusJakartaSans.ttf).
Uso: pip install fonttools && python3 marca/gerar.py
Os PNGs (ícones do iPhone e do navegador) saem dos SVGs renderizados no navegador.
"""
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

AQUI = Path(__file__).parent
SAIDA = AQUI

PAPEL, PONTO, TINTA = "#FAF8F3", "#E4DFD3", "#24304A"
MENTA, LILAS, VERDE, PESSEGO = "#BFE3CB", "#A98FE3", "#7CC79B", "#F2A488"


def texto(fonte: str, s: str, tamanho: float, x: float, y: float, kern: float = 0) -> tuple[str, float]:
    """Contorno SVG de `s` com a linha de base em y; devolve (path d, largura)."""
    f = TTFont(AQUI / "fonte" / fonte)
    gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    esc = tamanho / f["head"].unitsPerEm
    partes, cx = [], x
    for ch in s:
        nome = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[nome].draw(TransformPen(pen, (esc, 0, 0, -esc, cx, y)))
        partes.append(pen.getCommands())
        cx += hmtx[nome][0] * esc + kern
    return " ".join(partes), cx - x - kern


def simbolo(sombra: bool = True, mono: str | None = None) -> str:
    """A rota: grade de pontos, marca-texto, traço de caneta, 3 paradas e a bandeira da entrega."""
    tinta = mono or TINTA
    pontos = "".join(
        f'<circle cx="{x}" cy="{y}" r="6" fill="{mono or PONTO}" opacity="{0.35 if mono else 1}"/>'
        for x in range(64, 449, 64) for y in range(64, 449, 64)
        if (x, y) not in {(128, 384), (256, 256), (384, 128), (384, 64)}
    )
    rota = "M128 384 C 224 384 160 256 256 256 C 352 256 288 128 384 128"
    marca_texto = "" if mono else f'<path d="{rota}" transform="translate(7 9)" fill="none" stroke="{MENTA}" stroke-width="58" stroke-linecap="round"/>'
    cores = [mono or LILAS, mono or VERDE, mono or PESSEGO]
    paradas = "".join(
        f'<circle cx="{x}" cy="{y}" r="27" fill="{c}" stroke="{tinta}" stroke-width="10"/>'
        for (x, y), c in zip([(128, 384), (256, 256)], cores)
    )
    bandeira = (
        f'<path d="M384 136 V 52" stroke="{tinta}" stroke-width="12" stroke-linecap="round"/>'
        f'<path d="M390 52 L 458 74 L 390 98 Z" fill="{cores[2]}" stroke="{tinta}" stroke-width="10" stroke-linejoin="round"/>'
        f'<circle cx="384" cy="136" r="14" fill="{tinta}"/>'
    )
    return (pontos + marca_texto
            + f'<path d="{rota}" fill="none" stroke="{tinta}" stroke-width="16" stroke-linecap="round"/>'
            + paradas + bandeira)


def icone(mono: str | None = None) -> str:
    fundo = "" if mono else f'<rect width="512" height="512" rx="112" fill="{PAPEL}"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Rota de Estudos">'
            f'{fundo}{simbolo(mono=mono)}</svg>')


def horizontal(cor_texto: str = TINTA, papel: bool = True) -> str:
    rota_d, w1 = texto("Caveat.ttf", "Rota", 210, 560, 300, kern=2)
    sub_d, w2 = texto("PlusJakartaSans.ttf", "de Estudos", 74, 572, 405, kern=1)
    largura = int(560 + max(w1, w2) + 60)
    fundo = f'<rect width="{largura}" height="512" rx="56" fill="{PAPEL}"/>' if papel else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {largura} 512" role="img" aria-label="Rota de Estudos">'
            f'{fundo}<g transform="translate(24 0)">{simbolo()}</g>'
            f'<path d="{rota_d}" fill="{cor_texto}"/><path d="{sub_d}" fill="{cor_texto}" opacity=".72"/></svg>')


def pequeno() -> str:
    """Para 16 a 48 px: sem pontilhado, traços grossos, a rota ocupando o quadro."""
    rota = "M112 400 C 236 400 152 256 256 256 C 360 256 276 112 400 112"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Rota de Estudos">'
            f'<rect width="512" height="512" rx="112" fill="{PAPEL}"/>'
            f'<path d="{rota}" transform="translate(10 12)" fill="none" stroke="{MENTA}" stroke-width="96" stroke-linecap="round"/>'
            f'<path d="{rota}" fill="none" stroke="{TINTA}" stroke-width="40" stroke-linecap="round"/>'
            f'<circle cx="112" cy="400" r="58" fill="{LILAS}" stroke="{TINTA}" stroke-width="24"/>'
            f'<circle cx="256" cy="256" r="50" fill="{VERDE}" stroke="{TINTA}" stroke-width="24"/>'
            f'<path d="M408 104 L 470 78 L 408 50 Z" fill="{PESSEGO}" stroke="{TINTA}" stroke-width="20" stroke-linejoin="round"/>'
            f'<path d="M400 120 V 44" stroke="{TINTA}" stroke-width="28" stroke-linecap="round"/></svg>')


(SAIDA / "rota-icone.svg").write_text(icone())
(SAIDA / "rota-favicon.svg").write_text(pequeno())
(SAIDA / "rota-icone-tinta.svg").write_text(icone(mono=TINTA))
(SAIDA / "rota-logo.svg").write_text(horizontal())
(SAIDA / "rota-logo-transparente.svg").write_text(horizontal(papel=False))
print(sorted(p.name for p in SAIDA.glob("*.svg")))
