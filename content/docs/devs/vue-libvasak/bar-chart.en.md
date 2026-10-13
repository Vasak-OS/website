---
title: "Data | BarChart"
weight: 164
description: "BarChart: vertical bar chart with current-day support, short labels and labelled values."
---

# `BarChart`

### Description
- Compact, responsive bar chart for time series: days of the week, hours or months.
- Bars are boxes with percentage-based height, not SVG, to respect the design system.
- Accessible as a `figure` with a list of bars, each announced as "name: value".

### Props
- `bars` (BarChartItem[]) — The chart data. **Required**.
- `label` (string) — Chart name for the screen reader. **Required**.
- `max` (number) — The value that fills the bar. Without this, the highest of `bars`. Default: `undefined`.

### BarChartItem
- `label` (string) — Name below the bar («Mon»). **Required**.
- `shortLabel` (string) — Name when the full one does not fit («M»). Without this, the same as `label`. Default: `undefined`.
- `value` (number) — The bar value. **Required**.
- `valueLabel` (string) — Written value for tooltip and screen reader («4 h 13 min»). Default: `undefined`.
- `current` (boolean) — Marks the current bar (today, this hour) with the `ui-data` accent and `aria-current`. Default: `undefined`.
- `key` (string) — Vue key; without this, the `label`. Default: `undefined`.

### Usage
```vue
<script setup lang="ts">
import BarChart from '../data/BarChart.vue'

const bars = [
  { label: 'Mon', shortLabel: 'M', value: 3 },
  { label: 'Tue', shortLabel: 'T', value: 5, current: true },
  { label: 'Wed', shortLabel: 'W', value: 2 }
]
</script>

<template>
  <BarChart :bars="bars" label="Weekly usage" />
</template>
```

### Notes
- Occupies the given width and height, with an 80 px floor.
- Below 16 rem width, each bar shows its `shortLabel` instead of `label`.
- A bar with zero value is not drawn; a low-value bar is drawn with a minimum height of 4 %.
