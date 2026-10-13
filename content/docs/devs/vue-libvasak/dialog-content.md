---
title: "Dialog | DialogContent"
weight: 83
description: "DialogContent: velo y panel del diálogo, teletransportados al body, con gestión de foco, Escape y Tab."
---

# `DialogContent`

### Descripción
- Dibuja el velo y el panel del diálogo, teletransportados al `body`. Gestiona el foco (entrada, trampa de Tab, restauración al cerrar), el cierre con Escape y el clic en el velo.

### Props
- `size` (`'sm'|'md'|'wide'|'lg'|'full'`) — Forma del panel. Por defecto: `'md'`.
- `ariaLabel` (string) — Nombre accesible del diálogo cuando no hay un `DialogTitle` visible.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@vasakgroup/vue-libvasak'

const open = ref(false)
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent size="lg" aria-label="Formulario de contacto">
      <DialogHeader>
        <DialogTitle>Nuevo contacto</DialogTitle>
      </DialogHeader>
      <!-- contenido del formulario -->
    </DialogContent>
  </Dialog>
</template>
```

### Notas
- El panel se teletransporta al `body` para evitar recortes por `overflow` en contenedores padres.
- El foco entra al panel al abrir, el Tab queda atrapado dentro y se restaura al elemento previo al cerrar.
- Con `size="full"` el panel ocupa toda la ventana y no dibuja velo.
