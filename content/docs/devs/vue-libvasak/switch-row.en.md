---
title: "Forms | SwitchRow"
weight: 134
description: "SwitchRow: option row with integrated toggle, optional icon, description and slot for additional content."
---

# `SwitchRow`

### Description
Option row with integrated toggle, where the entire row is the button. Includes optional icon, description and footer slot.

### Props
- `modelValue` (boolean) — Toggle state (v-model). **Required**.
- `label` (string) — Option name (visible text). **Required**.
- `description` (string) — Description line below the name.
- `icon` (string) — Theme icon name.
- `iconType` (`'icon' | 'symbol'`) — Icon type. Default: `'icon'`.
- `disabled` (boolean) — Disables the row. Default: `false`.

### Emits
- `update:modelValue` (value: boolean) — Emitted when the row is clicked.

### Slots
- `pie` — Additional content below the description, aligned with the text column.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SwitchRow from '../forms/SwitchRow.vue'

const wifi = ref(true)
</script>

<template>
  <SwitchRow
    v-model="wifi"
    label="Wi-Fi"
    description="Connect automatically"
    icon="wifi"
  />
</template>
```

### Notes
- The entire row is a `<button role="switch">`, so the click area is large and keyboard-driven (Space) without manual `tabindex`.
- The visible text is the button's accessible name; no `aria-label` is needed.
- `icon` is shown in a bordered box that changes style when the toggle is active.
- The `pie` slot aligns with the text column, not with the left edge of the container.
