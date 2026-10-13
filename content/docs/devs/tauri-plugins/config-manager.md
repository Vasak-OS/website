---
title: "config-manager"
description: "Lee y escribe `vasak.conf` en tiempo real, expone el store de Pinia y deriva los colores del esquema desde el fondo de pantalla."
weight: 1
---

# `tauri-plugin-config-manager`

Lee y escribe la configuración de VasakOS (`vasak.conf`) y avisa a todas las
aplicaciones abiertas cuando cambia. Trae además el store de Pinia que la
aplica, las utilidades de color y contraste, y desde la 2.10.0 el cálculo del
esquema de color a partir del fondo de pantalla.

- **Crate:** `tauri-plugin-config-manager`
- **Paquete JS:** `@vasakgroup/plugin-config-manager`
- **Plataforma:** Linux (la sincronización con GTK y `gsettings` usa la feature
  `system-theme-sync`, activada por omisión)

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-config-manager = "2"
```

```bash
bun add @vasakgroup/plugin-config-manager
```

`vue`, `pinia` y `@tauri-apps/api` son dependencias **pares**: las pone la
aplicación, no este paquete. No es un detalle de empaquetado — el store que
exporta `useConfigStore` vive en la `pinia` de la aplicación, y si el plugin
trajera la suya quedarían dos copias de `pinia`, o sea dos tiendas activas, y la
aplicación arrancaría con «getActivePinia() was called but there was no active
Pinia».

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_config_manager::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["config-manager:default"]
}
```

La aplicación que además **guarde** esquemas suma `config-manager:allow-save-user-scheme`,
que no viene en el conjunto por omisión (ver «Permisos»).

## Permisos

`config-manager:default` habilita las cinco operaciones de lectura y escritura
cotidianas:

- `allow-read-config`
- `allow-write-config`
- `allow-set-darkmode`
- `allow-get-schemes`
- `allow-get-scheme-by-id`

Cada una tiene su `deny-` correspondiente, y ninguna se puede combinar con otra
para ampliar el alcance.

