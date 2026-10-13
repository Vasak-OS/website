---
title: "Dialog | DialogTitle"
weight: 84
description: "DialogTitle: h2 heading that names the dialog and registers itself in context for aria-labelledby."
---

# `DialogTitle`

### Description
- Dialog title rendered as `h2`. Automatically registers itself in context so the content's `aria-labelledby` points to it.

### Props
- No props accepted: it is a static text component.

### Usage
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete file</DialogTitle>
      </DialogHeader>
      <!-- content -->
    </DialogContent>
  </Dialog>
</template>
```

### Notes
- On unmount it stops naming the dialog so the next one does not point to a non-existent `id`.
