---
title: "display-manager"
description: "El brillo de cada pantalla —retroiluminación de los paneles internos y DDC/CI en los externos— y la configuración de la luz nocturna."
weight: 8
---

# `tauri-plugin-display-manager`

El brillo de cada pantalla por separado y la configuración de la luz nocturna.
Los paneles internos se leen de `/sys/class/backlight` y se escriben por
logind, sin root ni diálogo; los monitores externos se manejan por DDC/CI. Nada
sondea: los avisos llegan por los uevents del kernel.

- **Crate:** `tauri-plugin-display-manager`
- **Paquete JS:** `@vasakgroup/plugin-display-manager`
- **Plataforma:** Linux con sysfs y logind, `ddcutil` para los monitores
  externos y `wlsunset` para la luz nocturna

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-display-manager = "2"
```

```bash
bun add @vasakgroup/plugin-display-manager
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_display_manager::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Una aplicación que vive toda la sesión y muestra el brillo apenas se abre algo
—el escritorio— puede pedir que los monitores externos se busquen al arrancar,
en segundo plano, en vez de en la primera consulta:

```rust
.plugin(tauri_plugin_display_manager::Builder::new().prefetch_ddc(true).build())
```

Las dos herramientas del sistema son opcionales, y cada una tiene su costo:

| Paquete | Para qué | Sin él |
|---|---|---|
| `ddcutil` | Los monitores externos | Se ven «no disponible» y la razón es `not-installed` |
| `wlsunset` | La luz nocturna | La interfaz lo explica, en vez de fallar |
| módulo `i2c-dev` | Los buses `/dev/i2c-*` que usa DDC/CI | La razón es `no-i2c-dev` |

Para escribir por DDC/CI, el usuario tiene que poder abrir los buses i2c (el
grupo `i2c` o la regla de udev de ddcutil); si no puede, la razón es
`no-permission`.

## Permisos

`display-manager:default` habilita las cinco operaciones (`get_brightness`,
`set_brightness`, `refresh_brightness`, `get_night_light`, `set_night_light`):

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["display-manager:default"]
}
```

Cada comando tiene además su `allow-` y su `deny-` sueltos
(`display-manager:allow-set-brightness`, por ejemplo), para una aplicación que
sólo necesite una parte.

## API de JavaScript

### `getBrightness(): Promise<BrightnessReport>`

El brillo de cada pantalla que se puede atenuar. Los paneles internos se leen
en el momento; los monitores externos salen de lo guardado y, si hace falta, se
buscan en segundo plano. **Nunca espera a DDC/CI**: lo que todavía no se conoce
llega después por `onBrightnessChanged`.

### `setBrightness(kind, handle, percent): Promise<void>`

Cambia el brillo de una pantalla. `kind` es `"backlight"` o `"ddc"`, `handle`
es el de esa pantalla en el informe y `percent` va de 0 a 100.

### `refreshBrightness(): Promise<void>`

Vuelve a leer los monitores externos aunque lo guardado esté fresco. El
resultado llega por el evento.

### `onBrightnessChanged(handler): Promise<UnlistenFn>`

Avisa cuando cambia el brillo de cualquier pantalla —también desde una tecla o
otro programa— o cuando cambian los monitores conectados. Devuelve la función
con la que se deja de escuchar.

### `getNightLight(): Promise<NightLight>`

La configuración de la luz nocturna. Si todavía no se guardó nunca, trae los
valores por omisión.

### `setNightLight(config): Promise<NightLight>`

Valida y guarda la configuración. **No enciende ni apaga la luz nocturna**:
eso es de quien usa el plugin. Devuelve la configuración ya validada.

### `BRIGHTNESS_EVENT`

El nombre del evento, `"display-brightness-changed"`, por si hace falta
escucharlo con `listen` de `@tauri-apps/api/event` en vez de usar
`onBrightnessChanged`.

### Las formas de los datos

```ts
type BrightnessKind = "backlight" | "ddc";

