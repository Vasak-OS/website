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
});

describe("la estructura no se desarma al cambiar una plantilla", () => {
  test("el diálogo móvil tiene nombre accesible", () => {
    const header = readFileSync(`${TEMA}/layouts/partials/header.html`, "utf8");
    const dialogo = header.match(/<div[^>]*role="dialog"[^>]*>/)?.[0] ?? "";
    expect(dialogo).toContain("aria-label");
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

  test("el carrusel de capturas se puede enfocar con el teclado", () => {
    const ss = readFileSync(`${TEMA}/layouts/partials/sections/screenshots.html`, "utf8");
    const track = ss.match(/<div[^>]*screenshots-track[^>]*>/)?.[0] ?? "";
    expect(track).toContain('tabindex="0"');
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
