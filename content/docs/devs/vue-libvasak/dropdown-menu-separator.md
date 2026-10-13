---
title: "DropdownMenu | DropdownMenuSeparator"
weight: 121
description: "Línea horizontal que separa grupos de ítems dentro del menú desplegable, con role separator."
---

# `DropdownMenuSeparator`

### Descripción
- Línea horizontal que separa grupos de ítems dentro del menú desplegable.
- Usa `role="separator"` para que el lector de pantalla distinga las listas de opciones a ambos lados.

### Props
- No acepta props: es un elemento puramente decorativo y semántico.

### Uso
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from 'vue-libvasak'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>Más acciones</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('renombrar')">
        Renombrar
      </DropdownMenuItem>
      <DropdownMenuItem @select="console.log('duplicar')">
        Duplicar
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem danger @select="console.log('eliminar')">
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notas
- Sin props ni slots; es un elemento puramente decorativo y semántico.
