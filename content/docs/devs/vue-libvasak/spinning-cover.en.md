---
title: "Media | SpinningCover"
weight: 214
description: "Album cover spinning like a vinyl record during playback, with progress ring and optional interactive mode."
---

# `SpinningCover`

### Description
- Album cover shaped like a vinyl record that spins during playback. Includes a center hole, an optional progress ring around the disc, and an interactive mode that turns it into a button. When no cover is available, the system theme app icon is shown.

### Props
- `src` (string | null) — Cover image path. If `null` or empty, the icon is shown. Default: `null`.
- `alt` (string) — Alt text for the cover. Default: `''`.
- `state` (PlaybackState) — Playback state. Default: `'stopped'`.
- `fallbackIcon` (string) — Theme icon shown when there is no cover. Default: `'applications-multimedia'`.
- `period` (number) — Seconds per full rotation. Default: `8`.
- `progress` (number | null) — Track progress, from 0 to 100. Without this, no ring is drawn. Default: `null`.
- `progressLabel` (string) — Ring name for screen readers.
- `interactive` (boolean) — Turns the disc into a button. Default: `false`.
- `label` (string) — Button name when `interactive``. **Required** in that case.

### Emits
- `error` — When the cover could not be loaded.
- `click` — When the disc is tapped, with `interactive`.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SpinningCover from '../media/SpinningCover.vue'
const playing = ref(false)
</script>

<template>
  <SpinningCover
    src="/path/to/cover.jpg"
    :state="playing ? 'playing' : 'paused'"
    :progress="42"
    interactive
    label="Now playing"
    @click="() => { /* open player */ }"
  />
</template>
```

### Notes
- On pause, the disc freezes at its current angle; without playback (`stopped`), it stops.
- With `prefers-reduced-motion`, the disc does not spin.
