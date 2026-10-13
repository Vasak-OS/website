---
title: "Data | StatTile"
weight: 124
description: "StatTile: tarjeta con un número y su nombre, icono opcional, pista y ranura para personalizar el valor."
---

# `StatTile`

### Descripción
Tarjeta de datos que muestra un valor junto a su etiqueta, con icono opcional, texto de apoyo y ranura para personalizar la presentación del valor.

### Props
- `label` (string) — Nombre del dato. **Requerido**.
- `value` (string | number) — Valor a mostrar. **Requerido**.
- `hint` (string) — Texto de apoyo debajo del valor.
- `icon` (string) — Nombre de icono del tema, al lado de la etiqueta.
- `iconType` (`'icon' | 'symbol'`) — Tipo de icono. Por defecto: `'symbol'`.

### Slots
- `value` — Personaliza la presentación del valor.
- `default` — Contenido adicional dentro de la tarjeta.

### Uso
```vue
<script setup lang="ts">
import StatTile from '../data/StatTile.vue'
</script>

<template>
  <StatTile
    label="Memoria"
    :value="6.2"
    hint="de 16 GB en uso"
    icon="memory"
    iconType="icon"
  />
</template>
```

### Notas
- El valor se corta si es demasiado largo; el atributo `title` muestra el texto completo al pasar el cursor.
- En columnas angostas el icono se oculta automáticamente para evitar que el número se desborde.
- `icon` solo se muestra a partir de 8 rem de ancho del contenedor.
