---
title: "Data | PropertyList"
weight: 126
description: "PropertyList: lista de pares nombre-valor en formato grid, rows o inline, con ranura para personalizar valores."
---

# `PropertyList`

### Descripción
Componente que muestra una lista de propiedades (pares nombre-valor) en un elemento `<dl>` semántico, con tres disposiciones y ranura para valores personalizados.

### Props
- `items` (readonly PropertyItem[]) — Lista de pares nombre-valor. **Requerido**.
- `layout` (`'grid' | 'rows' | 'inline'`) — Disposición de la lista. Por defecto: `'grid'`.

### Slots
- `value` (props: { item: PropertyItem; index: number }) — Personaliza la presentación del valor de cada ítem.

### Uso
```vue
<script setup lang="ts">
import PropertyList from '../data/PropertyList.vue'

const items = [
  { label: 'Nombre', value: 'VasakOS' },
  { label: 'Versión', value: '2.4.0', mono: true },
  { label: 'Ruta', value: '/home/usuario/.config/vasakos', mono: true },
]
</script>

<template>
  <PropertyList :items="items" layout="grid" />
</template>
```

### Notas
- `layout` alterna entre: `grid` (nombre arriba del valor en pantallas angostas), `rows` (filas con divisor) e `inline` (pares en línea).
- La interfaz `PropertyItem` incluye `id` opcional para cuando dos nombres se repiten.
- Los valores largos se parten en varias líneas sin empujar el ancho del contenedor.
