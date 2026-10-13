---
title: "Forms | Checkbox"
weight: 132
description: "Checkbox: checkbox with optional indeterminate state, description and native keyboard navigation."
---

# `Checkbox`

### Description
Checkbox with optional indeterminate state, associated description and native keyboard navigation (Space).

### Props
- `label` (string) — Visible checkbox text. **Required**.
- `model` (boolean) — Checkbox state (v-model). Default: `false`.
- `description` (string) — Additional explanatory text.
- `disabled` (boolean) — Disables the checkbox. Default: `false`.
- `indeterminate` (boolean) — Visual "half-checked" state (does not alter the model). Default: `false`.
- `hideLabel` (boolean) — Hides the visual label but keeps it accessible. Default: `false`.
- `id` (string) — Custom input ID.
- `name` (string) — Input name attribute.
- `value` (string) — Input value when checked.

### Emits
- `change` (checked: boolean) — Emitted when the checkbox state changes.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '../forms/Checkbox.vue'

const remember = ref(false)
</script>

<template>
  <Checkbox
    v-model="remember"
    label="Remember this decision"
    description="Don't ask again in this session"
  />
</template>
```

### Notes
- `indeterminate` is a visual state: when clicked the checkbox becomes checked and the consumer decides how to interpret it.
- The component uses a real `<input type="checkbox">` with `appearance-none`, so it inherits native keyboard navigation.
- `description` is linked via `aria-describedby`.
- The entire row measures 32px minimum height as a touch target, even though the visual box is 16px.
- `hideLabel` is useful when the checkbox is in a row with other visible text that already serves as label.
