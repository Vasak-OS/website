---
title: "Feedback | LoadingState"
weight: 92
description: "LoadingState: full-screen waiting indicator with accessible label and compact option."
---

# `LoadingState`

### Description
- Component shown while waiting for something that fills the screen. It is the sibling of `EmptyState`: the same space, but it is not yet known whether it will end up empty.

### Props
- `label` (string) — What is being waited for, already translated: "Loading photos…". **Required**.
- `bordered` (boolean) — Draws a dashed border, for a box inside a section. Default: `false`.
- `size` (`'sm'|'md'`) — `sm` is the compact row with the 16 px ring beside the text; `md` is the large centered ring on top. Default: `'md'`.

### Usage
```vue
<script setup lang="ts">
import LoadingState from '../feedback/LoadingState.vue'
</script>

<template>
  <!-- Large wait that fills the screen -->
  <LoadingState label="Loading photos…" />

  <!-- Compact row inside a list -->
  <LoadingState size="sm" label="Loading…" />

  <!-- Box with dashed border inside a section -->
  <LoadingState bordered label="Exploring packages…" />
</template>
```

### Notes
- Carries `role="status"` and `aria-atomic="true"`: announces the wait without interrupting and reads the full text when it changes.
- The ring stays still when the system requests reduced motion (`motion-reduce`).
