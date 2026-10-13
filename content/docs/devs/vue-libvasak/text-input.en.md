---
title: "Form | TextInput"
weight: 72
description: "TextInput: text field with visual validation, monospace mode, native types and keyboard events."
---

# `TextInput`

### Description
- Reusable text field with `v-model` support, native types (`text`, `password`, `search`, `url`, `email`, `number`, `date`, `time`, `datetime-local`), visual error indication, monospace mode for aligned values and declared keyboard events.

### Props
- `modelValue` (string) — Field value. **Required**.
- `type` (`'text' | 'password' | 'search' | 'url' | 'email' | 'number' | 'date' | 'time' | 'datetime-local'`) — Field type. Default: `'text'`.
- `size` (`'md' | 'lg'`) — Field height: `md` is 32 px, `lg` is 40 px. Default: `'md'`.
- `bare` (boolean) — No border or background, for surfaces that already frame it. Default: `false`.
- `id` (string) — Field identifier, needed to associate it with `FormGroup`.
- `ariaLabel` (string) — Accessible name when there is no visible label.
- `describedBy` (string) — The `id` of the error or help text below the field.
- `autocomplete` (string) — What to autocomplete.
- `spellcheck` (boolean) — Controls the browser spell check. Default: `undefined`.
- `autocapitalize` (`'none' | 'off' | 'sentences' | 'words' | 'characters'`) — Automatic capitalization on virtual keyboard. Default: `undefined`.
- `placeholder` (string) — Placeholder text.
- `disabled` (boolean) — Disables the field. Default: `false`.
- `readonly` (boolean) — Makes the field read-only. Default: `false`.
- `invalid` (boolean) — Draws the error border for an invalid value. Default: `false`.
- `mono` (boolean) — Applies monospace font for paths and commands. Default: `false`.
- `required` (boolean) — Marks the field as required. Default: `false`.
- `lazy` (boolean) — Emits `update:modelValue` on blur instead of on every keystroke. Default: `false`.

### Emits
- `update:modelValue` (string) — Emitted when the value changes. With `lazy`, on blur; otherwise, on every keystroke.
- `keyup` (KeyboardEvent) — Forwards the `keyup` event from the `input`.
- `keydown` (KeyboardEvent) — Forwards the `keydown` event from the `input`.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '../forms/TextInput.vue'

const username = ref('')
</script>

<template>
  <TextInput
    v-model="username"
    type="text"
    placeholder="Nombre de usuario"
    :spellcheck="false"
    autocapitalize="none"
    @keyup.enter="() => { /* enviar */ }"
  />
</template>
```

### Notes
- The `focus()` method focuses the field and returns a boolean indicating success. `enfocar` exists as a deprecated alias (removed in 3.0).
- No built-in label: use `FormGroup`, which associates it with the field via `id`.
- The `keyup` and `keydown` events must be forwarded manually in the template, since Vue removes all declared events from attributes.
