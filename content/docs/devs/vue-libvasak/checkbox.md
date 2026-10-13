---
title: "Forms | Checkbox"
weight: 132
description: "Checkbox: casilla de verificación con estado indeterminado, descripción y navegación por teclado nativa."
---

# `Checkbox`

### Descripción
Casilla de verificación con estado indeterminado opcional, descripción asociada y navegación por teclado nativa (Espacio).

### Props
- `label` (string) — Texto visible de la casilla. **Requerido**.
- `model` (boolean) — Estado de la casilla (v-model). Por defecto: `false`.
- `description` (string) — Texto explicativo adicional.
- `disabled` (boolean) — Deshabilita la casilla. Por defecto: `false`.
- `indeterminate` (boolean) — Estado visual "a medias" (no altera el modelo). Por defecto: `false`.
- `hideLabel` (boolean) — Oculta la etiqueta visual pero la mantiene accesible. Por defecto: `false`.
- `id` (string) — ID personalizado del input.
- `name` (string) — Atributo name del input.
- `value` (string) — Valor del input cuando está marcada.

### Emite
- `change` (checked: boolean) — Se emite al cambiar el estado de la casilla.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '../forms/Checkbox.vue'

const recordar = ref(false)
</script>

<template>
  <Checkbox
    v-model="recordar"
    label="Recordar esta decisión"
    description="No volver a preguntar en esta sesión"
  />
</template>
```

### Notas
- `indeterminate` es un estado de dibujo: al hacer clic la casilla pasa a marcada y quien usa el componente decide cómo interpretarlo.
- El componente usa un `<input type="checkbox">` real con `appearance-none`, por lo que hereda navegación por teclado nativa.
- `description` se asocia mediante `aria-describedby`.
- La fila completa mide 32 px de alto mínimo como objetivo táctil, aunque la caja visual sea de 16 px.
- `hideLabel` es útil cuando la casilla está en una fila con otro texto visible que ya cumple la función de etiqueta.
