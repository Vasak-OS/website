---
title: "Indicator | Chip"
weight: 200
description: "Chip: compact pill with an icon and a datum, optionally interactive (button) or informational only."
---

# `Chip`

### Description
A compact 32 px pill with a theme icon and a datum, like "via Firefox" or "Auriculares Bluetooth". With `interactive` the root is a `<button>` that emits `click`; without it, a quiet `<span>` with no hover or pointer. The text truncates with an ellipsis and the full content is available via the `title` tooltip.

### Props
- `label` (string) — The datum displayed in the chip. **Required**.
- `caption` (string) — Muted label placed before the datum, like "via". Default: `''`.
- `icon` (string) — Icon name in the system theme. Default: `''`.
- `iconType` (`'icon'|'symbol'`) — Icon type. Default: `'symbol'`.
- `interactive` (boolean) — The chip is a button and emits `click`. Default: `false`.
- `title` (string) — Tooltip text. Default: `undefined` (joins `caption` and `label`).

### Emits
- `click` — The user tapped the chip, when `interactive` is enabled.

### Usage
```vue
<script setup lang="ts">
import Chip from '../indicators/Chip.vue'
</script>

<template>
  <Chip
    label="Auriculares WH-1000XM4"
    caption="vía"
    icon="audio-headphones"
    interactive
    @click="openSelector"
  />
</template>
```

### Notes
- The caption is rendered in small caps, muted; the datum in medium weight, all in one line.
- Long text truncates with an ellipsis and the full text is available in the `title` tooltip.
