---
title: "Panel | PanelPill"
weight: 100
description: "PanelPill: floating panel pill — round button, icon data or group, with active state."
---

# `PanelPill`

### Description
- The floating pill piece of the desktop panel: can be an interactive button, an icon data (clock, weather, Wi-Fi) or a button group. With `active` it fills in the primary color to indicate a connection or current state.

### Props
- `label` (string) — The main data. Default: `''`.
- `caption` (string) — The small line below (date, time). Default: `''`.
- `icon` (string) — A theme icon by name. Default: `''`.
- `iconType` (`'icon'|'symbol'`) — Theme icon type. Default: `'symbol'`.
- `iconFallbacks` (readonly string[]) — Other theme names for the icon, in order. Default: `[]`.
- `active` (boolean) — Fills in the primary color: connected, active. Default: `false`.
- `interactive` (boolean) — It is a button. Default: `true`.
- `expanded` (boolean) — What it opens is open. `undefined` says nothing. Default: `undefined`.
- `title` (string) — The tooltip. Falls back to the label and caption.
- `accessibleLabel` (string) — The name for a screen reader. Falls back to the tooltip.
- `orientation` (`'horizontal'|'vertical'`) — Stacks for a side panel. Default: `'horizontal'`.
- `flush` (boolean) — No padding: for a group whose buttons already measure their own. Default: `false`.
- `flat` (boolean) — No own background or border at rest, for when the panel already has a surface behind. Default: `false`.
- `role` (string) — The role of a static pill grouping other buttons (`group`). With it, `accessibleLabel` names the group.

### Emits
- `click` (MouseEvent) — Touched, with `interactive`.

### Usage
```vue
<script setup lang="ts">
import PanelPill from '../panel/PanelPill.vue'
</script>

<template>
  <PanelPill
    icon="network-wireless-symbolic"
    label="MyNetwork"
    :active="true"
    @click="() => { /* open network */ }"
  />
</template>
```

### Notes
- With `interactive` the root is a `<button>`; without it, a static `<div>`.
- `expanded` adds `aria-expanded` and the accent veil over the surface.
- Text is truncated with ellipsis; the pill does not grow beyond its container.
