---
title: "Dialog | DialogHeader"
weight: 85
description: "DialogHeader: title and description container with optional close button in icon or label style."
---

# `DialogHeader`

### Description
- Dialog header container. Arranges the title and description, and can render a close button in the top-right corner.

### Props
- `closable` (boolean) — Renders the close button. Default: `false`.
- `closeLabel` (string) — Close button label. Passing it also renders the button.
- `closeStyle` (`'icon'|'label'`) — Close button style. Default: `'icon'`.

### Usage
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader closable close-style="label" close-label="Close">
        <DialogTitle>Network settings</DialogTitle>
        <DialogDescription>Modify connection parameters.</DialogDescription>
      </DialogHeader>
      <!-- content -->
    </DialogContent>
  </Dialog>
</template>
```

### Notes
- `closeLabel` implies `closable`: passing the text alone is enough to show the button.
- The button text comes from `closeLabel`, the catalog (`dialog.close`), or the fallback "Close".
