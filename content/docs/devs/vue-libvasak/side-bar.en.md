---
title: "Sidebar | SideBar"
weight: 55
---

# `SideBar`

Description
- Simple side container that renders its slot. Useful as a wrapper for navigation buttons or actions.

Props
- None specific.

Slots
- Default — Sidebar content (for example several `SideButton`).

Usage
```vue
<script setup lang="ts">
import SideBar from '../sidebar/SideBar.vue'
import SideButton from '../sidebar/SideButton.vue'
</script>

<template>
  <SideBar>
    <SideButton image="/icons/home.svg" title="Home" />
    <SideButton image="/icons/settings.svg" title="Settings" />
  </SideBar>
</template>
```
