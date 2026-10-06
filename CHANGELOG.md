# Changelog — `website`

Sitio de VasakOS (Hugo + `themes/vasakos` + Tailwind). Los cambios que le
importan a quien usa el sitio, no la lista de archivos.

## Sin publicar

### Cambios

- Los cinco textos alternativos del carrusel de la portada decían los cinco lo
  mismo —«Captura de pantalla de VasakOS»—, así que quien lo recorría con el
  lector de pantalla oía la misma frase cinco veces sin poder ubicar ninguna.
  Ahora dicen cuál de cuántas: «Captura 3 de 5 de VasakOS». La posición es un
  dato que el markup ya tenía; no se décritió el contenido de las capturas.

- El shortcode `img` ya no cae en un texto alternativo de una sola palabra cuando
  el autor se olvida de escribirlo. Decía «Imagen», que no le sirve a nadie y
  además tapa el aviso de que faltaba algo.

### Verificación

- Tres pruebas nuevas sobre las imágenes: que ninguna se quede sin `alt`, que
  ninguna se describa con una sola palabra, y que las cinco decorativas del
  sitio —todas con el motivo escrito en su propia plantilla— sigan siendo las
  únicas. Se comprobó que las tres suenan al reintroducir el defecto.


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
- **El índice lateral de cada artículo se ve como un índice.** Salía con la
  numeración del navegador —1., 2., 3.— pegada a cada entrada: no es una
  jerarquía, es un contador, y el número además ocupaba ancho en una columna de
  260 px. Ahora son filas con una barra de 2 px reservada para el estado activo,
  con el hover del mismo `.link-row` que el resto de los enlaces sueltos del
  sitio, el segundo nivel un punto más chico y el tercero oculto. No hay estado
  activo todavía: no hay JavaScript que sepa qué encabezado se está leyendo, y
  no se inventó una clase que nada pone.
- **El índice de changelogs es una lista de versiones y ahora se lee como
  una.** Eran 24 líneas de texto sin nada que las ordenara: sin fecha, sin
  insignia, sin caja. Cada versión es una tarjeta con su número, su canal —que
  estaba metido dentro del título, como «Changelogs 04-10-2026 [Beta]», y sale
  a una insignia con el color de la leyenda de `data/components.yml`— y la
  fecha.
- **Las flechas del carrusel de capturas son botones.** Eran círculos de
  `bg-ui-bg/80` con sombra corta y nada más, sin canto, sobre una banda que
  también es `bg-ui-bg/80`: compuesto contra sí mismo eso da cerca de 1.1:1, así
  que no se distinguían de lo que tenían detrás. `--ui-border-strong` da 7.06:1
  en claro y 11.34:1 en oscuro, y WCAG 1.4.11 pide 3:1 para el borde que
  identifica un control.
- **El botón de «nueva pestaña» y el selector de idioma son botones.** El
  primero estaba a 28 px —la altura de una fila de tabla, que es exactamente
  donde un puntero está pero un dedo no distingue de un chip— y con
  `#dce0e8` de contorno. El segundo era texto de 18 px sin caja, o sea
  indistinguible de los enlaces que lo rodeaban. El menú que abre ahora es una
  tarjeta y no una superficie plana: es lo único del sitio que flota **encima** de
  otra cosa, y la sombra larga es lo que dice que está arriba.

### Cambiado

- **El sitio habla el lenguaje visual de OnceUI.** La paleta no se tocó: `#dd7878`
  sigue siendo el primario y `#8839ef` el secundario, con sus variantes de
  modo oscuro, exactamente donde estaban. Lo que cambió es todo lo demás —la
  escala de radios, las sombras por capas, los niveles de superficie, el ritmo de
  espaciado y el comportamiento al pasar el mouse— para que las piezas que antes
  se dibujaban cada una a su manera compartan una sola gramática. Antes el sitio
  tenía tres radios con nombre, sombras de Tailwind escritas sueltas de cinco
  formas distintas y transiciones de 700 ms; ahora hay una escala y una regla.
