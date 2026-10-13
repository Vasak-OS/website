---
title: "Formularios | Slider"
weight: 110
description: "Slider: deslizador desnudo con vía y pulgar, ranuras en los extremos y emisión perezosa al soltar."
---

# `Slider`

### Descripción
- Un deslizador desnudo: la vía, el pulgar y nada más. Es lo que va dentro de `SliderControl` y lo que hace falta en una fila de ajustes o en el visor de fotos.
- Usa un `input type="range"` nativo: el teclado (flechas, Inicio, Fin, AvPág/RePág), el rol `slider` y sus `aria-value*` los pone el navegador.
- `label` es obligatorio: un deslizador sin nombre se anuncia «control deslizante, 47» sin decir de qué.

### Props
- `modelValue` (number) — El valor actual. **Requerido**.
- `label` (string) — Qué regula, ya traducido. Es su nombre accesible. **Requerido**.
- `min` (number) — Valor mínimo. Por defecto: `0`.
- `max` (number) — Valor máximo. Por defecto: `100`.
- `step` (number) — Paso entre valores. Por defecto: `1`.
- `valueText` (string | ((value: number) => string)) — Lo que se oye en lugar del número, o cómo armarlo a partir de él.
- `disabled` (boolean) — Deshabilita el deslizador. Por defecto: `false`.
- `id` (string) — El `id` del `input`.
- `describedBy` (string) — El `id` del texto que lo explica.
- `lazy` (boolean) — Avisa al soltar y no en cada paso. Por defecto: `false`.

### Emite
- `update:modelValue` — Se emite con el nuevo valor en cada paso (o al soltar, con `lazy`).
- `change` — Se emite al soltar el pulgar o al terminar con el teclado, con el valor final.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import Slider from '../forms/Slider.vue'

const volume = ref(47)
</script>

<template>
  <Slider
    v-model="volume"
    label="Volumen"
    :value-text="v => v + ' %'"
    @change="value => console.log(value)"
  />
</template>
```

### Notas
- Las ranuras `start` y `end` son las etiquetas de los extremos: «Más lento» y «Más rápido», o el icono del volumen bajo y alto.
- `valueText` se usa como `aria-valuetext` y es lo que oye un lector de pantalla en lugar del número.
- Con `lazy` en `true`, `update:modelValue` se emite una sola vez al soltar, para lo que cuesta caro aplicar en cada movimiento.
