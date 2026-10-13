---
title: "Dialog | DialogBody"
weight: 88
description: "DialogBody: dialog body with its own scrolling, between fixed header and footer, and keyboard navigation."
---

# `DialogBody`

### Description
- Dialog body that scrolls on its own, between a header and footer that stay put. When content overflows, it becomes tabbable with a region name so arrow keys can scroll it.

### Props
- `padding` (`'none'|'sm'|'md'`) — Vertical padding of the body. Default: `'md'`.
- `label` (string) — Region name when scrolling. Falls back to the catalog (`dialog.body`) or "Content".

### Usage
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, ActionButton } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>View license</DialogTitle>
      </DialogHeader>
      <DialogBody padding="sm" label="License text">
        <p>Extensive license content...</p>
      </DialogBody>
      <DialogFooter>
        <ActionButton label="Close" @click="open = false" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### Notes
- With a `DialogBody` inside, `DialogContent` switches to a column layout and stops scrolling itself; the body becomes the scroller.
- The region role only exists when content overflows: if everything fits, there is no tabindex or role.
