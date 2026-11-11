#!/usr/bin/env python3
"""Caso «Pedir por WhatsApp» (ES y EN) + copia del prototipo al sitio.

Uso: python3 tools/caso-whatsapp.py   (después de tools/casos.py, que arma el sitemap)
El prototipo vive en ~/web-design-pipeline/fredy-whatsapp/prototipo (fuente única): acá solo se copia.
Gramática de caso propia de un proyecto conversacional: no hay escenas con notebook y celular,
el protagonista es el razonamiento (qué decide el modelo, qué queda fijo).
"""
import shutil
from html import escape as e
from pathlib import Path

import casos

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / 'src'
PROTO = Path.home() / 'web-design-pipeline/fredy-whatsapp/prototipo'
SLUG = 'whatsapp'
BASE = casos.BASE

TXT = {
  'es': dict(
    nombre='Pedir por WhatsApp', titulo_pag='Pedir por WhatsApp',
    pastillas=['Prototipo · no encargado', 'IA conversacional', '2026'],
    descripcion='El pedido de Fredy adentro de WhatsApp: el cliente escribe como le sale y la IA arma una tarjeta para confirmar. Interfaz declarativa y generativa, con el razonamiento a la vista.',
    bajada='El pedido de Fredy, adentro de WhatsApp. El cliente escribe como le sale y la IA arma una tarjeta para confirmar. Lo que diseñé es qué puede componer el modelo, qué queda fijo y cómo se recupera cuando se equivoca.',
    boton='Probar el prototipo', demo='demo/pedido-whatsapp/', demo_img='demo-es',
    demo_alt='El prototipo: el chat de WhatsApp con la tarjeta del pedido y, al costado, el JSON del modelo y los controles que pasó',
    demo_pie='Prototipo · a la derecha, lo que pasa detrás de cada mensaje',
    vi='El sitio de Fredy funciona: en su primer mes, los 5 pedidos por WhatsApp salieron de la barra fija del celular. Pero el sitio es un desvío. Arma un mensaje que el cliente podría escribir directo en WhatsApp, y a Fredy le llega como texto suelto que confirma a mano.',
    cita='«Escribilo como te salga.»',
    idea='Llevar el pedido adonde ya está la conversación, en dos capas. Una fija: el formulario de WhatsApp (Flow) con las reglas del negocio. Otra generativa: un modelo que traduce el texto libre a un formato cerrado. El modelo propone; las reglas y el cliente deciden. Si algo sale mal, siempre queda el formulario.',
    ia_titulo='Qué decide la <em>IA</em>', ia_cols=('El modelo puede', 'El modelo no puede'),
    ia=[('Entender «jyq», «mila», «una docena», «a Laprida 1250», «para las 13»', 'Nombrar un sabor que no está en la carta'),
        ('Proponer sabores, cantidades, entrega y hora', 'Calcular el precio: sale de la carta'),
        ('Marcar una duda, con sus candidatos', 'Elegir entre candidatos: le pregunta al cliente'),
        ('Devolver siempre el mismo formato', 'Confirmar el pedido, ni elegir qué se muestra')],
    ctl_titulo='Controles <em>fijos</em>', ctl_cols=('Control', 'Si no pasa', 'Qué se muestra'),
    ctl=[('El sabor está en la carta', 'Se descarta: no se muestra', '—'),
         ('Va de a 3', 'Se redondea hacia arriba y se avisa', 'sigue'),
         ('Hay un solo sabor posible', 'Lista con los candidatos, hasta 10', 'elegir_sabor'),
         ('Llega al mínimo de 6', '«El mínimo es 6 y van 3. ¿Sumás 3 más?»', 'falta_minimo'),
         ('Se sabe si es envío o retiro', 'Dos botones', 'elegir_entrega'),
         ('Hay dirección, si es envío', 'Se pide por el chat', 'pedir_direccion'),
         ('Pasa todo', 'Tarjeta con el total de la carta: Confirmar o Cambiar algo', 'tarjeta_pedido'),
         ('No es un pedido', 'Abre el formulario', 'abrir_flow')],
    tira_titulo='Por dentro',
    tira=[('angosta', 'duda', '«Atún» son 7 sabores: pregunta, no adivina'),
          ('angosta', 'lista', 'Los candidatos salen de la carta'),
          ('angosta', 'tarjeta', 'El total lo calcula la carta, no el modelo'),
          ('angosta', 'entrega', 'Envío viene marcado: los 5 pedidos medidos fueron con envío'),
          ('angosta', 'sabores', 'El primer sabor arranca en 6, el mínimo'),
          ('angosta', 'revisar', 'Lo legal va en la conversación'),
          ('ancha', 'meta-editor', 'Cargado en el editor de Flows de Meta: valida con 0 errores')],
    lim_titulo='Los límites de <em>WhatsApp</em>', lim_cols=('Límite', 'Cómo lo resolví'),
    lim=[('No hay contador + / −', 'Cada sabor es un par de listas: sabor y cantidad. Los 37 sabores tienen buscador y cada uno dice su grupo y su precio.'),
         ('Las cantidades son texto: no se suman', 'Todo va de a 3, así que el mínimo de 6 se cumple si el primero tiene más de 3 o hay un segundo sabor. Esa condición prende el botón.'),
         ('Sin servidor no hay listas que crezcan', 'Elegir un sabor abre lugar para otro, hasta 6.'),
         ('Títulos de 30 letras', 'Un sabor se acortó: «Jamón, morrón, huevo, aceituna».'),
         ('No hay pago dentro de WhatsApp en Argentina', 'La tarjeta dice que no se cobra nada y que Fredy confirma el total por el chat.')],
    tablero_titulo='Estado',
    numeros=[('Pantallas del formulario', '3'), ('Sabores de la carta', '37'), ('Errores al validar en Meta', '0'), ('Componentes posibles', '6')],
    tablero_pie='El formulario está cargado y validado en Meta (Flow JSON 7.3). Mandarlo a un teléfono real espera la verificación del negocio. En el prototipo el modelo está simulado con reglas; el formato que devuelve, los controles y los componentes son los del diseño. Lo que sigue: un modelo real con salida estructurada al mismo formato.',
    siguiente='Fredy restobar',
  ),
  'en': dict(
    nombre='Ordering on WhatsApp', titulo_pag='Ordering on WhatsApp',
    pastillas=['Prototype · not commissioned', 'Conversational AI', '2026', 'Chat in Spanish'],
    descripcion='Fredy’s order inside WhatsApp: customers type however it comes out and AI builds a card to confirm. Declarative and generative UI, with the reasoning visible.',
    bajada='Fredy’s order, inside WhatsApp. The customer types however it comes out and AI builds a card to confirm. What I designed is what the model can compose, what stays fixed, and how it recovers when it gets it wrong.',
    boton='Try the prototype', demo='demo/pedido-whatsapp/?lang=en', demo_img='demo-en',
    demo_alt='The prototype: the WhatsApp chat with the order card and, beside it, the model’s JSON and the checks it passed',
    demo_pie='Prototype · on the right, what happens behind each message',
    vi='Fredy’s site works: in its first month, all 5 WhatsApp orders came from the sticky bar on mobile. But the site is a detour. It builds a message the customer could type straight into WhatsApp, and Fredy gets it as loose text he confirms by hand.',
    cita='“Just type it.”',
    idea='Take the order where the conversation already is, in two layers. A fixed one: the WhatsApp form (Flow) with the business rules. A generative one: a model that turns free text into a closed format. The model proposes; the rules and the customer decide. If something goes wrong, the form is always there.',
    ia_titulo='What <em>AI</em> decides', ia_cols=('The model can', 'The model can’t'),
    ia=[('Understand slang for flavors, “a dozen”, “to Laprida 1250”, “for 1 pm”', 'Name a flavor that isn’t on the menu'),
        ('Propose flavors, quantities, delivery and time', 'Compute the price: it comes from the menu'),
        ('Flag a doubt, with its candidates', 'Pick between candidates: it asks the customer'),
        ('Always return the same format', 'Confirm the order, or choose what gets shown')],
    ctl_titulo='Fixed <em>checks</em>', ctl_cols=('Check', 'If it fails', 'What shows'),
    ctl=[('The flavor is on the menu', 'Dropped: never shown', '—'),
         ('Comes in 3s', 'Rounded up, and it says so', 'continues'),
         ('Only one flavor matches', 'A list of candidates, up to 10', 'elegir_sabor'),
         ('Meets the minimum of 6', '“The minimum is 6 and you have 3. Add 3 more?”', 'falta_minimo'),
         ('Delivery or pickup is known', 'Two buttons', 'elegir_entrega'),
         ('There’s an address, if delivery', 'Asked in the chat', 'pedir_direccion'),
         ('Everything passes', 'A card with the menu total: Confirm or Change something', 'tarjeta_pedido'),
         ('It isn’t an order', 'Opens the form', 'abrir_flow')],
    tira_titulo='Inside',
    tira=[('angosta', 'duda', '“Tuna” matches 7 flavors: ask, don’t guess'),
          ('angosta', 'lista', 'Candidates come from the menu'),
          ('angosta', 'tarjeta', 'The menu computes the total, not the model'),
          ('angosta', 'entrega', 'Delivery is preselected: all 5 measured orders were deliveries'),
          ('angosta', 'sabores', 'The first flavor starts at 6, the minimum'),
          ('angosta', 'revisar', 'The legal part lives in the conversation'),
          ('ancha', 'meta-editor', 'Loaded in Meta’s Flow editor: validates with 0 errors')],
    lim_titulo='WhatsApp’s <em>limits</em>', lim_cols=('Limit', 'How I solved it'),
    lim=[('No + / − stepper', 'Each flavor is a pair of lists: flavor and quantity. The 37 flavors are searchable and each shows its group and price.'),
         ('Quantities are text: they can’t be added', 'Everything comes in 3s, so the minimum of 6 is met if the first has more than 3 or there’s a second flavor. That condition enables the button.'),
         ('No server, no growing lists', 'Picking a flavor opens a slot for another, up to 6.'),
         ('30-character titles', 'One flavor name got shortened.'),
         ('No in-WhatsApp payments in Argentina', 'The card says nothing is charged and Fredy confirms the total in the chat.')],
    tablero_titulo='Status',
    numeros=[('Form screens', '3'), ('Flavors from the menu', '37'), ('Errors in Meta’s validator', '0'), ('Possible components', '6')],
    tablero_pie='The form is loaded and validated in Meta (Flow JSON 7.3). Sending it to a real phone is waiting on business verification. In the prototype the model is simulated with rules; the format it returns, the checks and the components are the real design. Next: a real model with structured output to the same format.',
    siguiente='Fredy restobar',
  ),
}


