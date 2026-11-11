import { abrirFlow } from './flow.js';
import { interpretar, controlar, precio } from './modelo.js';

// Idioma del panel y la página (?lang=en). El chat queda en español: es una confitería de Buenos Aires.
export const EN = new URLSearchParams(location.search).get('lang') === 'en';
const t = (es, en) => (EN ? en : es);
const [FLOW, CAT] = await Promise.all([
  fetch(new URL('flow/fredy-pedido.json', import.meta.url)).then((r) => r.json()),
  fetch(new URL('flow/catalogo.json', import.meta.url)).then((r) => r.json()),
]);
if (EN) {
  document.documentElement.lang = 'en';
  document.title = 'Ordering from Fredy on WhatsApp — prototype';
  for (const [sel, txt] of [
    ['.rotulo', 'Prototype · declarative and generative UI on WhatsApp'],
    ['h1', 'Order from Fredy, by typing.'],
    ['.bajada', 'The customer types the order however it comes out. A model turns it into a fixed format, rules the model can’t touch check it, and the system picks what to show: a card to confirm, a question, or the WhatsApp form. Each step shows on the right. The chat is in Spanish, as it would be for this Buenos Aires shop.'],
    ['.ejemplos p', 'Try:'],
    ['.panel h2', 'Behind the message'],
    ['.nota', 'In this prototype the model is simulated with rules; the format it returns, the checks and the components are the real design. The form is the real Flow JSON 7.3, rendered from the same file.'],
  ]) document.querySelector(sel).textContent = txt;
}

const hilo = document.querySelector('[data-hilo]');
const telefono = document.querySelector('[data-telefono]');
const panel = document.querySelector('[data-panel]');
const form = document.querySelector('[data-escribir]');
const campo = form.querySelector('input');
const aPesos = (n) => '$' + n.toLocaleString('es-AR');
const hora = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

// Lo que el cliente todavía tiene que completar (dirección, sabor dudoso, envío o retiro).
let pendiente = null;

// ---------- burbujas ----------
function burbuja(quien, contenido) {
  const b = el('div', `msj ${quien}`);
  if (typeof contenido === 'string') b.append(el('p', null, contenido)); else b.append(...[].concat(contenido));
  b.append(el('span', 'msj-hora', hora() + (quien === 'yo' ? ' ✓✓' : '')));
  hilo.append(b);
  hilo.scrollTop = hilo.scrollHeight;
  return b;
}
function botones(b, lista) {
  const fila = el('div', 'msj-botones');
  for (const [txt, fn, icono] of lista) {
    const x = el('button', null, (icono ? icono + ' ' : '') + txt);
    x.onclick = () => { fila.querySelectorAll('button').forEach((y) => (y.disabled = true)); fn(txt); };
    fila.append(x);
  }
  b.after(fila);
  hilo.scrollTop = hilo.scrollHeight;
}
async function escribiendo(ms = 700) {
  const t = el('div', 'msj fredy escribiendo'); t.append(el('span'), el('span'), el('span'));
  hilo.append(t); hilo.scrollTop = hilo.scrollHeight;
  await new Promise((r) => setTimeout(r, ms));
  t.remove();
}

// ---------- panel: lo que pasa detrás de cada mensaje ----------
function mostrar(pasos) {
  panel.innerHTML = '';
  for (const [titulo, cuerpo, clase] of pasos) {
    const s = el('section', 'paso ' + (clase || ''));
    s.append(el('h3', null, titulo));
    if (Array.isArray(cuerpo)) {
      const ul = el('ul', 'controles');
      for (const c of cuerpo) {
        const li = el('li', c.ok === true ? 'ok' : c.ok === false ? 'no' : 'ajuste');
        li.append(el('span', 'marca', c.ok === true ? '✓' : c.ok === false ? '✕' : '~'), el('span', null, c.txt));
        ul.append(li);
      }
      s.append(ul);
    } else if (typeof cuerpo === 'object') s.append(el('pre', null, JSON.stringify(cuerpo, null, 2)));
    else s.append(el('p', null, cuerpo));
    panel.append(s);
  }
}

// ---------- componentes que puede mostrar el sistema (el modelo no elige otros) ----------
function lineas(items) { return items.map((i) => `${i.cantidad} de ${i.sabor}`); }

