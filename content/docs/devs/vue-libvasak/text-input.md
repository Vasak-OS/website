---
title: "Formulario | TextInput"
weight: 72
description: "TextInput: campo de texto con validación visual, modo monoespaciado, tipos nativos y eventos de teclado."
---

# `TextInput`

### Descripción
- Campo de texto reutilizable con soporte para `v-model`, tipos nativos (`text`, `password`, `search`, `url`, `email`, `number`, `date`, `time`, `datetime-local`), indicación visual de error, modo monoespaciado para valores alineados y eventos de teclado declarados.

### Props
- `modelValue` (string) — Valor del campo. **Requerido**.
- `type` (`'text' | 'password' | 'search' | 'url' | 'email' | 'number' | 'date' | 'time' | 'datetime-local'`) — Tipo del campo. Por defecto: `'text'`.
- `size` (`'md' | 'lg'`) — Alto del campo: `md` son 32 px, `lg` son 40 px. Por defecto: `'md'`.
- `bare` (boolean) — Sin canto ni fondo, para superficies que ya enmarcan. Por defecto: `false`.
- `id` (string) — Identificador del campo, necesario para asociarlo con `FormGroup`.
- `ariaLabel` (string) — Nombre accesible cuando no hay etiqueta visible.
- `describedBy` (string) — El `id` del texto de error o ayuda debajo del campo.
- `autocomplete` (string) — Qué autocompletar.
- `spellcheck` (boolean) — Controla la revisión ortográfica del navegador. Por defecto: `undefined`.
- `autocapitalize` (`'none' | 'off' | 'sentences' | 'words' | 'characters'`) — Mayúsculas automáticas en teclado virtual. Por defecto: `undefined`.
- `placeholder` (string) — Texto de marcador de posición.
- `disabled` (boolean) — Deshabilita el campo. Por defecto: `false`.
- `readonly` (boolean) — Hace el campo de solo lectura. Por defecto: `false`.
- `invalid` (boolean) — Dibuja el borde de error para un valor inválido. Por defecto: `false`.
- `mono` (boolean) — Aplica fuente monoespaciada para rutas y órdenes. Por defecto: `false`.
- `required` (boolean) — Marca el campo como obligatorio. Por defecto: `false`.
- `lazy` (boolean) — Emite `update:modelValue` al salir del campo en vez de en cada tecla. Por defecto: `false`.

### Emite
- `update:modelValue` (string) — Se emite cuando el valor cambia. Con `lazy`, al salir del campo; si no, en cada tecla.
- `keyup` (KeyboardEvent) — Reenvía el evento `keyup` del `input`.
- `keydown` (KeyboardEvent) — Reenvía el evento `keydown` del `input`.

### Uso
```vue
<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '../forms/TextInput.vue'

const username = ref('')
</script>

<template>
  <TextInput
    v-model="username"
    type="text"
    placeholder="Nombre de usuario"
    :spellcheck="false"
    autocapitalize="none"
    @keyup.enter="() => { /* enviar */ }"
  />
</template>
```

### Notas
- El método `focus()` enfoca el campo y devuelve un booleano indicando si lo consiguió. También existe `enfocar` como alias obsoleto (se va en la 3.0).
- No trae etiqueta propia: para eso está `FormGroup`, que la ata al campo por `id`.
- Los eventos `keyup` y `keydown` deben reenviarse a mano en el template, ya que Vue saca de los atributos todo evento declarado.
