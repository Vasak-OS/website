---
title: "Indicator | IconTile"
weight: 204
description: "IconTile: theme icon in a bordered tile with tones, shapes, and an optional status indicator in the corner."
---

# `IconTile`

### Description
A theme icon inside a bordered tile, used to accompany a step, account, or option. It offers six tones (`neutral`, `selected`, `accent`, `success`, `warning`, `error`), two shapes (`square`, `circle`), and an optional status indicator in the bottom-right corner. The tile measures between 32 and 80 px depending on the chosen size.

### Props
- `name` (string) — Icon name in the system theme. **Required**.
- `type` (`'icon'|'symbol'`) — Icon type. Default: `'icon'`.
- `size` (`'sm'|'md'|'lg'|'xl'|'2xl'`) — Tile size: 32, 40, 48, 64, or 80 px. Default: `'md'`.
- `tone` (`'neutral'|'selected'|'accent'|'success'|'warning'|'error'`) — Tile color. Default: `'neutral'`.
- `shape` (`'square'|'circle'`) — Tile shape. Default: `'square'`.
- `status` (`'success'|'warning'|'error'|null`) — Status icon in the bottom-right corner. Default: `null`.
- `statusLabel` (string) — Text announced by the screen reader for the status.
- `label` (string) — Accessible name for the tile. If present, the tile is a label; otherwise it is decorative.

### Usage
```vue
<script setup lang="ts">
import IconTile from '../indicators/IconTile.vue'
</script>

<template>
  <IconTile
    name="account-circle"
    tone="selected"
    size="lg"
    shape="circle"
    label="Cuenta de usuario"
  />
</template>
```

### Notes
- The icon always takes its colors from the theme; the tone applies only to the tile.
- With `status` and `statusLabel`, the status indicator is announced; without them, it is pure decoration.
- The tile's corner radius derives from the system radius, not a fixed value.
