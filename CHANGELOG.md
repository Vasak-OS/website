# Changelog — `website`

Sitio de VasakOS (Hugo + `themes/vasakos` + Tailwind). Los cambios que le
importan a quien usa el sitio, no la lista de archivos.

## Sin publicar

### Añadido

- **El sitio está en inglés.** La sección `/en/` sirve el mismo sitio en
  inglés: los 67 textos —unas 45.000 palabras, del blog, la documentación,
  los changelogs y los textos legales— están traducidos, y con ellos la
  interfaz completa (menú, buscador, botones, pie de página). Antes era un
  sitio que sólo se podía leer en español; ahora quien no lo hable llega a
  la documentación en lugar de irse.
- **El idioma se elige solo al leer la URL**: `/` en español, `/en/` en
  inglés, con un selector para cambiar. El sitio recuerda en cuál estabas.
- **El contenido inglés lleva sus propias etiquetas y categorías**, así que
  las búsquedas y los filtros no mezclan «información» con «information».
- **La tabla de estado y los textos que se generaban en español** —el pie de
  página, las páginas de donate y about— ya no se contradicen con el resto.

### Corregido

- **Las páginas en inglés ya no se publicaban en `/en/en/…`.** El prefijo de
  idioma se agregaba dos veces en los alias.
- **Dos enlaces del changelog del 01-04-2026** apuntaban a las entradas del
  blog en español, y desde la versión inglesa no llevaban a ninguna parte.
- **`eprintLn` → `eprintln!`**, que es como se llama la macro de Rust.
- **La versión de «repositorio vasakos»** en la tabla de estado era la
  cadena `activo` en vez del estado.

### Administrado

- **Una prueba impide que los dos idiomas se separen** (`tests/i18n.test.ts`):
  las 294 claves de `i18n/es.toml` y `i18n/en.toml` tienen que seguir siendo
  las mismas. Agregar la traducción a un idioma y olvidar el otro es un error
  que sale en el build, no en producción.
- **`description` pasó a ser `summary`** en el front matter, porque Hugo
  reserva ese nombre y lo sobreescribía.

## Notas

- El `Title` y el `date` de los changelogs se dejaron tal como en el
  original. Ojo con `20260819.md`: el archivo se llama 19-08-2026 pero su
  `Title` y su `date` dicen 19-06-2026. Es un error del texto original,
  pendiente de corregir en la versión en español.
- `terms/`, `privacy/` y `donate/` ya estaban en inglés en el original
  (boilerplate de TermsFeed). Se limpiaron los espacios que dejaba el
  generador y se le corrigió la redacción, pero **no se tradujeron al
  español**: son textos legales y esa decisión no corresponde al traductor.
- El inglés se hizo sobre este mismo repositorio, en dos ramas:
  `feat/i18n-es-en` (la maquinaria) y `feat/i18n-en-content` (los textos).
