// Dibuja un WhatsApp Flow (Flow JSON 7.3) a partir del JSON real: mismo archivo que se publica en Meta.
// Cubre lo que usa el pedido de Fredy: textos, RadioButtonsGroup, Dropdown, TextInput, If, Footer,
// las acciones navigate / update_data / complete y las expresiones ${...} con `...`.

// ---------- expresiones ----------
function leer(ruta, ctx) {
  const p = ruta.split('.');
  let v;
  if (p[0] === 'form') v = ctx.form[p[1]];
  else if (p[0] === 'data') v = ctx.data[p[1]];
  else if (p[0] === 'screen') v = (ctx.pantallas[p[1]] || {})[p[2]]?.[p[3]];
  return v;
}
function literal(v) {
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  return "'" + String(v ?? '').replace(/'/g, "\\'") + "'";
}
function tokens(s) {
  const t = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "'") { let j = i + 1, v = ''; while (j < s.length && s[j] !== "'") { if (s[j] === '\\') j++; v += s[j++]; } t.push({ v }); i = j + 1; continue; }
    const dos = s.slice(i, i + 2);
    if (['==', '!=', '&&', '||', '<=', '>='].includes(dos)) { t.push({ op: dos }); i += 2; continue; }
    if ('()<>+-/%'.includes(c)) { t.push({ op: c }); i++; continue; }
    const m = /^(true|false|-?\d+(\.\d+)?)/.exec(s.slice(i));
    if (m) { t.push({ v: m[1] === 'true' ? true : m[1] === 'false' ? false : Number(m[1]) }); i += m[1].length; continue; }
    throw new Error('Expresión no válida: ' + s);
  }
  return t;
}
function evaluar(s) {
  const t = tokens(s); let i = 0;
  const ver = () => t[i], es = (op) => t[i] && t[i].op === op;
  const o = () => { let a = y(); while (es('||')) { i++; const b = y(); a = a || b; } return a; };
  const y = () => { let a = cmp(); while (es('&&')) { i++; const b = cmp(); a = a && b; } return a; };
  const cmp = () => {
    const a = suma();
    for (const op of ['==', '!=', '<=', '>=', '<', '>']) if (es(op)) {
      i++; const b = suma();
      return { '==': a === b, '!=': a !== b, '<=': a <= b, '>=': a >= b, '<': a < b, '>': a > b }[op];
    }
    return a;
  };
  const suma = () => {
    let a = concat();
    while (es('+') || es('-') || es('/') || es('%')) {
      const op = t[i++].op, b = concat();
      a = op === '+' ? a + b : op === '-' ? a - b : b ? (op === '/' ? a / b : a % b) : 0;
    }
    return a;
  };
  // Operandos pegados se concatenan como texto.
  const concat = () => {
    let a = prim();
    while (ver() && (ver().v !== undefined || es('('))) a = String(a) + String(prim());
    return a;
  };
  const prim = () => {
    if (es('(')) { i++; const v = o(); i++; return v; }
    return t[i++].v;
  };
  return o();
}
// "`...`" es expresión; si no, ${...} se reemplaza por su valor. Una sola referencia devuelve el valor tal cual.
export function valor(x, ctx) {
  if (typeof x !== 'string') return x;
  if (x.startsWith('`') && x.endsWith('`'))
    return evaluar(x.slice(1, -1).replace(/\$\{([^}]+)\}/g, (_, r) => literal(leer(r, ctx))));
  const solo = /^\$\{([^}]+)\}$/.exec(x);
  if (solo) return leer(solo[1], ctx);
  if (/\$\{/.test(x) && /==|!=|&&|\|\|/.test(x))   // condiciones de If, sin comillas invertidas
    return evaluar(x.replace(/\$\{([^}]+)\}/g, (_, r) => literal(leer(r, ctx))));
  return x.replace(/\$\{([^}]+)\}/g, (_, r) => leer(r, ctx) ?? '');
}

// ---------- pantalla ----------
const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

