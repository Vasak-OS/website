---
title: "Tooltip | TooltipTrigger"
weight: 80
description: "TooltipTrigger: the wrapper that opens the tooltip on hover or focus of its child element."
---

# `TooltipTrigger`

### Description
- The interactive wrapper that opens the tooltip when hovered with the pointer or when receiving focus.
- Registers the child element as the actual trigger, so the bubble positions itself relative to that child and not the wrapper.

### Props
- It does not accept props: all configuration comes from the parent `Tooltip` via context injection.

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
    <TooltipContent>
      Saves the document changes
    </TooltipContent>
  </Tooltip>
</template>
```

### Notas
- It does not accept props: all configuration comes from the parent `Tooltip` via context injection.
- It also opens on keyboard focus (`focusin`/`focusout`), not only on pointer hover.
