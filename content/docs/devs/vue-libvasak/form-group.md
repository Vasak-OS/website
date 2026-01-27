---
title: "Formulario | FormGroup"
weight: 35
---

# `FormGroup`

Descripción
- Contenedor para etiquetas y campos de formulario. Provee espacio y estilos base para agrupar inputs.

Props
- `label` (string) — Texto de la etiqueta. **Requerido**.
- `htmlFor` (string) — Valor `for` del elemento `label`. Por defecto: `''`.
- `customClass` (string | Record<string, boolean>) — Clases adicionales para el contenedor.
- `labelClass` (string | Record<string, boolean>) — Clases adicionales para la etiqueta.

Slots
- Default — Coloca el control de formulario (input, select, etc.).

Uso
```vue
<script setup lang="ts">
import FormGroup from '../forms/FormGroup.vue'
</script>

<template>
  <FormGroup label="Nombre" htmlFor="nombre">
    <input id="nombre" class="input" />
  </FormGroup>
</template>
```

