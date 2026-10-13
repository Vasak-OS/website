---
title: "Forms | SwitchTrack"
weight: 196
description: "Switch track and thumb, drawing only without state logic."
---

# `SwitchTrack`

### Description
- The track and thumb of a switch. Drawing only, without state logic.

### Props
- `on` (boolean) — Switch state. **Required**.
- `size` (`'small' | 'medium'`) — Switch size. Default: `'small'`.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SwitchTrack from '../forms/SwitchTrack.vue'
const enabled = ref(false)
</script>

<template>
  <button role="switch" :aria-checked="enabled" @click="enabled = !enabled">
    <SwitchTrack :on="enabled" size="small" />
  </button>
</template>
```

### Notes
- Does not listen to events or emit; the containing button handles the interaction.
- Marked `aria-hidden` to avoid duplicate readings in screen readers.
