---
title: "Indicator | AlertMessage"
weight: 60
description: "AlertMessage: persistent notice with tones, banner variant, actions slot and optional dismiss."
---

# `AlertMessage`

### Description
- Notice that stays in place to explain something inside a form or section. It does not close or disappear on its own: if the notice is no longer valid, whoever placed it stops rendering it.
- Shares tone and color with `ToastArea`, so an error looks the same wherever it appears.

### Props
- `tone` (`'info'|'success'|'warning'|'error'`) — Notice tone, which defines color and ARIA role. Default: `'info'`.
- `title` (string) — A line saying what it is about, so the whole text does not have to be read.
- `icon` (string) — Theme icon name. With `'auto'`, the tone's icon. Without it, none is drawn.
- `iconType` (`'icon'|'symbol'`) — Icon variant. Default: `'symbol'`.
- `variant` (`'box'|'banner'`) — The usual box, or the side-by-side bar for the bottom of a window. Default: `'box'`.
- `dismissible` (boolean) — Shows the close cross. Default: `false`.
- `closeLabel` (string) — Name of the cross. Without it, from the catalog (`alert.close`) or "Close".

### Emits
- `close` — Emitted when the user clicks the close cross.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import AlertMessage from '../feedback/AlertMessage.vue'

const visible = ref(true)
</script>

<template>
  <AlertMessage
    v-if="visible"
    tone="warning"
    title="A restart is required"
    icon="auto"
    dismissible
    @close="visible = false"
  >
    Changes will apply after restarting.
  </AlertMessage>
</template>
```

### Notes
- The `actions` slot shows the notice buttons below the text, or beside it in a wide bar.
- The icon is aligned with the first line and not centered in the box: with a five-line message, centered it floats halfway through the paragraph.
