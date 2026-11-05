// Graba cada sitio del portfolio haciendo scroll, en escritorio (1440) y celular (390).
// Saca: video MP4, captura del primer pantallazo y tres capturas a lo largo de la página.
// Uso:  node tools/grabar.mjs            (todos)
//       node tools/grabar.mjs delta fredy (solo esos)
import { chromium } from '/Users/mxmlndc/onda-motion/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const FFMPEG = '/Users/mxmlndc/onda-motion/node_modules/ffmpeg-static/ffmpeg';
const OUT = '/Users/mxmlndc/portfolio/media';
const TMP = process.env.GRABAR_TMP || join(tmpdir(), 'grabar');

// Las maquetas pausadas se sirven en local (ver tools/servir.sh).
const SITIOS = [
  { slug: 'fredy', paginas: { home: 'https://fredyrestobar.com.ar/', carta: 'https://fredyrestobar.com.ar/carta/' } },
  { slug: 'delta', paginas: { home: 'https://demos.gastroapp.ar/delta-charter-hue0/' }, espera: 9000 },
  { slug: 'evelia', paginas: { home: 'http://localhost:8701/', carta: 'http://localhost:8701/carta.html' } },
  { slug: 'peluqueria', paginas: { home: 'https://demos.gastroapp.ar/peluqueria-canina-muestra-l84f/' } },
  { slug: 'petshop', paginas: { home: 'https://demos.gastroapp.ar/pet-shop-muestra-pmk6/' } },
  { slug: 'catalonia', paginas: { home: 'http://localhost:8702/', reservar: 'http://localhost:8702/reservar.html' } },
  { slug: 'end2end', paginas: { home: 'https://end2end-maqueta.vercel.app/' } },
  { slug: 'perro', paginas: { home: 'http://localhost:8703/' } },
];

const VISTAS = {
  desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mob: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

async function grabar(browser, sitio, nombre, url, vista) {
  const dir = join(OUT, sitio.slug);
  const frames = join(TMP, `${sitio.slug}-${nombre}-${vista}`);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  mkdirSync(frames, { recursive: true });

  const ctx = await browser.newContext({ ...VISTAS[vista], reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await pausa(sitio.espera ?? 2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await pausa(400);

  const base = `${vista}-${nombre}`;
  await page.screenshot({ path: join(dir, `${base}-fold.png`) });

  // Graba cuadros reales del navegador, con su marca de tiempo.
  const cdp = await ctx.newCDPSession(page);
  const lista = [];
  let n = 0;
  cdp.on('Page.screencastFrame', async (f) => {
    const file = join(frames, `${String(n++).padStart(5, '0')}.jpg`);
    writeFileSync(file, Buffer.from(f.data, 'base64'));
    lista.push({ file, ts: f.metadata.timestamp });
    await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  const { width, height } = VISTAS[vista].viewport;
  const dpr = VISTAS[vista].deviceScaleFactor;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: width * dpr, maxHeight: height * dpr, everyNthFrame: 1 });

  await pausa(1800); // la entrada del primer pantallazo
  const alto = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const duracion = Math.min(32000, Math.max(9000, (alto / 650) * 1000));
  const t0 = Date.now();
  let hecho = 0;
  while (Date.now() - t0 < duracion) {
    const objetivo = Math.round(alto * easeInOut((Date.now() - t0) / duracion));
    const paso = objetivo - hecho;
    if (paso > 0) {
      if (vista === 'desk') await page.mouse.wheel(0, paso);
      else await page.evaluate((y) => window.scrollBy(0, y), paso);
      hecho = objetivo;
    }
    await pausa(16);
  }
  await pausa(1500);
  await cdp.send('Page.stopScreencast').catch(() => {});
  await pausa(300);

  // Tres capturas a lo largo de la página.
  for (const [i, p] of [0.25, 0.5, 0.75].entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(alto * p));
    await pausa(1200);
    await page.screenshot({ path: join(dir, `${base}-${i + 1}.jpg`), type: 'jpeg', quality: 88 });
  }
  await ctx.close();

  // Cuadros con su duración real → MP4 a 30 cuadros por segundo.
  const lineas = [];
  for (let i = 0; i < lista.length; i++) {
    const d = i < lista.length - 1 ? lista[i + 1].ts - lista[i].ts : 0.5;
    lineas.push(`file '${lista[i].file}'`, `duration ${Math.max(d, 0.001).toFixed(4)}`);
  }
  lineas.push(`file '${lista.at(-1).file}'`);
  const concat = join(frames, 'lista.txt');
  writeFileSync(concat, lineas.join('\n'));
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', concat,
    '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(dir, `${base}.mp4`)]);
  rmSync(frames, { recursive: true, force: true });
  console.log(`ok ${sitio.slug} ${base} · ${lista.length} cuadros · ${(duracion / 1000).toFixed(1)} s`);
}

function easeInOut(t) {
  t = Math.min(1, Math.max(0, t));
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

const filtro = process.argv.slice(2);
const browser = await chromium.launch();
for (const sitio of SITIOS.filter((s) => !filtro.length || filtro.includes(s.slug))) {
  for (const [nombre, url] of Object.entries(sitio.paginas)) {
    for (const vista of Object.keys(VISTAS)) {
      try { await grabar(browser, sitio, nombre, url, vista); }
      catch (e) { console.log(`FALLÓ ${sitio.slug} ${vista}-${nombre}: ${e.message.split('\n')[0]}`); }
    }
  }
}
await browser.close();
