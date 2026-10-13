---
title: "Feedback | DropZone"
weight: 152
description: "DropZone: drop target area for dragged files, with inline and overlay variants, and locked state."
---

# `DropZone`

### Description
Visual component that marks where to drop dragged items: files onto the music library, a package onto the store, a folder onto the file manager. It is only the drawing: who listens to `dragenter`/`drop` and what it does with the dropped items remains the application's job. Receives `active` while something is hovering above. In `inline` mode it shows a dashed-border box with icon and text; in `overlay` mode it covers the container only while `active`, with a scrim and a floating card. `locked` indicates that dropping is not allowed (read-only folder, installation in progress).

### Props
- `active` (boolean) — Indicates whether something is being dragged above. Default: `false`.
- `label` (string) — Zone text. If not provided, uses the catalog or the English fallback. Default: `undefined`.
- `locked` (boolean) — Indicates that dropping is not allowed. Changes the icon, text, and border color. Default: `false`.
- `lockedLabel` (string) — Text for the locked state. Default: `undefined`.
- `overlay` (boolean) — Uses the overlay variant (covers the container) instead of inline. Default: `false`.
- `icon` (string) — Theme icon name. Default: `'document-import'`.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import DropZone from '../feedback/DropZone.vue'
const active = ref(false)
</script>

<template>
  <DropZone
    :active="active"
    label="Drop files here"
    @dragenter="active = true"
    @dragleave="active = false"
    @drop="active = false"
  />
</template>
```

### Notes
- In `overlay` mode, the parent container must be `relative`.
- The default slot (in the inline variant) goes below the text, for a "Choose files" button.
- Texts come from the property, the catalog (`dropZone.label`, `dropZone.locked`), or the English fallback.
