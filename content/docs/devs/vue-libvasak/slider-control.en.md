---
title: "Form | SliderControl"
weight: 35
---

# `SliderControl`

Description
- Custom slider control with an icon, a calculated percentage and an optional side button.

Props
- `icon` (string) — Path to the icon shown.
- `alt` (string) — Alternative text for the icon. Default: `''`.
- `tooltip` (string) — `title` text of the icon.
- `modelValue` (number) — Current slider value (v-model).
- `min` (number) — Minimum value. Default: `0`.
- `max` (number) — Maximum value. Default: `100`.
- `showButton` (boolean) — Shows a button with an icon on the left. Default: `false`.
- `iconClass` (string | Record<string, boolean>) — Classes for the icon.
- `getPercentageClass` ((percentage: number) => string) — Optional callback returning CSS classes according to the percentage.

Emits
- `update:modelValue` — Emits the new numeric value when the slider is dragged.
- `buttonClick` — When the side button is clicked.

Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SliderControl from '../forms/SliderControl.vue'
const value = ref(40)
</script>

<template>
  <SliderControl
    icon="/icons/volume.svg"
    v-model="value"
    :min="0"
    :max="100"
    @update:modelValue="val => console.log(val)"
  />
</template>
```

Notes
- `getPercentageClass` lets you change the colour of the percentage text according to the value.
