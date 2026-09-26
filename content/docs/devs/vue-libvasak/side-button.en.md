---
title: "Sidebar | SideButton"
weight: 55
---

# `SideButton`

Description
- Small button for the `SideBar`. Shows an image and can be used as a link or as an action trigger.

Props
- `title` (string) — Alternative descriptive text. Default: `'Link'`.
- `image` (string) — Path to the icon/image. Default: `''`.

Emits
- Emits no events by default (it is an `<a href="#">`). You can turn it into a button or handle its click with `@click.prevent` in the parent.

Usage
```vue
<script setup lang="ts">
import SideButton from '../sidebar/SideButton.vue'
</script>

<template>
  <SideButton image="/icons/home.svg" title="Home" />
</template>
```

Notes
- If you want SPA behaviour, replace the `a` with `router-link` or capture the event in the parent.
