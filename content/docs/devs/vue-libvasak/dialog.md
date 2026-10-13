---
title: "Dialog | Dialog"
weight: 82
description: "Dialog: raíz del diálogo que controla el estado abierto/cerrado mediante v-model:open y provee contexto a los subcomponentes."
---

# `Dialog`

### Descripción
- Componente raíz del diálogo. No dibuja nada: controla el estado abierto/cerrado mediante `v-model:open` y provee el contexto que usan los subcomponentes.

### Props
- `open` (boolean) — Indica si el diálogo está abierto. Por defecto: `false`.

### Emite
- `update:open` — Se emite con `false` cuando el diálogo se cierra.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ActionButton } from '@vasakgroup/vue-libvasak'

const open = ref(false)
</script>

<template>
  <ActionButton label="Abrir" @click="open = true" />

  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmar acción</DialogTitle>
      </DialogHeader>
      <p>¿Estás seguro de que deseas continuar?</p>
      <DialogFooter>
        <ActionButton label="Cancelar" variant="secondary" @click="open = false" />
        <ActionButton label="Confirmar" @click="open = false" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### Notas
- El estado se controla desde quien lo usa con `v-model:open`; el componente no mantiene estado interno de apertura.
