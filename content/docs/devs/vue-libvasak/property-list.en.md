---
title: "Data | PropertyList"
weight: 126
description: "PropertyList: list of label-value pairs in grid, rows or inline layout, with slot to customize values."
---

# `PropertyList`

### Description
Component that displays a list of properties (label-value pairs) in a semantic `<dl>` element, with three layouts and a slot for custom values.

### Props
- `items` (readonly PropertyItem[]) — List of label-value pairs. **Required**.
- `layout` (`'grid' | 'rows' | 'inline'`) — List layout. Default: `'grid'`.

### Slots
- `value` (props: { item: PropertyItem; index: number }) — Customizes the value presentation of each item.

### Usage
```vue
<script setup lang="ts">
import PropertyList from '../data/PropertyList.vue'

const items = [
  { label: 'Name', value: 'VasakOS' },
  { label: 'Version', value: '2.4.0', mono: true },
  { label: 'Path', value: '/home/user/.config/vasakos', mono: true },
]
</script>

<template>
  <PropertyList :items="items" layout="grid" />
</template>
```

### Notes
- `layout` switches between: `grid` (label above value on narrow screens), `rows` (rows with dividers) and `inline` (pairs in a line).
- The `PropertyItem` interface includes an optional `id` for when two labels repeat.
- Long values wrap across multiple lines without pushing the container width.
