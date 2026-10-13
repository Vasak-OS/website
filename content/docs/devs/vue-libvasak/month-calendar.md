---
title: "Calendar | MonthCalendar"
weight: 158
description: "MonthCalendar: calendario mensual en cuadrícula con navegación por teclado, días con eventos y selección de fecha."
---

# `MonthCalendar`

### Descripción
Componente de calendario mensual en cuadrícula, con hoy resaltado, el día elegido con canto en el acento y los días con eventos marcados con un punto. Recibe las fechas con eventos, no los eventos: de qué días toca cada uno lo cuenta `markedDates()` de `dates.ts`. Siempre muestra seis semanas, así que no cambia de alto al pasar de mes. La navegación por teclado sigue el patrón de un selector de fecha de WAI-ARIA: las flechas mueven un día o una semana, Inicio y Fin van al principio y al final de la semana, Re Pág / Av Pág cambian de mes, y Enter y Espacio eligen.

### Props
- `modelValue` (IsoDate | null) — El día elegido, en formato `AAAA-MM-DD`. Por defecto: `null`.
- `month` (IsoMonth | null) — El mes que se muestra, en formato `AAAA-MM`. Sin esto, el del día elegido o el de hoy. Por defecto: `null`.
- `today` (IsoDate | null) — Hoy. Sin esto, el día de la máquina; se pasa en un banco o una prueba. Por defecto: `null`.
- `markedDates` (readonly IsoDate[]) — Los días con eventos. Por defecto: `[]`.
- `locale` (string) — Idioma para los nombres de días y meses, como `es-AR`. Sin esto, el del sistema. Por defecto: `undefined`.
- `weekStart` (number) — Día de inicio de semana: 0 domingo … 6 sábado. Sin esto, el del idioma (`weekStartOf`). Por defecto: `undefined`.
- `previousLabel` (string) — Texto para el botón de mes anterior. Por defecto: `undefined`.
- `nextLabel` (string) — Texto para el botón de mes siguiente. Por defecto: `undefined`.
- `markedLabel` (string) — Texto que se suma al nombre de un día con eventos para quien no ve el punto. Por defecto: `undefined`.
- `todayLabel` (string) — Texto que se suma al nombre de hoy. Por defecto: `undefined`.

### Emite
- `update:modelValue` — Se emite con la fecha elegida (`IsoDate`).
- `update:month` — Se emite con el mes visible (`IsoMonth`) cuando cambia.
- `select` — Se emite con la fecha elegida (`IsoDate`) cuando se elige un día: con el ratón, el dedo, Enter o Espacio.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import MonthCalendar from '../calendar/MonthCalendar.vue'

const selected = ref(null)
const month = ref(null)
const marked = ref(['2026-10-15', '2026-10-20'])
</script>

<template>
  <MonthCalendar
    v-model="selected"
    v-model:month="month"
    :marked-dates="marked"
    locale="es-AR"
    week-start="1"
  />
</template>
```

### Notas
- Las casillas miden 32 px (zona de toque mínima) y la cuadrícula reparte el resto.
- Al elegir un día de otro mes, el mes cambia solo salvo que `month` esté controlado desde afuera.
- El slot `actions` va al lado de las flechas, para un botón «+» de crear evento, por ejemplo.
