---
title: "DropdownMenu | DropdownMenuSeparator"
weight: 121
description: "Horizontal line that separates groups of items inside the dropdown menu, with role separator."
---

# `DropdownMenuSeparator`

### Description
- Horizontal line that separates groups of items within the dropdown menu.
- Uses `role="separator"` so screen readers distinguish the lists of options on each side.

### Props
- No props accepted: it is a purely decorative and semantic element.

### Usage
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from 'vue-libvasak'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>More actions</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('rename')">
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem @select="console.log('duplicate')">
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem danger @select="console.log('delete')">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notes
- No props or slots; it is a purely decorative and semantic element.
