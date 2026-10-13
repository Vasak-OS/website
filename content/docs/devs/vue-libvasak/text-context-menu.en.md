---
title: "Text | TextContextMenu"
weight: 156
description: "TextContextMenu: system context menu for text fields, with copy, cut, paste and select all."
---

# `TextContextMenu`

### Description
Component that draws the right-click menu on text fields using the system menu, like the rest of the desktop. Offers copy, cut, paste, and select all. It mounts only once per window, at the root, and listens on the document: screens and dialogs appear and disappear, and none of them has to remember anything. It draws nothing. The application passes it `show` (the function that opens the system menu) and optionally `clipboard` (if it does not use the default Rust commands).

### Props
- `show` (function) — Opens the system menu and returns the chosen item. Receives `(entries: TextMenuEntry[], event: MouseEvent)` and returns `Promise<{ id: string } | null | undefined>`. **Required**.
- `clipboard` (TextClipboard) — Clipboard interface with `read()` and `write(text)`. Without it, uses the Rust commands `clipboard_read_text` and `clipboard_write_text`. Default: `undefined`.
- `copyLabel` (string) — Text for the copy action. Default: `undefined`.
- `cutLabel` (string) — Text for the cut action. Default: `undefined`.
- `pasteLabel` (string) — Text for the paste action. Default: `undefined`.
- `selectAllLabel` (string) — Text for the select all action. Default: `undefined`.

### Usage
```vue
<script setup lang="ts">
import TextContextMenu from '../text/TextContextMenu.vue'
import { useContextMenu } from '@tauri-apps/plugin-context-menu'

const { show } = useContextMenu()
</script>

<template>
  <TextContextMenu :show="show" />
</template>
```

### Notes
- The default clipboard goes through Rust (`clipboard_read_text` / `clipboard_write_text`), because WebKitGTK does not implement the `clipboard-read` permission and `navigator.clipboard.readText()` returns nothing.
- Texts come from the properties, the catalog (`textMenu.copy`, `textMenu.cut`, `textMenu.paste`, `textMenu.selectAll`), or the English fallback.
- Cut deletes the range that was copied, not the one selected when choosing.