- **Una escala de radios con nombre en vez de tres radios sueltos:** `xs` 4 px,
  `s` 8 px, `m` 10 px, `l` 14 px y `xl` 20 px, más los radios anidados
  (`m-4`, `l-4`, `l-8`, `xl-8`), que son lo que hace que un panel dentro de
  una tarjeta se lea como una cosa dentro de otra y no como dos cajas pegadas.
  El nombre dice para qué sirve cada uno —`xl` para el hero y los banners, `l`
  para tarjetas y paneles, `m` para botones y campos, `s` para pastillas, `xs`
  para la barra de progreso—, así que elegir uno es una decisión y no un número.
  Los 95 usos de las plantillas se repartieron uno por uno contra esa regla, no
  con un reemplazo automático.
- **Las sombras tienen nombre y versión por modo.** `--use-shadow-s/m/l` para
  modo claro y `-s/m/l-dark` para el oscuro, con tres niveles: tarjetas,
  superficies superpuestas y controles chicos. El oscuro necesita más alfa que
  el claro porque `#1e1e2e` se traga una sombra suave, así que tener un solo valor
  para los dos modos obligaba a elegir el que se veía bien en el que se estava
  mirando.
- **El mouse ya no hace saltar las tarjetas.** El hover levantaba 20 px en
  700 ms, que es más transición que movimiento y mareaba al recorrer una fila de
  precios. Ahora levanta 4 px en 300 ms y además aclara el borde, que es lo que
  de verdad distingue la tarjeta señalada cuando el salto es tan chico.
- **El anillo de foco se ve en modo claro.** Era `var(--color-primary)`, que
  sobre `#ccd0da` da 1.93:1, y un indicador de foco necesita 3:1 como mínimo
  para que se distinga de lo que tiene alrededor. Ahora es `--brand-text`, que
  da 5.03:1 en los dos modos.
- **El texto del artículo respira.** La altura de línea del `body` pasó a 1.7 y
  la sangría de las listas, que estaba como regla global y apartaba también a las
  listas de navegación, ahora sólo se aplica dentro de `#article`.
- **El movimiento del sitio tiene tres duraciones: 200, 300 y 400 ms.** Antes
  tenía cuatro, y eran para el mismo gesto. `<body>` iba a 400 ms con
  `transition-all`, la regla `body *` a 300 ms y los botones a 200; las tarjetas
  estaban a 250 ms, que no estaba en ninguna parte de la escala. Al cambiar de
  modo oscuro el fondo cruzaba en 400, un subtítulo en 300 y un botón en 200, y
  eso se veía como una onda que venía del fondo para adentro. Ahora **200 ms**
  para reaccionar —el hover de un botón, de una tarjeta, de una fila de enlace,
  de una entrada del índice—; **300 ms** para entrar y salir; **400 ms** para el
  recorrido del carrusel, que es la única animación que mueve algo un trecho.
  Medido en `/docs/user/security/`: 242 nodos y una sola duración en toda la
  página. También `transition-all` pasó a `transition-colors`: `all` animaba
  cualquier propiedad, y el `<body>` también cambia de `background-image` cuando
  hay un degradado de fondo, así que se veían cruzar cuatro imágenes por cuadro
  durante 400 ms.

### Corregido

- **Cada hecho de `/about/` era una definición mal formada.** Los seis datos que
  la página muestra —el número de paquetes, el de colaboradores— se dibujan con
  `<dl>` y `<div>` para poder ponerlos en una grilla, y dentro de cada celda el
  ícono estaba como hermano **antes** del `<dt>`. HTML permite ese `<div>`
  agrupando términos, pero tiene que empezar por un `dt`: un `span` antes lo
  convierte en algo que no es ni término ni definición, y `axe` lo marca como
  `definition-list`, impacto serio. En pantalla se veía exactamente igual, así
  que sólo lo encontró la auditoría. El ícono ahora va adentro del `dt`, que es
  además lo que dice que decora el término y no la fila.

- **Las citas ya no son un degradado de morado a rosa con el texto en blanco.**
  Era lo más ajeno al resto del sitio que había, y además el texto no cumplía
  con el contraste mínimo ni en el color de la marca. Ahora es lo que hace un
  escritorio con una cita: una superficie apenas teñida del color de la marca
  —`--color-primary` al 6 % sobre `--color-ui-bg`, o sea el color que ya estaba
  en pantalla mezclado, no uno nuevo— con un borde de acento de 3 px del lado
  del texto, y el texto en el color de lectura normal.
