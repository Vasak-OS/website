---
title: "Popover | PopoverContent"
weight: 113
description: "PopoverContent: the popover body, a non-modal dialog teleported to body with positioning and focus management."
---

# `PopoverContent`

### Description
- Component representing the popover body: a non-modal `dialog` that teleports to `body` and positions itself relative to the anchor or trigger. Includes focus management, close on Escape and outside click, and repositioning on scroll or resize.

### Props
- `side` (`'top' | 'bottom' | 'left' | 'right'`) — Preferred side relative to the anchor. Default: `'bottom'`.
- `align` (`'start' | 'center' | 'end'`) — Alignment relative to the anchor. Default: `'start'`.
- `sideOffset` (number) — Distance in pixels between the anchor and the content. Default: `4`.
- `trapFocus` (boolean) — Makes Tab cycle inside the content. Default: `false`.
- `padding` (`'none' | 'sm' | 'md'`) — Internal padding of the content. Default: `md`.
- `label` (string) — Accessible name for the content, useful when there is no visible title.

### Usage
```vue
<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from 'vue-libvasak'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button>Open</button>
    </PopoverTrigger>
    <PopoverContent side="bottom" align="start" :side-offset="8">
      <p>Popover content.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notes
- Without `trapFocus`, leaving the content with Tab closes the popover and returns focus to the trigger.
- It teleports to `body` to avoid being clipped by parent `overflow`.
- The content is hidden with `v-show` and made `inert` when closed.
