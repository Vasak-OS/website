---
title: "Control | ToggleControl"
weight: 30
---

# `ToggleControl`

Description
- Icon action button that shows `isActive` and `isLoading` states. Ideal for quick actions (play/pause, power).

Props
- `icon` (string) — Path to the icon. **Required**.
- `alt` (string) — Alternative text. Default: `''`.
- `tooltip` (string) — `title` text of the icon. Default: `''`.
- `isActive` (boolean) — Active state. Default: `false`.
- `isLoading` (boolean) — Loading state that disables and animates. Default: `false`.
- `iconClass` (Record<string, boolean>) — Reactive classes for the icon.
- `customClass` (Record<string, boolean>) — Reactive classes for the container.

Emits
- `click` — Event when the control is pressed (if it is not loading).

Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ToggleControl from '../controls/ToggleControl.vue'
const active = ref(false)
</script>

<template>
  <ToggleControl
    icon="/icons/power.svg"
    :isActive="active"
    @click="() => { active = !active }"
  />
</template>
```
