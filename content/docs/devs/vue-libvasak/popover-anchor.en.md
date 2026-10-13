---
title: "Popover | PopoverAnchor"
weight: 115
description: "PopoverAnchor: defines the element the popover is positioned against, useful when the anchor is not the trigger."
---

# `PopoverAnchor`

### Description
- Component that defines the element the popover is positioned against. Useful when the anchor is not the trigger: for example, when the popover opens from a context menu but must hang from another element. Without an anchor, the popover positions against the trigger.

### Props
- `asChild` (boolean) — If `true`, does not wrap in a `div` and applies attributes to the only child. Default: `false`.

### Usage
```vue
<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from 'vue-libvasak'
</script>

<template>
  <Popover>
    <PopoverAnchor as-child>
      <div ref="row">Table row</div>
    </PopoverAnchor>
    <PopoverTrigger as-child>
      <button>Open options</button>
    </PopoverTrigger>
    <PopoverContent>
      <p>Row options.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notes
- On unmount, the anchor is automatically cleared from the context.
- The anchor takes precedence over the trigger when calculating the popover position.
