---
title: "config-manager"
description: "Reads and writes `vasak.conf` in real time, exposes the Pinia store and derives the scheme colors from the wallpaper."
weight: 1
---

# `tauri-plugin-config-manager`

Reads and writes the VasakOS configuration (`vasak.conf`) and tells every open
application when it changes. It also ships the Pinia store that applies it, the
color and contrast helpers, and since 2.10.0 the calculation of the color scheme
from the wallpaper.

- **Crate:** `tauri-plugin-config-manager`
- **JS package:** `@vasakgroup/plugin-config-manager`
- **Platform:** Linux (the GTK and `gsettings` sync uses the
  `system-theme-sync` feature, enabled by default)

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-config-manager = "2"
```

```bash
bun add @vasakgroup/plugin-config-manager
```

`vue`, `pinia` and `@tauri-apps/api` are **peer** dependencies: the application
provides them, not this package. It is not a packaging detail — the store that
`useConfigStore` exports lives in the application's `pinia`, and if the plugin
brought its own there would be two copies of `pinia`, that is, two active stores,
and the application would start with «getActivePinia() was called but there was
no active Pinia».

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

An application that also **saves** schemes adds
`config-manager:allow-save-user-scheme`, which is not part of the default set
(see “Permissions”).

## Permissions

`config-manager:default` enables the five everyday read and write operations:

- `allow-read-config`
- `allow-write-config`
- `allow-set-darkmode`
- `allow-get-schemes`
- `allow-get-scheme-by-id`

Each has its matching `deny-` counterpart, and none of them can be combined with
another to widen its scope.

`allow-save-user-scheme` **exists but is not in the default set**: writing
schemes is not something every application should be able to do, so the one that
needs it declares it in its capability:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["config-manager:default", "config-manager:allow-save-user-scheme"]
}
```

## JavaScript API

### Configuration

#### `readConfig(): Promise<VSKConfig | null>`

Returns the configuration already normalized: keys missing from the file arrive
with their factory value, and the ones the model does not know —the desktop
widgets, for example— travel exactly as they were. If the file does not exist,
the plugin creates it with the factory values. It returns `null` if the text
cannot be read as JSON.

#### `writeConfig(value: VSKConfig): Promise<void>`

Validates the object in Rust, persists it atomically and notifies the other
applications. It also leaves the chosen icons and fonts where GTK and
`gsettings` read them.

#### `setDarkMode(darkmode: boolean): Promise<void>`

Changes the dark mode in the file, syncs the system theme and applies the icon
pack of the new mode.

### Store

#### `useConfigStore(): Store<"config">`

Returns the Pinia store `useConfigStore`, which exposes:

- `config: Ref<VSKConfig | null>` — the loaded configuration.
- `loadConfig(): Promise<void>` — reads it, adds or removes the `dark` class on
  `:root`, writes every CSS variable of the scheme, applies the three fonts and
  enables the fade between schemes.

The store is defined once, so every call returns the same store.

#### `enableSchemeTransition(root?): void`

Adds the `scheme-transition` class to `:root` so vue-libvasak animates the scheme
change. It does so two frames after the first application, not right away: with
the class and the new colors in the same style calculation, the browser animates
from the factory colors and opening a window looks like a flicker. The class name
is exported as `SCHEME_TRANSITION_CLASS`.

#### `pilaDeFuente(nombre, rol): string`

Builds the `font-family` stack for a role (`"apps"`, `"title"` or `"terminal"`),
always ending in its generic family. It sanitizes the name —it comes from
`vasak.conf`, which is edited by hand— and never returns an empty string, because
`setProperty` with an empty value removes the property. `primeraUtil(...candidatos)`
returns the first candidate that still has something after sanitizing.

#### `windowBorderProperties(border): WindowBorderProperties`

Turns `style.border` into the two variables of the outer border:
`--window-border-width` and `--ui-window-border`. Anything unrecognized falls back
to the usual border: thin and scheme-colored. The `WindowBorder` type has
`width` (`"normal"`, `"thick"` or `"heavy"`) and `color` (`"scheme"` or `"accent"`).

### Schemes

#### `getSchemes(): Promise<Scheme[]>`

Every scheme found in the effective paths, each with its `path` and its `scheme`.

#### `getSchemeById(schemeId: string): Promise<Scheme | null>`

The scheme with that `id`. If there is more than one —a system one and a user
one— the user directory wins, since it comes first.

#### `saveUserScheme(scheme: SchemeData): Promise<Scheme>`

