// Capa generativa del pedido.
// El modelo SOLO traduce texto libre a este contrato. No calcula precios, no confirma, no inventa sabores.
// En este prototipo el modelo está simulado con reglas (interpretar); el contrato y los controles son los reales.
//
// Contrato que devuelve el modelo:
// { intencion: 'pedido' | 'otra',
//   items: [{ sabor: <id del catálogo>, cantidad: <número> }],
//   dudas: [{ texto: <lo que escribió>, candidatos: [<ids del catálogo>] }],
//   entrega: 'envio' | 'retiro' | null, direccion: <texto> | null, hora: <'HH:MM'> | null }

const sin = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const VACIAS = new Set(['de', 'con', 'y', 'triples', 'triple', 'sanguchitos', 'sandwiches', 'miga', 'del', 'el', 'la', 'los', 'las', 'sabor', 'mas', 'otros', 'otras']);
// Cómo lo escribe la gente en el chat (sale de los mensajes que llegan por WhatsApp; ampliable).
const APODOS = { jyq: 'Jamón y queso', 'j y q': 'Jamón y queso', jyh: 'Jamón y huevo', mila: 'Milanesa', crudo: 'Crudo en pan negro', palmito: 'Jamón y palmitos', palmitos: 'Jamón y palmitos' };

const NUMEROS = { una: 1, un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, ocho: 8, diez: 10, doce: 12 };

function cantidad(txt) {
  const t = sin(txt).trim();
  if (/media docena/.test(t)) return 6;
  let m = /(\d+|una|dos|tres|cuatro|cinco)\s+docenas?/.exec(t);
  if (m) return 12 * (NUMEROS[m[1]] || Number(m[1]));
  if (/^docena/.test(t)) return 12;
  m = /^(\d+|seis|ocho|diez|doce|tres|cuatro|dos)$/.exec(t);
  return m ? NUMEROS[m[1]] || Number(m[1]) : null;
}

function buscarSabor(frase, catalogo) {
  const f = sin(frase).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [apodo, id] of Object.entries(APODOS)) if (f === apodo || f === sin(id)) return { ok: id };
  const palabras = f.split(' ').filter((p) => p && !VACIAS.has(p));
  if (!palabras.length) return null;
  const raiz = (p) => p.replace(/(es|s)$/, '');
  const coinciden = catalogo.sabores.filter((s) => {
    const w = sin(s.id).replace(/[^a-z ]/g, ' ').split(/\s+/).map(raiz);
    return palabras.every((p) => w.includes(raiz(p)));
  }).map((s) => s.id);
  // El de nombre más corto con todas las palabras es el que pidió («jamón y queso» no es «jamón, huevo y queso»).
  const exacto = coinciden.find((id) => sin(id).replace(/[^a-z ]/g, ' ').split(/\s+/).filter((p) => p && !VACIAS.has(p)).length === palabras.length);
  if (exacto) return { ok: exacto };
  if (coinciden.length === 1) return { ok: coinciden[0] };
  return { duda: frase.trim(), candidatos: coinciden.slice(0, 10) };
}

// Simulación del modelo: texto libre → contrato.
export function interpretar(texto, catalogo) {
  let t = ' ' + texto.replace(/\s+/g, ' ') + ' ';
  const out = { intencion: 'otra', items: [], dudas: [], entrega: null, direccion: null, hora: null };

  const h = /(?:a las|para las|tipo|a eso de las)\s+(\d{1,2})(?:[:.](\d{2}))?\s*(?:hs|h|horas)?/i.exec(t);
  if (h) { out.hora = `${h[1].padStart(2, '0')}:${h[2] || '00'}`; t = t.replace(h[0], ' '); }
  if (/\b(retiro|retirar|lo busco|los busco|paso a buscar|paso a retirar)\b/i.test(t)) out.entrega = 'retiro';
  const d = /\b(?:a|en|para)\s+((?:av\.?\s+|calle\s+)?[A-ZÁÉÍÓÚÑ][\wáéíóúñ.]*(?:\s+[A-ZÁÉÍÓÚÑ][\wáéíóúñ.]*)*\s+\d{2,5})\b/.exec(t);
  if (d) { out.direccion = d[1]; out.entrega = 'envio'; t = t.replace(d[0], ' '); }
  if (!out.entrega && /\b(envio|envío|mandame|mandamelo|mandamelos|traeme|delivery)\b/i.test(t)) out.entrega = 'envio';

  // Cortes: cada cantidad abre un ítem; lo que sigue hasta la próxima cantidad es el sabor.
  const reCant = /\b(media docena|(?:\d+|una|dos|tres|cuatro|cinco)\s+docenas?|docena|\d+|seis|ocho|diez|doce)\b/gi;
  const marcas = [...t.matchAll(reCant)];
  marcas.forEach((m, i) => {
    const desde = m.index + m[0].length;
    const hasta = i + 1 < marcas.length ? marcas[i + 1].index : t.length;
    let frase = t.slice(desde, hasta).replace(/\b(y|,|\.)\s*$/i, '').split(/[,.;]| para | que /i)[0];
    frase = frase.replace(/^\s*(de|del)\s+/i, '');
    const n = cantidad(m[0]);
    const s = buscarSabor(frase, catalogo);
    if (!n || !s) return;
    if (s.ok) out.items.push({ sabor: s.ok, cantidad: n });
    else out.dudas.push({ texto: s.duda, candidatos: s.candidatos, cantidad: n });
  });
  if (out.items.length || out.dudas.length) out.intencion = 'pedido';
  return out;
}

