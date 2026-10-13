---
title: "Bar | BarSearch"
weight: 178
description: "Collapsible search field for the window bar with floating popover."
---

# `BarSearch`

### Description
- Collapsible search field for the window bar, with floating popover on open.

### Props
- `modelValue` (string) — Search value. Default: `''`.
- `placeholder` (string) — Placeholder text. Default: `''`.
- `label` (string) — Accessible name for the magnifier button.
- `collapsed` (boolean) — Collapsed even when the bar is horizontal. Default: `false`.
- `disabled` (boolean) — Disables the field. Default: `false`.
- `debounce` (number) — Debounce time in milliseconds. At zero, `search` fires only on Enter. Default: `0`.

### Emits
- `update:modelValue` — Emitted when typing in the field.
- `search` — Emitted when the search is executed.
- `open` — Emitted when the field is expanded.
- `close` — Emitted when the field is collapsed.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import BarSearch from '../bar/BarSearch.vue'
const query = ref('')
</script>

<template>
  <BarSearch
    v-model="query"
    placeholder="Search"
    :collapsed="true"
    @search="performSearch"
  />
</template>
```

### Notes
- With a vertical bar it is always collapsed; with a horizontal bar the application decides.
- Closes automatically on Escape or when focus leaves.
