---
title: "Form | SwitchToggle"
weight: 35
---

# `SwitchToggle`

Description
- Animated toggle switch. Returns the new state through the `toggle` event.

Props
- `isOn` (boolean) — Current switch state. **Required**.
- `disabled` (boolean) — Disables interaction. Default: `false`.
- `size` (`'small'|'medium'`) — Visual size. Default: `'small'`.
- `activeClass` (string) — Class applied when active. Default: `'bg-vsk-primary'`.
- `inactiveClass` (string) — Class when inactive. Default: `'background'`.
- `customClass` (string) — Additional classes.

Emits
- `toggle` — Emits `[value: boolean]` with the new state.

Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SwitchToggle from '../forms/SwitchToggle.vue'
const enabled = ref(true)
</script>

<template>
  <SwitchToggle :isOn="enabled" @toggle="v => enabled = v" />
</template>
```
