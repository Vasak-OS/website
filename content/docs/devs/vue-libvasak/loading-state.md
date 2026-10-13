---
title: "Retroalimentación | LoadingState"
weight: 92
description: "LoadingState: indicador de espera a pantalla completa con etiqueta accesible y opción compacta."
---

# `LoadingState`

### Descripción
- Componente que se muestra mientras se espera algo que llena la pantalla. Es el hermano de `EmptyState`: el mismo hueco, pero todavía no se sabe si va a quedar vacío.

### Props
- `label` (string) — Qué se está esperando, ya traducido: «Cargando fotos…». **Requerido**.
- `bordered` (boolean) — Dibuja un borde punteado, para una caja dentro de una sección. Por defecto: `false`.
- `size` (`'sm'|'md'`) — `sm` es la fila compacta con el aro de 16 px al lado del texto; `md` es el aro grande centrado arriba. Por defecto: `'md'`.

### Uso
```vue
<script setup lang="ts">
import LoadingState from '../feedback/LoadingState.vue'
</script>

<template>
  <!-- Espera grande que llena la pantalla -->
  <LoadingState label="Cargando fotos…" />

  <!-- Fila compacta dentro de una lista -->
  <LoadingState size="sm" label="Cargando…" />

  <!-- Caja con borde punteado dentro de una sección -->
  <LoadingState bordered label="Explorando paquetes…" />
</template>
```

### Notas
- Lleva `role="status"` y `aria-atomic="true"`: anuncia la espera sin interrumpir y lee el texto completo cuando cambia.
- El anillo se queda quieto cuando el sistema pide movimiento reducido (`motion-reduce`).
