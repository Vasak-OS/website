---
title: "Window | WindowControls"
weight: 176
description: "Botones de minimizar, maximizar y cerrar con estilos plano y macOS."
---

# `WindowControls`

### Descripción
- Botones de minimizar, maximizar y cerrar la ventana, con estilos plano y macOS.

### Props
- `controls` (`ControlDeVentana[]`) — Cuáles de los tres botones se dibujan y en qué orden. Por defecto: los tres.
- `minimizeLabel` (string) — Nombre accesible del botón de minimizar.
- `maximizeLabel` (string) — Nombre accesible del botón de maximizar.
- `closeLabel` (string) — Nombre accesible del botón de cerrar.
- `variant` (`WindowControlsStyle | null`) — Fija el estilo visual, ignorando la preferencia del escritorio. Por defecto: `null`.
- `order` (`WindowControlsOrder | null`) — Fija el orden de los botones, ignorando la preferencia. Por defecto: `null`.

### Emite
- `minimize` — Se emite cuando se hace clic en minimizar y hay un listener.
- `maximize` — Se emite cuando se hace clic en maximizar y hay un listener.
- `close` — Se emite cuando se hace clic en cerrar y hay un listener.

### Uso
```vue
<script setup lang="ts">
import WindowControls from '../window/WindowControls.vue'
</script>

<template>
  <WindowControls
    :controls="['minimize', 'maximize', 'close']"
    @close="handleClose"
  />
</template>
```

### Notas
- Si no hay listener para un evento, el botón ejecuta la acción directamente sobre la ventana.
- El estilo macOS muestra los tres círculos de colores con el icono al pasar el cursor.
