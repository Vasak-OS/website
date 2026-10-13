---
title: "Media | SeekBar"
weight: 162
description: "SeekBar: draggable playback bar with times, keyboard seeking and invisible native control."
---

# `SeekBar`

### Description
- Progress bar for audio and video players. Shows elapsed time, duration and a draggable thumb.
- Uses an invisible `<input type="range">` layered over a `div`-based drawing, to leverage native drag, keyboard and accessibility.
- With `duration` at zero nothing is drawn (live streams); with `seekable` false the bar is shown but cannot be moved.

### Props
- `position` (number) — Current position in the same unit as `duration`. **Required**.
- `duration` (number) — Total duration. At zero, the bar is not drawn. **Required**.
- `seekable` (boolean) — Whether the player allows seeking. Default: `true`.
- `step` (number) — How much the keyboard arrows advance, in the same unit. Default: `1`.
- `format` ((value: number) => string) — How a time is formatted. Default: `formatPlaybackTime`.
- `label` (string) — Label for the screen reader. Without this, `media.seek` from the catalogue is used. Default: `undefined`.

### Emits
- `seek` (number) — Emitted when the thumb is released, with the new position in the unit of `position`.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SeekBar from '../media/SeekBar.vue'

const position = ref(0)
const duration = ref(180)
</script>

<template>
  <SeekBar
    :position="position"
    :duration="duration"
    :seekable="true"
    :step="5"
    @seek="position = $event"
  />
</template>
```

### Notes
- `position`, `duration` and `step` are in the same unit (seconds, microseconds, etc.); `format` is the only prop that needs to know it.
- The thumb appears on hover or focus, and the position is overridden during drag.
