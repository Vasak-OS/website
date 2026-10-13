---
title: "Forms | TextArea"
weight: 172
description: "TextArea: multi-line text field with VasakOS styling, resizable and programmatically focusable."
---

# `TextArea`

### Description
- Multi-line text input with the library's styling (same look as `TextInput`).
- Supports resizable, visual validation, monospace mode and lazy updates (on blur).
- Does not include a label: bind with `FormGroup` via `id`.

### Props
- `modelValue` (string) — Field value. **Required**.
- `rows` (number) — Visible lines before scrolling. Default: `4`.
- `id` (string) — Field identifier, for binding with `FormGroup`. Default: `undefined`.
- `ariaLabel` (string) — Field name when no visible label exists. Default: `undefined`.
- `describedBy` (string) — `id` of the text explaining error or help. Default: `undefined`.
- `placeholder` (string) — Placeholder text. Default: `undefined`.
- `disabled` (boolean) — Disables the field. Default: `false`.
- `readonly` (boolean) — Makes the field read-only. Default: `false`.
- `invalid` (boolean) — Shows danger border for an invalid value. Default: `false`.
- `mono` (boolean) — Uses monospace font (for recipes, logs, etc.). Default: `false`.
- `required` (boolean) — Marks the field as required. Default: `false`.
- `maxlength` (number) — Maximum length in characters. Default: `undefined`.
- `resize` (`'none' | 'vertical' | 'both'`) — Resize direction. Default: `'vertical'`.
- `lazy` (boolean) — Updates the value on blur instead of on every keystroke. Default: `false`.
- `spellcheck` (boolean) — Enables spell checking. Default: `true`.

### Emits
- `update:modelValue` (string) — Emitted when the value changes.
- `keydown` (KeyboardEvent) — Forwarded on each key pressed.
- `keyup` (KeyboardEvent) — Forwarded on each key released.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import TextArea from '../forms/TextArea.vue'

const text = ref('')
</script>

<template>
  <TextArea
    v-model="text"
    :rows="4"
    placeholder="Type here…"
    :resize="'vertical'"
  />
</template>
```

### Note
- The component exposes a `focus()` method that focuses the field and returns `true` on success.
