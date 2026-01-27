---
title: "Control | ActionButton"
weight: 30
---

# `ActionButton`

Descripción
- Componente de botón genérico con variantes (`primary`, `secondary`, `danger`), estados de carga y soporte para iconos.

Props
- `label` (string) — Texto del botón. **Requerido**.
- `disabled` (boolean) — Deshabilita el botón. Por defecto: `false`.
- `variant` (`'primary'|'secondary'|'danger'`) — Estilo visual. Por defecto: `'primary'`.
- `loading` (boolean) — Muestra un spinner y deshabilita la acción. Por defecto: `false`.
- `customClass` (string | Record<string, boolean>) — Clases adicionales.
- `size` (`'sm'|'md'|'lg'`) — Tamaño del botón. Por defecto: `'md'`.
- `fullWidth` (boolean) — Hace el botón de ancho completo. Por defecto: `false`.
- `iconSrc` (string) — Ruta/URL del icono.
- `iconAlt` (string) — Texto alternativo para el icono.
- `iconRight` (boolean) — Coloca el icono a la derecha. Por defecto: `false`.
- `type` (`'button'|'submit'|'reset'`) — Tipo del `button`. Por defecto: `'button'`.
- `stopPropagation` (boolean) — Llama `event.stopPropagation()` en click. Por defecto: `false`.
- `preventDefault` (boolean) — Llama `event.preventDefault()` en click. Por defecto: `false`.

Emite
- `click` — Se emite cuando el usuario hace click y el botón no está deshabilitado ni en `loading`.

Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ActionButton from '../controls/ActionButton.vue'
const loading = ref(false)
</script>

<template>
  <ActionButton
    label="Guardar"
    :loading="loading"
    variant="primary"
    @click="() => { loading = true; /* acción */ }"
  />
</template>
```

Notas
- `customClass` acepta objeto para clases reactivas.
- Cuando `iconSrc` está presente y no hay `label`, el padding se ajusta automáticamente.

