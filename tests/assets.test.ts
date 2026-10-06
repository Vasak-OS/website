/*
  Los dos scripts del tema que trabajan sobre el DOM, con un DOM armado a mano.

  No hay navegador en la CI y montar uno —jsdom, happy-dom— sería una
  dependencia nueva para probar cuatro comportamientos. Los dos scripts leen el
  DOM por funciones de `document` y nada más, así que basta con dárselas: el
  stub de abajo implementa las que usan y ninguna otra.

  Corren acá también porque Sonar mide la cobertura del código nuevo y éste es
  el único JavaScript que toca este PR: las otras pruebas leen archivos, no los
  ejecutan, y sin este archivo la barra del menú y el alternado de /state/
  entrarían al gate al 0%. La cobertura es consecuencia de probarlos, no el
  motivo: el rotulado de `frame-title` (WCAG 4.1.2) y las filas extra son los
  dos lugares donde este código se rompe en silencio.
*/
import { afterAll, describe, expect, test } from "bun:test";

// ── El DOM de mentira ────────────────────────────────────────────────────────

function elemento(
  atributos: Record<string, string> = {},
  opciones: { clases?: string[]; titulo?: string } = {},
  metodos: Record<string, unknown> = {},
) {
  const mapa = new Map(Object.entries(atributos));
  const clases = new Set(opciones.clases ?? []);
  const oyentes: Record<string, Array<(...argumentos: unknown[]) => void>> = {};
  const base = {
    nodeType: 1,
    title: opciones.titulo ?? "",
    textContent: "",
    getAttribute: (nombre: string) => mapa.get(nombre) ?? null,
    setAttribute: (nombre: string, valor: string) => void mapa.set(nombre, valor),
    hasAttribute: (nombre: string) => mapa.has(nombre),
    classList: {
      add: (...nuevas: string[]) => nuevas.forEach((c) => clases.add(c)),
      remove: (...fuera: string[]) => fuera.forEach((c) => clases.delete(c)),
      toggle: (c: string, fuerza?: boolean) => {
        const activo = fuerza ?? !clases.has(c);
        if (activo) clases.add(c);
        else clases.delete(c);
        return activo;
      },
      contains: (c: string) => clases.has(c),
    },
    addEventListener: (evento: string, fn: (...argumentos: unknown[]) => void) => {
      (oyentes[evento] ??= []).push(fn);
    },
    // A mano, para leerlas desde las pruebas.
    clases,
    oyentes,
  };
  return Object.assign(base, metodos);
}

/** Lo que el selector `iframe:not([title]):not([aria-label])` dejaría pasar. */
const sinNombre = (lista: ReturnType<typeof elemento>[]) =>
  lista.filter((f) => !f.title && !f.getAttribute("aria-label"));

const iframes: ReturnType<typeof elemento>[] = [];
const ids: Record<string, ReturnType<typeof elemento>> = {};
const botonesToggle: ReturnType<typeof elemento>[] = [];

const documento = {
  documentElement: { nodeType: 1 },
  getElementById: (id: string) => ids[id] ?? null,
  // El primer IIFE de `state-live` busca `[data-repo-index]` y, sin eso,
  // sale antes de tocar `fetch`: la prueba nunca hace red. Si alguna vez
  // dejara de salir, el import revienta y el rojo es de acá.
  querySelector: (_selector: string) => null,
  querySelectorAll: (selector: string) => {
    if (selector.startsWith("iframe")) return sinNombre(iframes);
    if (selector === ".toggle-extra-rows") return botonesToggle;
    return [];
  },
};

/** Lo único que `menu.js` espera del observador: quedar registrado. */
let observador: {
  cb: (cambios: unknown[]) => void;
  objetivo: unknown;
  opciones: unknown;
} | null = null;

class ObservadorDeMentira {
  cb: (cambios: unknown[]) => void;
  constructor(cb: (cambios: unknown[]) => void) {
    this.cb = cb;
  }
  observe(objetivo: unknown, opciones: unknown) {
    observador = { cb: this.cb, objetivo, opciones };
  }
}

// ── Lo que los scripts buscan al cargar ──────────────────────────────────────

const panel = elemento({ id: "mobile-menu" }, { clases: ["hidden"] });
const overlay = elemento({ id: "mobile-menu-overlay" }, { clases: ["hidden"] });
ids["mobile-menu"] = panel;
ids["mobile-menu-overlay"] = overlay;

const iframeTelegram = elemento({ src: "https://t.me/o/123?embed=1" });
const iframeAjeno = elemento({ src: "https://example.com/embed" });
const iframeNombrado = elemento(
  { src: "https://t.me/o/456?embed=1" },
  { titulo: "De quien lo insertó" },
);
iframes.push(iframeTelegram, iframeAjeno, iframeNombrado);

const filasExtra = [
  elemento({}, { clases: ["hidden"] }),
  elemento({}, { clases: ["hidden"] }),
];
const tabla = elemento({}, {}, {
  querySelectorAll: (selector: string) => (selector === ".extra-row" ? filasExtra : []),
});
ids["paquetes"] = tabla;

