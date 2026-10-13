---
title: "Forms | PasswordField"
weight: 174
description: "Campo de contraseña con botón de mostrar, aviso de Bloq Mayús y soporte para v-model."
---

# `PasswordField`

### Descripción
- Campo de contraseña con botón para mostrar y ocultar, aviso de Bloq Mayús integrado y soporte para `v-model`.

### Props
- `modelValue` (string) — Valor del campo. **Requerido**.
- `id` (string) — El `id` del campo para asociar una etiqueta. Sin esto se genera uno automáticamente.
- `ariaLabel` (string) — Etiqueta accesible del campo.
- `describedBy` (string) — ID de un elemento que describe el campo.
- `placeholder` (string) — Texto de marcador de posición.
- `autocomplete` (`'current-password' | 'new-password' | 'off'`) — Sugerencia de autocompletado. Por defecto: `'current-password'`.
- `disabled` (boolean) — Deshabilita el campo. Por defecto: `false`.
- `invalid` (boolean) — Marca el campo como inválido visualmente. Por defecto: `false`.
- `required` (boolean) — Marca el campo como requerido. Por defecto: `false`.
- `size` (`'md' | 'lg'`) — Tamaño del campo. Por defecto: `'md'`.
- `revealable` (boolean) — Muestra el botón de mostrar contraseña. Por defecto: `true`.
- `capsLockHint` (boolean) — Muestra el aviso de Bloq Mayús. Por defecto: `true`.
- `showLabel` (string) — Texto para el botón de mostrar.
- `hideLabel` (string) — Texto para el botón de ocultar.
- `capsLockLabel` (string) — Texto del aviso de Bloq Mayús.

### Emite
- `update:modelValue` — Se emite al escribir en el campo.
- `keydown` — Se emite en cada tecla presionada.
- `keyup` — Se emite en cada tecla liberada.
- `caps-lock` — Se emite cuando cambia el estado de Bloq Mayús.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField from '../forms/PasswordField.vue'
const password = ref('')
</script>

<template>
  <PasswordField
    v-model="password"
    placeholder="Contraseña"
    :caps-lock-hint="true"
  />
</template>
```

### Notas
- El botón de mostrar no roba el foco al campo, permitiendo seguir escribiendo mientras se revela la contraseña.
- Cuando el campo se vacía, la contraseña vuelve a ocultarse automáticamente.