`allow-save-user-scheme` **existe pero no está en el conjunto por omisión**:
escribir esquemas no es algo que toda aplicación deba poder hacer, así que la
que lo necesite lo declara en su capability:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["config-manager:default", "config-manager:allow-save-user-scheme"]
}
```

## API de JavaScript

### Configuración

#### `readConfig(): Promise<VSKConfig | null>`

Devuelve la configuración ya normalizada: las claves que faltan en el archivo
llegan con su valor de fábrica, y las que el modelo no conoce —los widgets del
escritorio, por ejemplo— viajan tal como estaban. Si el archivo no existe, el
plugin lo crea con los valores de fábrica. Devuelve `null` si el texto no se
puede leer como JSON.

#### `writeConfig(value: VSKConfig): Promise<void>`

Valida el objeto en Rust, lo persiste de forma atómica y avisa a las demás
aplicaciones. También deja los iconos y las fuentes elegidas donde los leen GTK
y `gsettings`.

#### `setDarkMode(darkmode: boolean): Promise<void>`

Cambia el modo oscuro en el archivo, sincroniza el tema del sistema y aplica el
paquete de iconos del modo nuevo.

### Store

#### `useConfigStore(): Store<"config">`

Devuelve el store de Pinia `useConfigStore`, que expone:

- `config: Ref<VSKConfig | null>` — la configuración cargada.
- `loadConfig(): Promise<void>` — la lee, pone o quita la clase `dark` en
  `:root`, escribe todas las variables CSS del esquema, aplica las tres fuentes
  y habilita el fundido entre esquemas.

El store se define una sola vez, así que todas las llamadas devuelven la misma
tienda.

#### `enableSchemeTransition(root?): void`

Agrega la clase `scheme-transition` a `:root` para que vue-libvasak anime el
cambio de esquema. Lo hace dos cuadros después de la primera aplicación, no en
el acto: con la clase y los colores nuevos en el mismo cálculo de estilos, el
navegador anima desde los colores de fábrica y abrir una ventana se ve como un
parpadeo. La constante de la clase se exporta como `SCHEME_TRANSITION_CLASS`.

#### `pilaDeFuente(nombre, rol): string`

Arma la pila de `font-family` para un rol (`"apps"`, `"title"` o `"terminal"`),
siempre terminada en su familia genérica. Sanea el nombre —sale de `vasak.conf`,
que se edita a mano— y nunca devuelve una cadena vacía, porque `setProperty` con
un valor vacío borra la propiedad. `primeraUtil(...candidatos)` devuelve el
primero que queda en algo después de sanear.

#### `windowBorderProperties(border): WindowBorderProperties`

Traduce `style.border` a las dos variables del borde de afuera:
`--window-border-width` y `--ui-window-border`. Lo desconocido cae en el borde de
siempre: fino y del color del esquema. El tipo `WindowBorder` tiene
`width` (`"normal"`, `"thick"` o `"heavy"`) y `color` (`"scheme"` o `"accent"`).

### Esquemas

#### `getSchemes(): Promise<Scheme[]>`

Todos los esquemas que encuentra en las rutas efectivas, cada uno con su `path`
y su `scheme`.

#### `getSchemeById(schemeId: string): Promise<Scheme | null>`

El esquema con ese `id`. Si hay más de uno —uno del sistema y otro del usuario—
gana el del directorio del usuario, que va primero.

#### `saveUserScheme(scheme: SchemeData): Promise<Scheme>`

Guarda el esquema como `<id>.json` en el directorio de esquemas del usuario.
Necesita el permiso `config-manager:allow-save-user-scheme`, que no viene en el
conjunto por omisión. El `id` tiene que cumplir `^[a-z0-9][a-z0-9-]{0,63}$`,
porque es también el nombre del archivo: cualquier otra cosa se rechaza. Nunca
escribe en `/usr`. No emite `config-changed` por su cuenta; lo emite el vigilante
de cada aplicación al ver el archivo.

#### `applyColorPatch(scheme, variant, patch): T`

Aplica un cambio parcial de colores (`SchemeColorPatch`) sobre la variante
(`"dark"` o `"light"`) y devuelve un esquema nuevo, sin tocar el recibido. Lo
que no sea un color válido se descarta, para que un campo a medio escribir no
llegue al archivo y deje a todo el escritorio sin un color. `cloneScheme` e
`isHexColor` son las dos piezas sueltas de la misma regla, y `SCHEME_VARIANTS`
son las dos variantes en el orden en que las muestra el editor.

### Color y contraste

Todas las funciones son puras y trabajan en sRGB u OKLCH. `hexToRgb`, `rgbToHex`,
`rgbToOklab`, `oklabToRgb`, `oklabToOklch`, `oklchToOklab`, `hexToOklch`,
`oklchToHex` y `hueDistance` son las conversiones entre espacios.
`oklchToHex` mete el color en la gama de sRGB bajando el croma, y no recortando
canal por canal, para no cambiarle el tono.

- `luminance(hex): number | null` — la luminosidad relativa de WCAG.
- `contrastRatio(a, b): number` — el contraste entre dos colores; con un color
  ilegible devuelve 0, el peor caso.
- `bestOn(background, candidatos, minimo): string | null` — el color de mayor
  contraste de la lista, o `null` si ninguno llega.
- `textOn(background, preferred, palette): string` — el color de texto para un
  fondo de marca: respeta el del esquema si cumple, y si no busca en la propia
  paleta antes de caer a negro o blanco.
- `strongBorderOn(palette): string | null` — un borde que llegue a 3:1 contra el
  fondo **y** contra la superficie.
- `focusOn(palette): string | null` — el anillo de foco: parte del primario y lo
  acerca al texto principal hasta que se ve contra los dos fondos.
- `mixHex(from, to, amount): string | null` — la mezcla en sRGB, la misma cuenta
  que `color-mix(in srgb, …)`.

Los mínimos son `MIN_TEXT_CONTRAST` (4.5, texto) y `MIN_NON_TEXT_CONTRAST` (3,
lo que delimita un control). Los nombres anteriores —`textoSobre`, `contraste`,
`luminancia`, `mejorSobre`, `bordeFuerteSobre`, `MINIMO_TEXTO`, `MINIMO_NO_TEXTO`—
siguen exportados como alias.

### Del fondo de pantalla al esquema

#### `extractPalette(pixels, size?): PaletteColor[]`

La paleta de un fondo a partir de sus píxeles RGB crudos: unos pocos colores con
su peso y de qué parte de la imagen salió cada uno. Agrupa en cubetas de 4 bits,
hace k-medias en OKLab y siembra de forma determinista, así que el mismo fondo da
siempre la misma paleta. Como mucho `PALETTE_SIZE` colores (6).

#### `pickAccents(palette, fallbackPrimary): Accents`

El acento y el secundario a partir de la paleta, sumando los tonos parecidos para
que un degradé no compita partido. Con un fondo sin croma conserva el tono del
primario del esquema y lo marca con `fallback: true`.

#### `ensureContrast(color, against, minimo): string`

Mueve la luminosidad del color —en OKLCH, sin cambiarle el tono— hasta que llegue
al mínimo contra **todos** los fondos de `against`, cambiando lo menos posible.

#### `generateVariantUi(current, variant, accents, pinned?): UiDraft`

Los colores de `ui` de una variante a partir de los acentos, respetando los
colores fijados a mano y garantizando el contraste. `draftToPatch` lo convierte en
un `SchemeColorPatch` sin los fijados, y `buildWallpaperPatches(scheme, palette,
pinned?)` devuelve los cambios de las dos variantes, o `null` si la paleta está
vacía.

#### `readWallpaperState(scheme): WallpaperColorsState`

El estado del modo automático guardado en el esquema, con valores sanos aunque el
archivo se haya editado a mano. Vive en la clave `WALLPAPER_STATE_KEY`
(`"wallpaper-colors"`) y tiene `follow`, `source` y `pinned`.
`withWallpaperState` lo reemplaza sin tocar el esquema recibido, y
`uiPathsOf`, `readUiColor`, `omitPaths` y `UI_COLOR_PATHS` trabajan con los
colores nombrados por su camino dentro de la variante.

### Seguir al fondo

#### `followWallpaper(deps): Promise<FollowOutcome>`

Si el esquema «Personalizado» está en uso, tiene «Seguir al fondo» prendido y el
fondo de `vasak.conf` es otro que el de la última vez, saca los colores del fondo
y guarda el esquema. Se puede llamar en cada `config-changed`: el guardado anota
el fondo de origen, así que el `config-changed` que provoca el propio guardado
vuelve `unchanged` y no hay bucle. Devuelve qué pasó, y sólo `"applied"` escribió
algo.

#### `applyWallpaperColors(scheme, palette, source): WallpaperColorsResult<T> | null`

El esquema con los colores sacados de la paleta, sin los fijados a mano, y con el
fondo de origen anotado. Es lo que usa Configuración para «Volver a sacar del
fondo». Devuelve `null` si la paleta está vacía: no se inventan colores.
`CUSTOM_SCHEME_ID` es el `"custom"` del esquema que sigue al fondo.

## Comandos Rust

- `read_config()` — la configuración normalizada, como texto JSON.
- `write_config(payload)` — valida el JSON, lo persiste de forma atómica y emite
  `config-changed`; además aplica el paquete de iconos y las fuentes.
- `set_darkmode(darkmode)` — persiste el modo nuevo, sincroniza el tema del
  sistema, aplica el paquete de iconos del modo y emite `config-changed`.
- `get_schemes()` — todos los esquemas de las rutas efectivas.
- `get_scheme_by_id(scheme_id)` — el esquema con ese `id`, o ninguno.
- `save_user_scheme(scheme)` — escribe `<id>.json` en el directorio del usuario;
  su permiso no está en el conjunto por omisión.

## Eventos

| Evento | Cuándo se emite | Carga |
|---|---|---|
| `config-changed` | Cambió `vasak.conf` o un esquema del usuario | `null` |

```typescript
import { listen } from "@tauri-apps/api/event";
import { useConfigStore } from "@vasakgroup/plugin-config-manager";

