---
title: "Animación | SlideTransition"
weight: 220
description: "SlideTransition: el deslizamiento direccional entre dos secciones que ocupan el mismo lugar, de ida y de vuelta."
---

# `SlideTransition`

### Descripción
- El deslizamiento direccional entre dos secciones que ocupan el mismo lugar: del centro de notificaciones a los ajustes rápidos y de vuelta, o entre pantallas de un mismo panel.
- `direction` es el lado del que **entra** la sección nueva; la que se va sale hacia el lado contrario, así que ir y volver se lee como dos pasos de un mismo camino. Entra en 200 ms con `ease-ui-out` y sale en 150 ms con `ease-in`, 16 px y opacidad: lo suficiente para que se note de dónde viene sin que el contenido cruce la ventana.

### Props
- `direction` (`'left' | 'right' | 'up' | 'down'`) — El lado del que entra la sección nueva; la anterior se va al contrario. Por omisión `right`.
- `mode` (`'out-in' | 'in-out'`) — `out-in` para que no convivan las dos secciones en la pantalla.
- `appear` (boolean) — Pone la transición en marcha también en el primer montaje.
- `onEnter` / `onLeave` (`(el: Element, done: () => void) => void`) — Hooks de JavaScript de entrada y salida. Si reciben `done`, hay que llamarla.

### Emite
- `beforeEnter`, `afterEnter`, `enterCancelled`, `beforeLeave`, `afterLeave`, `leaveCancelled` — Los hooks del `<Transition>`, con el elemento como carga.

### Ranura
- La por defecto: la sección que entra o se va.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import SlideTransition from '../transition/SlideTransition.vue'

const screen = ref<'notifications' | 'settings'>('notifications')
const direction = ref<'left' | 'right'>('right')
</script>

<template>
  <SlideTransition :direction="direction" mode="out-in">
    <section :key="screen">
      <NotificationsView v-if="screen === 'notifications'" @open-settings="screen = 'settings'" />
      <QuickSettingsView v-else @back="screen = 'notifications'" />
    </section>
  </SlideTransition>
</template>
```

### Notas
- Para que la ida y la vuelta se lean como un mismo camino, `direction` se cambia junto con la sección destino: hacia la derecha al volver, hacia la izquierda al entrar.
- Con `prefers-reduced-motion` queda sólo la opacidad (`motion-reduce:`), como en `AppletPopover`.
- Sólo se mueven `opacity` y `translate`, que se componen sin rehacer el maquetado.
- Las duraciones son las clases `duration-150` y `duration-200`, no un token: la guardia de diseño sólo acepta 100/150/200/300.
- `enter` y `leave` van como props `onEnter` y `onLeave`, no como eventos, por la misma razón que en [`RevealTransition`](/docs/devs/vue-libvasak/reveal-transition/): el `<Transition>` mira la aridad de la función para saber si tiene que esperar a `done`.
