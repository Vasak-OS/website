/*
  Las dos vías del script que arma el muro (`scripts/fetch-sponsors.mjs`) y su
  `main`, probadas sin salir a la red: `fetch` sale mockeado y `main` escribe en
  un archivo temporal, no sobre el respaldo commiteado de `data/sponsors.yml`.

  Lo que queda sin cubrir en `donor-wall.test.ts` y se prueba acá:

  · `fetchSponsorsGraphQL`: la consulta con token. Que filtre lo privado —es la
    única garantía de que quien eligió no aparecer no aparece—, que traiga
    fecha y tier, y que falle con gracia si GitHub responde mal o con errores
    de GraphQL.

  · `fetchSponsorsPage`: el GET de la página pública sin token, y qué pasa si
    GitHub responde algo que no es 200.

  · `main`: la elección de vía (token o no), el fallback nuevo —si la GraphQL
    no sirvió, baja a la página pública en vez de quedarse con el archivo
    anterior— y la idempotencia: un deploy sin novedades no vuelve a escribir.
*/
import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  fetchSponsorsGraphQL,
  fetchSponsorsPage,
  main,
  serialize,
  sinFecha,
} from "../scripts/fetch-sponsors.mjs";

const PAGINA = await readFile("tests/fixtures/sponsors-page.html", "utf8");
const fetchReal = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = fetchReal;
  delete process.env.GH_TOKEN;
});

/** Corre `main` escribiendo en un directorio temporal; devuelve el path del yml. */
async function mainEnTemp(env: Record<string, string>) {
  const dir = await mkdtemp(join(tmpdir(), "sponsors-test-"));
  const salida = join(dir, "sponsors.yml");
  for (const [k, v] of Object.entries(env)) process.env[k] = v;
  await main(salida);
  return { dir, salida };
}

describe("fetchSponsorsGraphQL consulta la API GraphQL", () => {
  test("filtra lo privado y trae fecha de inicio y tier", async () => {
    // `privacyLevel: PRIVATE` es lo que GitHub entrega para quien pidió no
    // aparecer: si esto saliera al muro se rompería la confianza. Un nodo sin
    // login (un patrocinio caído, una entidad rara) tampoco puede entrar.
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          data: {
            organization: {
              sponsorshipsAsMaintainer: {
                nodes: [
                  {
                    createdAt: "2026-01-15T10:00:00Z",
                    privacyLevel: "PUBLIC",
                    tier: { name: "backer" },
                    sponsorEntity: {
                      __typename: "User",
                      login: "alantonche",
                      name: "Alán Tonche",
                      avatarUrl: "https://avatars.githubusercontent.com/u/72902088?s=60&v=4",
                      url: "https://github.com/alantonche",
                    },
                  },
                  {
                    createdAt: "2026-03-01T10:00:00Z",
                    privacyLevel: "PRIVATE",
                    tier: { name: "backer" },
                    sponsorEntity: { __typename: "User", login: "anonimo" },
                  },
                  {
                    createdAt: "2026-02-01T10:00:00Z",
                    privacyLevel: "PUBLIC",
                    tier: { name: "gold" },
                    sponsorEntity: { __typename: "Organization", login: "" },
                  },
                ],
              },
            },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );

    const donadores = await fetchSponsorsGraphQL("Vasak-OS", "un-token");
    expect(donadores.map((d) => d.login)).toEqual(["alantonche"]);
    // La fecha llega recortada al día y el tier con su nombre.
    expect(donadores[0].since).toBe("2026-01-15");
    expect(donadores[0].tier).toBe("backer");
    // El avatar pasó por el mismo reescalado que la página pública.
    expect(donadores[0].avatar).toContain("s=144");
  });

  test("si la respuesta no es 200, tira el error del status", async () => {
    globalThis.fetch = async () => new Response("no", { status: 401 });
    await expect(fetchSponsorsGraphQL("Vasak-OS", "un-token")).rejects.toThrow("GraphQL respondió 401");
  });

  test("los errores de GraphQL (privilegios, token sin scope) se propagan", async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ errors: [{ message: "no autorizado" }] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    await expect(fetchSponsorsGraphQL("Vasak-OS", "un-token")).rejects.toThrow(
      "GraphQL: no autorizado",
    );
  });
});

describe("fetchSponsorsPage lee la página pública", () => {
  test("devuelve los donadores parseados de la página", async () => {
    globalThis.fetch = async () => new Response(PAGINA, { status: 200 });
    const donadores = await fetchSponsorsPage("Vasak-OS");
    expect(donadores.map((d) => d.login)).toEqual(["alantonche", "some-org"]);
  });

  test("un status que no es 200 tira el error del status", async () => {
    globalThis.fetch = async () => new Response("error", { status: 500 });
    await expect(fetchSponsorsPage("Vasak-OS")).rejects.toThrow("La página pública respondió 500");
  });
});

