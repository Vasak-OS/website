---
title: "Animation | SlideTransition"
weight: 220
description: "SlideTransition: the directional slide between two sections that share the same place, forwards and back."
---

# `SlideTransition`

### Description
- The directional slide between two sections that share the same place: from the notification center to quick settings and back, or between screens of the same panel.
- `direction` is the side the **new** section enters from; the one leaving goes to the opposite side, so going and coming back reads as two steps of the same path. It enters in 200 ms with `ease-ui-out` and leaves in 150 ms with `ease-in`, 16 px and opacity: enough to notice where it comes from without the content crossing the window.

### Props
- `direction` (`'left' | 'right' | 'up' | 'down'`) — The side the new section enters from; the previous one leaves the opposite way. `right` by default.
- `mode` (`'out-in' | 'in-out'`) — `out-in` so the two sections do not coexist on screen.
- `appear` (boolean) — Runs the transition on the first mount too.
- `onEnter` / `onLeave` (`(el: Element, done: () => void) => void`) — JavaScript enter and leave hooks. If they receive `done`, it has to be called.

### Emits
- `beforeEnter`, `afterEnter`, `enterCancelled`, `beforeLeave`, `afterLeave`, `leaveCancelled` — The `<Transition>` hooks, with the element as payload.

### Slot
- The default one: the section that enters or leaves.

### Usage
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

### Notes
- For going and coming back to read as the same path, `direction` changes together with the target section: to the right when going back, to the left when entering.
- With `prefers-reduced-motion` only the opacity remains (`motion-reduce:`), as in `AppletPopover`.
- Only `opacity` and `translate` move, which compose without redoing the layout.
- The durations are the `duration-150` and `duration-200` classes, not a token: the design guard only accepts 100/150/200/300.
- `enter` and `leave` come as the `onEnter` and `onLeave` props, not as events, for the same reason as in [`RevealTransition`](/en/docs/devs/vue-libvasak/reveal-transition/): `<Transition>` counts the function's parameters to know whether to wait for `done`.
