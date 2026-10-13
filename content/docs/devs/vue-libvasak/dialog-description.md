---
title: "Dialog | DialogDescription"
weight: 87
description: "DialogDescription: párrafo que explica de qué va el diálogo, en color de texto secundario."
---

# `DialogDescription`

### Descripción
- Párrafo que explica de qué va el diálogo. Usa el token de texto secundario del sistema (`text-tx-muted`).

### Props
- No acepta props: es un componente de texto estático.

### Uso
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Eliminar carpeta</DialogTitle>
        <DialogDescription>Se eliminarán todos los archivos contenidos. Esta acción no se puede deshacer.</DialogDescription>
      </DialogHeader>
      <!-- contenido -->
    </DialogContent>
  </Dialog>
</template>
```
