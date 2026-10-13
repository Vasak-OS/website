---
title: "Control | Disclosure"
weight: 138
description: "Disclosure: accessible collapsible section with controlled (v-model) or uncontrolled mode, plain and card variants."
---

# `Disclosure`

### Description
- Accessible collapsible section (WAI-ARIA disclosure pattern): the header is a `<button>` with `aria-expanded` and `aria-controls` that opens and closes a content region.

### Props
- `title` (string) — Header title. **Required**.
- `open` (boolean) — Controlled: open/closed state. Without it, the component manages itself. Default: `undefined`.
- `defaultOpen` (boolean) — Initial state when uncontrolled. Default: `false`.
- `variant` (`'plain' | 'card'`) — `plain` is a loose row; `card` wraps it in a card with border and surface. Default: `'plain'`.
- `disabled` (boolean) — Disables interaction. Default: `false`.

### Emits
- `update:open` (boolean) — Emitted with the new state on toggle.
- `toggle` (boolean) — Emitted with the new state on toggle.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import Disclosure from '../disclosure/Disclosure.vue'

const open = ref(false)
</script>

<template>
  <Disclosure v-model:open="open" title="Advanced options" variant="card">
    <p>Collapsible content</p>
  </Disclosure>
</template>
```

### Notes
- `open` is `undefined` by default on purpose: an unpassed `boolean` prop arrives as `false` and would break uncontrolled mode.
- The `meta` slot goes to the right of the header (counters, badges).
- The `title` slot allows customizing the header content.