def tabla(cls, titulo, cols, filas, tid):
    cab = ''.join(f'<th scope="col">{e(c)}</th>' for c in cols)
    cuerpo = '\n'.join('          <tr>' + f'<th scope="row">{e(f[0])}</th>' + ''.join(f'<td>{e(x)}</td>' for x in f[1:]) + '</tr>' for f in filas)
    return f'''    <section class="planilla {cls}" aria-labelledby="{tid}">
      <h2 class="planilla-titulo" id="{tid}">{titulo}</h2>
      <table>
        <thead><tr>{cab}</tr></thead>
        <tbody>
{cuerpo}
        </tbody>
      </table>
    </section>'''


def pagina(lang):
    T, L = TXT[lang], casos.UI[lang]
    r = L['raiz']
    url = lambda l: f"{BASE}{casos.UI[l]['dir']}{SLUG}.html"
    og = f"{BASE}og/{SLUG if lang == 'es' else 'en-' + SLUG}.jpg"
    tr, so, si, co = L['anclas']
    n1, n2, n3 = L['nav']
    if lang == 'es':
        idioma = f'<p class="idioma" aria-label="{L["idioma"]}"><span>ES</span>·<a href="../en/work/{SLUG}.html" hreflang="en" lang="en">EN</a></p>'
    else:
        idioma = f'<p class="idioma" aria-label="{L["idioma"]}"><a href="../../trabajos/{SLUG}.html" hreflang="es" lang="es">ES</a>·<span>EN</span></p>'
    pastillas = '\n'.join(f'        <li>{e(p)}</li>' for p in T['pastillas'])
    tira = '\n'.join(f'        <figure class="{t}"><img src="{r}media/whatsapp/{f}.webp" alt="{e(p)}" loading="lazy"><figcaption>{e(p)}</figcaption></figure>' for t, f, p in T['tira'])
    nums = '\n'.join(f'        <div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in T['numeros'])
    datos = __import__('json').dumps({'@context': 'https://schema.org', '@type': 'CreativeWork', 'name': T['nombre'], 'description': T['descripcion'],
        'url': url(lang), 'image': og, 'dateCreated': '2026', 'genre': T['pastillas'][0], 'inLanguage': L['inlang'],
        'creator': {'@type': 'Person', 'name': 'Max del Caño', 'url': BASE}, 'sameAs': BASE + T['demo']}, ensure_ascii=False)
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(T['titulo_pag'])} — Max del Caño</title>
  <meta name="description" content="{e(T['descripcion'])}">
  <meta name="theme-color" content="#f1efe9">
  <link rel="icon" href="{casos.FAVICON}">
  <link rel="canonical" href="{url(lang)}">
  <link rel="alternate" hreflang="es" href="{url('es')}">
  <link rel="alternate" hreflang="en" href="{url('en')}">
  <link rel="alternate" hreflang="x-default" href="{url('es')}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="{L['locale']}">
  <meta property="og:site_name" content="Max del Caño">
  <meta property="og:title" content="{e(T['titulo_pag'])} — Max del Caño">
  <meta property="og:description" content="{e(T['descripcion'])}">
  <meta property="og:url" content="{url(lang)}">
  <meta property="og:image" content="{og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">{datos}</script>
  <link rel="preload" href="{r}fuentes/bricolage.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{r}estilos.css">
  <link rel="stylesheet" href="{r}mov.css">
  <link rel="stylesheet" href="{r}secciones.css">
  <link rel="stylesheet" href="{r}caso.css">
