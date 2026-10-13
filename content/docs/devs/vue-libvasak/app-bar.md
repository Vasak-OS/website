---
title: "Window | AppBar"
weight: 192
description: "Barra de ventana con ranuras para identidad, título, contenido, centro y acciones."
---

# `AppBar`

### Descripción
- Barra de la ventana en cualquiera de los cuatro lados, con ranuras para identidad, título, contenido, centro y acciones.

### Props
- `position` (`PosicionDeLaBarra | null`) — Posición de la barra. Sin esto, la del marco que la envuelve. Por defecto: `null`.
- `title` (string) — Título de la ventana. Por defecto: `''`.
- `minimizeLabel` (string) — Nombre accesible del botón de minimizar.
- `maximizeLabel` (string) — Nombre accesible del botón de maximizar.
- `closeLabel` (string) — Nombre accesible del botón de cerrar.
- `controls` (`ControlDeVentana[]`) — Cuáles de los tres botones de ventana lleva. Por defecto: los tres.

### Emite
- `minimize` — Se emite cuando se hace clic en minimizar.
- `maximize` — Se emite cuando se hace clic en maximizar.
- `close` — Se emite cuando se hace clic en cerrar.

### Uso
```vue
<script setup lang="ts">
import AppBar from '../window/AppBar.vue'
</script>

<template>
  <AppBar title="Mi aplicación" position="top">
    <template #identidad>
      <img src="/logo.svg" alt="Logo" />
    </template>
    <template #acciones>
      <button>Ajustes</button>
    </template>
  </AppBar>
</template>
```

### Notas
- La ranura `centro` se posiciona encima de la barra, centrada respecto de la ventana.
- Con la barra vertical, el centro va en la columna.
- Los controles de ventana van al final, salvo con orden invertido estilo macOS.
