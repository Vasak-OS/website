---
title: "Control | Disclosure"
weight: 138
description: "Disclosure: sección desplegable accesible con controlado (v-model) o no controlado, variantes plain y card."
---

# `Disclosure`

### Descripción
- Sección desplegable accesible (patrón WAI-ARIA disclosure): la cabecera es un `<button>` con `aria-expanded` y `aria-controls` que abre y cierra una región de contenido.

### Props
- `title` (string) — Título de la cabecera. **Requerido**.
- `open` (boolean) — Controlado: estado abierto/cerrado. Sin él, el componente se maneja solo. Por defecto: `undefined`.
- `defaultOpen` (boolean) — Estado inicial cuando no es controlado. Por defecto: `false`.
- `variant` (`'plain' | 'card'`) — `plain` es fila suelta; `card` la pone en tarjeta con borde y superficie. Por defecto: `'plain'`.
- `disabled` (boolean) — Deshabilita la interacción. Por defecto: `false`.

### Emite
- `update:open` (boolean) — Se emite con el nuevo estado al alternar.
- `toggle` (boolean) — Se emite con el nuevo estado al alternar.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import Disclosure from '../disclosure/Disclosure.vue'

const open = ref(false)
</script>

<template>
  <Disclosure v-model:open="open" title="Opciones avanzadas" variant="card">
    <p>Contenido desplegable</p>
  </Disclosure>
</template>
```

### Notas
- `open` es `undefined` por omisión a propósito: una prop `boolean` no pasada llega como `false` y rompería el modo no controlado.
- La ranura `meta` va a la derecha de la cabecera (contadores, insignias).
- La ranura `title` permite personalizar el contenido de la cabecera.
