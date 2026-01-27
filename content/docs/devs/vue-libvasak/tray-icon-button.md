---
title: "Bandeja | TrayIconButton"
weight: 45
---

# `TrayIconButton`

Descripción
- Botón pensado para barras de sistema o áreas de iconos: muestra icono, badge y tooltip personalizado.

Props
- `icon` (string) — Ruta del icono. **Requerido**.
- `alt` (string) — Texto alternativo. Por defecto: `''`.
- `tooltip` (string) — Valor `title`. Por defecto: `''`.
- `badge` (number | null) — Contador; si es `null` o `0` no se muestra. Por defecto: `null`.
- `iconClass` (string | Record<string, boolean>) — Clases para el icono.
- `customClass` (string | Record<string, boolean>) — Clases para el contenedor.
- `tooltipClass` (string | Record<string, boolean>) — Clases para el tooltip personalizado.
- `showCustomTooltip` (boolean) — Muestra tooltip personalizado (interno). Por defecto: `false`.
- `customTooltipText` (string) — Texto del tooltip personalizado.

Emite
- `click` — Cuando el usuario hace click en el botón.

Slots
- Default — Contenido adicional dentro del botón.

Uso
```vue
<script setup lang="ts">
import TrayIconButton from '../tray/TrayIconButton.vue'
</script>

<template>
  <TrayIconButton
    icon="/icons/bell.svg"
    :badge="3"
    showCustomTooltip
    customTooltipText="Notificaciones"
    @click="() => console.log('clic')"
  />
</template>
```
