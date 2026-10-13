---
title: "Control | QuickSettingsTile"
weight: 136
description: "QuickSettingsTile: mosaico de ajustes rápidos con estado activo, zona de detalle opcional y soporte para no disponible."
---

# `QuickSettingsTile`

### Descripción
- Mosaico de ajustes rápidos (Wi-Fi, Bluetooth, No molestar) con dos zonas táctiles separadas: el cuerpo alterna o activa, y la zona de detalle abre información adicional.

### Props
- `icon` (string) — Nombre del icono en el tema del escritorio. **Requerido**.
- `iconType` (`'icon' | 'symbol'`) — Variante del tema para el icono. Por defecto: `'symbol'`.
- `title` (string) — Título del ajuste, ya traducido. **Requerido**.
- `status` (string) — Texto de estado, ya traducido («Conectado a Casa», «Apagado»).
- `active` (`boolean | null`) — Si el mosaico alterna algo: `true`/`false`. En `null` (por omisión) abre otra cosa y no lleva `aria-pressed`. Por defecto: `null`.
- `detail` (boolean) — Muestra la zona de detalle con flecha ›. Por defecto: `false`.
- `detailLabel` (string) — Nombre accesible de la zona de detalle. Sin él, «Detalles de» + el título.
- `disabled` (boolean) — «Ahora no»: no se puede tocar, el estado queda como está. Por defecto: `false`.
- `unavailable` (boolean) — «Este equipo no lo tiene»: se ve apagado, muestra «No disponible» y no se puede tocar. Por defecto: `false`.
- `unavailableLabel` (string) — Texto de no disponible, ya traducido.
- `loading` (boolean) — Mientras el cambio se aplica. Por defecto: `false`.

### Emite
- `activate` — Se emite al tocar el cuerpo (si no está bloqueado ni en `loading`).
- `detail` — Se emite al tocar la zona de detalle (si no está bloqueado).

### Uso
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
    status="Conectado a Casa"
    :active="wifiActive"
    detail
    @activate="wifiActive = !wifiActive"
    @detail="/* abrir detalle */"
  />
</template>
```

### Notas
- El título y el estado usan `MarqueeText`: si no entran, se deslizan en vez de cortarse.
- Por debajo de 11,5 rem el círculo del icono se reemplaza por un icono chico de 16 px.
- `unavailable` es distinto de `disabled`: el primero es «este equipo no lo tiene», el segundo es «ahora no».
