---
title: "Calendar | MonthCalendar"
weight: 158
description: "MonthCalendar: monthly grid calendar with keyboard navigation, marked days and date selection."
---

# `MonthCalendar`

### Description
Monthly grid calendar component, with today highlighted, the selected day outlined in the accent, and days with events marked with a dot. It receives the dates with events, not the events: which days have which is counted by `markedDates()` from `dates.ts`. Always shows six weeks, so it does not change height when switching months. Keyboard navigation follows the WAI-ARIA date picker pattern: arrows move one day or one week, Home and End go to the start and end of the week, Page Up / Page Down change months, and Enter and Space select.

### Props
- `modelValue` (IsoDate | null) — The selected day, in `YYYY-MM-DD` format. Default: `null`.
- `month` (IsoMonth | null) — The displayed month, in `YYYY-MM` format. Without it, the one of the selected day or today. Default: `null`.
- `today` (IsoDate | null) — Today. Without it, the machine's day; passed in a sandbox or test. Default: `null`.
- `markedDates` (readonly IsoDate[]) — Days with events. Default: `[]`.
- `locale` (string) — Language for day and month names, like `es-AR`. Without it, the system one. Default: `undefined`.
- `weekStart` (number) — Week start day: 0 Sunday … 6 Saturday. Without it, the one from the language (`weekStartOf`). Default: `undefined`.
- `previousLabel` (string) — Text for the previous month button. Default: `undefined`.
- `nextLabel` (string) — Text for the next month button. Default: `undefined`.
- `markedLabel` (string) — Text added to the name of a day with events for those who cannot see the dot. Default: `undefined`.
- `todayLabel` (string) — Text added to today's name. Default: `undefined`.

### Emits
- `update:modelValue` — Emitted with the selected date (`IsoDate`).
- `update:month` — Emitted with the visible month (`IsoMonth`) when it changes.
- `select` — Emitted with the selected date (`IsoDate`) when a day is chosen: with mouse, finger, Enter, or Space.

### Usage
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

### Notes
- The cells are 32 px (minimum touch target) and the grid distributes the rest.
- Selecting a day from another month switches the month automatically unless `month` is controlled from outside.
- The `actions` slot goes next to the arrows, for a "+" button to create an event, for example.
