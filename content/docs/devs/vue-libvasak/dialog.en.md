---
title: "Dialog | Dialog"
weight: 82
description: "Dialog: dialog root that controls open/closed state via v-model:open and provides context to child components."
---

# `Dialog`

### Description
- Root dialog component. Renders nothing itself: controls open/closed state via `v-model:open` and provides the context used by child components.

### Props
- `open` (boolean) — Whether the dialog is open. Default: `false`.

### Emits
- `update:open` — Emitted with `false` when the dialog closes.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ActionButton } from '@vasakgroup/vue-libvasak'

const open = ref(false)
</script>

<template>
  <ActionButton label="Open" @click="open = true" />

  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm action</DialogTitle>
      </DialogHeader>
      <p>Are you sure you want to continue?</p>
      <DialogFooter>
        <ActionButton label="Cancel" variant="secondary" @click="open = false" />
        <ActionButton label="Confirm" @click="open = false" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### Notes
- State is controlled by the consumer via `v-model:open`; the component keeps no internal open state.
