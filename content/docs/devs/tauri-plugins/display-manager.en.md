---
title: "display-manager"
description: "The brightness of each screen —backlight on internal panels and DDC/CI on external ones— and the night light settings."
weight: 8
---

# `tauri-plugin-display-manager`

The brightness of each screen separately and the night light settings. Internal
panels are read from `/sys/class/backlight` and written through logind, with no
root and no dialog; external monitors are driven over DDC/CI. Nothing polls:
the notices arrive through kernel uevents.

- **Crate:** `tauri-plugin-display-manager`
- **JS package:** `@vasakgroup/plugin-display-manager`
- **Platform:** Linux with sysfs and logind, `ddcutil` for external monitors and
  `wlsunset` for the night light

## Installation

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

An application that lives for the whole session and shows the brightness as soon
as something opens —the desktop— can ask for external monitors to be searched at
startup, in the background, instead of on the first query:

```rust
.plugin(tauri_plugin_display_manager::Builder::new().prefetch_ddc(true).build())
```

The two system tools are optional, and each one has its cost:

| Package | What for | Without it |
|---|---|---|
| `ddcutil` | External monitors | They show as "unavailable" and the reason is `not-installed` |
| `wlsunset` | The night light | The interface explains it, instead of failing |
| `i2c-dev` module | The `/dev/i2c-*` buses DDC/CI uses | The reason is `no-i2c-dev` |

To write over DDC/CI, the user has to be able to open the i2c buses (the `i2c`
group or the ddcutil udev rule); if they cannot, the reason is `no-permission`.

## Permissions

`display-manager:default` enables all five operations (`get_brightness`,
`set_brightness`, `refresh_brightness`, `get_night_light`, `set_night_light`):

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["display-manager:default"]
}
```

Each command also has its own loose `allow-` and `deny-`
(`display-manager:allow-set-brightness`, for instance), for an application that
needs only one part.

## JavaScript API

### `getBrightness(): Promise<BrightnessReport>`

The brightness of each screen that can be dimmed. Internal panels are read on
the spot; external monitors come from what is cached and, if needed, are
searched in the background. It **never waits for DDC/CI**: what is not known yet
arrives later through `onBrightnessChanged`.

### `setBrightness(kind, handle, percent): Promise<void>`

Changes the brightness of one screen. `kind` is `"backlight"` or `"ddc"`,
`handle` is that screen's handle in the report and `percent` goes from 0 to 100.

### `refreshBrightness(): Promise<void>`

Re-reads the external monitors even if the cached data is fresh. The result
arrives through the event.

### `onBrightnessChanged(handler): Promise<UnlistenFn>`

Notifies when the brightness of any screen changes —also from a key or another
program— or when the connected monitors change. It returns the function that
stops listening.

### `getNightLight(): Promise<NightLight>`

The night light settings. If they were never saved, it brings the default
values.

### `setNightLight(config): Promise<NightLight>`

Validates and saves the settings. It **does not turn the night light on or
off**: that is up to whoever uses the plugin. It returns the already validated
settings.

### `BRIGHTNESS_EVENT`

The event name, `"display-brightness-changed"`, in case it has to be listened to
with `listen` from `@tauri-apps/api/event` instead of using
`onBrightnessChanged`.

### The shapes of the data

```ts
type BrightnessKind = "backlight" | "ddc";

interface MonitorBrightness {
  /** The DRM connector (`eDP-1`, `DP-2`), to cross it with the monitor list. */
  output: string | null;
  kind: BrightnessKind;
  /** What has to be given back in `setBrightness`. */
  handle: string;
  percent: number;
}

interface BrightnessReport {
  monitors: MonitorBrightness[];
  ddc: DdcStatus;
}

interface DdcStatus {
  state: "ready" | "detecting" | "unavailable";
  /** Codes, not sentences: each application supplies the text, translated. */
  reason: "not-installed" | "no-i2c-dev" | "no-permission" | null;
  /** Connectors of external monitors that do not answer over DDC/CI. */
  unsupported: string[];
}
```

`handle` is the only thing that has to be given back in `setBrightness`: the
backlight name of the internal panel, or the i2c bus number of the external
monitor, as text.

```ts
interface NightLightConfig {
  mode: "manual" | "location";
  /** Daytime Kelvin. */
  dayTemperature: number;
  /** Nighttime Kelvin; lower than the daytime one. */
  nightTemperature: number;
  /** `HH:MM` when the day starts (manual mode). */
  sunrise: string;
  /** `HH:MM` when the night starts (manual mode). */
  sunset: string;
  latitude: number | null;
  longitude: number | null;
}

