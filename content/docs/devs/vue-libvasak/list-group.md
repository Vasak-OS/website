---
title: "Listas | ListGroup"
weight: 106
description: "ListGroup: contenedor de filas de lista con divisores, superficie y roles listbox o group."
---

# `ListGroup`

### Descripción
- Contenedor de una lista de `ListRow`: dibuja el canto, la superficie y los divisores entre filas.
- Con `divided` en `false` las filas quedan a ras con su radio y un relleno de 4 px, sin líneas, como las opciones de un menú.
- Por omisión es solo un contenedor visual; con `role="listbox"` es una lista de opciones y `label` le da nombre.

### Props
- `divided` (boolean) — Separa las filas con líneas `ui-line-weak`. Por defecto: `true`.
- `role` (`'listbox' | 'group'`) — Rol ARIA del contenedor. Sin valor por defecto.
- `label` (string) — El nombre de la lista, ya traducido.
- `multiselectable` (boolean) — Para un `listbox` de varias elecciones. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import ListGroup from '../list/ListGroup.vue'
import ListRow from '../list/ListRow.vue'
</script>

<template>
  <ListGroup label="Dispositivos" divided>
    <ListRow title="Laptop" subtitle="Conectado" />
    <ListRow title="Teléfono" subtitle="Sin conexión" />
  </ListGroup>
</template>
```

### Notas
- Provee contexto a las `ListRow` hijas a través de `LIST_GROUP_KEY`.
- `label` se usa como `aria-label` y debe ir ya traducido.
