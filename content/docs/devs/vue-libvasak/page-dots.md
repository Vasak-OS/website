---
title: "Control | PageDots"
weight: 208
description: "Puntos para pasar de una página a otra: un grupo de botones con navegación de teclado y el activo como píldora."
---

# `PageDots`

### Descripción
- Grupo de puntos que permiten pasar de una página a otra. El punto activo se muestra como una píldora alargada; el resto como puntos pequeños. Es accesible por teclado con flechas, Inicio y Fin, y se oculta automáticamente cuando hay una sola página.

### Props
- `count` (number) — Cuántas páginas hay. **Requerido**.
- `modelValue` (number) — Índice de la página activa, desde 0. Por defecto: `0`.
- `label` (string) — Nombre del grupo, ya traducido, para lectores de pantalla.
- `labels` (readonly string[]) — Nombre de cada punto, ya traducidos. Si falta uno, se usa «N de M».
- `disabled` (boolean) — Deshabilita la selección. Por defecto: `false`.

### Emite
- `update:modelValue` (index: number) — Cuando cambia la página activa.
- `change` (index: number) — Cuando se selecciona otra página.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import PageDots from '../controls/PageDots.vue'
const page = ref(0)
</script>

<template>
  <PageDots
    :count="3"
    v-model="page"
    label="Páginas"
  />
</template>
```

### Notas
- Con `count` en 0 o 1 no se dibuja nada.
- Cada botón mide 32 px para facilitar el puntero, aunque el punto sea de 8 px.
