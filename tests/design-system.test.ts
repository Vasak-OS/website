import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/*
  Invariantes del sistema de diseño del sitio.

  Los tokens viven en `themes/vasakos/assets/css/styles.css` y las plantillas los
  consumen como utilidades de Tailwind. El problema de esa combinación es que
  Tailwind v4 descarta en silencio lo que no reconoce: una clase mal escrita no
  produce CSS ni aviso, y el elemento se queda sin fondo, sin color o sin
  subrayado. La verificación tiene que ser sobre el texto de las plantillas,
  que es lo único que se puede leer sin renderizar.

  Cada test de aquí fijó un defecto que se encontró mirando el sitio con
  axe-core, no leyendo el código. Por eso están escritos como prohibición de un
  patrón concreto y no como una fotografía del estado actual: si mañana alguien
  escribe `text-primary` otra vez, tiene que sonar.
*/

const TEMA = "themes/vasakos";

/** Todos los archivos de un directorio, recursivo, saltando los ocultos. */
function archivos(directorio: string, extensión: string): string[] {
  const encontrados: string[] = [];
  for (const entrada of readdirSync(directorio)) {
    if (entrada.startsWith(".")) continue;
    const ruta = join(directorio, entrada);
    if (statSync(ruta).isDirectory()) encontrados.push(...archivos(ruta, extensión));
    else if (ruta.endsWith(extensión)) encontrados.push(ruta);
  }
  return encontrados;
}

const plantillas = archivos(`${TEMA}/layouts`, ".html");
const estilos = archivos(`${TEMA}/assets`, ".css");
const datos = archivos("data", ".yaml").concat(archivos("data", ".yml"));

/** Rutas relativas al sitio, para que los mensajes de falla sean legibles. */
const casos = (archivos_: string[], donde: (c: string) => boolean) =>
  archivos_.flatMap((ruta) => {
    const lineas = readFileSync(ruta, "utf8").split("\n");
    return lineas.flatMap((linea, i) =>
      donde(linea) ? [`${ruta}:${i + 1}  ${linea.trim().slice(0, 90)}`] : []
    );
  });

/**
 * Una plantilla sin sus comentarios: los de Hugo, que pueden ocupar veinte
 * renglones y cuyo interior es prosa —donde el nombre de una clase prohibida
 * aparece a propósito—, y los de HTML.
 *
 * Hace falta porque las plantillas del sitio explican en el comentario por qué
 * se quitó un patrón, y ese comentario nombra el patrón. Una prueba que leyera
 * el archivo entero se acusaría a sí misma.
 */
function sinComentarios(texto: string): string {
  return texto.replace(/\{\{-?\s*\/\*[\s\S]*?\*\/\s*-?\}\}/g, "").replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * La hoja sin sus comentarios de CSS.
 *
 * Es el hermano de `sinComentarios` para el otro lenguaje: los comentarios de
 * Hugo y de HTML no tocan `styles.css`, y los comentarios de CSS —que son veinte
 * párrafos que explican por qué se quitó cada cosa— tampoco se quitan con
 * `sinComentarios`. Hace falta porque una prueba que busca el texto de una regla
 * puede aparecer primero en el párrafo que explica por qué esa regla cambió, y
 * Lee la explicación como si fuera la regla.
 */
function sinComentariosCSS(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Los nombres de clase que aparecen **de verdad** en los atributos `class`, con
 * el atributo ya partido por espacios.
 *
 * Se separa por espacios y no con `\b` porque `\b` de la cadena completa hace
 * que `card` case dentro de `card-hover`: en `class="card card-hover"` el
 * nombre está, y en `class="card-surface"` no —con `\b` los dos casos, que es
 * exactamente al revés de lo que se quiere comprobar.
 */
function clasesUsadas(texto: string): Set<string> {
  const usadas = new Set<string>();
  for (const atributo of texto.matchAll(/class="([^"{}]*)"/g)) {
    for (const nombre of atributo[1].split(/\s+/)) if (nombre) usadas.add(nombre);
  }
  return usadas;
}

describe("el texto de marca usa su propio token", () => {
  /*
    `--primary` es un relleno: #dd7878 sobre #e8eaf0 da 1.93:1 y no se puede leer
    como texto. Para eso está `--brand-text`, que en claro es #8a3550 y en
    oscuro reutiliza el primario ya aclarado. Lafills van con `bg-primary`,
    `border-primary`, `from-primary`; el texto va con `text-brand-text`.
  */
  test("ninguna plantilla usa text-primary", () => {
    const malos = casos(plantillas, (l) => /\btext-primary\b/.test(l));
    expect(malos).toEqual([]);
  });

  test("ningún dato de yaml usa text-primary", () => {
    const malos = casos(datos, (l) => /\btext-primary\b/.test(l));
    expect(malos).toEqual([]);
  });

  test("el token --brand-text está declarado y cableado en los dos modos", () => {
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");
    expect(css).toContain("--brand-text:");
    expect(css).toContain("--brand-text-dark:");
    // La indirección por modo es la que hace que `text-brand-text` cambie solo.
    expect(css).toContain("--use-brand-text:");
    // Y tiene que llegar a la utilidad, o la clase no existe.
    expect(css).toContain("--color-brand-text:");
  });
});

describe("los rellenos de marca llevan el token de texto que les corresponde", () => {
  /*
    `text-white` sobre `bg-primary` da 2.98:1 en claro y 2.06:1 en oscuro — en
    oscuro `--primary` pasa a #eba0ac, que es clarísimo. El token para texto
    encima de un relleno de marca es `--text-on-primary`, que da 5.49:1 en los
    dos modos. Lo mismo con `--secondary` y `--text-on-secondary`.
  */
  test("nadie combina bg-primary con text-white en la misma clase", () => {
    const malos = plantillas.flatMap((ruta) => {
      const html = readFileSync(ruta, "utf8");
      const atributos = html.match(/class="[^"]*"/g) ?? [];
      return atributos
        .filter((a) => /\bbg-primary\b/.test(a) && /\btext-white\b/.test(a))
        .map((a) => `${ruta}  ${a.slice(0, 100)}`);
    });
    expect(malos).toEqual([]);
  });

  test("nadie combina bg-secondary con text-white en la misma clase", () => {
    const malos = plantillas.flatMap((ruta) => {
      const html = readFileSync(ruta, "utf8");
      const atributos = html.match(/class="[^"]*"/g) ?? [];
      return atributos
        .filter((a) => /\bbg-secondary\b/.test(a) && /\btext-white\b/.test(a))
        .map((a) => `${ruta}  ${a.slice(0, 100)}`);
    });
    expect(malos).toEqual([]);
  });

  /*
    Un degradado de marca no admite un único color de texto. `#8839ef` da 5.41:1
    con blanco pero 3.03:1 con `#1e1e2e`, y `#dd7878` al revés: 2.99:1 con
    blanco, 5.49:1 con `#1e1e2e`. Como los dos extremos del degradado piden
    colores opuestos, cualquier texto encima queda por debajo de 4.5:1 en uno de
    ellos, y `axe` lo aprueba porque un fondo con degradado no lo sabe medir: lo
    marca como *incomplete* y no lo cuenta como violación. Eso es exactamente lo
    que pasó con los paneles de "features", "about" y "prices", donde
    el encabezado quedaba en 3.03:1 —apenas sobre el 3:1 del texto grande— y la
    etiqueta de 16 px se quedaba en ese mismo 3.03:1, cuando necesita 4.5:1.

    La regla que lo sostiene: sobre un degradado de marca no se escribe texto.
    El degradado queda para lo decorativo —los iconos de `advantages` y `docs`,
    que son `aria-hidden`— y el panel que lleva texto usa el relleno sólido con
    su token.
  */
  test("ningún texto se apoya en un degradado de marca", () => {
    const malos = plantillas.flatMap((ruta) => {
      const html = readFileSync(ruta, "utf8");
      // Se lee etiqueta por etiqueta y no atributo por atributo porque la
      // exención depende de un atributo vecino: un degradado cuyo único texto es
      // un icono lleva `aria-hidden` en la misma etiqueta, y ese icono no tiene
      // nada que leer. Lo que se busca es un degradado con texto *visible*.
      return [...html.matchAll(/<(\w+)\b[^>]*>/g)]
        .map((m) => m[0])
        .filter((etiqueta) => /class="[^"]*bg-gradient-to-\w+/.test(etiqueta))
        .filter((etiqueta) => !/aria-hidden/.test(etiqueta))
        .filter((etiqueta) =>
          /\btext-(white|tx-on-primary|tx-on-secondary|tx-main|tx-muted|brand-text)\b/.test(etiqueta))
        .map((etiqueta) => `${ruta}  ${etiqueta.slice(0, 110)}`);
    });
    expect(malos).toEqual([]);
  });

  test("el texto no se pinta con un degradado recortado", () => {
    /*
      `bg-clip-text` + `text-transparent` pinta el texto con el degradado y le
      saca el color. Es la forma más bonita de escribir «404» y también la
      primera que `axe` no puede medir: al no haber un `color`, la regla
      `color-contrast` no tiene nada que comparar, marca el elemento como
      *incomplete* y la auditoría sigue dando verde con el texto en 1.93:1.

      Se midió a mano antes de borrar nada. `from-secondary to-primary` sobre la
      superficie clara da 3.51:1 en el extremo violeta y 1.93:1 en el rosa: el
      "404" de 72 px necesita 3:1 y el enlace "Vasak Group" del pie, de 18 px,
      necesita 4.5:1, así que los dos perdían. En oscuro el mismo degradado da
      6.19:1 y 6.08:1 y pasaba, lo que explica que nadie lo notara mirando sólo
      el modo oscuro. Ningún par de la paleta llega a 4.5:1 a lo largo de todo
      el degradado, y por eso la salida es `--color-brand-text` sólido.

      La prueba es bluntly total: `bg-clip-text` no aparece en ninguna plantilla.
      Si algún día hace falta escribir un titular con degradado, la forma
      correcta es medirlo a mano y dejarlo anotado acá, no confiar en el verde
      de la auditoría.
    */
    const malos = plantillas.flatMap((ruta) => {
      // Los comentarios de Hugo se limpian antes de buscar: el párrafo de arriba
      // nombra la utilidad para explicar por qué no está, y contarlo como uso
      // haría que la prueba no pudiera pasar nunca.
      const html = readFileSync(ruta, "utf8").replace(/\{\{-?\s*\/\*[\s\S]*?\*\/\s*-?\}\}/g, "");
      return (html.match(/bg-clip-text/g) ?? []).map((c) => `${ruta}  ${c}`);
    });
    expect(malos).toEqual([]);
  });
});

