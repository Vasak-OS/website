---
title: "Control | PageDots"
weight: 208
description: "Page dots for paging through content: a button group with keyboard navigation and the active dot as a pill."
---

# `PageDots`

### Description
- Group of dots for paging through content. The active dot is shown as a stretched pill; the rest as small dots. Accessible via keyboard with arrow keys, Home, and End. Automatically hidden when there is only one page.

### Props
- `count` (number) — How many pages there are. **Required**.
- `modelValue` (number) — Index of the active page, starting from 0. Default: `0`.
- `label` (string) — Group name, already translated, for screen readers.
- `labels` (readonly string[]) — Name of each dot, already translated. If missing, "N of M" is used.
- `disabled` (boolean) — Disables selection. Default: `false`.

### Emits
- `update:modelValue` (index: number) — When the active page changes.
- `change` (index: number) — When another page is selected.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import PageDots from '../controls/PageDots.vue'
const page = ref(0)
</script>

<template>
  <PageDots
    :count="3"
    v-model="page"
    label="Pages"
  />
</template>
```

### Notes
- With `count` at 0 or 1, nothing is drawn.
- Each button is 32 px for easier targeting, even though the dot is 8 px.
