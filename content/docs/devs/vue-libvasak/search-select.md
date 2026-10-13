---
title: "Search | SearchSelect"
weight: 146
description: "SearchSelect: desplegable con búsqueda para listas largas, con teclado completo, recorte de resultados y lista dibujada por la página."
---

# `SearchSelect`

### Descripción
- Desplegable con búsqueda para listas largas (zonas horarias, categorías). La lista la dibuja la página, no el sistema, para respetar el tema. Incluye navegación por teclado completa (flechas, Enter, Escape, typeahead).

### Props
- `modelValue` (string) — Valor seleccionado. **Requerido**.
- `options` (`OpcionDeBusqueda[]`) — Opciones disponibles. **Requerido**.
- `label` (string) — Nombre accesible del botón cerrado.
- `searchPlaceholder` (string) — Marcador del campo de búsqueda interno.
- `emptyText` (string) — Texto cuando no hay coincidencias.
- `placeholder` (string) — Texto cuando no hay nada elegido. Por defecto: `'—'`.
- `disabled` (boolean) — Deshabilita el control. Por defecto: `false`.
- `limit` (number) — Máximo de opciones dibujadas. Por defecto: `60`.
- `up` (boolean) — Abre el menú hacia arriba. Por defecto: `false`.
- `searchable` (boolean) — Muestra el campo de búsqueda. En `false`, solo la lista. Por defecto: `true`.
- `buttonId` (string) — `id` del botón para `<label for>`.
- `buttonAttrs` (`Record<string, unknown>`) — Atributos adicionales para el botón (`aria-*`, `title`, `data-*`).

### Emite
- `update:modelValue` (string) — Se emite con el nuevo valor al elegir una opción.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SearchSelect from '../search/SearchSelect.vue'
import type { OpcionDeBusqueda } from '../search/buscar'

const valor = ref('')
const opciones: OpcionDeBusqueda[] = [
  { valor: 'es', etiqueta: 'Español' },
  { valor: 'en', etiqueta: 'English' }
]
</script>

<template>
  <SearchSelect v-model="valor" :options="opciones" label="Idioma" />
</template>
```

### Notas
- El recorte por `limit` es seguro porque la lista viene ordenada por relevancia.
- Sin búsqueda (`searchable: false`), el foco va a la lista y las teclas son las mismas.
- Se abre hacia arriba automáticamente si abajo no entra.
- Las opciones deshabilitadas se saltean con el teclado, como en un `<select>`.
