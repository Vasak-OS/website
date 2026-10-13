---
title: "DropdownMenu | DropdownMenu"
weight: 117
description: "Contenedor raíz que provee el estado compartido (abierto/cerrado, foco, trigger) a todos los componentes del menú desplegable."
---

# `DropdownMenu`

### Descripción
- Componente raíz que provee el estado compartido del menú desplegable: apertura, cierre, gestión del foco y registro del disparador.
- No dibuja nada propio; envuelve el contenido y expone el contexto vía `provide`.

### Props
- `open` (boolean) — Controla el estado de apertura desde afuera con `v-model:open`. Por defecto: `undefined` (control interno).

### Emite
- `update:open` — Se emite con el nuevo valor booleano cuando el estado de apertura cambia.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'

const open = ref(false)
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <button>Abrir menú</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('elegido')">
        Opción
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notas
- Sin `v-model:open`, el menú se abre y cierra internamente.
- El foco se devuelve al elemento que tenía el foco al abrir, no siempre al disparador.
