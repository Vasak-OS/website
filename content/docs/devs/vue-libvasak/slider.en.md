---
title: "Forms | Slider"
weight: 110
description: "Slider: a bare slider with track and thumb, slots at the ends, and lazy emission on release."
---

# `Slider`

### Description
- A bare slider: the track, the thumb and nothing else. It is what goes inside `SliderControl` and what a settings row or the photo viewer needs.
- Uses a native `input type="range"`: keyboard (arrows, Home, End, PgUp/PgDn), the `slider` role and its `aria-value*` are provided by the browser.
- `label` is required: a nameless slider is announced as "slider, 47" without saying what it controls.

### Props
- `modelValue` (number) — The current value. **Required**.
- `label` (string) — What it controls, already translated. It is its accessible name. **Required**.
- `min` (number) — Minimum value. Defaults to: `0`.
- `max` (number) — Maximum value. Defaults to: `100`.
- `step` (number) — Step between values. Defaults to: `1`.
- `valueText` (string | ((value: number) => string)) — What is heard instead of the number, or how to build it from it.
- `disabled` (boolean) — Disables the slider. Defaults to: `false`.
- `id` (string) — The `id` of the `input`.
- `describedBy` (string) — The `id` of the text that explains it.
- `lazy` (boolean) — Reports on release instead of on every step. Defaults to: `false`.

### Emits
- `update:modelValue` — Emits the new value on every step (or on release, with `lazy`).
- `change` — Emits when the thumb is released or keyboard interaction ends, with the final value.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import Slider from '../forms/Slider.vue'

const volume = ref(47)
</script>

<template>
  <Slider
    v-model="volume"
    label="Volume"
    :value-text="v => v + ' %'"
    @change="value => console.log(value)"
  />
</template>
```

### Notes
- The `start` and `end` slots are the labels at the ends: "Slower" and "Faster", or the low and high volume icons.
- `valueText` is used as `aria-valuetext` and is what a screen reader hears instead of the number.
- With `lazy` set to `true`, `update:modelValue` is emitted only once on release, for what is costly to apply on every movement.
