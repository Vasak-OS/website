# Sitio de VasakOS — qué se hizo y qué falta

Auditoría del sitio con foco en tres cosas: que cargue rápido, que se encuentre en
buscadores y que a alguien que llega por primera vez le resulte creíble.

La primera parte es lo que ya está resuelto. La segunda es la lista de trabajo pendiente,
ordenada por lo que más mueve la aguja.

---

## Parte 1 — Lo que se corrigió

### Rendimiento

| Problema | Antes | Ahora |
| --- | --- | --- |
| **Mermaid en todas las páginas** | 3,3 MB de JavaScript en cada una de las 250 páginas, incluida la portada, que no tiene diagramas | Se carga sólo en las 5 páginas que dibujan un diagrama |
| **Google Fonts** | 3 familias con todos los pesos e itálicas, desde un origen externo y bloqueando el render — **y ninguna regla del tema las usaba** | Eliminadas. El tema usa la pila de fuentes del sistema |
| **Kit de Font Awesome** | Script externo de ~20 KB que descarga un segundo paquete de iconos en tiempo de ejecución, desde otro origen | ~40 iconos como máscaras CSS: 13,7 KB comprimidos, sin JavaScript ni peticiones extra |
| **Pageclip** | CSS y JS desde un cuarto origen para un widget de formularios que el sitio no usa | Eliminado |
| **Fuse.js** | Se descargaba en cada build y nunca se incluía en el bundle | Eliminado |
| **Imagen del hero** | 515 KB, 2560 px, y era un AVIF con extensión `.jpg` | WebP por el pipeline de Hugo: 52 KB en móvil, 136 KB en escritorio, con `srcset` y `fetchpriority` |
| **Logos SVG** | 66 KB y 61 KB, con 35 KB de polyfill de Inkscape muerto adentro de cada uno | 27 KB y 22 KB, visualmente idénticos |
| **Índice de búsqueda** | 254 KB con el texto completo de todo el sitio, para buscar sólo en la documentación | 54 KB con la documentación y los textos acotados |
| **Imágenes sin usar** | 176 KB de archivos que ninguna plantilla referenciaba | Eliminados |
| **HTML sin minificar** | — | Minificado en el build |

**Resultado en la portada:** de ~3,9 MB a **~200 KB comprimidos** en la carga inicial.
De 4 orígenes externos bloqueantes a 0 (el badge de SourceForge se pide recién cuando el
pie de página entra en pantalla).

### SEO

- **`<title>` por página.** Las 250 páginas compartían el título `Vasak OS`. Es el error
  más caro que puede cometer un sitio estático: todas competían por el mismo resultado.
- **`description` por página**, generada del front matter o del resumen, y sin saltos de
  línea sueltos.
- **Open Graph y Twitter Card completos**, con URL absoluta de imagen (antes era relativa,
  o sea inservible al compartir) y `og:type` correcto por tipo de página.
- **JSON-LD**: `Organization` y `WebSite` en todas, `BreadcrumbList` fuera de la portada,
  `BlogPosting` / `TechArticle` en blog y documentación, `SoftwareApplication` en descargas
  (con versión, licencia y precio 0) y `FAQPage` en preguntas frecuentes.
- **Un solo `<h1>` por página.** La portada no tenía ninguno; algunas entradas del blog
  tenían nueve. Se agregó un render hook que degrada los `#` del cuerpo a `<h2>`.
- **`robots.txt` con sitemap**, y `noindex` en las páginas de etiquetas y categorías, que
  son contenido delgado que compite con las páginas reales.
- **Canonical correcto** y `canonifyurls` desactivado.
- **Páginas paginadas** con título propio en vez de repetir el de la página 1.
- Se eliminó el `meta keywords`, que arrastraba términos de otro proyecto (`LynxOS`,
  `nwjs`) y que además Google ignora desde hace más de una década.
- **404 útil.** El archivo existía pero estaba vacío: cualquier URL errónea devolvía una
  página en blanco.
- Anclas en los títulos, para poder enlazar a una sección concreta de la documentación.

### Credibilidad y contenido

