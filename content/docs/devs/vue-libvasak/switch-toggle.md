---
title: "Formulario | SwitchToggle"
weight: 35
---

# `SwitchToggle`

Descripción
- Interruptor tipo toggle con animación. Devuelve el nuevo estado mediante evento `toggle`.

Props
- `isOn` (boolean) — Estado actual del switch. **Requerido**.
- `disabled` (boolean) — Deshabilita la interacción. Por defecto: `false`.
- `size` (`'small'|'medium'`) — Tamaño visual. Por defecto: `'small'`.
- `activeClass` (string) — Clase aplicada cuando está activo. Por defecto: `'bg-vsk-primary'`.
- `inactiveClass` (string) — Clase cuando está inactivo. Por defecto: `'background'`.
- `customClass` (string) — Clases adicionales.

Emite
- `toggle` — Emite `[value: boolean]` con el nuevo estado.

Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SwitchToggle from '../forms/SwitchToggle.vue'
const enabled = ref(true)
</script>

<template>
  <SwitchToggle :isOn="enabled" @toggle="v => enabled = v" />
</template>
```

