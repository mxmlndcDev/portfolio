// G7 · Movimiento: el fold con la cinta completa, arrastre, y la pantalla que se prende en el centro.
const RAIZ = '../../../';
const ESCENAS = RAIZ + 'assets/escenas/resultados/';
const MEDIA = RAIZ + 'media/';

// Los 8 trabajos. En escritorio alterna notebook y celular; en el celular, todos celular.
const TRABAJOS = [
  { slug: 'catalonia', nombre: 'Catalonia Sur', tipo: 'Concepto', escena: 'celular', ancho: '19vw', baja: '8vh',
    texto: 'Reservas directas con seña para dejar de pagarle comisión a Booking.' },
  { slug: 'delta', nombre: 'Delta Charter', tipo: 'Concepto', escena: 'notebook', ancho: '43vw',
    texto: 'Yates, helicóptero y avión privado con una sola empresa. La portada baja del cielo al agua mientras hacés scroll.' },
  { slug: 'fredy', nombre: 'Fredy restobar', tipo: 'Cliente', escena: 'notebook', ancho: '36vw', baja: '4vh',
    texto: 'Sitio en producción con carta y cotizador de bandejas. Lighthouse 98 / 100 / 100 / 100 en celular.' },
  { slug: 'peluqueria', nombre: 'Peluquería canina', tipo: 'Concepto', escena: 'notebook', ancho: '36vw',
    texto: 'Turnos por WhatsApp e ilustraciones 3D hechas con IA para cada corte.' },
  { slug: 'evelia', nombre: 'Evelia', tipo: 'Concepto', escena: 'celular', ancho: '19vw', baja: '10vh',
    texto: 'La ilustración de la casa de la abuela, animada por capas. Restaurante Michelin.' },
  { slug: 'petshop', nombre: 'Pet shop', tipo: 'Concepto', escena: 'notebook', ancho: '36vw', baja: '3vh',
    texto: 'El pedido se arma como una receta: dosis por kilo y un veterinario que lo revisa.' },
  { slug: 'end2end', nombre: 'END 2 END', tipo: 'Concepto · B2B', escena: 'celular', ancho: '19vw', baja: '7vh',
    texto: 'Bingo multiplayer para operadores. La agenda de la feria es un cartón de bingo.' },
  { slug: 'perro', nombre: 'Perro', tipo: 'Concepto', escena: 'notebook', ancho: '36vw',
    texto: 'Panchería con voz de fanzine punk. Dos cosas importan: el pan y la salchicha.' },
];

const html = document.documentElement;
const reducidoSistema = matchMedia('(prefers-reduced-motion: reduce)').matches;
let reducido = reducidoSistema;
const esCelular = matchMedia('(max-width: 760px)').matches;
const pantallas = await (await fetch(RAIZ + 'assets/escenas/pantallas.json')).json();
const cinta = document.querySelector('[data-cinta]');
const tarjetas = [];

for (const t of TRABAJOS) {
  const tipo = esCelular ? 'celular' : t.escena;
  const vista = tipo === 'notebook' ? 'desk' : 'mob';
  const clave = `${t.slug}-${tipo}`;
  const el = document.createElement('article');
  el.className = 'tarjeta';
  el.dataset.tipo = tipo;
  el.style.setProperty('--ancho', esCelular ? (tipo === 'notebook' ? '84vw' : '66vw') : t.ancho);
  if (t.baja && !esCelular) el.style.setProperty('--baja', t.baja);
  el.style.setProperty('--proporcion', tipo === 'notebook' ? '3 / 2' : '4 / 5');
  el.innerHTML = `
    <div class="escena">
      <img src="${ESCENAS}${clave}.png" alt="" draggable="false">
      <div class="pantalla"><video poster="${MEDIA}${t.slug}/${vista}-home-fold.png" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video></div>
    </div>
    <h3>${t.nombre}<span class="tipo">${t.tipo}</span></h3>
    <p>${t.texto}</p>`;
  cinta.append(el);
  const img = el.querySelector('img');
  const video = el.querySelector('video');
  video.dataset.src = `${MEDIA}${t.slug}/${vista}-home.mp4`;
  const montar = () => encuadrar(el, img, pantallas[clave], tipo);
  img.complete ? montar() : img.addEventListener('load', montar);
  tarjetas.push({ el, video, montar });
}
function puntas() {
  const a = tarjetas[0].el, z = tarjetas.at(-1).el;
  cinta.style.paddingLeft = Math.max(0, (cinta.clientWidth - a.offsetWidth) / 2) + 'px';
  cinta.style.paddingRight = Math.max(0, (cinta.clientWidth - z.offsetWidth) / 2) + 'px';
}
puntas();
addEventListener('resize', () => { puntas(); tarjetas.forEach((t) => t.montar()); });

