---
title: "Control | PowerActions"
weight: 210
description: "Power actions (suspend, reboot, shutdown) as icons or tiles, using theme icons."
---

# `PowerActions`

### Description
- Set of system power actions: suspend, hibernate, reboot, power off, log out, and lock. Presented as a row of icons or as tiles with the label below. The library emits the action; the consumer runs the corresponding command.

### Props
- `actions` (readonly PowerAction[]) — Which actions to show, in order. Default: `['suspend', 'reboot', 'poweroff']`.
- `variant` (`'icons' | 'tiles'`) — Visual format. Default: `'icons'`.
- `buttonVariant` (`'secondary' | 'ghost' | 'overlay'`) — Button style for `icons`; `overlay` for wallpaper backgrounds. Default: `'secondary'`.
- `labels` (Partial<Record<PowerAction, string>>) — Translated labels. Missing ones fall back to the catalog or English.
- `label` (string) — Group name for screen readers.
- `disabled` (boolean) — Disables all actions. Default: `false`.

### Emits
- `action` (PowerAction) — When the user picks an action.

### Usage
```vue
<script setup lang="ts">
import PowerActions from '../controls/PowerActions.vue'

function onAction(action: string) {
  // Call logind, greetd or the session manager
  console.log(action)
}
</script>

<template>
  <PowerActions
    variant="icons"
    @action="onAction"
  />
</template>
```

### Notes
- `PowerAction` is `'suspend' | 'hibernate' | 'reboot' | 'poweroff' | 'logout' | 'lock'`.
- Icons use freedesktop names: `system-suspend`, `system-reboot`, etc.
- The library executes no action and asks for confirmation; that depends on the screen.
