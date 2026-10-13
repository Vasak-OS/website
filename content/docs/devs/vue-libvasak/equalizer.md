---
title: "Media | Equalizer"
weight: 170
description: "Equalizer: ecualizador de diez bandas con curva suave, perfiles y soporte para teclado."
---

# `Equalizer`

### Descripción
- Ecualizador gráfico con bandas verticales arrastrables, curva de respuesta en frecuencia y selector de perfiles.
- No sabe nada de D-Bus: recibe frecuencias, ganancias, rango y perfiles, y emite lo que se tocó.
- Las bandas se dibujan con `role="slider"` vertical y soportan arrastre con puntero y teclado (flechas, Re Pág/Av Pág, Inicio/Fin).

### Props
- `frequencies` (readonly number[]) — Frecuencias de las bandas en Hz. **Requerido**.
- `gains` (readonly number[]) — Ganancia de cada banda en dB, en el mismo orden. **Requerido**.
- `range` (readonly [number, number]) — Mínimo y máximo de cada banda en dB. Por defecto: `[-12, 12]`.
- `step` (number) — Paso de ajuste en dB. Por defecto: `0.5`.
- `presets` (readonly EqualizerPreset[]) — Perfiles disponibles. Por defecto: `[]`.
- `preset` (string) — Perfil elegido; si no está en `presets`, es el perfil propio. Por defecto: `''`.
- `customLabel` (string) — Nombre del perfil propio. Por defecto: `undefined`.
- `saved` (boolean) — Si los cambios están guardados. Por defecto: `true`.
- `enabled` (boolean) — Si el ecualizador está activo. Por defecto: `true`.
- `available` (boolean) — Si el servicio está disponible en el bus. Por defecto: `true`.
- `title` (string) — Título de la sección. Por defecto: `undefined`.
- `savedLabel` (string) — Etiqueta de «guardado». Por defecto: `undefined`.
- `unsavedLabel` (string) — Etiqueta de «no guardado». Por defecto: `undefined`.
- `unavailableLabel` (string) — Etiqueta de «no disponible». Por defecto: `undefined`.
- `presetsLabel` (string) — Etiqueta de «perfiles». Por defecto: `undefined`.

### EqualizerPreset
- `value` (string) — Identificador del perfil. **Requerido**.
- `label` (string) — Nombre traducido del perfil. **Requerido**.

### Emite
- `gain` (band: number, value: number) — Se emite cuando se mueve una banda, con el índice y la nueva ganancia en dB.
- `preset` (value: string) — Se emite al elegir un perfil.

### Uso
```vue
<script setup lang="ts">
import Equalizer from '../media/Equalizer.vue'

const frequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
const gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const presets = [
  { value: 'flat', label: 'Plano' },
  { value: 'rock', label: 'Rock' }
]
</script>

<template>
  <Equalizer
    :frequencies="frequencies"
    :gains="gains"
    :presets="presets"
    preset="flat"
    :available="true"
  />
</template>
```

### Notas
- La curva se dibuja con `clip-path: polygon()` sobre dos cajas (trazo y velo), sin SVG.
- `available` en `false` apaga todo y muestra un mensaje; `enabled` en `false` atenúa las bandas pero deja elegir perfil.
- La aplicación es responsable de limitar las llamadas durante el arrastre (unas 30 por segundo).
