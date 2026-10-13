---
title: "Indicador | IconTile"
weight: 204
description: "IconTile: icono del tema en un recuadro con tonos, formas y estado opcional en la esquina."
---

# `IconTile`

### Descripción
Un icono del tema dentro de un recuadro con borde, usado para acompañar un paso, una cuenta o una opción. Ofrece seis tonos (`neutral`, `selected`, `accent`, `success`, `warning`, `error`), dos formas (`square`, `circle`) y un indicador de estado opcional en la esquina inferior derecha. El recuadro mide entre 32 y 80 px según el tamaño elegido.

### Props
- `name` (string) — Nombre del icono en el tema del sistema. **Requerido**.
- `type` (`'icon'|'symbol'`) — Tipo de icono. Por defecto: `'icon'`.
- `size` (`'sm'|'md'|'lg'|'xl'|'2xl'`) — Tamaño del recuadro: 32, 40, 48, 64 u 80 px. Por defecto: `'md'`.
- `tone` (`'neutral'|'selected'|'accent'|'success'|'warning'|'error'`) — Color del recuadro. Por defecto: `'neutral'`.
- `shape` (`'square'|'circle'`) — Forma del recuadro. Por defecto: `'square'`.
- `status` (`'success'|'warning'|'error'|null`) — Icono de estado en la esquina inferior derecha. Por defecto: `null`.
- `statusLabel` (string) — Texto anunciado por el lector de pantalla para el estado.
- `label` (string) — Nombre accesible del recuadro. Si está presente, el recuadro es una etiqueta; si no, es decoración.

### Uso
```vue
<script setup lang="ts">
import IconTile from '../indicators/IconTile.vue'
</script>

<template>
  <IconTile
    name="account-circle"
    tone="selected"
    size="lg"
    shape="circle"
    label="Cuenta de usuario"
  />
</template>
```

### Notas
- El icono siempre toma sus colores del tema; el tono aplica solo al recuadro.
- Con `status` y `statusLabel`, el indicador de estado se anuncia; sin él es decoración pura.
- El radio del recuadro deriva del radio del sistema, no de un valor fijo.
