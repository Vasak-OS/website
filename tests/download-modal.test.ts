/*
  El modal de donación que intercepta las descargas de /downloads/.

  Al hacer clic en un botón de espejo, el script del modal ofrece donar en
  GitHub Sponsors y recién después abre el enlace. El requisito de diseño es
  que los botones sigan siendo enlaces reales (`<a href target="_blank"
  rel="noopener">`): sin JavaScript la descarga tiene que seguir funcionando.
  El script los intercepta con `preventDefault()` leyendo `data-mirror-url` y
  cayendo al `href` si el atributo falta.

  Lo que se comprueba —sobre el HTML que Hugo genera, como en `donor-wall` y
  `design-system`— es lo que se puede romper en silencio:

  · Un parcial que nadie llama: el modal no aparece y el build sigue en verde.

  · Alguien convierte los botones de espejo en `<button>` sin `href`: la
    descarga muere sin JavaScript y ninguna página deja de compilar.

  · El script no llega al HTML compilado (Hugo lo descarta, o el parcial deja
    de incluirse): los botones quedan como enlaces directos y el modal, que es
    el punto del cambio, deja de existir.

  · Una clave de traducción que se agrega a un idioma y no al otro: la página
    muestra la clave o la del idioma por defecto y nada avisa.
*/
import { describe, expect, test } from "bun:test";
import { YAML } from "bun";
import { existsSync, readFileSync } from "node:fs";

import es from "../i18n/es.toml";
import en from "../i18n/en.toml";

type Tabla = { [clave: string]: string | Tabla };

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

const idiomas = { es, en } as Record<string, Tabla>;
const planos = { es: aplanar(idiomas.es), en: aplanar(idiomas.en) };

const CLAVES_MODAL = [
  "downloads.downloadModalTitle",
  "downloads.downloadModalMessage",
  "downloads.downloadModalDonate",
  "downloads.downloadModalContinue",
  "downloads.modalNoObligation",
];

describe("las traducciones del modal de descarga", () => {
  test("las cinco claves existen en los dos idiomas con su traducción", () => {
    for (const clave of CLAVES_MODAL) {
      for (const lang of ["es", "en"] as const) {
        expect(planos[lang].get(clave)).toBeDefined();
        expect(planos[lang].get(clave)?.trim().length ?? 0).toBeGreaterThan(0);
      }
      // Sólo un error de texto se descubre comparando los dos: las
      // comprobaciones genéricas de `i18n.test.ts` exigen simetría, no verdad.
      expect(planos.es.get(clave)).not.toEqual(planos.en.get(clave));
    }
  });

  test("el español no quedó con el texto en inglés", () => {
    expect(planos.es.get("downloads.downloadModalTitle")).toBe(
      "¿Quieres apoyar VasakOS?",
    );
    expect(planos.es.get("downloads.downloadModalDonate")).toBe(
      "Donar en GitHub Sponsors",
    );
    expect(planos.es.get("downloads.downloadModalContinue")).toBe(
      "Continuar a la descarga",
    );
    expect(planos.es.get("downloads.modalNoObligation")).toBe(
      "La donación es totalmente opcional. El enlace de descarga se abrirá igual.",
    );
    expect(planos.es.get("downloads.downloadModalMessage")).toContain(
      "proyecto comunitario gratuito",
    );
  });

  test("el inglés tiene el texto en inglés", () => {
    expect(planos.en.get("downloads.downloadModalTitle")).toBe(
      "Want to support VasakOS?",
    );
    expect(planos.en.get("downloads.downloadModalDonate")).toBe(
      "Donate on GitHub Sponsors",
    );
    expect(planos.en.get("downloads.downloadModalContinue")).toBe(
      "Continue to download",
    );
    expect(planos.en.get("downloads.modalNoObligation")).toBe(
      "Donation is completely optional. The download link will open regardless.",
    );
    expect(planos.en.get("downloads.downloadModalMessage")).toContain(
      "community-driven",
    );
  });
});

// Lee `public/`, así que en CI se saltea donde no hay build: `app / revisar`
// (workflow de la organización, sin Hugo) la saltea y el `sitio` de este
// repositorio, que compila, la corre. Igual que `donor-wall` y `design-system`.
const pagina = (ruta: string): string => readFileSync(ruta, "utf8");
const sinBuild = process.env.CI && !existsSync("public/downloads/index.html");

const RUTAS = [
  "public/downloads/index.html",
  "public/en/downloads/index.html",
] as const;