Saves the scheme as `<id>.json` in the user's schemes directory. It needs the
`config-manager:allow-save-user-scheme` permission, which is not in the default
set. The `id` must match `^[a-z0-9][a-z0-9-]{0,63}$`, because it is also the file
name: anything else is rejected. It never writes into `/usr`. It does not emit
`config-changed` on its own; each application's watcher does that when it sees
the file.

#### `applyColorPatch(scheme, variant, patch): T`

Applies a partial color change (`SchemeColorPatch`) to the variant (`"dark"` or
`"light"`) and returns a new scheme, leaving the received one untouched. Anything
that is not a valid color is dropped, so a half-typed field cannot reach the file
and leave the whole desktop without a color. `cloneScheme` and `isHexColor` are
the two loose pieces of the same rule, and `SCHEME_VARIANTS` are the two variants
in the order the editor shows them.

### Color and contrast

All the functions are pure and work in sRGB or OKLCH. `hexToRgb`, `rgbToHex`,
`rgbToOklab`, `oklabToRgb`, `oklabToOklch`, `oklchToOklab`, `hexToOklch`,
`oklchToHex` and `hueDistance` are the conversions between spaces. `oklchToHex`
brings the color into the sRGB gamut by lowering chroma rather than clipping
channel by channel, so the hue does not change.

- `luminance(hex): number | null` — the WCAG relative luminance.
- `contrastRatio(a, b): number` — the contrast between two colors; with an
  unreadable color it returns 0, the worst case.
- `bestOn(background, candidates, minimum): string | null` — the highest-contrast
  color in the list, or `null` if none reaches the minimum.
- `textOn(background, preferred, palette): string` — the text color for a brand
  background: it respects the scheme's value when it passes, and otherwise looks
  in its own palette before falling back to black or white.
- `strongBorderOn(palette): string | null` — a border that reaches 3:1 against
  the background **and** against the surface.
- `focusOn(palette): string | null` — the focus ring: it starts from the primary
  and moves it toward the main text until it is visible against both backgrounds.
- `mixHex(from, to, amount): string | null` — the sRGB mix, the same calculation
  as `color-mix(in srgb, …)`.

The minimums are `MIN_TEXT_CONTRAST` (4.5, text) and `MIN_NON_TEXT_CONTRAST` (3,
what delimits a control). The earlier names —`textoSobre`, `contraste`,
`luminancia`, `mejorSobre`, `bordeFuerteSobre`, `MINIMO_TEXTO`, `MINIMO_NO_TEXTO`—
are still exported as aliases.

### From the wallpaper to the scheme

#### `extractPalette(pixels, size?): PaletteColor[]`

The palette of a wallpaper from its raw RGB pixels: a few colors with their
weight and where in the image each one came from. It groups into 4-bit buckets,
runs k-means in OKLab and seeds deterministically, so the same wallpaper always
gives the same palette. At most `PALETTE_SIZE` colors (6).

#### `pickAccents(palette, fallbackPrimary): Accents`

The accent and the secondary color from the palette, merging similar hues so a
gradient does not compete split apart. With a wallpaper that has no chroma it
keeps the hue of the scheme's primary and flags it with `fallback: true`.

#### `ensureContrast(color, against, minimum): string`

Moves the color's lightness —in OKLCH, without changing its hue— until it reaches
the minimum against **all** the backgrounds in `against`, changing as little as
possible.

#### `generateVariantUi(current, variant, accents, pinned?): UiDraft`

The `ui` colors of a variant from the accents, respecting the hand-pinned colors
and guaranteeing contrast. `draftToPatch` turns it into a `SchemeColorPatch`
without the pinned ones, and `buildWallpaperPatches(scheme, palette, pinned?)`
returns the changes for both variants, or `null` if the palette is empty.

#### `readWallpaperState(scheme): WallpaperColorsState`

The automatic mode state stored in the scheme, with sane values even if the file
was edited by hand. It lives under `WALLPAPER_STATE_KEY` (`"wallpaper-colors"`)
and has `follow`, `source` and `pinned`. `withWallpaperState` replaces it without
touching the received scheme, and `uiPathsOf`, `readUiColor`, `omitPaths` and
`UI_COLOR_PATHS` work with the colors named by their path inside the variant.

### Following the wallpaper

#### `followWallpaper(deps): Promise<FollowOutcome>`

If the «Personalizado» scheme is in use, has «Seguir al fondo» on and the
wallpaper in `vasak.conf` is not the one from last time, it takes the colors from
the wallpaper and saves the scheme. It can be called on every `config-changed`:
saving records the source wallpaper, so the `config-changed` the save itself
triggers comes back `unchanged` and there is no loop. It returns what happened,
and only `"applied"` wrote anything.

