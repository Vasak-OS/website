---
title: "Tarjeta | ListCard"
weight: 40
---

# `ListCard`

Descripción
- Contenedor tipo tarjeta para elementos de lista que puede ser `clickable`.

Props
- `clickable` (boolean) — Si es `true` emite `click` al pulsar. Por defecto: `false`.
- `customClass` (string | Record<string, boolean>) — Clases adicionales.

Emite
- `click` — Si `clickable` es true, se emite al pulsar.

Slots
- Default — Contenido de la tarjeta (icono + texto, etc.).

Uso
```vue
<script setup lang="ts">
import ListCard from '../cards/ListCard.vue'
</script>

<template>
  <ListCard clickable @click="() => console.log('item clicado')">
    <div class="flex items-center gap-3">
      <img src="/icons/item.svg" class="w-6 h-6" />
      <div>
        <div class="font-semibold">Elemento</div>
        <div class="text-xs text-gray-400">Detalle</div>
      </div>
    </div>
  </ListCard>
</template>
```

