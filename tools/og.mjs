// Imagen para compartir (1200×630) de cada página, sacada de la página real.
// Uso: node tools/og.mjs   (con el servidor local en :8710 sirviendo la raíz del repo)
import { chromium } from '/Users/mxmlndc/onda-motion/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const FFMPEG = '/Users/mxmlndc/onda-motion/node_modules/ffmpeg-static/ffmpeg';
const OUT = '/Users/mxmlndc/portfolio/src/og';
const SLUGS = ['catalonia', 'delta', 'fredy', 'peluqueria', 'evelia', 'petshop', 'end2end', 'perro'];
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1680, height: 882 }, reducedMotion: 'reduce' });
const PAGINAS = [['home', ''], ...SLUGS.map((s) => [s, `trabajos/${s}.html`]),
  ['en-home', 'en/'], ...SLUGS.map((s) => [`en-${s}`, `en/work/${s}.html`])];
// node tools/og.mjs en  → solo las de inglés
const SOLO = process.argv[2];
for (const [nombre, ruta] of PAGINAS.filter(([n]) => !SOLO || n.startsWith(SOLO + '-'))) {
  const p = await ctx.newPage();
  await p.goto(`http://localhost:8710/src/${ruta}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1200);
  const png = `${OUT}/${nombre}.png`;
  await p.screenshot({ path: png });
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', png, '-vf', 'scale=1200:630', '-q:v', '3', `${OUT}/${nombre}.jpg`]);
  execFileSync('rm', [png]);
  await p.close();
}
await b.close();
console.log('og listo');
