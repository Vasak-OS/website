---
title: "Dialog | DialogContent"
weight: 83
description: "DialogContent: dialog scrim and panel, teleported to body, with focus management, Escape and Tab handling."
---

# `DialogContent`

### Description
- Renders the dialog scrim and panel, teleported to `body`. Manages focus (entry, trap on Tab, restore on close), Escape to close, and scrim click.

### Props
- `size` (`'sm'|'md'|'wide'|'lg'|'full'`) — Panel shape. Default: `'md'`.
- `ariaLabel` (string) — Accessible name for the dialog when no visible `DialogTitle` is present.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@vasakgroup/vue-libvasak'

const open = ref(false)
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent size="lg" aria-label="Contact form">
      <DialogHeader>
        <DialogTitle>New contact</DialogTitle>
      </DialogHeader>
      <!-- form content -->
    </DialogContent>
  </Dialog>
</template>
```

### Notes
- The panel is teleported to `body` to avoid clipping by `overflow` on parent containers.
- Focus enters the panel on open, Tab is trapped inside, and focus is restored to the previous element on close.
- With `size="full"` the panel fills the entire window and no scrim is drawn.
