---
title: "DropdownMenu | DropdownMenuTrigger"
weight: 122
description: "Dropdown menu trigger that manages click and keyboard opening, with as-child support."
---

# `DropdownMenuTrigger`

### Description
- Component that opens the dropdown menu via click or keyboard interaction.
- Uses a render function to clone the child and apply ARIA attributes directly.
- Can act as a wrapper (`as-child` disabled) or clone the child without a wrapper (`as-child` enabled).

### Props
- `asChild` (boolean) — Clones the child without a wrapper, applying attributes directly. Default: `false`.
- `disabled` (boolean) — Disables the trigger. Default: `false`.

### Usage
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'
</script>

<template>
  <!-- With wrapper (div) -->
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button>Open</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('ok')">
        Accept
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Without wrapper: attributes on the button -->
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button class="custom-class">Open</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('ok')">
        Accept
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notes
- Enter, space, arrow down, and arrow up open the menu. Escape closes it.
- With `as-child`, ARIA attributes apply directly to the button, not to a wrapper.
- `preventDefault` on keyboard prevents the browser's synthetic duplicate click.
