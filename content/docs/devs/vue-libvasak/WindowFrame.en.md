---
title: "Layout | WindowFrame"
weight: 50
description: "WindowFrame: the main container in vue-libvasak, which includes the TopBar and renders the application content."
---

# `WindowFrame`

### Description
- Wrapper component that includes the `TopBar` (top bar) and renders its content through a slot. Used as the main container for views.

### Props
- `title` (string) — Title shown in the `TopBar`. Default: `'Vasak'`.
- `image` (string) — Image/icon for the `TopBar`. Default: `''`.

### Slots
- Default — Window content.

### Usage
```vue
<script setup lang="ts">
import WindowFrame from '../window/WindowFrame.vue'
</script>

<template>
  <WindowFrame title="My App" image="/icons/app.svg">
    <div class="p-4">Application content</div>
  </WindowFrame>
</template>
```
