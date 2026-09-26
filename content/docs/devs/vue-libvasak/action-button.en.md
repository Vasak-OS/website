---
title: "Control | ActionButton"
weight: 30
---

# `ActionButton`

Description
- Generic button component with variants (`primary`, `secondary`, `danger`), loading states and icon support.

Props
- `label` (string) — Button text. **Required**.
- `disabled` (boolean) — Disables the button. Default: `false`.
- `variant` (`'primary'|'secondary'|'danger'`) — Visual style. Default: `'primary'`.
- `loading` (boolean) — Shows a spinner and disables the action. Default: `false`.
- `customClass` (string | Record<string, boolean>) — Additional classes.
- `size` (`'sm'|'md'|'lg'`) — Button size. Default: `'md'`.
- `fullWidth` (boolean) — Makes the button full width. Default: `false`.
- `iconSrc` (string) — Path/URL of the icon.
- `iconAlt` (string) — Alternative text for the icon.
- `iconRight` (boolean) — Places the icon on the right. Default: `false`.
- `type` (`'button'|'submit'|'reset'`) — Type of the `button`. Default: `'button'`.
- `stopPropagation` (boolean) — Calls `event.stopPropagation()` on click. Default: `false`.
- `preventDefault` (boolean) — Calls `event.preventDefault()` on click. Default: `false`.

Emits
- `click` — Emitted when the user clicks and the button is neither disabled nor `loading`.

Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ActionButton from '../controls/ActionButton.vue'
const loading = ref(false)
</script>

<template>
  <ActionButton
    label="Save"
    :loading="loading"
    variant="primary"
    @click="() => { loading = true; /* action */ }"
  />
</template>
```

Notes
- `customClass` accepts an object for reactive classes.
- When `iconSrc` is present and there is no `label`, the padding adjusts automatically.
