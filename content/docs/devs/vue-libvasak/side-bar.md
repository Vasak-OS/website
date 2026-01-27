---
title: "Barra lateral | SideBar"
weight: 55
---

# `SideBar`

Descripción
- Contenedor lateral simple que renderiza su slot. Útil como wrapper para botones de navegación o acciones.

Props
- Ninguna específica.

Slots
- Default — Contenido del sidebar (por ejemplo varios `SideButton`).

Uso
```vue
<script setup lang="ts">
import SideBar from '../sidebar/SideBar.vue'
import SideButton from '../sidebar/SideButton.vue'
</script>

<template>
  <SideBar>
    <SideButton image="/icons/home.svg" title="Inicio" />
    <SideButton image="/icons/settings.svg" title="Ajustes" />
  </SideBar>
</template>
```

