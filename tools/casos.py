#!/usr/bin/env python3
"""Arma src/trabajos/<slug>.html para los 8 trabajos con una sola plantilla.

Uso: python3 tools/casos.py
Los datos salen de ~/web-design-pipeline/<proyecto>/ESTADO.md y brand/direccion/decisiones.md.
Regla: nada sin respaldo, sin teléfonos ni nombres de dueños.
"""
from html import escape
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / 'src'
BASE = 'https://mxdc.vercel.app/'
CONCEPTO = 'Concepto · no encargado'

# Orden de la cinta: define «siguiente trabajo».
CASOS = [
  dict(slug='catalonia', nombre='Catalonia Sur', etiqueta=CONCEPTO, rubro='Alojamiento',
    descripcion='Reservas directas con seña para un apart hotel en Bariloche y un panel que cuenta la comisión que deja de pagarle a Booking.',
    bajada='Reservas directas con seña para un apart hotel en Bariloche, y un panel que muestra lo que deja de pagarle a Booking.',
    link='https://catalonia-sur-muestra.vercel.app/reservar.html',
    desk='uso', mob='home',
    pie_desk='Escritorio · una reserva, de la altura al panel', pie_mob='Celular · la home baja por la ladera',
    vi='Un apart hotel con spa sobre el Nahuel Huapi que dependía de Booking y de su comisión para llenar las noches. Las reseñas lo querían y se quejaban de lo mismo: escaleras y desnivel. El lugar cerró después; quedó como muestra para otros alojamientos.',
    cita='«Se elige por altura.»',
    idea='El complejo trepa la ladera y cada tipo de apart está a otra altura, con otra vista. El sitio da vuelta la queja: la escalera es lo que elegís. Reservar es elegir altura, después fechas en un calendario que no deja cruzar una noche tomada, y pagar la seña. Del otro lado, un panel suma la comisión que no se le pagó a Booking.',
    tira=[
      ('ancha', 'desk-home-1', 'Nivel 1, la punta: el Top View con su foto tipo polaroid', 'El Top View, en la punta'),
      ('angosta', 'mob-home-2', 'El apart Superior en el celular, rotulado con escaleras', 'El Superior, «con escaleras»'),
      ('ancha', 'desk-reservar-1', 'La reserva: los tres niveles con precio y el calendario de noviembre', 'Primero la altura, después las fechas'),
      ('angosta', 'mob-reservar-2', 'Calendario del nivel en el celular, con noches ocupadas y libres', 'No deja cruzar una noche tomada'),
      ('ancha', 'desk-home-3', 'Elegí la altura y las fechas, y el 4,9 de las reseñas', 'Las reseñas, con su número'),
    ],
    ia=[
      ('Sin imagen generada', 'Todas las fotos son del lugar. La IA no tocó ninguna.', 'El corte del edificio lo redibujé como es el real, con sus tres niveles.'),
      ('Claude Code', 'Las tres páginas (sitio, reserva y panel) con datos de ejemplo compartidos: una reserva hecha aparece en el panel.', 'Probé el recorrido de punta a punta: no hay doble reserva.'),
      ('Investigación', 'Reseñas de TripAdvisor y Kayak para sacar el vocabulario del huésped.', 'Booking bloqueó la descarga: no hay ningún dato de Booking inventado.'),
    ],
    tablero_titulo='En números',
    numeros=[('Páginas conectadas', '3'), ('Fotos generadas', '0'), ('Comisión que mide el panel', '15–25 %'), ('TripAdvisor, 493 reseñas', '4,9')],
    tablero_pie='Tarifas, unidades y seña están rotuladas como ejemplo en pantalla. Lo trasplantable a otro alojamiento es la reserva y el panel.'),

  dict(slug='delta', nombre='Delta Charter', etiqueta=CONCEPTO, rubro='Turismo náutico',
    descripcion='Yates, helicóptero y avión privado con una sola empresa: la portada baja del cielo al agua con el scroll, armada con video generado.',
    bajada='Yates, helicóptero y avión privado con una sola empresa. La portada baja del cielo al agua mientras hacés scroll.',
    link='https://demos.gastroapp.ar/delta-charter-hue0/',
    desk='home', mob='uso',
    pie_desk='Escritorio · el video avanza con el scroll', pie_mob='Celular · la consulta sale como pase',
    vi='Una empresa de yates, helicópteros y avión privado con 5,0 en Google y 81 reseñas, y un sitio de 2022 con una foto de la bahía y dos botones. Ninguna página decía qué barcos hay, cuántas personas entran ni que también vuelan.',
    cita='«Por aire y por agua, desde Nordelta.»',
    idea='Ninguna náutica de la zona tiene avión y helicóptero. La portada lo cuenta sin texto: al bajar, el video va del avión sobre las nubes al helicóptero sobre el Delta y a la mesa puesta en el yate, y un pase de embarque de vidrio cambia con cada tramo. La consulta sale por WhatsApp ya escrita.',
    tira=[
      ('ancha', 'desk-home-1', 'Portada con el avión privado sobre las nubes y el pase de embarque de vidrio', 'Tramo 1: avión privado'),
      ('angosta', 'mob-home-2', 'El tramo del helicóptero en el celular', 'Tramo 2, en el celular'),
      ('ancha', 'desk-home-2', 'El helicóptero sobre el Delta al atardecer, con el pase en Helicóptero', 'Tramo 2: helicóptero'),
      ('angosta', 'mob-home-3', 'Los yates con capitán, de noche, en el celular', 'Tramo 3: los yates'),
      ('ancha', 'desk-home-3', 'La bahía con los yates amarrados en hora dorada', 'La bahía, antes de la mesa'),
    ],
    ia=[
      ('Gemini (video)', 'Tres tomas encadenadas: avión sobre nubes, helicóptero sobre el Delta, bahía en hora azul.', 'El último cuadro de cada toma es el primero de la siguiente. Corté los saltos y rehice los finales donde el ala se deformaba.'),
      ('Python + ffmpeg', 'Une las tomas (851 cuadros) y oscurece a azul noche en la costura, sin gastar otra generación.', 'Queda un defecto conocido: una cola fantasma de 4 cuadros en el giro del helicóptero.'),
      ('Claude Code', 'El scroll que avanza y retrocede el video, y la consulta que sale con las cuatro respuestas que pide su WhatsApp.', 'La primera paleta salió genérica y la tiré. Se diseñó recién con referencias.'),
    ],
    tablero_titulo='En números',
    numeros=[('Tomas encadenadas', '3'), ('Cuadros del recorrido', '851'), ('Segundos de video', '35,5'), ('MB del video para scroll', '8,2')],
    tablero_pie='Hecha en un día, del primer análisis a la muestra publicada.'),

  dict(slug='fredy', nombre='Fredy restobar', etiqueta='Cliente · en producción', rubro='Gastronomía',
    descripcion='Sitio en producción para una confitería de miga: pedidos derivados a WhatsApp o PedidosYa, lunch que se cotiza solo y Lighthouse 98 en celular.',
    bajada='Sándwiches de miga en zona norte. Un sitio que no toma el pedido: lo manda rápido al canal que el cliente ya eligió, y arma el lunch para la oficina solo.',
    link='https://fredyrestobar.com.ar', desk='uso', mob='home',
    pie_desk='Escritorio · el lunch se arma solo', pie_mob='Celular · el mismo recorrido, pensado primero para acá',
    vi='Una confitería con 35 años en el barrio y una web que era una plantilla de WordPress: Google tenía indexadas notas de ejemplo sobre sushi y cócteles. Los pedidos ya entraban por WhatsApp y PedidosYa, y el lunch para oficinas se cotizaba a mano, mensaje por mensaje.',
    cita='«La mayoría arma con pan de dos días. Acá llega a la mañana y se fetea en el momento.»',
    idea='Esa frase la dice el dueño en un reel, y manda sobre todo el sitio. Lo demás se corre de en medio: el que quiere retirar va a WhatsApp, el que quiere envío va a PedidosYa, y el lunch se arma en una comanda que suma piezas, precio y para cuántas personas alcanza.',
    tira=[
      ('ancha', 'desk-home-1', 'Sección Lo nuevo: el dueño en video y la milanesa desarmada en capas', 'Lo nuevo: video del dueño y el sándwich en capas'),
      ('angosta', 'mob-home-3', 'El lunch en el celular: tarjetas de productos con botones de más y menos', 'El lunch, de a 6'),
      ('ancha', 'desk-home-3', 'El armador del lunch con la comanda al costado que suma piezas y total', 'La comanda suma sola y sale por WhatsApp'),
      ('angosta', 'mob-carta-2', 'La carta en el celular: nombre, línea de puntos y precio, con buscador', 'La carta, sale de un JSON'),
      ('ancha', 'desk-home-2', 'Mapa del envío gratis a 3 km con la tabla de distancias por barrio', 'Envío gratis a 3 km, con la tabla por barrio'),
    ],
    ia=[
      ('Veo', 'El video de la portada: la pila de sándwiches en un loop de 7 segundos, sin salto, de 0,5 MB.', 'Elegí entre varias tomas y armé el loop de ida y vuelta para que no se note el corte.'),
      ('Gemini', 'Once ediciones de fotos reales del local y de los productos.', 'Revisé cada cartel con zoom: en uno había cambiado «1989» por «1985».'),
      ('Gemini + código', 'El sándwich de milanesa desarmado, partido en 7 capas que se juntan con el scroll.', 'El corte de las capas lo hace un script, no el modelo.'),
      ('Claude Code', 'El build: la carta sale de un JSON, con sus datos estructurados para Google.', 'Cada decisión de diseño se aprobó antes, de a una.'),
    ],
    tablero_titulo='Resultado · Lighthouse en celular, home',
    numeros=[('Rendimiento', '98'), ('Accesibilidad', '100'), ('Buenas prácticas', '100'), ('SEO', '100')],
    tablero_pie='En línea desde el 2 de octubre de 2026 en fredyrestobar.com.ar. La carta da 100 en las cuatro. Dominio, DNS, Search Console y medición de cada botón, también a cargo mío.'),

  dict(slug='peluqueria', nombre='Peluquería canina', etiqueta=CONCEPTO, rubro='Mascotas',
    descripcion='Turnos por WhatsApp e ilustraciones 3D hechas con IA para cada corte, en una peluquería canina de barrio.',
    bajada='Turnos por WhatsApp e ilustraciones 3D hechas con IA para cada corte. Esta es la versión de muestra, sin los datos del local.',
    link='https://demos.gastroapp.ar/peluqueria-canina-muestra-l84f/', desk='uso', mob='home',
    pie_desk='Escritorio · del corte al ticket', pie_mob='Celular · los cortes cuelgan de la soga',
    vi='Una peluquería canina de barrio con 5,0 en Google, sin web ni redes: todo por WhatsApp. Casi todas las reseñas nombran a la misma persona, y las fotos que había no mostraban bien los cortes.',
    cita='«Tu perro ya lo conoce.»',
    idea='Una sola persona, las mismas manos hace diez años. Los cortes cuelgan de una soga con broche, como los pañuelos con los que salen los perros; cada tarjeta se da vuelta y muestra el corte en el perro real. El turno sale como un ticket impreso y abre WhatsApp con el mensaje armado.',
    tira=[
      ('ancha', 'desk-home-1', 'Los cortes como tarjetas colgadas de una soga, cada una con un perro 3D', 'Un perro 3D por corte'),
      ('angosta', 'mob-home-1', 'Las tarjetas colgadas en el celular', 'La soga, en el celular'),
      ('ancha', 'desk-home-2', 'Cómo es un turno: seis pasos y la ficha del día', 'Cómo es un turno, en seis pasos'),
      ('angosta', 'mob-home-3', 'El formulario del turno en el celular', 'El turno, con precio estimado'),
      ('ancha', 'desk-home-3', 'Las reseñas apiladas como tarjetas, con el perro y los años', 'Reseñas en pila'),
    ],
    ia=[
      ('Gemini', 'Veinte ilustraciones 3D de perros, una por corte, a partir de las fotos reales.', 'Las recorté con un script: fondo verde y marca de agua afuera.'),
      ('Claude Code', 'El turno: formulario, ticket impreso y mensaje de WhatsApp armado, con precio y duración según el tamaño.', 'Al enviar, el formulario queda vacío.'),
      ('Script de muestra', 'Arma esta copia para mostrarla a otras peluquerías.', 'Falla si queda cualquier dato del local original.'),
    ],
    tablero_titulo='En números',
    numeros=[('Ilustraciones 3D', '20'), ('Cortes en la soga', '8'), ('Pasos del turno', '6'), ('KB de la página publicada', '980')],
    tablero_pie='La misma página, sin datos, se usa para ofrecerla a otras peluquerías del rubro.'),

  dict(slug='evelia', nombre='Evelia', etiqueta=CONCEPTO, rubro='Gastronomía',
    descripcion='La ilustración de un restaurante recomendado por Michelin, animada por capas: la casa cambia con el turno del servicio.',
    bajada='Su propia ilustración, animada por capas, que cambia con el turno del restaurante.',
    link='https://evelia-maqueta.vercel.app',
    desk='home', mob='carta',
    pie_desk='Escritorio · la casa, con el turno del momento', pie_mob='Celular · la carta, leída de donde la editan',
    vi='Un restaurante recomendado por Michelin en 2025 y 2026, con una ilustración propia de la casa de la abuela que el sitio usaba de fondo quieto, y menú hamburguesa. Las reservas se agotan mes a mes.',
    cita='«La casa de Evelia.»',
    idea='El restaurante es la casa de la abuela, y la home vive al ritmo del servicio: sol al mediodía, ventanas prendidas a la noche, persianas bajas los lunes. Cuando abre la agenda del mes, cuelga un pasacalle. La carta se lee en vivo de donde ya la editan, así nadie tiene que aprender nada nuevo.',
    tira=[
      ('ancha', 'desk-home-1', 'La casa de Evelia: la abuela amasando, ilustrada, junto a la historia', 'La abuela amasa en loop'),
      ('angosta', 'mob-home-1', 'La casa de Evelia en el celular', 'La historia, en el celular'),
      ('ancha', 'desk-home-2', 'Evelia recomienda: cinco platos ilustrados en tarjetas sobre verde', 'Cinco platos, cada uno ilustrado'),
      ('angosta', 'mob-carta-2', 'La carta en el celular con la barra Carta, Reservar y Llegar', 'Carta con su barra fija'),
      ('ancha', 'desk-home-3', 'Antes de venir: las reglas de la reserva en cifras grandes', 'Antes de venir, en cifras'),
    ],
    ia=[
      ('nano-banana-pro', 'Una placa limpia de su ilustración, por US$0,20.', 'Las piezas (sol, auto, la abuela) las separé por diferencia, con código.'),
      ('Código', 'La noche y la casa cerrada, sobre su propio dibujo.', 'La casa cerrada que hizo la IA redibujaba la casa y no calzaba: la armé con la madera de su ilustración.'),
      ('Gemini', 'Platos, objetos y un alfabeto, convertido en la fuente de los títulos.', 'Faltaban la «d» y el «4»: la d es la b espejada.'),
      ('Claude Code', 'La carta en vivo desde su sistema de menú: 144 ítems.', 'Si el sistema falla, queda un respaldo estático.'),
    ],
    tablero_titulo='En números',
    numeros=[('Estados de la casa', '4'), ('Ítems de carta en vivo', '144'), ('Dólares en IA de imagen', '0,20'), ('MB publicados', '2,3')],
    tablero_pie='Estados: mediodía, tarde, noche y cerrada, según la hora de Buenos Aires.'),

  dict(slug='petshop', nombre='Pet shop', etiqueta=CONCEPTO, rubro='Mascotas',
    descripcion='Pet shop con veterinaria: el pedido se arma como receta, con dosis por kilo, un veterinario que lo revisa y un panel con la ficha de cada paciente.',
    bajada='El pedido se arma como una receta: dosis por kilo y un veterinario que lo revisa. Versión sin marca.',
    link='https://demos.gastroapp.ar/pet-shop-muestra-pmk6/', desk='uso', mob='home',
    pie_desk='Escritorio · un pedido, de la mascota a la receta', pie_mob='Celular · envío, retiro y turnos',
    vi='Un pet shop con veterinaria en dos sucursales y envíos a todo el país, con el catálogo como grueso del sitio. El pedido y el turno con el veterinario iban por caminos separados.',
    cita='«Hay veterinario atrás.»',
    idea='Los mismos veterinarios de las sucursales revisan cada pedido. Por eso el pedido se arma como una receta: elegís la mascota, el peso, y la dosis va por kilo. Detrás hay un panel con pedidos, turnos y la ficha de cada paciente, que avisa cuándo le toca la próxima pipeta.',
    tira=[
      ('ancha', 'desk-home-1', 'La dosis va por kilo: el producto delante de la palabra gigante, con selector de peso', 'La dosis va por kilo'),
      ('angosta', 'mob-home-2', 'Opciones de envío en el celular: moto, correo y retiro', 'Envío con su precio'),
      ('ancha', 'desk-home-2', 'Hay veterinario atrás: la receta con sus cuatro garantías', 'La receta y quién la revisa'),
      ('angosta', 'mob-home-3', 'Servicios de la veterinaria en el celular', 'Los servicios, con turno'),
      ('ancha', 'desk-home-3', 'Turno en sucursal y lista de servicios', 'Sacar turno en sucursal'),
    ],
    ia=[
      ('Recorte de fotos', 'Treinta y nueve fotos de producto del catálogo real, sin fondo.', 'Ninguna foto generada: son sus productos.'),
      ('Claude Code', 'Pedido como receta, turno con ocupación y un panel de cinco solapas con la ficha de cada paciente.', 'El rango de kilos 1,3–2,5 se guardaba como 13–25: lo encontré y lo arreglé.'),
      ('Calculadora', 'Para la reunión, cuánto se escapa por mes en recompras y horas libres, con sus números.', 'Guarda los valores en el link, para mandarla después.'),
    ],
    tablero_titulo='En números',
    numeros=[('Productos con foto', '37'), ('Solapas del panel', '5'), ('Fichas de ejemplo', '8'), ('Recorridos conectados', '3')],
    tablero_pie='Pedido, turno y panel comparten los datos: lo que se pide en el sitio aparece en el panel.'),

  dict(slug='end2end', nombre='END 2 END', etiqueta=CONCEPTO, rubro='B2B · iGaming',
    descripcion='Sitio B2B en inglés para un proveedor de bingo multiplayer: una sala que juega sola y la agenda de la feria como cartón de bingo.',
    bajada='Bingo multiplayer para operadores. La agenda de la feria es un cartón de bingo.',
    link='https://end2end-maqueta.vercel.app', desk='home', mob='home',
    pie_desk='Escritorio · los productos funcionando', pie_mob='Celular · en inglés, para la feria',
    vi='Un proveedor de bingo multiplayer, cuentas de jugador e iLottery, con nueve licencias y en el mercado desde 2005, y un sitio que no mostraba el producto andando. En enero de 2027 está ICE Barcelona, la feria donde se cierran las reuniones del año.',
    cita='«End to end, literal.»',
    idea='Con su propia plataforma de cuentas, el nombre por fin es cierto: de la bolilla al pago, en una integración. La portada muestra una sala de 90 bolas que juega sola, y la agenda de la feria es un cartón de bingo: reservar una reunión es marcar un casillero.',
    tira=[
      ('ancha', 'desk-home-1', 'Pila de productos: bingo multiplayer y cuentas de jugador, con imágenes de estudio', 'Los productos, en pila'),
      ('angosta', 'mob-home-1', 'La tarjeta de iLottery en el celular', 'iLottery, en el celular'),
      ('ancha', 'desk-home-2', 'Cita de prensa de ICE London 2024 con una palabra en sticker', 'La prensa, con su cita'),
      ('angosta', 'mob-home-2', 'Notas de prensa en el celular', 'Noticias del sector'),
      ('ancha', 'desk-home-3', 'Fotos reales de ferias y el botón para pedir reunión en ICE Barcelona', 'Las ferias, con fotos reales'),
    ],
    ia=[
      ('Gemini', 'Ocho imágenes de estudio: bolillas de resina, la ficha del logo y fondos.', 'Las bolillas salieron sin números a propósito. El «2» del logo lo monté por código, deformado con la elipse medida de la ficha.'),
      ('Claude Code', 'La sala de bingo que juega sola, ocho pantallas vivas y la agenda de la feria en un cartón.', 'Los turnos tomados del cartón son de ejemplo, y lo dice.'),
      ('Descartado', 'Un video generado y la imagen para compartir.', 'El video era una tarjeta casi quieta; la imagen dibujó la ficha hueca.'),
    ],
    tablero_titulo='En números',
    numeros=[('Bolas en la sala en vivo', '90'), ('Pantallas en el carrusel', '8'), ('Turnos en el cartón', '27'), ('Días de feria', '3')],
    tablero_pie='El cartón: 3 filas por los días de ICE, 9 columnas por los turnos de 45 minutos.'),

  dict(slug='perro', nombre='Perro', etiqueta=CONCEPTO, rubro='Gastronomía',
    descripcion='Una panchería con voz de fanzine punk: collage impreso, el pan y la salchicha antes que cualquier precio, y un chorro de mostaza que navega la página.',
    bajada='Panchería con voz de fanzine punk. Dos cosas importan: el pan y la salchicha.',
    link='https://demos.gastroapp.ar/perro-muestra-u7f2/',
    desk='home', mob='home',
    pie_desk='Escritorio · tapa de fanzine', pie_mob='Celular · la decisión es de dos minutos',
    vi='Una panchería con dos cosas propias, el pan y la salchicha, que cobra más que un pancho de kiosco y menos que cualquier otra cena. La trampa del rubro es el diner americano de los 50: cromo, vichy y neón.',
    cita='«Sí, sale más que un pancho de kiosco.»',
    idea='La objeción número uno es qué tiene de especial, así que el pan y la salchicha se explican antes de cualquier precio. La voz es de fanzine punk, la página es un collage impreso, y un chorro de mostaza marca el avance y sirve de navegación.',
    tira=[
      ('ancha', 'desk-home-1', 'Son cinco, no hay veinte: el menú corto con fotos recortadas', 'El menú: cinco panchos'),
      ('angosta', 'mob-home-2', 'Los combos en el celular, como recortes pegados', 'Los combos'),
      ('ancha', 'desk-home-2', 'Combos como tickets pegados con precio y la sección del precio', 'Precios recién después del pan'),
      ('angosta', 'mob-home-3', 'Dirección y horarios en el celular', 'Dónde y cuándo'),
      ('ancha', 'desk-home-3', 'El manifiesto en un papel pegado sobre foto', 'El manifiesto'),
    ],
    ia=[
      ('APImart', 'Ocho generaciones para el collage, US$0,21 en total, y 19 recortes.', 'El logo es tipográfico: uno generado habría sido peor.'),
      ('Claude Code', 'La página densa como tapa de fanzine, con el chorro de mostaza como progreso.', 'El rótulo arriba de cada título era un molde: lo rehice con cuatro formas y ninguna en más de 3 de las 7 secciones.'),
      ('Datos', 'Dirección, horarios y precios de ejemplo, anclados a precios reales del rubro.', 'Está declarado en una franja arriba de la página.'),
    ],
    tablero_titulo='En números',
    numeros=[('Dólares en imágenes', '0,21'), ('Recortes del collage', '19'), ('Formas de sección', '4'), ('Criterios de QA aprobados', '11/11')],
    tablero_pie='Verificado en 375, 390 y 768 px: cuatro errores encontrados y corregidos.'),
]

