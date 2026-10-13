---
title: "Data | ProgressRing"
weight: 160
description: "ProgressRing: medidor circular con valor, nombre y unidad opcional para tableros y estadísticas."
---

# `ProgressRing`

### Descripción
- Medidor circular compacto que muestra un valor de 0 a 100 con un anillo cónico. El valor va dentro del anillo, el nombre debajo y una unidad opcional en un renglón propio.
- Dibuja con CSS (degradado cónico y máscara radial), no con SVG.
- Accesible como `role="meter"` con `aria-valuetext` que incluye nombre, valor y unidad.

### Props
- `value` (number | null) — Cuánto del anillo va lleno, de 0 a 100. `null` deja la pista sola. **Requerido**.
- `label` (string) — El nombre debajo del anillo («Humedad»). **Requerido**.
- `display` (string) — Lo que va adentro del anillo («71 %», «6»). Sin esto, el valor con «%». Por defecto: `undefined`.
- `unit` (string) — La unidad en un renglón propio debajo de `display` («km/h»). Por defecto: `undefined`.
- `size` (`'sm' | 'md'`) — Tamaño del anillo. Por defecto: `'md'`.

### Uso
```vue
<script setup lang="ts">
import ProgressRing from '../data/ProgressRing.vue'
</script>

<template>
  <ProgressRing
    :value="71"
    label="Humedad"
    unit="km/h"
    size="md"
  />
</template>
```

### Notas
- `value` se limita a 0–100 automáticamente.
- El `aria-valuetext` se construye como «{label}, {display} {unit}» cuando hay unidad.
- El anillo se dibuja con un degradado cónico de `--use-primary` y una máscara radial que deja un aro de 4 px.