</head>
<body>
  <a class="saltar" href="#main">{L['saltar']}</a>

  <header class="cabecera">
    <a class="marca" href="../">Max del Caño<span class="punto">.</span></a>
    <nav aria-label="{L['principal']}">
      <ul>
        <li><a href="../#{tr}">{n1}</a></li>
        <li><a href="../#{so}">{n2}</a></li>
        <li><a href="../#{si}">{n3}</a></li>
      </ul>
    </nav>
    {idioma}
    <a class="boton boton-lleno boton-chico" href="#{co}">{L['hablemos']}</a>
  </header>

  <main id="main" tabindex="-1">
    <section class="caso-portada">
      <a class="volver" href="../#{tr}">{L['volver']}</a>
      <ul class="pastillas" aria-label="{L['ficha']}">
{pastillas}
      </ul>
      <h1 class="caso-titulo">{e(T['nombre'])}<span class="punto">.</span></h1>
      <div class="caso-bajada">
        <p>{e(T['bajada'])}</p>
        <a class="boton boton-lleno" href="{r}{T['demo']}" target="_blank" rel="noopener">{T['boton']} <span class="flechita" aria-hidden="true">↗</span></a>
      </div>
    </section>

    <figure class="demo">
      <a href="{r}{T['demo']}" target="_blank" rel="noopener"><img src="{r}media/whatsapp/{T['demo_img']}.webp" width="1600" height="884" alt="{e(T['demo_alt'])}"></a>
      <figcaption>{e(T['demo_pie'])}</figcaption>
    </figure>

    <section class="dos-tiempos" aria-label="{L['dos']}">
      <div>
        <h2 class="rotulo">{L['vi']}</h2>
        <p>{e(T['vi'])}</p>
      </div>
      <div>
        <h2 class="rotulo">{L['idea']}</h2>
        <p class="cita">{e(T['cita'])}</p>
        <p>{e(T['idea'])}</p>
      </div>
    </section>

