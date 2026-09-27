import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import es from "../i18n/es.toml";
import en from "../i18n/en.toml";

/*
  Lo que se comprueba acá es metadata: lo que el buscador lee antes de decidir
  si visita la página. Se lee del código fuente y no de `public/`, porque un test
  que depende de un build anterior pasa en verde sobre un `public/` viejo — el
  fallo se descubre tarde y se atribuye a otra cosa.
*/

/** Cuántos caracteres de un `<title>` se ven antes de que Google los corte. */
const TITULO = 62;
/** Cuántos caben en la descripción sin que el buscador la recorte a mitad de palabra. */
const DESCRIPCION = 158;

const archivosDe = function* (directorio: string): Generator<string> {
  for (const entrada of readdirSync(directorio)) {
    const ruta = join(directorio, entrada);
    if (statSync(ruta).isDirectory()) yield* archivosDe(ruta);
    else if (entrada.endsWith(".md")) yield ruta;
  }
};

const contenido = [...archivosDe("content")].sort();

/** El front matter de un `.md`, o `""` si no tiene. */
function frontMatter(ruta: string): string {
  const texto = readFileSync(ruta, "utf8");
  if (!texto.startsWith("---\n")) return "";
  const fin = texto.indexOf("\n---", 4);
  return fin === -1 ? "" : texto.slice(4, fin);
}

