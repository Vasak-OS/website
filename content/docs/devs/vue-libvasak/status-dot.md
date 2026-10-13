---
title: "Indicators | StatusDot"
weight: 130
description: "StatusDot: punto de estado con tonos predefinidos, color personalizado, pulso y contorno para accesibilidad."
---

# `StatusDot`

### Descripción
Indicador visual de estado con tonos semánticos, color personalizado (dato externo), animación de pulso y contorno para accesibilidad.

### Props
- `tone` (`'neutral' | 'accent' | 'success' | 'warning' | 'error'`) — Tono semántico. Por defecto: `'neutral'`.
- `color` (string) — Color personalizado en hexadecimal, RGB o nombre CSS. Sobrescribe `tone`.
- `pulse` (boolean) — Activa animación de pulso. Por defecto: `false`.
- `label` (string) — Nombre accesible. Si no se proporciona, el punto es decorativo.
- `size` (`'sm' | 'md'`) — Tamaño del punto. Por defecto: `'sm'`.
- `outlined` (boolean) — Dibuja contorno para garantizar contraste 3:1. Por defecto: `true`.

### Uso
```vue
<script setup lang="ts">
import StatusDot from '../indicators/StatusDot.vue'
</script>

<template>
  <div class="flex items-center gap-2">
    <StatusDot tone="success" label="Conectado" />
    <span>Conectado</span>
  </div>
  
  <div class="flex items-center gap-2">
    <StatusDot color="#ff5722" pulse />
    <span>Grabando</span>
  </div>
</template>
```

### Notas
- `color` acepta cualquier valor CSS válido: hexadecimal, rgb(), var().
- `tone` y `color` son mutuamente excluyentes: `color` tiene prioridad.
- El contorno `outlined` usa el color `ui-border-strong`, que garantiza 3:1 de contraste con el fondo.
- Sin `label`, el componente se oculta de lectores de pantalla (`aria-hidden="true"`).
- El pulso se desactiva respeta `prefers-reduced-motion` automáticamente.
