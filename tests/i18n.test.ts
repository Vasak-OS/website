import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import es from "../i18n/es.toml";
import en from "../i18n/en.toml";

/*
  La página en inglés no se construye con las plantillas en español: se construye
  con las mismas plantillas y las palabras de `i18n/en.toml`. Eso deja un modo de
  falla que no se ve mirando el sitio: una clave que falta, o una clave que quedó
  en otra tabla, y Hugo no se queja — muestra la clave, o la del idioma por
  defecto, y el sitio entero se sigue publicando.

  Estos tests son la red que avisa. La asimetría entre los dos archivos es
  justamente lo que no se nota a ojo.
*/

type Tabla = { [clave: string]: string | Tabla };

const idiomas = { es, en } as Record<string, Tabla>;

/** Aplana un TOML anidado a rutas con punto: `{a: {b: "x"}}` → `"a.b"`. */
function aplanar(tabla: Tabla, prefijo = ""): Map<string, string> {
  const salida = new Map<string, string>();
  for (const [clave, valor] of Object.entries(tabla)) {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave;
    if (typeof valor === "string") salida.set(ruta, valor);
    else for (const [k, v] of aplanar(valor, ruta)) salida.set(k, v);
  }
  return salida;
}

const planos = { es: aplanar(es), en: aplanar(en) };
const claves = { es: new Set(planos.es.keys()), en: new Set(planos.en.keys()) };

/** Los archivos de las plantillas y la configuración, para buscar `T "..."`. */
function archivosDelTema(directorio: string): string[] {
  const encontrados: string[] = [];
  for (const entrada of readdirSync(directorio)) {
    const ruta = join(directorio, entrada);
    if (statSync(ruta).isDirectory()) encontrados.push(...archivosDelTema(ruta));
    // `.webmanifest` es el nombre que Hugo le da a la plantilla del manifiesto:
    // el formato de salida se llama WEBAPPMANIFEST pero el archivo se resuelve
    // por `index.<baseName del formato>`.
    else if (/\.(html|json|js|webmanifest)$/.test(entrada)) encontrados.push(ruta);
  }
  return encontrados;
}

const plantillas = [
  ...archivosDelTema("themes/vasakos/layouts"),
  ...readdirSync("config/_default")
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => join("config/_default", f)),
];

describe("los dos archivos de traducción", () => {
  test("tienen exactamente las mismas claves", () => {
    const soloEs = [...claves.es].filter((k) => !claves.en.has(k));
    const soloEn = [...claves.en].filter((k) => !claves.es.has(k));
    expect({ soloEs, soloEn }).toEqual({ soloEs: [], soloEn: [] });
  });

  test("no usan `description` como clave", () => {
    // Hugo reserva ese nombre: si una tabla lo tiene junto a otras claves
    // rechaza cargar el archivo entero, y el error no dice qué clave era.
    const ofensas = Object.entries(idiomas).flatMap(([lang, tabla]) =>
      [...planos[lang].keys()]
        .filter((k) => k === "description" || k.endsWith(".description"))
        .map((k) => `${lang}: ${k}`),
    );
    expect(ofensas).toEqual([]);
  });

  test("ponen los mismos huecos en cada traducción", () => {
    // Una traducción de Hugo es una plantilla de Go: sus huecos son
    // `{{ .Nombre }}` y se llenan con el `dict` que le pasa la plantilla. Si un
    // idioma tiene un hueco y el otro no —o se llaman distinto— lo que sale es
    // un `{{ .Algo }}` a la vista en la página, y el build no se queja.
    const huecos = (s: string) =>
      [...s.matchAll(/\{\{\s*\.(\w+)\s*\}\}/g)].map((m) => m[1]).sort();
    const desbalanceados: string[] = [];
    for (const [ruta, texto] of planos.es) {
      const traduccion = planos.en.get(ruta);
      if (traduccion === undefined) continue;
      if (huecos(texto).join(",") !== huecos(traduccion).join(",")) {
        desbalanceados.push(
          `${ruta}: es [${huecos(texto)}], en [${huecos(traduccion)}]`,
        );
      }
    }
    expect(desbalanceados).toEqual([]);
  });

  test("no usan verbos de printf para los huecos", () => {
    // `%s` y `%d` no se interpolan: se imprimen tal cual. Es el modo de falla
    // que se ve en la página y no en el build.
    const conVerbos = [...planos.es]
      .filter(([, v]) => /(^|\s)%[sd]|%[sd](\s|$)/.test(v))
      .map(([k]) => k);
    expect(conVerbos).toEqual([]);
  });

  test("no dejan ninguna traducción vacía", () => {
    const vacias = [...planos.es].filter(([, v]) => v.trim() === "").map(([k]) => k);
    expect(vacias).toEqual([]);
  });
});

