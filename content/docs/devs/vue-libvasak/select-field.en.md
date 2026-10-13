---
title: "Form | SelectField"
weight: 74
description: "SelectField: dropdown with custom panel, options via prop or slot, and typed model."
---

# `SelectField`

### Description
- Styled dropdown that replaces the native `<select>` with a custom panel, supports options as a prop or `<option>` in the slot, and handles a generic model (`string` or `number`) via `v-model`.

### Props
- `label` (string) — Visible label associated with the control.
- `id` (string) — Control identifier. If not provided, one is generated automatically.
- `disabled` (boolean) — Disables the control.
- `options` (`Array<SelectOption<T> | (T & string)>`) — List of options as objects `{ label, value, disabled? }` or strings. When provided, the slot is ignored.

### Emits
- `change` (Event) — Emitted when the user selects an option different from the current one.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SelectField from '../forms/SelectField.vue'

const selected = ref('medium')

const options = [
  { label: 'Pequeño', value: 'small' },
  { label: 'Medio', value: 'medium' },
  { label: 'Grande', value: 'large' },
]
</script>

<template>
  <SelectField
    v-model="selected"
    label="Tamaño"
    :options="options"
    @change="() => { /* recargar */ }"
  />
</template>
```

### Notes
- If `options` is not provided, `<option>` elements written in the slot are used (without a `value` attribute, the value is the text).
- The model is generic: `T extends string | number`, so a `ref<number>` with `v-model.number` works without casting.
- With `label` declared, the component renders the label and associates it with the control via `for`/`id`. Without it, wrapping it in a `<label>` also works.