function tarjeta(r) {
  const c = el('div', 'tarjeta');
  c.append(el('p', 'tarjeta-titulo', 'Tu pedido'));
  const ul = el('ul'); lineas(r.items).forEach((l) => ul.append(el('li', null, l))); c.append(ul);
  c.append(el('p', null, r.entrega === 'envio' ? `Envío a ${r.direccion}` : 'Retiro en Independencia 3002'));
  c.append(el('p', null, r.hora ? `Hoy a las ${r.hora}` : 'Lo antes posible'));
  const t = el('p', 'tarjeta-total'); t.append(el('span', null, `${r.total} triples`), el('strong', null, aPesos(precio(r.items, CAT)))); c.append(t);
  c.append(el('p', 'tarjeta-letra', 'Precio de la carta. Fredy te confirma el total antes de prepararlo; no se cobra nada todavía.'));
  return c;
}

async function responder(r, prop) {
  await escribiendo();
  switch (r.componente) {
    case 'tarjeta_pedido': {
      const b = burbuja('fredy', [el('p', null, '¿Es esto?'), tarjeta(r)]);
      botones(b, [['Confirmar', confirmar(r)], ['Cambiar algo', () => flow()]]);
      pendiente = null; break;
    }
    case 'elegir_sabor': {
      const d = r.duda;
      const b = burbuja('fredy', `Con «${d.texto}» hay ${d.candidatos.length} sabores. ¿Cuál querés? (${d.cantidad} triples)`);
      botones(b, [['Ver sabores', () => listaSabores(d, (id) => {
        burbuja('yo', id);
        prop.items.push({ sabor: id, cantidad: d.cantidad });
        prop.dudas.shift();
        seguir(prop, t(`El cliente eligió «${id}» de la lista`, `The customer picked “${id}” from the list`));
      }), '☰']]);
      pendiente = null; break;
    }
    case 'elegir_entrega': {
      const b = burbuja('fredy', '¿Te lo mandamos o lo pasás a buscar?');
      botones(b, [['Envío', (t) => { burbuja('yo', t); prop.entrega = 'envio'; seguir(prop, t('Respuesta con botón: envío', 'Button reply: delivery')); }],
                  ['Retiro', (t) => { burbuja('yo', t); prop.entrega = 'retiro'; seguir(prop, t('Respuesta con botón: retiro', 'Button reply: pickup')); }]]);
      pendiente = null; break;
    }
    case 'pedir_direccion':
      burbuja('fredy', '¿A qué dirección? Calle, número y localidad.');
      pendiente = { tipo: 'direccion', prop }; break;
    case 'falta_minimo': {
      const it = r.items[0];
      const b = burbuja('fredy', `El mínimo es ${CAT.minimo} triples y van ${r.total}. ¿Sumás ${CAT.paso} más${it ? ' de ' + it.sabor : ''} u otro sabor?`);
      botones(b, [
        ...(it ? [[`${CAT.paso} más`, (t) => { burbuja('yo', `${CAT.paso} más de ${it.sabor}`); prop.items.find((x) => x.sabor === it.sabor).cantidad += CAT.paso; seguir(prop, t('Sumó con botón', 'Added with a button')); }]] : []),
        ['Otro sabor', () => flow()]]);
      pendiente = null; break;
    }
    default: {
      const b = burbuja('fredy', 'Armalo acá: elegís sabores y entrega, y nos llega escrito.');
      botones(b, [['Armar pedido', () => flow(), '☰']]);
    }
  }
}

function seguir(prop, motivo) {
  const r = controlar(prop, CAT, EN);
  mostrar([
    [t('1 · Qué pasó', '1 · What happened'), motivo],
    [t('2 · Pedido hasta ahora', '2 · Order so far'), prop],
    [t('3 · Controles fijos', '3 · Fixed checks'), r.controles],
    [t('4 · Componente que se muestra', '4 · Component shown'), r.componente, 'componente'],
  ]);
  responder(r, prop);
}

const confirmar = (r) => async (t) => {
  burbuja('yo', t);
  mostrar([[t('Pedido confirmado', 'Order confirmed'), { items: r.items, entrega: r.entrega, direccion: r.direccion, hora: r.hora, total_triples: r.total, total_carta: precio(r.items, CAT) }],
           [t('Qué sigue', 'What happens next'), t('Le llega a Fredy como pedido ordenado, no como texto suelto. Él confirma total y hora por este chat.', 'Fredy gets a structured order, not loose text. He confirms total and time in this chat.')]]);
  await escribiendo(900);
  burbuja('fredy', 'Listo, ya lo tiene Fredy. En unos minutos te escribe con el total y la hora.');
};

