---
title: "Data | HourlyForecast"
weight: 184
description: "Pronóstico por hora con layout en arco o tira y soporte para ranura central."
---

# `HourlyForecast`

### Descripción
- Pronóstico por hora: hora, icono y temperatura de cada una, en arco o en tira horizontal.

### Props
- `hours` (`readonly ForecastHour[]`) — Lista de horas con hora, icono y temperatura. **Requerido**.
- `current` (`number | null`) — Índice de la hora actual. Sin esto, ninguna.
- `layout` (`'arc' | 'strip'`) — Distribución visual. Por defecto: `'arc'`.
- `locale` (string) — Idioma para formato de horas. Sin esto, el del sistema.
- `hour12` (boolean) — Forzar 12 o 24 horas. Sin esto, lo que diga el idioma.
- `label` (string) — Nombre accesible de la lista.

### Uso
```vue
<script setup lang="ts">
import HourlyForecast from '../data/HourlyForecast.vue'
const hours = [
  { time: '2026-10-13T14:00', icon: 'weather-clear', temperature: 22 },
  { time: '2026-10-13T15:00', icon: 'weather-clear', temperature: 24 },
]
</script>

<template>
  <HourlyForecast :hours="hours" :current="0" layout="arc">
    <ClockDisplay />
  </HourlyForecast>
</template>
```

### Notas
- En arco, las horas se reparten sobre medio óvalo y la ranura por omisión va en el centro.
- Con menos de 20 rem de ancho, el arco pasa automáticamente a tira horizontal.
