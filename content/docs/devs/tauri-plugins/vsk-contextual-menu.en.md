---
title: "vsk-contextual-menu"
description: "The system context menu for VasakOS applications: drawn inside the page or in its own window, anchored to the click."
weight: 7
---

# `tauri-plugin-vsk-contextual-menu`

The right-click menu of VasakOS. One menu for the whole system: applications
describe *what* options they offer and the plugin decides how they look, how
they answer the keyboard and how they close. The desktop, the file manager, the
gallery and whatever comes next all look the same.

- **Crate:** `tauri-plugin-vsk-contextual-menu`
- **JS package:** `@vasakgroup/plugin-vsk-contextual-menu`
- **Platform:** Linux (Wayland and X11) with Tauri 2

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-vsk-contextual-menu = "2"
```

```bash
bun add @vasakgroup/plugin-vsk-contextual-menu
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_vsk_contextual_menu::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

`init()` leaves the menu window on the default route, `#/vsk-context-menu`. It
only has to be changed when the application cannot register that route:

```rust
.plugin(tauri_plugin_vsk_contextual_menu::init_with_route("#/whatever"))
```

The route is the part that goes after `index.html`, hash included.

## Permissions

`vsk-contextual-menu:default` enables all five commands (`open_menu_window`,
`close_menu_window`, `take_pending_menu`, `resolve_menu`, `show_menu_window`).
There are no permissions other than the `allow-` and `deny-` pairs per command.

The menu window carries the `vsk_context_menu` label and **has to be included
in the capability**: otherwise it is left without permissions and the menu is
drawn without the system colors and without translations. The same permission
list covers both sides, because both invoke the plugin:

```json
// src-tauri/capabilities/default.json
{
  "windows": ["main", "vsk_context_menu"],
  "permissions": [
    "vsk-contextual-menu:default",
    "core:event:default"
  ]
}
```

`core:event:default` is what allows listening to `config-changed`, the notice
through which the menu learns that the color scheme changed.

The in-DOM mode does not invoke any plugin command, but it does read the system
palette: it needs the config-manager plugin permissions (`read_config` and
`get_scheme_by_id`). Without them the menu is still drawn, with the system
colors or with the factory ones.

## JavaScript API

### `showContextMenu(items, donde, opciones?): Promise<MenuChoice | null>`

Opens the menu and returns what was chosen, or `null` if it was closed without
choosing anything. `items` is the tree of rows and `donde` is the right-click
event (it cuts off the menu the browser engine draws) or your own `{ x, y }`.
If a menu was already open in that window, it is closed before the new one
opens.

`opciones`:

| Field | What it does |
|---|---|
| `minWidth` | Minimum width, in pixels. Defaults to 200. |
| `maxWidth` | Maximum width, before the text is cut with an ellipsis. Defaults to 420. |
| `window` | Draw the menu in its own window instead of inside the page. |

### `closeContextMenu(): void`

Closes the open menu, if there is one. Whoever opened it receives `null`, just
as if it had been dismissed with Escape.

### `disableNativeContextMenu(): void`

Turns off the right-click menu the browser engine draws in the whole window. It
avoids "Reload" and "Inspect element" over an application that is not a web
page; your own menus still open the same way.

### `setupContextMenu(opciones?): void`

All of the above together, for the application startup. It accepts
`iconResolver` (how to turn a system icon name into an image) and
`disableNative` (by default, it turns off the WebKit menu). It also asks for
the system palette ahead of time, so the first right click does not wait.

### `setIconResolver(resolutor): void`

Teaches the menu to turn icon names into images. The resolver receives the name
and returns an image, such as `getIconSource` from
[`vicons`](/en/docs/devs/tauri-plugins/vicons/); passing `null` removes it. The
plugin does not depend on vicons on purpose: that way it can be used in any
application.

### `openContextMenuWindow(items, punto, opciones?): Promise<MenuChoice | null>`

Opens the menu in its own window and waits for what is chosen. This is what
`showContextMenu` calls with `window: true`; it is rarely needed by hand. It
adds the window position to pass the click in screen coordinates, which are the
ones Rust needs.

### `mountContextMenuWindow(): Promise<void>`

Draws the menu in the window the plugin opened. It is the only thing the route
the application registered for the menu has to do.

### `useContextMenu()`

The Vue wrapper. It returns `{ show, close }` and closes the menu when the
component unmounts, so an open menu is not left orphaned.

### `useContextMenuWindow(): void`

For the component the application puts on the menu route; it calls
`mountContextMenuWindow` on mount.

### The tree of rows

`MenuEntry` is the same union of types the Rust side understands:

| Type | Fields |
|---|---|
| `item` | `id`, `label`, `icon?`, `accelerator?`, `disabled?`, `danger?`. `type` is optional. |
| `checkbox` | `id`, `label`, `checked?`, `disabled?`. When chosen, `MenuChoice` carries the new state. |
| `submenu` | `label`, `icon?`, `items`. In-DOM mode only. |
| `separator` | None. It separates groups of options. |
| `label` | `label`. A group title, which cannot be chosen. |

Three things worth keeping in mind:

- `label` arrives already translated: the menu translates nothing on its own.
- `accelerator` is `Ctrl+C` as it reads; the menu **shows** it, it does not
  listen for it. The application still handles the shortcut.
- `danger` paints the option with the error color, for what destroys something.

## Rust commands

