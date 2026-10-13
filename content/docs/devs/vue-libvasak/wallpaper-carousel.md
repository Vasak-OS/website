---
title: "Media | WallpaperCarousel"
weight: 188
description: "Selector rápido de fondos con tarjetas inclinadas y navegación por teclado."
---

# `WallpaperCarousel`

### Descripción
- Selector rápido de fondos de pantalla: una fila de tarjetas inclinadas que se solapan, con la del centro al frente.

### Props
- `items` (`readonly WallpaperItem[]`) — Lista de fondos disponibles. **Requerido**.
- `current` (`string | null`) — El fondo aplicado ahora; abre centrado en él y lleva la marca. Por defecto: `null`.
- `label` (string) — Nombre accesible de la fila.
- `moreLabel` (string) — Etiqueta de la tarjeta final que emite `more`. Sin esto no está.
- `emptyLabel` (string) — Texto cuando no hay ningún fondo.
- `videoLabel` (string) — Nombre accesible de la marca de video.
- `currentLabel` (string) — Nombre accesible de la marca de aplicado.

### Emite
- `apply` — Se emite cuando se elige un fondo.
- `more` — Se emite cuando se elige la tarjeta final.
- `close` — Se emite con Escape.
- `focus` — Se emite cuando cambia el fondo del centro.
- `preview` — Se emite con el ID del fondo en previsualización o `null`.

### Uso
```vue
<script setup lang="ts">
import WallpaperCarousel from '../media/WallpaperCarousel.vue'
const wallpapers = [
  { id: 'wp1', label: 'Montaña', thumbnail: '/thumbs/wp1.jpg' },
]
</script>

<template>
  <WallpaperCarousel
    :items="wallpapers"
    current="wp1"
    more-label="Ver todos"
    @apply="setWallpaper"
    @close="close"
  />
</template>
```

### Notas
- Se navega con flechas, rueda, arrastre o clic; no da la vuelta en los extremos.
- Solo un video se reproduce a la vez, controlado por `preview`.
