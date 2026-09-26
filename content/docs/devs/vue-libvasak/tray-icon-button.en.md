---
title: "Tray | TrayIconButton"
weight: 45
---

# `TrayIconButton`

Description
- Button designed for system bars or icon areas: shows an icon, a badge and a custom tooltip.

Props
- `icon` (string) — Path to the icon. **Required**.
- `alt` (string) — Alternative text. Default: `''`.
- `tooltip` (string) — `title` value. Default: `''`.
- `badge` (number | null) — Counter; not shown if `null` or `0`. Default: `null`.
- `iconClass` (string | Record<string, boolean>) — Classes for the icon.
- `customClass` (string | Record<string, boolean>) — Classes for the container.
- `tooltipClass` (string | Record<string, boolean>) — Classes for the custom tooltip.
- `showCustomTooltip` (boolean) — Shows the custom tooltip (internal). Default: `false`.
- `customTooltipText` (string) — Text of the custom tooltip.

Emits
- `click` — When the user clicks the button.

Slots
- Default — Extra content inside the button.

Usage
```vue
<script setup lang="ts">
import TrayIconButton from '../tray/TrayIconButton.vue'
</script>

<template>
  <TrayIconButton
    icon="/icons/bell.svg"
    :badge="3"
    showCustomTooltip
    customTooltipText="Notifications"
    @click="() => console.log('click')"
  />
</template>
```
