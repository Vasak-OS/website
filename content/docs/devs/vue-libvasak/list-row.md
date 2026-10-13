---
title: "Lista | ListRow"
weight: 70
description: "ListRow: fila de lista con icono, título, descripción, dato a la derecha y ranuras."
---

# `ListRow`

### Descripción
- Una fila de lista: icono, título, descripción y un dato a la derecha.
- Vive dentro de otras filas, en un `ListGroup` o en un panel.
- El rol define su comportamiento: `none` sólo muestra; `button` reacciona al toque y al teclado; `option` es una opción de una lista; `link` navega a otro destino.

### Props
- `title` (string) — Título de la fila.
- `description` (string) — Descripción bajo el título.
- `meta` (string) — Dato corto a la derecha: un tamaño, una hora, un contador.
- `icon` (string) — Nombre del icono del tema.
- `iconType` (`'icon'|'symbol'`) — Variante del icono del tema. Por defecto: `'icon'`.
- `role` (`'none'|'button'|'option'|'link'`) — Comportamiento de la fila. Por defecto: `'none'`.
- `href` (string) — Destino del enlace, para `role="link"`.
- `selected` (boolean) — Marca la fila como la elegida. Por defecto: `false`.
- `disabled` (boolean) — Deshabilita la fila interactiva. Por defecto: `false`.
- `truncate` (boolean) — Todo en una línea, con el texto entero en el globo. Por defecto: `false`.
- `id` (string) — Identificador del elemento.
- `bar` (number) — Barra proporcional de 0 a 1 que representa una parte de algo. Por defecto: `undefined`.
- `hoverable` (boolean) — Realza la fila al pasar por encima aunque no haga nada. Por defecto: `false`.

### Emite
- `click` — Se emite cuando el usuario toca la fila o la activa con el teclado y la fila es interactiva.

### Uso
```vue
<script setup lang="ts">
import ListRow from '../list/ListRow.vue'
</script>

<template>
  <ListRow
    title="Documento.pdf"
    description="Hace 2 días"
    meta="4,2 MB"
    icon="file"
    role="button"
    @click="/* abrir */"
  />
</template>
```

### Notas
- `role="link"` con `href` renderiza un `<a>` real; sin `href`, un `<div>` con rol de enlace.
- Con `bar` presente, el título y la barra comparten el ancho de la fila: con espacio suficiente, en el mismo renglón; por debajo de 20 rem, la barra baja debajo del título.