const store = useConfigStore();

await listen("config-changed", async () => {
  await store.loadConfig();
});
```

Lo emiten `write_config`, `set_darkmode` y el vigilante de archivos. El vigilante
espera a que termine la ráfaga de eventos —un antirrebote de 250 ms medido por el
final, no por el principio—, así que un editor que guarda mientras se arrastra un
color no deja a las demás aplicaciones con un color intermedio. Un cambio en
`vasak.conf` y en un esquema a la vez sale como **un** evento, no dos. El store no
se suscribe solo: la aplicación escucha y vuelve a llamar a `loadConfig`.

## Ejemplo

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import { useConfigStore } from "@vasakgroup/plugin-config-manager";

const store = useConfigStore();
let unlisten: (() => void) | undefined;

onMounted(async () => {
  await store.loadConfig();
  unlisten = await listen("config-changed", () => store.loadConfig());
});

onUnmounted(() => unlisten?.());
</script>

<template>
  <p v-if="store.config">Radio del sistema: {{ store.config.style.radius }} px</p>
</template>
```

## Detalles de implementación

- **Caché de 30 minutos** para la configuración y para la lista de esquemas. Se
  invalida al escribir y cuando el vigilante ve un cambio. La lista de esquemas
  lleva además un contador de generación: si alguien guarda un esquema mientras
  una lectura está en curso, esa lectura no guarda su resultado viejo en un caché
  recién vaciado.
