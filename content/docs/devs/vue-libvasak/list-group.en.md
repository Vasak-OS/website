---
title: "Lists | ListGroup"
weight: 106
description: "ListGroup: list row container with dividers, surface, and listbox or group roles."
---

# `ListGroup`

### Description
- Container for a list of `ListRow`: draws the border, the surface and the dividers between rows.
- With `divided` set to `false`, rows sit flush with their own radius and 4 px padding, with no lines, like menu options.
- By default it is only a visual container; with `role="listbox"` it becomes a list of options and `label` names it.

### Props
- `divided` (boolean) — Separates rows with `ui-line-weak` lines. Defaults to: `true`.
- `role` (`'listbox' | 'group'`) — ARIA role of the container. No default value.
- `label` (string) — The name of the list, already translated.
- `multiselectable` (boolean) — For a multi-selection `listbox`. Defaults to: `false`.

### Usage
```vue
<script setup lang="ts">
import ListGroup from '../list/ListGroup.vue'
import ListRow from '../list/ListRow.vue'
</script>

<template>
  <ListGroup label="Devices" divided>
    <ListRow title="Laptop" subtitle="Connected" />
    <ListRow title="Phone" subtitle="Offline" />
  </ListGroup>
</template>
```

### Notes
- Provides context to child `ListRow` components through `LIST_GROUP_KEY`.
- `label` is used as `aria-label` and must already be translated.
