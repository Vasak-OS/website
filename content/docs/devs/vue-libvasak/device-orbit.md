---
title: "Tarjeta | DeviceOrbit"
weight: 202
description: "DeviceOrbit: vista radial con el dispositivo o red al centro y sus datos como satélites unidos por líneas."
---

# `DeviceOrbit`

### Descripción
Vista radial con un dispositivo o red al centro y sus datos (MAC, batería, señal, IP) como satélites alrededor, unidos por líneas SVG. Si la caja es demasiado angosta, apila los satélites debajo del círculo en modo columna. Al cambiar `orbitKey` los satélites se contraen hacia el centro y salen los nuevos en 200 ms. `pulsing` hace latir el halo mientras se buscan dispositivos.

### Props
- `label` (string) — Nombre del grupo ya traducido, usado como `aria-label`. **Requerido**.
- `center` (OrbitCenter | null) — El dispositivo o red del centro: `icon`, `iconType`, `title`, `subtitle`. `null` muestra el círculo vacío.
- `satellites` (OrbitSatellite[]) — Datos alrededor. Cada satélite: `id` (único), `label`, `value` (vacío o `null` no se dibuja, salvo acción), `icon`, `action` (es un botón y emite `select`), `tone` (`'accent'` pinta el valor de primario), `disabled`.
- `emptyLabel` (string) — Texto del círculo vacío. Por defecto: `''`.
- `emptyIcon` (string) — Icono del círculo vacío. Por defecto: `''`.
- `pulsing` (boolean) — El halo late: se está buscando. Por defecto: `false`.
- `orbitKey` (string | number) — Cambiarla dispara la transición de satélites (contraer y salir). Por defecto: `''`.
- `layout` (`'auto'|'stacked'`) — `auto` reparte si entra y apila si no; `stacked` apila siempre. Por defecto: `'auto'`.

### Emite
- `select` — Se eligió un satélite con `action`; el argumento es el `id` del satélite.

### Uso
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

### Notas
- Sin centro (`center` en `null`) queda el círculo vacío con `emptyLabel` y normalmente una sola acción.
- Un satélite sin dato no se dibuja, salvo que sea una acción.
- Los satélites son una lista ordenada y accesible por teclado; la posición radial es decoración.
