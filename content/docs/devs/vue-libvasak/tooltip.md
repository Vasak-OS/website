---
title: "Tooltip | Tooltip"
weight: 78
description: "Tooltip: contenedor raíz que controla el estado abierto, el retardo de apertura y provee contexto a sus hijos."
---

# `Tooltip`

### Descripción
- Contenedor raíz de la familia Tooltip. Es el que sabe si el tooltip está abierto, quién lo disparó y cuándo debe mostrarse.
- Coordina el retardo de apertura (para evitar parpadeos al mover el puntero) y provee el estado a `TooltipTrigger` y `TooltipContent` mediante inyección de contexto.

### Props
- `disabled` (boolean) — Deshabilita el tooltip: no se abre aunque se sobrevole o enfoque el disparador. Por defecto: `false`.
- `delayDuration` (number) — Milisegundos que espera antes de abrir. Al cerrar no hay retardo. Por defecto: `200`.

### Uso
```vue
<script setup lang="ts">
import Tooltip from '../tooltip/Tooltip.vue'
import TooltipTrigger from '../tooltip/TooltipTrigger.vue'
import TooltipContent from '../tooltip/TooltipContent.vue'
</script>

<template>
  <Tooltip :delay-duration="300">
    <TooltipTrigger>
      <button>Guardar</button>
    </TooltipTrigger>
    <TooltipContent>
      Guarda los cambios del documento
    </TooltipContent>
  </Tooltip>
</template>
```

### Notas
- El slot raíz puede contener un solo `TooltipTrigger` y un solo `TooltipContent`.
- El retardo vive en el contenedor, no en el contenido: es al abrir cuando importa.
