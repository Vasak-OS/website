---
title: "Search | SearchField"
weight: 94
description: "SearchField: system search field with magnifier, clear button, debounce, and instant search."
---

# `SearchField`

### Description
- The system search field component. Inside it is the system's `TextInput`, with integrated magnifier, clear button, and loading spinner. Two distinct events: `update:modelValue` (the text, on every keystroke) and `search` ("search for real", with Enter or after the debounce).

### Props
- `modelValue` (string) — The field text (with `v-model`). Default: `''`.
- `placeholder` (string) — Helper text when the field is empty.
- `label` (string) — What a screen reader hears; the field has no visible label. Default: `''`.
- `disabled` (boolean) — Disables the field. Default: `false`.
- `autofocus` (boolean) — Requests focus on mount, for search that opens in a menu or panel. Default: `false`.
- `debounce` (number) — Milliseconds to wait after the last keystroke before emitting `search`. At `0`, `search` only fires with Enter. Default: `0`.
- `clearable` (boolean) — Shows the clear button. Default: `true`.
- `busy` (boolean) — Swaps the magnifier for a loading spinner: the search is working. Default: `false`.
- `listboxId` (string) — The `id` of the list this field drives, if it drives one. Turns the field into a `combobox` pattern.
- `activeOptionId` (string) — The `id` of the highlighted option in that list, to announce it without moving focus.
- `expanded` (boolean) — Whether the list is expanded.
- `clearLabel` (string) — What is heard on the clear button; if absent, comes from the catalog (`search.clear`). Default: `''`.
- `size` (`'md'|'lg'`) — `lg` is the 40 px field for search that is the window. Default: `'md'`.
- `bare` (boolean) — Without border or background, for when it already sits on a surface that frames it. Default: `false`.
- `autocomplete` (string) — The `autocomplete` of the `input` (for example, `off`). Default: `undefined`.
- `spellcheck` (boolean) — The engine's spell check. Default: `undefined`.

### Emits
- `update:modelValue` (string) — The text, on every keystroke.
- `search` (string) — "Search for real": with Enter, or on its own when the debounce elapses.
- `clear` — When the field is emptied with the clear button.
- `keydown` (KeyboardEvent) — Forwards keystrokes so the consumer can handle its own (Escape, arrows, etc.).

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SearchField from '../search/SearchField.vue'

const query = ref('')
const searching = ref(false)

async function buscar(valor: string) {
  searching.value = true
  // API call with `valor`
  searching.value = false
}
</script>

<template>
  <SearchField
    v-model="query"
    label="Buscar"
    :busy="searching"
    :debounce="200"
    @search="buscar"
    @keydown.escape="query = ''"
  />
</template>
```

### Notes
- Enter cancels the pending debounce and searches right away.
- Clearing with the button emits `update:modelValue('')`, `clear`, and `search('')`, in that order.
- Exposes the `focus()` method (and its obsolete alias `enfocar()`) to restore focus without touching the DOM.
