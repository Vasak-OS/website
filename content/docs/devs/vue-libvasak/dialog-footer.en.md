---
title: "Dialog | DialogFooter"
weight: 86
description: "DialogFooter: dialog footer that stacks buttons in reverse on narrow dialogs."
---

# `DialogFooter`

### Description
- Dialog footer, where action buttons go. On narrow dialogs it stacks them in reverse so the primary action sits on top.

### Props
- No props accepted: it is a static container.

### Usage
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogFooter, ActionButton } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <!-- content -->
      <DialogFooter>
        <ActionButton label="Cancel" variant="secondary" @click="open = false" />
        <ActionButton label="Save" @click="save" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### Notes
- Adapts to the dialog width (`@container`), not the screen width.
