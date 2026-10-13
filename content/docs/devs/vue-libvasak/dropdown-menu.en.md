---
title: "DropdownMenu | DropdownMenu"
weight: 117
description: "Root container that provides shared state (open/close, focus, trigger) to all dropdown menu components."
---

# `DropdownMenu`

### Description
- Root component that provides the shared state of the dropdown menu: open, close, focus management and trigger registration.
- Renders nothing on its own; wraps content and exposes context via `provide`.

### Props
- `open` (boolean) — Controls the open state from outside with `v-model:open`. Default: `undefined` (internal control).

### Emits
- `update:open` — Emitted with the new boolean value when the open state changes.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'

const open = ref(false)
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <button>Open menu</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('selected')">
        Option
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notes
- Without `v-model:open`, the menu opens and closes internally.
- Focus is returned to the element that had focus when the menu opened, not always to the trigger.