export function abrirFlow(raiz, json, { titulo, alTerminar, alCerrar }) {
  const pantallas = {}; // id → { form, data }
  const porId = Object.fromEntries(json.screens.map((s) => [s.id, s]));
  const pila = [];

  const hoja = el('div', 'flow');
  raiz.append(hoja);
  requestAnimationFrame(() => hoja.classList.add('abierto'));

  function cerrar() { hoja.classList.remove('abierto'); setTimeout(() => hoja.remove(), 260); }

  function ir(id, payload) {
    const def = porId[id];
    const estado = pantallas[id] || (pantallas[id] = { form: {}, data: {} });
    Object.assign(estado.data, payload || {});
    pila.push(id);
    dibujar(def, estado);
  }

  function dibujar(def, estado) {
    const ctx = { form: estado.form, data: estado.data, pantallas };
    hoja.innerHTML = '';
    const cab = el('header', 'flow-cab');
    const x = el('button', 'flow-x', pila.length > 1 ? '←' : '✕');
    x.setAttribute('aria-label', pila.length > 1 ? 'Volver' : 'Cerrar');
    x.onclick = () => {
      if (pila.length > 1) { pila.pop(); const id = pila.pop(); ir(id); }
      else { cerrar(); alCerrar?.(); }
    };
    cab.append(x, el('h2', null, valor(def.title, ctx) || titulo), el('span', 'flow-mas', '⋮'));
    const cuerpo = el('div', 'flow-cuerpo');
    const pie = el('div', 'flow-pie');
    hoja.append(cab, cuerpo, pie);

    const redibujar = () => {
      const scroll = cuerpo.scrollTop;
      dibujar(def, estado);
      hoja.querySelector('.flow-cuerpo').scrollTop = scroll;
    };

    const accion = (a) => {
      if (a.name === 'update_data') { Object.assign(estado.data, a.payload); redibujar(); }
      else if (a.name === 'navigate') {
        const faltan = [...cuerpo.querySelectorAll('[data-req]')].filter((n) => !estado.form[n.dataset.req]);
        if (faltan.length) { faltan.forEach((n) => n.classList.add('falta')); return; }
        const payload = Object.fromEntries(Object.entries(a.payload || {}).map(([k, v]) => [k, valor(v, ctx)]));
        ir(a.next.name, payload);
      } else if (a.name === 'complete') {
        const payload = Object.fromEntries(Object.entries(a.payload || {}).map(([k, v]) => [k, valor(v, ctx)]));
        cerrar(); alTerminar?.(payload);
      }
    };

    const pintar = (nodos, dentro) => {
      for (const c of nodos) {
        if (c.visible !== undefined && !valor(c.visible, ctx)) continue;
        switch (c.type) {
          case 'If': pintar(valor(c.condition, ctx) ? c.then : c.else || [], dentro); break;
          case 'TextHeading': dentro.append(el('h3', 'f-h1', valor(c.text, ctx))); break;
          case 'TextSubheading': dentro.append(el('h4', 'f-h2', valor(c.text, ctx))); break;
          case 'TextBody': dentro.append(el('p', 'f-body', valor(c.text, ctx))); break;
          case 'TextCaption': dentro.append(el('p', 'f-caption', valor(c.text, ctx))); break;
          case 'RadioButtonsGroup': {
            if (estado.form[c.name] === undefined && c['init-value']) estado.form[c.name] = c['init-value'];
            const g = el('fieldset', 'f-radio'); g.append(el('legend', null, c.label));
            for (const o of c['data-source']) {
              const l = el('label', 'f-opcion');
              const t = el('span', 'f-opcion-txt'); t.append(el('strong', null, o.title)); if (o.description) t.append(el('small', null, o.description));
              const r = el('input'); r.type = 'radio'; r.name = c.name; r.checked = estado.form[c.name] === o.id;
              r.onchange = () => { estado.form[c.name] = o.id; redibujar(); };
              l.append(t, r, el('span', 'f-circulo')); g.append(l);
            }
            dentro.append(g); break;
          }
          case 'TextInput': {
            const w = el('label', 'f-input'); if (c.required) w.dataset.req = c.name;
            const i = el('input'); i.value = estado.form[c.name] || ''; i.placeholder = ' '; i.autocomplete = 'off';
            i.oninput = () => { estado.form[c.name] = i.value; w.classList.remove('falta'); };
            w.append(i, el('span', 'f-label', c.label)); if (c['helper-text']) w.append(el('small', null, c['helper-text']));
            dentro.append(w); break;
          }
          case 'Dropdown': {
            if (estado.form[c.name] === undefined && c['init-value']) estado.form[c.name] = valor(c['init-value'], ctx);
            const b = el('button', 'f-drop'); b.type = 'button'; if (c.required) b.dataset.req = c.name;
            const elegido = c['data-source'].find((o) => o.id === estado.form[c.name]);
            b.append(el('span', 'f-label', c.label), el('span', 'f-drop-valor', elegido ? elegido.title : 'Elegir'), el('span', 'f-drop-flecha', '▾'));
            b.onclick = () => lista(c, (o) => {
              estado.form[c.name] = o.id;
              if (c['on-select-action']) accion(c['on-select-action']); else redibujar();
            });
            dentro.append(b); break;
          }
          case 'Footer': {
            const ok = c.enabled === undefined ? true : !!valor(c.enabled, ctx);
            const b = el('button', 'f-boton', c.label); b.disabled = !ok;
            b.onclick = () => accion(c['on-click-action']);
            pie.append(b, el('p', 'f-gestionado', 'Gestionado por el negocio. Más información'));
            break;
          }
        }
      }
    };
    pintar(def.layout.children, cuerpo);
  }

  // Lista con buscador: así se ve un Dropdown largo en WhatsApp.
  function lista(c, elegir) {
    const capa = el('div', 'f-lista');
    const caja = el('div', 'f-lista-caja');
    const cab = el('header', 'f-lista-cab'); const x = el('button', 'flow-x', '✕'); x.onclick = () => capa.remove();
    cab.append(x, el('h3', null, c.label));
    const buscar = el('input', 'f-buscar'); buscar.placeholder = 'Buscar'; buscar.autocomplete = 'off';
    const ul = el('ul');
    const llenar = () => {
      ul.innerHTML = '';
      const q = buscar.value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
      for (const o of c['data-source']) {
        const txt = (o.title + ' ' + (o.description || '')).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
        if (q && !txt.includes(q)) continue;
        const li = el('li'); const b = el('button');
        b.append(el('strong', null, o.title)); if (o.description) b.append(el('small', null, o.description));
        b.onclick = () => { capa.remove(); elegir(o); };
        li.append(b); ul.append(li);
      }
    };
    buscar.oninput = llenar; llenar();
    caja.append(cab, buscar, ul); capa.append(caja); hoja.append(capa);
    if (c['data-source'].length > 12) setTimeout(() => buscar.focus(), 50);
  }

  ir(json.screens[0].id, {});
}