// ---------- 1 y 2 · entrada ----------
function entrar() {
  html.classList.remove('entrar');
  void html.offsetWidth;
  requestAnimationFrame(() => html.classList.add('entrar'));
}
document.fonts.ready.then(entrar);
document.querySelector('[data-repetir]').addEventListener('click', entrar);

// ---------- 3 · la tarjeta del centro prende su pantalla ----------
let activa = null;
function buscarCentro() {
  const r = cinta.getBoundingClientRect();
  const centro = r.left + r.width / 2;
  let mejor = null, dist = Infinity;
  for (const t of tarjetas) {
    const b = t.el.getBoundingClientRect();
    const d = Math.abs(b.left + b.width / 2 - centro);
    if (d < dist) { dist = d; mejor = t; }
  }
  if (mejor === activa) return;
  if (activa) { activa.el.classList.remove('activa'); activa.video.pause(); }
  activa = mejor;
  activa.el.classList.add('activa');
  if (!reducido) {
    if (!activa.video.src) activa.video.src = activa.video.dataset.src;
    activa.video.play().catch(() => {});
  }
}
let pedido = false;
cinta.addEventListener('scroll', () => {
  if (pedido) return;
  pedido = true;
  requestAnimationFrame(() => { pedido = false; buscarCentro(); });
}, { passive: true });

// ---------- 4 · arrastre con inercia (mouse); en el celular es el scroll nativo ----------
let arrastre = null;
cinta.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  arrastre = { x: e.clientX, inicio: cinta.scrollLeft, v: 0, t: performance.now(), ultX: e.clientX, movio: false };
  cinta.setPointerCapture(e.pointerId);
});
cinta.addEventListener('pointermove', (e) => {
  if (!arrastre) return;
  const dx = e.clientX - arrastre.x;
  if (Math.abs(dx) > 4 && !arrastre.movio) { arrastre.movio = true; cinta.classList.add('arrastrando'); }
  if (!arrastre.movio) return;
  const ahora = performance.now();
  arrastre.v = (e.clientX - arrastre.ultX) / Math.max(ahora - arrastre.t, 1);
  arrastre.t = ahora; arrastre.ultX = e.clientX;
  cinta.scrollLeft = arrastre.inicio - dx;
});
const soltar = () => {
  if (!arrastre) return;
  const { v, movio } = arrastre;
  arrastre = null;
  if (!movio) return;
  // La inercia decide hacia dónde, y la cinta se acomoda en una tarjeta.
  const destino = cinta.scrollLeft - v * (reducido ? 0 : 320);
  cinta.classList.remove('arrastrando');
  irA(masCercana(destino), true);
};
cinta.addEventListener('pointerup', soltar);
cinta.addEventListener('pointercancel', soltar);

function masCercana(scroll) {
  const mitad = cinta.clientWidth / 2;
  let mejor = 0, dist = Infinity;
  tarjetas.forEach((t, i) => {
    const c = t.el.offsetLeft + t.el.offsetWidth / 2 - mitad;
    const d = Math.abs(c - scroll);
    if (d < dist) { dist = d; mejor = i; }
  });
  return mejor;
}
function irA(i, suave) {
  i = Math.max(0, Math.min(tarjetas.length - 1, i));
  const t = tarjetas[i].el;
  cinta.scrollTo({ left: t.offsetLeft + t.offsetWidth / 2 - cinta.clientWidth / 2, behavior: suave && !reducido ? 'smooth' : 'auto' });
}
document.querySelectorAll('[data-mover]').forEach((b) => b.addEventListener('click', () => {
  irA(tarjetas.indexOf(activa) + Number(b.dataset.mover), true);
}));
cinta.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault();
    irA(tarjetas.indexOf(activa) + (e.key === 'ArrowRight' ? 1 : -1), true);
  }
});

// Arranca con Delta en el centro (en escritorio queda Catalonia a la izquierda, como en el fold).
requestAnimationFrame(() => { irA(esCelular ? 1 : 1, false); buscarCentro(); });

// ---------- movimiento reducido (botón de prueba) ----------
const botonReducido = document.querySelector('[data-reducido]');
function aplicarReducido(v) {
  reducido = v;
  html.classList.toggle('quieto', v);
  botonReducido.setAttribute('aria-pressed', String(v));
  if (v && activa) activa.video.pause();
  if (!v && activa) { if (!activa.video.src) activa.video.src = activa.video.dataset.src; activa.video.play().catch(() => {}); }
}
aplicarReducido(reducidoSistema);
botonReducido.addEventListener('click', () => aplicarReducido(!reducido));

// ---------- montaje del video sobre la pantalla (igual que en el fold) ----------
function encuadrar(tarjeta, img, datos, tipo) {
  const caja = tarjeta.querySelector('.escena');
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
  const p = tarjeta.querySelector('.pantalla');
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
