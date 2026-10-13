---
title: "Formularios | SegmentedControl"
weight: 108
description: "SegmentedControl: grupo de opciones de una sola elección, como carril segmentado o chips, con navegación."
---

# `SegmentedControl`

### Descripción
- Unas pocas opciones de una sola elección, una al lado de la otra: lista o cuadrícula, claro u oscuro, el ancho de la sangría.
- Variante `segmented`: un carril con canto fino y las opciones adentro; la elegida lleva el velo de acento y peso 600.
- Variante `chips`: pastillas sueltas que se acomodan en varias líneas, para un filtro con muchas opciones.
- Con `href` en las opciones el control es una navegación (`<nav>`) con enlaces y `aria-current="page"` en la actual.

### Props
- `options` (`SegmentedOption<T>[]`) — Las opciones del control. **Requerido**.
- `label` (string) — El nombre del grupo, ya traducido. **Requerido**.
- `variant` (`'segmented' | 'chips'`) — Estilo visual. Por defecto: `'segmented'`.
- `disabled` (boolean) — Deshabilita todas las opciones. Por defecto: `false`.

### Emite
- `change` — Se emite con el valor elegido cuando el usuario selecciona una opción distinta.
- `navigate` — Se emite con el valor y el `MouseEvent` cuando se elige un enlace; `event.preventDefault()` deja que la aplicación navegue con su enrutador.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SegmentedControl from '../forms/SegmentedControl.vue'

const view = ref<'list' | 'grid'>('list')
</script>

<template>
  <SegmentedControl
    v-model="view"
    label="Vista"
    :options="[
      { value: 'list', label: 'Lista' },
      { value: 'grid', label: 'Cuadrícula' },
    ]"
    @change="value => console.log(value)"
  />
</template>
```

### Notas
- `SegmentedOption` acepta `icon`, `iconOnly`, `badge`, `badgeTone`, `disabled` y `href` además de `value` y `label`.
- El teclado funciona como `OptionGroup`: un solo Tab para entrar y salir, y las flechas eligen.
- Las opciones se parten en dos líneas antes de salirse; cada una tiene un mínimo de 32 px de alto.
