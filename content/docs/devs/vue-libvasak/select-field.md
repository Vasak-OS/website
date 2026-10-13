---
title: "Formulario | SelectField"
weight: 74
description: "SelectField: desplegable con panel personalizado, opciones por propiedad o ranura, y modelo tipado."
---

# `SelectField`

### Descripción
- Desplegable estilizado que reemplaza el `<select>` nativo con un panel personalizado, soporta opciones como propiedad o `<option>` en la ranura, y maneja un modelo genérico (`string` o `number`) con `v-model`.

### Props
- `label` (string) — Etiqueta visible asociada al control.
- `id` (string) — Identificador del control. Sin esto se genera uno automáticamente.
- `disabled` (boolean) — Deshabilita el control.
- `options` (`Array<SelectOption<T> | (T & string)>`) — Lista de opciones como objetos `{ label, value, disabled? }` o cadenas. Cuando se pasa, ignora la ranura.

### Emite
- `change` (Event) — Se emite cuando el usuario elige una opción distinta a la actual.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SelectField from '../forms/SelectField.vue'

const selected = ref('medium')

const options = [
  { label: 'Pequeño', value: 'small' },
  { label: 'Medio', value: 'medium' },
  { label: 'Grande', value: 'large' },
]
</script>

<template>
  <SelectField
    v-model="selected"
    label="Tamaño"
    :options="options"
    @change="() => { /* recargar */ }"
  />
</template>
```

### Notas
- Si no se pasa `options`, se leen los `<option>` escritos en la ranura (sin atributo `value`, el valor es el texto).
- El modelo es genérico: `T extends string | number`, así que un `ref<number>` con `v-model.number` funciona sin castear.
- Con `label` declarado, el componente dibuja la etiqueta y la ata al control con `for`/`id`. Sin él, envolverlo en un `<label>` también vale.
