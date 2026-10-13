---
title: "Popover | PopoverTrigger"
weight: 114
description: "PopoverTrigger: el disparador que abre el globo al hacer clic, con atributos ARIA y modo as-child."
---

# `PopoverTrigger`

### Descripción
- Componente que representa el elemento que abre el globo. Registra el elemento como disparador en el contexto del `Popover` y alterna el estado abierto al hacer clic. Con `as-child` no envuelve en ningún elemento y aplica los atributos directamente al hijo.

### Props
- `asChild` (boolean) — Si es `true`, no envuelve en un `div` y aplica los atributos al único hijo. Por defecto: `false`.
- `disabled` (boolean) — Deshabilita la interacción: no abre el globo al hacer clic. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from 'vue-libvasak'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button>Abrir globo</button>
    </PopoverTrigger>
    <PopoverContent>
      <p>Contenido del globo.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notas
- `aria-haspopup` es `dialog` —lo que se abre no es un menú—.
- `aria-expanded` refleja el estado abierto.
- Con `as-child` se clona el hijo con los atributos y el manejador de clic.
