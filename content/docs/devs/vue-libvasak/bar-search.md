---
title: "Bar | BarSearch"
weight: 178
description: "Campo de búsqueda plegable para la barra de la ventana con desplegable flotante."
---

# `BarSearch`

### Descripción
- Campo de búsqueda plegable para la barra de la ventana, con desplegable flotante al abrir.

### Props
- `modelValue` (string) — Valor de la búsqueda. Por defecto: `''`.
- `placeholder` (string) — Texto de marcador de posición. Por defecto: `''`.
- `label` (string) — Nombre accesible del botón de lupa.
- `collapsed` (boolean) — Plegado aunque la barra sea horizontal. Por defecto: `false`.
- `disabled` (boolean) — Deshabilita el campo. Por defecto: `false`.
- `debounce` (number) — Tiempo de rebote en milisegundos. En cero, `search` sale solo con Enter. Por defecto: `0`.

### Emite
- `update:modelValue` — Se emite al escribir en el campo.
- `search` — Se emite cuando se ejecuta la búsqueda.
- `open` — Se emite cuando se despliega el campo.
- `close` — Se emite cuando se pliega el campo.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import BarSearch from '../bar/BarSearch.vue'
const query = ref('')
</script>

<template>
  <BarSearch
    v-model="query"
    placeholder="Buscar"
    :collapsed="true"
    @search="performSearch"
  />
</template>
```

### Notas
- Con la barra vertical siempre está plegado; con la barra horizontal decide la aplicación.
- Se cierra automáticamente con Escape o al salir el foco.
