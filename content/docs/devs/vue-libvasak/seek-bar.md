---
title: "Media | SeekBar"
weight: 162
description: "SeekBar: barra de reproducción arrastrable con tiempos, búsqueda por teclado y control nativo invisible."
---

# `SeekBar`

### Descripción
- Barra de progreso para reproductores de audio y vídeo. Muestra tiempo transcurrido, duración y un tirador arrastrable.
- Usa un `<input type="range">` invisible sobre un dibujo de `div`, para aprovechar el arrastre nativo, el teclado y la accesibilidad.
- Con `duration` en cero no se dibuja nada (streams en vivo); con `seekable` en falso la barra se muestra pero no se puede mover.

### Props
- `position` (number) — Posición actual en la misma unidad que `duration`. **Requerido**.
- `duration` (number) — Duración total. En cero, no se dibuja la barra. **Requerido**.
- `seekable` (boolean) — Si el reproductor permite saltar. Por defecto: `true`.
- `step` (number) — Cuánto avanza con las flechas del teclado, en la misma unidad. Por defecto: `1`.
- `format` ((value: number) => string) — Cómo se escribe un tiempo. Por defecto: `formatPlaybackTime`.
- `label` (string) — Etiqueta para el lector de pantalla. Sin esto, se usa `media.seek` del catálogo. Por defecto: `undefined`.

### Emite
- `seek` (number) — Se emite al soltar el tirador, con la nueva posición en la unidad de `position`.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SeekBar from '../media/SeekBar.vue'

const position = ref(0)
const duration = ref(180)
</script>

<template>
  <SeekBar
    :position="position"
    :duration="duration"
    :seekable="true"
    :step="5"
    @seek="position = $event"
  />
</template>
```

### Notas
- `position`, `duration` y `step` van en la misma unidad (segundos, microsegundos, etc.); `format` es lo único que la conoce.
- El tirador aparece al pasar el puntero o al enfocar, y se miente la posición durante el arrastre.
