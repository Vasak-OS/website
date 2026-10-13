---
title: "Tooltip | TooltipContent"
weight: 79
description: "TooltipContent: the bubble that teleports to the body and positions itself relative to the trigger."
---

# `TooltipContent`

### Description
- The visible tooltip bubble. It teleports to the body via `Teleport` so it is not clipped inside containers with `overflow: hidden`.
- It positions itself `fixed` against the trigger coordinates and never leaves the window.
- It animates in and out with a short opacity and translate transition.

### Props
- `side` (`'top' | 'bottom' | 'left' | 'right'`) — Side of the trigger where the bubble appears. Default: `'bottom'`.
- `align` (`'start' | 'center' | 'end'`) — Alignment of the bubble relative to the chosen side. Default: `'center'`.
- `sideOffset` (number) — Distance in pixels between the trigger and the bubble. Default: `4`.

### Usage
```vue
<script setup lang="ts">
import Tooltip from '../tooltip/Tooltip.vue'
import TooltipTrigger from '../tooltip/TooltipTrigger.vue'
import TooltipContent from '../tooltip/TooltipContent.vue'
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <button>Save</button>
    </TooltipTrigger>
    <TooltipContent side="top" align="start" :side-offset="8">
      Saves the document changes
    </TooltipContent>
  </Tooltip>
</template>
```

### Notas
- Classes passed to the component are read from `attrs` (with `inheritAttrs: false`) and applied to the bubble, since the root node is a `Teleport` and not an element.
- The bubble maximum width is the window width minus 16 px; long text wraps.
