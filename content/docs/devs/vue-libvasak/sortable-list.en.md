---
title: "List | SortableList"
weight: 216
description: "SortableList: a list that reorders by dragging its handle and with the keyboard, without reimplementing the movement on every screen."
---

# `SortableList`

### Description
- A list that reorders by dragging and also with the keyboard. It does not draw the row —that is up to whoever uses it, through the `item` slot—: it provides the handle, the drag and the reordering, and emits the already reordered list.
- It is generic over the item type (`T`) and works with `v-model`.

### Props
- `modelValue` (`T[]`) — The list. It is emitted reordered through `update:modelValue`.
- `itemKey` (`keyof T | ((item: T, index: number) => string | number)`) — How to identify each item: a field name (`'id'`), a function, or —without this— the object identity.
- `label` (string) — The list's accessible name (`aria-label` on the `ul`).
- `handleIcon` (string) — The handle icon, taken from the theme. `list-drag-handle` by default.
- `handleLabel` (string) — What is read on the handle. Without this, `sortableList.reorder` from the text catalog, or «Reorder».
- `disabled` (boolean) — Turns reordering off: no handle and no drag. It does not dim the row.

### Emits
- `update:modelValue` (`T[]`) — The already reordered list, for `v-model`.
- `reorder` (`{ from: number; to: number }`) — The movement by index; it is emitted at the same time as the list.

### Slot
- `item` — The row. It receives `item` and `index`; the controls it carries keep working.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SortableList from '../list/SortableList.vue'
import ListRow from '../list/ListRow.vue'

const anchored = ref([
  { id: 'red', name: 'Network' },
  { id: 'bluetooth', name: 'Bluetooth' },
  { id: 'audio', name: 'Audio' },
])
</script>

<template>
  <SortableList v-model="anchored" item-key="id" label="Panel anchors">
    <template #item="{ item }">
      <ListRow :title="item.name" />
    </template>
  </SortableList>
</template>
```

### Notes
- **Keyboard**: with the handle focused, the arrow keys move the row one place and Home/End take it to either end. **Space/Enter** picks it up; from there the arrows move it as a draft, another Space/Enter drops it and **Escape** cancels and returns it to where it was. Every step is announced through a live region (`aria-live`).
- The handle is its own `<button>`, not the whole row: a remove or collapse button inside still receives the click without fighting the drag.
- The drag uses pointer events with capture, not HTML drag and drop and not a third-party library: the handle keeps the pointer even when it leaves the handle, and `touch-none` lets you drag with a finger without the list scrolling.
- The default key is the object identity, not the position or a field: two items with the same text stay distinct and the row being moved is not remounted (a key by position would lose the focus).
- The announced texts can be changed through the library's text catalog: `sortableList.reorder`, `sortableList.hint`, `sortableList.moved`, `sortableList.grabbed`, `sortableList.dropped` and `sortableList.cancelled`.
- The shape —a 32px borderless handle and the lifted row on the floating surface— is Once UI's; the colors come from the system scheme and the icon from the theme (decision 8).
