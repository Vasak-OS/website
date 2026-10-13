---
title: "Tooltip | TooltipTrigger"
weight: 80
description: "TooltipTrigger: el envoltorio que abre el tooltip al sobrevolar o enfocar el elemento hijo."
---

# `TooltipTrigger`

### Descripción
- El envoltorio interactivo que abre el tooltip cuando se sobrevola con el puntero o se recibe el foco.
- Registra el elemento hijo como el disparador real, de modo que el globo se posiciona respecto a ese hijo y no al envoltorio.

### Props
- No acepta props: toda la configuración viene del `Tooltip` padre vía inyección de contexto.

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
    <TooltipContent>
      Guarda los cambios del documento
    </TooltipContent>
  </Tooltip>
</template>
```

### Notas
- No acepta props: toda la configuración viene del `Tooltip` padre vía inyección de contexto.
- Se abre también con el foco del teclado (`focusin`/`focusout`), no solo con el puntero.
