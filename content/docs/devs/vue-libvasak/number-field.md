---
title: "Formulario | NumberField"
weight: 98
description: "NumberField: campo numérico con botones de paso, límites ajustados al salir y redondeo al paso."
---

# `NumberField`

### Descripción
- Campo numérico con botones de paso opcionales (− y +), límites que se ajustan al salir del campo y redondeo a las cifras del paso. Nunca emite `NaN`: si lo escrito no es un número, el campo vuelve a mostrar el último valor válido.

### Props
- `modelValue` (number) — Valor actual del campo. **Requerido**.
- `min` (number) — Valor mínimo permitido.
- `max` (number) — Valor máximo permitido.
- `step` (number) — Incremento de los botones de paso. Por defecto: `1`.
- `stepper` (boolean) — Muestra los botones − y + a los costados. Por defecto: `false`.
- `narrow` (boolean) — Del ancho de su contenido (128 px) en vez de llenar la fila. Por defecto: `false`.
- `invalid` (boolean) — Marca el campo como inválido visual y accesible. Por defecto: `false`.
- `disabled` (boolean) — Deshabilita el campo y los botones. Por defecto: `false`.
- `id` (string) — El `id` del `input`.
- `ariaLabel` (string) — Nombre accesible cuando no hay etiqueta visible.
- `describedBy` (string) — `id` del elemento que describe el campo.
- `placeholder` (string) — Texto de marcador de posición.
- `decrementLabel` (string) — Lo que se oye en el botón −. Sin esto, del catálogo o «Restar».
- `incrementLabel` (string) — Lo que se oye en el botón +. Sin esto, del catálogo o «Sumar».

### Emite
- `update:modelValue` (number) — Al escribir un valor válido o al salir del campo con el valor ajustado a los límites.
- `change` (number) — Al salir del campo o al apretar un botón de paso, con el valor ya ajustado.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import NumberField from '../forms/NumberField.vue'
const cantidad = ref(5)
</script>

<template>
  <NumberField
    v-model="cantidad"
    :min="1"
    :max="99"
    :stepper="true"
    aria-label="Cantidad"
  />
</template>
```

### Notas
- El ajuste a los límites y el redondeo al paso ocurren al salir del campo, no en cada tecla.
- Los botones de paso se apagan automáticamente al llegar a `min` o `max`.
