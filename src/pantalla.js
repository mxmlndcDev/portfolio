// Monta el video sobre la pantalla de la escena: recorta la foto alrededor de la pantalla
// y deforma la caja del video con una homografía hasta que calce en las 4 esquinas.
export function encuadrar(caja, img, datos, tipo) {
  const cw = caja.offsetWidth, ch = caja.offsetHeight;
  const iw = datos.ancho, ih = datos.alto;
  const q = datos.esquinas.map(([x, y]) => [x * iw, y * ih]);
  const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
  const bw = Math.max(...xs) - Math.min(...xs);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const k = tipo === 'notebook' ? 0.6 : 0.42;
  const s = Math.max((k * cw) / bw, cw / iw, ch / ih);
  const ox = Math.min(0, Math.max(cw - iw * s, cw / 2 - cx * s));
  const oy = Math.min(0, Math.max(ch - ih * s, ch / 2 - cy * s));
  img.style.width = iw + 'px';
  img.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
  const mx = q.reduce((a, p) => a + p[0], 0) / 4, my = q.reduce((a, p) => a + p[1], 0) / 4;
  const dst = q.map(([x, y]) => [(mx + (x - mx) * 1.012) * s + ox, (my + (y - my) * 1.012) * s + oy]);
  const lado = (a, b) => Math.hypot(dst[a][0] - dst[b][0], dst[a][1] - dst[b][1]);
  const W = 1000;
  const H = (W * (lado(1, 2) + lado(3, 0))) / (lado(0, 1) + lado(2, 3));
  const p = caja.querySelector('.pantalla');
  p.style.width = W + 'px';
  p.style.height = H + 'px';
  p.style.transform = matriz([[0, 0], [W, 0], [W, H], [0, H]], dst);
}
function matriz(de, a) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = de[i], [u, v] = a[i];
    A.push([x, y, 1, 0, 0, 0, -x * u, -y * u]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -x * v, -y * v]); b.push(v);
  }
  const h = resolver(A, b);
  const m = [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1];
  return `matrix3d(${m.map((n) => n.toFixed(10)).join(',')})`;
}
function resolver(A, b) {
  const n = b.length, M = A.map((fila, i) => [...fila, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((fila, i) => fila[n] / fila[i]);
}
