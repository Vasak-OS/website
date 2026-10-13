---
title: "Icono | ThemeIcon"
weight: 62
description: "ThemeIcon: icono del tema del escritorio por nombre, con respaldos, teñido y tamaño auto."
---

# `ThemeIcon`

### Descripción
- Icono del tema del escritorio, que sigue al tema en caliente. Se pide por nombre y nunca por ruta: el tema cambia y sus rutas no son estables.
- `type` elige la variante: `icon` la común, en color; `symbol` la monocroma, que no todos los nombres tienen.

### Props
- `name` (string) — Nombre del icono en el tema. **Requerido**.
- `type` (`'icon'|'symbol'`) — Variante del icono. Por defecto: `'icon'`.
- `size` (number | `'auto'`) — Tamaño en píxeles, o `'auto'` para que lo defina quien lo usa. Por defecto: `18`.
- `alt` (string) — Texto alternativo. Vacío cuando el icono acompaña a un texto que ya dice lo mismo.
- `fallbacks` (readonly string[]) — Otros nombres del tema, en orden, para cuando no tiene `name`. Por defecto: `[]`.
- `fallbackSrc` (string) — El dibujo de otra aplicación, si ningún nombre resolvió. Por defecto: `''`.
- `tint` (boolean) — Teñirlo con el color del texto (`currentColor`). Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import ThemeIcon from '../icons/ThemeIcon.vue'
</script>

<template>
  <ThemeIcon name="dialog-information" :size="20" alt="Información" />
</template>
```

### Notas
- Con `size="auto"` el componente no escribe estilo en línea: el alto y el ancho salen de las clases o del estilo que le ponga quien lo usa.
- Mientras resuelve, un hueco del mismo tamaño, para que la fila no salte.
- `tint` dibuja el icono como `span` con `role="img"` y el `alt` de nombre, para que un lector de pantalla lo siga leyendo igual que la imagen.
