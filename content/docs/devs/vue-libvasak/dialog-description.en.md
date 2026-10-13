---
title: "Dialog | DialogDescription"
weight: 87
description: "DialogDescription: paragraph explaining what the dialog is about, in secondary text color."
---

# `DialogDescription`

### Description
- Paragraph explaining what the dialog is about. Uses the system's secondary text token (`text-tx-muted`).

### Props
- No props accepted: it is a static text component.

### Usage
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete folder</DialogTitle>
        <DialogDescription>All contained files will be deleted. This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <!-- content -->
    </DialogContent>
  </Dialog>
</template>
```