- **Nueva página [/state/](https://os.vasak.net.ar/state/)**: tabla componente por
  componente con versión publicada, estado (estable / beta / alpha / en desarrollo) y
  enlace al repositorio, más una sección explícita de "qué todavía no". Para un proyecto
  joven, admitir los límites genera más confianza que ocultarlos.
- **Las versiones de esa tabla salen del repositorio de paquetes.** `build-db.sh` escribe
  un `vasakos.json` con lo que publica y el sitio lo lee durante el build, así que la única
  forma de que la página quede desactualizada es no redesplegarla. Lo editorial —qué hace
  cada componente y en qué estado está— sigue siendo manual, porque no está en ningún
  metadato.
- **Nueva sección "Qué incluye VasakOS"** en la portada, con los 16 componentes reales y
  sus versiones.
- **Hero rehecho**: la portada decía "Bienvenidos a Vasak OS · Un sistema basado en
  GNU/Linux y pensado para vos", que no dice nada verificable. Ahora dice qué es (Arch,
  Wayland, aplicaciones en Rust), en qué estado está y cuándo se publicó la última versión.
- **"Nuestros Precios" → "Cómo se sostiene el proyecto"**. Una tabla de precios en la
  portada de un sistema gratuito hace suponer que hay una trampa.
- **Ventajas reescritas**: decía que el sistema "se adapta a móvil y tablet" (falso para un
  escritorio) y vendía "Framework VueJS" como beneficio para el usuario. Ahora son seis
  puntos verificables, incluido *sin telemetría*.
- **Página "Sobre"**: el layout descartaba el texto del Markdown. Ahora se muestra, con una
  ficha técnica (base, modelo, sesión, stack, licencia, arquitectura) y una sección de
  quién está detrás, con la membresía en la OIN.
- **Descargas**: los datos de la release salen de `data/release.yml`, una sola fuente para
  la portada, la página y los datos estructurados. Se agregó una guía de instalación paso a
  paso y la advertencia de `dd`.

### Documentación

- Guías nuevas: **instalación**, **repositorio de paquetes** y **actualizar el sistema**.
  Las tres cubren el recorrido más frecuente y ninguna existía.
- **Preguntas frecuentes reescritas.** Decían que X11 estaba "totalmente soportado" y
  Wayland era experimental — al revés de la realidad actual — y pedían 100 GB de disco
  cuando la página de descargas pide 20 GB. Ahora viven en el front matter, así que la
  página y el `FAQPage` no pueden contradecirse.
- **URLs en inglés** (`errors`, `report-bugs`, `installation`, `repository`, `updating`),
  con `aliases` para no romper los enlaces existentes.
- Títulos y descripciones en todos los índices de sección; se corrigieron typos
  ("usuairios", "Documentacion").
- Se eliminó `ListCard.md`, duplicado exacto de `list-card.md`.

### Correcciones varias

- Dos botones de tema con el mismo `id`: sólo uno actualizaba su icono.
- Parpadeo blanco al cargar en modo oscuro.
- Un `<ul>` cerrado con `</ol>` y un `</div class="...">` en el layout de "Sobre".
- La clase `.font-vsk` se usaba en cuatro plantillas y no estaba definida: la fuente de
  marca se descargaba y no se aplicaba.
- El icono de los bloques de código dependía de una ligadura de Font Awesome.

---

## Parte 2 — Lo que falta

### Prioridad alta

**1. Capturas de pantalla.** Es lo que más falta, por lejos. Hoy no hay una sola imagen del
sistema funcionando: alguien que llega no puede saber cómo se ve. Es el primer filtro de
cualquiera que evalúa una distribución.

Mínimo: escritorio con el menú abierto, gestor de archivos, terminal, Ajustes y la galería.
Todas a 1920×1080, con el mismo fondo de pantalla y el mismo tema, en claro y en oscuro. Van
en `assets/img/screenshots/` para que Hugo genere WebP, y merecen una galería propia en la
portada y una página `/screenshots/`.

**2. Un video corto** (60–90 segundos) del arranque y el uso normal. Es lo que se comparte
en Reddit y en Hacker News, y lo que decide si alguien baja 2,4 GB.

**3. Página de comparación.** "¿En qué se diferencia de Manjaro / EndeavourOS / Garuda?" es
la pregunta que se hace todo el que evalúa una distro basada en Arch, y hoy el sitio no la
responde. Una tabla honesta, que incluya en qué las otras son mejores, convierte mucho más
que una lista de virtudes.

**4. Imágenes Open Graph por página.** Hoy todas comparten `og-default.jpg`. Hugo puede
generar una por página con el título encima de una plantilla; el enlace compartido pasa a
verse como el de un proyecto serio.

**5. Sitio en inglés.** El mercado de distribuciones es angloparlante. Hugo soporta
multilenguaje nativo y la estructura ya está preparada; empezaría por portada, descargas,
estado e instalación, no por las 40 páginas de documentación.

