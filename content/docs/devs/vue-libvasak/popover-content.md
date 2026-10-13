---
title: "Popover | PopoverContent"
weight: 113
description: "PopoverContent: el cuerpo del globo, un diálogo no modal teletransportado al body con posicionamiento y gestión de foco."
---

# `PopoverContent`

### Descripción
- Componente que representa el cuerpo del globo: un `dialog` no modal que se teletransporta al `body` y se ubica respecto al ancla o al disparador. Incluye gestión de foco, cierre con Escape y clic afuera, y reposicionamiento al desplazar o cambiar de tamaño.

### Props
- `side` (`'top' | 'bottom' | 'left' | 'right'`) — Lado preferido respecto al ancla. Por defecto: `'bottom'`.
- `align` (`'start' | 'center' | 'end'`) — Alineación respecto al ancla. Por defecto: `'start'`.
- `sideOffset` (number) — Distancia en píxeles entre el ancla y el contenido. Por defecto: `4`.
- `trapFocus` (boolean) — Hace que el Tabulador dé la vuelta adentro del contenido. Por defecto: `false`.
- `padding` (`'none' | 'sm' | 'md'`) — Relleno interno del contenido. Por defecto: `'md'`.
- `label` (string) — Nombre accesible para el contenido, útil cuando no hay título visible.

### Uso
```vue
<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from 'vue-libvasak'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button>Abrir</button>
    </PopoverTrigger>
    <PopoverContent side="bottom" align="start" :side-offset="8">
      <p>Contenido del globo.</p>
    </PopoverContent>
  </Popover>
</template>
```

### Notas
- Sin `trapFocus`, salir del contenido con Tabulador cierra el globo y devuelve el foco al disparador.
- Se teletransporta al `body` para evitar recortes por `overflow` de los contenedores padres.
- El contenido se oculta con `v-show` y se le aplica `inert` cuando está cerrado.