# ---------- Inglés: mismos casos, mismo orden. Lo que no se nombra acá sale del español (slug, link, medios). ----------
CONCEPT = 'Concept · not commissioned'
EN = {
  'catalonia': dict(nombre='Catalonia Sur', etiqueta=CONCEPT, rubro='Hospitality',
    descripcion='Direct bookings with a deposit for an apart-hotel in Bariloche, and a dashboard that adds up the commission it no longer pays Booking.',
    bajada='Direct bookings with a deposit for an apart-hotel in Bariloche, and a dashboard that shows what it no longer pays Booking.',
    pie_desk='Desktop · one booking, from the floor to the dashboard', pie_mob='Mobile · the home page runs down the hillside',
    vi='An apart-hotel with a spa above Lake Nahuel Huapi that relied on Booking, and its commission, to fill its nights. Guests loved it and all complained about the same thing: stairs and slopes. The place closed later; the site stayed on as a sample for other hotels.',
    cita='“You choose by height.”',
    idea='The building climbs the hillside, and each type of unit sits at a different height, with a different view. The site turns the complaint around: the stairs are what you’re choosing. Booking means picking a height, then dates on a calendar that won’t let you cross a taken night, then paying the deposit. On the other side, a dashboard adds up the commission that didn’t go to Booking.',
    tira=['Level 1, the top: the Top View with its polaroid-style photo|The Top View, at the top',
          'The Superior unit on mobile, labeled “with stairs”|The Superior, “with stairs”',
          'Booking: the three levels with prices and the November calendar|Height first, then dates',
          'The level’s calendar on mobile, with taken and free nights|It won’t let you cross a taken night',
          'Pick your height and dates, and the 4.9 from reviews|Reviews, with their number'],
    ia=[('No generated images', 'Every photo is of the actual place. AI didn’t touch any of them.', 'I redrew the building’s cross-section to match the real one, with its three levels.'),
        ('Claude Code', 'The three pages (site, booking and dashboard) on shared sample data: a booking you make shows up in the dashboard.', 'I tested the flow end to end: no double bookings.'),
        ('Research', 'TripAdvisor and Kayak reviews, to pull out the words guests actually use.', 'Booking blocked the download, so there’s no made-up Booking data.')],
    tablero_titulo='By the numbers',
    numeros=[('Connected pages', '3'), ('Generated photos', '0'), ('Commission the dashboard tracks', '15–25%'), ('TripAdvisor, 493 reviews', '4.9')],
    tablero_pie='Rates, units and deposit are labeled as samples on screen. What carries over to another hotel is the booking flow and the dashboard.'),

  'delta': dict(nombre='Delta Charter', etiqueta=CONCEPT, rubro='Yacht charter',
    descripcion='Yachts, helicopter and private jet from one company: the hero drops from sky to water as you scroll, built with generated video.',
    bajada='Yachts, helicopter and private jet from one company. The hero drops from sky to water as you scroll.',
    pie_desk='Desktop · the video moves with the scroll', pie_mob='Mobile · the inquiry goes out as a boarding pass',
    vi='A yacht, helicopter and private jet company with a 5.0 on Google from 81 reviews, and a 2022 site with one photo of the bay and two buttons. No page said which boats they had, how many people fit, or that they also fly.',
    cita='“By air and by water, from Nordelta.”',
    idea='No other charter company in the area has a jet and a helicopter. The hero says it without words: as you scroll, the video goes from the jet above the clouds to the helicopter over the Delta to the table set on the yacht, and a glass boarding pass changes with each leg. The inquiry goes out on WhatsApp, already written.',
    tira=['Hero with the private jet above the clouds and the glass boarding pass|Leg 1: private jet',
          'The helicopter leg on mobile|Leg 2, on mobile',
          'The helicopter over the Delta at sunset, with the pass set to Helicopter|Leg 2: helicopter',
          'Skippered yachts at night, on mobile|Leg 3: the yachts',
          'The bay with the yachts moored at golden hour|The bay, before the table'],
    ia=[('Gemini (video)', 'Three chained shots: jet above the clouds, helicopter over the Delta, the bay at blue hour.', 'Each shot’s last frame is the next one’s first. I cut the jumps and redid the endings where the wing warped.'),
        ('Python + ffmpeg', 'Joins the shots (851 frames) and darkens to night blue at the seam, without spending another generation.', 'One known flaw remains: a 4-frame ghost trail on the helicopter’s turn.'),
        ('Claude Code', 'The scroll that plays the video forward and back, and the inquiry that goes out with the four answers their WhatsApp asks for.', 'The first palette came out generic and I threw it away. It was designed only once there were references.')],
    tablero_titulo='By the numbers',
    numeros=[('Chained shots', '3'), ('Frames in the journey', '851'), ('Seconds of video', '35.5'), ('MB of scroll video', '8.2')],
    tablero_pie='Done in one day, from first analysis to published sample.'),

  'fredy': dict(nombre='Fredy restobar', etiqueta='Client · live', rubro='Food',
    descripcion='Live site for a finger-sandwich shop: orders routed to WhatsApp or PedidosYa, catering that quotes itself, and Lighthouse 98 on mobile.',
    bajada='Finger sandwiches in Buenos Aires’ north side. A site that doesn’t take the order: it sends people fast to the channel they already use, and builds the office catering order on its own.',
    pie_desk='Desktop · the catering order builds itself', pie_mob='Mobile · the same flow, designed for here first',
    vi='A sandwich shop with 35 years in the neighborhood and a site that was a WordPress template: Google had indexed sample posts about sushi and cocktails. Orders already came in through WhatsApp and PedidosYa, and office catering was quoted by hand, one message at a time.',
    cita='“Most places use two-day-old bread. Ours arrives in the morning and gets sliced on the spot.”',
    idea='The owner says that in a reel, and it rules the whole site. Everything else gets out of the way: pickup goes to WhatsApp, delivery goes to PedidosYa, and catering is built on an order ticket that adds up pieces, price and how many people it feeds.',
    tira=['What’s new: the owner on video and the milanesa sandwich taken apart in layers|What’s new: the owner on video and the sandwich in layers',
          'Catering on mobile: product cards with plus and minus buttons|Catering, in sixes',
          'The catering builder with the order ticket on the side adding up pieces and total|The ticket adds itself up and goes out on WhatsApp',
          'The menu on mobile: name, dotted line and price, with search|The menu, fed from a JSON file',
          'Free delivery map within 3 km, with distances by neighborhood|Free delivery within 3 km, with the table by neighborhood'],
    ia=[('Veo', 'The hero video: the stack of sandwiches in a seamless 7-second loop, 0.5 MB.', 'I picked from several takes and built a back-and-forth loop so the cut doesn’t show.'),
        ('Gemini', 'Eleven edits of real photos of the shop and its products.', 'I checked every sign zoomed in: in one, it had changed “1989” to “1985”.'),
        ('Gemini + code', 'The milanesa sandwich taken apart into 7 layers that come together as you scroll.', 'The layers are cut by a script, not the model.'),
        ('Claude Code', 'The build: the menu comes from a JSON file, with structured data for Google.', 'Every design decision was approved first, one at a time.')],
    tablero_titulo='Result · Lighthouse on mobile, home page',
    numeros=[('Performance', '98'), ('Accessibility', '100'), ('Best practices', '100'), ('SEO', '100')],
    tablero_pie='Live since October 2, 2026 at fredyrestobar.com.ar. The menu page scores 100 on all four. Domain, DNS, Search Console and tracking on every button were on me too.'),

  'peluqueria': dict(nombre='Dog groomer', etiqueta=CONCEPT, rubro='Pets',
    descripcion='WhatsApp booking and an AI-made 3D illustration for every cut, for a neighborhood dog groomer.',
    bajada='WhatsApp booking and an AI-made 3D illustration for every cut. This is the sample version, without the shop’s details.',
    pie_desk='Desktop · from the cut to the ticket', pie_mob='Mobile · the cuts hang from a line',
    vi='A neighborhood dog groomer with a 5.0 on Google, no website and no social media: everything ran through WhatsApp. Almost every review names the same person, and the existing photos didn’t show the cuts well.',
    cita='“Your dog already knows him.”',
    idea='One person, the same hands for ten years. The cuts hang from a line with clothespins, like the bandanas the dogs leave with; each card flips to show the cut on a real dog. The booking comes out as a printed ticket and opens WhatsApp with the message ready.',
    tira=['The cuts as cards hanging from a line, each with a 3D dog|A 3D dog for every cut',
          'The hanging cards on mobile|The line, on mobile',
          'How a booking works: six steps and the day’s card|How a booking works, in six steps',
          'The booking form on mobile|Booking, with an estimated price',
          'Reviews stacked as cards, with the dog and its years|Reviews in a stack'],
    ia=[('Gemini', 'Twenty 3D dog illustrations, one per cut, based on the real photos.', 'I cut them out with a script: green background and watermark removed.'),
        ('Claude Code', 'The booking: form, printed ticket and a ready-made WhatsApp message, with price and duration by dog size.', 'After sending, the form is left empty.'),
        ('Sample script', 'Builds this copy to show to other groomers.', 'It fails if any detail from the original shop is left.')],
    tablero_titulo='By the numbers',
    numeros=[('3D illustrations', '20'), ('Cuts on the line', '8'), ('Booking steps', '6'), ('KB of the published page', '980')],
    tablero_pie='The same page, without details, is used to pitch it to other groomers.'),

  'evelia': dict(nombre='Evelia', etiqueta=CONCEPT, rubro='Food',
    descripcion='A Michelin-recommended restaurant’s illustration, animated in layers: the house changes with the service.',
    bajada='Their own illustration, animated in layers, changing with the restaurant’s service hours.',
    pie_desk='Desktop · the house, at the current time of day', pie_mob='Mobile · the menu, read from where they edit it',
    vi='A restaurant recommended by Michelin in 2025 and 2026, with its own illustration of grandma’s house that the site used as a still background, and a hamburger menu. Reservations sell out month after month.',
    cita='“Evelia’s house.”',
    idea='The restaurant is grandma’s house, and the home page lives on the service’s schedule: sun at lunch, lit windows at night, shutters down on Mondays. When the month’s bookings open, a banner goes up across the street. The menu is read live from where they already edit it, so nobody has to learn anything new.',
    tira=['Evelia’s house: grandma kneading, illustrated, next to the story|Grandma kneads on a loop',
          'Evelia’s house on mobile|The story, on mobile',
          'Evelia recommends: five illustrated dishes on cards over green|Five dishes, each illustrated',
          'The menu on mobile with the Menu, Book and Directions bar|Menu with its sticky bar',
          'Before you come: booking rules in big figures|Before you come, in figures'],
    ia=[('nano-banana-pro', 'A clean plate of their illustration, for US$0.20.', 'I separated the pieces (sun, car, grandma) by difference, in code.'),
        ('Code', 'Night, and the closed house, on top of their own drawing.', 'The closed house the AI made redrew the building and didn’t line up: I built it from the wood in their illustration.'),
        ('Gemini', 'Dishes, objects and an alphabet, turned into the headline font.', 'The “d” and the “4” were missing: the d is a mirrored b.'),
        ('Claude Code', 'The menu, live from their menu system: 144 items.', 'If the system fails, a static backup stays up.')],
    tablero_titulo='By the numbers',
    numeros=[('States of the house', '4'), ('Live menu items', '144'), ('Dollars on AI images', '0.20'), ('MB published', '2.3')],
    tablero_pie='States: midday, afternoon, night and closed, by Buenos Aires time.'),

  'petshop': dict(nombre='Pet shop', etiqueta=CONCEPT, rubro='Pets',
    descripcion='A pet shop with a vet clinic: orders work like a prescription, with dose by weight, a vet who checks it, and a dashboard with each patient’s file.',
    bajada='Orders work like a prescription: dose by weight, checked by a vet. Unbranded version.',
    pie_desk='Desktop · one order, from the pet to the prescription', pie_mob='Mobile · delivery, pickup and appointments',
    vi='A pet shop with a vet clinic across two locations, shipping nationwide, with the catalog as the bulk of the site. Orders and vet appointments went down separate paths.',
    cita='“There’s a vet behind it.”',
    idea='The same vets from the stores check every order. So the order works like a prescription: you pick the pet, its weight, and the dose goes by weight. Behind it is a dashboard with orders, appointments and each patient’s file, which flags when the next flea treatment is due.',
    tira=['Dose by weight: the product in front of the giant word, with a weight picker|Dose goes by weight',
          'Delivery options on mobile: motorbike, courier and pickup|Delivery, with its price',
          'There’s a vet behind it: the prescription and its four guarantees|The prescription and who checks it',
          'Vet services on mobile|Services, with booking',
          'In-store appointments and the list of services|Booking at a location'],
    ia=[('Photo cutouts', 'Thirty-nine product photos from the real catalog, background removed.', 'No generated photos: they’re their products.'),
        ('Claude Code', 'Prescription-style ordering, booking with availability, and a five-tab dashboard with each patient’s file.', 'The 1.3–2.5 kg range was being saved as 13–25: I found it and fixed it.'),
        ('Calculator', 'For the meeting: how much slips away each month in missed reorders and staff hours, with their own numbers.', 'It stores the values in the link, so it can be sent afterwards.')],
    tablero_titulo='By the numbers',
    numeros=[('Products with photos', '37'), ('Dashboard tabs', '5'), ('Sample patient files', '8'), ('Connected flows', '3')],
    tablero_pie='Orders, booking and dashboard share data: what’s ordered on the site shows up in the dashboard.'),

  'end2end': dict(nombre='END 2 END', etiqueta=CONCEPT, rubro='B2B · iGaming',
    descripcion='English-language B2B site for a multiplayer bingo provider: a bingo room that plays itself and the trade-show schedule as a bingo card.',
    bajada='Multiplayer bingo for operators. The trade-show schedule is a bingo card.',
    pie_desk='Desktop · the products, running', pie_mob='Mobile · in English, for the trade show',
    vi='A provider of multiplayer bingo, player accounts and iLottery, with nine licenses and in the market since 2005, and a site that didn’t show the product working. ICE Barcelona is in January 2027: the show where the year’s meetings get booked.',
    cita='“End to end, literally.”',
    idea='With their own player account platform, the name is finally true: from the ball draw to the payout, in one integration. The hero shows a 90-ball room that plays itself, and the trade-show schedule is a bingo card: booking a meeting means marking a square.',
    tira=['Product stack: multiplayer bingo and player accounts, with studio images|The products, stacked',
          'The iLottery card on mobile|iLottery, on mobile',
          'A press quote from ICE London 2024 with one word as a sticker|The press, with its quote',
          'Press notes on mobile|Industry news',
          'Real trade-show photos and the button to book a meeting at ICE Barcelona|Trade shows, with real photos'],
    ia=[('Gemini', 'Eight studio images: resin balls, the logo chip and backgrounds.', 'The balls came out without numbers on purpose. I placed the logo’s “2” in code, warped to the measured ellipse of the chip.'),
        ('Claude Code', 'The bingo room that plays itself, eight live screens and the trade-show schedule as a card.', 'The taken slots on the card are samples, and it says so.'),
        ('Dropped', 'A generated video and the share image.', 'The video was an almost-still card; the image drew the chip hollow.')],
    tablero_titulo='By the numbers',
    numeros=[('Balls in the live room', '90'), ('Screens in the carousel', '8'), ('Slots on the card', '27'), ('Days of the show', '3')],
    tablero_pie='The card: 3 rows for the days of ICE, 9 columns for the 45-minute slots.'),

  'perro': dict(nombre='Perro', etiqueta=CONCEPT, rubro='Food',
    descripcion='A hot dog joint with a punk-zine voice: printed collage, the bun and the sausage before any price, and a squirt of mustard that navigates the page.',
    bajada='A hot dog joint with a punk-zine voice. Two things matter: the bun and the sausage.',
    pie_desk='Desktop · a zine cover', pie_mob='Mobile · a two-minute decision',
    vi='A hot dog joint with two things of its own, the bun and the sausage, that charges more than a corner-store hot dog and less than any other dinner. The trap in this category is the 1950s American diner: chrome, gingham and neon.',
    cita='“Yes, it costs more than a corner-store hot dog.”',
    idea='Objection number one is what’s so special about it, so the bun and the sausage get explained before any price. The voice is a punk zine, the page is a printed collage, and a squirt of mustard marks your progress and works as navigation.',
    tira=['There are five, not twenty: the short menu with cut-out photos|The menu: five hot dogs',
          'Combos on mobile, as pasted cut-outs|The combos',
          'Combos as pasted tickets with prices, and the price section|Prices only after the bun',
          'Address and hours on mobile|Where and when',
          'The manifesto on paper pasted over a photo|The manifesto'],
    ia=[('APImart', 'Eight generations for the collage, US$0.21 in total, and 19 cutouts.', 'The logo is typographic: a generated one would have been worse.'),
        ('Claude Code', 'The dense page as a zine cover, with the squirt of mustard as progress.', 'The label above each heading was a template: I redid it with four shapes, none in more than 3 of the 7 sections.'),
        ('Data', 'Sample address, hours and prices, anchored to real prices in the category.', 'It’s stated in a strip at the top of the page.')],
    tablero_titulo='By the numbers',
    numeros=[('Dollars on images', '0.21'), ('Collage cutouts', '19'), ('Section shapes', '4'), ('QA criteria passed', '11/11')],
    tablero_pie='Checked at 375, 390 and 768 px: four bugs found and fixed.'),
}

