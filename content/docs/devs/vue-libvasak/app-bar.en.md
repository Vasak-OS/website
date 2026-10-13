---
title: "Window | AppBar"
weight: 192
description: "Window bar with slots for identity, title, content, center and actions."
---

# `AppBar`

### Description
- Window bar on any of the four sides, with slots for identity, title, content, center and actions.

### Props
- `position` (`PosicionDeLaBarra | null`) — Bar position. Defaults to the surrounding frame's position. Default: `null`.
- `title` (string) — Window title. Default: `''`.
- `minimizeLabel` (string) — Accessible name for the minimize button.
- `maximizeLabel` (string) — Accessible name for the maximize button.
- `closeLabel` (string) — Accessible name for the close button.
- `controls` (`ControlDeVentana[]`) — Which of the three window buttons are shown. Default: all three.

### Emits
- `minimize` — Emitted when minimize is clicked.
- `maximize` — Emitted when maximize is clicked.
- `close` — Emitted when close is clicked.

### Usage
```vue
<script setup lang="ts">
import AppBar from '../window/AppBar.vue'
</script>

<template>
  <AppBar title="My application" position="top">
    <template #identidad>
      <img src="/logo.svg" alt="Logo" />
    </template>
    <template #acciones>
      <button>Settings</button>
    </template>
  </AppBar>
</template>
```

### Notes
- The `centro` slot is positioned above the bar, centered relative to the window.
- With a vertical bar, the center goes in the column.
- Window controls go at the end, except with macOS-style reversed order.
