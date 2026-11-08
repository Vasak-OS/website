---
title: "Lista | SortableList"
weight: 216
description: "SortableList: una lista que se reordena arrastrando desde un asa y con el teclado, sin reimplementar el movimiento en cada pantalla."
---

# `SortableList`

### Descripción
- Una lista que se reordena arrastrando y también con el teclado. No dibuja la fila —eso lo pone quien la usa, por la ranura `item`—: pone el asa, el arrastre y el reordenamiento, y emite la lista ya reordenada.
- Es genérica sobre el tipo de ítem (`T`) y trabaja con `v-model`.

### Props
- `modelValue` (`T[]`) — La lista. Se emite reordenada por `update:modelValue`.
- `itemKey` (`keyof T | ((item: T, index: number) => string | number)`) — Cómo identificar cada ítem: el nombre de un campo (`'id'`), una función, o —sin esto— la identidad del objeto.
- `label` (string) — El nombre accesible de la lista (`aria-label` del `ul`).
- `handleIcon` (string) — El icono del asa, tomado del tema. Por omisión `list-drag-handle`.
- `handleLabel` (string) — Lo que se oye en el asa. Sin esto, `sortableList.reorder` del catálogo de textos o «Reorder».
- `disabled` (boolean) — Apaga el reordenamiento: sin asa y sin arrastre. No atenúa la fila.

### Emite
- `update:modelValue` (`T[]`) — La lista ya reordenada, para el `v-model`.
- `reorder` (`{ from: number; to: number }`) — El movimiento por índices; se emite al mismo tiempo que la lista.

### Ranura
- `item` — La fila. Recibe `item` e `index`; los controles que lleve adentro siguen funcionando.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SortableList from '../list/SortableList.vue'
import ListRow from '../list/ListRow.vue'

const anchored = ref([
  { id: 'red', name: 'Red' },
  { id: 'bluetooth', name: 'Bluetooth' },
  { id: 'audio', name: 'Audio' },
])
</script>

<template>
  <SortableList v-model="anchored" item-key="id" label="Anclados del panel">
    <template #item="{ item }">
      <ListRow :title="item.name" />
    </template>
  </SortableList>
</template>
```

### Notas
- **Teclado**: con el asa enfocada, las flechas mueven la fila un lugar e Inicio/Fin la llevan a la punta. **Espacio/Enter** la agarra; desde ahí las flechas la mueven en borrador, otro Espacio/Enter la suelta y **Escape** cancela y la devuelve a donde estaba. Cada paso se anuncia por una región viva (`aria-live`).
- El asa es un `<button>` propio y no la fila entera: un botón de quitar o de plegar adentro sigue recibiendo el clic sin pelear con el arrastre.
- El arrastre usa eventos de puntero con captura, no el arrastre HTML ni una librería de terceros: el asa se queda con el puntero aunque se salga de ella y `touch-none` deja arrastrar con el dedo sin que la lista se desplace.
- La clave por omisión es la identidad del objeto, no la posición ni un campo: dos ítems con el mismo texto se siguen distinguiendo y la fila que se mueve no se vuelve a montar (con una clave por posición perdería el foco).
- Los textos que anuncia se pueden cambiar con el catálogo de la biblioteca: `sortableList.reorder`, `sortableList.hint`, `sortableList.moved`, `sortableList.grabbed`, `sortableList.dropped` y `sortableList.cancelled`.
- La forma —asa de 32 sin borde y fila levantada sobre la superficie flotante— es la de Once UI; los colores salen del esquema del sistema y el icono, del tema (decisión 8).
