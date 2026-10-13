---
title: "Feedback | ToastArea"
weight: 140
description: "ToastArea: contenedor teletransportado al body para apilar avisos transitorios con posición, animación y ranura personalizable."
---

# `ToastArea`

### Descripción
- Contenedor de avisos transitorios (toasts) teletransportado al `body`. Gestiona posición, forma, animación y accesibilidad; la cola (cuándo aparecen, cuánto duran) la decide la aplicación.

### Props
- `toasts` (`ToastNotice[]`) — Lista de avisos a mostrar. **Requerido**.
- `position` (`'bottom-right' | 'bottom-center' | 'top-right' | 'top-center'`) — Dónde se apilan. Por defecto: `'bottom-right'`.

### Emite
- `action` (`ToastNotice`) — Se emite cuando se toca el botón de un aviso.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ToastArea, { type ToastNotice } from '../feedback/ToastArea.vue'

const toasts = ref<ToastNotice[]>([
  { id: 1, message: 'Archivo copiado', tone: 'success' }
])
</script>

<template>
  <ToastArea :toasts="toasts" position="bottom-right" />
</template>
```

### Notas
- `ToastNotice` incluye: `id`, `message`, `tone`, `title`, `description`, `progress`, `action`.
- La ranura por defecto recibe `{ toast, aviso }` para personalizar el contenido de cada aviso.
- Los avisos con barra de progreso usan ancho fijo (`w-80`).
- Arriba, el más nuevo va primero (pegado al borde).
