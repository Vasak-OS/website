---
title: "Tabs | TabItem"
weight: 194
description: "Pestaña con cierre, menú contextual, arrastre y soporte para cambios sin guardar."
---

# `TabItem`

### Descripción
- Una pestaña con cierre, menú contextual, arrastre para reordenar y soporte para cambios sin guardar.

### Props
- `tab` (TabEntry) — Datos de la pestaña: etiqueta, icono, estado. **Requerido**.
- `active` (boolean) — Indica si es la pestaña activa. Por defecto: `false`.
- `closeLabel` (string) — Nombre accesible del botón de cerrar.
- `dirtyLabel` (string) — Texto para cambios sin guardar.
- `tabindex` (number) — Índice de tabulación dentro de la barra. Por defecto: `0`.

### Emite
- `select` — Se emite al hacer clic o presionar Enter/Espacio.
- `close` — Se emite al cerrar la pestaña.
- `menu` — Se emite con la posición `{x, y}` al abrir el menú contextual.
- `mover` — Se emite con `-1` o `1` al reordenar con Alt+flecha.
- `navegar` — Se emite con `'anterior'`, `'siguiente'`, `'primera'` o `'ultima'`.

### Uso
```vue
<script setup lang="ts">
import TabItem from '../tabs/TabItem.vue'
const tab = { id: '1', label: 'Documento', icon: 'text-editor', dirty: true }
</script>

<template>
  <TabItem
    :tab="tab"
    :active="true"
    @select="activateTab"
    @close="closeTab"
  />
</template>
```

### Notas
- El clic del medio cierra la pestaña, como en un navegador.
- La pulsación larga abre el menú contextual, útil en pantallas táctiles.
- Con la barra vertical, el nombre aparece en un desplegado al pasar o enfocar.
