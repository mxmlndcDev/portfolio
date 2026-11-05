"""Encuentra la pantalla verde de cada escena y monta adentro una captura del sitio.

Uso:  python3 tools/pantallas.py
Lee   assets/escenas/resultados/<trabajo>-<notebook|celular>.png
Saca  assets/escenas/pantallas.json  (las cuatro esquinas de cada pantalla, para montar el video en la web)
      assets/escenas/compuestas/<nombre>.jpg  (prueba con la captura del primer pantallazo)
"""
import json
from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
ESC = RAIZ / 'assets/escenas'
MEDIA = RAIZ / 'media'
(ESC / 'compuestas').mkdir(exist_ok=True)


def mascara_verde(img):
    b, g, r = [img[..., i].astype(int) for i in range(3)]
    m = (g > 120) & (g - np.maximum(r, b) > 70)
    m = m.astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    if n < 2:
        return None
    mayor = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    return (lab == mayor).astype(np.uint8) * 255


def esquinas(m):
    ys, xs = np.nonzero(m)
    pts = np.stack([xs, ys], 1)
    s, d = pts.sum(1), pts[:, 0] - pts[:, 1]
    # arriba-izq, arriba-der, abajo-der, abajo-izq (aproximadas)
    q = np.array([pts[s.argmin()], pts[d.argmax()], pts[s.argmax()], pts[d.argmin()]], np.float32)

    # Ajuste fino: una recta por lado con el borde del contorno, sin el tramo de las esquinas
    # (en el celular son redondeadas), y las esquinas como cruce de rectas.
    cont = max(cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0], key=cv2.contourArea)[:, 0, :].astype(np.float32)
    rectas = []
    for i in range(4):
        a, b = q[i], q[(i + 1) % 4]
        ab = b - a
        largo = np.linalg.norm(ab)
        t = ((cont - a) @ ab) / largo**2
        dist = np.abs(np.cross(ab, cont - a)) / largo
        sel = cont[(t > 0.18) & (t < 0.82) & (dist < largo * 0.08)]
        if len(sel) < 10:
            return q
        vx, vy, x0, y0 = cv2.fitLine(sel, cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
        rectas.append((np.array([x0, y0]), np.array([vx, vy])))
    out = []
    for i in range(4):
        (p1, d1), (p2, d2) = rectas[i - 1], rectas[i]
        A = np.array([d1, -d2]).T
        t1, _ = np.linalg.solve(A, p2 - p1)
        out.append(p1 + t1 * d1)
    return np.array(out, np.float32)


datos = {}
for f in sorted((ESC / 'resultados').glob('*-*.png')):
    nombre = f.stem
    trabajo, tipo = nombre.rsplit('-', 1)
    img = cv2.imread(str(f))
    h, w = img.shape[:2]
    m = mascara_verde(img)
    if m is None:
        print(f'{nombre:24} SIN PANTALLA VERDE')
        continue
    q = esquinas(m)
    area_quad = cv2.contourArea(q)
    relleno = m.sum() / 255 / max(area_quad, 1)
    verde = img[m > 0][:, 1]
    lados = [np.linalg.norm(q[i] - q[(i + 1) % 4]) for i in range(4)]
    proporcion = (lados[0] + lados[2]) / (lados[1] + lados[3])
    toca_borde = q[:, 0].min() < 3 or q[:, 1].min() < 3 or q[:, 0].max() > w - 4 or q[:, 1].max() > h - 4
    datos[nombre] = {
        'ancho': w, 'alto': h,
        'esquinas': [[round(float(x) / w, 5), round(float(y) / h, 5)] for x, y in q],
        'pantalla_pct': round(area_quad / (w * h) * 100, 1),
    }
    aviso = []
    if relleno < 0.93: aviso.append(f'algo tapa la pantalla o esquinas muy redondas ({relleno:.2f})')
    if verde.std() > 18: aviso.append(f'verde desparejo (desvío {verde.std():.0f})')
    if toca_borde: aviso.append('la pantalla toca el borde')
    esperada = 1.6 if tipo == 'notebook' else 0.46
    if abs(proporcion - esperada) / esperada > 0.25: aviso.append(f'proporción rara ({proporcion:.2f}, se espera {esperada})')
    print(f'{nombre:24} pantalla {datos[nombre]["pantalla_pct"]:5.1f}% · relleno {relleno:.2f} · prop {proporcion:.2f} · '
          + ('OK' if not aviso else ' / '.join(aviso)))

    # Prueba: la captura del primer pantallazo, deformada a la pantalla.
    vista = 'desk' if tipo == 'notebook' else 'mob'
    cap = cv2.imread(str(MEDIA / trabajo / f'{vista}-home-fold.png'))
    if cap is None:
        continue
    ch, cw = cap.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [cw, 0], [cw, ch], [0, ch]]), q)
    warp = cv2.warpPerspective(cap, M, (w, h), flags=cv2.INTER_AREA)
    alfa = cv2.GaussianBlur(cv2.dilate(m, np.ones((3, 3), np.uint8)), (3, 3), 0)[..., None] / 255
    comp = (warp * alfa + img * (1 - alfa)).astype(np.uint8)
    cv2.imwrite(str(ESC / 'compuestas' / f'{nombre}.jpg'), comp, [cv2.IMWRITE_JPEG_QUALITY, 88])

(ESC / 'pantallas.json').write_text(json.dumps(datos, indent=1))
