---
title: "Layout | WindowFrame"
weight: 50
---

# `WindowFrame`

Descripción
- Componente wrapper que incluye la `TopBar` (barra superior) y renderiza su contenido vía slot. Se usa como contenedor principal de vistas.

Props
- `title` (string) — Título mostrado en la `TopBar`. Por defecto: `'Vasak'`.
- `image` (string) — Imagen/ícono para la `TopBar`. Por defecto: `''`.

Slots
- Default — Contenido de la ventana.

Uso
```vue
<script setup lang="ts">
import WindowFrame from '../window/WindowFrame.vue'
</script>

<template>
  <WindowFrame title="Mi App" image="/icons/app.svg">
    <div class="p-4">Contenido de la aplicación</div>
  </WindowFrame>
</template>
```
