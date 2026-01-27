---
title: "Control | ToggleControl"
weight: 30
---

# `ToggleControl`

Descripción
- Botón de acción con icono que muestra estados `isActive` e `isLoading`. Ideal para acciones rápidas (play/pause, encendido).

Props
- `icon` (string) — Ruta del icono. **Requerido**.
- `alt` (string) — Texto alternativo. Por defecto: `''`.
- `tooltip` (string) — Texto `title` del icono. Por defecto: `''`.
- `isActive` (boolean) — Estado activo. Por defecto: `false`.
- `isLoading` (boolean) — Estado de carga que deshabilita y anima. Por defecto: `false`.
- `iconClass` (Record<string, boolean>) — Clases reactivas para el icono.
- `customClass` (Record<string, boolean>) — Clases reactivas para el contenedor.

Emite
- `click` — Evento cuando se pulsa el control (si no está en loading).

Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ToggleControl from '../controls/ToggleControl.vue'
const active = ref(false)
</script>

<template>
  <ToggleControl
    icon="/icons/power.svg"
    :isActive="active"
    @click="() => { active = !active }"
  />
</template>
```
