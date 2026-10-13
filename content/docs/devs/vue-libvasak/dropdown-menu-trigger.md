---
title: "DropdownMenu | DropdownMenuTrigger"
weight: 122
description: "Disparador del menú desplegable que gestiona la apertura por clic y teclado, con soporte as-child."
---

# `DropdownMenuTrigger`

### Descripción
- Componente que abre el menú desplegado mediante clic o interacción de teclado.
- Usa render function para clonar el hijo y aplicarle atributos ARIA directamente.
- Puede actuar como wrapper (`as-child` desactivado) o clonar el hijo sin envoltorio (`as-child` activado).

### Props
- `asChild` (boolean) — Clona el hijo sin envoltorio, aplicando atributos directamente. Por defecto: `false`.
- `disabled` (boolean) — Deshabilita el disparador. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'
</script>

<template>
  <!-- Con envoltorio (div) -->
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button>Abrir</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('ok')">
        Aceptar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Sin envoltorio: atributos en el botón -->
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button class="custom-class">Abrir</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="console.log('ok')">
        Aceptar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notas
- Enter, espacio, flecha abajo y flecha arriba abren el menú. Escape lo cierra.
- Con `as-child`, los atributos ARIA se aplican directamente al botón, no a un envoltorio.
- `preventDefault` en teclado evita el clic sintético duplicado del navegador.
