---
title: "Layout | SectionHeading"
weight: 96
description: "SectionHeading: section title with eyebrow and group variants, counter, and divider line."
---

# `SectionHeading`

### Description
- Component for a section title: "Cuentas", "Hoy", "Septiembre de 2026 · 214". Two variants: the `eyebrow`, the small uppercase line above a section; and the `group`, the title of a group of elements with a counter badge and a divider line.

### Props
- `title` (string) — The title text. **Required**.
- `icon` (string) — Theme icon name, before the title.
- `iconType` (`'icon'|'symbol'`) — Theme icon type. Default: `'symbol'`.
- `count` (number | string) — How many items the section has; drawn in a badge.
- `variant` (`'eyebrow'|'group'`) — Title style. Default: `'eyebrow'`.
- `sticky` (boolean) — Pins the title to the top of the scrolling container. Default: `false`.
- `surface` (`'window'|'panel'`) — What it sticks to: the window or a `Panel`. Default: `window`.
- `divider` (boolean) — Draws a line from the title to the edge. Default: `false`.
- `as` (`'h2'|'h3'|'h4'|'h5'|'h6'`) — The title level in the document. Default: `'h3'`.

### Slots
- `actions` — Content to the right of the title: "Ver todo", "Agregar".

### Usage
```vue
<script setup lang="ts">
import SectionHeading from '../layout/SectionHeading.vue'
</script>

<template>
  <!-- Eyebrow above a section -->
  <SectionHeading title="Cuentas" variant="eyebrow" />

  <!-- Group title with counter and divider -->
  <SectionHeading
    title="Septiembre de 2026"
    variant="group"
    :count="214"
    divider
  />

  <!-- Pinned to the top when scrolling -->
  <SectionHeading
    title="Hoy"
    variant="group"
    sticky
    :actions="true"
  >
    <template #actions>
      <button>Ver todo</button>
    </template>
  </SectionHeading>
</template>
```

### Notes
- When `sticky` is `true`, the background is opaque and matches the color of `surface` (design decision: no `backdrop-blur`, which is costly in WebKitGTK).
- `surface="panel"` uses 70 % surface on top of the window background.