- **El bloque de código de una celda de tabla llevaba una tira clara detrás.** La
  regla de `code` en línea —la que pone el chip— no puede distinguir un `<code>`
  de una palabra de un `<code>` que envuelve tres líneas, y ganaba por
  especificidad a la del bloque. En los changelogs, donde Hugo renderiza el
  ejemplo de bash dentro de una tabla, el chip se le ponía encima al terminal y
  los comentarios quedaban a 1.44:1 sobre un fondo claro. El bloque seguía siendo
  oscuro, así que no se veía raro: sólo llevaba una tira clara atrás del texto.
- **El carrusel de capturas de la portada no se podía desplazar con el teclado.**
  Se mueve con la rueda y con el dedo, y dentro no hay nada enfocable: las
  capturas son `figure` y los botones de anterior y siguiente son hermanos, no
  hijos. Con teclado no había manera de llegar a la tercera captura —WCAG 2.1.1—.
  Ahora la pista es un punto de tabulación, y como ya tenía nombre y rol de
  carrusel, lo que se anuncia es el carrusel y no un grupo genérico.
- **Las migas de pan quedaron pegadas.** El separador era el margen izquierdo que
  la regla global de las listas aplicaba a todos los `<li>`. Al limitar esa regla
  al artículo —que era lo único que quería— las migas perdieron el espacio entre
  crumbs y crumb, y ahora lo llevan con el `gap` de la propia lista.
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
- **Las cinco entradas del menú apuntan a URLs que no existen.** El menú
  declaraba `/about`, y Hugo publica `/about/`: `relLangURL` no inventa la
  barra final, así que cada entrada —en los dos idiomas, en las 322 páginas— era
  un 301 y cada clic del menú se comía un salto. La barra final va ahora en el
  dato, que es lo único que depende de `uglyURLs`. Al revisar salió también que
  las 16.516 referencias internas del sitio apuntan a algo que existe.
- **La página 2 del blog se declaraba duplicada de la 1, y en dos idiomas a la
  vez.** Al paginar, Hugo vuelve a renderizar la plantilla de la *sección*, así
  que `.Permalink` sigue siendo la raíz: el `canonical` apuntaba a `/blog/` en
  lugar de `/blog/page/2/`, el `og:url` igual, y los `hreflang` anunciaban la
  página 2 como la traducción española de `/en/blog/`. El canonical y el
  `og:url` salen ahora de `.Paginator.URL`, y las páginas paginadas no emiten
  `hreflang`: son la continuación de una lista, no un documento con dos
  versiones.
- **`og:locale:alternate` decía el idioma que ya tenía la página.** Iba sobre
  `.AllTranslations`, que incluye la página misma, así que cada una se
  anunciaba como disponible en un idioma que ya era el suyo.
- **El selector de idioma sacaba «Español» dos veces, las dos marcadas como la
  página actual.** `aria-current="page"` estaba en los dos `<a>`, y el `<a>` de
  la página actual estaba dos veces en la lista. Venía de `.AllTranslations`,
  que ya la incluye, sumada a mano. Ahora es `.Translations`.
- **El control de paginación eran dos flechas sin nombre**, un `<ul>` suelto
  para el que no hay landmark que lo ubique. Ahora es un `<nav>` con su
  `aria-label` —que además era una clave de i18n que ninguna plantilla leía—.
- **46 páginas se describían solas con su primer párrafo**, un texto que nadie
  eligió para ser un resumen; y en 45 de ellas el `#` del ancla de sección se
  colaba en la etiqueta `description` y en los resultados del buscador. Las 134
  páginas de contenido tienen ahora una descripción escrita, en los dos idiomas,
  sin repetir una sola vez y ninguna de las dos cosas de antes.
