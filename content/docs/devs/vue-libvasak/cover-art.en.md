---
title: "Media | CoverArt"
weight: 148
description: "CoverArt: album, radio or artist artwork with text or icon fallback when the image is unavailable."
---

# `CoverArt`

### Description
Component that displays the cover art of an album, radio station, or artist. If the image is unavailable or fails to load, it shows a fallback: a short text (initials, a letter) or a theme icon. Always rendered square; a landscape image is cropped with `object-cover` without distorting the row.

### Props
- `src` (string | null) — Image URL. Default: `null`.
- `alt` (string) — Alternative text for accessibility. Default: `''`.
- `fallbackIcon` (string) — Theme icon name shown when there is no image or fallback text. Default: `'audio-x-generic'`.
- `fallbackText` (string) — Short text shown instead of the icon (initials, letter). Default: `''`.
- `size` (`'sm'|'md'|'lg'|'xl'|'fill'`) — Artwork size. `fill` takes the available width. Default: `'fill'`.
- `shape` (`'square'|'round'`) — Container shape. `round` is the disc; `square` uses the system radius. Default: `'square'`.

### Emits
- `error` — Emitted when the image failed to load.

### Usage
```vue
<script setup lang="ts">
import CoverArt from '../media/CoverArt.vue'
</script>

<template>
  <CoverArt
    src="/media/cover.jpg"
    alt="Album cover"
    size="lg"
    shape="round"
    @error="() => { /* try another image */ }"
  />
</template>
```

### Notes
- Changing `src` automatically retries loading.
- The fallback text scales with the box size; in `fill` it uses the intermediate size.
