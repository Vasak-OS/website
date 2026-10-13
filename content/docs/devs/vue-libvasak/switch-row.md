---
title: "Formularios | SwitchRow"
weight: 134
description: "SwitchRow: fila de opción con interruptor integrado, icono opcional, descripción y ranura para contenido adicional."
---

# `SwitchRow`

### Descripción
- Fila de opción con interruptor integrado, donde toda la fila es el botón. Incluye icono opcional, descripción y ranura al pie.

### Props
- `modelValue` (boolean) — Estado del interruptor (v-model). **Requerido**.
- `label` (string) — Nombre de la opción (texto visible). **Requerido**.
- `description` (string) — Línea de descripción bajo el nombre.
- `icon` (string) — Nombre del icono del tema.
- `iconType` (`'icon' | 'symbol'`) — Tipo de icono. Por defecto: `'icon'`.
- `disabled` (boolean) — Deshabilita la fila. Por defecto: `false`.

### Emite
- `update:modelValue` (value: boolean) — Se emite cuando se hace clic en la fila.

### Slots
- `pie` — Contenido adicional bajo la descripción, alineado con la columna de texto.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SwitchRow from '../forms/SwitchRow.vue'

const wifi = ref(true)
</script>

<template>
  <SwitchRow
    v-model="wifi"
    label="Wi-Fi"
    description="Conectar automáticamente"
    icon="wifi"
  />
</template>
```

### Notas
- Toda la fila es un `<button role="switch">`, así que el área de clic es grande y se maneja con teclado (Espacio) sin `tabindex` manual.
- El texto visible es el nombre accesible del botón; no hace falta `aria-label`.
- `icon` se muestra en un cuadro con borde que cambia de estilo cuando el interruptor está activo.
- La ranura `pie` se alinea con la columna de texto, no con el borde izquierdo del contenedor.