- **El «Vasak Group» del pie se leía a 1.93:1 en cada página del sitio, y
  `axe` lo daba por bueno.** Es la segunda mitad de lo anterior: el texto iba
  pintado con `bg-clip-text` y `text-transparent`, o sea que el color lo ponía el
  degradado de la marca. `bg-clip-text` recorta el relleno a la forma del texto y
  deja el `color` en transparente, así que la regla `color-contrast` no tiene nada
  que comparar: marca el elemento como *incomplete* —«revisar a mano»— y la
  auditoría sigue dando verde con el texto en 1.93:1. El degradado iba de
  `--color-secondary` a `--color-primary`, y contra la superficie clara da 3.51:1
  en el extremo violeta y 1.93:1 en el rosa; en el modo oscuro el mismo
  degradado da 6.19:1 y 6.08:1 y pasaba de sobra, que es justo por qué nadie lo
  notó mirando sólo el oscuro. Como el enlace estaba en el pie, el fallo se
  repetía en las 166 páginas del sitio. No hay ningún par de la paleta que llegue
  a 4.5:1 a lo largo de todo el degradado —`--secondary` y `--primary` son los dos
  colores que más se usan de relleno—, así que ahora es `--color-brand-text`
  sólido: 5.03:1 en claro y 6.08:1 en oscuro. El «404» de la página de error, que
  usaba el mismo truco, también.
- **Los paneles con degradado de marca ya no llevan texto encima.** Los degradados
  a sangre —el hero de la portada, las fichas de la sección de características,
  los tres planes de precios, los casos de `/about/`— no se pueden dejar: un degradado
  de dos tonos de la paleta no tiene un color contra el que medir, y los dos
  extremos piden colores de texto opuestos. `--secondary` necesita texto claro
  —5.41:1 con blanco— y `--primary` necesita texto oscuro —5.49:1 con `#1e1e2e`—,
  así que en la mitad del degradado cualquier texto que serve para un extremo
  falla en el otro. Ahora son `bg-primary` sólido con `text-tx-on-primary`, que da
  5.49:1 en claro y 7.93:1 en oscuro. El degradado se queda donde no hay nada que
  leer: las baldosas de icono de 70 px, que llevan `aria-hidden`. La razón por la
  que fallaba sólo en oscuro es que `--color-tx-on-primary` es `#1e1e2e` en los
  dos modos mientras el degradado en oscuro se aclara —`--primary-dark` es
  `#eba0ac`, `--secondary-dark` es `#cba6f7`—: el color de texto se quedaba
  claro mientras el fondo se oscurecía.
- **Los enlaces que cambiaban a violeta al pasar el mouse ahora se subrayan.**
  `hover:text-secondary` estaba en seis sitios y `--secondary` da 3.51:1 sobre la
  superficie y 3.73:1 sobre un panel al 80 %: por debajo de los 4.5:1 que pide un
  enlace de 16 px, y por debajo del mínimo de 3:1 que ya le costaba al resto del
  pie. No hay un violeta más oscuro en la paleta, así que el hover deja de cambiar
  de tono y se resuelve con el subrayado, que es lo que ya hacían los siete
  enlaces de marca del pie.
- **El `iframe` de Telegram de la nota de votación no tenía nombre accesible.**
  El `<script>` del widget lo crea sin `title` en ninguna versión, así que el
  marco salía sin nombre en tres idiomas. `menu.js` ahora rotula los `iframe` de
  terceros que llegan sin nombre y se queda observando el documento, porque el
  marco lo inserta el script después de que la página haya cargado.
- **Las tablas de la documentación tenían una fila de encabezado sin texto.**
  En `content/docs/user/security{,.en}.md` la primera fila de la tabla de sus
  herramientas era `| | | | |`: separadores, guiones y barras pero ninguna
  palabra. El navegador la dibuja como si fuera un encabezado, y quien lee con
  lector de pantalla oye cuatro celdas de encabezado vacías y después una tabla
  de cuatro columnas que no anuncia. Ahora la fila dice qué contiene cada
  columna, y una prueba de `tests/design-system.test.ts` arma la misma clave de
  encabezado para cada tabla de cada documento y falla si alguna sale vacía.
- **El separador del menú móvil era un gris de Tailwind al 10 %.** Es
  `divide-gray-500/10`, que compuesto contra la superficie da menos de 1.1:1: en
  modo claro no se veía. `divide-ui-border` es el token que ya separa todo lo
  demás del sitio y cambia con el modo. Es el último gris suelto que quedaba en
  las plantillas, junto con un `dark:text-gray-200` en los planes de
  `/precios/` que además estaba mal: `--tx-main` ya es `#cdd6f4` en el modo
  oscuro, así que `#e5e7eb` era el mismo tono con otro nombre y sin token detrás.
