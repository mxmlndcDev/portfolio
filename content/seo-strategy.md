# SEO — portfolio mxdc (Fase 6, 2026-11-05)

Un portfolio no pelea tráfico de búsqueda: lo encuentran por el nombre (LinkedIn, CV, recomendación) o por el link de un caso. Lo que importa es que **el nombre dé este sitio primero** y que **cada caso se comparta con su propia ficha**.

Volúmenes: sin herramienta de volumen; son estimaciones por lógica de mercado, marcadas como tales.

## Keywords

| Término | Intención | Volumen (estimado) | Dificultad (estimada) | Página | Prioridad |
|---|---|---|---|---|---|
| max del caño / maximiliano del caño | navegacional | muy bajo | baja | home | alta |
| max del caño diseñador | navegacional | muy bajo | baja | home | alta |
| design engineer buenos aires | comercial (reclutadores) | bajo | media | home | media |
| diseñador web y frontend buenos aires | comercial | medio | alta | home | baja |
| reservas directas sin booking (sitio) | comercial | bajo | media | trabajos/catalonia | baja |
| sitio con turnos por whatsapp peluquería canina | comercial | bajo | baja | trabajos/peluqueria | baja |

Una keyword principal por página; los casos no compiten entre sí (cada uno es de otro rubro).

## Checklist técnico

- [x] Title único por página, bajo 60 caracteres (home: «Max del Caño — Diseño web y frontend con IA»; casos: «<trabajo> — Max del Caño»).
- [x] Meta description bajo 155 caracteres en las 9 páginas (Fredy y pet shop se acortaron).
- [x] Un H1 por página.
- [x] URLs limpias: `/` y `/trabajos/<slug>.html`.
- [x] Alt real en foto y capturas; escenas y videos decorativos con `alt=""` / `aria-hidden`.
- [x] Datos estructurados: `Person` en la home (nombre, LinkedIn, Behance, Buenos Aires); `CreativeWork` en cada caso con autor y link al sitio.
- [x] `sitemap.xml` (9 URLs) y `robots.txt`.
- [x] Canonical en las 9 páginas.
- [x] Open Graph + imagen 1200×630 por página (`src/og/`, `node tools/og.mjs`).
- [ ] Core Web Vitals: se miden en la URL publicada (Fase 7).
- [x] Redirects: no hacen falta. La home sigue en `/`; el sitio anterior era una sola página con anclas.

## Después del deploy (Max)
- Search Console: verificar mxdc.vercel.app y mandar el sitemap.
- Poner el link del sitio en LinkedIn (sección Destacados y en «Sitio web») y en Behance.

## Roadmap de contenido
No aplica: un portfolio para buscar trabajo no necesita blog. Si más adelante se suma algo, que sea un caso nuevo por trabajo publicado (cada uno empuja a la home y al contacto).
