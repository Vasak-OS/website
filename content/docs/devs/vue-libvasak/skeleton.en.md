---
title: "Feedback | Skeleton"
weight: 142
description: "Skeleton: animated placeholder for loading content, with line, block, and circle shapes."
---

# `Skeleton`

### Description
- Animated placeholder (`animate-pulse`) for content that has not arrived yet: text lines, blocks, avatars. Decorative, not announced to screen readers.

### Props
- `width` (`string | number`) — CSS width (`'60%'`, `'3rem'`) or pixels. Without it, it takes the available width without overflowing.
- `height` (`string | number`) — CSS height or pixels.
- `shape` (`'line' | 'block' | 'circle'`) — Placeholder shape. Default: `'line'`.

### Usage
```vue
<script setup lang="ts">
import Skeleton from '../feedback/Skeleton.vue'
</script>

<template>
  <Skeleton shape="circle" :width="48" :height="48" />
  <Skeleton shape="line" height="1rem" />
  <Skeleton shape="block" height="6rem" />
</template>
```

### Notes
- `circle` is square: without height, it uses the width.
- With reduced motion, the animation is disabled (`motion-reduce:animate-none`).
- Without `width`, it never exceeds the container's width.
