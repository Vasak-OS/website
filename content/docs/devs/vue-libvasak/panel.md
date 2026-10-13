---
title: "Contenedor | Panel"
weight: 64
description: "Panel: superficie de columna con borde, radio, padding opcional y scroll interno."
---

# `Panel`

### Descripción
- La superficie de una columna: la lista de cuentas del calendario, la ficha de un contacto, la lista de carpetas del correo.
- No es `ListCard`: ésa es una fila (`flex justify-between p-3`).

### Props
- `as` (`'div'|'section'|'aside'|'article'|'nav'`) — Elemento HTML que se renderiza. Por defecto: `'div'`.
- `padding` (`'none'|'sm'|'md'`) — Espaciado interno. Por defecto: `'md'`.
- `scroll` (boolean) — Desplaza adentro: el panel se queda del alto que le dé quien lo pone y el contenido pasa por debajo del canto. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import Panel from '../layout/Panel.vue'
</script>

<template>
  <Panel as="aside" padding="md" scroll>
    <!-- contenido de la columna -->
  </Panel>
</template>
```

### Notas
- Con `scroll`, el panel usa `min-h-0 overflow-y-auto` para que el contenido se desplace dentro de sus límites.
