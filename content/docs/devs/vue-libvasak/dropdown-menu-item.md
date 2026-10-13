---
title: "DropdownMenu | DropdownMenuItem"
weight: 119
description: "Opción interactiva del menú desplegable con soporte para selección, checkboxes, radio, atajos de teclado y peligro."
---

# `DropdownMenuItem`

### Descripción
- Representa una opción interactiva dentro del menú desplegable.
- Soporta ítems normales, checkboxes y radios, iconos, descripciones, atajos de teclado y variante de peligro.
- Al seleccionarse, cierra el menú y devuelve el foco.

### Props
- `disabled` (boolean) — Deshabilita el ítem. Por defecto: `false`.
- `checked` (`boolean | 'mixed' | null`) — Estado de marca del ítem. `null` es un ítem común. Por defecto: `null`.
- `toggle` (`'checkbox' | 'radio'`) — Tipo de marca cuando `checked` no es `null`. Por defecto: `'checkbox'`.
- `inset` (number) — Número de columnas de icono (28 px) que se corre el texto. Por defecto: `0`.
- `icon` (string) — Nombre del icono del tema a mostrar adelante del texto.
- `iconType` (`'icon' | 'symbol'`) — Tipo de renderizado del icono. Por defecto: `'symbol'`.
- `shortcut` (`readonly string[]`) — Teclas del atajo de teclado. Por defecto: `[]`.
- `danger` (boolean) — Aplica el estilo de peligro al ítem. Por defecto: `false`.

### Emite
- `select` — Se emite cuando el ítem es elegido (clic o teclado).
- `click` — Se emite con el evento nativo cuando el ítem es elegido.
- `update:checked` — Se emite con el nuevo valor booleano cuando se elige un ítem marcable.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'vue-libvasak'

const checked = ref(false)
const view = ref('list')
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button>Ver</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem v-model:checked="checked">
        Mostrar detalles
      </DropdownMenuItem>
      <DropdownMenuItem
        toggle="radio"
        :checked="view === 'list' ? true : null"
        @update:checked="view = 'list'"
      >
        Vista de lista
      </DropdownMenuItem>
      <DropdownMenuItem
        toggle="radio"
        :checked="view === 'grid' ? true : null"
        @update:checked="view = 'grid'"
      >
        Vista de cuadrícula
      </DropdownMenuItem>
      <DropdownMenuItem danger shortcut="⌘Q">
        Cerrar sesión
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

### Notas
- Un ítem deshabilitado sigue siendo accesible por teclado y aparece en el DOM con `aria-disabled`.
- `checked="mixed"` muestra una raya (casilla indeterminada) y solo funciona con `toggle="checkbox"`.
- `danger` aplica un velo de error al hover/active pero el texto no cambia a rojo por contraste.
