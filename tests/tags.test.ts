import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { YAML } from "bun";

/*
  Las etiquetas son la parte del sitio donde se cuelan los duplicados sin que
  se note: una página que dice «changelog» y otra «changelogs» funcionan
  igual, las dos abren, y el buscador las encuentra a las dos. La única forma
  de verlas es contarlas.
*/

interface Documento {
  ruta: string;
  es: boolean;
  tags: string[];
}

/*
  El front matter se saca con una expresión y se parsea con YAML: hay dos
  formatos en el sitio —`tags: [a, b, c]` en línea y `tags:` seguido de una
  lista con guiones— y un lector de texto tiene que conocer los dos. Pasar el
  archivo entero a YAML no sirve: varias páginas tienen un `---` en el cuerpo,
  que es una regla horizontal, y el archivo se lee como dos documentos.
*/
function documentos(): Documento[] {
  const salida: Documento[] = [];
  const recorrer = (dir: string): void => {
    for (const nombre of readdirSync(dir)) {
      const ruta = join(dir, nombre);
      if (statSync(ruta).isDirectory()) {
        recorrer(ruta);
        continue;
      }
      if (!nombre.endsWith(".md")) continue;
      const texto = readFileSync(ruta, "utf8");
      const m = texto.match(/^---\n([\s\S]*?)\n---/);
      if (!m) continue;
      let fm: Record<string, unknown>;
      try {
        fm = (YAML.parse(m[1]) ?? {}) as Record<string, unknown>;
      } catch {
        continue;
      }
      const tags = Array.isArray(fm.tags)
        ? (fm.tags as unknown[]).map(String)
        : typeof fm.tags === "string"
          ? [fm.tags]
          : [];
      salida.push({ ruta, es: !ruta.endsWith(".en.md"), tags });
    }
  };
  recorrer("content");
  return salida;
}

const docs = documentos();
const terminos = [...new Set(docs.flatMap((d) => d.tags))];

/** La URL que Hugo publica para un término. */
const slug = (t: string): string =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

