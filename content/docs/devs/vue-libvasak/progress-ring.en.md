---
title: "Data | ProgressRing"
weight: 160
description: "ProgressRing: circular gauge with value, label and optional unit for dashboards and statistics."
---

# `ProgressRing`

### Description
- Compact circular gauge displaying a value from 0 to 100 with a conic ring. The value goes inside the ring, the label below it and an optional unit on its own line.
- Drawn with CSS (conic gradient and radial mask), not SVG.
- Accessible as `role="meter"` with `aria-valuetext` including name, value and unit.

### Props
- `value` (number | null) — How much of the ring is filled, from 0 to 100. `null` leaves just the track. **Required**.
- `label` (string) — The name below the ring («Humidity»). **Required**.
- `display` (string) — What goes inside the ring («71 %», «6»). Without this, the value with «%». Default: `undefined`.
- `unit` (string) — The unit on its own line below `display` («km/h»). Default: `undefined`.
- `size` (`'sm' | 'md'`) — Ring size. Default: `'md'`.

### Usage
```vue
<script setup lang="ts">
import ProgressRing from '../data/ProgressRing.vue'
</script>

<template>
  <ProgressRing
    :value="71"
    label="Humidity"
    unit="km/h"
    size="md"
  />
</template>
```

### Notes
- `value` is automatically clamped to 0–100.
- The `aria-valuetext` is built as "{label}, {display} {unit}" when a unit is present.
- The ring is drawn with a conic gradient of `--use-primary` and a radial mask that leaves a 4 px arc.
