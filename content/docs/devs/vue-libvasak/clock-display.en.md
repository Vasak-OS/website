---
title: "Data | ClockDisplay"
weight: 154
description: "ClockDisplay: large clock with optional date, small seconds, and legibility halo over wallpapers."
---

# `ClockDisplay`

### Description
Component that displays the time in large, with the date below. The timer aligns to the next minute and then advances one by one (or one per second with `seconds`), so it does not wake the machine every second. With `now` there is no timer: it shows that fixed time, for a sandbox or a test. The time and date come from `Intl` with the provided locale or the system one. `legible` adds a window-color halo around the letters to hold it over a wallpaper. With `smallSeconds`, the seconds go separately, smaller and dimmed, attached at the top right of the minutes.

### Props
- `size` (`'md'|'lg'`) — Clock size. Default: `'lg'`.
- `showDate` (boolean) — Shows the date below the time. Default: `true`.
- `seconds` (boolean) — Shows seconds. Default: `false`.
- `locale` (string) — Language for formatting, like `es-AR`. Without it, the system one. Default: `undefined`.
- `hour12` (boolean) — Forces 12 or 24 hours. Without it, what the language dictates. Default: `undefined`.
- `legible` (boolean) — Adds the legibility halo for wallpapers. Default: `false`.
- `now` (Date) — Fixed time, no timer. Default: `undefined`.
- `align` (`'start'|'center'`) — Content alignment. Default: `'center'`.
- `smallSeconds` (boolean) — With `seconds`, shows smaller dimmed seconds. Default: `false`.

### Usage
```vue
<script setup lang="ts">
import ClockDisplay from '../data/ClockDisplay.vue'
</script>

<template>
  <ClockDisplay
    size="lg"
    :show-date="true"
    :seconds="true"
    :small-seconds="true"
    locale="es-AR"
  />
</template>
```

### Notes
- Rendered in a `<time>` with `datetime`, without `aria-live`: a clock announced every minute is noise.
- The digits are tabular (`tabular-nums`) so the time does not jump when it changes.
- It shrinks on its own if the container is narrower than the time (`@container`).
