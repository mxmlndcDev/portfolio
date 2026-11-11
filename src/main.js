import { encuadrar } from './pantalla.js';
import pantallas from './escenas/pantallas.js';

// Home: entrada del fold, cinta de trabajos con arrastre, y la pantalla que se prende en el centro (G7).
// Sirve para /  y para /en/: el idioma sale de <html lang>, las rutas de la ubicación de este archivo.
const EN = document.documentElement.lang === 'en';
const RAIZ = new URL('./', import.meta.url).href;
const ESCENAS = RAIZ + 'escenas/';
const MEDIA = RAIZ + 'media/';
const CASO = EN ? 'work/' : 'trabajos/';
const CONCEPTO = EN ? 'Concept · not commissioned' : 'Concepto · no encargado';
const CLIENTE = EN ? 'Client · live' : 'Cliente · en producción';
const VER = EN ? 'See the case →' : 'Ver el caso →';

// Los 8 trabajos. En escritorio alterna notebook y celular; en el celular, todos celular.
const TRABAJOS = [
  { slug: 'catalonia', nombre: 'Catalonia Sur', tipo: CONCEPTO, escena: 'celular', ancho: '19vw', baja: '8vh',
    texto: EN ? 'Direct bookings with a deposit, so the hotel stops paying Booking’s commission.'
      : 'Reservas directas con seña para dejar de pagarle comisión a Booking.' },
  { slug: 'delta', nombre: 'Delta Charter', tipo: CONCEPTO, escena: 'notebook', ancho: '43vw',
    texto: EN ? 'Yachts, helicopter and private jet from one company. The hero drops from sky to water as you scroll.'
      : 'Yates, helicóptero y avión privado con una sola empresa. La portada baja del cielo al agua mientras hacés scroll.' },
  { slug: 'fredy', nombre: 'Fredy restobar', tipo: CLIENTE, escena: 'notebook', ancho: '36vw', baja: '4vh',
    texto: EN ? 'Live site with a menu and a catering quote builder. Lighthouse 98 / 100 / 100 / 100 on mobile.'
      : 'Sitio en producción con carta y cotizador de bandejas. Lighthouse 98 / 100 / 100 / 100 en celular.' },
  { slug: 'peluqueria', nombre: EN ? 'Dog groomer' : 'Peluquería canina', tipo: CONCEPTO, escena: 'notebook', ancho: '36vw',
    texto: EN ? 'WhatsApp booking and an AI-made 3D illustration for every cut.'
      : 'Turnos por WhatsApp e ilustraciones 3D hechas con IA para cada corte.' },
  { slug: 'evelia', nombre: 'Evelia', tipo: CONCEPTO, escena: 'celular', ancho: '19vw', baja: '10vh',
    texto: EN ? 'Their own drawing of grandma’s house, animated in layers. A Michelin-listed restaurant.'
      : 'La ilustración de la casa de la abuela, animada por capas. Restaurante Michelin.' },
  { slug: 'petshop', nombre: 'Pet shop', tipo: CONCEPTO, escena: 'notebook', ancho: '36vw', baja: '3vh',
    texto: EN ? 'Orders work like a prescription: dose by weight, checked by a vet.'
      : 'El pedido se arma como una receta: dosis por kilo y un veterinario que lo revisa.' },
  { slug: 'end2end', nombre: 'END 2 END', tipo: CONCEPTO, escena: 'celular', ancho: '19vw', baja: '7vh',
    texto: EN ? 'Multiplayer bingo for operators. The trade-show schedule is a bingo card.'
      : 'Bingo multiplayer para operadores. La agenda de la feria es un cartón de bingo.' },
  { slug: 'perro', nombre: 'Perro', tipo: CONCEPTO, escena: 'notebook', ancho: '36vw',
    texto: EN ? 'A hot dog joint with a punk-zine voice. Two things matter: the bun and the sausage.'
      : 'Panchería con voz de fanzine punk. Dos cosas importan: el pan y la salchicha.' },
];

const html = document.documentElement;
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
html.classList.toggle('quieto', reducido);
const esCelular = matchMedia('(max-width: 760px)').matches;
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
      <img src="${ESCENAS}${clave}.webp" alt="" draggable="false" decoding="async"${TRABAJOS.indexOf(t) > 2 ? ' loading="lazy"' : ''}>
      <div class="pantalla"><video poster="${MEDIA}${t.slug}/${vista}-home-fold.webp" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video></div>
    </div>
    <h3><a href="${CASO}${t.slug}.html" draggable="false">${t.nombre}</a><span class="tipo">${t.tipo}</span></h3>
    <p>${t.texto}</p>
    <span class="ver" aria-hidden="true">${VER}</span>`;
  cinta.append(el);
  const img = el.querySelector('img');
  const video = el.querySelector('video');
  video.dataset.src = `${MEDIA}${t.slug}/${vista}-home.mp4`;
  const montar = () => encuadrar(el.querySelector('.escena'), img, pantallas[clave], tipo);
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

// ---------- 3 · la tarjeta del centro prende su pantalla ----------
let activa = null;
// El video espera a que la página termine de cargar: primero se ve todo, después se prende.
let cargado = false;
function prender(t) {
  if (reducido || !cargado || !t) return;
  if (!t.video.src) t.video.src = t.video.dataset.src;
  t.video.play().catch(() => {});
}
addEventListener('load', () => setTimeout(() => { cargado = true; prender(activa); }, 800));
const cuenta = document.querySelector('[data-cuenta]');
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
  cuenta.textContent = String(tarjetas.indexOf(activa) + 1).padStart(2, '0');
  prender(activa);
}
let pedido = false;
cinta.addEventListener('scroll', () => {
  if (pedido) return;
  pedido = true;
  requestAnimationFrame(() => { pedido = false; buscarCentro(); });
}, { passive: true });

// ---------- 4 · arrastre con inercia (mouse); en el celular es el scroll nativo ----------
let arrastre = null;
let recienArrastro = false;
// Si soltó después de arrastrar, ese click no abre el caso.
cinta.addEventListener('click', (e) => { if (recienArrastro) { e.preventDefault(); e.stopPropagation(); } }, true);
cinta.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  arrastre = { x: e.clientX, inicio: cinta.scrollLeft, v: 0, t: performance.now(), ultX: e.clientX, movio: false };
});
cinta.addEventListener('pointermove', (e) => {
  if (!arrastre) return;
  const dx = e.clientX - arrastre.x;
  if (Math.abs(dx) > 4 && !arrastre.movio) { arrastre.movio = true; cinta.classList.add('arrastrando'); cinta.setPointerCapture(e.pointerId); }
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
  recienArrastro = true;
  setTimeout(() => { recienArrastro = false; }, 0);
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
requestAnimationFrame(() => { irA(1, false); buscarCentro(); });
