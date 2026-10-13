---
title: "Indicador | Badge"
weight: 76
description: "Badge: insignia para contadores, estados u orígenes, con variantes de color y modo contador."
---

# `Badge`

### Descripción
- Insignia compacta para mostrar contadores, estados u orígenes. El texto va en `tx-main` sobre relleno translúcido, y se puede usar como contador sobre un icono o como etiqueta con texto.

### Props
- `tone` (`'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'error'`) — Tono de color de la insignia. Por defecto: `'neutral'`.
- `variant` (`'soft' | 'outline' | 'solid' | 'overlay'`) — Estilo visual. Por defecto: `'soft'`.
- `size` (`'sm' | 'md'`) — Tamaño de la insignia. Por defecto: `'sm'`.
- `dot` (boolean) — Muestra un punto del color del tono antes del texto. Por defecto: `false`.
- `color` (string) — Color de dato que tiñe el punto y el canto.
- `label` (string | number) — Texto de la insignia si no se usa la ranura.
- `counter` (boolean) — Modo contador: texto sin partir, al menos tan ancho como alto. Por defecto: `false`.
- `max` (number) — Con un `label` numérico mayor, se escribe «max+». Por defecto: `undefined`.
- `title` (string) — Texto entero para el globo del sistema. Por defecto: `undefined`.

### Uso
```vue
<script setup lang="ts">
import Badge from '../indicators/Badge.vue'
</script>

<template>
  <Badge label="Nuevo" tone="info" />
  <Badge :label="120" :max="99" counter tone="accent" title="120 notificaciones" />
  <Badge tone="warning" variant="outline">
    <template #default>beta</template>
  </Badge>
</template>
```

### Notas
- El modo `counter` evita que el texto se parta y funciona como superposición sobre un icono.
- `color` se aplica como variable CSS (`--badge-color`) y tiñe el punto y el canto, nunca el texto.
- Con `variant="solid"` y `tone="accent"` o `"info"`, el texto usa `tx-on-primary` sobre el relleno pleno del primario.
