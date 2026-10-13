---
title: "Form | NumberField"
weight: 98
description: "NumberField: numeric input with stepper buttons, limits applied on blur and rounding to the step."
---

# `NumberField`

### Description
- Numeric input with optional stepper buttons (− and +), limits applied when leaving the field and rounding to the step's decimal places. Never emits `NaN`: if the text is not a valid number, the field reverts to the last valid value.

### Props
- `modelValue` (number) — Current value of the field. **Required**.
- `min` (number) — Minimum allowed value.
- `max` (number) — Maximum allowed value.
- `step` (number) — Increment for the stepper buttons. Default: `1`.
- `stepper` (boolean) — Shows − and + buttons on the sides. Default: `false`.
- `narrow` (boolean) — Sized to its content (128 px) instead of filling the row. Default: `false`.
- `invalid` (boolean) — Marks the field as invalid visually and accessibly. Default: `false`.
- `disabled` (boolean) — Disables the field and buttons. Default: `false`.
- `id` (string) — The `id` of the `input`.
- `ariaLabel` (string) — Accessible name when there is no visible label.
- `describedBy` (string) — `id` of the element describing the field.
- `placeholder` (string) — Placeholder text.
- `decrementLabel` (string) — What the − button announces. Falls back to the catalog or "Restar".
- `incrementLabel` (string) — What the + button announces. Falls back to the catalog or "Sumar".

### Emits
- `update:modelValue` (number) — When a valid value is typed or on blur with the value clamped to the limits.
- `change` (number) — On blur or when a stepper button is pressed, with the value already adjusted.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import NumberField from '../forms/NumberField.vue'
const amount = ref(5)
</script>

<template>
  <NumberField
    v-model="amount"
    :min="1"
    :max="99"
    :stepper="true"
    aria-label="Amount"
  />
</template>
```

### Notes
- Clamping to the limits and rounding to the step happen on blur, not on every keystroke.
- Stepper buttons automatically disable when reaching `min` or `max`.
