---
title: "Panel | WorkspaceSwitcher"
weight: 186
description: "Selector de espacios de trabajo en píldora con navegación por teclado."
---

# `WorkspaceSwitcher`

### Descripción
- Píldora de espacios de trabajo: un número por espacio, el activo resaltado en el color primario.

### Props
- `count` (number) — Cuántos espacios hay. **Requerido**.
- `modelValue` (number) — Índice del espacio actual, desde 0. Por defecto: `0`.
- `label` (string) — Nombre accesible del grupo.
- `labels` (`readonly string[]`) — Nombre de cada espacio, ya traducido.
- `orientation` (`'horizontal' | 'vertical'`) — Orientación de la píldora. Por defecto: `'horizontal'`.
- `disabled` (boolean) — Deshabilita la interacción. Por defecto: `false`.
- `flat` (boolean) — Sin fondo ni canto propios. Por defecto: `false`.

### Emite
- `update:modelValue` — Se emite cuando se elige otro espacio.
- `change` — Se emite cuando se elige otro espacio.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import WorkspaceSwitcher from '../panel/WorkspaceSwitcher.vue'
const current = ref(0)
</script>

<template>
  <WorkspaceSwitcher
    v-model="current"
    :count="6"
    orientation="horizontal"
  />
</template>
```

### Notas
- Las flechas mueven el foco sin cambiar de espacio; se elige con Enter, Espacio o clic.
- Con `flat` la píldora no dibuja fondo propio cuando el panel ya tiene una superficie.
