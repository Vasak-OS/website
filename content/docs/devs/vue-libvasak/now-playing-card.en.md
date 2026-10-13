---
title: "Media | NowPlayingCard"
weight: 168
description: "NowPlayingCard: playback card with spinning cover, progress bar and transport controls."
---

# `NowPlayingCard`

### Description
- Complete "now playing" card with spinning cover, track data, progress bar and transport buttons.
- Knows nothing about MPRIS or any player: receives what to draw and emits what was interacted with.
- Buttons that cannot be used appear disabled, not hidden.

### Props
- `title` (string) — Track title. Default: `''`.
- `artist` (string) — Artist. Default: `''`.
- `album` (string) — Album. Default: `''`.
- `coverSrc` (string | null) — Cover URL. Default: `null`.
- `fallbackIcon` (string) — Disc icon when no cover. Default: `'applications-multimedia'`.
- `state` (PlaybackState) — Playback state. Default: `'stopped'`.
- `position` (number) — Current position. Default: `0`.
- `duration` (number) — Total duration. Default: `0`.
- `format` ((value: number) => string) — Time formatter. Default: `undefined`.
- `seekStep` (number) — How much the bar advances with keyboard. Default: `undefined`.
- `canSeek` (boolean) — Whether the bar can be moved. Default: `false`.
- `canGoPrevious` (boolean) — Whether there is a previous track. Default: `false`.
- `canGoNext` (boolean) — Whether there is a next track. Default: `false`.
- `canPlayPause` (boolean) — Whether the player accepts play/pause. Default: `true`.
- `previousLabel` (string) — Previous button label. Default: `undefined`.
- `nextLabel` (string) — Next button label. Default: `undefined`.
- `playLabel` (string) — Play button label. Default: `undefined`.
- `pauseLabel` (string) — Pause button label. Default: `undefined`.
- `seekLabel` (string) — Progress bar label. Default: `undefined`.
- `byArtistLabel` (string) — "by {0}" template for the artist. Default: `undefined`.
- `nothingPlayingLabel` (string) — Title when nothing is playing. Default: `undefined`.

### Emits
- `previous` — Emitted when "previous" is pressed.
- `next` — Emitted when "next" is pressed.
- `toggle` — Emitted when "play/pause" is pressed.
- `seek` (number) — Emitted when the bar is moved, with the new position.
- `coverError` — Emitted when the cover failed to load.

### Slots
- `details` — Chips below the artist (audio output, source app, etc.).
- `footer` — Content below the transport, separated by a line (equalizer, etc.).

### Usage
```vue
<script setup lang="ts">
import NowPlayingCard from '../media/NowPlayingCard.vue'
</script>

<template>
  <NowPlayingCard
    title="Sample Song"
    artist="Artist"
    album="Album"
    :cover-src="null"
    state="playing"
    :position="30"
    :duration="180"
    :can-seek="true"
    :can-go-previous="true"
    :can-go-next="true"
    :can-play-pause="true"
  />
</template>
```

### Notes
- The card adapts its layout based on available width (two columns from 20 rem, one column below).
- Button texts fall back to the application catalogue when not passed as props.