describe("el /downloads/ compilado incluye el modal de donación", () => {
  test.skipIf(sinBuild)("aparece una sola vez, con rol de diálogo", () => {
    for (const ruta of RUTAS) {
      const html = pagina(ruta);
      // Una sola instancia: un `id` repetido rompe las anclas de ARIA y el
      // primer `getElementById` del script ya no es el que se ve en pantalla.
      expect((html.match(/id="download-modal"/g) ?? []).length).toBe(1);
      const modal = html.match(/<div id="download-modal"[^>]*>/)?.[0] ?? "";
      expect(modal).toContain('role="dialog"');
      expect(modal).toContain('aria-modal="true"');
      expect(modal).toContain('aria-labelledby="download-modal-title"');
      expect(html).toContain('id="download-modal-title"');
    }
  });

  test.skipIf(sinBuild)("titula con la traducción de cada idioma", () => {
    const html = pagina(RUTAS[0]);
    expect(html).toContain(planos.es.get("downloads.downloadModalTitle"));
    const enHtml = pagina(RUTAS[1]);
    expect(enHtml).toContain(planos.en.get("downloads.downloadModalTitle"));
  });

  test.skipIf(sinBuild)("el mensaje y el aviso de opcionalidad se imprimen", () => {
    const html = pagina(RUTAS[0]);
    expect(html).toContain(planos.es.get("downloads.downloadModalMessage")!);
    expect(html).toContain(planos.es.get("downloads.modalNoObligation")!);
    const enHtml = pagina(RUTAS[1]);
    expect(enHtml).toContain(planos.en.get("downloads.downloadModalMessage")!);
    expect(enHtml).toContain(planos.en.get("downloads.modalNoObligation")!);
  });

  test.skipIf(sinBuild)(
    "el botón de donar es un enlace a GitHub Sponsors que abre en otra pestaña",
    () => {
      for (const [ruta, lang] of [
        [RUTAS[0], "es"],
        [RUTAS[1], "en"],
      ] as const) {
        const html = pagina(ruta);
        const ancla = html.match(/<a id="download-modal-donate"[^>]*>/)?.[0] ?? "";
        expect(ancla).toContain('href="https://github.com/sponsors/Vasak-OS"');
        expect(ancla).toContain('target="_blank"');
        expect(ancla).toContain('rel="noopener"');
        expect(html).toContain(planos[lang].get("downloads.downloadModalDonate")!);
      }
    },
  );

  test.skipIf(sinBuild)(
    "los botones de continuar y de cerrar existen y tienen nombre accesible",
    () => {
      for (const [ruta, lang] of [
        [RUTAS[0], "es"],
        [RUTAS[1], "en"],
      ] as const) {
        const html = pagina(ruta);
        // El foco del modal va a este botón: sin texto visible ni nombre
        // accesible, una lectora no sabría qué anuncia.
        expect(html).toMatch(/<button id="download-modal-continue"[^>]*>/);
        expect(html).toContain(
          planos[lang].get("downloads.downloadModalContinue")!,
        );
        const cerrar = html.match(/<button id="download-modal-close"[^>]*>/)?.[0] ?? "";
        expect(cerrar).toMatch(/aria-label="[^"]+"/);
        expect(cerrar).not.toContain('aria-label=""');
      }
    },
  );
});

describe("los botones de espejo siguen siendo enlaces sin JavaScript", () => {
  const release = YAML.parse(readFileSync("data/release.yml", "utf8")) as {
    mirrors?: Array<{ name: string; url?: string }>;
  };
  const espejos = (release.mirrors ?? []).filter((m) => m.url);
  const reEscapado = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  test("el YAML trae un espejo que comprobar", () => {
    expect(espejos.length).toBeGreaterThan(0);
  });

  test.skipIf(sinBuild)(
    "cada espejo del YAML es un enlace real con su URL en data-mirror-url",
    () => {
      for (const ruta of RUTAS) {
        const html = pagina(ruta);
        for (const espejo of espejos) {
          const url = espejo.url!;
          const anclas =
            html.match(
              new RegExp(`<a\\b[^>]*href="${reEscapado(url)}"[^>]*>`, "g"),
            ) ?? [];
          // Cada espejo se ofrece dos veces: en la cabecera y en la lista.
          expect({ ruta, url, anclas: anclas.length }).toEqual({
            ruta,
            url,
            anclas: 2,
          });
          for (const ancla of anclas) {
            expect(ancla).toContain('target="_blank"');
            expect(ancla).toContain('rel="noopener"');
            expect(ancla).toContain("download-mirror-btn");
            expect(ancla).toContain(`data-mirror-url="${url}"`);
            expect(ancla).toContain(`data-mirror-name="${espejo.name}"`);
          }
        }
      }
    },
  );

  test.skipIf(sinBuild)(
    "ningún botón de espejo se convirtió en un <button> sin href",
    () => {
      /*
        La guarda del diseño: si mañana alguien convierte estos `<a href>` en
        `<button>` para que el modal no dependa del `href`, la descarga muere
        sin JavaScript. El `<a>` con `href`, `target` y `rel` es el requisito;
        los `data-*` son lo que el script lee.
      */
      for (const ruta of RUTAS) {
        const html = pagina(ruta);
        const botones =
          html.match(/<button\b[^>]*\bdownload-mirror-btn\b[^>]*>/g) ?? [];
        expect(botones).toEqual([]);
        const anclas =
          html.match(/<a\b[^>]*\bdownload-mirror-btn\b[^>]*>/g) ?? [];
        expect(anclas).toHaveLength(espejos.length * 2);
        for (const ancla of anclas) {
          expect(ancla).toMatch(/href="/);
          expect(ancla).toContain("data-mirror-url=");
        }
      }
    },
  );
});

describe("el script del modal llega al HTML compilado", () => {
  // El minificador de Hugo normaliza las comillas del JavaScript: los
  // patrones aceptan las dos, porque lo que importa es que la pieza exista.
  const pedazos: Array<[string, RegExp]> = [
    ["el enganche por delegación", /closest\(["']\.download-mirror-btn["']\)/],
    ["el preventDefault del clic", /preventDefault\(\)/],
    ["la URL desde data-mirror-url", /getAttribute\(["']data-mirror-url["']\)/],
    ["el fallback al href", /getAttribute\(["']href["']\)/],
    ["la apertura en pestaña nueva", /window\.open\(/],
    ["el cierre con ESC", /key===["']Escape["']/],
    ["la exposición global", /showDownloadModal/],
  ];

  test.skipIf(sinBuild)("el script que intercepta los clics sobrevive", () => {
    for (const ruta of RUTAS) {
      const html = pagina(ruta);
      for (const [que, patron] of pedazos) {
        expect({ ruta, que, presente: patron.test(html) }).toEqual({
          ruta,
          que,
          presente: true,
        });
      }
    }
  });
});