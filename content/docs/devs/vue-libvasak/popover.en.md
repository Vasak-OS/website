---
title: "Popover | Popover"
weight: 112
description: "Popover: the root of a popover with content that controls the open state and provides context to its children."
---

# `Popover`

### Description
- Root component for a popover with content: a small form, a selector, some options hanging from a button. It renders no wrapper element — its slot is rendered directly.

### Props
- `open` (boolean) — Controls the open state from outside via `v-model:open`. Without this property, the popover opens and closes internally. Default: `undefined`.

### Emits
- `update:open` — Emitted when the open state changes, receiving the new boolean value.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Popover, PopoverTrigger, PopoverContent } from 'vue-libvasak'

const open = ref(false)
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button>Open options</button>
    </PopoverTrigger>
    <PopoverContent>
      <p>Popover content goes here.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notes
- The open state is reactive and shared with child components via `provide` and `inject`.
- When closing with `returnFocus: true`, focus returns to the element that had focus when the popover opened.
