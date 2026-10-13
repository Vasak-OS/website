---
title: "Control | PowerActions"
weight: 210
description: "Botones de energía (suspender, reiniciar, apagar) en forma de iconos o mosaicos, con iconos del tema."
---

# `PowerActions`

### Descripción
- Conjunto de botones de energía del sistema: suspender, hibernar, reiniciar, apagar, cerrar sesión y bloquear. Se presentan como una fila de iconos o como mosaicos con el nombre debajo. La librería emite la acción; quien la usa ejecuta la orden correspondiente.

### Props
- `actions` (readonly PowerAction[]) — Qué acciones mostrar, en ese orden. Por defecto: `['suspend', 'reboot', 'poweroff']`.
- `variant` (`'icons' | 'tiles'`) — Formato visual. Por defecto: `'icons'`.
- `buttonVariant` (`'secondary' | 'ghost' | 'overlay'`) — Estilo de los botones en `icons`; `overlay` para fondos de pantalla. Por defecto: `'secondary'`.
- `labels` (Partial<Record<PowerAction, string>>) — Nombres traducidos. Lo que falte sale del catálogo o del inglés.
- `label` (string) — Nombre del grupo para lectores de pantalla.
- `disabled` (boolean) — Deshabilita todas las acciones. Por defecto: `false`.

### Emite
- `action` (PowerAction) — Cuando el usuario elige una acción.

### Uso
```vue
<script setup lang="ts">
import PowerActions from '../controls/PowerActions.vue'

function onAction(action: string) {
  // Llamar a logind, greetd o el gestor de sesión
  console.log(action)
}
</script>

<template>
  <PowerActions
    variant="icons"
    @action="onAction"
  />
</template>
```

### Notas
- `PowerAction` es `'suspend' | 'hibernate' | 'reboot' | 'poweroff' | 'logout' | 'lock'`.
- Los iconos usan los nombres de freedesktop: `system-suspend`, `system-reboot`, etc.
- La librería no ejecuta ninguna acción ni pide confirmación; eso depende de la pantalla.
