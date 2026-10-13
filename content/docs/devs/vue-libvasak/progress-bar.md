---
title: "Formulario | ProgressBar"
weight: 102
description: "ProgressBar: barra de progreso con ARIA completo, estado indeterminado y fila opcional con porcentaje."
---

# `ProgressBar`

### Descripción
- Barra de progreso con ARIA completo (`role="progressbar"` y sus atributos de valor). Con `value` en `null` muestra estado indeterminado a ancho completo. Opcionalmente añade una fila con etiqueta y porcentaje.

### Props
- `value` (number | null) — De 0 a 100. `null` para indeterminado. **Requerido**.
- `label` (string) — Qué está progresando. Lo lee un lector de pantalla. **Requerido**.
- `tone` (`'normal'|'warning'|'critical'`) — El color de la franja, para barras que miden un nivel. Por defecto: `'normal'`.
- `size` (`'xs'|'sm'|'md'`) — Alto de la barra. Por defecto: `'md'`.
- `showValue` (boolean) — La fila de arriba con la etiqueta y el porcentaje. Por defecto: `false`.
- `decimals` (number) — Las cifras decimales del porcentaje. Por defecto: `0`.

### Uso
```vue
<script setup lang="ts">
import ProgressBar from '../forms/ProgressBar.vue'
const progreso = ref(45)
</script>

<template>
  <ProgressBar
    :value="progreso"
    label="Descarga de archivos"
    :show-value="true"
    :decimals="1"
  />
</template>
```

### Notas
- Con `value` en `null` la barra se muestra indeterminada a ancho completo: una banda corta se lee como un porcentaje falso.
- El porcentaje se muestra solo con `showValue` y cuando el valor es determinado.
- El valor se recorta automáticamente entre 0 y 100.
