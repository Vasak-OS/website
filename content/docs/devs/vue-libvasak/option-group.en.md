---
title: "Forms | OptionGroup"
weight: 128
description: "OptionGroup: single-choice selector with keyboard navigation, list and card variants, and avatar support."
---

# `OptionGroup`

### Description
Group of mutually exclusive options with keyboard navigation (arrows and Tab), `list` or `card` variant, optional badge and avatar support.

### Props
- `options` (OptionGroupOption<T>[]) — Group options. **Required**.
- `label` (string) — Accessible name of the group. **Required**.
- `model` (T | null) — Selected value (v-model). Default: `null`.
- `variant` (`'list' | 'card'`) — Visual style. Default: `'list'`.
- `size` (`'sm' | 'md'`) — Row size. Default: `'md'`.
- `disabled` (boolean) — Disables the entire group. Default: `false`.

### Emits
- `change` (value: T) — Emitted when an option is selected.

### Slots
- `option` (props: { option: OptionGroupOption<T>; checked: boolean }) — Customizes the content of each option.
- `trailing` (props: { option: OptionGroupOption<T>; checked: boolean }) — Content at the end of each option (before the dot in `card` variant).

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import OptionGroup from '../forms/OptionGroup.vue'

const audioOutput = ref(null)

const options = [
  { value: 'speakers', label: 'Speakers', description: 'Default output', badge: 'Default' },
  { value: 'headphones', label: 'Headphones', description: 'Bluetooth output' },
  { value: 'hdmi', label: 'HDMI', description: 'Digital output' },
]
</script>

<template>
  <OptionGroup
    v-model="audioOutput"
    label="Audio output"
    :options="options"
    variant="list"
  />
</template>
```

### Notes
- Keyboard navigation uses a roving tabindex pattern: Tab enters the group, arrows change the selection.
- `options` is generic (`T extends string | number`), allowing numeric or string values.
- In `variant="card"`, the icon is shown in a bordered box that changes style based on selection.
- The indicator dot is positioned on the left in `list` and on the right in `card`.
- `disabled` disables all options; each option can also be disabled individually.
