---
title: "Diseño | PageHeader"
weight: 68
description: "PageHeader: cabecera de página con sección, título, descripción, icono y acciones."
---

# `PageHeader`

### Descripción
- La cabecera de una página: la sección a la que pertenece, el título, una descripción y las acciones de la página.
- Se adapta por el ancho de la cabecera, no de la pantalla: desde 448 px las acciones van a la derecha; más angosta, debajo.

### Props
- `title` (string) — Título de la página. **Requerido**.
- `eyebrow` (string) — Línea pequeña de arriba con la sección a la que pertenece la página.
- `description` (string) — Descripción del contenido de la página.
- `icon` (string) — Nombre del icono del tema, en un recuadro a la izquierda.
- `iconType` (`'icon'|'symbol'`) — Variante del icono del tema. Por defecto: `'icon'`.
- `size` (`'md'|'lg'`) — Tamaño del título. Por defecto: `'md'`.
- `as` (`'h1'|'h2'`) — Nivel del encabezado. Una página tiene un solo `h1`. Por defecto: `'h1'`.

### Uso
```vue
<script setup lang="ts">
import PageHeader from '../layout/PageHeader.vue'
import ActionButton from '../controls/ActionButton.vue'
</script>

<template>
  <PageHeader
    title="General"
    eyebrow="Configuración"
    description="Ajustes generales del sistema."
    icon="settings"
  >
    <template #actions>
      <ActionButton label="Restablecer" variant="secondary" />
    </template>
  </PageHeader>
</template>
```
