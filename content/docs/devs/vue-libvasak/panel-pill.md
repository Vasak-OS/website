---
title: "Panel | PanelPill"
weight: 100
description: "PanelPill: píldora flotante del panel — botón redondo, dato con icono o grupo, con estado activo."
---

# `PanelPill`

### Descripción
- Pieza del panel en píldoras flotantes del escritorio: puede ser un botón interactivo, un dato con icono (reloj, clima, Wi-Fi) o un grupo de botones. Con `active` se rellena en el primario para indicar conexión o estado actual.

### Props
- `label` (string) — El dato principal. Por defecto: `''`.
- `caption` (string) — El renglón chico de abajo (la fecha, el tiempo). Por defecto: `''`.
- `icon` (string) — Un icono del tema, por nombre. Por defecto: `''`.
- `iconType` (`'icon'|'symbol'`) — Tipo de icono del tema. Por defecto: `'symbol'`.
- `iconFallbacks` (readonly string[]) — Otros nombres del tema para el icono, en orden. Por defecto: `[]`.
- `active` (boolean) — Rellena en el primario: conectado, activo. Por defecto: `false`.
- `interactive` (boolean) — Es un botón. Por defecto: `true`.
- `expanded` (boolean) — Lo que abre está abierto. `undefined` no dice nada. Por defecto: `undefined`.
- `title` (string) — El globo. Sin esto, el dato y el renglón de abajo.
- `accessibleLabel` (string) — El nombre para un lector de pantalla. Sin esto, el globo.
- `orientation` (`'horizontal'|'vertical'`) — Apila para un panel a un costado. Por defecto: `'horizontal'`.
- `flush` (boolean) — Sin relleno: para un grupo cuyos botones ya miden lo suyo. Por defecto: `false`.
- `flat` (boolean) — Sin fondo ni canto propios en reposo, para cuando el panel ya tiene una superficie detrás. Por defecto: `false`.
- `role` (string) — El rol de una píldora quieta que agrupa otros botones (`group`). Con él, `accessibleLabel` nombra al grupo.

### Emite
- `click` (MouseEvent) — Se tocó, con `interactive`.

### Uso
```vue
<script setup lang="ts">
import PanelPill from '../panel/PanelPill.vue'
</script>

<template>
  <PanelPill
    icon="network-wireless-symbolic"
    label="MiRed"
    :active="true"
    @click="() => { /* abrir red */ }"
  />
</template>
```

### Notas
- Con `interactive` la raíz es un `<button>`; sin él, un `<div>` quieto.
- `expanded` añade `aria-expanded` y el velo del acento sobre la superficie.
- El texto se corta con puntos suspensivos; la píldora no crece más que su contenedor.
