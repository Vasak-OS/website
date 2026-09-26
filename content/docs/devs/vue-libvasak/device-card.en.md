---
title: "Card | DeviceCard"
weight: 40
---

# `DeviceCard`

Description
- Card that shows basic information about a device (icon, title, subtitle, metadata and actions).

Props
- `icon` (string) — Path to the icon. **Required**.
- `title` (string) — Main title. **Required**.
- `subtitle` (string) — Optional secondary line. Default: `''`.
- `metadata` (string) — Extra text. Default: `''`.
- `extraInfo` (string[]) — List of extra texts. Default: `[]`.
- `isConnected` (boolean) — Connection state; shows an indicator. Default: `false`.
- `showActionButton` (boolean) — Shows the action button. Default: `true`.
- `actionLabel` (string) — Action button text. Default: `'Connect'`.
- `showStatusIndicator` (boolean) — Shows a status dot when connected. Default: `false`.
- `customClass` (string) — Additional classes.
- `clickable` (boolean) — Whether the card responds to clicks. Default: `false`.

Emits
- `action` — When the action button is pressed.
- `click` — When the card is pressed (if applicable).

Usage
```vue
<script setup lang="ts">
import DeviceCard from '../cards/DeviceCard.vue'
</script>

<template>
  <DeviceCard
    icon="/icons/device.svg"
    title="My device"
    subtitle="Bluetooth"
    :isConnected="true"
    @action="() => console.log('action')"
    @click="() => console.log('card clicked')"
  />
</template>
```