- **`img-fluid` era una clase de Bootstrap y no existe en este tema.** La
  usaba el shortcode `img` —ninguna imagen del sitio lo usa, pero estaba— y
  Tailwind v4 descarta en silencio lo que no reconoce, así que la imagen salía
  con el ancho del atributo y sin nada más, que es lo contrario de lo fluid que
  el nombre promete. Además el `title` caía por omisión al mismo texto que el
  `alt`, y con el `title` igual al `alt` el navegador muestra una burbuja que
  repite lo que el lector de pantalla acaba de decir. Ahora el `title` sale
  sólo si el autor lo escribe.
- **La clase `faq-answer` no existía en ningún CSS.** Estaba en el acordeón de
  la FAQ, y como Tailwind v4 no avisa de las clases que no reconoce, el nombre
  sugería un estilo que no había. El acordeón ahora es una tarjeta por pregunta,
  con el chevron adentro de un círculo que gira al abrirse.

### Texto

- **El sitio entero está en español neutro.** Estaba escrito en voseo —
  «podés», «instalá», «conocé»—, que es el registro de Argentina y de medio
  resto del Río de la Plata pero no de España ni de el resto de Latinoamérica.
  Son 93 formas en 12 archivos, 5 claves de `i18n/es.toml` y 6 textos sueltos.
  Ningún usuario del sitio busca «podés instalar», así que el neutro le sirve a
  todo el mercado hispanohablante.
- **138 tildes y 61 erratas.** «éxito» sin tilde, «contibuido», «continuarás
  encontrando», «máquina virtual». Con una condición: la revisión se hizo con
  listas escritas a mano y verificadas una por una, no con un diccionario. Un
  diccionario de español renombra los nombres propios y los identificadores de
  los nodos de un diagrama de mermaid, y en tres casos así se rompió el build o
  una plantilla.
- **El nombre de la marca es `VasakOS`, sin espacio.** Aparecía de las dos
  formas, 113 y 24 veces. Las etiquetas de artículo quedan como están: son
  palabras clave en minúscula y son otro problema.
- **Los títulos de página se escribieron para que no los corte el buscador.**
  Tres artículos en español y tres en inglés tinham títulos de más de 62
  caracteres, y `/downloads/` had un `seotitle` que competía con el título de la
  pestaña. Al acortar el título de un artículo se le mueve la URL —los
  permalinks son `/blog/:year/:month/:title`—, así que los seis tienen su
  `aliases:` apuntando al nombre viejo. La portada usaba el eslogan como
  `<title>`: son cosas distintas, y ahora hay una clave para cada una.
- **Cinco capturas no tenían `alt` y cuatro decían una sola palabra.** Una
  pantalla no se anuncia sin `alt`, y «Preview» o «Tabs» no le dicen nada a
  quien no ve la imagen. Los textos nuevos dicen lo que el propio artículo
  afirma de cada figura, que es todo lo que se puede decir sin mirar los
  archivos.

### Administrado

- **La gramática de componentes se comprueba en los dos sentidos.** Una clase de
  `@layer components` que nadie usa es código muerto que además da la impresión
  de que el sitio la respeta; y como Tailwind v4 descarta en silencio lo que no
  reconoce, una clase mal escrita deja al elemento sin nada y no hay ningún
  aviso —sólo se ve mirando el CSS emitido—. La prueba hace las dos cosas.
  `.btn-secondary` y `.btn-danger` no aparecen en ningún atributo `class` de las
  plantillas y no es que estén sin usar: `ui/action-button.html` elige el tono
  desde un mapa con `printf`, así que el nombre se compone en el momento de
  renderizar.
