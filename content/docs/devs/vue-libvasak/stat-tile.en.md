---
title: "Data | StatTile"
weight: 124
description: "StatTile: card showing a number with its label, optional icon, hint text and slot to customize the value."
---

# `StatTile`

### Description
Data card that displays a value alongside its label, with optional icon, hint text and a slot to customize the value presentation.

### Props
- `label` (string) — Name of the data. **Required**.
- `value` (string | number) — Value to display. **Required**.
- `hint` (string) — Hint text below the value.
- `icon` (string) — Theme icon name, shown next to the label.
- `iconType` (`'icon' | 'symbol'`) — Icon type. Default: `'symbol'`.

### Slots
- `value` — Customizes the value presentation.
- `default` — Additional content inside the card.

### Usage
```vue
<script setup lang="ts">
import StatTile from '../data/StatTile.vue'
</script>

<template>
  <StatTile
    label="Memory"
    :value="6.2"
    hint="of 16 GB in use"
    icon="memory"
    iconType="icon"
  />
</template>
```

### Notes
- The value is truncated if too long; the `title` attribute reveals the full text on hover.
- In narrow columns the icon hides automatically to prevent the number from overflowing.
- `icon` only renders when the container is at least 8rem wide.
