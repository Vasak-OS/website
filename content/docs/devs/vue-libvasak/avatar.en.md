---
title: "Identity | Avatar"
weight: 144
description: "Avatar: person's photo or initials, with fallback to generic icon, editable mode, and six sizes."
---

# `Avatar`

### Description
- Displays a person's photo, or their initials if there is no photo or it fails to load. Without a name, shows the generic theme icon. Round by nature.

### Props
- `src` (`string | null`) — Photo URL. Default: `null`.
- `name` (string) — Person's name: initials and default `alt`. Default: `''`.
- `alt` (string) — Custom alternative text.
- `size` (`'sm' | 'md' | 'ml' | 'lg' | 'xl' | '2xl'`) — Avatar size. Default: `'md'`.
- `editable` (boolean) — Turns the avatar into a button with a pencil in the corner. Default: `false`.
- `editLabel` (string) — Accessible text for the edit button.

### Emits
- `edit` — Emitted when the avatar is touched in editable mode.
- `error` — Emitted when the photo fails to load.

### Usage
```vue
<script setup lang="ts">
import Avatar from '../identity/Avatar.vue'
</script>

<template>
  <Avatar
    src="/photo.jpg"
    name="Juan Pérez"
    size="lg"
    editable
    editLabel="Change picture"
    @edit="/* open file picker */"
  />
</template>
```

### Notes
- Without a photo or with one that fails to load, the name's initials are shown.
- Without a name, the theme's `avatar-default` icon is shown.
- The photo carries `alt` (by default, the name); the initials also carry it as a named image.
