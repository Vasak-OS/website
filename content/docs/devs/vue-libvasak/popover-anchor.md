---
title: "Popover | PopoverAnchor"
weight: 115
description: "PopoverAnchor: define el elemento contra el que se ubica el globo, útil cuando el ancla no es el disparador."
---

# `PopoverAnchor`

### Descripción
- Componente que define el elemento contra el que se ubica el globo. Es útil cuando el ancla no es el disparador: por ejemplo, cuando el globo se abre desde un menú contextual pero debe colgar de otro elemento. Sin ancla, el globo se ubica contra el disparador.

### Props
- `asChild` (boolean) — Si es `true`, no envuelve en un `div` y aplica los atributos al único hijo. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from 'vue-libvasak'
</script>

<template>
  <Popover>
    <PopoverAnchor as-child>
      <div ref="fila">Fila de la tabla</div>
    </PopoverAnchor>
    <PopoverTrigger as-child>
      <button>Abrir opciones</button>
    </PopoverTrigger>
    <PopoverContent>
      <p>Opciones de la fila.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notas
- Al desmontarse, el ancla se limpia automáticamente del contexto.
- El ancla prevalece sobre el disparador al calcular la posición del globo.
