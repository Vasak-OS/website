---
title: "Forms | SegmentedControl"
weight: 108
description: "SegmentedControl: a single-choice option group, as a segmented rail or chips, with navigation."
---

# `SegmentedControl`

### Description
- A few single-choice options side by side: list or grid, light or dark, indent width.
- `segmented` variant: a rail with a thin border and the options inside; the selected one carries the accent veil and weight 600.
- `chips` variant: loose pills that wrap across several lines, for a filter with many options.
- With `href` on the options the control becomes a navigation (`<nav>`) with links and `aria-current="page"` on the current one.

### Props
- `options` (`SegmentedOption<T>[]`) — The options of the control. **Required**.
- `label` (string) — The name of the group, already translated. **Required**.
- `variant` (`'segmented' | 'chips'`) — Visual style. Defaults to: `'segmented'`.
- `disabled` (boolean) — Disables every option. Defaults to: `false`.

### Emits
- `change` — Emits the chosen value when the user selects a different option.
- `navigate` — Emits the value and the `MouseEvent` when a link is chosen; `event.preventDefault()` lets the application navigate with its router.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SegmentedControl from '../forms/SegmentedControl.vue'

const view = ref<'list' | 'grid'>('list')
</script>

<template>
  <SegmentedControl
    v-model="view"
    label="View"
    :options="[
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
    ]"
    @change="value => console.log(value)"
  />
</template>
```

### Notes
- `SegmentedOption` accepts `icon`, `iconOnly`, `badge`, `badgeTone`, `disabled` and `href` besides `value` and `label`.
- Keyboard works like `OptionGroup`: a single Tab to enter and leave, and the arrows choose.
- Options wrap onto two lines before overflowing; each one has a minimum height of 32 px.