- **Escritura atómica**: el contenido va a un archivo temporal oculto al lado del
  destino, se sincroniza y se renombra. Un apagón en el medio deja el archivo
  viejo o el nuevo, nunca uno a medias. Lo usan `vasak.conf` y los esquemas.
- **Configuración ilegible**: si el contenido no parsea o tiene tipos que no
  corresponden, se aparta a `vasak.conf.roto` —no se borra: puede tener el fondo,
  los widgets y las fuentes elegidas— y se repone uno de fábrica. Un archivo
  cortado por un apagón se recupera solo en el arranque siguiente.
- **Normalización**: `read_config` no devuelve el archivo tal cual, sino el modelo
  reserializado, así que las claves ausentes llegan con su valor de fábrica. Los
  campos que el modelo no conoce —`desktop.widgets`, `panel`, cualquier sección
  nueva— sobreviven a la ida y vuelta por `#[serde(flatten)]`: sin eso, la primera
  lectura y el `writeConfig` siguiente los borraban.
- **Vigilante**: `notify` en modo no recursivo sobre el directorio de la
  configuración y el de esquemas del usuario. Ignora los temporales ocultos. En
  los esquemas cuenta también **borrar** —quien lo tenía aplicado tiene que
  enterarse y caer al de por omisión—; en `vasak.conf`, no: releer un archivo que
  no está lo recrearía a mitad de un reemplazo hecho a mano.
- **ID de esquema**: `^[a-z0-9][a-z0-9-]{0,63}$`, validado carácter por carácter
  en ASCII. Como el `id` es el nombre del archivo, es lo que impide que un id como
  `../../.bashrc` saque la escritura del directorio.
- **Directorios**: el de esquemas del usuario es el primero de
  `VASAK_SCHEMES_PATHS`, o `~/.config/vasak/schemes` sin la variable, y nunca uno
  dentro de `/usr`. La configuración sale de `VASAK_CONFIG_PATH` o, sin la
  variable, de `~/.config/vasak/vasak.conf`. Las rutas por omisión para buscar
  esquemas son `~/.config/vasak/schemes` y `/usr/share/schemes`.
- **Sincronización con el sistema** (`system-theme-sync`): escribe el modo y los
  iconos en el `settings.ini` de GTK 3 y GTK 4 —el que se lee al arrancar, y por
  lo tanto el que decide cómo se ve la sesión después de reiniciar— y además en
  `gsettings`. Las fuentes se aplican **después** de que `vasak.conf` quedó
  escrito: si la escritura falla, el guardado falla sin haber cambiado la
  tipografía del sistema. Cada llamada a `gsettings` tiene un tope de dos
  segundos, para que un D-Bus trabado no deje la configuración sin poder guardarse
  nunca más.
