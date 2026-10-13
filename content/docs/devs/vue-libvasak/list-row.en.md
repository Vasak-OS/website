---
title: "List | ListRow"
weight: 70
description: "ListRow: list row with icon, title, description, right-aligned meta, and slots."
---

# `ListRow`

### Description
- A list row: icon, title, description, and a meta item on the right.
- Lives inside other rows, in a `ListGroup` or in a panel.
- The role defines its behavior: `none` only displays; `button` responds to touch and keyboard; `option` is an option in a listbox; `link` navigates to another destination.

### Props
- `title` (string) — Row title.
- `description` (string) — Description under the title.
- `meta` (string) — Short data on the right: a size, a time, a counter.
- `icon` (string) — Theme icon name.
- `iconType` (`'icon'|'symbol'`) — Theme icon variant. Defaults to: `'icon'`.
- `role` (`'none'|'button'|'option'|'link'`) — Row behavior. Defaults to: `'none'`.
- `href` (string) — Link destination, for `role="link"`.
- `selected` (boolean) — Marks the row as the selected one. Defaults to: `false`.
- `disabled` (boolean) — Disables the interactive row. Defaults to: `false`.
- `truncate` (boolean) — Everything on one line, with the full text in the tooltip. Defaults to: `false`.
- `id` (string) — Element identifier.
- `bar` (number) — Proportional bar from 0 to 1 representing a part of something. Defaults to: `undefined`.
- `hoverable` (boolean) — Highlights the row on hover even if it does nothing. Defaults to: `false`.

### Emits
- `click` — Emitted when the user clicks the row or activates it with the keyboard and the row is interactive.

### Usage
```vue
<script setup lang="ts">
import ListRow from '../list/ListRow.vue'
</script>

<template>
  <ListRow
    title="Document.pdf"
    description="2 days ago"
    meta="4.2 MB"
    icon="file"
    role="button"
    @click="/* open */"
  />
</template>
```

### Notes
- `role="link"` with `href` renders a real `<a>`; without `href`, a `<div>` with link role.
- With `bar` present, the title and the bar share the row width: with enough space, on the same line; below 20 rem, the bar moves below the title.
