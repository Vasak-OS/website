---
title: "Diseño | SettingRow"
weight: 104
description: "SettingRow: fila de ajuste — etiqueta y descripción a la izquierda, control a la derecha, adaptable."
---

# `SettingRow`

### Descripción
- Una fila de ajuste: etiqueta y descripción a la izquierda, el control a la derecha. Se apila en contenedores angostos (desde 256 px el control va a la derecha). Con `controlId` la etiqueta apunta al control correspondiente.

### Props
- `label` (string) — El nombre del ajuste. **Requerido**.
- `description` (string) — El texto de ayuda debajo de la etiqueta.
- `controlId` (string) — El `id` del control de la ranura. Con esto la etiqueta lo nombra.
- `disabled` (boolean) — Atenúa toda la fila y la marca como deshabilitada. Por defecto: `false`.

### Uso
```vue
<script setup lang="ts">
import SettingRow from '../layout/SettingRow.vue'
import SwitchToggle from '../controls/SwitchToggle.vue'
</script>

<template>
  <SettingRow
    label="Notificaciones"
    description="Mostrar avisos del sistema"
    control-id="switch-notificaciones"
  >
    <SwitchToggle id="switch-notificaciones" />
  </SettingRow>
</template>
```

### Notas
- La ranura por defecto recibe `labelId` y `descriptionId` para el control que prefiera `aria-labelledby` y `aria-describedby`.
- Las ranuras `leading` y `footer` permiten un icono al costado o contenido debajo de la fila.