#### `applyWallpaperColors(scheme, palette, source): WallpaperColorsResult<T> | null`

The scheme with the colors taken from the palette, without the hand-pinned ones,
and with the source wallpaper recorded. It is what Settings uses for “Take from
the wallpaper again”. It returns `null` if the palette is empty: colors are not
invented. `CUSTOM_SCHEME_ID` is the `"custom"` of the scheme that follows the
wallpaper.

## Rust commands

- `read_config()` — the normalized configuration, as JSON text.
- `write_config(payload)` — validates the JSON, persists it atomically and emits
  `config-changed`; it also applies the icon pack and the fonts.
- `set_darkmode(darkmode)` — persists the new mode, syncs the system theme,
  applies the icon pack of the mode and emits `config-changed`.
- `get_schemes()` — every scheme in the effective paths.
- `get_scheme_by_id(scheme_id)` — the scheme with that `id`, or none.
- `save_user_scheme(scheme)` — writes `<id>.json` into the user directory; its
  permission is not in the default set.

## Events

| Event | When it fires | Payload |
|---|---|---|
| `config-changed` | `vasak.conf` or a user scheme changed | `null` |

```typescript
import { listen } from "@tauri-apps/api/event";
import { useConfigStore } from "@vasakgroup/plugin-config-manager";

const store = useConfigStore();

await listen("config-changed", async () => {
  await store.loadConfig();
});
```

It is emitted by `write_config`, `set_darkmode` and the file watcher. The watcher
waits for the burst of events to end —a 250 ms debounce measured at the end, not
at the start— so an editor that saves while a color is being dragged does not
leave the other applications with an intermediate color. A change in `vasak.conf`
and in a scheme at the same time comes out as **one** event, not two. The store
does not subscribe on its own: the application listens and calls `loadConfig`
again.

## Example

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
  <p v-if="store.config">System radius: {{ store.config.style.radius }} px</p>
</template>
```

## Implementation details

- **30-minute cache** for the configuration and for the scheme list. It is
  invalidated on write and when the watcher sees a change. The scheme list also
  carries a generation counter: if someone saves a scheme while a read is in
  progress, that read does not store its stale result in a just-cleared cache.
- **Atomic write**: the content goes to a hidden temporary file next to the
  destination, is synced and then renamed. A power loss halfway leaves either the
  old file or the new one, never a half-written one. Both `vasak.conf` and the
  schemes use it.
- **Unreadable configuration**: if the content does not parse or has mismatched
  types, it is moved aside to `vasak.conf.roto` —not deleted: it may hold the
  wallpaper, the widgets and the chosen fonts— and a factory one is written in
  its place. A file cut off by a power loss recovers on the next boot.
- **Normalization**: `read_config` does not return the file as is, but the model
  reserialized, so missing keys arrive with their factory value. The fields the
  model does not know —`desktop.widgets`, `panel`, any new section— survive the
  round trip through `#[serde(flatten)]`: without it, the first read and the next
  `writeConfig` erased them.
- **Watcher**: `notify` in non-recursive mode over the configuration directory and
  the user's schemes directory. It ignores hidden temporaries. For schemes,
  **deletion** also counts —whoever had it applied must find out and fall back to
  the default—; for `vasak.conf` it does not: re-reading a missing file would
  recreate it in the middle of a manual replacement.
- **Scheme ID**: `^[a-z0-9][a-z0-9-]{0,63}$`, validated character by character in
  ASCII. Since the `id` is the file name, this is what stops an id such as
  `../../.bashrc` from taking the write out of the directory.
- **Directories**: the user schemes directory is the first entry of
  `VASAK_SCHEMES_PATHS`, or `~/.config/vasak/schemes` without the variable, and
  never one inside `/usr`. The configuration path comes from `VASAK_CONFIG_PATH`
  or, without the variable, from `~/.config/vasak/vasak.conf`. The default paths
  searched for schemes are `~/.config/vasak/schemes` and `/usr/share/schemes`.
- **System sync** (`system-theme-sync`): it writes the mode and the icons into the
  `settings.ini` of GTK 3 and GTK 4 —the file read at startup, and therefore the
  one that decides how the session looks after a reboot— and also into
  `gsettings`. The fonts are applied **after** `vasak.conf` has been written: if
  the write fails, the save fails without having changed the system font. Every
  `gsettings` call has a two-second cap, so a stuck D-Bus never leaves the
  configuration unable to be saved again.