describe("sinFecha compara sin la línea updated", () => {
  test("borra la línea updated y nada más", () => {
    const conFecha = `updated: "2026-10-13T00:00:00.000Z"\n# comentario\nsponsors: []\n`;
    expect(sinFecha(conFecha)).toBe('# comentario\nsponsors: []\n');
  });
});

describe("main elige la vía y escribe el YAML", () => {
  test("sin token usa la página pública y escribe el archivo", async () => {
    globalThis.fetch = async () => new Response(PAGINA, { status: 200 });
    const { dir, salida } = await mainEnTemp({});
    const yaml = await readFile(salida, "utf8");
    expect(yaml).toContain('source: "public-page"');
    expect(yaml).toContain("- login: \"alantonche\"");
    await rm(dir, { recursive: true });
  });

  test("con token que sirve usa la GraphQL", async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          data: {
            organization: {
              sponsorshipsAsMaintainer: {
                nodes: [
                  {
                    createdAt: "2026-01-15T10:00:00Z",
                    privacyLevel: "PUBLIC",
                    tier: { name: "backer" },
                    sponsorEntity: {
                      __typename: "User",
                      login: "alantonche",
                      name: "Alán Tonche",
                      avatarUrl: "https://avatars.githubusercontent.com/u/72902088?s=60&v=4",
                      url: "https://github.com/alantonche",
                    },
                  },
                ],
              },
            },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    const { dir, salida } = await mainEnTemp({ GH_TOKEN: "un-token" });
    const yaml = await readFile(salida, "utf8");
    expect(yaml).toContain('source: "graphql"');
    expect(yaml).toContain('since: "2026-01-15"');
    await rm(dir, { recursive: true });
  });

  test("con token que no sirve, baja a la página pública", async () => {
    // Un PAT que no es de sponsors (o sin `read:org`) hace fallar la GraphQL:
    // el muro no puede quedarse con la lista vieja si la página pública sirve.
    const llamadas: string[] = [];
    globalThis.fetch = async (url: string | URL | Request) => {
      const link = String(url);
      llamadas.push(link);
      if (link === "https://api.github.com/graphql") {
        return new Response("no", { status: 401 });
      }
      return new Response(PAGINA, { status: 200 });
    };
    const { dir, salida } = await mainEnTemp({ GH_TOKEN: "token-que-no-sirve" });
    expect(llamadas).toEqual([
      "https://api.github.com/graphql",
      "https://github.com/sponsors/Vasak-OS",
    ]);
    const yaml = await readFile(salida, "utf8");
    expect(yaml).toContain('source: "public-page"');
    expect(yaml).toContain("- login: \"alantonche\"");
    await rm(dir, { recursive: true });
  });

  test("si las dos vías fallan, deja el archivo anterior y no rompe", async () => {
    globalThis.fetch = async () => new Response("no", { status: 503 });
    // Un respaldo previo es lo único que queda para compilar sin red.
    const dir = await mkdtemp(join(tmpdir(), "sponsors-test-"));
    const salida = join(dir, "sponsors.yml");
    await writeFile(
      salida,
      serialize([{ login: "alantonche", avatar: "https://x/u.png?s=144", url: "https://github.com/alantonche" }], "public-page", "2026-10-01T00:00:00.000Z"),
    );
    await mainEnTemp({});
    // La única diferencia con lo anterior es la hora de `updated`: sinFecha lo
    // ve igual y no vuelve a escribir.
    const ahora = await readFile(salida, "utf8");
    expect(ahora).toContain('updated: "2026-10-01T00:00:00.000Z"');
    await rm(dir, { recursive: true });
  });

  test("sin novedades no vuelve a escribir el archivo", async () => {
    globalThis.fetch = async () => new Response(PAGINA, { status: 200 });
    const dir = await mkdtemp(join(tmpdir(), "sponsors-test-"));
    const salida = join(dir, "sponsors.yml");
    // La primera corrida escribe el respaldo; la segunda, con el mismo
    // contenido, no tiene que tocarlo: la comparación ignora la hora.
    await main(salida);
    const primera = await readFile(salida, "utf8");
    await main(salida);
    const segunda = await readFile(salida, "utf8");
    expect(segunda).toBe(primera);
    await rm(dir, { recursive: true });
  });
});