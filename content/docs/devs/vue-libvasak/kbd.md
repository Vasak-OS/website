---
title: "Texto | Kbd"
weight: 90
description: "Kbd: representa una tecla o combinación de teclas con un `<kbd>` semántico y separadores legibles."
---

# `Kbd`

### Descripción
- Componente que dibuja una tecla o una combinación de teclas (`Ctrl` `+` `S`) usando un `<kbd>` HTML real, con un `<kbd>` por tecla dentro de uno que las agrupa, como recomienda el estándar.

### Props
- `keys` (`readonly string[]`) — Las teclas de la combinación, ya traducidas («Ctrl», «Mayús»). Por defecto: `[]`.
- `label` (string) — Texto alternativo que se lee en voz alta en lugar de la combinación, si unirla con «+» no alcanza.

### Uso
```vue
<script setup lang="ts">
import Kbd from '../text/Kbd.vue'
</script>

<template>
  <!-- Combinación con `keys` -->
  <Kbd :keys="['Ctrl', 'S']" />

  <!-- Una sola tecla pasada por la ranura -->
  <Kbd label="Abrir el lanzador">Super</Kbd>
</template>
```

### Notas
- Con `keys` la combinación se dibuja separada por `+`, que un lector de pantalla lee («Ctrl más S»).
- Con `label` presente, ese texto va escondido a la vista (`sr-only`) y lo dibujado se anuncia como decorativo.
- Sin `keys` el contenido se toma de la ranura por defecto.
