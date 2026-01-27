---
title: "Tarjeta | DeviceCard"
weight: 40
---

# `DeviceCard`

Descripción
- Tarjeta que muestra información básica de un dispositivo (icono, título, subtítulo, metadata y acciones).

Props
- `icon` (string) — Ruta del icono. **Requerido**.
- `title` (string) — Título principal. **Requerido**.
- `subtitle` (string) — Línea secundaria opcional. Por defecto: `''`.
- `metadata` (string) — Texto adicional. Por defecto: `''`.
- `extraInfo` (string[]) — Lista de textos extra. Por defecto: `[]`.
- `isConnected` (boolean) — Estado de conexión; muestra indicador. Por defecto: `false`.
- `showActionButton` (boolean) — Muestra botón de acción. Por defecto: `true`.
- `actionLabel` (string) — Texto del botón de acción. Por defecto: `'Conectar'`.
- `showStatusIndicator` (boolean) — Muestra un punto de estado cuando está conectado. Por defecto: `false`.
- `customClass` (string) — Clases adicionales.
- `clickable` (boolean) — Indica si la tarjeta responde a click. Por defecto: `false`.

Emite
- `action` — Cuando se pulsa el botón de acción.
- `click` — Cuando se pulsa la tarjeta (si aplica).

Uso
```vue
<script setup lang="ts">
import DeviceCard from '../cards/DeviceCard.vue'
</script>

<template>
  <DeviceCard
    icon="/icons/device.svg"
    title="Mi dispositivo"
    subtitle="Bluetooth"
    :isConnected="true"
    @action="() => console.log('acción')"
    @click="() => console.log('tarjeta clic')"
  />
</template>
```

