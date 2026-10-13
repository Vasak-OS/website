---
title: "Identity | IdentityBlock"
weight: 198
description: "Identity block with avatar, name, subtitle and customizable slots."
---

# `IdentityBlock`

### Description
- Identity block: avatar, name and a line below, with slots for details and additional elements.

### Props
- `title` (string) — Main name or title. **Required**.
- `subtitle` (string) — Subtitle or short description.
- `src` (string | null) — Avatar image path. Default: `null`.
- `name` (string) — Name for avatar initials, if not `title`.
- `size` (AvatarSize) — Avatar size. Default: `'lg'`.
- `as` (`'p' | 'h1' | 'h2' | 'h3'`) — HTML element for the title. Default: `'p'`.
- `wrap` (boolean) — Wrap text instead of truncating. Default: `false`.
- `stack` (`'never' | 'always' | 'narrow'`) — Stacked layout: never, always, or when the container is narrow. Default: `'never'`.

### Usage
```vue
<script setup lang="ts">
import IdentityBlock from '../identity/IdentityBlock.vue'
</script>

<template>
  <IdentityBlock
    title="Ana García"
    subtitle="Designer"
    src="/avatars/ana.jpg"
    size="lg"
    as="h1"
  >
    <template #trailing>
      <button>Edit</button>
    </template>
  </IdentityBlock>
</template>
```

### Notes
- With `stack="narrow"` the block automatically stacks below 20 rem of width.
- The `details` slot goes below the subtitle for additional content like badges or links.
