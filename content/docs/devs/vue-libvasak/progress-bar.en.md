---
title: "Form | ProgressBar"
weight: 102
description: "ProgressBar: progress bar with full ARIA, indeterminate state and optional value row."
---

# `ProgressBar`

### Description
- Progress bar with full ARIA (`role="progressbar"` and its value attributes). With `value` as `null` it shows a full-width indeterminate state. Optionally adds a row with label and percentage.

### Props
- `value` (number | null) — From 0 to 100. `null` for indeterminate. **Required**.
- `label` (string) — What is progressing. Read by screen readers. **Required**.
- `tone` (`'normal'|'warning'|'critical'`) — The stripe color, for bars measuring a level. Default: `'normal'`.
- `size` (`'xs'|'sm'|'md'`) — Bar height. Default: `md`.
- `showValue` (boolean) — The row above with label and percentage. Default: `false`.
- `decimals` (number) — Decimal digits of the percentage. Default: `0`.

### Usage
```vue
<script setup lang="ts">
import ProgressBar from '../forms/ProgressBar.vue'
const progress = ref(45)
</script>

<template>
  <ProgressBar
    :value="progress"
    label="File download"
    :show-value="true"
    :decimals="1"
  />
</template>
```

### Notes
- With `value` as `null` the bar displays indeterminate at full width: a short band reads as a false percentage.
- The percentage only shows with `showValue` and when the value is determinate.
- The value is automatically clamped between 0 and 100.
