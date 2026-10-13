---
title: "Media | WallpaperCarousel"
weight: 188
description: "Quick wallpaper picker with tilted cards and keyboard navigation."
---

# `WallpaperCarousel`

### Description
- Quick wallpaper picker: a row of overlapping tilted cards, with the center one in front.

### Props
- `items` (`readonly WallpaperItem[]`) — List of available wallpapers. **Required**.
- `current` (`string | null`) — The currently applied wallpaper; opens centered on it and shows the badge. Default: `null`.
- `label` (string) — Accessible name for the row.
- `moreLabel` (string) — Label for the final card that emits `more`. Not present if not set.
- `emptyLabel` (string) — Text when there are no wallpapers.
- `videoLabel` (string) — Accessible name for the video badge.
- `currentLabel` (string) — Accessible name for the applied badge.

### Emits
- `apply` — Emitted when a wallpaper is selected.
- `more` — Emitted when the final card is selected.
- `close` — Emitted on Escape.
- `focus` — Emitted when the center wallpaper changes.
- `preview` — Emitted with the previewing wallpaper ID or `null`.

### Usage
```vue
<script setup lang="ts">
import WallpaperCarousel from '../media/WallpaperCarousel.vue'
const wallpapers = [
  { id: 'wp1', label: 'Mountain', thumbnail: '/thumbs/wp1.jpg' },
]
</script>

<template>
  <WallpaperCarousel
    :items="wallpapers"
    current="wp1"
    more-label="See all"
    @apply="setWallpaper"
    @close="close"
  />
</template>
```

### Notes
- Navigate with arrows, wheel, drag or click; it does not wrap around the ends.
- Only one video plays at a time, controlled by `preview`.