- **Tres pruebas nuevas sobre cosas que fallan sin avisar:**
  - *El índice lateral se estila con el marcado que Hugo emite.* La plantilla de
    índice de Hugo es fija y escribe un `<ol>` aunque no haya nada que ordenar.
    Una regla escrita contra `ul` no falla de ninguna forma visible: el CSS se
    emite, la prueba de que la clase existe pasa, y el índice sigue con la
    numeración del navegador porque `list-style` nunca se aplicó a la lista que
    está ahí. La prueba no comprueba que exista una regla que mencione
    `#TableOfContents`, sino que la que quita la numeración alcance a `ol`.
  - *El movimiento tiene tres duraciones y ninguna más.* Cada número que se cuela
    vuelve a hacer que dos elementos que hacen lo mismo se sientan distintos.
    Agregar uno es fácil —una línea— y por eso tiene que exigir que se escriba el
    por qué.
  - *Cada celda de una lista de definiciones empieza por su término.* La que
    encontró el `definition-list` de `/about/`. Se lee el HTML que Hugo genera y
    no la plantilla, porque la regla es del HTML final y en la plantilla hay
    `{{ range }}` de por medio.
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
- **Diez pruebas más sobre lo que el buscador lee** (`tests/seo.test.ts`):
  que ningún título pase de 62 caracteres, que `seotitle` siga siendo la
  excepción y no una copia de `title` en las 134 páginas, que las 134 tengan
  descripción, que ninguna se corte a mitad de palabra ni repita la de al lado,
  que el resumen de i18n entre en 158 caracteres y arranque por la marca, que
  las rutas del menú terminen en barra y que los dos menús tengan las mismas
  entradas, y que ninguna imagen del contenido se quede sin `alt`. También
  estas se comprobaron **mutando el código y viendo que la prueba se pone roja**
  —las seis mutaciones mueren, incluida la de las dos páginas con la misma
  descripción, que hubo que hacer copiando una sobre la otra, porque cambiar el
  texto de una no crea un duplicado.
- **La auditoría de accesibilidad se repite contra el build y se verifica a sí
  misma.** 32 páginas × los dos modos, 64 auditorías, 0 violaciones. Antes de
  confiar en el cero se le inyectó una infracción a propósito —gris claro sobre
  blanco— y `color-contrast` la encontró. Un 0 de violaciones que en realidad
  sea un 0 de mediciones es el peor resultado posible: parece bien y no está
  diciendo nada.
- **Los radios y las sombras quedaron como invariantes comprobables.** Los
  tokens viven en `@theme`, así que `rounded-xs/s/m/l/xl` y `shadow-s/m/l` se
  generan de verdad, y las pruebas comprueban que el CSS compilado los tiene y que
  no queda ningún `rounded-corner` de la escala vieja colgando. Los tres alias
  viejos —`--radius-corner`, `--radius-corner-sm`, `--radius-corner-window`— se
  dejaron en `:root` y **fuera** de `@theme` a propósito: si vivieran dentro,
  Tailwind genera un `rounded-corner` que nadie pidió y la escala deja de ser la
  única forma de pedir un radio, que es justo lo que la escala tiene que ser.
- **Las etiquetas del sitio ya no son tres páginas para la misma palabra.**
  `vasak`, `vasak os` y `vasakos` eran la misma palabra escrita de tres formas;
  `arch linux` y `arch-linux`, la misma; `open source` y `open-source`,
  también; y `changelog` y `changelogs` convivían **en la misma lista** de los
  cinco changelogs, en singular y plural. El término canónico es el que coincide
  con el nombre de la sección —`vasakos`, `arch-linux`, `open-source`,
  `changelogs`—, que además da la URL más corta. Se fueron siete términos que
  sólo existían para repetir la marca —`download vasakos`, `descargar vasakos`,
  `about vasakos`, `sobre vasakos`, `donations vasak`, `support vasakos`,
  `vasak donatcion`—, una fecha suelta que se había colado como etiqueta, y
  `download` de la página de descargas en español, que ya tenía `descargas` y
  además repetía la palabra en inglés donde la versión inglesa ya la ponía. En
  `/terms/` y `/en/terms/` las cuatro etiquetas se redujeron a las que de verdad
  describen el documento. Quedan **78 términos distintos** —61 en español y 52 en
  inglés, 36 compartidos—, sin repetidos dentro de una lista, sin dos que se
  escriban igual y sin dos que peleen por la misma URL.
- **Ocho pruebas nuevas vigilan la higiene de las etiquetas**
  (`tests/tags.test.ts`): que ninguna lista repita un término, que nada se
  escriba de dos formas —incluido el singular contra el plural—, que dos
  términos no produzcan la misma carpeta, que ninguno sea una fecha ni una
  marca inflada con una palabra de más, que el contenido en español no lleve el
  término del otro idioma, y que todo término termine siendo una página
  publicada. Se comprobaron una por una **mutando el contenido y viendo que la
  prueba se pone roja**: `changelogs`→`changelog`, un término repetido en la
  misma lista, y un término inglés en una página en española. Una de ellas
  —la que revisa contra `public/`— necesita el build hecho y salta con un aviso
  si no está: sin el salto, `bun test` sobre un clon recién bajado pasa en verde
  con las 111 carpetas sin comprobar.
