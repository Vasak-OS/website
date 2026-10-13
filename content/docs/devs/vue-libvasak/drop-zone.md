---
title: "Feedback | DropZone"
weight: 152
description: "DropZone: zona para soltar archivos arrastrados, con variantes inline y overlay, y estado bloqueado."
---

# `DropZone`

### Descripción
Componente visual que marca dónde soltar lo que se arrastra: archivos sobre la biblioteca de música, un paquete sobre la tienda, una carpeta sobre el gestor de archivos. Es solo el dibujo: quién escucha `dragenter`/`drop` y qué hace con lo soltado sigue siendo de la aplicación. Recibe `active` mientras haya algo encima. En modo `inline` muestra un recuadro de canto punteado con icono y texto; en modo `overlay` tapa el contenedor solo mientras `active`, con un velo y una tarjeta flotante. `locked` indica que no se puede soltar (carpeta de solo lectura, instalación en curso).

### Props
- `active` (boolean) — Indica si hay algo arrastrado encima. Por defecto: `false`.
- `label` (string) — Texto de la zona. Si no se pasa, usa el catálogo o el respaldo en inglés. Por defecto: `undefined`.
- `locked` (boolean) — Indica que no se puede soltar. Cambia el icono, el texto y el color del canto. Por defecto: `false`.
- `lockedLabel` (string) — Texto para el estado bloqueado. Por defecto: `undefined`.
- `overlay` (boolean) — Usa la variante overlay (tapa el contenedor) en lugar de inline. Por defecto: `false`.
- `icon` (string) — Nombre del icono del tema. Por defecto: `'document-import'`.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import DropZone from '../feedback/DropZone.vue'
const active = ref(false)
</script>

<template>
  <DropZone
    :active="active"
    label="Solte los archivos aquí"
    @dragenter="active = true"
    @dragleave="active = false"
    @drop="active = false"
  />
</template>
```

### Notas
- En modo `overlay`, el contenedor padre debe ser `relative`.
- El slot por defecto (en la variante inline) va debajo del texto, para un botón «Elegir archivos».
- Los textos salen de la propiedad, del catálogo (`dropZone.label`, `dropZone.locked`) o del respaldo en inglés.