# Textos fijos de la plantilla, por idioma.
UI = {
  'es': dict(lang='es', locale='es_AR', inlang='es-AR', dir='trabajos/', raiz='../', anclas=('trabajos', 'sobre-mi', 'sistema', 'contacto'),
    saltar='Ir al contenido', principal='Principal', nav=('Trabajos', 'Sobre mí', 'El sistema'), hablemos='Hablemos',
    idioma='Idioma', volver='← Trabajos', ficha='Ficha', ver='Ver el sitio', pantallas='El sitio andando, en escritorio y en celular',
    dos='Lo que vi y la idea', vi='Lo que vi', idea='La idea', tira='Por dentro', capturas='Capturas del sitio',
    planilla='Cómo usé <em>IA</em>', cols=('Herramienta', 'Para qué', 'Lo que corregí a mano'), siguiente='Siguiente trabajo',
    puesto='<strong>¿Tenés un puesto?</strong> Escribime por LinkedIn.', mail='<strong>¿Preferís mail?</strong>',
    sitio='Sitio', redes='Redes', firma='Este sitio salió del mismo sistema que los ocho trabajos.', en_espanol=None),
  'en': dict(lang='en', locale='en_US', inlang='en', dir='en/work/', raiz='../../', anclas=('work', 'about', 'system', 'contact'),
    saltar='Skip to content', principal='Main', nav=('Work', 'About', 'The system'), hablemos='Let’s talk',
    idioma='Language', volver='← Work', ficha='Details', ver='Visit the site', pantallas='The site running, on desktop and mobile',
    dos='What I saw and the idea', vi='What I saw', idea='The idea', tira='Inside', capturas='Screenshots of the site',
    planilla='How I used <em>AI</em>', cols=('Tool', 'What for', 'What I fixed by hand'), siguiente='Next project',
    puesto='<strong>Hiring?</strong> Message me on LinkedIn.', mail='<strong>Prefer email?</strong>',
    sitio='Site', redes='Social', firma='This site came out of the same system as the eight projects.', en_espanol='Site in Spanish'),
}


