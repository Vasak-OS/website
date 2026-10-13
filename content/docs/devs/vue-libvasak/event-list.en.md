---
title: "Calendar | EventList"
weight: 190
description: "Day event list with time, title, location and calendar in cards."
---

# `EventList`

### Description
- Events of a day: cards with time, title, location and calendar, in grid or list layout.

### Props
- `entries` (`readonly CalendarEntry[]`) — Events of the day, in the desired order. **Required**.
- `now` (Date) — Current time to detect ongoing events. Defaults to machine time at render.
- `locale` (string) — Language for time formatting. Defaults to system.
- `hour12` (boolean) — Force 12 or 24 hour format. Defaults to locale setting.
- `layout` (`'grid' | 'list'`) — Visual distribution. Default: `'grid'`.
- `emptyLabel` (string) — Text when there are no events.
- `allDayLabel` (string) — Text for all-day events.
- `ongoingLabel` (string) — Text for ongoing events.

### Emits
- `select` — Emitted when an event is selected (if a listener is present).

### Usage
```vue
<script setup lang="ts">
import EventList from '../calendar/EventList.vue'
const events = [
  { id: '1', title: 'Meeting', start: '2026-10-13T10:00', end: '2026-10-13T11:00' },
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

### Notes
- If a `select` listener is present, each card is a button; otherwise it is static text.
- The left bar uses the calendar color; without a valid color, it uses the secondary.
