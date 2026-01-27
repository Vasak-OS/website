---
title: "Barra lateral | SideButton"
weight: 55
---

# `SideButton`

Descripción
- Botón pequeño para el `SideBar`. Muestra una imagen y puede usarse como enlace o disparador de acciones.

Props
- `title` (string) — Texto descriptivo alternativo. Por defecto: `'Link'`.
- `image` (string) — Ruta del icono/imágen. Por defecto: `''`.

Emite
- No emite eventos por defecto (es un `<a href="#">`). Puedes convertirlo en botón o manejar su click con `@click.prevent` en el padre.

Uso
```vue
<script setup lang="ts">
import SideButton from '../sidebar/SideButton.vue'
</script>

<template>
  <SideButton image="/icons/home.svg" title="Inicio" />
</template>
```

Notas
- Si deseas comportamiento SPA, reemplaza el `a` por `router-link` o captura el evento en el padre.