def en(c):
    """El caso en inglés: los textos de EN sobre los datos del español."""
    t = EN[c['slug']]
    d = {**c, **{k: v for k, v in t.items() if k != 'tira'}}
    d['tira'] = [(tipo, f, *t['tira'][i].split('|')) for i, (tipo, f, _, _) in enumerate(c['tira'])]
    return d

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%231c1814'/%3E%3Ctext x='5' y='24' font-family='Arial Black,sans-serif' font-weight='900' font-size='21' fill='%23f1efe9'%3EM%3C/text%3E%3Ccircle cx='26' cy='22' r='3' fill='%23F85003'/%3E%3C/svg%3E"
e = escape


def datos(c, L):
    import json
    d = {'@context': 'https://schema.org', '@type': 'CreativeWork', 'name': c['nombre'], 'description': c['descripcion'],
         'url': f"{BASE}{L['dir']}{c['slug']}.html", 'image': f"{BASE}og/{og(c, L)}.jpg", 'dateCreated': '2026',
         'genre': c['etiqueta'], 'inLanguage': L['inlang'],
         'creator': {'@type': 'Person', 'name': 'Max del Caño', 'url': BASE}}
    if c['link']: d['sameAs'] = c['link']
    return json.dumps(d, ensure_ascii=False)


def og(c, L):
    return c['slug'] if L['lang'] == 'es' else f"en-{c['slug']}"


