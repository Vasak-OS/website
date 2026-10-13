---
title: "Indicators | StatusDot"
weight: 130
description: "StatusDot: status indicator with predefined tones, custom color, pulse animation and outline for accessibility."
---

# `StatusDot`

### Description
Visual status indicator with semantic tones, custom color (external data), pulse animation and outline for accessibility.

### Props
- `tone` (`'neutral' | 'accent' | 'success' | 'warning' | 'error'`) — Semantic tone. Default: `'neutral'`.
- `color` (string) — Custom color in hex, RGB or CSS name. Overrides `tone`.
- `pulse` (boolean) — Enables pulse animation. Default: `false`.
- `label` (string) — Accessible name. If not provided, the dot is decorative.
- `size` (`'sm' | 'md'`) — Dot size. Default: `'sm'`.
- `outlined` (boolean) — Draws outline to guarantee 3:1 contrast. Default: `true`.

### Usage
```vue
<script setup lang="ts">
import StatusDot from '../indicators/StatusDot.vue'
</script>

<template>
  <div class="flex items-center gap-2">
    <StatusDot tone="success" label="Connected" />
    <span>Connected</span>
  </div>
  
  <div class="flex items-center gap-2">
    <StatusDot color="#ff5722" pulse />
    <span>Recording</span>
  </div>
</template>
```

### Notes
- `color` accepts any valid CSS value: hexadecimal, rgb(), var().
- `tone` and `color` are mutually exclusive: `color` takes precedence.
- The `outlined` border uses the `ui-border-strong` color, which guarantees 3:1 contrast with the background.
- Without `label`, the component is hidden from screen readers (`aria-hidden="true"`).
- The pulse respects `prefers-reduced-motion` automatically.
