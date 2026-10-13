---
title: "Tooltip | Tooltip"
weight: 78
description: "Tooltip: root container that controls open state, open delay, and provides context to its children."
---

# `Tooltip`

### Description
- Root container of the Tooltip family. It knows whether the tooltip is open, who triggered it, and when it should appear.
- Coordinates the open delay (to avoid flicker when moving the pointer) and provides state to `TooltipTrigger` and `TooltipContent` through context injection.

### Props
- `disabled` (boolean) — Disables the tooltip: it does not open even when hovering or focusing the trigger. Default: `false`.
- `delayDuration` (number) — Milliseconds to wait before opening. There is no delay when closing. Default: `200`.

### Usage
```vue
<script setup lang="ts">
import Tooltip from '../tooltip/Tooltip.vue'
import TooltipTrigger from '../tooltip/TooltipTrigger.vue'
import TooltipContent from '../tooltip/TooltipContent.vue'
</script>

<template>
  <Tooltip :delay-duration="300">
    <TooltipTrigger>
      <button>Save</button>
    </TooltipTrigger>
    <TooltipContent>
      Saves the document changes
    </TooltipContent>
  </Tooltip>
</template>
```

### Notas
- The root slot can contain a single `TooltipTrigger` and a single `TooltipContent`.
- The delay lives in the container, not the content: it matters on open.
