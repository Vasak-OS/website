---
title: "Media | NowPlayingCard"
weight: 168
description: "NowPlayingCard: tarjeta de reproducción con disco giratorio, barra de progreso y controles de transporte."
---

# `NowPlayingCard`

### Descripción
- Tarjeta completa de «suena ahora» con disco giratorio, datos de la pista, barra de progreso y botones de transporte.
- No sabe nada de MPRIS ni de ningún reproductor: recibe lo que hay que dibujar y emite lo que se tocó.
- Los botones que no se pueden usar se ven apagados (disabled), no desaparecen.

### Props
- `title` (string) — Título de la pista. Por defecto: `''`.
- `artist` (string) — Artista. Por defecto: `''`.
- `album` (string) — Álbum. Por defecto: `''`.
- `coverSrc` (string | null) — URL de la carátula. Por defecto: `null`.
- `fallbackIcon` (string) — Icono del disco cuando no hay carátula. Por defecto: `'applications-multimedia'`.
- `state` (PlaybackState) — Estado de reproducción. Por defecto: `'stopped'`.
- `position` (number) — Posición actual. Por defecto: `0`.
- `duration` (number) — Duración total. Por defecto: `0`.
- `format` ((value: number) => string) — Formato de tiempo. Por defecto: `undefined`.
- `seekStep` (number) — Cuánto avanza la barra con el teclado. Por defecto: `undefined`.
- `canSeek` (boolean) — Si se puede mover la barra. Por defecto: `false`.
- `canGoPrevious` (boolean) — Si hay pista anterior. Por defecto: `false`.
- `canGoNext` (boolean) — Si hay pista siguiente. Por defecto: `false`.
- `canPlayPause` (boolean) — Si el reproductor acepta reproducir/pausar. Por defecto: `true`.
- `previousLabel` (string) — Etiqueta del botón anterior. Por defecto: `undefined`.
- `nextLabel` (string) — Etiqueta del botón siguiente. Por defecto: `undefined`.
- `playLabel` (string) — Etiqueta del botón reproducir. Por defecto: `undefined`.
- `pauseLabel` (string) — Etiqueta del botón pausar. Por defecto: `undefined`.
- `seekLabel` (string) — Etiqueta de la barra de progreso. Por defecto: `undefined`.
- `byArtistLabel` (string) — Plantilla «de {0}» para el artista. Por defecto: `undefined`.
- `nothingPlayingLabel` (string) — Título cuando no suena nada. Por defecto: `undefined`.

### Emite
- `previous` — Se emite al pulsar «anterior».
- `next` — Se emite al pulsar «siguiente».
- `toggle` — Se emite al pulsar «reproducir/pausar».
- `seek` (number) — Se emite al mover la barra, con la nueva posición.
- `coverError` — Se emite cuando la carátula no cargó.

### Slots
- `details` — Chips debajo del artista (salida de audio, aplicación de origen, etc.).
- `footer` — Contenido debajo del transporte, separado por una línea (ecualizador, etc.).

### Uso
```vue
<script setup lang="ts">
import NowPlayingCard from '../media/NowPlayingCard.vue'
</script>

<template>
  <NowPlayingCard
    title="Canción de ejemplo"
    artist="Artista"
    album="Álbum"
    :cover-src="null"
    state="playing"
    :position="30"
    :duration="180"
    :can-seek="true"
    :can-go-previous="true"
    :can-go-next="true"
    :can-play-pause="true"
  />
</template>
```

### Notas
- La tarjeta se adapta su disposición según el ancho disponible (desde 20 rem es dos columnas, por debajo es una).
- Los textos de los botones salen del catálogo de la aplicación si no se pasan como props.
