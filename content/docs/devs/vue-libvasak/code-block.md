---
title: "Data | CodeBlock"
weight: 150
description: "CodeBlock: bloque de código o registro con líneas coloreadas por tono, desplazamiento interno y seguimiento del final."
---

# `CodeBlock`

### Descripción
Componente para mostrar texto de máquina: un registro que crece, un comando, un archivo de configuración. Acepta un bloque de texto (`text`) o una lista de líneas con tono (`lines`). El tono no pinta el texto (por contraste), sino que marca un canto del color a la izquierda de la línea. Con `maxHeight` el bloque desplaza adentro y es tabulable; con `follow` se mantiene pegado al final mientras llegan líneas, salvo que el usuario haya subido a leer.

### Props
- `text` (string) — Bloque de texto plano. Por defecto: `''`.
- `lines` (readonly CodeLine[]) — Lista de líneas con `text` y `tone` opcional (`'neutral'|'muted'|'info'|'success'|'warning'|'error'`). Por defecto: `[]`.
- `wrap` (boolean) — Parte las líneas largas. Sin `wrap`, las líneas quedan enteras y el bloque desplaza en horizontal. Por defecto: `true`.
- `maxHeight` (string | number) — Altura máxima CSS o en píxeles. Sin esto, crece con el contenido. Por defecto: `undefined`.
- `follow` (boolean) — Mantiene la vista pegada al final cuando llega contenido nuevo. Por defecto: `false`.
- `variant` (`'code'|'log'`) — `log` usa `role="log"` para anunciar lo nuevo sin interrumpir. Por defecto: `'code'`.
- `label` (string) — Nombre de la región para accesibilidad. Por defecto: `undefined`.

### Uso
```vue
<script setup lang="ts">
import CodeBlock from '../data/CodeBlock.vue'
</script>

<template>
  <CodeBlock
    :lines="[
      { text: 'Instalando paquetes…', tone: 'info' },
      { text: 'Listo', tone: 'success' },
    ]"
    variant="log"
    follow
    max-height="300px"
  />
</template>
```

### Notas
- `lines` tiene prioridad sobre `text`: si ambas están presentes, se muestran las líneas.
- Con `maxHeight` el bloque es tabulable (`tabindex="0"`) para leerlo con el teclado.
- `muted` atenúa el texto; los demás tonos solo cambian el canto izquierdo.
