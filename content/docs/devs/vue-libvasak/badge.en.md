---
title: "Indicator | Badge"
weight: 76
description: "Badge: badge for counters, statuses or origins, with color variants and counter mode."
---

# `Badge`

### Description
- Compact badge for displaying counters, statuses or origins. The text uses `tx-main` over a translucent fill, and it can be used as a counter overlay on an icon or as a text label.

### Props
- `tone` (`'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'error'`) — Badge color tone. Default: `'neutral'`.
- `variant` (`'soft' | 'outline' | 'solid' | 'overlay'`) — Visual style. Default: `'soft'`.
- `size` (`'sm' | 'md'`) — Badge size. Default: `'sm'`.
- `dot` (boolean) — Shows a dot in the tone color before the text. Default: `false`.
- `color` (string) — Data color that tints the dot and border.
- `label` (string | number) — Badge text if the slot is not used.
- `counter` (boolean) — Counter mode: text never wraps, at least as wide as tall. Default: `false`.
- `max` (number) — With a numeric `label` above this, it renders «max+». Default: `undefined`.
- `title` (string) — Full text for the system tooltip. Default: `undefined`.

### Usage
```vue
<script setup lang="ts">
import Badge from '../indicators/Badge.vue'
</script>

<template>
  <Badge label="Nuevo" tone="info" />
  <Badge :label="120" :max="99" counter tone="accent" title="120 notificaciones" />
  <Badge tone="warning" variant="outline">
    <template #default>beta</template>
  </Badge>
</template>
```

### Notes
- Counter mode prevents text wrapping and works as an overlay on an icon.
- `color` is applied as a CSS variable (`--badge-color`) and tints the dot and border, never the text.
- With `variant="solid"` and `tone="accent"` or `"info"`, the text uses `tx-on-primary` over the full primary fill.
