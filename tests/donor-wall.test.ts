/*
  El muro de donadores de /donate/ y las últimas donaciones.

  El muro se arma solo en cada deploy: `scripts/fetch-sponsors.mjs` lee a
  GitHub —la API GraphQL con token, o la página pública sin él— y escribe
  `data/sponsors.yml`. El feed de últimas donaciones es la lista completa:
  el registro curado de `data/donations.yml` —el monto es privado para
  GitHub, así que la cifra se publica a mano— más cada donador de
  `data/sponsors.yml`, que es una donación. El estado vacío queda sólo para
  cuando no hay ni curadas ni donadores.

  Las tres cosas que se pueden romper en silencio, y por eso estas pruebas:

  · El parser de la página pública puede dejar de recortar el bloque
    `id="sponsors"` y entonces los enlaces del maintainer y del equipo —que
    también llevan avatar— entran al muro como si donaran. La página real
    sirve ese HTML en el primer `GET` y cambia de estructura sin aviso.

  · `serialize` escribe el YAML que Hugo lee como datos. Una comilla suelta,
    una clave que se llama distinto o un `sponsors:` que no sigue la forma
    `[]`/lista es un build que no levanta en el deploy pero que sí levanta
    acá, donde nadie mira `data/`.

  · `data/sponsors.yml` commiteado es el respaldo que compila sin red: si el
    deploy no pudo consultar a GitHub, esto es lo único que ve el build.

  Y sobre el HTML compilado (cuando `public/` existe, con el mismo
  `skipIf` que `design-system`): que la página de donaciones verdaderamente
  muestre el muro y las últimas donaciones, porque un parcial que nadie llama
  no se nota leyendo archivos. El feed es el listado completo —el registro
  curado de `data/donations.yml` más cada donador de `data/sponsors.yml`, que
  es una donación—: con donadores commiteados, lo que se ve es la donación
  enlazada y no el estado vacío.
*/
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { parseSponsorsPage, serialize } from "../scripts/fetch-sponsors.mjs";

const PAGINA = readFileSync("tests/fixtures/sponsors-page.html", "utf8");

describe("parseSponsorsPage extrae sólo los donadores públicos", () => {
  test("no cuenta al maintainer ni al equipo: sólo los enlaces dentro de #sponsors", () => {
    /*
      La página real enlaza usuarios también afuera del bloque de donadores —el
      maintainer en el encabezado, los miembros del equipo en su columna— y esos
      enlaces llevan avatar con el mismo `alt="@login"` que un donador. Sin el
      recorte, el muro se llena con gente que no dona. El fixture los pone uno
      antes y uno después del bloque a propósito.
    */
    const donadores = parseSponsorsPage(PAGINA);
    expect(donadores.map((d) => d.login)).toEqual(["alantonche", "some-org"]);
    // Y cada uno salió de un enlace cuyo `alt` dice su login: el parser sólo
    // cuenta cuando href y alt coinciden. El fixture trae además un enlace
    // interno cuyo href (`/definitely-a-user`) no coincide con el alt de su
    // imagen (`@an-org`); tiene que quedar afuera como los de afuera.
    expect(PAGINA).toContain('href="/definitely-a-user"');
    expect(PAGINA).toContain('alt="@an-org"');
    expect(donadores.map((d) => d.login)).not.toContain("definitely-a-user");
    for (const donador of donadores) {
      expect(PAGINA).toContain(`href="/${donador.login}"`);
      expect(PAGINA).toContain(`alt="@${donador.login}"`);
    }
  });

  test("el avatar llega con el & desescapado y el tamaño reescrito a s=144", () => {
    // GitHub emite el `src` con `&amp;` y pide 60 px; el muro los pinta a 48 y
    // en pantallas HiDPI un `s=60` se ve blando. Un avatar que conservara
    // `&amp;` rompería la URL en la grilla y uno que no pidiera 144 se vería
    // pixelado.
    for (const donador of parseSponsorsPage(PAGINA)) {
      expect(donador.avatar).toContain("&");
      expect(donador.avatar).not.toContain("&amp;");
      expect(donador.avatar).toContain("s=144");
    }
  });

  test("la url de cada donador es su perfil de GitHub", () => {
    for (const donador of parseSponsorsPage(PAGINA)) {
      expect(donador.url).toBe(`https://github.com/${donador.login}`);
    }
  });

  test("sin el bloque id=\"sponsors\" devuelve la lista vacía, sin romper", () => {
    // GitHub puede cambiar la estructura o servir una página sin donadores; el
    // script no tiene que reventar el build por eso.
    expect(parseSponsorsPage("<html><body>nada de patrocinios</body></html>")).toEqual([]);
  });
});

