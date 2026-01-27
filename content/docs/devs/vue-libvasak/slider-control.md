---
title: "Formulario | SliderControl"
weight: 35
---

# `SliderControl`

Descripción
- Control deslizante personalizado con icono, porcentaje calculado y opción de boton lateral.

Props
- `icon` (string) — Ruta del icono mostrado.
- `alt` (string) — Texto alternativo del icono. Por defecto: `''`.
- `tooltip` (string) — Texto `title` del icono.
- `modelValue` (number) — Valor actual del deslizador (v-model).
- `min` (number) — Valor mínimo. Por defecto: `0`.
- `max` (number) — Valor máximo. Por defecto: `100`.
- `showButton` (boolean) — Muestra botón con icono a la izquierda. Por defecto: `false`.
- `iconClass` (string | Record<string, boolean>) — Clases para el icono.
- `getPercentageClass` ((percentage: number) => string) — Callback opcional para retornar clases CSS según porcentaje.

Emite
- `update:modelValue` — Emite el nuevo valor numérico al arrastrar el slider.
- `buttonClick` — Cuando se hace click en el botón lateral.

Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SliderControl from '../forms/SliderControl.vue'
const value = ref(40)
</script>

<template>
  <SliderControl
    icon="/icons/volume.svg"
    v-model="value"
    :min="0"
    :max="100"
    @update:modelValue="val => console.log(val)"
  />
</template>
```

Notas
- `getPercentageClass` permite cambiar el color del texto de porcentaje según valor.

