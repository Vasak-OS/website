---
title: "Forms | PasswordField"
weight: 174
description: "Password field with show toggle, Caps Lock warning and v-model support."
---

# `PasswordField`

### Description
- Password field with show/hide toggle button, integrated Caps Lock warning and `v-model` support.

### Props
- `modelValue` (string) — Field value. **Required**.
- `id` (string) — The field `id` for label association. Auto-generated if not provided.
- `ariaLabel` (string) — Accessible label for the field.
- `describedBy` (string) — ID of an element describing the field.
- `placeholder` (string) — Placeholder text.
- `autocomplete` (`'current-password' | 'new-password' | 'off'`) — Autocomplete suggestion. Default: `'current-password'`.
- `disabled` (boolean) — Disables the field. Default: `false`.
- `invalid` (boolean) — Marks the field as visually invalid. Default: `false`.
- `required` (boolean) — Marks the field as required. Default: `false`.
- `size` (`'md' | 'lg'`) — Field size. Default: `'md'`.
- `revealable` (boolean) — Shows the password reveal button. Default: `true`.
- `capsLockHint` (boolean) — Shows the Caps Lock warning. Default: `true`.
- `showLabel` (string) — Text for the show button.
- `hideLabel` (string) — Text for the hide button.
- `capsLockLabel` (string) — Text for the Caps Lock warning.

### Emits
- `update:modelValue` — Emitted when typing in the field.
- `keydown` — Emitted on each key press.
- `keyup` — Emitted on each key release.
- `caps-lock` — Emitted when Caps Lock state changes.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField from '../forms/PasswordField.vue'
const password = ref('')
</script>

<template>
  <PasswordField
    v-model="password"
    placeholder="Password"
    :caps-lock-hint="true"
  />
</template>
```

### Notes
- The reveal button does not steal focus from the field, allowing the user to keep typing while the password is visible.
- When the field is cleared, the password is automatically hidden again.