{tabla('dos-col', T['ia_titulo'], T['ia_cols'], T['ia'], 'ia-titulo')}

{tabla('controles', T['ctl_titulo'], T['ctl_cols'], T['ctl'], 'ctl-titulo')}

    <section class="tira" aria-labelledby="tira-titulo">
      <h2 class="tira-titulo" id="tira-titulo">{T['tira_titulo']}</h2>
      <div class="tira-fila" tabindex="0" aria-label="{L['capturas']}">
{tira}
      </div>
    </section>

{tabla('dos-col', T['lim_titulo'], T['lim_cols'], T['lim'], 'lim-titulo')}

    <section class="tablero" aria-labelledby="tablero-titulo">
      <h2 class="rotulo" id="tablero-titulo">{e(T['tablero_titulo'])}</h2>
      <dl class="tablero-numeros">
{nums}
      </dl>
      <p class="tablero-pie">{e(T['tablero_pie'])}</p>
    </section>

    <a class="siguiente" href="fredy.html">
      <span class="rotulo">{L['siguiente']}</span>
      <span class="siguiente-nombre">{e(T['siguiente'])} <span aria-hidden="true">→</span></span>
    </a>
  </main>

  <footer class="cierre cierre-corto" id="{co}">
    <div class="cierre-pastillas">
      <a class="pastilla pastilla-llena" href="https://linkedin.com/in/maximilianodc" target="_blank" rel="noopener">
        <span class="pastilla-flecha" aria-hidden="true">↗</span>
        <span>{L['puesto']}</span>
      </a>
      <a class="pastilla pastilla-borde" href="mailto:mxmlndc@gmail.com">
        <span class="pastilla-flecha" aria-hidden="true">↗</span>
        <span>{L['mail']} mxmlndc@gmail.com</span>
      </a>
    </div>
    <div class="cierre-pie">
      <nav aria-label="{L['sitio']}">
        <p class="rotulo">{L['sitio']}</p>
        <ul><li><a href="../#{tr}">{n1}</a></li><li><a href="../#{so}">{n2}</a></li><li><a href="../#{si}">{n3}</a></li></ul>
      </nav>
      <nav aria-label="{L['redes']}">
        <p class="rotulo">{L['redes']}</p>
        <ul><li><a href="https://linkedin.com/in/maximilianodc" target="_blank" rel="noopener">LinkedIn</a></li><li><a href="https://behance.net/maximildelca" target="_blank" rel="noopener">Behance</a></li></ul>
      </nav>
      <p class="cierre-firma">Max del Caño<span class="punto">.</span> {L['firma']}</p>
    </div>
  </footer>
</body>
</html>
'''


if __name__ == '__main__':
    # Prototipo: copia de la fuente única, sin el package.json de desarrollo.
    destino = SRC / 'demo/pedido-whatsapp'
    if destino.exists():
        shutil.rmtree(destino)
    shutil.copytree(PROTO, destino, ignore=shutil.ignore_patterns('package.json', '.DS_Store'))
    (SRC / 'trabajos' / f'{SLUG}.html').write_text(pagina('es'), encoding='utf-8')
    (SRC / 'en/work' / f'{SLUG}.html').write_text(pagina('en'), encoding='utf-8')
    faltan = [f for l in TXT for _, f, _ in TXT[l]['tira'] if not (SRC / 'media/whatsapp' / f'{f}.webp').exists()]
    print('caso whatsapp: ES y EN listos, prototipo copiado', '| faltan: ' + ', '.join(faltan) if faltan else '')
