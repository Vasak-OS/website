---
title: "Text | Kbd"
weight: 90
description: "Kbd: represents a key or key combination with a semantic `<kbd>` and readable separators."
---

# `Kbd`

### Description
- Component that draws a key or a key combination (`Ctrl` `+` `S`) using a real HTML `<kbd>`, with one `<kbd>` per key inside a grouping `<kbd>`, as recommended by the standard.

### Props
- `keys` (`readonly string[]`) — The keys of the combination, already translated ("Ctrl", "Shift"). Default: `[]`.
- `label` (string) — Alternative text read aloud instead of the combination, if joining with "+" is not enough.

### Usage
```vue
<script setup lang="ts">
import Kbd from '../text/Kbd.vue'
</script>

<template>
  <!-- Combination with `keys` -->
  <Kbd :keys="['Ctrl', 'S']" />

  <!-- A single key passed through the slot -->
  <Kbd label="Open the launcher">Super</Kbd>
</template>
```

### Notes
- With `keys` the combination is drawn separated by `+`, which a screen reader announces ("Ctrl plus S").
- With `label` present, that text is hidden from view (`sr-only`) and the drawn content is announced as decorative.
- Without `keys` the content comes from the default slot.
