---
title: "Animación | RevealTransition"
weight: 218
description: "RevealTransition: la aparición y el cierre de lo que se muestra o se esconde, con la forma y los tiempos de Once UI."
---

# `RevealTransition`

### Descripción
- La aparición y el cierre de lo que se muestra o se esconde: un cambio de sección, el resultado de una búsqueda, un velo, o un panel que sale de su disparador.
- Es un `<Transition>` de Vue con el criterio de `AppletPopover`, para que las aplicaciones no armen el suyo a mano. Lo que cambia es la opacidad: entra en 200 ms con `ease-ui-out` y sale en 150 ms con `ease-in`. La salida es más corta a propósito: lo que se va no hace esperar a lo que viene.

### Props
- `scale` (boolean) — Además de la opacidad, crece de 0,96 a 1 al entrar y se achica a 0,98 al salir (el «pop» desde el disparador).
- `from` (`'left' | 'right' | 'up' | 'down'`) — Entra desplazado 6 px desde ese lado. Al salir no se desplaza: irse hacia el panel se lee como «se guardó», y con la escala alcanza.
- `mode` (`'out-in' | 'in-out'`) — `out-in` para lo que se reemplaza en el mismo lugar: sale lo viejo y recién después entra lo nuevo.
- `appear` (boolean) — Pone la transición en marcha también en el primer montaje.
- `onEnter` / `onLeave` (`(el: Element, done: () => void) => void`) — Hooks de JavaScript de entrada y salida. Si reciben `done`, hay que llamarla.

### Emite
- `beforeEnter`, `afterEnter`, `enterCancelled`, `beforeLeave`, `afterLeave`, `leaveCancelled` — Los hooks del `<Transition>`, con el elemento como carga.

### Ranura
- La por defecto: el contenido que aparece y se va.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import RevealTransition from '../transition/RevealTransition.vue'

const open = ref(false)
</script>

<template>
  <button type="button" @click="open = !open">Ajustes rápidos</button>

  <RevealTransition :scale="true" from="down" mode="out-in">
    <div v-if="open" class="rounded-corner-l bg-ui-surface p-4">
      El panel
    </div>
  </RevealTransition>
</template>
```

### Notas
- Para que el `scale` crezca **desde el botón**, quien usa el componente pone `transform-origin` en el elemento: la transición no sabe dónde está su disparador.
- Con `prefers-reduced-motion` queda sólo la opacidad. Lo resuelve el CSS al dibujar (`motion-reduce:`), porque `matchMedia` no avisa de los cambios en el WebView y la regla se aplica igual.
- Sólo se mueven `opacity`, `scale` y `translate`, que se componen sin rehacer el maquetado.
- Las duraciones son las clases `duration-150` y `duration-200`, no un token: la guardia de diseño sólo acepta 100/150/200/300.
- `enter` y `leave` van como props `onEnter` y `onLeave`, no como eventos: el `<Transition>` mira cuántos parámetros declara la función para saber si va a avisar con `done`, y un reenvío propio de dos parámetros lo dejaría esperando para siempre.
- Para el deslizamiento entre dos secciones que ocupan el mismo lugar está [`SlideTransition`](/docs/devs/vue-libvasak/slide-transition/).
