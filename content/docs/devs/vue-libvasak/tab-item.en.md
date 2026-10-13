---
title: "Tabs | TabItem"
weight: 194
description: "Tab with close, context menu, drag-to-reorder and unsaved changes support."
---

# `TabItem`

### Description
- A tab with close button, context menu, drag-to-reorder and unsaved changes support.

### Props
- `tab` (TabEntry) — Tab data: label, icon, state. **Required**.
- `active` (boolean) — Indicates if it is the active tab. Default: `false`.
- `closeLabel` (string) — Accessible name for the close button.
- `dirtyLabel` (string) — Text for unsaved changes.
- `tabindex` (number) — Tab index within the bar. Default: `0`.

### Emits
- `select` — Emitted on click or Enter/Space.
- `close` — Emitted when the tab is closed.
- `menu` — Emitted with position `{x, y}` when the context menu opens.
- `mover` — Emitted with `-1` or `1` when reordering with Alt+arrow.
- `navegar` — Emitted with `'anterior'`, `'siguiente'`, `'primera'` or `'ultima'`.

### Usage
```vue
<script setup lang="ts">
import TabItem from '../tabs/TabItem.vue'
const tab = { id: '1', label: 'Document', icon: 'text-editor', dirty: true }
</script>

<template>
  <TabItem
    :tab="tab"
    :active="true"
    @select="activateTab"
    @close="closeTab"
  />
</template>
```

### Notes
- Middle-click closes the tab, as in a browser.
- Long press opens the context menu, useful on touch screens.
- With a vertical bar, the name appears in a popover on hover or focus.
