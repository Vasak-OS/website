---
title: "Media | WallpaperThumbnail"
weight: 180
description: "Wallpaper thumbnail with video support and status badges."
---

# `WallpaperThumbnail`

### Description
- Wallpaper thumbnail: static image or playing video, with video and selected badges.

### Props
- `src` (string | null) — Path to the static thumbnail. Default: `null`.
- `alt` (string) — Descriptive alternative text. Default: `''`.
- `video` (boolean) — Indicates if it is a video wallpaper. Default: `false`.
- `videoSrc` (string | null) — Video source when `playing` is `true`. Default: `null`.
- `playing` (boolean) — Play the video now. Default: `false`.
- `selected` (boolean) — Marks as the currently applied wallpaper. Default: `false`.
- `dimmed` (boolean) — Dims the image. Default: `false`.
- `fill` (boolean) — Fills the entire container box instead of 16:9. Default: `false`.
- `videoLabel` (string) — Accessible name for the video badge.
- `selectedLabel` (string) — Accessible name for the selected badge.

### Emits
- `error` — Emitted when the thumbnail failed to load.

### Usage
```vue
<script setup lang="ts">
import WallpaperThumbnail from '../media/WallpaperThumbnail.vue'
</script>

<template>
  <WallpaperThumbnail
    src="/thumb.jpg"
    alt="Mountain wallpaper"
    :video="true"
    :playing="true"
    video-src="blob:https://example.com/abc"
    :selected="true"
  />
</template>
```

### Notes
- The video is removed from the DOM when `playing` is `false`, not paused, to free the decoder.
- The static image is always a small copy, never the high-resolution original.
