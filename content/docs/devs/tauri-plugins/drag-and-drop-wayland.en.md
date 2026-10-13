---
title: "drag-and-drop-wayland"
description: "Drag files and data out of the application with native Wayland drag and drop: it delivers URIs and text, and reports when to delete the original."
weight: 5
---

# `tauri-plugin-drag-and-drop-wayland`

Starts native drag and drop operations on Wayland, so files and data can be dropped
outside the application: on the file manager, on a terminal, on an editor or on the
browser. The mouse movement fires the drag, because Wayland requires the request to
come from inside an event dispatch.

- **Crate:** `tauri-plugin-drag-and-drop-wayland`
- **JS package:** `@vasakgroup/plugin-drag-and-drop-wayland`
- **Platform:** Linux with GTK 3 and WebKitGTK. It targets Wayland; the X11-specific signals are handled too

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-drag-and-drop-wayland = "2.1"
```

```bash
bun add @vasakgroup/plugin-drag-and-drop-wayland
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_drag_and_drop_wayland::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Permissions

`drag-and-drop-wayland:default`, in the capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["drag-and-drop-wayland:default"]
}
```

The default permission enables the only command, `start_drag`. There are also
`drag-and-drop-wayland:allow-start-drag` and
`drag-and-drop-wayland:deny-start-drag` to grant or deny it separately.

## JavaScript API

### `startDrag(item, icon?, options?, onEvent?): Promise<void>`

Arms a drag and hands it over to the next mouse movement. It is called **with the
button still pressed**, from the gesture that starts it, which is what makes the
compositor accept it. The promise resolves once the drag is armed; the outcome
arrives through `onEvent`.

`item` takes two shapes:

- An array of file paths (`["/home/who/report.pdf"]`), which travel as
  `text/uri-list` and as `text/plain`.
- An object `{ data, types }`, to drag loose data: `data` is the same text for
  every type, or a map that gives each MIME type its own, and `types` is the list
  of MIME types that are offered.

`icon` is the icon that follows the pointer: an absolute path to an image file,
or its contents in base64. Which of the two it is is decided by the contents: if
it is an absolute path and the file exists, it is read from disk; otherwise it is
decoded as base64. If it cannot be loaded, the drag goes out anyway, without an
icon.

`options.mode` is `"copy"` or `"move"` (default `"copy"`) and **does not change
what is offered to the destination**: both actions are always offered, because on
Wayland the destination is the one that chooses, and with none in common the
compositor cancels the drag instead of delivering it. The parameter is what the
interface uses to draw the copy or move badge while the pointer is inside the
window.

`onEvent` receives a `CallbackPayload` when the drag ends:

- `result`: `"Dropped"` or `"Cancelled"`.
- `action`: `"copy"`, `"move"` or `null`. It is informative.
- `sourceShouldDelete`: whether the destination confirmed that it kept what was
  delivered and the source is the one that has to remove it. **This is the signal
  that authorizes deleting, and not `action`**: a destination may choose move and
  then not ask for the deletion, and deleting because `"move"` was seen would lose
  a file nobody copied anywhere.
- `cursorPos`: where the pointer was at the end, in screen coordinates.

## Rust commands

- `start_drag(app, window, item, image, options, on_event)` — Arms a drag so that
  the next mouse movement fires it: it takes the application handle and the window,
  what is going to be delivered, the optional icon, the options and the channel
  through which the outcome is reported. It is registered as `commands::start_drag`
  and from the interface it is invoked as
  `plugin:drag-and-drop-wayland|start_drag`, which is where `item`, `image`,
  `options` and `onEvent` come from.

## Example

```typescript
import { startDrag } from "@vasakgroup/plugin-drag-and-drop-wayland";

// With the button pressed: the drag starts on the next movement.
button.addEventListener("mousedown", () => {
  void startDrag(
    ["/home/who/report.pdf"],
    "/usr/share/icons/hicolor/48x48/mimetypes/application-pdf.png",
    { mode: "move" },
    (payload) => {
      if (payload.result === "Dropped" && payload.sourceShouldDelete) {
        // The destination confirmed that it kept the file: only now
        // does it make sense to remove it.
        removeFromList("/home/who/report.pdf");
      }
    },
  );
});
```

## Implementation details

- A Tauri command cannot start a drag: `gtk_drag_begin` needs to be inside an
  event dispatch to take the mouse grab serial from it, and without that serial
  the compositor discards the request. That is why `start_drag` arms the drag and
  a `motion-notify-event` handler on the `WebKitWebView` fires it.
- An armed drag is valid for 1500 ms. If the movement does not arrive, because the
  button was released along the way, it is cancelled and reported through the
  channel instead of staying pending for the next movement.
- `COPY` and `MOVE` are always offered; never `LINK` or `ASK`, which would promise
  a link the source does not know how to fulfill.
- Files are delivered as `text/uri-list` with the URIs encoded as the
  specification requires (spaces, `#` and `?` escaped) and as `text/plain` with
  the paths as they are: a terminal or a text field pastes what it receives, and a
  pasted encoded URI is not a file.
- The handlers are hooked once per widget and never disconnected: the destination
  asks for the data **after** the drop, and disconnecting at the end left the
  transfer with nobody to serve it. That way the drag keeps working after a WebView
  reload.
- The end is reported only once, because `drag-failed` and `drag-end` may both
  arrive.
- On Wayland there is no signal that asks to delete the original: `drag-data-delete`
  arrives only on X11. What is used is the pair the protocol defines —it ended
  without failing and the negotiated action was move—, and a failure wins over
  everything else.
- The behavior was measured with the probes in `examples/` on Wayfire.