// ---------- controles fijos: no dependen del modelo ----------
// Devuelven el pedido corregido, la lista de controles y qué componente se muestra.
export function controlar(prop, catalogo, en = false) {
  const t = (es, ing) => (en ? ing : es);
  const ids = new Set(catalogo.sabores.map((s) => s.id));
  const { paso, minimo } = catalogo;
  const controles = [];
  const items = [];

  if (prop.intencion !== 'pedido') {
    controles.push({ ok: false, txt: t('No es un pedido, o no se entendió ningún sabor', 'Not an order, or no flavor was understood') });
    return { controles, componente: 'abrir_flow', items };
  }
  for (const it of prop.items) {
    if (!ids.has(it.sabor)) { controles.push({ ok: false, txt: t(`«${it.sabor}» no está en la carta: no se muestra`, `“${it.sabor}” isn’t on the menu: not shown`) }); continue; }
    let n = it.cantidad;
    if (n % paso) { const m = Math.ceil(n / paso) * paso; controles.push({ ok: 'ajuste', txt: t(`${it.sabor}: ${n} no va de a ${paso}, se propone ${m}`, `${it.sabor}: ${n} isn’t a multiple of ${paso}, ${m} is proposed`) }); n = m; }
    const ya = items.find((x) => x.sabor === it.sabor);
    if (ya) ya.cantidad += n; else items.push({ sabor: it.sabor, cantidad: n });
  }
  if (items.length) controles.push({ ok: true, txt: t(`${items.length} sabor${items.length > 1 ? 'es' : ''} de la carta, de a ${paso}`, `${items.length} flavor${items.length > 1 ? 's' : ''} from the menu, in ${paso}s`) });

  if (prop.dudas.length) {
    controles.push({ ok: false, txt: t(`«${prop.dudas[0].texto}» puede ser varios sabores: se pregunta, no se adivina`, `“${prop.dudas[0].texto}” could be several flavors: ask, don’t guess`) });
    return { controles, componente: 'elegir_sabor', duda: prop.dudas[0], items };
  }
  const total = items.reduce((a, i) => a + i.cantidad, 0);
  if (total < minimo) {
    controles.push({ ok: false, txt: t(`Total ${total}: el mínimo es ${minimo}`, `Total ${total}: the minimum is ${minimo}`) });
    return { controles, componente: 'falta_minimo', items, total };
  }
  controles.push({ ok: true, txt: t(`Total ${total} triples, llega al mínimo de ${minimo}`, `Total ${total} sandwiches, meets the minimum of ${minimo}`) });
  if (!prop.entrega) { controles.push({ ok: false, txt: t('Falta saber si es envío o retiro', 'Delivery or pickup is missing') }); return { controles, componente: 'elegir_entrega', items, total }; }
  if (prop.entrega === 'envio' && !prop.direccion) { controles.push({ ok: false, txt: t('Envío sin dirección: se pide', 'Delivery without an address: ask for it') }); return { controles, componente: 'pedir_direccion', items, total }; }
  controles.push({ ok: true, txt: prop.entrega === 'envio' ? t(`Envío a ${prop.direccion} (el radio de 3 km lo confirma Fredy)`, `Delivery to ${prop.direccion} (Fredy confirms the 3 km radius)`) : t('Retiro en el local', 'Pickup at the shop') });
  controles.push({ ok: true, txt: t('Precio calculado con la carta, no por el modelo', 'Price computed from the menu, not by the model') });
  return { controles, componente: 'tarjeta_pedido', items, total, entrega: prop.entrega, direccion: prop.direccion, hora: prop.hora };
}

export function precio(items, catalogo) {
  const por = Object.fromEntries(catalogo.sabores.map((s) => [s.id, s.precio]));
  return items.reduce((a, i) => a + (i.cantidad / catalogo.paso) * por[i.sabor], 0);
}
