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
- **Los botones, las tarjetas, los avisos, las insignias, las migas y las
  barras de progreso del sitio salen de un solo partial cada uno**
  (`themes/vasakos/layouts/partials/ui/`), con las mismas clases que dibujan
  los componentes de `@vasakgroup/vue-libvasak` en las aplicaciones del
  escritorio. Antes cada sección tenía sus propias clases y dos botones con la
  misma función se veían distintos según dónde estuvieran; ahora se ven
  iguales en toda la página y se parecen a los del sistema.

### Corregido

- **Varios textos que no se podían leer.** Las insignias de estado, las dos
  pastillas que avisan si los datos de la tabla de `/state/` están frescos o no,
  y el botón «Comunidad» de `/downloads/` pisaban su texto con el color del tono
  —un verde, un ámbar, un violeta— sobre un tinte claro de ese mismo tono. El
  más grave daba 1.60:1, y el mínimo de WCAG 1.4.3 para texto normal es 4.5:1.
  Ahora el texto va en `text-tx-main` y es el tono el que queda en el tinte del
  fondo y en el icono de adentro, que es el mismo reparto que usa `AlertMessage`
  en las aplicaciones del escritorio.
- **El borde de los controles se perdía sobre los paneles.** El token
  `--ui-border-strong` daba 3.49:1 contra el fondo pero 2.56:1 contra la
  superficie, y los paneles, las tarjetas y las ventanas están hechos de
  superficie: el contorno de un input no se veía justo donde hay más controles.
  El valor ahora es el que calcula el config-manager del escritorio para el
  esquema por omisión, así que el sitio y el sistema usan el mismo.
- **El botón de «volver arriba» no tenía fondo.** La clase era
  `bg-lineal-to-br`, con una `a` de sobra, y no es una utilidad de Tailwind v4:
  no se emitía, y como las clases que no existen no avisan, el build pasaba
  limpio con el botón invisible. Los `from-secondary to-primary` de al lado
  tampoco hacían nada sin el degradado delante.
- **Los iconos del sitio ahora tienen la atribución que su licencia pide.** Los
  cincuenta y tantos iconos son de Font Awesome Free, que es CC BY 4.0: exige
  crédito visible, un enlace a la licencia y decir que se modificaron. No
  estaba ninguna de las tres —la única mención era un comentario dentro de
  `scripts/build-icons.mjs`, que no se ve en la página—, así que los iconos se
  servían sin atribución. Ahora el pie de página los nombra, enlaza al
  proyecto y a la licencia, y dice que están adaptados a máscaras CSS. El aviso
  va en `text-tx-muted` y los enlaces en `text-tx-main` con subrayado, en vez
  de la convención `text-gray-500 hover:text-primary` del resto del pie, porque
  medidos en modo claro ésos dan 4.28:1 y 2.64:1: un aviso legal que no se lee
  no cumple con estar.
- **La lista de requisitos de `/downloads/` salía vacía**, en los dos idiomas:
  cinco `<li>` sin texto bajo «Requisitos mínimos». La clave se armaba sin el
  `.text` final, la traducción no se encontraba y Hugo devolvía vacío en vez
  de la clave, así que el plan B —mostrar el texto del YAML— nunca se activaba.
  Nadie lo notó porque el build salía limpio.
- **Los requisitos de la página en español estaban en inglés**: el bloque de
  `i18n/es.toml` se había llenado copiando el de inglés, y como la lista no se
  veía, el error tampoco.
- **Las páginas en inglés ya no se publicaban en `/en/en/…`.** El prefijo de
  idioma se agregaba dos veces en los alias.
- **Dos enlaces del changelog del 01-04-2026** apuntaban a las entradas del
  blog en español, y desde la versión inglesa no llevaban a ninguna parte.
- **`eprintLn` → `eprintln!`**, que es como se llama la macro de Rust.
- **La versión de «repositorio vasakos»** en la tabla de estado era la
  cadena `activo` en vez del estado.
- **`text-ms` en las migas de pan** no es una clase de Tailwind —no está en la
  escala—, así que la lista se dibujaba al tamaño del texto que tuviera encima
  y quedaba al azar.
- **El rosa de la marca ya no se usa para texto.** `#dd7878` es un relleno: sobre
  la superficie más clara de la página da 1.93:1, y el mínimo de WCAG 1.4.3
  para texto normal es 4.5:1. Estaba en 65 lugares de 25 plantillas: títulos de
  sección, enlaces del pie, el icono de «volver arriba», los precios, las
  migas. Para eso está `--brand-text`, nuevo: `#8a3550` en claro —5.03:1 contra
  el fondo más difícil, 6.45:1 sobre una tarjeta— y en oscuro reutiliza el
  primario ya aclarado, `#eba0ac`, a 6.08:1. La regla que queda escrita es que
  `--primary` sólo sirve para rellenos, tintes, bordes, degradados y marcadores;
  lo que se lee usa `text-brand-text`.
- **Los bloques de código ya no son un tema ajeno.** Eran el Monokai de Hugo —
  `#66d9ef`, `#a6e22e`, `#f92672` sobre `#272822`—, escrito a mano y sin ninguna
  relación con la paleta. Ahora salen enteramente de los tokens del terminal, y
  en los dos modos: el verde del terminal en claro da 3.29:1 y el ámbar 2.47:1,
  así que un tema claro de sintaxis no podía ser legible sin abandonar el color
  que lo identifica.
- **Los enlaces dentro de un párrafo ahora van subrayados.** `--brand-text` es
  `#8a3550` y `--text-main` es `#4c4f69`: entre los dos hay 1.02:1, o sea que
  un enlace embebido en un texto no se distinguía por nada. No hay ningún valor
  de rosa que los separe 3:1 sin volverse ilegible sobre el fondo, así que la
  se resuelve con el subrayado, que es lo que la WCAG pide.
