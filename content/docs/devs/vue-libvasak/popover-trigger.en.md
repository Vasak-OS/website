---
title: "Popover | PopoverTrigger"
weight: 114
description: "PopoverTrigger: the trigger that opens the popover on click, with ARIA attributes and as-child mode."
---

# `PopoverTrigger`

### Description
- Component representing the element that opens the popover. Registers itself as the trigger in the `Popover` context and toggles the open state on click. With `as-child` it wraps nothing and applies attributes directly to the child.

### Props
- `asChild` (boolean) — If `true`, does not wrap in a `div` and applies attributes to the only child. Default: `false`.
- `disabled` (boolean) — Disables interaction: does not open the popover on click. Default: `false`.

### Usage
```vue
<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from 'vue-libvasak'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button>Open popover</button>
    </PopoverTrigger>
    <PopoverContent>
      <p>Popover content.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notes
- `aria-haspopup` is `dialog` —what opens is not a menu—.
- `aria-expanded` reflects the open state.
- With `as-child` the child is cloned with the attributes and the click handler.
