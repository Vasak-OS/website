---
title: "Indicador | Chip"
weight: 200
description: "Chip: pastilla pequeña con icono y dato, opcionalmente interactiva (botón) o solo informativa."
---

# `Chip`

### Descripción
Pastilla compacta de 32 px con un icono del tema y un dato, como «vía Firefox» o «Auriculares Bluetooth». Con `interactive` la raíz es un `<button>` que emite `click`; sin él es un `<span>` quieto, sin hover ni cursor. El texto se corta con puntos suspensivos y el entero queda en el globo del `title`.

### Props
- `label` (string) — El dato que muestra la pastilla. **Requerido**.
- `caption` (string) — Etiqueta atenuada que va antes del dato, como «vía». Por defecto: `''`.
- `icon` (string) — Nombre del icono en el tema del sistema. Por defecto: `''`.
- `iconType` (`'icon'|'symbol'`) — Tipo de icono. Por defecto: `'symbol'`.
- `interactive` (boolean) — La pastilla es un botón y emite `click`. Por defecto: `false`.
- `title` (string) — Texto para el globo. Por defecto: `undefined` (se usa la unión de `caption` y `label`).

### Emite
- `click` — El usuario tocó la pastilla, con `interactive` activo.

### Uso
```vue
<script setup lang="ts">
import Chip from '../indicators/Chip.vue'
</script>

<template>
  <Chip
    label="Auriculares WH-1000XM4"
    caption="vía"
    icon="audio-headphones"
    interactive
    @click="openSelector"
  />
</template>
```

### Notas
- La etiqueta va en versalitas chicas y atenuadas; el dato en medio peso, todo en una línea.
- El texto largo se trunca con puntos suspensivos y el entero queda disponible en el `title`.
