---
title: "Media | Equalizer"
weight: 170
description: "Equalizer: ten-band equalizer with smooth curve, presets and full keyboard support."
---

# `Equalizer`

### Description
- Graphic equalizer with draggable vertical bands, frequency response curve and preset selector.
- Knows nothing about D-Bus: receives frequencies, gains, range and presets, and emits what was interacted with.
- Bands are rendered as vertical `role="slider"` controls and support pointer drag and keyboard (arrows, PgUp/PgDn, Home/End).

### Props
- `frequencies` (readonly number[]) — Band frequencies in Hz. **Required**.
- `gains` (readonly number[]) — Gain of each band in dB, in the same order. **Required**.
- `range` (readonly [number, number]) — Min and max gain per band in dB. Default: `[-12, 12]`.
- `step` (number) — Adjustment step in dB. Default: `0.5`.
- `presets` (readonly EqualizerPreset[]) — Available presets. Default: `[]`.
- `preset` (string) — Selected preset; if not in `presets`, it is the custom preset. Default: `''`.
- `customLabel` (string) — Name of the custom preset. Default: `undefined`.
- `saved` (boolean) — Whether changes are saved. Default: `true`.
- `enabled` (boolean) — Whether the equalizer is active. Default: `true`.
- `available` (boolean) — Whether the service is available on the bus. Default: `true`.
- `title` (string) — Section title. Default: `undefined`.
- `savedLabel` (string) — "Saved" label. Default: `undefined`.
- `unsavedLabel` (string) — "Not saved" label. Default: `undefined`.
- `unavailableLabel` (string) — "Not available" label. Default: `undefined`.
- `presetsLabel` (string) — "Presets" label. Default: `undefined`.

### EqualizerPreset
- `value` (string) — Preset identifier. **Required**.
- `label` (string) — Translated preset name. **Required**.

### Emits
- `gain` (band: number, value: number) — Emitted when a band is moved, with the index and new gain in dB.
- `preset` (value: string) — Emitted when a preset is chosen.

### Usage
```vue
<script setup lang="ts">
import Equalizer from '../media/Equalizer.vue'

const frequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
const gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const presets = [
  { value: 'flat', label: 'Flat' },
  { value: 'rock', label: 'Rock' }
]
</script>

<template>
  <Equalizer
    :frequencies="frequencies"
    :gains="gains"
    :presets="presets"
    preset="flat"
    :available="true"
  />
</template>
```

### Notes
- The curve is drawn with `clip-path: polygon()` over two boxes (stroke and area), no SVG.
- `available` false disables everything and shows a message; `enabled` false dims the bands but still allows preset selection.
- The application is responsible for throttling calls during drag (about 30 per second).