- **Dos encargos resultaron no hacer falta, y conviene dejarlo escrito.** Los
  paneles de `bg-*/60` a `/80` ya estaban en `/80` desde antes de esta rama —
  comprobado contra `git show HEAD:`, no de memoria— y `/terms/` ya estaba
  íntegramente en español: `lang="es-AR"`, 155 bloques de texto contra 158 del
  inglés, y las únicas cadenas que comparten con la versión inglesa son URLs y el
  correo. Se pierden dos tareas y no se toca nada.
- **La limpieza de grises fuera de paleta dejó 51 usos y 7 radios.** `text-gray-*`
  y `bg-gray-*` salían de la convención de Tailwind, no de la paleta: los grises
  de Tailwind no están en ningún token y no cambian con el modo oscuro. Ahora
  usan `text-tx-main`, `text-tx-muted` y `bg-ui-surface`. Los 7 radios que no
  estaban en la escala pasaron a `rounded-xl` o `rounded-s`.
- **Dos reglas de CSS muertas se fueron, con el motivo anotado en su lugar.**
  `dialog.mobile-menu-dialog` describía un `<dialog>` que el sitio no tiene —el
  menú es un `div` con `role="dialog"`—, y el `code::before` usaba una variable
  `--bg-site` que no existe y un `data-lang` que ningún elemento declara.
- **La auditoría de accesibilidad pasó de 32 páginas a 166, en los dos modos: 332
  auditorías y 0 violaciones.** Las 32 eran una muestra elegida a mano; el
  barrido completo es lo que destapó lo del degradado recortado. Las 9 páginas
  de la lista que son *aliases* —un `meta-refresh` de ocho líneas que manda al
  sitio en producción— quedan fuera: no hay nada que auditar y su redirección
  sacaba la pestaña del servidor local.
- **Medir el color de fondo a mano tiene una trampa que casi hace pasar un
  defecto real.** Tailwind v4 serializa sus tokens en `oklab()`, no en `rgb()`,
  y un lector con expresión regular tomaba las coordenadas de OKLab por canales
  sRGB: `bg-ui-bg/80` es `oklab(0.9577… 0.0005… 0.0057… / 0.8)`, que leído como
  RGB da `rgb(1,0,0)` y compuesto sobre la superficie da `rgb(42,42,44)`. Con eso
  el pie entero «fallaba» con 1.85:1 en modo claro, cuando lo que se ve en
  pantalla da 5.17:1. La conversión se validó contra tres colores conocidos
  antes de confiar en un solo número.
- **La auditoría tuvo que arreglar tres veces su propio
  método antes de servir para algo**, y vale la pena anotarlo porque los tres
  fallos daban el mismo resultado que un sitio roto:
  1. Correr axe dentro de un `iframe` dio `#9a9dad` como color de un elemento
     que en la pestaña real mide `#4c4f69`: 2.23:1 en vez de 6.64:1. El color
     que axe calcula dentro de un marco no coincide con el de la pestaña, así
     que las cifras no servían. Se audita navegando de verdad.
  2. Cambiar el tema *después* de cargar hacía que axe midiera colores a medio
     camino de la transición: `#9a9dad` y `#787c93` son `text-tx-main`
     interpolando entre el valor de claro y el de oscuro. Un sitio entero
     parecía tener dos infracciones de contraste que no tenía.
  3. La última forma —cargar con el modo ya puesto en `localStorage` y recargar
     con una URL distinta— es la que funciona: la página arranca en el modo que
     se va a medir y no hay transición que medir.

  Y el servidor importa: `python3 -m http.server` atiende un pedido a la vez.
  Una página del blog pide cien recursos, el navegador los abre en paralelo y
  cada uno espera al anterior, así que la navegación tardaba más de un minuto y
  la herramienta la daba por perdida aunque la página cargara bien. Se auditó
  contra un servidor concurrente.

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
