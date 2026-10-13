---
title: "DropdownMenu | DropdownMenuContent"
weight: 118
description: "Panel flotante del menú desplegable con posicionamiento automático, navegación por teclado y teleport al body."
---

# `DropdownMenuContent`

### Descripción
- Renderiza el cuerpo del menú desplegable con `role="menu"`, posicionamiento automático y navegación por teclado integrada.
- Se teletransporta al `body` para evitar recortes por `overflow` y se posiciona respecto al disparador.

### Props
- `side` (`'top' | 'bottom' | 'left' | 'right'`) — Lado preferido respecto al disparador. Por defecto: `'bottom'`.
- `align` (`'start' | 'center' | 'end'`) — Alineación del menú según el lado elegido. Por defecto: `'start'`.
- `sideOffset` (number) — Distancia en píxeles entre el disparador y el menú. Por defecto: `4`.

### Uso
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>Opciones</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align="start" :side-offset="8">
      <DropdownMenuItem @select="console.log('guardar')">
        Guardar
      </DropdownMenuItem>
      <DropdownMenuItem @select="console.log('eliminar')">
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notas
- Si el lado preferido no tiene espacio, el menú se invierte automáticamente.
- El teclado recorre los ítems con flechas, Inicio/Fin, Escape y Tab (cierra el menú).
- Cerrar con clic fuera devuelve el foco al disparador por defecto.
