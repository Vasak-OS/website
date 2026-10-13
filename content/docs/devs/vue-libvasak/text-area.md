---
title: "Forms | TextArea"
weight: 172
description: "TextArea: campo de texto de varias líneas con estilo VasakOS, redimensionable y enfocable por programa."
---

# `TextArea`

### Descripción
- Campo de entrada de texto de varias líneas con el estilo de la librería (mismo aspecto que `TextInput`).
- Soporta redimensionamiento, validación visual, modo monoespaciado y actualización perezosa (al salir del campo).
- No trae etiqueta propia: se ata con `FormGroup` mediante `id`.

### Props
- `modelValue` (string) — Valor del campo. **Requerido**.
- `rows` (number) — Líneas visibles antes de desplazar. Por defecto: `4`.
- `id` (string) — Identificador del campo, para asociar con `FormGroup`. Por defecto: `undefined`.
- `ariaLabel` (string) — Nombre del campo cuando no hay etiqueta visible. Por defecto: `undefined`.
- `describedBy` (string) — `id` del texto que explica el error o la ayuda. Por defecto: `undefined`.
- `placeholder` (string) — Texto de marcador de posición. Por defecto: `undefined`.
- `disabled` (boolean) — Deshabilita el campo. Por defecto: `false`.
- `readonly` (boolean) — Hace el campo de solo lectura. Por defecto: `false`.
- `invalid` (boolean) — Muestra el borde de peligro para un valor inválido. Por defecto: `false`.
- `mono` (boolean) — Usa fuente monoespaciada (para recetas, registros, etc.). Por defecto: `false`.
- `required` (boolean) — Marca el campo como requerido. Por defecto: `false`.
- `maxlength` (number) — Longitud máxima en caracteres. Por defecto: `undefined`.
- `resize` (`'none' | 'vertical' | 'both'`) — Dirección de redimensionamiento. Por defecto: `'vertical'`.
- `lazy` (boolean) — Actualiza el valor al salir del campo en lugar de en cada tecla. Por defecto: `false`.
- `spellcheck` (boolean) — Habilita la ortografía. Por defecto: `true`.

### Emite
- `update:modelValue` (string) — Se emite cuando cambia el valor.
- `keydown` (KeyboardEvent) — Se envía en cada tecla pulsada.
- `keyup` (KeyboardEvent) — Se envía en cada tecla soltada.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import TextArea from '../forms/TextArea.vue'

const text = ref('')
</script>

<template>
  <TextArea
    v-model="text"
    :rows="4"
    placeholder="Escribe aquí…"
    :resize="'vertical'"
  />
</template>
```

### Nota
- El componente expone un método `focus()` que enfoca el campo y devuelve `true` si lo consiguió.
