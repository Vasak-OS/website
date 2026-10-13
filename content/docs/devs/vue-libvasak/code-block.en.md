---
title: "Data | CodeBlock"
weight: 150
description: "CodeBlock: code or log block with tone-colored lines, internal scrolling and follow-to-end behavior."
---

# `CodeBlock`

### Description
Component for displaying machine text: a growing log, a command, a configuration file. Accepts a plain text block (`text`) or a list of lines with tone (`lines`). The tone does not paint the text (for contrast reasons), but marks a colored strip on the left side of the line. With `maxHeight` the block scrolls internally and is tabbable; with `follow` it stays pinned to the end as new lines arrive, unless the user has scrolled up to read.

### Props
- `text` (string) — Plain text block. Default: `''`.
- `lines` (readonly CodeLine[]) — List of lines with `text` and optional `tone` (`'neutral'|'muted'|'info'|'success'|'warning'|'error'`). Default: `[]`.
- `wrap` (boolean) — Wraps long lines. Without `wrap`, lines stay intact and the block scrolls horizontally. Default: `true`.
- `maxHeight` (string | number) — Maximum CSS height or pixels. Without it, grows with content. Default: `undefined`.
- `follow` (boolean) — Keeps the view pinned to the end when new content arrives. Default: `false`.
- `variant` (`'code'|'log'`) — `log` uses `role="log"` to announce new content without interrupting. Default: `'code'`.
- `label` (string) — Region name for accessibility. Default: `undefined`.

### Usage
```vue
<script setup lang="ts">
import CodeBlock from '../data/CodeBlock.vue'
</script>

<template>
  <CodeBlock
    :lines="[
      { text: 'Installing packages…', tone: 'info' },
      { text: 'Done', tone: 'success' },
    ]"
    variant="log"
    follow
    max-height="300px"
  />
</template>
```

### Notes
- `lines` takes precedence over `text`: if both are present, lines are shown.
- With `maxHeight` the block is tabbable (`tabindex="0"`) for keyboard reading.
- `muted` dims the text; other tones only change the left strip.