def escena(c, tipo, L):
    vista, pagina = ('desk', c['desk']) if tipo == 'notebook' else ('mob', c['mob'])
    pie = c['pie_desk'] if tipo == 'notebook' else c['pie_mob']
    m = f"{L['raiz']}media/{c['slug']}/{vista}-{pagina}"
    return f'''      <figure>
        <div class="escena" data-clave="{c['slug']}-{tipo}" data-tipo="{tipo}">
          <img src="{L['raiz']}escenas/{c['slug']}-{tipo}.webp" alt="" draggable="false">
          <div class="pantalla"><video poster="{m}-fold.webp" data-src="{m}.mp4" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video></div>
        </div>
        <figcaption>{e(pie)}</figcaption>
      </figure>'''


def pagina(c, sig, L):
    cliente = c['etiqueta'].startswith('Client')
    if c['link']:
        accion = f'<a class="boton boton-lleno" href="{c["link"]}" target="_blank" rel="noopener">{L['ver']} <span class="flechita" aria-hidden="true">↗</span></a>'
    else:
        accion = f'<p class="sin-link">{e(c["sin_link"])}</p>'
    tira = '\n'.join(
        f'        <figure class="{t}"><img src="{L['raiz']}media/{c["slug"]}/{f}.webp" alt="{e(alt)}" loading="lazy"><figcaption>{e(pie)}</figcaption></figure>'
        for t, f, alt, pie in c['tira'])
    ia = '\n'.join(f'          <tr><th scope="row">{e(h)}</th><td>{e(a)}</td><td>{e(b)}</td></tr>' for h, a, b in c['ia'])
    tr, so, si, co = L['anclas']
    url = lambda l, slug=c['slug']: f"{BASE}{UI[l]['dir']}{slug}.html"
    if L['lang'] == 'es':
        idioma = f'<p class="idioma" aria-label="{L["idioma"]}"><span>ES</span>·<a href="../en/work/{c["slug"]}.html" hreflang="en" lang="en">EN</a></p>'
    else:
        idioma = f'<p class="idioma" aria-label="{L["idioma"]}"><a href="../../trabajos/{c["slug"]}.html" hreflang="es" lang="es">ES</a>·<span>EN</span></p>'
    espanol = f'\n        <li>{L["en_espanol"]}</li>' if L['en_espanol'] and c['slug'] != 'end2end' else ''
    n1, n2, n3 = L['nav']
    nums = '\n'.join(f'        <div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in c['numeros'])
    return f'''<!doctype html>
<html lang="{L['lang']}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(c['nombre'])} — Max del Caño</title>
  <meta name="description" content="{e(c['descripcion'])}">
  <meta name="theme-color" content="#f1efe9">
  <link rel="icon" href="{FAVICON}">
  <link rel="canonical" href="{url(L['lang'])}">
  <link rel="alternate" hreflang="es" href="{url('es')}">
  <link rel="alternate" hreflang="en" href="{url('en')}">
  <link rel="alternate" hreflang="x-default" href="{url('es')}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="{L['locale']}">
  <meta property="og:site_name" content="Max del Caño">
  <meta property="og:title" content="{e(c['nombre'])} — Max del Caño">
  <meta property="og:description" content="{e(c['descripcion'])}">
  <meta property="og:url" content="{url(L['lang'])}">
  <meta property="og:image" content="{BASE}og/{og(c, L)}.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">{datos(c, L)}</script>
  <link rel="preload" href="{L['raiz']}fuentes/bricolage.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="{L['raiz']}escenas/{c['slug']}-notebook.webp" as="image">
  <link rel="modulepreload" href="{L['raiz']}caso.js">
  <link rel="modulepreload" href="{L['raiz']}pantalla.js">
  <link rel="modulepreload" href="{L['raiz']}escenas/pantallas.js">
  <link rel="stylesheet" href="{L['raiz']}estilos.css">
  <link rel="stylesheet" href="{L['raiz']}mov.css">
  <link rel="stylesheet" href="{L['raiz']}secciones.css">
  <link rel="stylesheet" href="{L['raiz']}caso.css">
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
        <li{' class="pastilla-cliente"' if cliente else ''}>{e(c['etiqueta'])}</li>
        <li>{e(c['rubro'])}</li>
        <li>2026</li>{espanol}
      </ul>
      <h1 class="caso-titulo">{e(c['nombre'])}<span class="punto">.</span></h1>
      <div class="caso-bajada">
        <p>{e(c['bajada'])}</p>
        {accion}
      </div>
    </section>

    <section class="pantallas" aria-label="{L['pantallas']}">
{escena(c, 'notebook', L)}
{escena(c, 'celular', L)}
    </section>

    <section class="dos-tiempos" aria-label="{L['dos']}">
      <div>
        <h2 class="rotulo">{L['vi']}</h2>
        <p>{e(c['vi'])}</p>
      </div>
      <div>
        <h2 class="rotulo">{L['idea']}</h2>
        <p class="cita">{e(c['cita'])}</p>
        <p>{e(c['idea'])}</p>
      </div>
    </section>

    <section class="tira" aria-labelledby="tira-titulo">
      <h2 class="tira-titulo" id="tira-titulo">{L['tira']}</h2>
      <div class="tira-fila" tabindex="0" aria-label="{L['capturas']}">
{tira}
      </div>
    </section>

    <section class="planilla" aria-labelledby="planilla-titulo">
      <h2 class="planilla-titulo" id="planilla-titulo">{L['planilla']}</h2>
      <table>
        <thead><tr>{''.join(f'<th scope="col">{x}</th>' for x in L['cols'])}</tr></thead>
        <tbody>
{ia}
        </tbody>
      </table>
    </section>

    <section class="tablero" aria-labelledby="tablero-titulo">
      <h2 class="rotulo" id="tablero-titulo">{e(c['tablero_titulo'])}</h2>
      <dl class="tablero-numeros">
{nums}
      </dl>
      <p class="tablero-pie">{e(c['tablero_pie'])}</p>
    </section>

    <a class="siguiente" href="{sig['slug']}.html">
      <span class="rotulo">{L['siguiente']}</span>
      <span class="siguiente-nombre">{e(sig['nombre'])} <span aria-hidden="true">→</span></span>
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

  <script src="{L['raiz']}caso.js" type="module"></script>
</body>
</html>
'''


if __name__ == '__main__':
    faltan = []
    for i, c in enumerate(CASOS):
        sig = CASOS[(i + 1) % len(CASOS)]
        for _, f, _, _ in c['tira']:
            if not (SRC / 'media' / c['slug'] / f'{f}.webp').exists():
                faltan.append(f"{c['slug']}/{f}")
        for v, p in (('desk', c['desk']), ('mob', c['mob'])):
            if not (SRC / 'media' / c['slug'] / f'{v}-{p}.mp4').exists():
                faltan.append(f"{c['slug']}/{v}-{p}.mp4")
        (SRC / 'trabajos' / f"{c['slug']}.html").write_text(pagina(c, sig, UI['es']), encoding='utf-8')
        (SRC / 'en' / 'work').mkdir(parents=True, exist_ok=True)
        (SRC / 'en' / 'work' / f"{c['slug']}.html").write_text(pagina(en(c), en(sig), UI['en']), encoding='utf-8')
    urls = [BASE, f'{BASE}en/'] + [f"{BASE}{UI[l]['dir']}{c['slug']}.html" for l in UI for c in CASOS]
    (SRC / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n', encoding='utf-8')
    print(f'{len(CASOS)} páginas en src/trabajos/ y src/en/work/', '| faltan: ' + ', '.join(faltan) if faltan else '| todo el material existe')