describe("serialize produce un data/sponsors.yml válido", () => {
  test("una lista vacía escribe `sponsors: []` y las cabeceras entre comillas", () => {
    const yaml = serialize([], "public-page", "2026-10-13T12:00:00.000Z");
    expect(yaml).toContain('updated: "2026-10-13T12:00:00.000Z"');
    expect(yaml).toContain('source: "public-page"');
    expect(yaml).toContain("sponsors:\n  []");
    // Una lista vacía no puede dejar una entrada colgada.
    expect(yaml).not.toMatch(/^\s+- login:/m);
  });

  test("una lista con donadores escribe cada uno con sus claves", () => {
    const yaml = serialize(
      [
        {
          login: "alantonche",
          name: "Alán Tonche",
          avatar: "https://avatars.githubusercontent.com/u/72902088?s=144&v=4",
          url: "https://github.com/alantonche",
          since: "2026-01-01",
          tier: "backer",
        },
        {
          login: "some-org",
          avatar: "https://avatars.githubusercontent.com/u/4821567?s=144&v=4",
          url: "https://github.com/some-org",
        },
      ],
      "graphql",
      "2026-10-13T12:00:00.000Z",
    );
    // Cada clave de la ficha completa está presente, y en la forma `clave: "valor"`.
    for (const clave of ["login", "name", "avatar", "url", "since", "tier"]) {
      expect(yaml).toContain(`${clave}: "`);
    }
    // La lista arranca debajo de `sponsors:` con el guión de cada entrada.
    expect(yaml).toContain("sponsors:\n  - login: \"alantonche\"");
    expect(yaml).toMatch(/\n  - login: "alantonche"/);
    expect(yaml).toMatch(/\n  - login: "some-org"/);
  });

  test("los opcionales ausentes no se escriben", () => {
    // Sin name, since ni tier, la entrada tiene que quedar en tres claves; una
    // clave vacía de más convence a Hugo de que hay un dato que mostrar.
    const yaml = serialize(
      [
        {
          login: "some-org",
          avatar: "https://avatars.githubusercontent.com/u/4821567?s=144&v=4",
          url: "https://github.com/some-org",
        },
      ],
      "public-page",
      "2026-10-13T12:00:00.000Z",
    );
    for (const clave of ["name:", "since:", "tier:"]) expect(yaml).not.toContain(clave);
  });

  test("todo valor va entre comillas dobles pareadas en su línea", () => {
    // Cualquier valor del YAML puede llegar a romper el parseo si una comilla
    // se desempareja con otra — y el build no avisa cuál era. Cada línea de
    // datos tiene que ser `clave: "valor"` con exactamente ese par.
    const yaml = serialize(
      [
        {
          login: "alantonche",
          name: "Alán Tonche",
          avatar: "https://avatars.githubusercontent.com/u/72902088?s=144&v=4",
          url: "https://github.com/alantonche",
          since: "2026-01-01",
          tier: "backer",
        },
      ],
      "graphql",
      "2026-10-13T12:00:00.000Z",
    );
    for (const linea of yaml.split("\n")) {
      const recorte = linea.trim();
      // Las líneas de comentario y la estructura (`sponsors:` y su `[]`) no
      // son pares clave:valor y no llevan comillas.
      if (recorte === "" || recorte.startsWith("#") || recorte === "[]" || recorte === "sponsors:") continue;
      const comillas = (linea.match(/"/g) ?? []).length;
      expect({ linea, comillas }).toEqual({ linea, comillas: 2 });
    }
  });
});

describe("data/sponsors.yml, el respaldo commiteado que compila sin red", () => {
  const RUTA = "data/sponsors.yml";
  const texto = readFileSync(RUTA, "utf8");

  test("existe y no está vacío", () => {
    // El respaldo es lo que compila cuando el deploy no pudo consultar GitHub;
    // sin archivo, Hugo carga un `data.sponsors` vacío y el muro desaparece.
    expect(existsSync(RUTA)).toBe(true);
    expect(texto.trim().length).toBeGreaterThan(0);
    expect(texto).toContain("sponsors:");
  });

  test("cada donador trae login, avatar https:// y url de perfil", () => {
    // La grilla de /donate/ lee login, avatar y url; un archivo editado a manos
    // se queda sin uno de los tres y el build no se queja.
    const entradas: Array<Record<string, string>> = [];
    let actual: Record<string, string> | null = null;
    for (const linea of texto.split("\n")) {
      const login = linea.match(/^  - login: "([^"]+)"/);
      if (login) {
        actual = { login: login[1] };
        entradas.push(actual);
        continue;
      }
      const campo = linea.match(/^    (\w+): "([^"]*)"/);
      if (campo && actual) actual[campo[1]] = campo[2];
    }
    expect(entradas.length).toBeGreaterThan(0);
    for (const entrada of entradas) {
      expect(entrada.login.length).toBeGreaterThan(0);
      expect(entrada.avatar ?? "").toMatch(/^https:\/\//);
      expect(entrada.url ?? "").toMatch(/^https:\/\/github\.com\//);
      expect(entrada.url).toEndWith(`/${entrada.login}`);
    }
  });
});

// Lee `public/`, así que en CI se saltea donde no hay build: `app / revisar`
// (workflow de la organización, sin Hugo) la saltea y el `sitio` de este
// repositorio, que compila, la corre. Igual que `design-system`.
test.skipIf(process.env.CI && !existsSync("public"))(
  "el /donate/ compilado muestra el muro de donadores",
  () => {
    /*
      Un parcial que nadie llama —o una data que no llega a la plantilla— deja
      la página sin el muro y el build sigue en verde. Se comprueba sobre el
      HTML que Hugo generó, que es lo que el navegador recibe.
    */
    const html = readFileSync("public/donate/index.html", "utf8");
    // La grilla del muro, con el donador commiteado en data/sponsors.yml.
    expect(html).toContain('class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4');
    expect(html).toContain("alantonche");
    expect(html).toContain("https://github.com/alantonche");
  },
);

test.skipIf(process.env.CI && !existsSync("public/donate/index.html"))(
  "el /donate/ en inglés lista a cada donador como una donación",
  () => {
    /*
      El feed ya no es el registro curado que arranca vacío: es la lista
      completa, y un patrocinio de GitHub Sponsors es una donación. Con
      `alantonche` en data/sponsors.yml, lo que tiene que verse es su donación
      —el nombre enlazado a su perfil, como en el muro— y no el estado vacío,
      aunque el registro curado esté vacío.
    */
    const html = readFileSync("public/en/donate/index.html", "utf8");
    expect(html).toContain("Latest donations");
    // El nombre como enlace a su perfil: `>alantonche</a>` rompe el caso del
    // muro, donde el nombre termina en `</span></a>`.
    expect(html).toContain('href="https://github.com/alantonche"');
    expect(html).toContain(">alantonche</a>");
    expect(html).not.toContain("No donations yet");
  },
);

test.skipIf(process.env.CI && !existsSync("public/donate/index.html"))(
  "el /donate/ compilado lista a cada donador como una donación, sin estado vacío",
  () => {
    /*
      Igual que arriba en español: «Últimas donaciones» tiene que listar la
      donación de alantonche (el nombre es el enlace a su perfil) y el estado
      vacío no puede aparecer mientras haya un donador que mostrar.
    */
    const html = readFileSync("public/donate/index.html", "utf8");
    expect(html).toContain("Últimas donaciones");
    expect(html).toContain('href="https://github.com/alantonche"');
    expect(html).toContain(">alantonche</a>");
    expect(html).not.toContain("Todavía no hay donaciones");
  },
);