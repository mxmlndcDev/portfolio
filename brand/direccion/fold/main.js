// Fold de prueba (G6): la cinta de trabajos con el sitio andando dentro de cada pantalla.
const RAIZ = '../../../';
const ESCENAS = RAIZ + 'assets/escenas/resultados/';
const MEDIA = RAIZ + 'media/';

// slug de escena, slug de media, nombre, ancho, bajada, descripción (solo la destacada)
const ESCRITORIO = [
  { escena: 'catalonia-celular', media: 'catalonia', nombre: 'Catalonia Sur', tipo: 'Reservas', ancho: '16vw', baja: '9vh' },
  { escena: 'delta-notebook', media: 'delta', nombre: 'Delta Charter', tipo: 'Concepto', ancho: '43vw', destacada: true,
    texto: 'Yates, helicóptero y avión privado con una sola empresa. La portada baja del cielo al agua mientras hacés scroll, con video hecho con IA y encadenado cuadro a cuadro.' },
  { escena: 'fredy-notebook', media: 'fredy', nombre: 'Fredy restobar', tipo: 'Cliente', ancho: '31vw', baja: '5vh' },
  { escena: 'peluqueria-celular', media: 'peluqueria', nombre: 'Peluquería canina', tipo: 'Concepto', ancho: '17vw', baja: '12vh' },
  { escena: 'evelia-notebook', media: 'evelia', nombre: 'Evelia', tipo: 'Concepto', ancho: '31vw' },
];
const CELULAR = [
  { escena: 'delta-celular', media: 'delta', nombre: 'Delta Charter', tipo: 'Concepto', ancho: '68vw', destacada: true,
    texto: 'Yates, helicóptero y avión privado con una sola empresa. La portada baja del cielo al agua mientras hacés scroll.' },
  { escena: 'fredy-celular', media: 'fredy', nombre: 'Fredy restobar', tipo: 'Cliente', ancho: '56vw', baja: '6vh' },
  { escena: 'catalonia-celular', media: 'catalonia', nombre: 'Catalonia Sur', tipo: 'Reservas', ancho: '56vw' },
];

const params = new URLSearchParams(location.search);
const html = document.documentElement;
if (params.get('captura')) html.classList.add('captura');
elegir(params.get('acento') || 'naranja');
document.querySelectorAll('[data-elegir]').forEach((b) => b.addEventListener('click', () => elegir(b.dataset.elegir)));
function elegir(a) {
  html.dataset.acento = a;
  document.querySelectorAll('[data-elegir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.elegir === a)));
}

const pantallas = await (await fetch(RAIZ + 'assets/escenas/pantallas.json')).json();
const cinta = document.querySelector('[data-cinta]');
const esCelular = matchMedia('(max-width: 760px)').matches;
const lista = esCelular ? CELULAR : ESCRITORIO;

for (const t of lista) {
  const tipo = t.escena.endsWith('notebook') ? 'notebook' : 'celular';
  const vista = tipo === 'notebook' ? 'desk' : 'mob';
  const el = document.createElement('article');
  el.className = 'tarjeta';
  el.dataset.tipo = tipo;
  el.style.setProperty('--ancho', t.ancho);
  if (t.baja) el.style.setProperty('--baja', t.baja);
  el.style.setProperty('--proporcion', tipo === 'notebook' ? '3 / 2' : '4 / 5');
  const pantalla = t.destacada
    ? `<video src="${MEDIA}${t.media}/${vista}-home.mp4" muted loop playsinline autoplay aria-hidden="true"></video>`
    : `<video poster="${MEDIA}${t.media}/${vista}-home-fold.png" aria-hidden="true"></video>`;
  el.innerHTML = `
    <div class="escena">
      <img src="${ESCENAS}${t.escena}.png" alt="">
      <div class="pantalla">${pantalla}</div>
    </div>
    <h3>${t.nombre}<span class="tipo">${t.tipo}</span></h3>
    ${t.texto ? `<p>${t.texto}</p>` : ''}`;
  cinta.append(el);
  const img = el.querySelector('img');
  const montar = () => encuadrar(el, img, pantallas[t.escena], tipo);
  img.complete ? montar() : img.addEventListener('load', montar);
  addEventListener('resize', montar);
}

// Recorta la escena para que la pantalla se lea grande, y monta el video sobre las cuatro esquinas.
function encuadrar(tarjeta, img, datos, tipo) {
  const caja = tarjeta.querySelector('.escena');
  const cw = caja.clientWidth, ch = caja.clientHeight;
  const iw = datos.ancho, ih = datos.alto;
  const q = datos.esquinas.map(([x, y]) => [x * iw, y * ih]);
  const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
  const bw = Math.max(...xs) - Math.min(...xs);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;

  const k = tipo === 'notebook' ? 0.6 : 0.42; // qué parte del ancho de la tarjeta ocupa la pantalla
  const s = Math.max((k * cw) / bw, cw / iw, ch / ih);
  const ox = Math.min(0, Math.max(cw - iw * s, cw / 2 - cx * s));
  const oy = Math.min(0, Math.max(ch - ih * s, ch / 2 - cy * s));
  img.style.width = iw + 'px';
  img.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;

  // Un 1,2 % más grande desde el centro, para que no quede un filo verde en el borde.
  const mx = q.reduce((a, p) => a + p[0], 0) / 4, my = q.reduce((a, p) => a + p[1], 0) / 4;
  const dst = q.map(([x, y]) => [(mx + (x - mx) * 1.012) * s + ox, (my + (y - my) * 1.012) * s + oy]);
  const lado = (a, b) => Math.hypot(dst[a][0] - dst[b][0], dst[a][1] - dst[b][1]);
  const W = 1000;
  const H = (W * (lado(1, 2) + lado(3, 0))) / (lado(0, 1) + lado(2, 3));
  const p = tarjeta.querySelector('.pantalla');
  p.style.width = W + 'px';
  p.style.height = H + 'px';
  p.style.transform = matriz([[0, 0], [W, 0], [W, H], [0, H]], dst);
}

// Homografía de un rectángulo a cuatro puntos, como matrix3d de CSS.
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
