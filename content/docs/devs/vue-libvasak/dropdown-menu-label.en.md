---
title: "DropdownMenu | DropdownMenuLabel"
weight: 120
description: "Section title inside the dropdown menu that provides the menu's accessible name via aria-labelledby."
---

# `DropdownMenuLabel`

### Description
- Section title for grouping items within the dropdown menu.
- Not an interactive option: uses `role="presentation"` and yields its `id` to the menu for `aria-labelledby`.

### Props
- No props accepted: it is a static text component.

### Usage
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from 'vue-libvasak'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>File</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Edit</DropdownMenuLabel>
      <DropdownMenuItem @select="console.log('copy')">
        Copy
      </DropdownMenuItem>
      <DropdownMenuItem @select="console.log('paste')">
        Paste
      </DropdownMenuItem>
      <DropdownMenuLabel>Export</DropdownMenuLabel>
      <DropdownMenuItem @select="console.log('pdf')">
        Export as PDF
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notes
- The label text is announced as the menu name when opened.
- On unmount, it cleans the menu's `aria-labelledby` reference.
