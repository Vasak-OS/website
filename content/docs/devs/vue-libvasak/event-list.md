---
title: "Calendar | EventList"
weight: 190
description: "Lista de eventos del día con hora, título, lugar y calendario en tarjetas."
---

# `EventList`

### Descripción
- Eventos de un día: tarjetas con hora, título, lugar y calendario, en grilla o lista.

### Props
- `entries` (`readonly CalendarEntry[]`) — Eventos del día, en el orden deseado. **Requerido**.
- `now` (Date) — Momento actual para detectar eventos en curso. Sin esto, la hora de la máquina al dibujar.
- `locale` (string) — Idioma para formato de horas. Sin esto, el del sistema.
- `hour12` (boolean) — Forzar 12 o 24 horas. Sin esto, lo que diga el idioma.
- `layout` (`'grid' | 'list'`) — Distribución visual. Por defecto: `'grid'`.
- `emptyLabel` (string) — Texto cuando no hay eventos.
- `allDayLabel` (string) — Texto para eventos de día completo.
- `ongoingLabel` (string) — Texto para eventos en curso.

### Emite
- `select` — Se emite cuando se elige un evento (si hay listener).

### Uso
```vue
<script setup lang="ts">
import EventList from '../calendar/EventList.vue'
const events = [
  { id: '1', title: 'Reunión', start: '2026-10-13T10:00', end: '2026-10-13T11:00' },
]
</script>

<template>
  <EventList
    :entries="events"
    layout="grid"
    @select="openEvent"
  />
</template>
```

### Notas
- Si hay listener para `select`, cada tarjeta es un botón; si no, es texto estático.
- La barra izquierda usa el color del calendario; sin color válido, usa el secundario.