/** El valor de una clave de primer nivel del front matter, sin las comillas. */
function clave(front: string, nombre: string): string | undefined {
  const m = front.match(new RegExp(`^${nombre}:[ \\t]*(.*)$`, "m"));
  if (!m) return undefined;
  const valor = m[1].trim();
  if (valor === ">" || valor === "|") return valor; // bloque, sin leer
  return valor.replace(/^["'](.*)["']$/, "$1");
}

describe("el título de cada página", () => {
  test("no hay ninguno que se corte en el buscador", () => {
    // El título es lo único que se ve de la página en la lista de resultados,
    // y se corta alrededor de los 60 caracteres. Uno más largo no es "más
    // descriptivo": es un texto que se come la coma del medio.
    const largos: string[] = [];
    for (const ruta of contenido) {
      const front = frontMatter(ruta);
      const efectivo = clave(front, "seotitle") ?? clave(front, "title");
      if (!efectivo || efectivo === ">" || efectivo === "|") continue;
      // `seotitle` ya viene completo; `title` se le pega " | VasakOS".
      const largo = clave(front, "seotitle") ? efectivo.length : efectivo.length + 9;
      if (largo > TITULO) largos.push(`${ruta} (${largo})`);
    }
    expect(largos).toEqual([]);
  });

  test("`seotitle` sólo existe donde hace falta", () => {
    // Si `seotitle` está en todos lados, nadie lo lee: deja de ser la
    // excepción para el título que no entra y se vuelve una copia más que
    // mantener sincronizada con el `title` de al lado.
    const conSeo = contenido.filter((r) => clave(frontMatter(r), "seotitle") !== undefined);
    const sinSeo = contenido.length - conSeo.length;
    expect(sinSeo).toBeGreaterThan(conSeo.length);
  });
});

describe("la descripción de cada página", () => {
  test("las 134 páginas la escriben", () => {
    // Antes de este trabajo, 46 páginas no tenían ninguna: la descripción
    // salía sola del primer párrafo, que es un texto que nadie eligió para
    // ser un resumen. Y en 45 de ellas el `#` del ancla de sección se colaba en
    // el meta tag.
    const sinDescripcion = contenido.filter(
      (r) => (clave(frontMatter(r), "description") ?? "").trim() === "",
    );
    expect(sinDescripcion).toEqual([]);
  });

  test("ninguna se corta a mitad de palabra", () => {
    const cortada: string[] = [];
    for (const ruta of contenido) {
      const d = clave(frontMatter(ruta), "description") ?? "";
      if (d.length > DESCRIPCION) cortada.push(`${ruta} (${d.length})`);
    }
    expect(cortada).toEqual([]);
  });

  test("cada una describe su propia página y no la de al lado", () => {
    // La tentación con 134 páginas es escribir la misma línea en todas y que
    // el buscador decida a cuál le sirve. Se comparan entre sí.
    const vistas = new Map<string, string>();
    const repetidas: string[] = [];
    for (const ruta of contenido) {
      const d = (clave(frontMatter(ruta), "description") ?? "").trim();
      if (!d) continue;
      const antes = vistas.get(d);
      if (antes) repetidas.push(`${ruta} y ${antes}`);
      else vistas.set(d, ruta);
    }
    expect(repetidas).toEqual([]);
  });
});

describe("el resumen de i18n que se usa cuando una página no trae descripción", () => {
  test("entra en la descripción sin recorte", () => {
    // Se usa en la portada, el 404 y los índices de categorías y etiquetas.
    // Medía 183 caracteres en español: lo que se veía era el recorte con la
    // elipsis colgando de "rolling …".
    for (const tabla of [es, en] as unknown as { site: { summary: string } }[]) {
      expect(tabla.site.summary.length).toBeLessThanOrEqual(DESCRIPCION);
    }
  });

  test("empieza por el nombre de la marca", () => {
    // Las primeras palabras de la descripción son las que se comparan con la
    // consulta. Arranca con "Sistema operativo libre…" perdía la marca.
    for (const tabla of [es, en] as unknown as { site: { summary: string } }[]) {
      expect(tabla.site.summary.startsWith("VasakOS")).toBe(true);
    }
  });
});

describe("las rutas escritas a mano", () => {
  test("el menú principal termina cada ruta en barra", () => {
    // El menú decía `/about` y Hugo publica `/about/`. `relLangURL` no inventa
    // la barra final, así que las cinco entradas apuntaban a una URL que no
    // existe: el servidor las redirigía con un 301 y cada clic del menú se
    // comía un salto. La barra va en el dato, que es lo único que depende de
    // `uglyURLs`.
    const rotas: string[] = [];
    for (const idioma of ["es", "en"]) {
      const ruta = `config/_default/menus.${idioma}.yaml`;
      for (const m of readFileSync(ruta, "utf8").matchAll(/^\s*url:\s*(\S+)/gm)) {
        const url = m[1];
        if (!url.startsWith("/")) continue;
        if (!url.endsWith("/")) rotas.push(`${ruta}: ${url}`);
      }
    }
    expect(rotas).toEqual([]);
  });

  test("el menú de los dos idiomas tiene las mismas entradas", () => {
    // Los archivos se mantienen en paralelo a mano. Si uno gana una entrada y
    // el otro no, el menú cambia de forma entre idiomas sin que nada avise.
    const entradas = (idioma: string) =>
      [...readFileSync(`config/_default/menus.${idioma}.yaml`, "utf8").matchAll(/identifier:\s*(\S+)/g)]
        .map((m) => m[1])
        .sort();
    expect(entradas("en")).toEqual(entradas("es"));
  });
});

describe("las imágenes del contenido", () => {
  test("todas dicen qué son", () => {
    // `![](url)` produce un `alt` vacío: la captura no se anuncia y el
    // artículo pierde lo que la imagen muestra. Cinco estaban así, y cuatro
    // más decían una sola palabra —"Preview", "Tabs"— que no describe nada.
    const sinAlt: string[] = [];
    for (const ruta of contenido) {
      const texto = readFileSync(ruta, "utf8");
      // Fuera de los bloques de código, que son ejemplos y no ilustraciones.
      const cuerpo = texto.replace(/```[\s\S]*?```/g, "");
      for (const m of cuerpo.matchAll(/!\[\s*([^\]]*)\]\(/g)) {
        if (m[1].trim() === "") sinAlt.push(ruta);
      }
    }
    expect(sinAlt).toEqual([]);
  });
});
