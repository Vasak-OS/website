---
title: "Popover | Popover"
weight: 112
description: "Popover: raíz de un globo con contenido que controla el estado abierto y provee contexto a sus hijos."
---

# `Popover`

### Descripción
- Componente raíz de un globo con contenido: un formulario chico, un selector, unas opciones que cuelgan de un botón. No dibuja ningún elemento: renderiza directamente su ranura sin envolverla en contenedores adicionales.

### Props
- `open` (boolean) — Controla el estado abierto desde afuera mediante `v-model:open`. Sin esta propiedad, el globo se abre y cierra internamente. Por defecto: `undefined`.

### Emite
- `update:open` — Se emite cuando cambia el estado abierto, recibiendo el nuevo valor booleano.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Popover, PopoverTrigger, PopoverContent } from 'vue-libvasak'

const open = ref(false)
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button>Abrir opciones</button>
    </PopoverTrigger>
    <PopoverContent>
      <p>Aquí va el contenido del globo.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notas
- El estado abierto es reactivo y se comparte con los subcomponentes mediante `provide` e `inject`.
- Al cerrar con `returnFocus: true`, el foco vuelve al elemento que tenía el foco al abrir.