describe("el resaltado de código es la terminal, no un tema ajeno", () => {
  /*
    `syntax.css` era el tema Monokai de Hugo: #66d9ef, #a6e22e, #f92672 sobre
    #272822, escritos a mano y sin ninguna relación con la paleta. Ahora sale
    enteramente de los tokens del terminal. La regla que lo sostiene es simple:
    en ese archivo no puede haber ningún color escrito, solo `var(--...)`. Si
    alguien pega un hex, es que se está colando un tema que no es de la librería.
  */
  test("syntax.css no contiene ningún color escrito a mano", () => {
    const css = readFileSync(`${TEMA}/assets/css/syntax.css`, "utf8");
    // Se ignoran los comentarios: pueden citar los hexes viejos para explicar qué
    // eran. Lo que no puede aparecer es un color en una declaración.
    const codigo = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const hex = codigo.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    expect(hex).toEqual([]);
  });

  test("los bloques de código se pintan con --code-bg, no con la paleta suelta", () => {
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");
    // Estas reglas ganaban a `syntax.css` sólo por orden de cascada, así que sin
    // el token el fondo volvía a ser el gris de Tailwind y el tema no se veía.
    for (const selector of ["pre,", ".highlight {"]) {
      const i = css.indexOf(selector);
      expect(i).toBeGreaterThan(-1);
      const bloque = css.slice(i, css.indexOf("}", i));
      expect(bloque).toContain("--code-bg");
    }
    expect(css).not.toMatch(/^\.chroma\s*\{[^}]*bg-gray-200/m);
  });

  test("la paleta de Tailwind no se publica", () => {
    /*
      `@theme` hereda por omisión los veintidós grises de Tailwind, y con ellos el
      sitio tenía una segunda paleta: paralela a la de `:root`, que no cambia con
      el modo oscuro y que nadie audita. Ya se habían quitado de las plantillas las
      cincuenta y una clases que la usaban, pero el preflight seguía pidiendo
      `--color-gray-200` para el borde por omisión —de modo que todo `border` sin
      color recibía `#e5e7eb`, un gris que no es del tema— y el `text-gray-400` de
      un bloque de código de la documentación lo volvía a colar.

      Con `--color-*: initial` un `gray-*` equivocado produce una clase sin color,
      que se ve al primer pintado, en vez de un color ajeno que sólo se descubre
      leyendo el CSS publicado. Se comprueba contra las fuentes del tema y no
      contra el CSS compilado, porque el punto es que la paleta no llegue a
      declararse nunca.

      Se lee sin comentarios porque esta misma prueba tiene que nombrar el gris
      que prohíbe para explicar por qué lo prohíbe, igual que las plantillas
      nombran los patrones que quitaron. `sinComentarios` alcanza para los
      comentarios de Hugo y de HTML, así que los de CSS —que es donde vive la
      paleta— se quitan aparte.
    */
    const depurado = (ruta: string) =>
      sinComentarios(readFileSync(ruta, "utf8")).replace(/\/\*[\s\S]*?\*\//g, "");

    const conGris = estilos
      .concat(plantillas)
      .filter((ruta) => /--color-(gray|slate|zinc|stone|neutral)-\d/.test(depurado(ruta)))
      .map((ruta) => ruta.replace(`${TEMA}/`, ""));
    expect(conGris).toEqual([]);

    /*
      Y la lista tiene que estar vaciada a propósito, no por casualidad. Sin esta
      línea, Tailwind publica los veintidós grises aunque el sitio no los pida, y
      ninguna otra comprobación sobre las fuentes lo vería: en el CSS fuente no
      hay ningún `--color-gray-*` que cazar, sólo la herencia que lo trae. Se
      comprueba sobre el texto sin comentarios porque el párrafo de arriba nombra
      la línea para explicarla.
    */
    const css = depurado(`${TEMA}/assets/css/styles.css`);
    expect(css).toContain("--color-*: initial");
    // Y los dos colores que sí están fuera de la paleta tienen que seguir.
    expect(css).toMatch(/--color-white:\s*#fff/);
    expect(css).toMatch(/--color-black:\s*#000/);
  });

  test("el borde por omisión es un token del tema", () => {    /*
      El preflight de Tailwind v4 pone `border-color: var(--color-gray-200,
      currentColor)` sobre `*, ::after, ::before, ::backdrop,
      ::file-selector-button`. En claro `#e5e7eb` y `--ui-border` (`#dce0e8`) se
      parecen tanto que el defecto pasaba desapercibido; en oscuro `--ui-border`
      es `#11111b` y el borde de todo salía claro.

      Se comprueba el bloque entero y no la línea suelta porque lo que importa es
      que sea el selector del preflight el que quedó escrito con el token, y no
      una regla nueva que lo pise por casualidad.
    */
    const css = sinComentarios(readFileSync(`${TEMA}/assets/css/styles.css`, "utf8"));
    const i = css.indexOf("::file-selector-button {");
    expect(i).toBeGreaterThan(-1);
    const bloque = css.slice(i, css.indexOf("}", i));
    expect(bloque).toContain("border-color: var(--color-ui-border)");
    expect(bloque).not.toContain("gray");
  });

  test("la barra es una ventana: en reposo no proyecta nada", () => {
    /*
      La barra era `shadow-m border-ui-border` desde el primer píxel, que es al revés
      de como lo hace OnceUI. Una sombra es la forma que tiene una caja de decir
      «estoy delante», y arriba del todo de una página no hay nada detrás: la
      sombra dibujaba una banda oscura y difusa sobre el encabezado de todas las
      páginas, y era la primera cosa que se veía al abrir cualquiera.

      Ahora el borde y la sombra maduran al scrollear. Se comprueban los dos
      estados y no sólo que la clase exista, porque el defecto anterior era
      justamente una clase que sí existía y pintaba de más.

      El fondo translúcido no se comprueba: en la portada la barra queda sobre la
      fotografía del hero y sin él los enlaces del menú se leerían sobre la foto.
    */
    const css = sinComentarios(readFileSync(`${TEMA}/assets/css/styles.css`, "utf8"));

    const bloque = (sel: string) => {
      const i = css.indexOf(sel);
      expect(i).toBeGreaterThan(-1);
      return css.slice(i, css.indexOf("}", i));
    };

    expect(bloque(".header-bar {")).toMatch(/box-shadow:\s*none/);
    expect(bloque(".header-bar {")).toMatch(/border-color:\s*transparent/);
    expect(bloque(".header-bar.is-scrolled {")).toContain("var(--use-shadow-m)");
    expect(bloque(".header-bar.is-scrolled {")).toContain("var(--color-ui-border)");

    // Y la sombra corta no puede volver a escribirse en la plantilla.
    const barra = sinComentarios(readFileSync(`${TEMA}/layouts/partials/header.html`, "utf8"));
    expect(barra).toContain("header-bar");
    expect(barra).toContain("data-header");
    expect(barra).not.toMatch(/shadow-[sml]/);
  });

  test("la altura de la barra la dice un token, y el salto al ancla lo sabe", () => {
    /*
      La altura estaba implícita en el relleno del `<nav>` —`p-6`— y nadie la
      conocía: 76 px medidos. Hacía falta conocerla para el `scroll-padding-top`,
      que no existía, y sin él cualquier salto a un ancla —el de cada título, el
      del índice lateral— dejaba el destino debajo de la barra, que es `sticky`.

      Se comprueban las tres cosas juntas porque son las tres que tienen que
      concordar: el token, la barra que lo toma y el `<html>` que lo usa para dejar
      el aire. Si una cambia y las otras dos no, el salto vuelve a quedar tapado.
    */
    const css = sinComentarios(readFileSync(`${TEMA}/assets/css/styles.css`, "utf8"));
    expect(css).toMatch(/--header-h:\s*4rem/);
    expect(css).toMatch(/scroll-padding-top:\s*calc\(var\(--header-h\)/);

    const i = css.indexOf(".header-bar {");
    expect(css.slice(i, css.indexOf("}", i))).toContain("height: var(--header-h)");

    // El alto sale del token y no de un relleno vertical en la plantilla.
    const barra = sinComentarios(readFileSync(`${TEMA}/layouts/partials/header.html`, "utf8"));
    expect(barra).toMatch(/<nav class="[^"]*\bh-full\b/);
    expect(barra).not.toMatch(/<nav class="[^"]*\bpy-/);
  });
});

describe("los valores por defecto ceden ante la intención explícita", () => {
  /*
    `:where()` sin specificity no alcanzaba: un selector sin capa le gana a
    cualquier utilidad de Tailwind porque las utilidades viven en
    `@layer utilities`, y lo que está fuera de toda capa las supera a ellas. Por
    eso `:where(#article a)` seguía pintando de rosa el botón de /about/ que
    declaraba su propio `text-tx-on-primary`. Con la regla dentro de
    `@layer components`, `utilities` va después y gana.
  */
  test("los valores por defecto de la tipografía están en @layer components", () => {
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");
    // Se busca la llave de la regla, no su nombre: el comentario que explica por
    // qué va en la capa menciona las dos reglas, y `indexOf` seenia ese.
    const capa = css.indexOf("@layer components {");
    expect(capa).toBeGreaterThan(-1);
    const enlace = css.indexOf(":where(#article a) {");
    expect(enlace).toBeGreaterThan(capa);
    const tarea = css.indexOf("#article li:has(> input[type=\"checkbox\"]) {");
    expect(tarea).toBeGreaterThan(capa);
  });

  test("el enlace en línea de un párrafo va subrayado", () => {
    /*
      `--brand-text` es #8a3550 y `--text-main` es #4c4f69: entre los dos hay
      1.02:1, o sea que un enlace dentro de un párrafo no se distingue por el
      tono. La regla `link-in-text-block` de axe mide justamente eso, y no hay
      ningún valor de rosa que la cumpla sin volverse ilegible sobre el fondo.
      El subrayado es lo que la resuelve.

      Se busca la utilidad suelta y no la palabra "underline": con un
      `indexOf` esto pasaba también con `underline-offset-2` en la lista y la
      prueba no habría notado que le sacan el subrayado.
    */
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");
    const i = css.indexOf(":where(#article a) {");
    expect(i).toBeGreaterThan(-1);
    const bloque = css.slice(i, css.indexOf("}", i));
    const aplicadas = bloque.split("@apply")[1] ?? "";
    const utilidades = aplicadas.split(/[\s;]+/).filter(Boolean);
    expect(utilidades).toContain("underline");
  });

  test("también lo lleva el ancla que cuelga de cada título", () => {
    /*
      `render-heading.html` cuelga un `#` enlazado al propio título de cada
      sección, y ese `#` estaba explícitamente sin subrayado: la idea era que el
      símbolo ya era un enlace y el subrayado sobraba. `axe` no la comparte —mide
      el contraste contra el texto vecino y, si sólo cambia el color, marca
      `link-in-text-block` (WCAG 1.4.1)—, y los changelogs son las páginas con
      más títulos, así que ahí salía la violación.

      La prueba mira la regla por separado de la de los enlaces en línea porque
      es la que puede volver a perder el subrayado sin que la otra se entere.
    */
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");
    const i = css.indexOf("#article .heading-anchor {");
    expect(i).toBeGreaterThan(-1);
    const bloque = css.slice(i, css.indexOf("}", i));
    expect(bloque).toContain("underline");
    expect(bloque).not.toContain("no-underline");
  });
});

describe("la estructura no se desarma al cambiar una plantilla", () => {
  test("el menú móvil tiene nombre accesible", () => {
    const header = readFileSync(`${TEMA}/layouts/partials/header.html`, "utf8");
    // El menú móvil ahora usa un <div> con role="dialog" y aria-labelledby
    expect(header).toContain('role="dialog"');
    expect(header).toContain('aria-labelledby="mobile-menu-title"');
  });

  test("el logo no repite su nombre en el alt y en el texto adyacente", () => {
    /*
      El enlace del logo llevaba `<span class="sr-only">VasakOS</span>` y además
      `alt="VasakOS"`, así que su nombre accesible era "VasakOS VasakOS".
    */
    const header = readFileSync(`${TEMA}/layouts/partials/header.html`, "utf8");
    expect(header).not.toContain('alt="VasakOS"');
  });

  test("el pie es un landmark, no un div suelto", () => {
    const pie = readFileSync(`${TEMA}/layouts/partials/footer.html`, "utf8");
    expect(pie).toContain("<footer>");
    expect(pie).toContain("</footer>");
  });

  test("ningún enlace cambia de color al pasar el mouse", () => {
    /*
      Seis enlaces de marca usaban `hover:text-secondary`, y `--secondary` es
      `#8839ef`: 3.51:1 contra `--color-ui-surface` y 3.73:1 contra el
      `bg-ui-bg/80` que lo envuelve, cuando un enlace de 16 px necesita 4.5:1.
      En oscuro el mismo salto da 6.19:1 y pasaba, así que el fallo sólo se veía
      en el modo claro —y `axe` lo mide sobre el estado actual, con lo que
      tampoco lo reportaba salvo que el puntero estuviera encima.

      La respuesta no es buscar un violeta más oscuro —la paleta no tiene uno—,
      sino dejar de cambiar el color: el hover pasa a subrayar, que es lo que ya
      hacían los otros siete enlaces de marca del sitio y lo que resuelve
      `link-in-text-block` sin depender de la luminosidad.

      Se cuentan los atributos de verdad, no las palabras: el nombre de la clase
      aparece dentro de los comentarios de las plantillas —este mismo lo cita,
      y el de los resultados del buscador explica por qué el título conserva el
      subrayado—, y una prueba que leyera el archivo entero accusationaría al
      comentario. Lo que importa es lo que el navegador recibe.
    */
    const malos = plantillas.flatMap((ruta) => {
      const html = readFileSync(ruta, "utf8");
      // Sólo dentro de una etiqueta: en la prosa de un comentario la palabra no
      // es un atributo.
      const atributos = html.match(/class="[^"]*hover:text-[a-z0-9-]+[^"]*"/g) ?? [];
      return atributos
        .filter((c) => /hover:text-(primary|secondary|gray-\d+|white)\b/.test(c))
        .map((c) => `${ruta}  ${c}`);
    });
    expect(malos).toEqual([]);
  });

  test("los iframes de terceros reciben nombre accesible", () => {
    /*
      El embed de Telegram es un `<script>` de `telegram.org` que crea el
      `<iframe>` él mismo, sin `title` ni `aria-label`, y `axe` marcaba
      `frame-title` (WCAG 4.1.2) en los dos idiomas de la entrada de icons.
      Poner el nombre en el markdown no sirve: cuando el Markdown se procesa el
      `iframe` todavía no existe. Tiene que hacerlo el script del sitio, y por eso la
      prueba mira que la rotación exista y que respete los `iframe` que ya
      vengan nombrados — el nombre del tercero es mejor que uno inventado acá.

      El `t.me/` del final no es un detalle: el `iframe` que crea el widget
      carga desde `t.me/.../?embed=1` y `telegram.org` es sólo el origen del
      `<script>`. Buscar el dominio del script deja el `iframe` sin rotular y
      `axe` vuelve a marcar `frame-title`.
    */
    const js = readFileSync(`${TEMA}/assets/js/menu.js`, "utf8");
    expect(js).toContain("rotularIframes");
    expect(js).toContain('iframe:not([title]):not([aria-label])');
    expect(js).toContain("t.me/");
  });

  test("el carrusel de capturas tiene rol de region accesible", () => {
    const ss = readFileSync(`${TEMA}/layouts/partials/sections/screenshots.html`, "utf8");
    const track = ss.match(/<section[^>]*screenshots-track[^>]*>/)?.[0] ?? "";
    expect(track).toContain('aria-roledescription="carousel"');
  });

  test("los puntos del carrusel se pueden tocar", () => {
    /*
      WCAG 2.5.8 (AA) pide 24 px de objetivo. Los puntos eran el `<button>` entero:
      `h-2.5 w-2.5`, o sea 10, con 8 de separación. Además eran lo único que
      No era un detalle: el botón era también lo único que permitía saltar de
      captura sin deslizar, porque el `pre` y el `next` están ocultos en móvil por
      `md:flex` — en un teléfono el carrusel se recorría entero a dedo para cambiar
      de foto.

      El botón pasa a `size-6` con el círculo visible dibujado adentro como un
      `span` de 10, así que la vista no cambia. Se comprueba que el `size-6` esté
      en el `<button>` y que el `span` de 10 esté adentro: si alguien achica el
      `<button>` para "optimizar", el `size-6` se va y esto lo dice.
    */
    const ss = readFileSync(`${TEMA}/layouts/partials/sections/screenshots.html`, "utf8");
    // La apertura del `<button>` y lo que va inmediatamente después: el `>` del
    // regex corta en la primera etiqueta, así que el `span` del punto —que es
    // hijo, no atributo— hay que buscarlo aparte.
    const apertura = ss.match(/<button[^>]*data-shots-dot[\s\S]*?>/)?.[0] ?? "";
    expect(apertura).toContain("size-6");
    const despues = ss.slice(ss.indexOf(apertura) + apertura.length);
    expect(despues.slice(0, 400)).toContain('<span class="size-2.5 rounded-full');
  });

  test("el movimiento del sitio tiene tres duraciones y ninguna más", () => {
    /*
      El sitio tenía cuatro tiempos distintos para gestos que son el mismo gesto.

      El caso más claro: `<body class="transition-all duration-400">` en
      `baseof.html`, `body * { transition-colors duration-300 }` en la hoja y
      `.btn` a 0.2 s. Al cambiar de modo oscuro el fondo cruzaba en 400 ms, un
      subtítulo en 300 y un botón en 200, y eso se veía como una onda que venía
      del fondo para adentro. Y `.card` estaba a 250 ms, que no estaba en ninguna
      parte de la escala.

      Los tres que quedan, y por qué son tres y no uno:

        · **200 ms** — reaccionar. Hover de un botón, de una tarjeta, de una fila
          de enlace, de una entrada del índice; y el fundido del modo oscuro, que
          es una reacción. Un número para "al pasar el mouse", y el mismo para
          todos: dos elementos que se elevan tienen que sentirse del mismo
          material.

        · **300 ms** — entrar y salir. Lo que aparece y lo que desaparece, que
          tiene que tener el tiempo de ser entendido. La barra de progreso y la
          persiana del menú.

        · **400 ms** — el recorrido del carrusel, que es la única animación que
          mueve algo un trecho y no un píxel. Va con el `transform` del
          desplazamiento y con el desenfoque de la foto que no está en el centro.

      Lo que se comprueba es que no aparezca un cuarto número. No porque tres sea
      un número mágico: cada número que se cuela vuelve a hacer que dos elementos
      que hacen lo mismo se sientan distintos, y eso es exactamente lo que la
      escala evita. Agregar uno es fácil —una línea— y por eso tiene que exigir que
      se escriba el por qué.

      El `0.01ms` de `prefers-reduced-motion` queda fuera a propósito: no es una
      duración del sistema, es la forma canónica de apagar la animación, y tiene
      que ganarle a todo lo demás, que es para lo que está el `!important`.

      Se leen las dos formas. `transition: color .2s` es el atajo y
      `transition-duration: 200ms` la forma larga, y la segunda estaba fuera de la
      comprobación: la regla del fundido del modo oscuro la escribe así, así que
      una duración colada por ahí no habría sonado.

      Y se comprueba además que ninguna utilidad de transición se quede sin
      duración, ni en la hoja ni en las plantillas. `transition-opacity` a secas
      usa el default de Tailwind, que es 150 ms —una cuarta duración de la escala
      que no aparecía escrita en ningún lado y sí en el navegador—. Tres la
      tenían: el ancla de cada título, el campo de búsqueda y el punto del
      carrusel. Y 150 ms es justo lo que hace que algo aparezca en vez de estar.
    */
    const css = sinComentarios(readFileSync(`${TEMA}/assets/css/styles.css`, "utf8"));

    // Todo se normaliza a milisegundos antes de comparar. La hoja escribe `0.2s`
    // y las plantillas `duration-200`, y son la misma duración; comparando las
    // dos formas literales el test fallaría siempre por la unidad y dejaría de
    // avisar de lo único que importa.
    const aMilisegundos = (d: string): number =>
      d.endsWith("ms") ? parseFloat(d) : parseFloat(d) * 1000;

    const duraciones = new Set<number>();
    const atajos = css.match(/(?:^|[;{]|\s)transition:\s*([^;}]+)/g) ?? [];
    const largas = css.match(/transition-duration:\s*([^;}]+)/g) ?? [];
    for (const decl of [...atajos, ...largas]) {
      for (const d of decl.match(/\b[0-9.]+m?s\b/g) ?? []) {
        if (d !== "0.01ms") duraciones.add(aMilisegundos(d));
      }
    }

    const enPlantillas = plantillas
      .map((ruta) => sinComentarios(readFileSync(ruta, "utf8")))
      .join("\n");
    for (const d of enPlantillas.match(/\bduration-\d+\b/g) ?? []) {
      duraciones.add(Number(d.slice("duration-".length)));
    }

    /*
      Una `transition-*` sin `duration-*` no declara duración: hereda la de
      Tailwind. Se listan las que lo hacen para que estén a la vista —cualquiera
      que se agregue tiene que declarar su tiempo— en vez de confiar en que nadie
      escribe `@apply transition-opacity` a secas.

      Se mira la hoja por `@apply` y las plantillas por atributo `class`, porque la
      misma falta se escribe de las dos formas.
    */
    const sinTiempoEnHoja = casos(estilos, (l) => {
      const apply = l.match(/@apply\s+([^;]+);/);
      if (!apply || !/\btransition-/.test(apply[1])) return false;
      return !/duration-/.test(apply[1]) && !/\[/.test(apply[1]);
    });
    const sinTiempoEnPlantilla = casos(plantillas, (l) => {
      const atributo = l.match(/class="([^"]*)"/);
      if (!atributo) return false;
      const clases = atributo[1].split(/\s+/);
      const transiciona = clases.some((c) => /^transition-(?!none$)/.test(c));
      return transiciona && !clases.some((c) => c.startsWith("duration-") || c.includes("["));
    });

    const escala = [200, 300, 400];
    const ordenadas = (a: number, b: number) => a - b;
    expect({
      duraciones: [...duraciones].sort(ordenadas),
      fueraDeEscala: [...duraciones].filter((d) => !escala.includes(d)).sort(ordenadas),
      sinTiempo: [...sinTiempoEnHoja, ...sinTiempoEnPlantilla],
    }).toEqual({ duraciones: escala, fueraDeEscala: [], sinTiempo: [] });
  });

  test("el punto activo del carrusel se anuncia como tal", () => {
    /*
      `role="tab"` exige `aria-selected`, y el script lo escribía como
      `dot.dataset.ariaSelected = …`. No es un error de sintaxis sino de
      objetivo: `dataset` produce `data-aria-selected`, un atributo sin ningún
      significado para un lector de pantalla. El estado del carrusel no se
      anunciaba.

      También importa que el color esté en el `span` de adentro y no en el
      botón: el botón mide 24 px y el círculo 10, así que el `classList.toggle`
      del `paint()` tiene que apuntarle al hijo. Si volviera al botón, el punto
      activo se vería como un cuadrado de 24.
    */
    const ss = readFileSync(`${TEMA}/layouts/partials/sections/screenshots.html`, "utf8");
    expect(ss).toContain("aria-selected=");
    expect(ss).toContain("dot.firstElementChild");
    // Sólo el código, no el comentario que explica el cambio: la palabra aparece
    // ahí a propósito, y buscarla en todo el archivo la haría sonar siempre.
    const codigo = ss.replace(/\{\{-[\s\S]*?-\}\}|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, "");
    expect(codigo).not.toContain("dataset.ariaSelected");
  });

  test("el efecto de profundidad del carrusel no baja el texto de opacidad", () => {
    /*
      El `opacity: 0.5` de la tarjeta se aplicaba al `<figure>` completo, así que
      arrastraba al `<figcaption>`: el nombre de la captura quedaba al 50 %, que
      sobre el fondo de la página mide 3.8:1 contra los 10.8:1 de entero — y el 4.5
      que pide WCAG 1.4.3 para 14 px. `axe` lo marcó como `color-contrast` en la
      portada y su versión inglesa.

      La profundidad la tiene que contar la fotografía, que es una imagen y no
      tiene contraste que perder; el rótulo es texto. Se comprueba que el `filter`
      y el `opacity` estén sobre `[data-shot]` —el marco de la imagen— y no sobre
      `.snap-center`.
    */
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");
    const bloque = css.match(/\.screenshots-track\[data-carousel\][\s\S]*?\n\}/g) ?? [];
    const conOpacidad = bloque.filter((r) => /opacity:\s*0\.5/.test(r));
    for (const regla of conOpacidad) {
      expect(regla).toContain("[data-shot]");
    }
    // La profundidad por escala se queda en la tarjeta: un `transform` no altera
    // el color, así que no tiene contraste que perder.
    const escala = bloque.find((r) => /transform:\s*scale\(0\.92\)/.test(r)) ?? "";
    expect(escala).toContain(".snap-center");
  });

  test("los encabezados de tabla tienen texto", () => {
    /*
      `/docs/user/security` y su versión inglesa tenían la fila de encabezado
      vacía —`| | |` en el markdown— porque la tabla se escribió como una lista
      de plazos y nadie le puso título a las columnas. `axe` lo marcó como
      `empty-table-header`: un `<th>` sin texto no le dice nada a quien navega
      con lector de pantalla, y la primera fila de datos se lee como si fuera otra
      cosa.

      No alcanza con mirar el markdown renderizado, que es donde el hueco ya no
      se ve: se lee el fuente, que es lo que se edita.
    */
    const docs = archivos("content/docs", ".md").filter((r) => !r.includes("/en."));
    for (const ruta of docs.concat(docs.map((r) => r.replace(/\.md$/, ".en.md")))) {
      if (!existsSync(ruta)) continue;
      const html = readFileSync(ruta, "utf8");
      const cabeceras = html.match(/^\|[\s|:-]*\|$/gm) ?? [];
      for (const linea of cabeceras) {
        // Una fila de encabezado es la que sólo tiene guiones y espacios entre
        // barras. Si además tiene texto, es una fila de datos y no importa.
        expect(linea).toMatch(/\|[-\s:|]*\|/);
      }
      const filasVacias = html.match(/^\|\s*\|\s*\|/gm) ?? [];
      if (html.includes("|---|") && filasVacias.length > 0) {
        throw new Error(`${ruta}: hay una fila de tabla sin texto (${filasVacias[0]})`);
      }
    }
  });

  test("la gramática de componentes se usa, no se reescribe a mano", () => {
    /*
      La razón de que la capa exista: estos patrones estaban escritos a mano en
      cada plantilla, con tres variantes distintas de la misma intención cada uno,
      y todos se leían distinto entre sí. `.btn` con sus tres tamaños y sus
      cuatro tonos, `.card` para toda caja, `.panel` para la superficie anidada,
      `.link-row` para los enlaces que no tienen caja, `.pager-link` para el
      paginador, `.rule` para un separador, `.empty-mark` para el ícono de un
      estado vacío, `.icon-tile` para el emblema de 70 px, `.badge` para la
      pastilla de estado.

      Dos cosas se comprueban, y las dos importan:

      1. Que la pieza exista **y se use**. Una clase del sistema que nadie usa es
         código muerto que además da la impresión de que el sitio la respeta.

      2. Que exista **de verdad**. Tailwind v4 descarta en silencio lo que no
         reconoce, así que un `.btn` mal escrito deja al elemento sin nada y no
         hay ningún aviso: sólo se ve mirando el CSS emitido.

      `.btn-secondary` y `.btn-danger` no aparecen en ningún atributo `class` de
      las plantillas, y no es que estén sin usar: `ui/action-button.html` elige
      la clase desde un mapa de tonos con `printf`, así que el nombre se compone
      en el momento de renderizar. Por eso las dos comprobaciones miran
      lugares distintos —el CSS para la primera, todo el texto ya sin comentarios
      para la segunda— y por eso la segunda no filtra por `class=`.
    */
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");
    const capa = [
      "btn", "btn-sm", "btn-md", "btn-lg", "btn-icon",
      "btn-primary", "btn-secondary", "btn-neutral", "btn-danger",
      "card", "card-surface", "card-hover", "panel",
      "link-row", "pager-link", "rule",
      "empty-mark", "icon-tile", "sheen", "badge",
      "section-title", "section-lead",
    ];
    for (const clase of capa) {
      expect(css).toMatch(new RegExp(`\\.${clase}(?![-\\w])`));
    }
    // Se lee la plantilla entera sin comentarios, y no sólo lo que hay dentro de
    // un `class="…"`: los tonos del partial se escriben como cadenas sueltas.
    const todas = sinComentarios(
      plantillas.map((ruta) => readFileSync(ruta, "utf8")).join("\n"),
    );
    const huerfanas = capa.filter(
      (clase) => !new RegExp(`(^|[\\s"'])${clase}([\\s"'/]|$)`).test(todas),
    );
    expect(huerfanas).toEqual([]);
  });

  test("el icono de la tarjeta se imprime en el elemento", () => {
    /*
      `ui/card` sólo abría el `<i>` si venía `icon` —el símbolo de la
      librería— pero la clase nunca llegaba al `printf`: los grupos de la
      portada y de /state/ publicaban `<i class="text-2xl text-brand-text"></i>`,
      un elemento vacío que no dibuja nada, y nadie lo veía porque un ícono
      ausente no se lee como error. La comprobación es sobre el `printf`: dos
      `%s` de clase y `$icon` el primero.
    */
    const card = readFileSync(`${TEMA}/layouts/partials/ui/card.html`, "utf8");
    const inicio = card.indexOf("if $icon");
    expect(inicio).toBeGreaterThan(-1);
    const bloque = card.slice(inicio, card.indexOf("{{- end -}}", inicio));
    expect(bloque).toMatch(/class=\\"%s %s shrink-0\\"/);
    expect(bloque).toMatch(/\$icon \$iconClass \$texto/);
  });

  test("los bordes de control no usan el color de marca", () => {
    /*
      `border-primary` mide 2.64:1 contra `--color-ui-bg` en modo claro, y WCAG
      1.4.11 pide 3:1 para el borde que identifica un control. En oscuro daba
      7.93:1 y pasaba, así que el fallo sólo se veía en claro — y por eso hace
      falta la prueba y no la vista.

      `--color-ui-border-strong` da 7.06:1 en claro y 11.34:1 en oscuro, y es el
      token que existe justo para esto: los bordes de botón, campo, insignia y
      número de página ya lo usan. Quedaban seis cajas con el de marca, entre ellas
      todas las tarjetas de /downloads/ y /donate/.
    */
    // Mismo criterio de la prueba anterior: dentro de un atributo `class` y
    // como nombre completo. Un `border-primary` citado en un comentario no
    // es un borde, y el comentario de esta prueba lo cita.
    const malos = plantillas.filter((ruta) =>
      clasesUsadas(sinComentarios(readFileSync(ruta, "utf8"))).has("border-primary"),
    );
    expect(malos).toEqual([]);
  });

  test("las flechas del paginador usan el vocabulario de botones", () => {
    /*
      El paginador eran dos flechas de 48 px con `bg-primary hover:bg-secondary`:
      el hover componía el violeta al 90 % contra lo que hubiera detrás, y eso
      cambia entre la página y el listado, así que el mismo botón se oscurecía
      distinto según dónde estuviera. `.btn-primary:hover` usa `color-mix` contra
      negro y da el mismo tono en todas partes.

      Y ahora hay números, con `.pager-link`: sin ellos no se decía en qué
      página se estaba ni cuántas había.

      Se lee la plantilla sin comentarios: el nombre de la clase vieja está en el
      de arriba, a propósito, y en el archivo entero lo haría sonar siempre.
    */
    const codigo = sinComentarios(
      readFileSync(`${TEMA}/layouts/partials/pagination.html`, "utf8"),
    );
    expect(codigo).not.toMatch(/hover:bg-secondary/);
    expect(codigo).toContain("pager-link");
    expect(codigo).toContain('aria-current="page"');
    expect(codigo).toContain("btn btn-icon btn-md btn-primary sheen");
  });

  test("cada celda de una lista de definiciones empieza por su término", () => {
    /*
      `/about/` dibujo seis hechos como `<dl>` y, dentro de cada celda, puso el
      ícono como hermano **antes** del `<dt>`:

          <div><span class="empty-mark">…</span><dt>…</dt><dd>…</dd></div>

      HTML permite ese `<div>` agrupando términos, pero tiene que empezar por un
      `dt`: el contenido de un `div` dentro de un `dl` es la definición completa,
      y un `span` antes del `dt` lo convierte en algo que no es ni término ni
      definición. `axe` lo marca como `definition-list`, impacto serio.

      Se ve en pantalla exactamente igual, y por eso lo encontró la auditoría y
      no la vista. El ícono ahora va adentro del `dt`, que es lo que además dice
      que decora el término y no la fila.

      Se comprueba sobre el HTML que Hugo genera, no sobre la plantilla: la
      regla es del HTML final, y en la plantilla hay `{{ range }}` de por medio.
    */
    const rutas = [
      "public/about/index.html",
      "public/en/about/index.html",
      "public/downloads/index.html",
      "public/en/downloads/index.html",
    ].filter((ruta) => existsSync(ruta));

    let revisados = 0;
    for (const ruta of rutas) {
      const html = readFileSync(ruta, "utf8");
      for (const dl of html.match(/<dl\b[\s\S]*?<\/dl>/g) ?? []) {
        for (const celda of dl.match(/<div\b[\s\S]*?<\/div>/g) ?? []) {
          revisados++;
          // El primer `<div>` es la celda misma, así que su interior empieza
          // después del cierre de la etiqueta de apertura.
          const interior = celda.replace(/^<div\b[^>]*>/, "");

          // El primer elemento de la celda tiene que ser el `dt`. Se comparan los
          // nombres de las etiquetas de apertura, no las de cierre: `matchAll`
          // sobre `<\/?(dt|dd)>` devolvería `dt, dt, dd, dd` —una por cada
          // apertura y otra por cada cierre— y no diría nada.
          const nombres = [...interior.matchAll(/<([a-z]+)\b(?![^>]*\/>)/g)].map(
            (m) => m[1],
          );
          expect({ ruta, primero: nombres[0] }).toEqual({ ruta, primero: "dt" });

          // Y tiene que haber exactamente un `dt` y un `dd`: la celda es una
          // definición, no un grupo de varias.
          const cuenta = (t: string) => nombres.filter((n) => n === t).length;
          expect({ ruta, dt: cuenta("dt"), dd: cuenta("dd") }).toEqual({
            ruta,
            dt: 1,
            dd: 1,
          });
        }
      }
    }
    expect(revisados).toBeGreaterThan(0);
  });

  test("el índice de cada artículo se estila con el marcado que Hugo emite", () => {
    /*
      El índice lateral no tiene clase: lo genera Hugo dentro de
      `<nav id="TableOfContents">` y su plantilla es fija, así que el estilo tiene
      que salir de `styles.css` contra ese ID.

      Lo que se comprueba es que la regla apunte a la lista que Hugo escribe de
      verdad. Y esa lista es un **`<ol>`**, aunque no haya nada que ordenar — se
      comprobó en `/docs/user/security/`. Una regla escrita contra `ul` no falla
      de ninguna forma visible: el CSS se emite, el test de que la clase existe
      pasa, y el índice sigue saliendo con la numeración del navegador pegada,
      porque `list-style` nunca se aplicó a la lista que está ahí.

      Por eso la comprobación no es «existe una regla que mencione
      `#TableOfContents`» sino «la regla que quita la numeración alcanza a `ol`».
      */
    const css = readFileSync(`${TEMA}/assets/css/styles.css`, "utf8");

    // La numeración del navegador sale, y sale sobre la lista que Hugo emite.
    const sinNumeros = css.match(
      /:where\(#TableOfContents\)[^{]*\{[^}]*list-style:\s*none/,
    );
    expect(sinNumeros).not.toBeNull();
    expect(sinNumeros![0]).toMatch(/:is\(ol,\s*ul\)|(^|[^-\w])ol\b/);

    // Y el enlace es el elemento que lleva el gesto del hover, no el `<li>`.
    expect(css).toMatch(/:where\(#TableOfContents\)[^{]*\ba\b[^{]*\{[^}]*display:\s*block/);

    // El `<nav>` no lleva clase en ninguna plantilla, y por eso el ID es lo
    // único contra lo que se puede|stylear: si algún día el partial empieza a
    // poner `class`, estas reglas dejan de aplicar y hay que saberlo.
    const navConId = plantillas.filter((ruta) =>
      readFileSync(ruta, "utf8").includes("TableOfContents"),
    );
    expect(navConId.length).toBeGreaterThan(0);
  });

  test("nada marca un icono como oculto con el atributo vacío", () => {
    /*
      `aria-hidden` sin valor no es «oculto»: en HTML un atributo sin valor es
      una cadena vacía, y la cadena vacía no es un valor de ARIA. El parser la
      trata como si el atributo no estuviera, y lo que el lector de pantalla
      hace con `<i class="…"></i>` es leerlo como texto vacío en algunos casos o
      ignorarlo en otros. `axe` lo marcó como `aria-valid-attr-value` en 12
      páginas: los iconos de los botones, el emblema de las ventajas y el de los
      planes.

      Además las comillas tienen que ir escapadas cuando el atributo está dentro
      de un `printf` de Go, y sin `\"` el build entero falla al parsear la
      plantilla — eso también lo atrapa esta prueba, porque lee el fuente.
    */
    /*
      Sólo dentro de una etiqueta: en la prosa de los comentarios `aria-hidden`
      aparece souvent como nombre de atributo, y eso no es un atributo sin valor.
      Se exige, entonces, que la palabra esté pegada a algo que la convierta en
      atributo —comillas, barra o cierre de la etiqueta— y que no tenga `=` o
      `value` adelante, que es la forma en que sí lleva valor.
    */
    const etiqueta = /aria-hidden(?![-\w=])[\s/>]/;
    const malos = casos(plantillas, (l) => etiqueta.test(l) && !l.includes("`aria-hidden`"));
    expect(malos).toEqual([]);
  });

  test("cada plantilla de página abre al menos un <main>", () => {
    /*
      `<main>` no está en `baseof.html` a propósito —meterlo ahí anidaría un
      landmark dentro de otro— así que cada plantilla tiene que abrir el suyo.
      `/about/` se había quedado sin él y todo su contenido quedaba fuera de
      todo landmark.

      Se excluyen los parciales y los shortcodes porque no son páginas: se
      emiten dentro de otra plantilla que ya abrió el `<main>`.
    */
    const noSonPaginas = ["/partials/", "/_markup/", "/shortcodes/"];
    const sinMain = plantillas
      .filter((ruta) => !noSonPaginas.some((x) => ruta.includes(x)))
      .filter((ruta) => !ruta.endsWith("_default/card.html"))
      .filter((ruta) => !readFileSync(ruta, "utf8").includes("<main"))
      .map((ruta) => ruta.replace(`${TEMA}/layouts/`, ""));
    expect(sinMain).toEqual([]);
  });

  test("ningún <section> de página queda fuera del <main>", () => {
    /*
      El banner de página se emitía antes de que abriera el `<main>`, así que el
      título de cada página quedaba fuera de todo landmark. Va dentro.

      No basta con que el `<main>` aparezca antes en el texto: también podría
      abrirlo y cerrarlo para dejar el hero atrás. Por eso se comprueba que no
      haya un `</main>` entre la apertura y el parcial.
    */
    const indice = readFileSync(`${TEMA}/layouts/index.html`, "utf8");
    const main = indice.indexOf("<main");
    const hero = indice.indexOf('partial "sections/hero.html"');
    expect(main).toBeGreaterThan(-1);
    expect(hero).toBeGreaterThan(main);
    expect(indice.slice(main, hero)).not.toContain("</main>");
  });
});

/*
  Las imágenes del sitio y su texto alternativo.

  `alt=""` es la respuesta correcta cuando la imagen no agrega nada a lo que el
  texto de al lado ya dice —el logo junto al nombre, la portada de una nota junto
  a su título— y es la respuesta equivocada cuando la imagen *es* el contenido.
  Las dos se escriben exactamente igual, así que la lista de las decorativas es
  explícita y cada entrada tiene que estar justificada dentro de su propia
  plantilla: para sumar una imagen decorativa hay que escribir el motivo acá y
  que ese motivo aparezca en el archivo, con lo que no se agrega una excepción sin
  decir por qué.

  Los motivos no son adorno del test: son los que permiten leer la lista.
  `sr-only` en el header es el nombre accesible del enlace del logo. `-z-10` en
  el hero y en el banner de página es lo que pone la imagen detrás del panel, que
  ya dice el título. `<h2` en la tarjeta y `text-white` en las últimas notas son el
  titular de la nota, que es justamente la imagen de la que hablan.
*/
const DECORATIVAS: Record<string, { veces: number; motivo: string }> = {
  "partials/header.html": { veces: 2, motivo: "sr-only" },
  "partials/sections/hero.html": { veces: 1, motivo: "-z-10" },
  "partials/sections/page-banner.html": { veces: 1, motivo: "-z-10" },
  "_default/card.html": { veces: 1, motivo: "<h2" },
  "partials/widgets/recentposts.html": { veces: 1, motivo: "text-white" },
};

describe("cada imagen dice qué es, o está junto a lo que ya lo dice", () => {
  /** Todas las `<img>` de una plantilla, con los atributos sin partir en renglones. */
  function imagenes(ruta: string): string[] {
    const texto = sinComentarios(readFileSync(ruta, "utf8"));
    return [...texto.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  }

  test("ninguna <img> se queda sin alt", () => {
    /*
      El atributo es obligatorio aunque sea vacío: `alt=""` marca la imagen como
      decorativa a propósito, y sin el atributo el lector de pantalla inventa el
      nombre a partir del nombre del archivo. Se lee la plantilla entera y no
      renglón por renglón porque los atributos están partidos en varias líneas.
    */
    const sinAlt = plantillas.flatMap((ruta) =>
      imagenes(ruta)
        .filter((img) => !/\salt\s*=/.test(img))
        .map((img) => `${ruta.replace(`${TEMA}/layouts/`, "")}  ${img.slice(0, 80)}`)
    );
    expect(sinAlt).toEqual([]);
  });

  test("ninguna imagen se describe con una sola palabra", () => {
    /*
      `img.defaultAlt = "Imagen"` caía por omisión en el shortcode `img` cuando el
      autor no escribía el `alt`, y «Imagen» no describe nada: es una palabra que no
      le sirve a nadie y que además tapa el aviso de que faltaba algo.

      No se prohíbe la palabra `defaultAlt` en general, porque la del carrusel sí
      describe —dice qué es— y ahora además dice cuál de cuántas. Lo que se
      prohíbe es la descripción que no dice nada: la palabra suelta.

      Se lee el archivo entero sin comentarios, y no renglón por renglón, porque la
      plantilla que quita la clave necesita nombrarla para explicar la quita.
    */
    const archivos = [
      ...plantillas.map((ruta) => [ruta, sinComentarios(readFileSync(ruta, "utf8"))] as const),
      ["i18n/es.toml", readFileSync("i18n/es.toml", "utf8")] as const,
      ["i18n/en.toml", readFileSync("i18n/en.toml", "utf8")] as const,
    ];
    const genericas = archivos
      .filter(([, texto]) => /alt\s*=\s*"(Imagen|Image|Picture|Photo|Foto)"/.test(texto))
      .map(([ruta]) => ruta.replace(`${TEMA}/layouts/`, ""));
    expect(genericas).toEqual([]);
  });

  test("toda imagen sin descripción está junto a su texto, y sólo en el lugar debido", () => {
    const encontradas: Record<string, number> = {};
    for (const ruta of plantillas) {
      const veces = imagenes(ruta).filter((img) => /\salt\s*=\s*""/.test(img)).length;
      if (veces) encontradas[ruta.replace(`${TEMA}/layouts/`, "")] = veces;
    }
    // Sólo las cantidades se comparan aquí; los motivos se comprueban abajo.
    const esperadas = Object.fromEntries(
      Object.entries(DECORATIVAS).map(([ruta, { veces }]) => [ruta, veces])
    );
    expect(encontradas).toEqual(esperadas);

    // Y el motivo de cada excepción tiene que estar escrito en su plantilla.
    const sinMotivo = Object.entries(DECORATIVAS)
      .filter(
        ([ruta, { motivo }]) =>
          !sinComentarios(readFileSync(`${TEMA}/layouts/${ruta}`, "utf8")).includes(motivo)
      )
      .map(([ruta]) => ruta);
    expect(sinMotivo).toEqual([]);
  });
});

/*
  La tipografía.

  Las tres fuentes eran palabras clave —`sans-serif`, `monospace`— que no son
  fuentes sino «la que el sistema elija»: en Windows `sans-serif` es Arial y en
  Linux es DejaVu Sans, así que el mismo sitio se leía distinto en cada sistema
  operativo. Y el espaciado entre letras no estaba en ninguna parte, salvo un
  `tracking-tight` escrito a mano en `.section-title` que la mitad de las veces
  perdía contra la utilidad `text-*` del mismo elemento.

  Las dos cosas se arreglan desde la hoja y no desde las plantillas: las fuentes
  son tres pilas, y el tracking se publica como `--text-*--letter-spacing`, que es
  la forma en que Tailwind empareja el espaciado con el cuerpo. Por eso la
  comprobación es sobre `styles.css` y no sobre las plantillas: lo que hay que
  vigilar es que la escala siga siendo la única fuente de verdad.
*/

describe("las fuentes son pilas y el tracking sale de una escala", () => {
  const css = sinComentariosCSS(readFileSync(`${TEMA}/assets/css/styles.css`, "utf8"));

  test("ninguna fuente es una palabra clave genérica", () => {
    /*
      `sans-serif` y `monospace` no eligen una cara: la dejan a cargo del sistema
      operativo, y los resultados van de Arial a DejaVu Sans. Las tres tienen que
      ser pilas que empiezan con `system-ui` primero, que es la cara que el sistema
      diseñó para interfaz.

      Se comprueba sobre el texto sin comentarios porque el párrafo que explica el
      cambio tiene que nombrar las palabras clave para poder explicar que ya no
      están.
    */
    const genericas = casos(
      [`${TEMA}/assets/css/styles.css`],
      (l) => /--vsk-font-[a-z]+:\s*(sans-serif|monospace|serif|system-ui)\s*;/.test(l)
    );
    expect(genericas).toEqual([]);

    for (const fuente of ["apps", "title", "terminal"]) {
      expect(css).toMatch(new RegExp(`--vsk-font-${fuente}:`));
    }
    // La de interfaz tiene que preferir `system-ui`; la de terminal, `ui-monospace`.
    const apps = css.match(/--vsk-font-apps:\s*([^;]+);/)?.[1] ?? "";
    const terminal = css.match(/--vsk-font-terminal:\s*([^;]+);/)?.[1] ?? "";
    expect(apps).toContain("system-ui");
    expect(terminal).toContain("ui-monospace");
    // Y las dos terminan en la palabra clave, como red de seguridad y no como elección.
    expect(apps.trimEnd()).toMatch(/sans-serif$/);
    expect(terminal.trimEnd()).toMatch(/monospace$/);
  });

  test("cada paso de la escala declara su espaciado", () => {
    /*
      El espaciado entre letras acompaña al cuerpo, no es un número suelto: a 12 px
      hace falta aire entre dos letras y a 48 px el mismo aire se ve y abre la
      línea como un cartel. Publicarlo como `--text-*--letter-spacing` es lo que
      hace que la utilidad `text-3xl` salga con las tres propiedades juntas, y por
      eso las cuarenta apariciones de `text-3xl` en las plantillas mejoran sin
      tocar ninguna.

      La lista se comprueba completa —los nueve pasos, del `xs` al `5xl`— porque
      un paso que se olvide queda con el tracking de Tailwind, que es cero, y es
      un fallo que no se ve en la fuente sino en el navegador.
    */
    const pasos = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
    const faltan = pasos.filter((p) => !new RegExp(`--text-${p}--letter-spacing:\\s*[^;]+;`).test(css));
    expect(faltan).toEqual([]);

    // Y la curva tiene que cambiar de signo: positiva en los chicos, negativa en
    // los grandes. Una escala toda positiva —o toda negativa— no acompaña al
    // tamaño, y para eso no hace falta una lista.
    const valor = (p: string) =>
      css.match(new RegExp(`--text-${p}--letter-spacing:\\s*(-?[\\d.]+)(?:em)?\\b`))?.[1];
    expect(Number(valor("xs"))).toBeGreaterThan(0);
    expect(Number(valor("sm"))).toBeGreaterThan(0);
    expect(Number(valor("base"))).toBe(0);
    expect(Number(valor("xl"))).toBeLessThan(0);
    expect(Number(valor("5xl"))).toBeLessThan(0);
  });

  test("el espaciado no se escribe a mano en ninguna clase de título", () => {
    /*
      El `letter-spacing: -0.025em` de `.section-title` estaba muerto en casi todos
      los elementos que lo llevaban: casi todos los títulos traen su propia utilidad
      `text-3xl` o `text-4xl`, y como las utilidades van después de esta capa,
      ganaba la de ellos. Dos fuentes de verdad para el mismo número es la forma
      más segura de que una de las dos se quede vieja.

      Se comprueba sobre las clases de título conocidas y no sobre la hoja entera
      porque hay `letter-spacing` legítimos en otros lados —el interlineado del
      código, por ejemplo— y lo que se vigila es que el título no tenga el suyo.
    */
    const deTitulo = [".section-title", ".section-lead", ".page-title"];
    for (const selector of deTitulo) {
      const i = css.indexOf(selector + " {");
      expect(i).toBeGreaterThan(-1);
      const bloque = css.slice(i, css.indexOf("}", i));
      expect(bloque).not.toContain("letter-spacing");
    }
  });

  test("los encabezados del artículo toman el espaciado de la escala", () => {
    /*
      Los tres tenían su tracking escrito a mano —-0.025, -0.02 y -0.015 em— y los
      tres ya coincidían con un paso: `3xl`, `2xl` y `xl`. La página no cambió de
      aspecto al enchufarlos; lo que cambió es que ahora dicen a qué paso se
      parecen. Mover un paso de la curva mueve los tres encabezados del artículo
      junto con los cuarenta títulos de las plantillas, en vez de dejar tres
      números que alguien tiene que acordarse de tocar a mano.

      La forma de referenciarlos importa: `letter-spacing: var(...)`. Un
      `letter-spacing: -0.025em` volvería a ser una segunda fuente de verdad, y
      por eso se comprueba que sea una referencia y no un número.
    */
    for (const [nivel, paso] of [["h2", "3xl"], ["h3", "2xl"], ["h4", "xl"]]) {
      const i = css.indexOf(`#article ${nivel} {`);
      expect(i).toBeGreaterThan(-1);
      const bloque = css.slice(i, css.indexOf("}", i));
      expect(bloque).toContain(`letter-spacing: var(--text-${paso}--letter-spacing)`);
      expect(bloque).not.toMatch(/letter-spacing:\s*-?[\d.]/);
    }
  });
});

describe("los títulos del sitio tienen una escala, no una elección por plantilla", () => {
  const css = sinComentariosCSS(readFileSync(`${TEMA}/assets/css/styles.css`, "utf8"));

  test("todo <h1> de las plantillas usa la escala de títulos de página", () => {
    /*
      Había tres tamaños para lo mismo: 30 px en `/docs/`, 36 px en `/state/` y en
      `/downloads/`, y 32 px en `/faq/` y en los artículos —donde el `<h1>` no
      declaraba ninguna utilidad de tamaño y lo que lo sostenía era
      `#article h1 { font-size: 2rem }`, o sea el tamaño del encabezado de artículo
      aplicándose al título de página por accidente—.

      Cada plantilla elige sus clases de color, de alineación y de aire, pero el
      tamaño no es suyo. La comprobación es sobre el texto de los atributos
      `class` ya partido por espacios, con `{{ }}` de Hugo adentro, y por eso usa
      la plantilla entera y no renglón por renglón.
    */
    const sinEscala = plantillas.flatMap((ruta) => {
      const texto = sinComentarios(readFileSync(ruta, "utf8"));
      return [...texto.matchAll(/<h1\b[^>]*>/g)]
        .filter((h1) => !/\bpage-title\b/.test(h1[0]))
        .map((h1) => `${ruta.replace(`${TEMA}/layouts/`, "")}  ${h1[0].slice(0, 80)}`);
    });
    expect(sinEscala).toEqual([]);
  });

  test("#article h1 no vuelve a decidir el tamaño del título", () => {
    /*
      `render-heading.html` degrada el `#` del markdown a `<h2>`, de modo que un
      `<h1>` dentro de `#article` es siempre y sólo el título de página. Por eso su
      tamaño lo dice `.page-title`, y `#article h1` se queda con la caja —el aire
      que separa el título del cuerpo— y nada más.

      Si `#article h1` vuelve a declarar un `font-size`, además le gana a
      `.page-title` por especificidad —1-0-1 contra 0-1-0, los dos en la capa de
      componentes— y los cuatro títulos de página vuelven a quedar en 32 px sin
      que ninguna plantilla haya cambiado.
    */
    const i = css.indexOf("#article h1 {");
    expect(i).toBeGreaterThan(-1);
    const bloque = css.slice(i, css.indexOf("}", i));
    expect(bloque).not.toContain("font-size");
    expect(bloque).not.toContain("line-height");
    expect(bloque).not.toContain("letter-spacing");
    // La caja sí: sin el margen el título queda pegado al primer párrafo.
    expect(bloque).toContain("margin-bottom");
  });

  test("los encabezados del artículo llevan un solo color", () => {
    /*
      Eran tres colores para cuatro niveles: el `h1` en el color del texto, el `h2`
      en `--brand-text` y el `h3` en `--secondary`. Dos jerarquías contradictorias
      en la misma columna — por tamaño el `h3` era un escalón más abajo que el
      `h2`, por color era un salto de tono entero.

      Y `--secondary` además no daba la talla para el peso que tiene: `#8839ef` da
      3.51:1 sobre la superficie, y un `h3` de 24 px en negrita necesita 3:1, así
      que pasaba por menos de medio punto. `--brand-text` da 5.03:1.

      El `h1` sí queda en el color del texto: es el título de la página, el único
      que no hace falta marcar porque ya está solo arriba de todo.
    */
    const bloque = (nivel: string) => {
      const i = css.indexOf(`#article ${nivel} {`);
      expect(i).toBeGreaterThan(-1);
      return css.slice(i, css.indexOf("}", i));
    };
    for (const nivel of ["h2", "h3", "h4"]) {
      expect(bloque(nivel)).toContain("text-brand-text");
      /*
        Y que ninguno se escape por su cuenta al `--secondary`, lo escriban como
        `@apply text-secondary` o como `color: var(--secondary)`: las dos formas
        lesionan el contraste y sólo la segunda no la delata un `grep`.
      */
      expect(bloque(nivel)).not.toMatch(/secondary/);
    }
    expect(bloque("h1")).not.toMatch(/brand-text|secondary/);
  });

  test("los encabezados del artículo no se sangran para marcar su nivel", () => {
    /*
      El `h3` venía con `ms-2` y el `h4` con `ms-4`. Un encabezado que se sangra
      para indicar su nivel es una convención de imprenta, no de diseño de
      interfaces: en pantalla lo que separa los niveles es el aire y el cuerpo, y
      la sangra hacía que dos subtítulos de distinto nivel no alinearan entre sí
      dentro del mismo artículo.

      La comprobación lee los cuatro bloques enteros. Por renglón no serviría: la
      sangra estaba en su propia línea, debajo de la que abre el bloque, y una
      prueba línea a línea la deja pasar sin enterarse.
    */
    for (const nivel of ["h2", "h3", "h4"]) {
      const i = css.indexOf(`#article ${nivel} {`);
      expect(i).toBeGreaterThan(-1);
      const bloque = css.slice(i, css.indexOf("}", i));
      // `my-*` sí puede: es aire vertical, que es justo lo que separa los niveles.
      expect(bloque).not.toMatch(/\b(ms|ml|ps|pl)-\d/);
    }
  });
});

/*
  La ventana de arriba y la de abajo.

  El pie era otro objeto que el header: estaba a 24 px de los bordes con radio de
  14 px cuando la barra estaba a 8 px con radio de 24, y con `max-w-6xl` le
  cortaba el ancho —942 px contra los 974 de la barra en la misma ventana—. Los
  dos son la misma cosa: una caja flotando sobre la página, una arriba y una
  abajo. Si se ven distintos es porque alguien midió una y no la otra.

  Y los botones de icono eran óvalos: `.btn-icon` anulaba el relleno y dejaba que
  el contenido diera el ancho —20 px, el ancho del `<em>`— mientras el alto lo
  daba el tamaño del botón, 40 px. Con `border-radius: 9999px` eso es un óvalo de
  20 × 40, no un círculo.
*/
describe("el pie lleva la misma ventana que la barra", () => {
  const barra = sinComentarios(readFileSync(`${TEMA}/layouts/partials/header.html`, "utf8"));
  const pie = sinComentarios(readFileSync(`${TEMA}/layouts/partials/footer.html`, "utf8"));

  test("los dos flotan a la misma distancia de la pantalla y con la misma esquina", () => {
    /*
      Dos medidas y sólo dos. La primera es el paso de margen: `m-2` en la barra y
      `mx-2` en el envoltorio del pie, que son los dos 8 px. La segunda es la
      utilidad de radio, `rounded-xl` en los dos, que son 24 px.

      Se comparan entre sí y no contra un valor escrito en la prueba. Si mañana
      la escala de radios mueve `xl` a 20 px, los dos siguen iguales y la prueba
      no molesta. Lo que no puede pasar es que uno de los dos se mueva solo.

      Y el panel del pie no puede llevar `max-w-*`: la barra no lo lleva, y con
      un tope de ancho el pie queda más angosto que la barra en cualquier ventana
      mayor que 1152 px, que es justamente donde se nota.
    */
    const claseBarra = barra.match(/<header[^>]*\sclass="([^"]*)"/)?.[1] ?? "";
    const pasoBarra = claseBarra.match(/\bm-(\d+)\b/)?.[1];
    const radioBarra = claseBarra.match(/\brounded-[\w-]+\b/)?.[0];
    expect(pasoBarra).toBeDefined();
    expect(radioBarra).toBeDefined();

    // El envoltorio del pie: el primer `<div>` del partial, el que contiene al panel.
    const pasoPie = pie.match(/<div class="mx-(\d+)\s/)?.[1];
    const clasePanel = pie.match(/<div class="panel[^"]*"/)?.[0] ?? "";
    const radioPie = clasePanel.match(/\brounded-[\w-]+\b/)?.[0];

    expect(pasoPie).toBe(pasoBarra);
    expect(radioPie).toBe(radioBarra);
    expect(clasePanel).not.toMatch(/\bmax-w-/);

    // Y los dos pasos son el 2 de la escala —8 px—, no cualquier cosa que coincida.
    expect(pasoBarra).toBe("2");
    expect(radioBarra).toBe("rounded-xl");
  });

  test("ningún botón de icono declara un lado que rompa el cuadrado", () => {
    /*
      `.btn-icon` tiene `aspect-ratio: 1`, que le da el ancho al botón desde su
      alto. Eso basta mientras nada lo contradiga: una utilidad `w-12` encima
      fija el ancho y la relación no tiene nada que decidir, así que la caja
      queda 48 × 40 con el radio de 9999 px del medio dibujando un óvalo otra vez.

      Un `h-*` suelto rompe el cuadrado por el otro lado, y además contradice a la
      clase de tamaño —`.btn-md` ya puso el alto—, que es otro defecto con el mismo
      origen: dos lugares diciendo la altura.

      Por eso la regla es que si un lado numérico aparece, los dos tienen que
      aparecer y tener el mismo número. `size-10`, el de las flechas del carrusel,
      no es un lado suelto: lo declara el par entero y cuadrado. `w-full` no entra
      porque no es un número —un botón de icono a ancho completo no tiene forma de
      ser cuadrado y no hay ninguno en el sitio—.
    */
    const con_lado = plantillas.flatMap((ruta) =>
      [...sinComentarios(readFileSync(ruta, "utf8")).matchAll(/<[^>]*\bbtn-icon\b[^>]*>/g)]
        .map((m) => m[0])
        .filter((etiqueta) => {
          const w = etiqueta.match(/\bw-(\d+)\b/)?.[1];
          const h = etiqueta.match(/\bh-(\d+)\b/)?.[1];
          // O los dos con el mismo número, o ninguno: con uno solo la caja
          // deja de ser cuadrada aunque `.btn-icon` pida la relación.
          return (w !== undefined || h !== undefined) && w !== h;
        })
        .map((etiqueta) => `${ruta.replace(`${TEMA}/layouts/`, "")}  ${etiqueta.slice(0, 90)}`),
    );
    expect(con_lado).toEqual([]);
  });
});

describe("un botón de icono es un círculo, no un óvalo", () => {
  const css = sinComentariosCSS(readFileSync(`${TEMA}/assets/css/styles.css`, "utf8"));

  test(".btn-icon le da el ancho desde el alto", () => {
    /*
      Medido en el navegador: los del pie eran 20 × 40 y los de la tabla de estado
      de `/state/` 14 × 32, con `border-radius: 9999px`. Un rectángulo con radio
      de círculo es un óvalo, y lo que se ve es una mancha alargada, no un botón
      redondo: ni los cuatro lados miden lo mismo ni el radio se cumple.

      Con `aspect-ratio: 1` y el alto puesto por `.btn-md` o `.btn-sm`, el ancho
      sale de la altura: 40 × 40 y 32 × 32. Las flechas del carrusel no se notaban
      porque traen `size-10`, que fija las dos dimensiones.

      Se comprueba la regla y no una medición: la medición ya la hace el navegador
      y aquí no hay. Lo que hay que vigilar es que nadie le quite la relación.
    */
    const i = css.indexOf(".btn-icon {");
    expect(i).toBeGreaterThan(-1);
    const bloque = css.slice(i, css.indexOf("}", i));
    expect(bloque).toMatch(/aspect-ratio:\s*1\b/);
    // Y el radio sigue siendo el de círculo: sin él sería un rectángulo.
    expect(bloque).toMatch(/border-radius:\s*9999px/);
    // Y sin relleno: el relleno horizontal es lo que hacía falta antes de la relación.
    expect(bloque).toMatch(/padding-inline:\s*0\b/);
  });
});
