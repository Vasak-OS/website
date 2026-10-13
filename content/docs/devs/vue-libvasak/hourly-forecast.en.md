---
title: "Data | HourlyForecast"
weight: 184
description: "Hourly forecast with arc or strip layout and center slot support."
---

# `HourlyForecast`

### Description
- Hourly forecast: time, icon and temperature for each hour, in an arc or horizontal strip.

### Props
- `hours` (`readonly ForecastHour[]`) — List of hours with time, icon and temperature. **Required**.
- `current` (`number | null`) — Index of the current hour. Default: none.
- `layout` (`'arc' | 'strip'`) — Visual distribution. Default: `'arc'`.
- `locale` (string) — Language for time formatting. Defaults to system.
- `hour12` (boolean) — Force 12 or 24 hour format. Defaults to locale setting.
- `label` (string) — Accessible name for the list.

### Usage
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

### Notes
- In arc layout, hours are distributed over a half-oval and the default slot goes in the center.
- With less than 20 rem of width, the arc automatically switches to a horizontal strip.
