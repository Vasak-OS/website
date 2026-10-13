---
title: "Dialog | DialogTitle"
weight: 84
description: "DialogTitle: encabezado h2 que nombra al diálogo y se registra en el contexto para aria-labelledby."
---

# `DialogTitle`

### Descripción
- Título del diálogo en `h2`. Se registra automáticamente en el contexto para que el `aria-labelledby` del contenido lo apunte.

### Props
- No acepta props: es un componente de texto estático.

### Uso
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Eliminar archivo</DialogTitle>
      </DialogHeader>
      <!-- contenido -->
    </DialogContent>
  </Dialog>
</template>
```

### Notas
- Al desmontarse, deja de nombrar el diálogo para que el siguiente no apunte a un `id` inexistente.
