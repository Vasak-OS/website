---
title: "Animation | RevealTransition"
weight: 218
description: "RevealTransition: how what is shown or hidden appears and leaves, with Once UI's shape and timings."
---

# `RevealTransition`

### Description
- The appearance and dismissal of what is shown or hidden: a section change, a search result, a veil, or a panel coming out of its trigger.
- It is a Vue `<Transition>` with the `AppletPopover` criteria, so applications stop building their own. What changes is the opacity: it enters in 200 ms with `ease-ui-out` and leaves in 150 ms with `ease-in`. The exit is shorter on purpose: what is leaving should not make what is coming wait.

### Props
- `scale` (boolean) — Besides the opacity, it grows from 0.96 to 1 on enter and shrinks to 0.98 on leave (the «pop» from the trigger).
- `from` (`'left' | 'right' | 'up' | 'down'`) — It enters displaced 6 px from that side. On leave it does not move: leaving towards the panel reads as «it was saved», and the scale is enough.
- `mode` (`'out-in' | 'in-out'`) — `out-in` for what is replaced in the same place: the old one leaves and only then the new one enters.
- `appear` (boolean) — Runs the transition on the first mount too.
- `onEnter` / `onLeave` (`(el: Element, done: () => void) => void`) — JavaScript enter and leave hooks. If they receive `done`, it has to be called.

### Emits
- `beforeEnter`, `afterEnter`, `enterCancelled`, `beforeLeave`, `afterLeave`, `leaveCancelled` — The `<Transition>` hooks, with the element as payload.

### Slot
- The default one: the content that appears and leaves.

### Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import RevealTransition from '../transition/RevealTransition.vue'

const open = ref(false)
</script>

<template>
  <button type="button" @click="open = !open">Quick settings</button>

  <RevealTransition :scale="true" from="down" mode="out-in">
    <div v-if="open" class="rounded-corner-l bg-ui-surface p-4">
      The panel
    </div>
  </RevealTransition>
</template>
```

### Notes
- For `scale` to grow **from the button**, whoever uses the component sets `transform-origin` on the element: the transition does not know where its trigger is.
- With `prefers-reduced-motion` only the opacity remains. CSS resolves it while drawing (`motion-reduce:`), because `matchMedia` does not report changes in the WebView and the rule applies anyway.
- Only `opacity`, `scale` and `translate` move, which compose without redoing the layout.
- The durations are the `duration-150` and `duration-200` classes, not a token: the design guard only accepts 100/150/200/300.
- `enter` and `leave` come as the `onEnter` and `onLeave` props, not as events: `<Transition>` counts how many parameters the function declares to know whether it will call `done`, and a two-parameter forward would leave it waiting forever.
- For the slide between two sections that share the same place, use [`SlideTransition`](/en/docs/devs/vue-libvasak/slide-transition/).
