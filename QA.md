# QA — portfolio mxdc (Fase 7, 2026-11-05)

Revisado sobre `src/` en local (`python3 -m http.server 8710` desde la raíz). Los números de velocidad definitivos se toman en la URL publicada (abajo, «Recibos»).

## Rubric anti-genérico

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Trazabilidad de tokens | Pasa | Colores, tamaños y espacios en el `:root` de `src/estilos.css`. Los dos últimos sueltos (`#111` de la pantalla y el negro del vidrio en `mov.css`) pasaron a `--vidrio`. Quedan fijos solo los de las demos ajenas (franja de Perro), que no son de este sitio. |
| 2 | Lista negra | Pasa (1 con justificación) | Sin hero centrado, sin tres cards con ícono, sin gradiente, sin stock. Rótulo mono sobre título aparece 1 vez en la home («Quién está del otro lado») y en «Lo que vi / La idea» de los casos: la mono (Geist) es la del sitio anterior, aprobada como identidad; el registro la marca como recurso quemado, este proyecto la hereda, no la elige. |
| 3 | Arquetipo justificado | Pasa | Editorial asimétrico: titular enorme a la izquierda + dibujos de línea, tomado de la referencia endcap que eligió Max (G3/G6). |
| 4 | Assets propios | Pasa | Escenas generadas para este proyecto (16, Gemini, corridas por Max); videos y capturas grabados de los sitios reales; foto real de Max. Cero stock. |
| 5 | Copy con datos | Pasa | Cada caso con números de su ESTADO (Lighthouse 98, 851 cuadros, 20 ilustraciones, 144 ítems…). Cinco frases sacadas por falta de respaldo: `content/copy.md`. Filtro de frases de IA: 0. |
| 6 | Test de sustitución | Pasa | Con otro nombre, el sitio no sirve a otro diseñador: los 8 trabajos, sus escenas y el sistema son de Max. |
| 7 | Mobile real | Pasa en emulación · falta el teléfono de Max | 9 páginas a 375, 390 y 768: 0 desbordes, 0 errores, toques ≥ 44 px, letra ≥ 11,5 px, sin inputs. Portada apilada entre 761 y 1100 px (el título se partía en tres renglones a 768). |
| 8 | Contraste | Pasa | Calculado: carbón/tiza 16,3; grafito/tiza 14,0; piedra/tiza 6,1; naranja profundo/tiza 4,7; tiza tenue/carbón 12,3; naranja/carbón 5,6; carbón/naranja 5,6. El borde naranja de las pastillas da 2,9: no son controles, son etiquetas, y su letra va a 4,7. |
| 9 | Jerarquía en 5 s | Pasa | Primer pantallazo: «Diseño & código», tres pastillas con el puesto, dos botones y el primer trabajo prendido asomando. |
| 10 | SEO base | Pasa | Title y description únicos (≤ 60 / ≤ 155), un H1 por página, canonical, OG con imagen 1200×630 por página, `Person` + `CreativeWork`, sitemap (9 URLs), robots. `content/seo-strategy.md`. |
| 11 | Ojos frescos | Pasa | Arreglado en la pasada: el marco naranja que abrazaba la leyenda, la regla con rótulos encimados, «Buenos Aires» tapado por una forma, el saludo tapado en celular, la cita chica de «La idea», la tira pegada al borde, el ticket fuera de cuadro en la grabación de la peluquería. |
| 12 | Sustitución cruzada | Pasa | Con los tokens de Fredy (dorado/negro, Plus Jakarta + Lora) este HTML no da un restobar: no hay pedido ni carta, la estructura es cinta de escenas + casos. Home: 6 aperturas distintas en 6 secciones, ninguna forma pasa de 1. Registrado en `registro-convergencia.md`. |

## Medido en local (Lighthouse 12.8, celular simulado)
| Página | Rend. / Acc. / BP / SEO | LCP | CLS |
|---|---|---|---|
| home | 87 / 100 / 96 / 100 | 4,0 s | 0 |
| trabajos/fredy | 88 / 100 / 96 / 100 | 3,9 s | 0 |

El servidor local no comprime ni usa HTTP/2. Cambios que ya entraron: fuentes alojadas (170 KB, latín), precarga de la fuente y de las escenas del primer pantallazo, esquinas de pantalla como módulo (un viaje menos), `modulepreload`, cinta con alto reservado (CLS 0,107 → 0), video que arranca después de `load`, escenas fuera de pantalla con `loading="lazy"`.

## Recibos en vivo (https://mxdc.vercel.app, 2026-11-05, Lighthouse 12.8)
| Página | Celular: Rend. / Acc. / BP / SEO | LCP | CLS | Escritorio | LCP |
|---|---|---|---|---|---|
| home | 100 / 100 / 96 / 100 | 1,7 s | 0 | 100 / 100 / 100 / 100 | 0,4 s |
| trabajos/fredy | 98 / 100 / 96 / 100 | 2,3 s | 0 | 100 / 100 / 100 / 100 | 0,5 s |
| trabajos/delta | 99 / 100 / 96 / 100 | 2,2 s | 0 | 100 / 100 / 100 / 100 | 0,5 s |

HTML de la home: 4,2 KB comprimido, primer byte en 0,13 s. Videos: 0,2–2,6 MB cada uno, solo baja el de la tarjeta del centro y recién después de `load`. Archivos estáticos, sin framework ni servidor.
Verificado en vivo: 9 páginas a 375/390/768 sin errores de consola ni desborde; los videos de la cinta y de los casos se reproducen; fuentes con caché de un año.
Falta: la prueba de Max en su teléfono y su red.

## Deuda declarada
- `image-size-responsive`: las escenas se sirven a 1264 px en todas las pantallas. Falta un `srcset` chico para celular.
- LCP simulado sobre 2,5 s en local: se re-mide en Vercel antes de decidir más cambios.
