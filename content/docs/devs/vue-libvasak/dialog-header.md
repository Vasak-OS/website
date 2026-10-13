---
title: "Dialog | DialogHeader"
weight: 85
description: "DialogHeader: contenedor del título y descripción con botón de cerrar opcional en estilo icono o etiqueta."
---

# `DialogHeader`

### Descripción
- Contenedor del encabezado del diálogo. Acomoda el título y la descripción, y puede dibujar un botón de cerrar en la esquina superior derecha.

### Props
- `closable` (boolean) — Dibuja el botón de cerrar. Por defecto: `false`.
- `closeLabel` (string) — Nombre del botón de cerrar. Pasarlo también lo dibuja.
- `closeStyle` (`'icon'|'label'`) — Estilo del botón de cerrar. Por defecto: `'icon'`.

### Uso
```vue
<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@vasakgroup/vue-libvasak'
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader closable close-style="label" close-label="Cerrar">
        <DialogTitle>Configuración de red</DialogTitle>
        <DialogDescription>Modifica los parámetros de conexión.</DialogDescription>
      </DialogHeader>
      <!-- contenido -->
    </DialogContent>
  </Dialog>
</template>
```

### Notas
- `closeLabel` implica `closable`: basta con pasar el texto para que el botón aparezca.
- El texto del botón sale de `closeLabel`, del catálogo (`dialog.close`) o del respaldo «Cerrar».
