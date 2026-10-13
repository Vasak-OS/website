---
title: "Card | DeviceOrbit"
weight: 202
description: "DeviceOrbit: radial view with the device or network at the center and its data as satellites connected by lines."
---

# `DeviceOrbit`

### Description
Radial view with a device or network at the center and its data (MAC, battery, signal, IP) as satellites around it, connected by SVG lines. If the container is too narrow, it stacks the satellites below the circle in column mode. Changing `orbitKey` collapses satellites toward the center and expands the new ones in 200 ms. `pulsing` makes the halo beat while searching for devices.

### Props
- `label` (string) — Group name, already translated, used as `aria-label`. **Required**.
- `center` (OrbitCenter | null) — The device or network at the center: `icon`, `iconType`, `title`, `subtitle`. `null` shows the empty circle.
- `satellites` (OrbitSatellite[]) — Data around the center. Each satellite: `id` (unique), `label`, `value` (empty or `null` is not rendered, unless action), `icon`, `action` (it is a button and emits `select`), `tone` (`'accent'` paints the value in primary), `disabled`.
- `emptyLabel` (string) — Text for the empty circle. Default: `''`.
- `emptyIcon` (string) — Icon for the empty circle. Default: `''`.
- `pulsing` (boolean) — The halo beats: searching in progress. Default: `false`.
- `orbitKey` (string | number) — Changing it triggers the satellite transition (collapse and expand). Default: `''`.
- `layout` (`'auto'|'stacked'`) — `auto` distributes if it fits, stacks if not; `stacked` always stacks. Default: `'auto'`.

### Emits
- `select` — An `action` satellite was selected; the argument is the satellite `id`.

### Usage
```vue
<script setup lang="ts">
import DeviceOrbit from '../cards/DeviceOrbit.vue'

const center = { title: 'Mi Red', subtitle: 'Conectada', icon: 'network-wifi' }
const satellites = [
  { id: 'ip', label: 'IP', value: '192.168.1.42' },
  { id: 'scan', label: 'Buscar', action: true },
]
</script>

<template>
  <DeviceOrbit
    label="Red"
    :center="center"
    :satellites="satellites"
    emptyIcon="network-wifi"
    emptyLabel="Sin conexión"
    layout="auto"
    @select="onSelect"
  />
</template>
```

### Notes
- Without a center (`center` is `null`), the empty circle with `emptyLabel` is shown, normally with a single action.
- A satellite without a datum is not rendered, unless it is an action.
- Satellites are an ordered, keyboard-accessible list; the radial position is decorative.
