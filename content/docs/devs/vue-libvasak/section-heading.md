---
title: "Diseño | SectionHeading"
weight: 96
description: "SectionHeading: título de un tramo con variantes eyebrow y group, contador y línea divisoria."
---

# `SectionHeading`

### Descripción
- Componente para el título de un tramo: «Cuentas», «Hoy», «Septiembre de 2026 · 214». Dos variantes: el `eyebrow`, la línea chica en mayúsculas sobre un tramo; y el `group`, el título de un grupo de elementos con contador en insignia y línea divisoria.

### Props
- `title` (string) — El texto del título. **Requerido**.
- `icon` (string) — Nombre de icono del tema, antes del título.
- `iconType` (`'icon'|'symbol'`) — Tipo del icono del tema. Por defecto: `'symbol'`.
- `count` (number | string) — Cuántos elementos tiene el tramo; se dibuja en una insignia.
- `variant` (`'eyebrow'|'group'`) — Estilo del título. Por defecto: `'eyebrow'`.
- `sticky` (boolean) — Pega el título arriba del contenedor que desplaza. Por defecto: `false`.
- `surface` (`'window'|'panel'`) — Sobre qué se pega: la ventana o un `Panel`. Por defecto: `'window'`.
- `divider` (boolean) — Dibuja una línea desde el título hasta el canto. Por defecto: `false`.
- `as` (`'h2'|'h3'|'h4'|'h5'|'h6'`) — El nivel del título en el documento. Por defecto: `'h3'`.

### Ranuras
- `actions` — Contenido a la derecha del título: «Ver todo», «Agregar».

### Uso
```vue
<script setup lang="ts">
import SectionHeading from '../layout/SectionHeading.vue'
</script>

<template>
  <!-- Eyebrow sobre un tramo -->
  <SectionHeading title="Cuentas" variant="eyebrow" />

  <!-- Título de grupo con contador y línea -->
  <SectionHeading
    title="Septiembre de 2026"
    variant="group"
    :count="214"
    divider
  />

  <!-- Pegado arriba al desplazar -->
  <SectionHeading
    title="Hoy"
    variant="group"
    sticky
    :actions="true"
  >
    <template #actions>
      <button>Ver todo</button>
    </template>
  </SectionHeading>
</template>
```

### Notas
- Cuando `sticky` es `true`, el fondo es opaco y del color de `surface` (decisión de diseño: sin `backdrop-blur`, que cuesta en WebKitGTK).
- `surface="panel"` usa el 70 % de la superficie encima del fondo de la ventana.
