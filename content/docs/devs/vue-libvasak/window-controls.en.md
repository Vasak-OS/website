---
title: "Window | WindowControls"
weight: 176
description: "Minimize, maximize and close buttons with flat and macOS styles."
---

# `WindowControls`

### Description
- Minimize, maximize and close window buttons, with flat and macOS styles.

### Props
- `controls` (`ControlDeVentana[]`) — Which of the three buttons are drawn and in what order. Default: all three.
- `minimizeLabel` (string) — Accessible name for the minimize button.
- `maximizeLabel` (string) — Accessible name for the maximize button.
- `closeLabel` (string) — Accessible name for the close button.
- `variant` (`WindowControlsStyle | null`) — Forces the visual style, ignoring the desktop preference. Default: `null`.
- `order` (`WindowControlsOrder | null`) — Forces the button order, ignoring the preference. Default: `null`.

### Emits
- `minimize` — Emitted when minimize is clicked and a listener is present.
- `maximize` — Emitted when maximize is clicked and a listener is present.
- `close` — Emitted when close is clicked and a listener is present.

### Usage
```vue
<script setup lang="ts">
import WindowControls from '../window/WindowControls.vue'
</script>

<template>
  <WindowControls
    :controls="['minimize', 'maximize', 'close']"
    @close="handleClose"
  />
</template>
```

### Notes
- If no listener is present for an event, the button performs the action directly on the window.
- The macOS style shows the three colored circles with the icon appearing on hover.