- `open_menu_window(request)` — Opens the menu in its own window, anchored to
  the click. `request` carries `items`, `x`, `y` (physical screen coordinates)
  and optional `minWidth`/`maxWidth`.
- `take_pending_menu()` — The items the menu window has to draw. It does not
  take them out of the state: the menu stays open until someone resolves it.
- `show_menu_window()` — Shows the window, now with the items drawn inside. It
  only does anything when the menu window itself calls it.
- `resolve_menu(id, checked)` — An option was chosen. `checked` only comes when
  it was a checkbox.
- `close_menu_window()` — The menu was closed without choosing anything.

The last two close the window and notify whoever asked for the menu. If the
window could not be opened, `open_menu_window` answers anyway: without that,
whoever asked for the menu would wait forever.

## Events

| Event | When it fires | Payload |
|---|---|---|
| `vsk-context-menu-result` | An option was chosen, the menu was closed without choosing, or the window could not be opened | `{ id: string \| null, checked: boolean \| null }` |

It goes only to the window that asked for the menu, with `null` in `id` when it
was dismissed. `showContextMenu` and `openContextMenuWindow` already listen for
it on their own: the application receives the answer in the return value, not in
a listener of its own.

## Example

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  setupContextMenu,
  showContextMenu,
} from "@vasakgroup/plugin-vsk-contextual-menu";
import { getIconSource } from "@vasakgroup/plugin-vicons";

const showHidden = ref(false);

onMounted(() => {
  // Once, at startup: the menu now knows how to draw system icons.
  setupContextMenu({ iconResolver: getIconSource });
});

async function onRightClick(event: MouseEvent) {
  const choice = await showContextMenu(
    [
      { id: "open", label: t("actions.open"), icon: "document-open" },
      { id: "copy", label: t("actions.copy"), icon: "edit-copy", accelerator: "Ctrl+C" },
      { type: "separator" },
      { type: "checkbox", id: "hidden", label: t("view.hidden"), checked: showHidden.value },
      { type: "submenu", label: t("actions.openWith"), items: [
        { id: "with-editor", label: t("apps.editor") },
        { id: "with-terminal", label: t("apps.terminal") },
      ] },
      { type: "label", label: t("groups.danger") },
      { id: "delete", label: t("actions.delete"), icon: "edit-delete", danger: true },
    ],
    event,
  );

  if (choice?.id === "copy") copy();
  if (choice?.id === "hidden") showHidden.value = choice.checked ?? false;
  if (choice?.id === "delete") remove();
}
</script>

<template>
  <div class="files" @contextmenu="onRightClick" />
</template>
```

In window mode both halves are needed: the application opens the menu with
`window: true` and registers a route that draws it.

```ts
// The application that asks for the menu (the panel, for instance).
const choice = await showContextMenu(items, event, { window: true });
```

```vue
<!-- The component of the route the application registered for the menu. -->
<script setup lang="ts">
import { useContextMenuWindow } from "@vasakgroup/plugin-vsk-contextual-menu";

useContextMenuWindow();
</script>

<template><div /></template>
```

## Implementation details

- Both modes draw with the same component: the menu looks and behaves the same
  inside the page as in its own window.
- Inside the DOM the only limit is the application window. In window mode the
  limit is the screen: it is meant for the panel —a thirty-pixel strip— and for
  clicks near the bottom edge, where the menu would be clipped.
- The menu window is transparent, undecorated, not resizable, always on top and
  out of the taskbar. It is born the exact size of its rows (32 px per option,
  9 px per separator, 26 px per title, plus the padding and the border) and is
  pushed inward when the click falls near the screen edge. It is created every
  time and closed on choosing or losing focus: keeping it alive would cost a
  webview in memory for something that opens for a few seconds. It leaves 8 px
  of transparent border for the shadow, measured the same way in Rust and in the
  JavaScript that draws.
- Submenus do not fit in window mode —the window measures exactly what the menu
  measures and the submenu would fall outside—, so that mode rejects them. In
  in-DOM mode they are part of the same drawing.
- The colors and the corner radius come from the config-manager plugin: the
  scheme chosen in the system and the corner radius. They are read once and
  cached; the `config-changed` event asks for them again. If config-manager is
  missing or does not answer, the menu falls back to the system variables
  (`--use-*`) and from there to the factory colors: it never fails to draw for
  not knowing which color to paint itself. That read is the menu's own business;
  it is not part of what the package exports.
- The `type` of a common option is optional: before crossing to Rust, the plugin
  fills in `type: "item"` on every row —also inside submenus—, because on the
  Rust side the tree is an enum tagged by that field and without it the
  deserialization fails.
- In window mode the menu does not close when the page loses focus or changes
  size: mapping the window fires `blur` and `resize` that do not mean anyone went
  somewhere else, and the menu would have closed a hundred milliseconds after
  opening. The focus is watched by the real window, and it only closes if it lost
  it **after** having had it.
- The keyboard is that of any desktop menu: arrows to move, Home and End for the
  ends, Enter and space to choose, Escape to go back from a submenu to its
  parent and to close the menu, and typing jumps to the option that starts that
  way. Submenus open on hover.
- The style ships as plain CSS and not as Tailwind classes: the plugin is
  published compiled and the application's scan does not see the classes that
  live inside a package, so they would arrive unstyled.
- What the plugin **cannot** do is change the menu of other applications: on
  Wayland each client draws its own on its own surface and there is no protocol
  to replace it. For those, the way is the GTK and Qt theme.
