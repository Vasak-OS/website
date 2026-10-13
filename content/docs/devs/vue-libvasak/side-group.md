---
title: "Barra lateral | SideGroup"
weight: 212
description: "Grupo de elementos de la barra lateral con título plegable y apertura forzada cuando la barra está plegada."
---

# `SideGroup`

### Descripción
- Agrupa elementos de la barra lateral bajo un título plegable. Cuando la barra lateral está plegada, el título se oculta y el grupo se abre automáticamente para no esconder contenido.

### Props
- `title` (string) — Título del grupo. **Requerido**.
- `collapsed` (boolean) — Indica si la barra lateral está plegada; fuerza la apertura del grupo. Por defecto: `false`.
- `defaultOpen` (boolean) — Si el grupo empieza abierto. Por defecto: `true`.

### Uso
```vue
<script setup lang="ts">
import SideGroup from '../sidebar/SideGroup.vue'
</script>

<template>
  <SideGroup title="Navegación">
    <!-- Elementos del grupo -->
  </SideGroup>
</template>
```

### Notas
- El título se oculta visualmente cuando `collapsed` es `true`, pero el contenido sigue accesible.
