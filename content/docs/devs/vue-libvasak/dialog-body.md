---
title: "Dialog | DialogBody"
weight: 88
description: "DialogBody: cuerpo del diálogo con desplazamiento propio, entre encabezado y pie fijos, y navegación por teclado."
---

# `DialogBody`

### Descripción
- Cuerpo del diálogo que desplaza solo, entre un encabezado y un pie que se quedan quietos. Con contenido que no entra, pasa a ser tabulable con nombre de región para que las flechas lo muevan.

### Props
- `padding` (`'none'|'sm'|'md'`) — Relleno vertical del cuerpo. Por defecto: `'md'`.
- `label` (string) — Nombre de la región cuando desplaza. Sin esto, del catálogo (`dialog.body`) o «Contenido».

### Uso
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, ActionButton } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Ver licencia</DialogTitle>
      </DialogHeader>
      <DialogBody padding="sm" label="Texto de licencia">
        <p>Contenido extenso de la licencia...</p>
      </DialogBody>
      <DialogFooter>
        <ActionButton label="Cerrar" @click="open = false" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### Notas
- Con un `DialogBody` adentro, `DialogContent` pasa a columna y deja de desplazar él; el que desplaza es el cuerpo.
- La región solo existe cuando el contenido no entra: si todo cabe, no hay tabindex ni rol.
