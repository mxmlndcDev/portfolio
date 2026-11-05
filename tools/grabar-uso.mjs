// Graba cada sitio en uso: un guion de pasos (clicks, texto, elecciones) con un cursor visible.
// Saca media/<slug>/{desk,mob}-uso.mp4 y el primer cuadro como -uso-fold.png.
// Uso:  node tools/grabar-uso.mjs              (todos)
//       node tools/grabar-uso.mjs catalonia    (solo ese)
// Cuidado: bloquea Google Analytics (no ensuciar métricas reales) y cualquier salida a WhatsApp.
import { chromium } from '/Users/mxmlndc/onda-motion/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const FFMPEG = '/Users/mxmlndc/onda-motion/node_modules/ffmpeg-static/ffmpeg';
const OUT = '/Users/mxmlndc/portfolio/media';
const TMP = join(tmpdir(), 'grabar-uso');
const VISTAS = {
  desk: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mob: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const etiqueta = (name, value) => `label:has(input[name="${name}"][value="${value}"])`;

// Cada paso: [acción, ...args]. ir = llevar a pantalla; click; escribir; elegir (select por texto); esperar; navegar.
const SITIOS = {
  catalonia: {
    url: 'https://catalonia-sur-muestra.vercel.app/reservar.html',
    pasos: [
      ['esperar', 1200],
      ['click', etiqueta('nivel', 'superior')],
      ['ir', 'button.dia'],
      ['click', 'button.dia:not([disabled]):text-is("26")'],
      ['click', 'button.dia:not([disabled]):not(.fuera) >> nth=-1'],
      ['elegir', '#personas', '2'],
      ['click', '#seguir'],
      ['esperar', 900],
      ['escribir', 'input[name="nombre"]', 'Laura Gómez'],
      ['escribir', 'input[name="mail"]', 'laura@ejemplo.com'],
      ['escribir', 'input[name="tel"]', '11 0000 0000'],
      ['click', 'label:has(input[name="acepto"])'],
      ['click', '#pagar'],
      ['esperar', 2600],
      ['navegar', 'https://catalonia-sur-muestra.vercel.app/panel.html'],
      ['esperar', 3200],
    ],
  },
  petshop: {
    url: 'https://demos.gastroapp.ar/pet-shop-muestra-pmk6/pedido.html',
    pasos: [
      ['esperar', 1000],
      ['escribir', '#m-nombre', 'Lola'],
      ['click', etiqueta('esp', 'perro')],
      ['escribir', '#m-kg', '12'],
      ['esperar', 700],
      ['click', 'button.agregar:not([disabled])'],
      ['esperar', 900],
      ['mob:click', 'button.barra'],
      ['esperar', 700],
      ['click', etiqueta('envio', 'moto')],
      ['escribir', '#r-dir', 'Av. Cabildo 2000'],
      ['escribir', '#r-nombre', 'Laura'],
      ['click', '#r-enviar'],
      ['esperar', 3200],
    ],
  },
  peluqueria: {
    url: 'https://demos.gastroapp.ar/peluqueria-canina-muestra-l84f/',
    pasos: [
      ['esperar', 1000],
      ['ir', 'div.tarjeta:has-text("Osito")'],
      ['click', 'div.tarjeta:has-text("Osito")'],
      ['esperar', 1300],
      ['click', 'div.tarjeta:has-text("Osito") a.dorso-boton'],
      ['esperar', 1400],
      ['escribir', 'input[name="perro"]', 'Simón'],
      ['escribir', 'input[name="raza"]', 'Caniche'],
      ['click', etiqueta('tam', 'Mediano')],
      ['click', etiqueta('dia', 'Jueves')],
      ['click', etiqueta('franja', 'Mañana')],
      ['click', etiqueta('modo', 'Lo llevo yo')],
      ['click', 'button.boton:has-text("Pedir turno")'],
      ['esperar', 2200],
      ['ir', '#papel'],
      ['esperar', 3000],
    ],
  },
  fredy: {
    url: 'https://fredyrestobar.com.ar/',
    pasos: [
      ['esperar', 1000],
      ['ir', 'button[aria-label="Seis triples surtidos más"]'],
      ['click', 'button[aria-label="Seis triples surtidos más"]'],
      ['click', 'button[aria-label="Seis triples surtidos más"]'],
      ['click', 'button[aria-label="Seis pizzetas más"]'],
      ['click', 'button[aria-label="Seis empanaditas más"]'],
      ['click', 'button[aria-label="Seis chips más"]'],
      ['esperar', 2600],
    ],
  },
  delta: {
    url: 'https://demos.gastroapp.ar/delta-charter-hue0/',
    css: '#wa { visibility: hidden !important; }', // el botón nombra a la persona de la empresa
    pasos: [
      ['esperar', 1500],
      ['ir', '#f-exp'],
      ['elegir', '#f-exp', 'Salidas románticas'],
      ['elegir', '#f-ocasion', 'Aniversario o pedida de mano'],
      ['fecha', '#f-fecha', '2026-12-12'],
      ['escribir', '#f-grupo', '2'],
      ['escribir', '#f-nombre', 'Laura'],
      ['click', 'button.boton:has-text("Generar mi pase")'],
      ['esperar', 5600],
    ],
  },
};

// Cursor y toque visibles: el screencast no dibuja el puntero del sistema.
const MARCAS = `
addEventListener('DOMContentLoaded', () => {
  const s = document.createElement('style');
  s.textContent = '#__cur{position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);transition:none}'
    + '#__cur svg{display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))}'
    + '.__toque{position:fixed;z-index:2147483646;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(248,80,3,.35);border:2px solid #F85003;pointer-events:none;animation:__t .55s ease-out forwards}'
    + '@keyframes __t{from{transform:scale(.4);opacity:1}to{transform:scale(1.4);opacity:0}}';
  document.head.append(s);
  if (!matchMedia('(pointer: coarse)').matches) {
    const c = document.createElement('div'); c.id = '__cur';
    c.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 2l15 9-7 1.6L7.6 20z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.body.append(c);
    addEventListener('mousemove', (e) => { c.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, true);
  }
  addEventListener('pointerdown', (e) => {
    const t = document.createElement('div'); t.className = '__toque';
    t.style.left = e.clientX + 'px'; t.style.top = e.clientY + 'px';
    document.body.append(t); setTimeout(() => t.remove(), 600);
  }, true);
});
window.open = () => null;`;

async function grabar(browser, slug, sitio, vista) {
  const dir = join(OUT, slug);
  const frames = join(TMP, `${slug}-${vista}`);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const ctx = await browser.newContext({ ...VISTAS[vista], reducedMotion: 'no-preference' });
  await ctx.route(/google-analytics|googletagmanager|wa\.me|whatsapp\.com/, (r) => r.abort());
  await ctx.addInitScript(MARCAS);
  if (sitio.css) await ctx.addInitScript(`addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(sitio.css)};document.head.append(s)})`);
  const page = await ctx.newPage();
  page.on('popup', (p) => p.close().catch(() => {}));
  await page.goto(sitio.url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await pausa(1500);
  const { width, height } = VISTAS[vista].viewport;
  let x = width * 0.6, y = height * 0.55;
  if (vista === 'desk') await page.mouse.move(x, y);

  const cdp = await ctx.newCDPSession(page);
  const lista = [];
  let n = 0;
  cdp.on('Page.screencastFrame', async (f) => {
    const file = join(frames, `${String(n++).padStart(5, '0')}.jpg`);
    writeFileSync(file, Buffer.from(f.data, 'base64'));
    lista.push({ file, ts: f.metadata.timestamp });
    await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  const dpr = VISTAS[vista].deviceScaleFactor;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: width * dpr, maxHeight: height * dpr, everyNthFrame: 1 });

  // Lleva el elemento al centro con un scroll suave, como lo haría una persona.
  async function ir(sel) {
    const el = page.locator(sel).first();
    await el.waitFor({ state: 'attached', timeout: 15000 });
    const destino = await el.evaluate((e) => { const r = e.getBoundingClientRect(); return scrollY + r.top + r.height / 2 - innerHeight / 2; });
    const desde = await page.evaluate(() => scrollY);
    const pasos = Math.max(12, Math.min(60, Math.round(Math.abs(destino - desde) / 40)));
    for (let i = 1; i <= pasos; i++) {
      const t = i / pasos, k = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      await page.evaluate((v) => window.scrollTo(0, v), desde + (destino - desde) * k);
      await pausa(16);
    }
    await pausa(350);
  }
  async function apuntar(sel, reintento = false) {
    const el = page.locator(sel).first();
    await el.waitFor({ state: 'visible', timeout: 15000 });
    const r = await el.evaluate((e) => { const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom, x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
    if (!reintento && (r.t < 60 || r.b > height - 60)) { await ir(sel); return apuntar(sel, true); }
    if (vista === 'desk') {
      const pasos = 22;
      for (let i = 1; i <= pasos; i++) {
        const t = i / pasos, k = 1 - Math.pow(1 - t, 3);
        await page.mouse.move(x + (r.x - x) * k, y + (r.y - y) * k);
        await pausa(14);
      }
      x = r.x; y = r.y;
    }
    await pausa(160);
    return el;
  }

  for (let [accion, sel, valor] of sitio.pasos) {
    paso = `${accion} ${sel}`;
    if (accion.startsWith('mob:')) { if (vista !== 'mob') continue; accion = accion.slice(4); }
    if (accion === 'esperar') { await pausa(sel); continue; }
    if (accion === 'navegar') { await page.goto(sel, { waitUntil: 'load' }); await pausa(400); continue; }
    if (accion === 'ir') { await ir(sel); continue; }
    const el = await apuntar(sel);
    if (accion === 'click') { await el.click({ timeout: 4000 }).catch(() => el.click({ force: true })); await pausa(450); }
    if (accion === 'escribir') { await el.click(); await el.fill(''); await el.pressSequentially(valor, { delay: 65 }); await pausa(300); }
    if (accion === 'elegir') { await el.click().catch(() => {}); await el.selectOption({ label: valor }); await pausa(500); }
    if (accion === 'fecha') { await el.fill(valor); await el.dispatchEvent('change'); await pausa(400); }
  }
  await pausa(800);
  await cdp.send('Page.stopScreencast').catch(() => {});
  await pausa(300);
  await ctx.close();

  const base = `${vista}-uso`;
  const lineas = [];
  for (let i = 0; i < lista.length; i++) {
    const d = i < lista.length - 1 ? lista[i + 1].ts - lista[i].ts : 2.5; // el final queda quieto un rato
    lineas.push(`file '${lista[i].file}'`, `duration ${Math.max(d, 0.001).toFixed(4)}`);
  }
  lineas.push(`file '${lista.at(-1).file}'`);
  writeFileSync(join(frames, 'lista.txt'), lineas.join('\n'));
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(frames, 'lista.txt'),
    '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(dir, `${base}.mp4`)]);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', lista[0].file, join(dir, `${base}-fold.png`)]);
  rmSync(frames, { recursive: true, force: true });
  const dur = lista.at(-1).ts - lista[0].ts;
  console.log(`ok ${slug} ${base} · ${lista.length} cuadros · ${dur.toFixed(1)} s`);
}

let paso = '';
const filtro = process.argv.slice(2);
const browser = await chromium.launch();
for (const [slug, sitio] of Object.entries(SITIOS).filter(([s]) => !filtro.length || filtro.includes(s))) {
  for (const vista of Object.keys(VISTAS)) {
    try { await grabar(browser, slug, sitio, vista); }
    catch (e) { console.log(`FALLÓ ${slug} ${vista} en «${paso}»: ${e.message.split('\n')[0]}`); }
  }
}
await browser.close();
