---
title: "Layout | ConfigSection"
weight: 50
---

# `ConfigSection`

Descripción
- Componente contenedor para secciones de configuración: título, icono y contenido agrupado.

Props
- `title` (string) — Título de la sección. **Requerido**.
- `icon` (string) — Texto o símbolo a mostrar junto al título. Por defecto: `''`.
- `customClass` (string | Record<string, boolean>) — Clases adicionales.

Slots
- Default — Contenido de la sección (controles, descripciones, etc.).

Uso
```vue
<script setup lang="ts">
import ConfigSection from '../layout/ConfigSection.vue'
</script>

<template>
  <ConfigSection title="Red" icon="🌐">
    <div class="grid gap-2">
      <!-- controles -->
    </div>
  </ConfigSection>
</template>
```

