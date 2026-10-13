// Las páginas de `content/docs/devs/tauri-plugins/` describen plugins que viven
// en otros once repositorios: el sitio no compila nada de ellos y nada avisa
// cuando su API cambia. Un comando que se renombra, una sección que se cae al
// reescribir una página o un idioma que se queda atrás no rompen el build: la
// página sigue publicada, ofreciendo algo que ya no existe.
//
// Acá se ata lo que el sitio promete, contra una lista fijada a mano desde la
// fuente —igual que `removed-commands.test.ts` ata los comandos que salieron de
// vasak-desktop—: los comandos que cada plugin registra en su
// `tauri::generate_handler![...]` y define en `src/commands.rs`. La lista no se
// lee de los repos de los plugins a propósito: este test corre en CI sólo con
// este repo, y su trabajo es avisar cuando la documentación se degrada, no
// generar documentación.
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

/** Los once plugins documentados, en el orden de la fuente. */
const PLUGINS = [
  "bluetooth-manager",
  "config-manager",
  "display-manager",
  "drag-and-drop-wayland",
  "i18n",
  "network-manager",
  "power-profiles",
  "user-data",
  "vicons",
  "vsk-contextual-menu",
  "vsk-journal",
] as const;

/**
 * Los comandos que cada plugin registra, con el archivo de donde salen.
 *
 * Son los de `tauri::generate_handler![...]` en el `src/lib.rs` del plugin, que
 * es la lista que de verdad existe en tiempo de ejecución: un `#[command]`
 * definido en `commands.rs` y no registrado no se puede invocar.
 */
const COMANDOS: Record<string, string[]> = {
  // tauri-plugin-bluetooth-manager/src/lib.rs:37
  "bluetooth-manager": [
    "list_adapters",
    "set_adapter_powered",
    "get_adapter_state",
    "start_scan",
    "stop_scan",
    "list_devices",
    "list_paired_devices",
    "get_device_info",
    "connect_device",
    "disconnect_device",
    "bluetooth_plugin_status",
  ],
  // tauri-plugin-config-manager/src/lib.rs:238
  "config-manager": [
    "read_config",
    "write_config",
    "set_darkmode",
    "get_schemes",
    "get_scheme_by_id",
    "save_user_scheme",
  ],
  // tauri-plugin-display-manager/src/lib.rs:77
  "display-manager": [
    "get_brightness",
    "set_brightness",
    "refresh_brightness",
    "get_night_light",
    "set_night_light",
  ],
  // tauri-plugin-drag-and-drop-wayland/src/lib.rs:16
  "drag-and-drop-wayland": ["start_drag"],
  // tauri-plugin-i18n/src/lib.rs:29
  i18n: [
    "load_translations",
    "translate",
    "set_locale",
    "get_locale",
    "get_available_locales",
  ],
  // tauri-plugin-network-manager/src/lib.rs:425
  "network-manager": [
    "get_network_state",
    "list_wifi_networks",
    "connect_to_wifi",
    "disconnect_from_wifi",
    "get_saved_wifi_networks",
    "rescan_wifi",
    "delete_wifi_connection",
    "toggle_network_state",
    "get_wireless_enabled",
    "set_wireless_enabled",
    "is_wireless_available",
    "get_network_stats",
    "get_network_interfaces",
    "list_vpn_profiles",
    "get_vpn_status",
    "connect_vpn",
    "disconnect_vpn",
    "create_vpn_profile",
    "update_vpn_profile",
    "delete_vpn_profile",
  ],
  // tauri-plugin-power-profiles/src/lib.rs:51
  "power-profiles": ["get_power_state", "set_power_profile"],
  // tauri-plugin-user-data/src/lib.rs:36
  "user-data": ["get_user_info"],
  // tauri-plugin-vicons/src/lib.rs:30
  vicons: ["get_icon", "get_symbol", "has_icon", "has_symbol"],
  // tauri-plugin-vsk-contextual-menu/src/lib.rs:59
  "vsk-contextual-menu": [
    "open_menu_window",
    "close_menu_window",
    "take_pending_menu",
    "show_menu_window",
    "resolve_menu",
  ],
  // tauri-plugin-vsk-journal/src/lib.rs:154
  "vsk-journal": ["registrar", "identificador"],
};

/** Los dos idiomas del sitio, con los títulos que usa cada uno. */
const IDIOMAS = [
  {
    sufijo: "",
    indice: "content/docs/devs/tauri-plugins/_index.md",
    ruta: (slug: string) => `/docs/devs/tauri-plugins/${slug}/`,
    secciones: [
      "## Instalación",
      "## Permisos",
      "## API de JavaScript",
      "## Comandos Rust",
    ],
  },
  {
    sufijo: ".en",
    indice: "content/docs/devs/tauri-plugins/_index.en.md",
    ruta: (slug: string) => `/en/docs/devs/tauri-plugins/${slug}/`,
    secciones: [
      "## Installation",
      "## Permissions",
      "## JavaScript API",
      "## Rust commands",
    ],
  },
];

