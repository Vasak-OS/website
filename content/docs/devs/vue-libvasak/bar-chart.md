---
title: "Data | BarChart"
weight: 164
description: "BarChart: gráfico de barras verticales con soporte para día actual, etiquetas cortas y valores etiquetados."
---

# `BarChart`

### Descripción
- Gráfico de barras compacto y responsive para series temporales: días de la semana, horas o meses.
- Las barras son cajas con alto en porcentaje, no SVG, para respetar el sistema de diseño.
- Accesible como `figure` con lista de barras, cada una anunciada como «nombre: valor».

### Props
- `bars` (BarChartItem[]) — Los datos del gráfico. **Requerido**.
- `label` (string) — Nombre del gráfico para el lector de pantalla. **Requerido**.
- `max` (number) — Valor que llena la barra. Sin esto, el más alto de `bars`. Por defecto: `undefined`.

### BarChartItem
- `label` (string) — Nombre debajo de la barra («Lun»). **Requerido**.
- `shortLabel` (string) — Nombre cuando no entra el otro («L»). Sin esto, el mismo `label`. Por defecto: `undefined`.
- `value` (number) — Valor de la barra. **Requerido**.
- `valueLabel` (string) — Valor escrito para el globo y el lector de pantalla («4 h 13 min»). Por defecto: `undefined`.
- `current` (boolean) — Marca la barra actual (hoy, esta hora) con el acento `ui-data` y `aria-current`. Por defecto: `undefined`.
- `key` (string) — Clave de Vue; sin esto, el `label`. Por defecto: `undefined`.

### Uso
```vue
<script setup lang="ts">
import BarChart from '../data/BarChart.vue'

const bars = [
  { label: 'Lun', shortLabel: 'L', value: 3 },
  { label: 'Mar', shortLabel: 'M', value: 5, current: true },
  { label: 'Mié', shortLabel: 'X', value: 2 }
]
</script>

<template>
  <BarChart :bars="bars" label="Uso semanal" />
</template>
```

### Notas
- Ocupa el ancho y alto que le den, con un piso de 80 px.
- Por debajo de 16 rem de ancho, cada barra muestra su `shortLabel` en lugar de `label`.
- Una barra con valor cero no se dibuja; una valor bajo se dibuja con un alto mínimo del 4 %.
