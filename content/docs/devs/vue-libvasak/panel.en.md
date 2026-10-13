---
title: "Container | Panel"
weight: 64
description: "Panel: column surface with border, radius, optional padding and internal scroll."
---

# `Panel`

### Description
- The surface of a column: the calendar account list, a contact card, the mail folder list.
- It is not `ListCard`: that one is a row (`flex justify-between p-3`).

### Props
- `as` (`'div'|'section'|'aside'|'article'|'nav'`) — HTML element to render. Default: `'div'`.
- `padding` (`'none'|'sm'|'md'`) — Internal spacing. Default: `'md'`.
- `scroll` (boolean) — Scrolls inside: the panel keeps the height given by the caller and content passes below the edge. Default: `false`.

### Usage
```vue
<script setup lang="ts">
import Panel from '../layout/Panel.vue'
</script>

<template>
  <Panel as="aside" padding="md" scroll>
    <!-- column content -->
  </Panel>
</template>
```

### Notes
- With `scroll`, the panel uses `min-h-0 overflow-y-auto` so content scrolls within its bounds.
