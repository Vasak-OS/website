---
title: "Media | CoverArt"
weight: 148
description: "CoverArt: carátula de disco, radio o artista con respaldo de texto o icono cuando la imagen no está."
---

# `CoverArt`

### Descripción
Componente que muestra la carátula de un disco, una radio o un artista. Si la imagen no está disponible o falla al cargar, muestra un respaldo: un texto corto (iniciales, una letra) o un icono del tema. Siempre se dibuja cuadrada; una imagen apaisada se recorta con `object-cover` sin deformar la fila.

### Props
- `src` (string | null) — URL de la imagen. Por defecto: `null`.
- `alt` (string) — Texto alternativo para accesibilidad. Por defecto: `''`.
- `fallbackIcon` (string) — Nombre del icono del tema que se muestra cuando no hay imagen ni texto de respaldo. Por defecto: `'audio-x-generic'`.
- `fallbackText` (string) — Texto corto que se muestra en lugar del icono (iniciales, letra). Por defecto: `''`.
- `size` (`'sm'|'md'|'lg'|'xl'|'fill'`) — Tamaño de la carátula. `fill` ocupa el ancho disponible. Por defecto: `'fill'`.
- `shape` (`'square'|'round'`) — Forma del contenedor. `round` es el disco; `square` usa el radio del sistema. Por defecto: `'square'`.

### Emite
- `error` — Se emite cuando la imagen no se pudo cargar.

### Uso
```vue
<script setup lang="ts">
import CoverArt from '../media/CoverArt.vue'
</script>

<template>
  <CoverArt
    src="/media/cover.jpg"
    alt="Carátula del álbum"
    size="lg"
    shape="round"
    @error="() => { /* buscar otra imagen */ }"
  />
</template>
```

### Notas
- Al cambiar `src`, el componente reintenta la carga automáticamente.
- El texto de respaldo crece con el tamaño de la caja; en `fill` usa el tamaño intermedio.
