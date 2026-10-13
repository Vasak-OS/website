---
title: "Control | QuickSettingsTile"
weight: 136
description: "QuickSettingsTile: quick settings tile with active state, optional detail area, and unavailable support."
---

# `QuickSettingsTile`

### Description
- Quick settings tile (Wi-Fi, Bluetooth, Do Not Disturb) with two separate touch zones: the body toggles or activates, and the detail area opens additional information.

### Props
- `icon` (string) — Icon name in the desktop theme. **Required**.
- `iconType` (`'icon' | 'symbol'`) — Theme variant for the icon. Default: `'symbol'`.
- `title` (string) — Setting title, already translated. **Required**.
- `status` (string) — Status text, already translated («Connected to Home», «Off»).
- `active` (`boolean | null`) — If the tile toggles something: `true`/`false`. In `null` (by default) it opens something else and does not carry `aria-pressed`. Default: `null`.
- `detail` (boolean) — Shows the detail area with › arrow. Default: `false`.
- `detailLabel` (string) — Accessible name of the detail area. Without it, «Details of» + the title.
- `disabled` (boolean) — «Not now»: cannot be touched, state stays as-is. Default: `false`.
- `unavailable` (boolean) — «This device does not have it»: looks off, shows «Not available», and cannot be touched. Default: `false`.
- `unavailableLabel` (string) — Unavailable text, already translated.
- `loading` (boolean) — While the change is being applied. Default: `false`.

### Emits
- `activate` — Emitted when the body is touched (if not blocked or `loading`).
- `detail` — Emitted when the detail area is touched (if not blocked).

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import QuickSettingsTile from '../controls/QuickSettingsTile.vue'

const wifiActive = ref(true)
</script>

<template>
  <QuickSettingsTile
    icon="network-wireless"
    title="Wi-Fi"
    status="Connected to Home"
    :active="wifiActive"
    detail
    @activate="wifiActive = !wifiActive"
    @detail="/* open detail */"
  />
</template>
```

### Notes
- Title and status use `MarqueeText`: if they do not fit, they scroll instead of being cut off.
- Below 11.5 rem the icon circle is replaced by a small 16 px icon.
- `unavailable` is different from `disabled`: the former means «this device does not have it», the latter means «not now».
