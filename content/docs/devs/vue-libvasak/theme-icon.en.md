---
title: "Icon | ThemeIcon"
weight: 62
description: "ThemeIcon: desktop theme icon by name, with fallbacks, tinting and auto size."
---

# `ThemeIcon`

### Description
- Desktop theme icon, which follows the theme live. Requested by name and never by path: the theme changes and its paths are not stable.
- `type` chooses the variant: `icon` the common one, in color; `symbol` the monochrome one, which not all names have.

### Props
- `name` (string) — Icon name in the theme. **Required**.
- `type` (`'icon'|'symbol'`) — Icon variant. Default: `'icon'`.
- `size` (number | `'auto'`) — Size in pixels, or `'auto'` to let the caller define it. Default: `18`.
- `alt` (string) — Alternative text. Empty when the icon accompanies a text that already says the same.
- `fallbacks` (readonly string[]) — Other theme names, in order, for when `name` is missing. Default: `[]`.
- `fallbackSrc` (string) — Another application's drawing, if no name resolved. Default: `''`.
- `tint` (boolean) — Tint it with the text color (`currentColor`). Default: `false`.

### Usage
```vue
<script setup lang="ts">
import ThemeIcon from '../icons/ThemeIcon.vue'
</script>

<template>
  <ThemeIcon name="dialog-information" :size="20" alt="Information" />
</template>
```

### Notes
- With `size="auto"` the component writes no inline style: height and width come from the classes or style set by the caller.
- While resolving, a gap of the same size, so the row does not jump.
- `tint` draws the icon as a `span` with `role="img"` and the `alt` as name, so a screen reader keeps reading it the same as the image.
