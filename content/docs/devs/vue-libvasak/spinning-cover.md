---
title: "Media | SpinningCover"
weight: 214
description: "Carátula de disco que gira mientras suena, con aro de progreso y modo interactivo opcional."
---

# `SpinningCover`

### Descripción
- Carátula de álbum con forma de vinilo que gira durante la reproducción. Incluye un agujero central, un aro de progreso opcional alrededor del disco y un modo interactivo que la convierte en un botón. Cuando no hay carátula, muestra el icono de la aplicación del tema del sistema.

### Props
- `src` (string | null) — Ruta de la carátula. Si es `null` o vacía, se muestra el icono. Por defecto: `null`.
- `alt` (string) — Texto alternativo para la carátula. Por defecto: `''`.
- `state` (PlaybackState) — Estado de reproducción. Por defecto: `'stopped'`.
- `fallbackIcon` (string) — Icono del tema que se muestra cuando no hay carátula. Por defecto: `'applications-multimedia'`.
- `period` (number) — Segundos que tarda una vuelta completa. Por defecto: `8`.
- `progress` (number | null) — Progreso del tema, de 0 a 100. Sin esto no hay aro. Por defecto: `null`.
- `progressLabel` (string) — Nombre del aro para lectores de pantalla.
- `interactive` (boolean) — Convierte el disco en un botón. Por defecto: `false`.
- `label` (string) — Nombre del botón cuando `interactive` es `true`. **Requerido** en ese caso.

### Emite
- `error` — Cuando la carátula no se pudo cargar.
- `click` — Cuando se toca el disco, con `interactive`.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SpinningCover from '../media/SpinningCover.vue'
const playing = ref(false)
</script>

<template>
  <SpinningCover
    src="/ruta/a/caratula.jpg"
    :state="playing ? 'playing' : 'paused'"
    :progress="42"
    interactive
    label="Reproduciendo tema actual"
    @click="() => { /* abrir reproductor */ }"
  />
</template>
```

### Notas
- Al pausar, el disco se congela en su ángulo actual; sin reproducción (`stopped`) se detiene.
- Con `prefers-reduced-motion`, el disco no gira.