interface MonitorBrightness {
  /** El conector DRM (`eDP-1`, `DP-2`), para cruzarlo con la lista de monitores. */
  output: string | null;
  kind: BrightnessKind;
  /** Lo que hay que devolver en `setBrightness`. */
  handle: string;
  percent: number;
}

interface BrightnessReport {
  monitors: MonitorBrightness[];
  ddc: DdcStatus;
}

interface DdcStatus {
  state: "ready" | "detecting" | "unavailable";
  /** Códigos, no frases: el texto lo pone cada aplicación, traducido. */
  reason: "not-installed" | "no-i2c-dev" | "no-permission" | null;
  /** Conectores de monitores externos que no contestan por DDC/CI. */
  unsupported: string[];
}
```

`handle` es lo único que hay que devolver en `setBrightness`: el nombre de la
retroiluminación del panel interno, o el número del bus i2c del monitor
externo, como texto.

```ts
interface NightLightConfig {
  mode: "manual" | "location";
  /** Kelvin de día. */
  dayTemperature: number;
  /** Kelvin de noche; menor que la de día. */
  nightTemperature: number;
  /** `HH:MM` en que empieza el día (modo manual). */
  sunrise: string;
  /** `HH:MM` en que empieza la noche (modo manual). */
  sunset: string;
  latitude: number | null;
  longitude: number | null;
}

interface NightLight {
  /** Falso sin `wlsunset` instalado. */
  available: boolean;
  /** Si ya se guardó alguna vez; si no, `config` son los valores por omisión. */
  configured: boolean;
  config: NightLightConfig;
}
```

## Comandos Rust

- `get_brightness()` — El informe con todas las pantallas. No espera a DDC/CI.
- `set_brightness(kind, handle, percent)` — Escribe el brillo. Por
  retroiluminación va por logind; por DDC/CI, por `ddcutil`.
- `refresh_brightness()` — Vuelve a leer los monitores externos; el resultado
  llega por el evento.
- `get_night_light()` — Lee la configuración guardada de la luz nocturna.
- `set_night_light(config)` — Valida y guarda la configuración. No enciende ni
  apaga el servicio.

Desde Rust, el trait `DisplayManagerExt` da el mismo gestor con
`app.display_manager()`. La configuración de la luz nocturna es un módulo
público (`night_light`) con `wlsunset_args`, para quien tenga que armar el
comando al encender el servicio.

## Eventos

| Evento | Cuándo se emite | Carga |
|---|---|---|
| `display-brightness-changed` | Cambió el brillo de cualquier pantalla (también desde una tecla o desde otro programa), cambió qué pantallas se pueden atenuar, o terminó la búsqueda de monitores externos | `BrightnessReport` |

El evento se emite a todas las ventanas. Es la única forma de enterarse de los
monitores externos que aparecen después de la primera consulta, y de los
cambios que hizo alguien más (los botones del monitor no avisan de otra forma).

## Ejemplo

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  getBrightness,
  onBrightnessChanged,
  setBrightness,
  type MonitorBrightness,
} from "@vasakgroup/plugin-display-manager";
import type { UnlistenFn } from "@tauri-apps/api/event";

const monitors = ref<MonitorBrightness[]>([]);
let stopListening: UnlistenFn | null = null;

onMounted(async () => {
  monitors.value = (await getBrightness()).monitors;

  // Con el evento llegan, además, los externos que todavía no se conocían.
  stopListening = await onBrightnessChanged((report) => {
    monitors.value = report.monitors;
  });
});

onUnmounted(() => stopListening?.());

async function change(monitor: MonitorBrightness, percent: number) {
  await setBrightness(monitor.kind, monitor.handle, percent);
}
</script>

<template>
  <label v-for="monitor in monitors" :key="monitor.handle">
    {{ monitor.output ?? monitor.handle }}
    <input
      type="range"
      min="1"
      max="100"
      :value="monitor.percent"
      @input="change(monitor, Number(($event.target as HTMLInputElement).value))"
    />
  </label>
</template>
```

