---
title: "DropdownMenu | DropdownMenuContent"
weight: 118
description: "Floating dropdown menu panel with automatic positioning, keyboard navigation, and teleport to body."
---

# `DropdownMenuContent`

### Description
- Renders the dropdown menu body with `role="menu"`, automatic positioning, and built-in keyboard navigation.
- Teleports to `body` to avoid `overflow` clipping and positions itself relative to the trigger.

### Props
- `side` (`'top' | 'bottom' | 'left' | 'right'`) — Preferred side relative to the trigger. Default: `'bottom'`.
- `align` (`'start' | 'center' | 'end'`) — Alignment of the menu along the chosen side. Default: `'start'`.
- `sideOffset` (number) — Distance in pixels between the trigger and the menu. Default: `4`.

### Usage
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>Options</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align="start" :side-offset="8">
      <DropdownMenuItem @select="console.log('save')">
        Save
      </DropdownMenuItem>
      <DropdownMenuItem @select="console.log('delete')">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notes
- If the preferred side has no room, the menu flips automatically.
- Keyboard navigates items with arrows, Home/End, Escape, and Tab (closes the menu).
- Closing via outside click returns focus to the trigger by default.
