---
title: "Media | WallpaperThumbnail"
weight: 180
description: "Miniatura de fondo de pantalla con soporte para video y marcas de estado."
---

# `WallpaperThumbnail`

### Descripción
- Miniatura de fondo de pantalla: imagen estática o video en reproducción, con marcas de video y seleccionado.

### Props
- `src` (string | null) — Ruta de la miniatura estática. Por defecto: `null`.
- `alt` (string) — Texto alternativo descriptivo. Por defecto: `''`.
- `video` (boolean) — Indica si es un fondo de video. Por defecto: `false`.
- `videoSrc` (string | null) — Fuente del video cuando `playing` es `true`. Por defecto: `null`.
- `playing` (boolean) — Reproduce el video ahora. Por defecto: `false`.
- `selected` (boolean) — Marca como el fondo aplicado actualmente. Por defecto: `false`.
- `dimmed` (boolean) — Atenúa la imagen. Por defecto: `false`.
- `fill` (boolean) — Ocupa toda la caja contenedora en lugar de 16:9. Por defecto: `false`.
- `videoLabel` (string) — Nombre accesible de la marca de video.
- `selectedLabel` (string) — Nombre accesible de la marca de seleccionado.

### Emite
- `error` — Se emite cuando la miniatura no se pudo cargar.

### Uso
```vue
<script setup lang="ts">
import WallpaperThumbnail from '../media/WallpaperThumbnail.vue'
</script>

<template>
  <WallpaperThumbnail
    src="/thumb.jpg"
    alt="Fondo de montaña"
    :video="true"
    :playing="true"
    video-src="blob:https://example.com/abc"
    :selected="true"
  />
</template>
```

### Notas
- El video se elimina del DOM cuando `playing` es `false`, no se pausa, para liberar el decodificador.
- La imagen estática es siempre una copia pequeña, nunca el original en alta resolución.