```ts
import { getNightLight, setNightLight } from "@vasakgroup/plugin-display-manager";

const nightLight = await getNightLight();
if (!nightLight.available) {
  // Sin wlsunset instalado se explica, no se esconde.
}

await setNightLight({
  ...nightLight.config,
  mode: "location",
  latitude: -34.6,
  longitude: -58.4,
});
```

## Detalles de implementación

- **Paneles internos.** Se leen dos archivos de `/sys/class/backlight`
  (`brightness` y `max_brightness`). Cuando hay más de un dispositivo para la
  misma pantalla se elige el que cuelga del conector del panel; si ninguno
  cuelga de uno (`acpi_video0` cuelga de la placa), se elige por tipo, en el
  mismo orden que GNOME y systemd-backlight: `firmware` antes que `platform`
  antes que `raw`, y se le asigna el conector interno (eDP, LVDS o DSI). Un
  escritorio sin panel interno no tiene retroiluminación, y no se le inventa
  una.
- **Escribir el brillo interno** va por logind (`SetBrightness` de
  `org.freedesktop.login1`, sobre la sesión que llama), que le da permiso al
  usuario de la sesión activa sobre su propia pantalla sin root y sin diálogo
  de polkit. El aviso lo trae el kernel solo: la escritura dispara un uevent.
  El valor crudo nunca es cero: en muchos paneles cero es apagar la
  retroiluminación, y una pantalla negra no se arregla con el deslizador que ya
  no se ve.
- **Monitores externos.** El bus i2c de cada conector sale de `/sys/class/drm`
  (el enlace `ddc` del conector, o el canal AUX que aparece como `i2c-N`
  adentro). `ddcutil detect` queda sólo como respaldo para un conector que no
  publica su bus, se corre una vez y se guarda hasta que cambien los monitores:
  era la parte cara. Las lecturas van con `--bus N`, que saltea la detección, y
  las escrituras con `--noverify`, que evita una segunda transacción por cada
  paso del deslizador. Un monitor que no contesta se muestra «no disponible»,
  no se esconde.
- **Sin sondeo.** Un hilo dormido en el socket de uevents del kernel espera los
  avisos: cambio de brillo de una retroiluminación, monitor que se conecta o se
  desconecta, GPU que aparece o se va. Se lee el grupo del kernel y no el de
  udev, para no depender de `libudev`. Si el socket no se puede abrir, todo lo
  demás sigue andando: sólo nadie avisa de los cambios ajenos.
- **Lo que se guarda y cuándo se relee.** La topología (qué conector va en qué
  bus y cuál contesta) se averigua una vez y vale hasta que el kernel avisa que
  cambiaron los monitores. Los valores se releen si tienen más de un minuto
  —alguien pudo tocar los botones del monitor, y eso no avisa—, siempre en
  segundo plano, y se actualizan al escribirlos.
- **Escribir en un monitor externo** se serializa, porque dos procesos de
  `ddcutil` sobre el mismo bus se pisan las respuestas. Arrastrar un deslizador
  pide decenas de valores por segundo y cada escritura tarda 40 ms o más: cada
  pedido saca un número y, cuando le toca, si ya hay uno más nuevo no escribe
  nada. Así el monitor no sigue cambiando segundos después de soltar.
  `ddcutil` se corta si no contesta en diez segundos.
- **La luz nocturna es sólo la configuración** de `wlsunset`, en
  `~/.config/systemd/user/vasak-nightlight.service` (la carpeta respeta
  `XDG_CONFIG_HOME`). La línea `ExecStart` es la
  única fuente de verdad y se lee de vuelta de ahí en vez de duplicarse en otro
  archivo, así que lo que el usuario ya tenía configurado se sigue leyendo
  igual. Se valida antes de escribir: las temperaturas se acotan entre 1000 y
  10000 K y la de noche tiene que ser menor que la de día; las horas se
  reescriben como `HH:MM` y las coordenadas son números, para que ningún texto
  agregue argumentos a la unidad. Se escribe en un temporal y se renombra, para
  que una unidad a medio escribir no deje a la luz nocturna sin levantar en el
  próximo inicio. Encender, apagar y recargar el servicio es de quien la usa.
