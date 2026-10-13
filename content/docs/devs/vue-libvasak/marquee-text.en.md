---
title: "Form | MarqueeText"
weight: 206
description: "MarqueeText: single-line text that scrolls automatically when it does not fit in its container."
---

# `MarqueeText`

### Description
Text on a single line that, if it does not fit in its container, scrolls back and forth to be read in full instead of truncating with an ellipsis. It only moves when text overflows; if the text fits, it stays static. The full text is in the DOM, so screen readers announce it completely. With `prefers-reduced-motion`, the animation is disabled and the text falls back to a truncated line.

### Props
- `text` (string) — The already translated text. **Required**.
- `speed` (number) — Scroll speed in pixels per second. Default: `36`.

### Usage
```vue
<script setup lang="ts">
import MarqueeText from '../forms/MarqueeText.vue'
</script>

<template>
  <MarqueeText text="Tiempo de pantalla" :speed="40" />
</template>
```

### Notes
- The animation is `alternate`: the text goes and returns with pauses at the extremes to aid reading.
- A 1.2-second floor prevents a small overflow from causing a noticeable flicker.
