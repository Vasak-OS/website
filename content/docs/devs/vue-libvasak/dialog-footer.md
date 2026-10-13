---
title: "Dialog | DialogFooter"
weight: 86
description: "DialogFooter: pie del diálogo que apila los botones al revés en diálogos angostos."
---

# `DialogFooter`

### Descripción
- Pie del diálogo, donde van los botones de acción. En diálogos angostos los apila al revés para que la acción principal quede arriba.

### Props
- No acepta props: es un contenedor estático.

### Uso
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogFooter, ActionButton } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <!-- contenido -->
      <DialogFooter>
        <ActionButton label="Cancelar" variant="secondary" @click="open = false" />
        <ActionButton label="Guardar" @click="guardar" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### Notas
- Se acomoda por el ancho del diálogo (contenedor `@container`), no por el de la pantalla.
