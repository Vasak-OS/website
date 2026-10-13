---
title: "Forms | OptionGroup"
weight: 128
description: "OptionGroup: selector de una opción entre varias, con navegación por teclado, variantes list y card y soporte para avatar."
---

# `OptionGroup`

### Descripción
Grupo de opciones mutuamente excluyentes con navegación por teclado (flechas y Tab), variante `list` o `card`, insignia opcional y soporte para avatar.

### Props
- `options` (OptionGroupOption<T>[]) — Opciones del grupo. **Requerido**.
- `label` (string) — Nombre accesible del grupo. **Requerido**.
- `model` (T | null) — Valor seleccionado (v-model). Por defecto: `null`.
- `variant` (`'list' | 'card'`) — Estilo visual. Por defecto: `'list'`.
- `size` (`'sm' | 'md'`) — Tamaño de las filas. Por defecto: `'md'`.
- `disabled` (boolean) — Deshabilita todo el grupo. Por defecto: `false`.

### Emite
- `change` (value: T) — Se emite al elegir una opción.

### Slots
- `option` (props: { option: OptionGroupOption<T>; checked: boolean }) — Personaliza el contenido de cada opción.
- `trailing` (props: { option: OptionGroupOption<T>; checked: boolean }) — Contenido al final de cada opción (antes del punto en variante `card`).

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import OptionGroup from '../forms/OptionGroup.vue'

const audioOutput = ref(null)

const options = [
  { value: 'speakers', label: 'Altavoces', description: 'Salida por defecto', badge: 'Predeterminado' },
  { value: 'headphones', label: 'Auriculares', description: 'Salida Bluetooth' },
  { value: 'hdmi', label: 'HDMI', description: 'Salida digital' },
]
</script>

<template>
  <OptionGroup
    v-model="audioOutput"
    label="Salida de audio"
    :options="options"
    variant="list"
  />
</template>
```

### Notas
- La navegación con teclado usa un patrón roving tabindex: Tab entra al grupo, las flechas cambian la selección.
- `options` es genérico (`T extends string | number`), permitiendo valores numéricos o strings.
- En `variant="card"`, el icono se muestra en un recuadro que cambia de estilo según la selección.
- El punto indicador se posiciona a la izquierda en `list` y a la derecha en `card`.
- `disabled` deshabilita todas las opciones; también se puede deshabilitar cada opción individualmente.
