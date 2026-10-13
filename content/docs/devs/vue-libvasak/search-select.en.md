---
title: "Search | SearchSelect"
weight: 146
description: "SearchSelect: searchable dropdown for long lists, with full keyboard support, result limiting, and page-drawn list."
---

# `SearchSelect`

### Description
- Searchable dropdown for long lists (time zones, categories). The list is drawn by the page, not the system, to respect the theme. Includes full keyboard navigation (arrows, Enter, Escape, typeahead).

### Props
- `modelValue` (string) — Selected value. **Required**.
- `options` (`OpcionDeBusqueda[]`) — Available options. **Required**.
- `label` (string) — Accessible name of the closed button.
- `searchPlaceholder` (string) — Placeholder of the internal search field.
- `emptyText` (string) — Text when there are no matches.
- `placeholder` (string) — Text when nothing is selected. Default: `'—'`.
- `disabled` (boolean) — Disables the control. Default: `false`.
- `limit` (number) — Maximum number of rendered options. Default: `60`.
- `up` (boolean) — Opens the menu upward. Default: `false`.
- `searchable` (boolean) — Shows the search field. In `false`, only the list. Default: `true`.
- `buttonId` (string) — Button `id` for `<label for>`.
- `buttonAttrs` (`Record<string, unknown>`) — Additional attributes for the button (`aria-*`, `title`, `data-*`).

### Emits
- `update:modelValue` (string) — Emitted with the new value when an option is chosen.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SearchSelect from '../search/SearchSelect.vue'
import type { OpcionDeBusqueda } from '../search/buscar'

const valor = ref('')
const opciones: OpcionDeBusqueda[] = [
  { valor: 'es', etiqueta: 'Español' },
  { valor: 'en', etiqueta: 'English' }
]
</script>

<template>
  <SearchSelect v-model="valor" :options="opciones" label="Language" />
</template>
```

### Notes
- The `limit` clipping is safe because the list comes sorted by relevance.
- Without search (`searchable: false`), focus goes to the list and the keys are the same.
- It opens upward automatically if it does not fit below.
- Disabled options are skipped with the keyboard, as in a `<select>`.