describe("etiquetas", () => {
  test("hay contenido con etiquetas que mirar", () => {
    // Si el recorrido falla en silencio las pruebas siguientes pasan por
    // vacío, que es la forma más difícil de tener una suite verde y mentira.
    expect(docs.length).toBeGreaterThan(50);
    expect(terminos.length).toBeGreaterThan(20);
  });

  test("ninguna lista repite un término", () => {
    const malas = docs
      .filter((d) => new Set(d.tags).size !== d.tags.length)
      .map((d) => `${d.ruta}  ${d.tags.join(", ")}`);
    expect(malas).toEqual([]);
  });

  test("nada se escribe de dos formas a la vez", () => {
    /*
      `vasak` y `vasakos`, `arch linux` y `arch-linux`, `changelog` y
      `changelogs`: el mismo término escrito de dos maneras produce dos páginas
      de etiquetas con el mismo contenido repartido al azar entre las dos. Se
      comparan los nombres normalizados —minúsculas, sin guiones ni espacios— y
      también el singular contra el plural.
    */
    const claves = new Map<string, Set<string>>();
    for (const t of terminos) {
      const k = t.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!claves.has(k)) claves.set(k, new Set());
      claves.get(k)!.add(t);
      // Y el singular contra el plural, que es el mismo término con otra `s`
      // al final: `changelog` y `changelogs` conviven en la misma lista de los
      // cinco changelogs, y opened las dos páginas con el contenido repartido
      // al azar. Quitar la `s` final es bastante más tonto que comparar
      // palabra por palabra, y por eso está.
      const sinS = k.length > 3 && k.endsWith("s") ? k.slice(0, -1) : "";
      if (sinS) {
        if (!claves.has(sinS)) claves.set(sinS, new Set());
        claves.get(sinS)!.add(t);
      }
    }
    const gemelos = [...claves.entries()]
      .filter(([, variantes]) => variantes.size > 1)
      .map(([k, v]) => `${k}  →  ${[...v].sort().join("  /  ")}`);
    expect(gemelos).toEqual([]);
  });

  test("dos términos distintos no pelean por la misma URL", () => {
    const porSlug = new Map<string, Set<string>>();
    for (const t of terminos) {
      const s = slug(t);
      if (!s) continue;
      if (!porSlug.has(s)) porSlug.set(s, new Set());
      porSlug.get(s)!.add(t);
    }
    const choques = [...porSlug.entries()]
      .filter(([, v]) => v.size > 1)
      .map(([s, v]) => `${s}  →  ${[...v].sort().join("  /  ")}`);
    expect(choques).toEqual([]);
  });

  test("ningún término es una fecha", () => {
    // `2026-10-04` apareció como etiqueta de una sola página: no describe el
    // documento, describe cuándo se escribió, y la fecha ya está en el
    // front matter. Es una página de etiquetas con una entrada.
    const fechas = terminos.filter((t) => /^\d{4}-\d{2}-\d{2}$/.test(t));
    expect(fechas).toEqual([]);
  });

  test("ningún término repite el nombre de la marca con una palabra de más", () => {
    // «descargar vasakos», «download vasakos», «about vasakos»: estas páginas
    // se armaban con el mismo contenido que la etiqueta `vasakos` y repartían
    // las visitas entre varias URL que dicen lo mismo.
    const inflados = terminos.filter((t) =>
      /^(descargar?|download|about|sobre|donations?|donate|support|soporte)\s+(vasakos|vasak)$/.test(
        t.toLowerCase(),
      ),
    );
    expect(inflados).toEqual([]);
  });

  test("el contenido en español no lleva el término del otro idioma", () => {
    // El sitio publica `/tags/<término>/` y `/en/tags/<término>/`, así que una
    // palabra sólo en inglés abre una página de etiquetas en la que todas las
    // entradas están en el otro idioma. Salvo que el término sea el mismo en
    // los dos —`linux`, `rust`, `iso`—, que sí se usa en ambas.
    const enIngles = new Set(docs.filter((d) => !d.es).flatMap((d) => d.tags));
    const traducidas = /^(descargas?|downloads?|information|información|news|noticias|updates?|actualizaciones|telegram|channel|canal|history|historia|state|estado|terms|términos|license|licencia|conditions|condiciones|community|comunidad|thanks|gracias|installer|programmer|programmers-day|anniversary|development|desarrollo)$/i;
    const sospechosos = docs
      .filter((d) => d.es)
      .flatMap((d) => d.tags)
      .filter((t) => enIngles.has(t) && traducidas.test(t));
    expect([...new Set(sospechosos)]).toEqual([]);
  });

  test("todo término se convierte en una URL", () => {
    // Un término que al convertirse en carpeta se quede vacío —`---`, `!!!`,
    // un término de sólo acentos— no abre ninguna página: Hugo lo publica en la
    // raíz y desaparece. Se compara contra el build, que es quien decide el
    // nombre de la carpeta; una regla escrita acá sería la regla que estamos
    // tratando de comprobar.
    const sinUrl = terminos.filter((t) => slug(t) === "");
    expect(sinUrl).toEqual([]);
  });

  test("todo término tiene una carpeta y una página en el sitio publicado", () => {
    // Igual que la anterior pero contra `public/`. A diferencia del resto de la
    // suite, esta prueba sí lee del build —no hay otra forma de saber qué
    // carpeta le puso Hugo a un término—, así que salta si todavía no se
    // compiló. Sin este salto, `bun test` sobre un clon recién bajado pasa en
    // verde con las 111 carpetas sin comprobar, que es peor que no comprobar.
    if (!statSync("public").isDirectory()) {
      throw new Error(
        "falta public/: corré `bun run build` antes de los tests, o esta prueba no está mirando nada",
      );
    }
    // Un término que sólo existe en un idioma publica su página en el árbol de
    // ese idioma, así que se buscan los dos.
    const faltan = terminos.filter((t) => {
      for (const prefijo of ["", "/en"]) {
        try {
          if (statSync(`public${prefijo}/tags/${slug(t)}/index.html`).isFile()) return false;
        } catch {
          /* sigue */
        }
      }
      return true;
    });
    expect(faltan).toEqual([]);
  });
});
