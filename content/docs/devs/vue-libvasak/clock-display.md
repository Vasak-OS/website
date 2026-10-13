---
title: "Data | ClockDisplay"
weight: 154
description: "ClockDisplay: reloj grande con fecha opcional, segundos pequeños y halo de legibilidad sobre fondos de pantalla."
---

# `ClockDisplay`

### Descripción
Componente que muestra la hora en grande, con la fecha debajo. El temporizador se alinea al minuto siguiente y avanza de a uno (o de a segundo con `seconds`), para no despertar la máquina cada segundo. Con `now` no hay temporizador: muestra esa hora fija, para un banco o una prueba. La hora y la fecha salen de `Intl` con el idioma que se pase o el del sistema. `legible` suma un halo del color de la ventana alrededor de las letras para sostenerla sobre un fondo de pantalla. Con `smallSeconds`, los segundos van aparte, más chicos y atenuados, pegados arriba a la derecha de los minutos.

### Props
- `size` (`'md'|'lg'`) — Tamaño de la hora. Por defecto: `'lg'`.
- `showDate` (boolean) — Muestra la fecha debajo de la hora. Por defecto: `true`.
- `seconds` (boolean) — Muestra los segundos. Por defecto: `false`.
- `locale` (string) — Idioma para el formato, como `es-AR`. Sin esto, el del sistema. Por defecto: `undefined`.
- `hour12` (boolean) — Fuerza 12 o 24 horas. Sin esto, lo que diga el idioma. Por defecto: `undefined`.
- `legible` (boolean) — Suma el halo de legibilidad para fondos de pantalla. Por defecto: `false`.
- `now` (Date) — Hora fija, sin temporizador. Por defecto: `undefined`.
- `align` (`'start'|'center'`) — Alineación del contenido. Por defecto: `'center'`.
- `smallSeconds` (boolean) — Con `seconds`, muestra los segundos más chicos y atenuados. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import ClockDisplay from '../data/ClockDisplay.vue'
</script>

<template>
  <ClockDisplay
    size="lg"
    :show-date="true"
    :seconds="true"
    :small-seconds="true"
    locale="es-AR"
  />
</template>
```

### Notas
- Va en un `<time>` con `datetime`, sin `aria-live`: un reloj que se anuncia cada minuto es ruido.
- Las cifras son tabulares (`tabular-nums`) para que la hora no baile al cambiar.
- Se achica sola si el contenedor es más angosto que la hora (`@container`).
