---
title: "Forms | SwitchTrack"
weight: 196
description: "Vía y pulgar de interruptor, solo el dibujo sin lógica de estado."
---

# `SwitchTrack`

### Descripción
- La vía y el pulgar de un interruptor. Solo el dibujo, sin lógica de estado.

### Props
- `on` (boolean) — Estado del interruptor. **Requerido**.
- `size` (`'small' | 'medium'`) — Tamaño del interruptor. Por defecto: `'small'`.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SwitchTrack from '../forms/SwitchTrack.vue'
const enabled = ref(false)
</script>

<template>
  <button role="switch" :aria-checked="enabled" @click="enabled = !enabled">
    <SwitchTrack :on="enabled" size="small" />
  </button>
</template>
```

### Notas
- No escucha eventos ni emite; el botón que lo contiene maneja la interacción.
- Va marcado `aria-hidden` para evitar lecturas duplicadas en lectores de pantalla.
