---
title: "Tooltip | TooltipContent"
weight: 79
description: "TooltipContent: el globo que se teletransporta al body y se posiciona respecto al disparador."
---

# `TooltipContent`

### Descripción
- El globo visible del tooltip. Se teletransporta al `body` con `Teleport` para que no se recorte dentro de contenedores con `overflow: hidden`.
- Se posiciona de forma `fixed` contra las coordenadas del disparador y nunca se sale de la ventana.
- Se anima al entrar y salir con una transición de opacidad y desplazamiento corto.

### Props
- `side` (`'top' | 'bottom' | 'left' | 'right'`) — Lado del disparador donde aparece el globo. Por defecto: `'bottom'`.
- `align` (`'start' | 'center' | 'end'`) — Alineación del globo respecto al lado elegido. Por defecto: `'center'`.
- `sideOffset` (number) — Distancia en píxeles entre el disparador y el globo. Por defecto: `4`.

### Uso
```vue
<script setup lang="ts">
import Tooltip from '../tooltip/Tooltip.vue'
import TooltipTrigger from '../tooltip/TooltipTrigger.vue'
import TooltipContent from '../tooltip/TooltipContent.vue'
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <button>Guardar</button>
    </TooltipTrigger>
    <TooltipContent side="top" align="start" :side-offset="8">
      Guarda los cambios del documento
    </TooltipContent>
  </Tooltip>
</template>
```

### Notas
- Las clases que se pasan al componente se leen de `attrs` (con `inheritAttrs: false`) y se aplican al globo, ya que el nodo raíz es un `Teleport` y no un elemento.
- El ancho máximo del globo es el de la ventana menos 16 px; el texto largo se parte.
