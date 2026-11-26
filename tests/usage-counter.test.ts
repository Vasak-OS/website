// El contador de uso del repositorio se muestra en /state/ y en /downloads/, en
// los dos idiomas, con tres números que un cron reescribe a diario. Tiene tres
// modos de falla que no se ven mirando el sitio —uno de los idiomas se quedó sin
// el bloque, la URL apunta al índice de paquetes en vez de al contador, el
// bloque dice «usuarios» cuando el dato sólo prueba IPs— y un cuarto que sí se
// ve pero se acepta: que sin datos escriba `0` en vez de `—`, porque un cero se
// lee como «nadie actualiza» y escondería un servidor caído.
//
// Las pruebas del build leen `public/`; en el job compartido, que no trae Hugo,
// se saltean, igual que el resto de las que miran el sitio armado.
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

/** La URL que publica `repository-script/stats/count-users.py`. */
const CONTADOR = "https://repo.vasak.net.ar/stats/users.json";

const paginas = [
  { ruta: "public/state/index.html", idioma: "es" },
  { ruta: "public/en/state/index.html", idioma: "en" },
  { ruta: "public/downloads/index.html", idioma: "es" },
  { ruta: "public/en/downloads/index.html", idioma: "en" },
] as const;

const sinBuild = process.env.CI && !paginas.every((p) => existsSync(p.ruta));

/** El bloque del contador, desde su `<section>` hasta su `</section>`. */
function bloque(html: string): string {
  const marca = html.indexOf(`data-usage="${CONTADOR}"`);
  if (marca < 0) return "";
  const inicio = html.lastIndexOf("<section", marca);
  const fin = html.indexOf("</section>", marca);
  return html.slice(inicio, fin + "</section>".length);
}

const leer = (ruta: string) => readFileSync(ruta, "utf8");

describe("el contador de uso llega a las dos páginas y a los dos idiomas", () => {
  test.skipIf(sinBuild)("cada página muestra el bloque con sus tres números", () => {
    for (const { ruta } of paginas) {
      if (!existsSync(ruta)) {
        throw new Error(`falta ${ruta}: corré \`bun run build\` antes de los tests`);
      }
      const trozo = bloque(leer(ruta));
      expect(trozo.length).toBeGreaterThan(0);
      for (const dias of ["7", "30", "90"]) {
        // El número es un dígito o el guion de «sin dato»; una celda vacía
        // también es un modo de falla, así que se exige contenido.
        expect(trozo).toMatch(new RegExp(`data-usage-days="${dias}">(\\d+|—)<`));
      }
    }
  });

  test.skipIf(sinBuild)("cada idioma usa su etiqueta, y ninguna dice «usuarios»", () => {
    // El servidor ve una IP que pidió el índice. Varias máquinas detrás de una
    // misma conexión cuentan como una, y una reinstalación no suma: llamarlo
    // «usuarios» afirma más de lo que el dato prueba.
    const etiqueta = { es: "IPs únicas", en: "Unique IPs" } as const;
    for (const { ruta, idioma } of paginas) {
      if (!existsSync(ruta)) continue;
      const trozo = bloque(leer(ruta));
      expect(trozo).toContain(etiqueta[idioma]);
      // Sin las etiquetas: `users.json` es el nombre del archivo y aparece en el
      // atributo de la URL, no en el texto.
      const texto = trozo.replace(/<[^>]+>/g, " ");
      expect(texto).not.toMatch(/\b(usuarios?|users?)\b/i);
    }
  });

  test("el bloque está en las dos plantillas, no en una sola", () => {
    // Copiar el marcado en cada página lo deja libre para separarse; incluir el
    // mismo partial es lo que hace que un arreglo llegue a las dos.
    const parcial = "{{ partial \"sections/usage.html\" . }}";
    for (const plantilla of [
      "themes/vasakos/layouts/state/single.html",
      "themes/vasakos/layouts/downloads/single.html",
    ]) {
      expect({ plantilla, incluye: leer(plantilla).includes(parcial) }).toEqual({
        plantilla,
        incluye: true,
      });
    }
  });
});

describe("el refresco en el navegador", () => {
  const script = leer("themes/vasakos/assets/js/state-live.js");

  test("vuelve a pedir el contador y escribe cada número en su celda", () => {
    // El build puede tener días; el cron corre a diario. Sin esto el número
    // sería el del último deploy.
    expect(script).toContain("querySelector('[data-usage]')");
    expect(script).toContain("data-usage-days");
    // `unique_7d`, `unique_30d` y `unique_90d`, compuesto desde el atributo:
    // si el nombre del campo cambia en el script que escribe el JSON, esto deja
    // de coincidir y la página se queda con el número del build sin avisar.
    expect(script).toContain("'unique_' + days + 'd'");
  });

  test("el script se carga también en /downloads/", () => {
    const pies = leer("themes/vasakos/layouts/partials/footer/scripts.html");
    expect(pies).toContain('eq .Type "state"');
    expect(pies).toContain('eq .Type "downloads"');
  });
});

describe("la URL del contador no se confunde con la del repositorio", () => {
  const params = leer("config/_default/params.yaml");

  test("repository.usage apunta a /stats/users.json y no al índice", () => {
    // Es la confusión real: `vasakos.json` es el índice de paquetes y su tabla
    // no tiene `unique_90d`, así que el bloque quedaría en `—` para siempre.
    const usage = params.match(/^\s*usage:\s*"([^"]+)"/m)?.[1];
    const index = params.match(/^\s*index:\s*"([^"]+)"/m)?.[1];
    expect(usage).toBe(CONTADOR);
    expect(usage).not.toBe(index);
    expect(usage).not.toMatch(/InRelease|vasakos\.json/);
    expect(new URL(usage!).host).toBe(new URL(index!).host);
  });
});

describe("sin datos el bloque no inventa un cero", () => {
  // Un `0` en la celda se lee como «nadie actualizó esta semana», y un servidor
  // caído —lo que produce el camino de falla— es otra cosa: la corrida no salió.
  test("el partial imprime el guion cuando el build no pudo bajar el JSON", () => {
    const parcial = leer("themes/vasakos/layouts/partials/sections/usage.html");
    expect(parcial).toContain("{{ if $u.live }}{{ .value }}{{ else }}—{{ end }}");
    const datos = leer("themes/vasakos/layouts/partials/data/usage.html");
    expect(datos).toContain('"live" false');
  });
});
