---
title: "Feedback | ToastArea"
weight: 140
description: "ToastArea: teleported container for stacking transient notices with position, animation, and customizable slot."
---

# `ToastArea`

### Description
- Transient notice (toast) container teleported to `body`. Manages position, shape, animation, and accessibility; the queue (when they appear, how long they last) is decided by the application.

### Props
- `toasts` (`ToastNotice[]`) — List of notices to display. **Required**.
- `position` (`'bottom-right' | 'bottom-center' | 'top-right' | 'top-center'`) — Where they stack. Default: `'bottom-right'`.

### Emits
- `action` (`ToastNotice`) — Emitted when a notice's button is touched.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ToastArea, { type ToastNotice } from '../feedback/ToastArea.vue'

const toasts = ref<ToastNotice[]>([
  { id: 1, message: 'File copied', tone: 'success' }
])
</script>

<template>
  <ToastArea :toasts="toasts" position="bottom-right" />
</template>
```

### Notes
- `ToastNotice` includes: `id`, `message`, `tone`, `title`, `description`, `progress`, `action`.
- The default slot receives `{ toast, aviso }` to customize each notice's content.
- Notices with a progress bar use fixed width (`w-80`).
- At the top, the newest goes first (flush to the edge).