**5b. Deploy automático con rebuild programado.** Hoy el sitio se publica corriendo
`./deploy.sh` a mano. La página de estado ya lee las versiones del repositorio de paquetes,
pero al ser un sitio estático sólo se entera en el build siguiente: si se publica un paquete
y nadie redespliega, la página sigue mostrando lo anterior.

Un workflow de GitHub Actions con `on: push` y `on: schedule` (una vez por día) cierra el
ciclo: publicás paquetes y el sitio se pone al día solo. Es el complemento natural de lo que
ya está hecho y no requiere tocar ninguna plantilla.

```yaml
# .github/workflows/deploy.yml
name: deploy
on:
  push: { branches: [main] }
  schedule: [{ cron: "0 6 * * *" }]   # y así /state/ se refresca solo
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - uses: peaceiris/actions-hugo@v3
        with: { hugo-version: latest, extended: true }
      - run: bun install --frozen-lockfile && bun run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

No lo dejé activo porque en cuanto el archivo entra al repositorio empieza a publicar en
cada push, y esa es una decisión tuya, no mía.

### Prioridad media

**6. Instrucciones para máquina virtual.** Un bloque de "probalo en VirtualBox / GNOME
Boxes / QEMU en 5 minutos" en la página de descargas. Baja muchísimo la barrera frente a
"instalá esto en tu disco".

**7. Torrent como mirror.** Una ISO de 2,4 GB en MediaFire y Mega da mala impresión y es
lenta. Un `.torrent` con webseed es lo que hacen las distribuciones establecidas, y cuesta
poco.

**8. Firma GPG de la ISO.** El SHA256 verifica que la descarga no se corrompió, no que la
publicaste vos. Ya existe la clave del repositorio: publicar `SHA256SUMS` y
`SHA256SUMS.sig` cierra el tema. Los campos ya están en `data/release.yml`, vacíos.

**9. Página de la comunidad** que reúna Telegram, Discord, Reddit, GitHub y el roadmap, con
qué se conversa en cada uno. Hoy están sólo como iconos en el pie.

**10. Contadores reales**: estrellas en GitHub, miembros de Telegram, descargas de
SourceForge. Números concretos generan más confianza que adjetivos, y SourceForge tiene API.

**11. Ritmo de publicación en el blog.** El blog es lo que sostiene el tráfico entre
releases. Una entrada al mes alcanza: qué se está construyendo, decisiones técnicas,
presentación de cada aplicación.

**12. Página por aplicación.** Ya existe la ruta `/apps/` comentada en el menú. Una página
por aplicación —con capturas, qué hace y cómo instalarla suelta— captura búsquedas de cola
larga que la portada nunca va a captar.

### Prioridad baja

**13. Favicon más liviano.** `icon.svg` pesa 27 KB para un icono de 16 píxeles. Una versión
simplificada bajaría a 1–2 KB.

**14. Buscador en toda la documentación.** El actual sólo cubre `/docs/` y hace coincidencia
literal, sin tolerancia a errores de tipeo.

**15. Sin cabeceras de caché.** GitHub Pages no deja configurarlas. Los archivos con hash
en el nombre podrían cachearse un año. Cloudflare adelante lo resolvería gratis, y de paso
daría Brotli y estadísticas sin cookies.

**16. Analítica sin cookies.** Google Analytics obliga a un banner de consentimiento que hoy
no está (riesgo real de GDPR si hay visitas europeas). Plausible o Umami autoalojado da los
mismos números sin cookies y sin banner — y encaja mucho mejor con "sin telemetría".

**17. Accesibilidad.** Falta un enlace de "saltar al contenido", y varios pares de colores
sobre los degradados no llegan al contraste AA. Vale una pasada con axe.

**18. Feed RSS más visible.** Existe y está declarado en el `<head>`, pero no hay ningún
enlace visible.

---

## Cómo medirlo

```bash
bun run build
```

- [PageSpeed Insights](https://pagespeed.web.dev/) — objetivo: 95+ en móvil.
- [Rich Results Test](https://search.google.com/test/rich-results) — tienen que aparecer
  `Organization`, `SoftwareApplication` en descargas y `FAQPage` en preguntas frecuentes.
- [Google Search Console](https://search.google.com/search-console) — dar de alta el
  sitemap (`https://os.vasak.net.ar/sitemap.xml`) si todavía no está.
