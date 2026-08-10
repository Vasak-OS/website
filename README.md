# VasakOS Website

Sitio oficial de [VasakOS](https://os.vasak.net.ar/), construido con
[Hugo](https://gohugo.io/) y [Tailwind CSS](https://tailwindcss.com/).

Es un sitio estático: no hay backend, no hay base de datos y no hay build en el servidor.
`hugo` genera HTML en `public/` y eso es lo que se publica en GitHub Pages.

---

## Requisitos

| Herramienta | Versión | Para qué |
| --- | --- | --- |
| [Hugo extended](https://gohugo.io/installation/) | ≥ 0.164 | Generar el sitio. **Tiene que ser la edición `extended`**: la normal no procesa Tailwind ni las imágenes. |
| [Bun](https://bun.sh/) | ≥ 1.3 | Instalar dependencias. `npm` o `pnpm` también sirven. |
| Node | ≥ 20 | Ejecutar el generador de iconos. |

```bash
hugo version   # tiene que decir "extended"
```

## Empezar

```bash
git clone git@github.com:Vasak-OS/website.git
cd website
bun install
bun run dev
```

El sitio queda en <http://localhost:1313> y recarga solo al guardar.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `bun run dev` | Servidor de desarrollo con recarga en vivo. |
| `bun run build` | Genera `public/` listo para publicar. |
| `bun run preview` | Build de producción servido localmente, con los mismos minificados y hashes que en producción. |
| `bun run icons` | Regenera `icons.css` desde los SVG de Font Awesome. |
| `./deploy.sh -n` | Build de prueba sin publicar. |
| `./deploy.sh` | Build y push a la rama `gh-pages`. |

---

## Estructura

```
website/
├── config/_default/
│   ├── config.yaml      # baseURL, outputs, minificación, sitemap
│   ├── params.yaml      # descripción del sitio, redes, ventajas, formas de apoyo
│   ├── menus.yaml       # menú principal
│   └── markup.yaml      # Goldmark, tabla de contenidos, resaltado de sintaxis
├── content/             # el contenido en Markdown
│   ├── blog/            # novedades, por año
│   ├── changelogs/      # una entrada por release
│   ├── docs/            # documentación (user/ y devs/)
│   ├── downloads/       # página de descarga
│   ├── state/           # estado del proyecto
│   └── about|donate|privacy|terms/
├── data/
│   ├── release.yml      # ← datos de la release actual (ver más abajo)
│   └── components.yml   # ← componentes del sistema y su estado
├── scripts/
│   └── build-icons.mjs  # genera el CSS de iconos
└── themes/vasakos/
    ├── assets/          # CSS y JS que pasan por el pipeline de Hugo
    ├── layouts/         # plantillas
    └── static/          # archivos servidos tal cual (imágenes, fuentes, CNAME)
```

### `assets/` vs `static/`

Lo que va en `assets/` lo procesa Hugo: se minifica, se le calcula un hash en el nombre y,
si es una imagen, se redimensiona y se convierte. Lo que va en `static/` se copia tal cual.
Ante la duda, **`assets/`**: es lo que permite servir WebP y cachear para siempre.

---

## Tareas frecuentes

### Publicar una release nueva

Editá **`data/release.yml`**. Eso es todo: la página de descargas, la sección hero de la
portada y los datos estructurados (`SoftwareApplication`) leen de ahí. Tener el checksum en
un solo lugar es lo que evita publicar uno equivocado.

Después, escribí el changelog en `content/changelogs/DDMMAAAA.md` y actualizá
`changelog_url` en `release.yml`.

### Actualizar el estado del proyecto

**Las versiones no se editan a mano y no requieren redesplegar el sitio.**

`repository-script/build-db.sh` escribe un `vasakos.json` junto a la base de datos cada vez
que se publica el repositorio de paquetes. La página lo consulta en **dos momentos**:

1. **En el build** (`partials/data/components.html`): las versiones quedan escritas en el
   HTML. Esto es lo que ven los buscadores y quien navega sin JavaScript.
2. **En el navegador** (`assets/js/state-live.js`): al cargar la página se vuelve a
   consultar el índice y se corrigen los números si cambiaron. Publicar un paquete alcanza
   para que la página quede al día — sin build, sin deploy.

El segundo paso es una mejora progresiva sobre el primero. Si falla —repositorio caído, sin
conexión, CORS mal configurado— la tabla queda con lo del build y la página lo aclara, en
vez de quedar vacía o mentir.

Lo que **sí** se edita a mano en `data/components.yml` es lo editorial: el título, la
descripción y el `status` (`stable` / `beta` / `alpha` / `wip` / `planned`). Eso no está en
ningún metadato — nada dentro de un paquete sabe que las cuentas en línea todavía no las
usa ninguna aplicación. Un componente que no es un paquete pacman (la ISO, el instalador)
conserva siempre la versión del YAML.

**Requisito:** el servidor del repositorio tiene que servir `vasakos.json` con
`Access-Control-Allow-Origin: https://os.vasak.net.ar`. Las configuraciones para nginx,
Apache y Caddy están en el
[README de repository-script](https://github.com/Vasak-OS/repository-script#serving-the-index-to-the-website).
Sin esa cabecera el sitio sigue funcionando, sólo que las versiones se actualizan en cada
build en lugar de en cada visita.

La URL del índice se configura en `params.yaml` → `repository.index`. Para probarlo contra
un índice local, Hugo bloquea las URLs que no son HTTPS públicas, así que hay que aflojar
la política del build (el fetch del navegador no la usa):

```bash
HUGO_SECURITY_HTTP_URLS='.*' \
HUGO_PARAMS_REPOSITORY_INDEX="http://127.0.0.1:8899/vasakos.json" hugo server
```

### Escribir una entrada de blog

```bash
hugo new content blog/2026/mi-entrada.md
```

Front matter mínimo:

```yaml
---
Title: "Título de la entrada"
description: "Una o dos frases. Es lo que aparece en Google y al compartir el enlace."
img: "/img/posts/news.svg"
date: "2026-08-10"
tags: [vasakos, release]
---
```

`description` no es opcional en la práctica: sin ella, la página compite en buscadores con
el resumen automático y con el resto del sitio.

### Agregar una página de documentación

Poné el `.md` en `content/docs/user/` o `content/docs/devs/`, con `title`, `description` y
`weight` (define el orden). **Las URLs van en inglés**: `installation.md`, no
`instalacion.md`; el contenido va en español.

Si renombrás una página existente, agregale un `aliases` con la URL vieja para no romper
los enlaces que ya andan dando vueltas:

```yaml
aliases: ["/docs/user/errores/"]
```

### Agregar un icono

Los iconos son máscaras CSS generadas desde Font Awesome Free, no un framework cargado en
tiempo de ejecución. Para sumar uno:

1. Agregá el nombre y la familia a `ICONS` en `scripts/build-icons.mjs`.
2. `bun run icons`.
3. Usalo en el HTML como siempre: `<i class="fa-solid fa-rocket"></i>`.

Commiteá el `icons.css` regenerado: el deploy no lo reconstruye si ya existe.

### Diagramas

Los bloques ```` ```mermaid ```` se renderizan como diagramas. La biblioteca (3,3 MB) se
carga **sólo** en las páginas que tienen uno, así que no cuesta nada tenerla disponible.

---

## Cómo está resuelto el rendimiento

Vale conocer estas decisiones antes de tocar las plantillas, porque son fáciles de romper
sin darse cuenta:

- **Sin fuentes externas.** El tema usa la pila de fuentes del sistema. La única fuente
  propia es `VSKRegular`, para la marca.
- **Iconos como CSS.** `themes/vasakos/assets/css/icons.css` es un archivo generado. No lo
  edites a mano.
- **Mermaid condicional.** `footer/scripts.html` mira el contenido de la página y sólo
  emite el script si hay un diagrama. Por eso ese partial **no** puede usar
  `partialCached` sin una clave de variante.
- **Imágenes por el pipeline.** El hero sale de `assets/img/hero.jpg` y Hugo genera WebP en
  dos anchos. Una imagen grande nueva va en `assets/`, no en `static/`.
- **Tema oscuro sin parpadeo.** Un script inline y bloqueante en `<head>` pone la clase
  `dark` antes del primer pintado. Es el único script que bloquea, y tiene que seguir
  siéndolo.
- **`<title>` y `description` por página.** Los calcula `partials/head.html`. Una página sin
  `description` cae en la del sitio y se vuelve indistinguible del resto.

Antes de mandar un cambio grande, un chequeo rápido:

```bash
bun run build
grep -c '<h1' public/index.html          # tiene que dar 1
du -sh public
```

---

## Datos estructurados y SEO

`partials/head/schema.html` genera JSON-LD según la página: `Organization` y `WebSite` en
todas, `BreadcrumbList` fuera de la portada, `BlogPosting` o `TechArticle` en blog y docs,
`SoftwareApplication` en descargas y `FAQPage` donde haya un bloque `faq:` en el front
matter.

Las preguntas frecuentes viven **en el front matter** de `content/docs/user/faq.md`, no en
el cuerpo: así la página y los datos estructurados salen de la misma fuente y no pueden
contradecirse.

Para validar después de un cambio:

- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## Publicar

```bash
./deploy.sh
```

Hace el build, arma un commit en `public/` y lo fuerza sobre la rama `gh-pages` del
repositorio. El dominio lo define `themes/vasakos/static/CNAME`.

Con `-n` hace todo menos el push, que es lo que conviene correr antes de publicar algo
grande.

---

## Contribuir

Los aportes son bienvenidos. Para cambios grandes, abrí un issue antes para conversarlo.

1. Forkeá el repositorio y creá una rama: `git checkout -b feature/mi-cambio`
2. `bun run build` tiene que terminar sin errores.
3. Commiteá y abrí un Pull Request.

Si el cambio es de contenido, revisá que la página tenga `title`, `description` y un solo
`<h1>`.

## Licencia

[GPL-3.0](LICENSE). Los iconos son de
[Font Awesome Free](https://fontawesome.com/license/free) (CC BY 4.0).
