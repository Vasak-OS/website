---
title: "Indicador | AlertMessage"
weight: 60
description: "AlertMessage: aviso persistente con tonos, variante banner, ranura de acciones y cierre opcional."
---

# `AlertMessage`

### Descripción
- Aviso que permanece en su lugar para explicar algo dentro de un formulario o sección. No se cierra ni desaparece solo: si el aviso deja de valer, quien lo puso deja de dibujarlo.
- Comparte tono y color con `ToastArea`, de modo que un error se vea igual esté donde esté.

### Props
- `tone` (`'info'|'success'|'warning'|'error'`) — Tono del aviso, que define color y rol ARIA. Por defecto: `'info'`.
- `title` (string) — Una línea que dice de qué se trata, para no tener que leerlo todo.
- `icon` (string) — Nombre de icono del tema. Con `'auto'`, el icono del tono. Sin esto no se dibuja ninguno.
- `iconType` (`'icon'|'symbol'`) — Variante del icono. Por defecto: `'symbol'`.
- `variant` (`'box'|'banner'`) — La caja de siempre, o la barra de lado a lado para el pie de una ventana. Por defecto: `'box'`.
- `dismissible` (boolean) — Muestra la cruz para cerrarlo. Por defecto: `false`.
- `closeLabel` (string) — Nombre de la cruz. Sin esto, del catálogo (`alert.close`) o «Cerrar».

### Emite
- `close` — Se emite cuando el usuario hace click en la cruz de cierre.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import AlertMessage from '../feedback/AlertMessage.vue'

const mostrar = ref(true)
</script>

<template>
  <AlertMessage
    v-if="mostrar"
    tone="warning"
    title="Hace falta reiniciar"
    icon="auto"
    dismissible
    @close="mostrar = false"
  >
    Los cambios se aplicarán después de reiniciar.
  </AlertMessage>
</template>
```

### Notas
- La ranura `actions` muestra los botones del aviso debajo del texto, o al costado en una barra ancha.
- El icono va alineado con la primera línea y no centrado en la caja: con un mensaje de cinco líneas, centrado queda flotando a mitad del párrafo.
