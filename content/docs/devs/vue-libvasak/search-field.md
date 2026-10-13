---
title: "Búsqueda | SearchField"
weight: 94
description: "SearchField: campo de búsqueda del sistema con lupa, cruz para vaciar, rebote y búsqueda inmediata."
---

# `SearchField`

### Descripción
- Componente del campo de búsqueda del sistema. Por dentro es el `TextInput` del sistema, con lupa, cruz para vaciar y rueda de carga integrada. Dos eventos distintos: `update:modelValue` (el texto, en cada tecla) y `search` («buscar de verdad», con Enter o tras el rebote).

### Props
- `modelValue` (string) — El texto del campo (con `v-model`). Por defecto: `''`.
- `placeholder` (string) — Texto de ayuda cuando el campo está vacío.
- `label` (string) — Lo que oye un lector de pantalla; el campo no lleva etiqueta visible. Por defecto: `''`.
- `disabled` (boolean) — Deshabilita el campo. Por defecto: `false`.
- `autofocus` (boolean) — Pide el foco al montar, para la búsqueda que se abre en un menú o panel. Por defecto: `false`.
- `debounce` (number) — Milisegundos de espera tras la última tecla antes de emitir `search`. En `0`, `search` sale solo con Enter. Por defecto: `0`.
- `clearable` (boolean) — Muestra la cruz para vaciar el campo. Por defecto: `true`.
- `busy` (boolean) — Cambia la lupa por una rueda de carga: la búsqueda está trabajando. Por defecto: `false`.
- `listboxId` (string) — El `id` de la lista que este campo maneja, si maneja una. Convierte el campo en un patrón `combobox`.
- `activeOptionId` (string) — El `id` de la opción marcada dentro de esa lista, para anunciarla sin mover el foco.
- `expanded` (boolean) — Si la lista está desplegada.
- `clearLabel` (string) — Lo que se oye en la cruz; si no, sale del catálogo (`search.clear`). Por defecto: `''`.
- `size` (`'md'|'lg'`) — `lg` es el campo de 40 px para la búsqueda que es la ventana. Por defecto: `'md'`.
- `bare` (boolean) — Sin canto ni fondo, para cuando ya está dentro de una superficie que lo enmarca. Por defecto: `false`.
- `autocomplete` (string) — El `autocomplete` del `input` (por ejemplo, `off`). Por defecto: `undefined`.
- `spellcheck` (boolean) — La revisión ortográfica del motor. Por defecto: `undefined`.

### Emite
- `update:modelValue` (string) — El texto, en cada tecla.
- `search` (string) — «Buscar de verdad»: con Enter, o sola cuando pasa el rebote.
- `clear` — Cuando se vacía el campo con la cruz.
- `keydown` (KeyboardEvent) — Reenvía las teclas para que quien lo usa atienda las suyas (Escape, flechas, etc.).

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SearchField from '../search/SearchField.vue'

const query = ref('')
const searching = ref(false)

async function buscar(valor: string) {
  searching.value = true
  // llamada a la API con `valor`
  searching.value = false
}
</script>

<template>
  <SearchField
    v-model="query"
    label="Buscar"
    :busy="searching"
    :debounce="200"
    @search="buscar"
    @keydown.evescape="query = ''"
  />
</template>
```

### Notas
- Enter cancela el rebote pendiente y busca en el acto.
- Vaciar con la cruz emite `update:modelValue('')`, `clear` y `search('')`, en ese orden.
- Se expone el método `focus()` (y su alias obsoleto `enfocar()`) para devolver el foco sin tocar el DOM.