interface NightLight {
  /** False without `wlsunset` installed. */
  available: boolean;
  /** Whether it was ever saved; if not, `config` holds the default values. */
  configured: boolean;
  config: NightLightConfig;
}
```

## Rust commands

- `get_brightness()` — The report with all the screens. It does not wait for
  DDC/CI.
- `set_brightness(kind, handle, percent)` — Writes the brightness. For backlight
  it goes through logind; for DDC/CI, through `ddcutil`.
- `refresh_brightness()` — Re-reads the external monitors; the result arrives
  through the event.
- `get_night_light()` — Reads the saved night light settings.
- `set_night_light(config)` — Validates and saves the settings. It does not turn
  the service on or off.

From Rust, the `DisplayManagerExt` trait gives the same manager with
`app.display_manager()`. The night light settings are a public module
(`night_light`) with `wlsunset_args`, for whoever has to build the command when
turning the service on.

## Events

| Event | When it fires | Payload |
|---|---|---|
| `display-brightness-changed` | The brightness of any screen changed (also from a key or from another program), what screens can be dimmed changed, or the search for external monitors finished | `BrightnessReport` |

The event is emitted to every window. It is the only way to learn about external
monitors that appear after the first query, and about the changes someone else
made (the monitor buttons do not announce it any other way).

## Example

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

  // The event also brings the external ones that were not known yet.
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
  // Without wlsunset installed it is explained, not hidden.
}

await setNightLight({
  ...nightLight.config,
  mode: "location",
  latitude: -34.6,
  longitude: -58.4,
});
```

## Implementation details

- **Internal panels.** Two files of `/sys/class/backlight` are read
  (`brightness` and `max_brightness`). When there is more than one device for
  the same screen, the one hanging from the panel connector is chosen; if none
  hangs from one (`acpi_video0` hangs from the board), it is chosen by type, in
  the same order GNOME and systemd-backlight use: `firmware` before `platform`
  before `raw`, and the internal connector (eDP, LVDS or DSI) is assigned to it.
  A desktop without an internal panel has no backlight, and none is invented.
- **Writing the internal brightness** goes through logind (`SetBrightness` of
  `org.freedesktop.login1`, on the calling session), which gives the user of the
  active session permission over their own screen with no root and no polkit
  dialog. The notice comes from the kernel on its own: the write fires a uevent.
  The raw value is never zero: on many panels zero turns the backlight off, and
  a black screen is not fixed with a slider that can no longer be seen.
- **External monitors.** The i2c bus of each connector comes from
  `/sys/class/drm` (the connector's `ddc` link, or the AUX channel that appears
  as `i2c-N` inside it). `ddcutil detect` is only the fallback for a connector
  that does not publish its bus; it runs once and is cached until the monitors
  change: that was the expensive part. Reads go with `--bus N`, which skips
  detection, and writes with `--noverify`, which avoids a second transaction for
  every step of the slider. A monitor that does not answer is shown as
  "unavailable", not hidden.
- **No polling.** A sleeping thread on the kernel uevent socket waits for the
  notices: backlight brightness change, monitor connected or disconnected, GPU
  that appears or leaves. It reads the kernel group and not udev's, to avoid
  depending on `libudev`. If the socket cannot be opened, everything else keeps
  working: only nobody warns about other people's changes.
- **What is cached and when it is re-read.** The topology (which connector is on
  which bus and which one answers) is figured out once and holds until the
  kernel announces that the monitors changed. The values are re-read if they are
  more than a minute old —someone may have touched the monitor buttons, and that
  does not announce itself—, always in the background, and they are updated when
  written.
- **Writing to an external monitor** is serialized, because two `ddcutil`
  processes on the same bus step on each other's answers. Dragging a slider asks
  for dozens of values per second and each write takes 40 ms or more: every
  request takes a number and, when its turn comes, if there is already a newer
  one it writes nothing. That way the monitor does not keep changing seconds
  after the slider is released. `ddcutil` is cut off if it does not answer
  within ten seconds.
- **The night light is only the settings** of `wlsunset`, in
  `~/.config/systemd/user/vasak-nightlight.service` (the folder respects
  `XDG_CONFIG_HOME`). The `ExecStart` line is the
  single source of truth and is read back from there instead of being duplicated
  in another file, so what the user already had configured keeps being read the
  same way. It is validated before writing: temperatures are clamped between
  1000 and 10000 K and the night one has to be lower than the day one; times are
  rewritten as `HH:MM` and coordinates are numbers, so that no text adds
  arguments to the unit. It is written to a temporary file and renamed, so that a
  half-written unit does not leave the night light unable to start on the next
  boot. Turning the service on, off and reloading it is up to whoever uses it.
