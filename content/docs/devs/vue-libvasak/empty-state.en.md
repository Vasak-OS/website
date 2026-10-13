---
title: "Feedback | EmptyState"
weight: 66
description: "EmptyState: message for empty screens, with title, note, icon, and slot for actions."
---

# `EmptyState`

### Description
- Displays a message when there is no content: an empty folder, a search with no results, or a list that has not started yet.

### Props
- `title` (string) — Main message title. **Required**.
- `note` (string) — Second line with an explanation or a suggested action.
- `icon` (string) — Theme icon name. Defaults to: `'dialog-information'`.
- `iconType` (`'icon'|'symbol'`) — Theme icon variant. Defaults to: `'icon'`.
- `bordered` (boolean) — Draws a dashed border around. Defaults to: `false`.
- `size` (`'sm'|'md'`) — `md` fills a large gap; `sm` fits in a box the height of a few rows. Defaults to: `'md'`.
- `muted` (boolean) — The title as a muted line, without weight. Defaults to: `false`.

### Usage
```vue
<script setup lang="ts">
import EmptyState from '../feedback/EmptyState.vue'
</script>

<template>
  <EmptyState
    title="No results found"
    note="Try different search terms."
    icon="search"
  />
</template>
```

### Notes
- The icon is hidden with `icon=""`: no gap the size of the icon remains.
- The default slot allows adding a button to get out of the empty state, such as "Create folder" or "Clear filters".
