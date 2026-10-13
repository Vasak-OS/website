---
title: "Formulario | MarqueeText"
weight: 206
description: "MarqueeText: texto de una sola línea que se desliza automáticamente cuando no entra en su contenedor."
---

# `MarqueeText`

### Descripción
Texto en una sola línea que, si no entra en su contenedor, se desliza de forma alternada para leerse entero en lugar de cortarse con puntos suspensivos. Sólo se mueve cuando sobra texto; si el texto cabe, permanece estático. El texto está completo en el DOM, de modo que los lectores de pantalla lo íntegro. Con `prefers-reduced-motion` la animación se apaga y el texto cae a una línea con elipsis.

### Props
- `text` (string) — El texto ya traducido. **Requerido**.
- `speed` (number) — Velocidad de deslizamiento en píxeles por segundo. Por defecto: `36`.

### Uso
```vue
<script setup lang="ts">
import MarqueeText from '../forms/MarqueeText.vue'
</script>

<template>
  <MarqueeText text="Tiempo de pantalla" :speed="40" />
</template>
```

### Notas
- La animación es `alternate`: el texto va y vuelve con pausas en los extremos para facilitar la lectura.
- Un piso de 1,2 segundos evita que un sobrante pequeño cause un parpadeo perceptible.
