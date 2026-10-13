---
title: "Tabs | TabBar"
weight: 166
description: "TabBar: barra de pestañas con reordenamiento por arrastre, navegación por teclado y soporte vertical."
---

# `TabBar`

### Descripción
- Barra de pestañas para aplicaciones con múltiples documentos o vistas (terminal, gestor de archivos, editor).
- Soporta reordenamiento por arrastre nativo y con teclado, navegación con flechas y desplazamiento con rueda.
- Se adapta a orientación horizontal o vertical según el marco que la contiene.

### Props
- `tabs` (TabEntry[]) — Las pestañas de la barra. **Requerido**.
- `modelValue` (string) — Identificador de la pestaña activa. Por defecto: `''`.
- `newLabel` (string) — Etiqueta del botón de nueva pestaña; sin esto no se dibuja. Por defecto: `''`.
- `closeLabel` (string) — Etiqueta del botón de cierre. Sin esto, `tabs.close` del catálogo. Por defecto: `undefined`.
- `dirtyLabel` (string) — Etiqueta para pestañas con cambios sin guardar. Sin esto, `tabs.unsaved` del catálogo. Por defecto: `undefined`.
- `fixedOrder` (boolean) — Deshabilita el reordenamiento. Por defecto: `false`.

### Emite
- `update:modelValue` (string) — Se emite al seleccionar una pestaña.
- `select` (string) — Se emite al seleccionar una pestaña.
- `close` (string) — Se emite al cerrar una pestaña, con su identificador.
- `new` — Se emite al hacer clic en el botón de nueva pestaña.
- `reorder` (TabEntry[]) — Se emite al reordenar, con la lista nueva completa.
- `menu` ({ id: string; x: number; y: number }) — Se emite al abrir el menú contextual de una pestaña.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import TabBar from '../tabs/TabBar.vue'

const tabs = ref([
  { id: '1', title: 'Documento 1', dirty: false },
  { id: '2', title: 'Documento 2', dirty: true }
])
const active = ref('1')
</script>

<template>
  <TabBar
    :tabs="tabs"
    v-model="active"
    new-label="Nueva pestaña"
    @close="tabs = tabs.filter(t => t.id !== $event)"
    @new="tabs.push({ id: String(Date.now()), title: 'Nuevo', dirty: false })"
  />
</template>
```

### Notas
- El reordenamiento se hace con arrastre nativo (HTML5 Drag and Drop) y con las flechas del teclado cuando `fixedOrder` es `false`.
- La navegación por teclado usa el patrón «foco itinerante»: una sola pestaña en el orden de tabulación.
- La rueda desplaza el carril en su eje (horizontal o vertical).
