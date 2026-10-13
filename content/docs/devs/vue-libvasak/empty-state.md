---
title: "Realimentación | EmptyState"
weight: 66
description: "EmptyState: mensaje para pantallas vacías, con título, nota, icono y ranura para acciones."
---

# `EmptyState`

### Descripción
- Muestra un mensaje cuando no hay contenido: una carpeta vacía, una búsqueda sin resultados o una lista que todavía no empezó.

### Props
- `title` (string) — Título principal del mensaje. **Requerido**.
- `note` (string) — Segunda línea con una explicación o una acción sugerida.
- `icon` (string) — Nombre del icono del tema. Por defecto: `'dialog-information'`.
- `iconType` (`'icon'|'symbol'`) — Variante del icono del tema. Por defecto: `'icon'`.
- `bordered` (boolean) — Dibuja un borde punteado alrededor. Por defecto: `false`.
- `size` (`'sm'|'md'`) — `md` llena un hueco grande; `sm` va en una caja del alto de unas filas. Por defecto: `'md'`.
- `muted` (boolean) — El título como una línea atenuada, sin peso. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import EmptyState from '../feedback/EmptyState.vue'
</script>

<template>
  <EmptyState
    title="No hay resultados"
    note="Prueba con otros términos de búsqueda."
    icon="search"
  />
</template>
```

### Notas
- El icono se oculta con `icon=""`: no queda un hueco del tamaño del icono.
- La ranura por defecto permite añadir un botón para salir del vacío, como «Crear carpeta» o «Limpiar filtros».