function rutaDe(slug: string, sufijo: string): string {
  return `content/docs/devs/tauri-plugins/${slug}${sufijo}.md`;
}

/** El front matter, o `""` si la página no lo trae. */
function frontMatter(texto: string): string {
  if (!texto.startsWith("---\n")) return "";
  const fin = texto.indexOf("\n---", 4);
  return fin === -1 ? "" : texto.slice(4, fin);
}

/**
 * El cuerpo de una sección de segundo nivel, sin el título.
 *
 * Se corta en el próximo `## ` para que un comando mencionado sólo en otra
 * sección —una tabla de eventos, un ejemplo— no cuente como documentado en el
 * catálogo: es el catálogo lo que la interfaz consulta.
 */
function seccion(texto: string, titulo: string): string | null {
  const lineas = texto.split("\n");
  const inicio = lineas.indexOf(titulo);
  if (inicio === -1) return null;
  const resto = lineas.slice(inicio + 1);
  const fin = resto.findIndex((linea) => linea.startsWith("## "));
  return (fin === -1 ? resto : resto.slice(0, fin)).join("\n");
}

describe("las páginas de los plugins de Tauri", () => {
  test("cada plugin tiene su página en los dos idiomas", () => {
    // Una página sin su par queda publicada en un idioma y en el otro no: el
    // índice lleva a un 404, o a la versión del otro idioma.
    const faltantes: string[] = [];
    for (const slug of PLUGINS) {
      for (const idioma of IDIOMAS) {
        const ruta = rutaDe(slug, idioma.sufijo);
        if (!existsSync(ruta)) faltantes.push(ruta);
      }
    }
    expect(faltantes).toEqual([]);
  });

  test("cada página declara title, description y weight", () => {
    // Sin `weight` el orden de las páginas queda a merced del alfabeto, y sin
    // `description` el buscador inventa el resumen con el primer párrafo.
    const sinFrontMatter: string[] = [];
    for (const slug of PLUGINS) {
      for (const idioma of IDIOMAS) {
        const ruta = rutaDe(slug, idioma.sufijo);
        if (!existsSync(ruta)) continue;
        const front = frontMatter(readFileSync(ruta, "utf8"));
        for (const clave of ["title", "description", "weight"]) {
          if (!new RegExp(`^${clave}:\\s*\\S`, "m").test(front)) {
            sinFrontMatter.push(`${ruta} (falta \`${clave}\`)`);
          }
        }
      }
    }
    expect(sinFrontMatter).toEqual([]);
  });

  test("cada página trae las cuatro secciones, en el idioma que le toca", () => {
    const faltantes: string[] = [];
    for (const slug of PLUGINS) {
      for (const idioma of IDIOMAS) {
        const ruta = rutaDe(slug, idioma.sufijo);
        if (!existsSync(ruta)) continue;
        const texto = readFileSync(ruta, "utf8");
        for (const titulo of idioma.secciones) {
          if (!texto.split("\n").includes(titulo)) {
            faltantes.push(`${ruta} (falta \`${titulo}\`)`);
          }
        }
      }
    }
    expect(faltantes).toEqual([]);
  });

  test("el catálogo de comandos Rust nombra cada comando del plugin", () => {
    // Es la prueba que importa: si alguien reescribe la página y se come un
    // comando, la sección queda más corta y nadie lo nota hasta que alguien lo
    // copia y recibe un «command not found» en tiempo de ejecución.
    const faltantes: string[] = [];
    for (const slug of PLUGINS) {
      for (const idioma of IDIOMAS) {
        const ruta = rutaDe(slug, idioma.sufijo);
        if (!existsSync(ruta)) continue;
        const cuerpo = seccion(
          readFileSync(ruta, "utf8"),
          idioma.secciones[3],
        );
        if (cuerpo === null) {
          faltantes.push(`${ruta} (sin sección \`${idioma.secciones[3]}\`)`);
          continue;
        }
        for (const comando of COMANDOS[slug]) {
          // En el catálogo cada comando va como `` `nombre(...)` ``.
          if (!cuerpo.includes(`\`${comando}(`)) {
            faltantes.push(`${ruta} (falta \`${comando}\`)`);
          }
        }
      }
    }
    expect(faltantes).toEqual([]);
  });

  test("el índice enlaza las once páginas en los dos idiomas", () => {
    // El índice es la puerta de entrada: una página que no está enlazada existe
    // y no se encuentra.
    const faltantes: string[] = [];
    for (const idioma of IDIOMAS) {
      const texto = readFileSync(idioma.indice, "utf8");
      for (const slug of PLUGINS) {
        if (!texto.includes(`](${idioma.ruta(slug)})`)) {
          faltantes.push(`${idioma.indice} (sin enlace a \`${slug}\`)`);
        }
      }
    }
    expect(faltantes).toEqual([]);
  });
});
