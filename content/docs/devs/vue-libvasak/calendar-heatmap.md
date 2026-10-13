---
title: "Data | CalendarHeatmap"
weight: 182
description: "Mapa de calor mensual con un cuadrito por día y niveles de intensidad de color."
---

# `CalendarHeatmap`

### Descripción
- Mapa de calor de un mes: un cuadrito por día, con intensidad de color según el valor.

### Props
- `year` (number) — Año del mes a mostrar. **Requerido**.
- `month` (number) — Mes, de 1 a 12. **Requerido**.
- `values` (`Partial<Record<number, number>>`) — Valor de cada día del mes, por número de día (1–31). **Requerido**.
- `max` (number) — Valor que llena el cuadro. Sin esto, el más alto del mes.
- `today` (number) — El día de hoy, si cae en este mes.
- `selected` (number) — El día elegido, si hay uno.
- `weekStart` (`0 | 1`) — Día de inicio de semana: 0 domingo, 1 lunes. Por defecto: `1`.
- `locale` (string) — Idioma para formato de fechas, como `es-AR`. Sin esto, el del sistema.
- `title` (string) — Título superior. Sin esto, el nombre del mes; vacío, sin título.
- `formatValue` (`(value: number) => string`) — Cómo se escribe un valor en el nombre de cada día.

### Uso
```vue
<script setup lang="ts">
import CalendarHeatmap from '../data/CalendarHeatmap.vue'
const values = { 1: 30, 5: 120, 10: 60 }
</script>

<template>
  <CalendarHeatmap
    :year="2026"
    :month="10"
    :values="values"
    :today="13"
  />
</template>
```

### Notas
- Cinco niveles de color: sin valor, la vía; con valor, cuatro intensidades según la proporción del máximo.
- Cada día incluye su valor en texto accesible y en el tooltip nativo.