describe("las claves que piden las plantillas", () => {
  const pedidos = new Set<string>();
  const formatos = new Set<string>();
  for (const ruta of plantillas) {
    const texto = readFileSync(ruta, "utf8");
    for (const m of texto.matchAll(/\bT\s+"([^"]+)"/g)) pedidos.add(m[1]);
    for (const m of texto.matchAll(/\bT\s*\(?\s*printf\s+"([^"]+)"/g)) formatos.add(m[1]);
  }

  test("existen en los dos idiomas", () => {
    const faltan: string[] = [];
    for (const clave of pedidos) {
      if (!claves.es.has(clave)) faltan.push(`es no tiene ${clave}`);
      if (!claves.en.has(clave)) faltan.push(`en no tiene ${clave}`);
    }
    expect(faltan).toEqual([]);
  });

  test("el `dict` de cada llamada llena todos los huecos de la traducción", () => {
    // El otro modo de falla del mismo tipo: la traducción pide `{{ .Canal }}` y
    // la plantilla pasa `(dict "Channel" ...)`. Hugo no avisa —.Publica un
    // `<no value>` o un `{{ .Canal }}` en la página y sigue.
    const argumentos = new Map<string, Set<string>>();
    for (const ruta of plantillas) {
      const texto = readFileSync(ruta, "utf8");
      const re = /\bT\s+"([^"]+)"\s*\(\s*dict\s+([^)]*(?:\([^)]*\)[^)]*)*?)\)/g;
      for (const m of texto.matchAll(re)) {
        const claves = new Set(
          [...m[2].matchAll(/"(\w+)"\s/g)].map((k) => k[1]),
        );
        const previas = argumentos.get(m[1]) ?? new Set<string>();
        for (const c of claves) previas.add(c);
        argumentos.set(m[1], previas);
      }
    }
    const huecosDe = (ruta: string, idioma: "es" | "en") => [
      ...(planos[idioma].get(ruta) ?? "").matchAll(/\{\{\s*\.(\w+)\s*\}\}/g),
    ].map((m) => m[1]);

    const problemas: string[] = [];
    for (const [ruta, claves] of argumentos) {
      for (const idioma of ["es", "en"] as const) {
        for (const hueco of huecosDe(ruta, idioma)) {
          if (!claves.has(hueco)) problemas.push(`${ruta}: falta "${hueco}" en el dict`);
        }
      }
    }
    expect(problemas).toEqual([]);
  });

  test("ninguna queda sin usar", () => {
    // Una clave que nada lee es una trampa: alguien la edita y no ve efecto.
    // Las que se arman con `printf` se resuelven en tiempo de ejecución, así que
    // se buscan con un patrón y no con igualdad.
    const patronDe = (formato: string) =>
      new RegExp(
        `^${formato
          .split(/%[sd]/)
          .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join(".+")}$`,
      );
    const patrones = [...formatos].map(patronDe);
    const sinUso = [...claves.es].filter(
      (k) => !pedidos.has(k) && !patrones.some((re) => re.test(k)),
    );
    expect(sinUso).toEqual([]);
  });
});

describe("el bloque de donaciones", () => {
  const frontMatter = readFileSync("content/donate/index.md", "utf8");

  test("cada `id` de la página tiene su traducción en los dos idiomas", () => {
    // El front matter quedó con la estructura y las direcciones; las palabras
    // se resuelven por `id`. Un `id` nuevo sin traducir deja la línea en blanco.
    const ids = [...frontMatter.matchAll(/^\s+-\s+id:\s*(\S+)\s*$/gm)].map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    const faltan: string[] = [];
    for (const id of ids) {
      for (const prefijo of ["usage", "infra", "transparency", "methods"]) {
        for (const campo of ["title", "detail", "item", "priority", "name", "note"]) {
          const ruta = `donate.summary.${prefijo}.${id}.${campo}`;
          const existe = claves.es.has(ruta) || claves.en.has(ruta);
          if (!existe) continue; // el campo no aplica a esta lista
          if (!claves.es.has(ruta)) faltan.push(`es no tiene ${ruta}`);
          if (!claves.en.has(ruta)) faltan.push(`en no tiene ${ruta}`);
        }
      }
    }
    expect(faltan).toEqual([]);
  });

  test("las listas de i18n tienen el mismo orden que las del front matter", () => {
    // El orden se lee del YAML, no de i18n: la plantilla recorre el YAML y busca
    // la traducción por `id`. Si las listas se cruzaran, cada línea saldría con
    // la traducción de otra, y los tests pasarían igual si sólo se compararan
    // como conjuntos.
    const idsDeI18n = (prefijo: string) => {
      const vistos: string[] = [];
      for (const k of claves.es) {
        if (!k.startsWith(`donate.summary.${prefijo}.`)) continue;
        const id = k.split(".")[3];
        if (!vistos.includes(id)) vistos.push(id);
      }
      return vistos;
    };
    const idsDelYaml = (prefijo: string) => {
      const bloque = frontMatter.slice(frontMatter.indexOf(`  ${prefijo}:`));
      const corte = bloque.search(/\n  \w+:/);
      return [...(corte > 0 ? bloque.slice(0, corte) : bloque).matchAll(/-\s+id:\s*(\S+)/g)].map(
        (m) => m[1],
      );
    };
    for (const prefijo of ["usage", "infra", "transparency", "methods"]) {
      expect({ prefijo, orden: idsDeI18n(prefijo) }).toEqual({
        prefijo,
        orden: idsDelYaml(prefijo),
      });
    }
  });
});
