---
title: "Text | TextContextMenu"
weight: 156
description: "TextContextMenu: menú contextual del sistema para campos de texto, con copiar, cortar, pegar y seleccionar todo."
---

# `TextContextMenu`

### Descripción
Componente que dibuja el menú del clic derecho sobre los campos de texto usando el menú del sistema, como el resto del escritorio. Ofrece copiar, cortar, pegar y seleccionar todo. Se monta una sola vez por ventana, en la raíz, y escucha en el documento: las pantallas y los diálogos aparecen y desaparecen, y ninguno tiene que acordarse de nada. No dibuja nada. La aplicación le pasa `show` (la función que abre el menú del sistema) y opcionalmente `clipboard` (si no usa los comandos por defecto de Rust).

### Props
- `show` (función) — Abre el menú del sistema y devuelve lo elegido. Recibe `(entries: TextMenuEntry[], event: MouseEvent)` y devuelve `Promise<{ id: string } | null | undefined>`. **Requerido**.
- `clipboard` (TextClipboard) — Interfaz de portapapeles con `read()` y `write(text)`. Sin esto, usa los comandos `clipboard_read_text` y `clipboard_write_text` de Rust. Por defecto: `undefined`.
- `copyLabel` (string) — Texto para la acción copiar. Por defecto: `undefined`.
- `cutLabel` (string) — Texto para la acción cortar. Por defecto: `undefined`.
- `pasteLabel` (string) — Texto para la acción pegar. Por defecto: `undefined`.
- `selectAllLabel` (string) — Texto para la acción seleccionar todo. Por defecto: `undefined`.

### Uso
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

### Notas
- El portapapeles por defecto va por Rust (`clipboard_read_text` / `clipboard_write_text`), porque WebKitGTK no implementa el permiso `clipboard-read` y `navigator.clipboard.readText()` no devuelve nada.
- Los textos salen de las propiedades, del catálogo (`textMenu.copy`, `textMenu.cut`, `textMenu.paste`, `textMenu.selectAll`) o del respaldo en inglés.
- Cortar borra el tramo que se copió, no el que esté seleccionado al elegir.
