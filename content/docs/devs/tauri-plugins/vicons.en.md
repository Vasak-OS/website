---
title: "vicons"
description: "System theme icons as a data URI ready for an `<img>`, with a 30-minute cache and a notification to the frontend when the theme changes."
weight: 2
---

# `tauri-plugin-vicons`

Fetches icons from the system icon theme (GTK) and returns them base64-encoded,
ready to drop into an `<img src>`. It caches lookups for half an hour and tells
the frontend when the icon theme changes.

- **Crate:** `tauri-plugin-vicons`
- **JS package:** `@vasakgroup/plugin-vicons`
- **Platform:** Linux with GTK 3 (GNOME, KDE, Xfce and other environments)

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-vicons = { git = "https://github.com/Vasak-OS/tauri-plugin-vicons", branch = "v2" }
```

```bash
bun add @vasakgroup/plugin-vicons
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_vicons::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Permissions

`vicons:default`, in the capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["vicons:default"]
}
```

The default permission enables all four operations (`get_icon`, `get_symbol`,
`has_icon`, `has_symbol`). There are no individual permissions.

## JavaScript API

### `getIconSource(name): Promise<string>`

Returns a full data URI (`data:image/png;base64,…`) ready for an `<img src>`.
`name` may be a GTK icon name (`folder`) or a path to an existing file, which is
read directly. The MIME type is detected from the first bytes (PNG, JPEG, GIF,
WebP, BMP and SVG). On error it returns `""`.

### `getSymbolSource(name): Promise<string>`

Like `getIconSource`, but for the theme's symbolic icons (the monochrome ones
that follow the text color).

### `hasIcon(name): Promise<boolean>`

Whether the theme can draw that regular icon. On a plugin error it answers
`false` instead of throwing.

### `hasSymbol(name): Promise<boolean>`

Like `hasIcon`, for symbols.

### Why `hasIcon` and `hasSymbol` are needed

`getIconSource` and `getSymbolSource` **do not fail** when the icon is missing:
the theme returns `image-missing` —the broken-image box— as if it were the
requested icon, and what arrives is a valid data URI. Checking the result is not
enough, because it is never empty. The right way is to ask first:

```typescript
import { getSymbolSource, hasSymbol } from "@vasakgroup/plugin-vicons";

// Wrong: `icon` is never "", so the `if` protects nothing.
const icon = await getSymbolSource("google-symbolic");
if (icon) show(icon); // draws the box when the theme does not have it

// Right: ask first and pick another name when it is missing.
const name = (await hasSymbol("google-symbolic"))
  ? "google-symbolic"
  : "goa-account-symbolic";
show(await getSymbolSource(name));
```

## Rust commands

All four commands take a single `name: &str` argument. If it is a valid file
path, the file is read; otherwise it is looked up in the GTK icon theme.

- `get_icon(name)` — Regular icon as base64.
- `get_symbol(name)` — Symbolic icon as base64.
- `has_icon(name)` — Whether the theme has the regular icon, without fetching it.
- `has_symbol(name)` — Whether the theme has the symbol, without fetching it.

`has_icon` and `has_symbol` perform the same lookup as their matching `get_`
—same size, same flags— so a `true` guarantees that the `get_` returns that icon
and not the box.

## Events

| Event | When it fires | Payload |
|---|---|---|
| `vicons:theme-changed` | The system icon theme changed | `null` |

```typescript
import { listen } from "@tauri-apps/api/event";
import { getIconSource } from "@vasakgroup/plugin-vicons";

await listen("vicons:theme-changed", async () => {
  const icon = await getIconSource("folder");
  // redraw the interface with the new icon
});
```

The plugin detects the change through GTK's `changed` signal, clears the cache
and only then emits the event.

## Implementation details

- Two separate caches (`ICON_CACHE` and `SYMBOL_CACHE`); each entry expires after
  **30 minutes**.
- When the icon theme changes, both caches are cleared entirely.
- GTK detects the change through GSettings (`org.gnome.desktop.interface`),
  through inotify on `~/.config/gtk-3.0/settings.ini` and through the XDG portal.
- It writes a log at `{app_data_dir}/logs/icons.log` with no external logging
  dependency.

## Vue example

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getIconSource } from "@vasakgroup/plugin-vicons";

const icon = ref("");
onMounted(async () => {
  icon.value = await getIconSource("folder");
});
</script>

<template>
  <img :src="icon" alt="folder" />
</template>
```
