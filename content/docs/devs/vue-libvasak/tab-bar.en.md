---
title: "Tabs | TabBar"
weight: 166
description: "TabBar: tab bar with drag reordering, keyboard navigation and vertical support."
---

# `TabBar`

### Description
- Tab bar for multi-document or multi-view applications (terminal, file manager, editor).
- Supports native drag reordering and keyboard reordering, arrow navigation and wheel scrolling.
- Adapts to horizontal or vertical orientation based on the containing frame.

### Props
- `tabs` (TabEntry[]) — The tabs in the bar. **Required**.
- `modelValue` (string) — Identifier of the active tab. Default: `''`.
- `newLabel` (string) — Label for the new-tab button; without this it is not drawn. Default: `''`.
- `closeLabel` (string) — Label for the close button. Without this, `tabs.close` from the catalogue. Default: `undefined`.
- `dirtyLabel` (string) — Label for tabs with unsaved changes. Without this, `tabs.unsaved` from the catalogue. Default: `undefined`.
- `fixedOrder` (boolean) — Disables reordering. Default: `false`.

### Emits
- `update:modelValue` (string) — Emitted when a tab is selected.
- `select` (string) — Emitted when a tab is selected.
- `close` (string) — Emitted when a tab is closed, with its identifier.
- `new` — Emitted when the new-tab button is clicked.
- `reorder` (TabEntry[]) — Emitted on reorder, with the complete new list.
- `menu` ({ id: string; x: number; y: number }) — Emitted when a tab's context menu is opened.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import TabBar from '../tabs/TabBar.vue'

const tabs = ref([
  { id: '1', title: 'Document 1', dirty: false },
  { id: '2', title: 'Document 2', dirty: true }
])
const active = ref('1')
</script>

<template>
  <TabBar
    :tabs="tabs"
    v-model="active"
    new-label="New tab"
    @close="tabs = tabs.filter(t => t.id !== $event)"
    @new="tabs.push({ id: String(Date.now()), title: 'New', dirty: false })"
  />
</template>
```

### Notes
- Reordering uses native HTML5 Drag and Drop and keyboard arrows when `fixedOrder` is `false`.
- Keyboard navigation uses a "roving tabindex" pattern: one tab in the tab order.
- The wheel scrolls the rail on its axis (horizontal or vertical).