const textoDelBoton = { textContent: "Ver más" };
const boton = elemento(
  { "data-toggle-target": "paquetes", "aria-expanded": "false" },
  {},
  { querySelector: (selector: string) => (selector === ".toggle-text" ? textoDelBoton : null) },
);
const botonSinTabla = elemento({
  "data-toggle-target": "no-existe",
  "aria-expanded": "false",
});
const botonSinTexto = elemento(
  { "data-toggle-target": "paquetes", "aria-expanded": "false" },
  {},
  { querySelector: (_selector: string) => null },
);
botonesToggle.push(boton, botonSinTabla, botonSinTexto);

(globalThis as Record<string, unknown>).document = documento;
(globalThis as Record<string, unknown>).MutationObserver = ObservadorDeMentira;

// Después de montar el DOM: los dos scripts trabajan en cuanto se cargan.
await import("../themes/vasakos/assets/js/menu.js");
await import("../themes/vasakos/assets/js/state-live.js");

describe("el menú móvil y el rotulado de iframes", () => {
  test("al cargar, sólo el iframe de Telegram sin nombre queda nombrado", () => {
    expect(iframeTelegram.title).toBe("Publicación de Telegram");
    expect(iframeAjeno.title).toBe("");
    // El que ya traía nombre lo conserva: el del tercero es mejor que el nuestro.
    expect(iframeNombrado.title).toBe("De quien lo insertó");
  });

  test("el observador queda mirando el documento entero", () => {
    expect(observador).not.toBeNull();
    expect(observador!.objetivo).toBe(documento.documentElement);
    expect(observador!.opciones).toEqual({ childList: true, subtree: true });
  });

  test("los iframe que llegan después también se rotulan", () => {
    // Un `iframe` directo: como su `parentNode` no existe en el stub, el
    // observador vuelve a recorrer el documento entero.
    const llegado = elemento({ src: "https://t.me/o/789?embed=1" });
    llegado.matches = (selector: string) => selector === "iframe";
    iframes.push(llegado);

    // Un contenedor que no es `iframe` pero tiene uno adentro.
    const contenido = elemento({ src: "https://t.me/o/000?embed=1" });
    const contenedor = elemento({}, {}, {
      matches: () => false,
      querySelector: (selector: string) => (selector === "iframe" ? contenido : null),
      querySelectorAll: (selector: string) =>
        selector.startsWith("iframe") ? sinNombre([contenido]) : [],
    });

    observador!.cb([{ addedNodes: [{ nodeType: 3 }, llegado, contenedor] }]);

    expect(llegado.title).toBe("Publicación de Telegram");
    expect(contenido.title).toBe("Publicación de Telegram");
  });

  test("abrir y cerrar alternan el panel y el overlay", () => {
    const abrir = (globalThis as Record<string, unknown>).openMobileMenu;
    const cerrar = (globalThis as Record<string, unknown>).closeMobileMenu;
    expect(abrir).toBeTypeOf("function");
    expect(cerrar).toBeTypeOf("function");

    (abrir as () => void)();
    expect(panel.clases.has("hidden")).toBe(false);
    expect(overlay.clases.has("hidden")).toBe(false);

    (cerrar as () => void)();
    expect(panel.clases.has("hidden")).toBe(true);
    expect(overlay.clases.has("hidden")).toBe(true);
  });
});

describe("el alternado de filas extra de /state/", () => {
  test("expandir muestra las filas, cambia aria-expanded y el texto", () => {
    const clic = boton.oyentes["click"]![0];

    clic.call(boton);
    expect(filasExtra.every((fila) => !fila.clases.has("hidden"))).toBe(true);
    expect(boton.getAttribute("aria-expanded")).toBe("true");
    expect(textoDelBoton.textContent).toBe("Ver menos");

    clic.call(boton);
    expect(filasExtra.every((fila) => fila.clases.has("hidden"))).toBe(true);
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    expect(textoDelBoton.textContent).toBe("Ver más");
  });

  test("sin tabla destino no hace nada y no rompe", () => {
    const clic = botonSinTabla.oyentes["click"]![0];
    clic.call(botonSinTabla);
    expect(botonSinTabla.getAttribute("aria-expanded")).toBe("false");
  });

  test("sin elemento de texto alterna igual las filas", () => {
    const clic = botonSinTexto.oyentes["click"]![0];
    clic.call(botonSinTexto);
    expect(botonSinTexto.getAttribute("aria-expanded")).toBe("true");
    expect(filasExtra.every((fila) => !fila.clases.has("hidden"))).toBe(true);
  });
});

afterAll(() => {
  // El proceso de `bun test` es uno solo para todos los archivos: lo que se
  // monta acá se queda montado para los que corren después.
  for (const clave of ["document", "MutationObserver", "openMobileMenu", "closeMobileMenu"]) {
    delete (globalThis as Record<string, unknown>)[clave];
  }
});
