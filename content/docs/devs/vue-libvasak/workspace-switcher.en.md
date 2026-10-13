---
title: "Panel | WorkspaceSwitcher"
weight: 186
description: "Workspace switcher pill with keyboard navigation."
---

# `WorkspaceSwitcher`

### Description
- Workspace switcher pill: one number per workspace, the active one highlighted in the primary color.

### Props
- `count` (number) — How many workspaces there are. **Required**.
- `modelValue` (number) — Index of the current workspace, from 0. Default: `0`.
- `label` (string) — Accessible name for the group.
- `labels` (`readonly string[]`) — Name of each workspace, already translated.
- `orientation` (`'horizontal' | 'vertical'`) — Pill orientation. Default: `'horizontal'`.
- `disabled` (boolean) — Disables interaction. Default: `false`.
- `flat` (boolean) — No own background or border. Default: `false`.

### Emits
- `update:modelValue` — Emitted when another workspace is selected.
- `change` — Emitted when another workspace is selected.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import WorkspaceSwitcher from '../panel/WorkspaceSwitcher.vue'
const current = ref(0)
</script>

<template>
  <WorkspaceSwitcher
    v-model="current"
    :count="6"
    orientation="horizontal"
  />
</template>
```

### Notes
- Arrow keys move focus without changing workspace; selection is made with Enter, Space or click.
- With `flat` the pill does not draw its own background when the panel already has a surface.
