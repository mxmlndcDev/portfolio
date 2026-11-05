// Páginas de caso: monta cada video en su escena y prende la pantalla cuando entra en vista.
import { encuadrar } from './pantalla.js';
import pantallas from './escenas/pantallas.js';

const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.toggle('quieto', reducido);
const escenas = [...document.querySelectorAll('.escena[data-clave]')];

for (const escena of escenas) {
  const img = escena.querySelector('img');
  const montar = () => encuadrar(escena, img, pantallas[escena.dataset.clave], escena.dataset.tipo);
  img.complete ? montar() : img.addEventListener('load', montar);
  addEventListener('resize', montar);
}

// Se prende al entrar en vista y se apaga al salir. Con movimiento reducido queda el póster.
const vista = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    const escena = e.target;
    const video = escena.querySelector('video');
    escena.classList.toggle('activa', e.isIntersecting);
    if (reducido) continue;
    if (e.isIntersecting) {
      if (!video.src) video.src = video.dataset.src;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}, { threshold: 0.5 });
escenas.forEach((e) => vista.observe(e));
