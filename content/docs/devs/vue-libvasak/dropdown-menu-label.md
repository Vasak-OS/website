---
title: "DropdownMenu | DropdownMenuLabel"
weight: 120
description: "Título de sección dentro del menú desplegable que aporta el nombre accesible del menú vía aria-labelledby."
---

# `DropdownMenuLabel`

### Descripción
- Título de sección para agrupar ítems dentro del menú desplegable.
- No es una opción interactiva: usa `role="presentation"` y cede su `id` al menú para `aria-labelledby`.

### Props
- No acepta props: es un componente de texto estático.

### Uso
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from 'vue-libvasak'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>Archivo</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Edición</DropdownMenuLabel>
      <DropdownMenuItem @select="console.log('copiar')">
        Copiar
      </DropdownMenuItem>
      <DropdownMenuItem @select="console.log('pegar')">
        Pegar
      </DropdownMenuItem>
      <DropdownMenuLabel>Exportar</DropdownMenuLabel>
      <DropdownMenuItem @select="console.log('pdf')">
        Exportar como PDF
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notas
- El texto del label se anuncia como el nombre del menú al abrirlo.
- Al desmontarse, limpia la referencia `aria-labelledby` del menú.