- **El pie de página era un `<div>` suelto**, así que sus dieciocho enlaces
  estaban fuera de todo landmark. Ahora es un `<footer>`, y el diálogo del menú
  móvil —que se abría con `role="dialog"` y sin nombre— y las migas tituladas
  también lo tienen.
- **El enlace del logo decía «VasakOS» dos veces**: en el `alt` de la imagen y en
  el `<span class="sr-only">` de al lado. Su nombre accesible era «VasakOS
  VasakOS». El `alt` va vacío, que es lo que corresponde a un enlace que ya se
  nombra con texto.
- **`/about/` no tenía `<main>`**, y el título de cada página se emitía antes de
  que abriera el suyo: el contenido de una y otro quedaba fuera de todo
  landmark. Lo mismo con el hero de la portada.
- **Las casillas de las listas de tareas se veían.** Goldmark las emite como
  `<input type="checkbox">` con los atributos del navegador, que en este
  proyecto se dibujaban como un cuadrado gris con un borde que no era de
  ningún token. Ahora el input no se pinta y el estado lo muestra un glifo
  dibujado con `::before`.
- **La página de privacidad saltaba un nivel de encabezado**: empezaba en `###`
  con un `<h1>` de título, sin ningún `##` en medio. Ahora la jerarquía es
  h1 → h2.

### Administrado

- **Una prueba impide que los dos idiomas se separen** (`tests/i18n.test.ts`):
  las 294 claves de `i18n/es.toml` y `i18n/en.toml` tienen que seguir siendo
  las mismas. Agregar la traducción a un idioma y olvidar el otro es un error
  que sale en el build, no en producción.
- **Dos pruebas más sobre los requisitos de la ISO**: que cada uno tenga
  traducción en los dos idiomas, y que el texto español no sea el inglés. Las
  dos leen `data/release.yml` y arman la clave igual que el partial, que es la
  razón por la que las pruebas genéricas no lo veían.
- **Cada partial de `ui/` dice de qué componente de la librería salió y a qué
  versión**, con el enlace al fuente. La correspondencia se puede buscar con
  `grep` cuando la biblioteca se actualiza.
- **`description` pasó a ser `summary`** en el front matter, porque Hugo
  reserva ese nombre y lo sobreescribía.
- **La accesibilidad se auditó con axe-core, no a ojo.** 32 páginas × los dos
  modos de color, 64 auditorías: quedan **0 violaciones**, donde al empezar
  había 106. `axe-core` es una dependencia de desarrollo y `bun run a11y` deja
  una copia en `static/` para que el servidor de desarrollo la sirva. Esa copia
  está en `.gitignore` a propósito: pesa 568K y Hugo copia todo lo de `static/`
  al sitio publicado, así que versionada se terminaría sirviendo a cualquiera.
- **Quince pruebas nuevas sobre los invariantes de esta tanda**
  (`tests/design-system.test.ts`): que ninguna plantilla use `text-primary`,
  que nadie combine `bg-primary` con `text-white`, que `syntax.css` no tenga
  ningún color escrito a mano, que los valores por defecto de la tipografía
  estén en `@layer components`, que el pie sea un landmark, que cada plantilla
  de página abra su `<main>`, y así. Se comprobaron una por una **mutando el
  código y viendo que la prueba se pone roja**: dos de ellas pasaban sin
  querer —una porque `underline-offset-2` contenía la palabra «underline», y
  otra porque sólo miraba el orden en que aparecen `<main>` y el hero en el
  texto, sin comprobar que el hero quedara dentro—, y están corregidas.

## Notas

- **Por qué los valores por defecto de la tipografía están en una capa.** Un
  selector escrito fuera de toda capa le gana a *cualquier* utilidad de
  Tailwind, sin importar la especificidad, porque las utilidades viven en
  `@layer utilities`. Eso hacía que `:where(#article a)` —especificidad cero,
  la más baja posible— siguiera pintando de rosa el botón de «Estado del
  proyecto» en `/about/`, que declaraba su propio `text-tx-on-primary` y por
  lo tanto debería haber ganado. Con la regla dentro de `@layer components`,
  `utilities` va después y gana, que es lo que corresponde a un valor por
  defecto. La lección: `:where()` no alcanza para esto, hay que entender las
  capas.
- **Medir el contraste a mano no sirve.** Las dos auditorías que se escribieron
  antes de usar axe-core dieron resultados falsos, en los dos sentidos: una
  marcó como legible texto que no lo era y la otra Approved sobre
  combinaciones que no cumplían. `color-contrast` además devuelve *incomplete*,
  no *violation*, cuando el fondo está tapado por un degradado, así que los
  paneles translúcidos de `/downloads/` y `/about/` no entran en el conteo: hay
  que medirlos aparte.
- **La auditoría tiene que correr contra el build, no contra el servidor de
  desarrollo.** El modo dev no versiona la URL del CSS, así que el navegador lo
  sirve de caché y los cambios no llegan: aparecieron cientos de violaciones que
  no existían, y los colores que reportaba axe no coincidían con
  `getComputedStyle` porque estaba midiendo una hoja de estilo vieja. Con
  `bun run preview` o un servidor estático sobre `public/` desaparece.
- **Las páginas que no existen servían la página de error del servidor** y se
  contaban como si fueran del sitio: dos URL que se habían inventado darían
  `landmark-one-main` y `region` en un HTML que no era de Hugo. Las rutas
  reales están en `public/`, y no son las que se suponían: la FAQ vive en
  `/docs/user/faq/` y los changelogs en `/changelogs/20260819/`.


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
