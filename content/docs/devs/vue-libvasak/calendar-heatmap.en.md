---
title: "Data | CalendarHeatmap"
weight: 182
description: "Monthly heatmap with one cell per day and color intensity levels."
---

# `CalendarHeatmap`

### Description
- Monthly heatmap: one cell per day, with color intensity based on the value.

### Props
- `year` (number) — Year of the month to display. **Required**.
- `month` (number) — Month, from 1 to 12. **Required**.
- `values` (`Partial<Record<number, number>>`) — Value for each day of the month, by day number (1–31). **Required**.
- `max` (number) — Value that fills the cell. Defaults to the highest in the month.
- `today` (number) — Today's day, if it falls in this month.
- `selected` (number) — The selected day, if any.
- `weekStart` (`0 | 1`) — Week start day: 0 Sunday, 1 Monday. Default: `1`.
- `locale` (string) — Language for date formatting, like `es-AR`. Defaults to system.
- `title` (string) — Top heading. Defaults to the month name; empty for no heading.
- `formatValue` (`(value: number) => string`) — How a value is written in each day's name.

### Usage
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

### Notes
- Five color levels: no value, the track; with value, four intensities based on the proportion of the maximum.
- Each day includes its value in accessible text and in the native tooltip.
