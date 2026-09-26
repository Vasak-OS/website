---
title: "Form | FormGroup"
weight: 35
---

# `FormGroup`

Description
- Container for form labels and fields. Provides spacing and base styles to group inputs.

Props
- `label` (string) — Label text. **Required**.
- `htmlFor` (string) — `for` value of the `label` element. Default: `''`.
- `customClass` (string | Record<string, boolean>) — Additional classes for the container.
- `labelClass` (string | Record<string, boolean>) — Additional classes for the label.

Slots
- Default — Places the form control (input, select, etc.).

Usage
```vue
<script setup lang="ts">
import FormGroup from '../forms/FormGroup.vue'
</script>

<template>
  <FormGroup label="Name" htmlFor="name">
    <input id="name" class="input" />
  </FormGroup>
</template>
```
