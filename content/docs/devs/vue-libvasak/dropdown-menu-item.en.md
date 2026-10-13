---
title: "DropdownMenu | DropdownMenuItem"
weight: 119
description: "Interactive dropdown menu item with selection, checkboxes, radio, keyboard shortcuts, and danger support."
---

# `DropdownMenuItem`

### Description
- Represents an interactive option within the dropdown menu.
- Supports regular items, checkboxes, and radios, icons, descriptions, keyboard shortcuts, and danger variant.
- On selection, closes the menu and returns focus.

### Props
- `disabled` (boolean) — Disables the item. Default: `false`.
- `checked` (`boolean | 'mixed' | null`) — Item check state. `null` is a regular item. Default: `null`.
- `toggle` (`'checkbox' | 'radio'`) — Check type when `checked` is not `null`. Default: `'checkbox'`.
- `inset` (number) — Number of icon columns (28 px) to offset the text. Default: `0`.
- `icon` (string) — Theme icon name shown before the text.
- `iconType` (`'icon' | 'symbol'`) — Icon rendering type. Default: `'symbol'`.
- `shortcut` (`readonly string[]`) — Keyboard shortcut keys. Default: `[]`.
- `danger` (boolean) — Applies danger styling to the item. Default: `false`.

### Emits
- `select` — Emitted when the item is chosen (click or keyboard).
- `click` — Emitted with the native event when the item is chosen.
- `update:checked` — Emitted with the new boolean value when a checkable item is chosen.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'

const checked = ref(false)
const view = ref('list')
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>View</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem v-model:checked="checked">
        Show details
      </DropdownMenuItem>
      <DropdownMenuItem
        toggle="radio"
        :checked="view === 'list' ? true : null"
        @update:checked="view = 'list'"
      >
        List view
      </DropdownMenuItem>
      <DropdownMenuItem
        toggle="radio"
        :checked="view === 'grid' ? true : null"
        @update:checked="view = 'grid'"
      >
        Grid view
      </DropdownMenuItem>
      <DropdownMenuItem danger shortcut="⌘Q">
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notes
- A disabled item is still keyboard accessible and appears in the DOM with `aria-disabled`.
- `checked="mixed"` shows a dash (indeterminate checkbox) and only works with `toggle="checkbox"`.
- `danger` applies an error-tinted hover/active overlay but the text does not turn red due to contrast.
