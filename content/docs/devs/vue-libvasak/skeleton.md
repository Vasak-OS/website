---
title: "Feedback | Skeleton"
weight: 142
description: "Skeleton: placeholder animado para contenido en carga, con formas line, block y circle."
---

# `Skeleton`

### Descripción
- Placeholder animado (`animate-pulse`) para contenido que todavía no llegó: líneas de texto, bloques, avatares. Decorativo, no se anuncia a lectores de pantalla.

### Props
- `width` (`string | number`) — Ancho CSS (`'60%'`, `'3rem'`) o píxeles. Sin él, ocupa el ancho disponible sin desbordar.
- `height` (`string | number`) — Alto CSS o píxeles.
- `shape` (`'line' | 'block' | 'circle'`) — Forma del placeholder. Por defecto: `'line'`.

### Uso
```vue
<script setup lang="ts">
import Skeleton from '../feedback/Skeleton.vue'
</script>

<template>
  <Skeleton shape="circle" :width="48" :height="48" />
  <Skeleton shape="line" height="1rem" />
  <Skeleton shape="block" height="6rem" />
</template>
```

### Notas
- `circle` es cuadrado: sin alto, usa el ancho.
- Con movimiento reducido, la animación se desactiva (`motion-reduce:animate-none`).
- Sin `width`, nunca excede el ancho del contenedor.
