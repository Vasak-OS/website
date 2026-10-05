import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
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
    */
    const malos = plantillas.flatMap((ruta) => {
      const html = readFileSync(ruta, "utf8");
      return (html.match(/hover:text-(primary|secondary|gray-\d+|white)\b/g) ?? [])
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
