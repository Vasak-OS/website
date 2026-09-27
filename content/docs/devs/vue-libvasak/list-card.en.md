---
title: "Card | ListCard"
weight: 40
description: "The ListCard component of vue-libvasak: a card for list items in the VasakOS applications."
aliases: ["/docs/devs/vue-libvasak/listcard/"]
---

# `ListCard`

### Description
- Card-style container for list items that can be `clickable`.

### Props
- `clickable` (boolean) — If `true`, emits `click` when pressed. Default: `false`.
- `customClass` (string | Record<string, boolean>) — Additional classes.

### Emits
- `click` — If `clickable` is true, emitted when pressed.

### Slots
- Default — Card content (icon + text, etc.).

### Usage
```vue
<script setup lang="ts">
import ListCard from '../cards/ListCard.vue'
</script>

<template>
  <ListCard clickable @click="() => console.log('item clicked')">
    <div class="flex items-center gap-3">
      <img src="/icons/item.svg" class="w-6 h-6" />
      <div>
        <div class="font-semibold">Item</div>
        <div class="text-xs text-gray-400">Detail</div>
      </div>
    </div>
  </ListCard>
</template>
```