function listaSabores(d, elegir) {
  const capa = el('div', 'f-lista');
  const caja = el('div', 'f-lista-caja');
  const cab = el('header', 'f-lista-cab'); const x = el('button', 'flow-x', '✕'); x.onclick = () => capa.remove();
  cab.append(x, el('h3', null, 'Sabores'));
  const ul = el('ul');
  for (const id of d.candidatos) {
    const s = CAT.sabores.find((y) => y.id === id);
    const li = el('li'); const b = el('button');
    b.append(el('strong', null, id), el('small', null, `${CAT.grupos[s.grupo]} · ${aPesos(s.precio)} los 3`));
    b.onclick = () => { capa.remove(); elegir(id); };
    li.append(b); ul.append(li);
  }
  caja.append(cab, ul); capa.append(caja); telefono.append(capa);
}

// ---------- el Flow ----------
function flow() {
  mostrar([[t('Flow de WhatsApp', 'WhatsApp Flow'), t('Se abre el mismo Flow JSON (7.3) que se publica en Meta: 3 pantallas, reglas fijas, sin modelo.', 'It opens the same Flow JSON (7.3) published to Meta: 3 screens, fixed rules, no model.')],
           [t('Pantallas', 'Screens'), FLOW.screens.map((s) => s.id).join(' → ')]]);
  abrirFlow(telefono, FLOW, {
    titulo: 'Pedido a Fredy',
    alTerminar: async (p) => {
      const items = [];
      for (let i = 1; i <= 6; i++) if (p['sabor' + i]) items.push({ sabor: p['sabor' + i], cantidad: Number(p['cant' + i]) });
      const total = items.reduce((a, x) => a + x.cantidad, 0);
      burbuja('yo', [el('p', 'flow-enviado', '☰ Pedido enviado'), el('p', 'flow-detalle', lineas(items).join(' · '))]);
      mostrar([[t('Lo que devuelve el Flow al terminar', 'What the Flow returns on completion'), p], [t('Total con la carta', 'Total from the menu'), `${total} triples · ${aPesos(precio(items, CAT))}`]]);
      await escribiendo(900);
      burbuja('fredy', `Recibido: ${total} triples, ${aPesos(precio(items, CAT))} según la carta. Fredy te escribe en unos minutos para confirmar.`);
    },
  });
}

// ---------- entrada del cliente ----------
async function recibir(texto) {
  burbuja('yo', texto);
  if (pendiente?.tipo === 'direccion') {
    const prop = pendiente.prop; prop.direccion = texto; pendiente = null;
    return seguir(prop, t('El cliente respondió la dirección', 'The customer replied with the address'));
  }
  if (/cu[aá]nto (sale|cuesta|est[aá])|precio/i.test(texto) && !/\d/.test(texto)) {
    mostrar([[t('1 · Texto del cliente', '1 · Customer text'), texto], [t('2 · Consulta de precio', '2 · Price question'), t('Se responde con la carta, no con el modelo.', 'Answered from the menu, not by the model.')]]);
    await escribiendo();
    const b = burbuja('fredy', `Los triples van de a 3: ${aPesos(14000)} cada 3 (Milanesa ${aPesos(18000)}, Crudo ${aPesos(17000)}). Mínimo 6. Envío gratis hasta 3 km.`);
    return botones(b, [['Armar pedido', () => flow(), '☰']]);
  }
  const prop = interpretar(texto, CAT);
  const r = controlar(prop, CAT, EN);
  mostrar([
    [t('1 · Texto del cliente', '1 · Customer text'), texto],
    [t('2 · Lo que devuelve el modelo', '2 · What the model returns'), prop],
    [t('3 · Controles fijos', '3 · Fixed checks'), r.controles],
    [t('4 · Componente que se muestra', '4 · Component shown'), r.componente, 'componente'],
  ]);
  responder(r, prop);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const t = campo.value.trim();
  if (!t) return;
  campo.value = '';
  recibir(t);
});
document.querySelectorAll('[data-ejemplo]').forEach((b) => b.addEventListener('click', () => recibir(b.textContent.replace(/[«»]/g, ''))));

// Arranque: el mensaje automático de Fredy.
const inicio = burbuja('fredy', 'Hola, es el WhatsApp de Fredy. Escribí tu pedido como te salga («una docena de jamón y queso a…»), o armalo acá:');
botones(inicio, [['Armar pedido', () => flow(), '☰']]);
mostrar([[t('Cómo leer este panel', 'How to read this panel'), t('Cada mensaje muestra lo que pasa detrás: qué entendió el modelo, qué controles fijos pasó y qué componente decidió mostrar el sistema.', 'Each message shows what happens behind it: what the model understood, which fixed checks it passed, and which component the system chose to show.')],
         [t('Probá', 'Try it'), t('Escribí un pedido como lo harías por WhatsApp, o tocá un ejemplo.', 'Type an order the way you would on WhatsApp (in Spanish), or tap an example.')]]);
