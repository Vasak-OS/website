---
title: "Identity | Avatar"
weight: 144
description: "Avatar: foto o iniciales de una persona, con fallback a icono genérico, modo editable y seis tamaños."
---

# `Avatar`

### Descripción
- Muestra la foto de una persona, o sus iniciales si no hay foto o si esta no carga. Sin nombre, muestra el icono genérico del tema. Redondo por naturaleza.

### Props
- `src` (`string | null`) — URL de la foto. Por defecto: `null`.
- `name` (string) — Nombre de la persona: iniciales y `alt` por omisión. Por defecto: `''`.
- `alt` (string) — Texto alternativo personalizado.
- `size` (`'sm' | 'md' | 'ml' | 'lg' | 'xl' | '2xl'`) — Tamaño del avatar. Por defecto: `'md'`.
- `editable` (boolean) — Convierte el avatar en botón con lápiz en la esquina. Por defecto: `false`.
- `editLabel` (string) — Texto accesible del botón de editar.

### Emite
- `edit` — Se emite al tocar el avatar en modo editable.
- `error` — Se emite cuando la foto no carga.

### Uso
```vue
<script setup lang="ts">
import Avatar from '../identity/Avatar.vue'
</script>

<template>
  <Avatar
    src="/foto.jpg"
    name="Juan Pérez"
    size="lg"
    editable
    editLabel="Cambiar la foto"
    @edit="/* abrir selector */"
  />
</template>
```

### Notas
- Sin foto o con una que no carga, se muestran las iniciales del nombre.
- Sin nombre, se muestra el icono `avatar-default` del tema.
- La foto lleva `alt` (por omisión, el nombre); las iniciales también lo llevan como imagen con nombre.
