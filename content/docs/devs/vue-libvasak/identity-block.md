---
title: "Identity | IdentityBlock"
weight: 198
description: "Bloque de identidad con avatar, nombre, subtítulo y ranuras personalizables."
---

# `IdentityBlock`

### Descripción
- Bloque de identidad: avatar, nombre y una línea debajo, con ranuras para detalles y elementos adicionales.

### Props
- `title` (string) — Nombre o título principal. **Requerido**.
- `subtitle` (string) — Subtítulo o descripción corta.
- `src` (string | null) — Ruta de la imagen de avatar. Por defecto: `null`.
- `name` (string) — Nombre para las iniciales del avatar, si no es `title`.
- `size` (AvatarSize) — Tamaño del avatar. Por defecto: `'lg'`.
- `as` (`'p' | 'h1' | 'h2' | 'h3'`) — Elemento HTML para el título. Por defecto: `'p'`.
- `wrap` (boolean) — Partir el texto en vez de cortarlo. Por defecto: `false`.
- `stack` (`'never' | 'always' | 'narrow'`) — Forma apilada: nunca, siempre o cuando el contenedor es angosto. Por defecto: `'never'`.

### Uso
```vue
<script setup lang="ts">
import IdentityBlock from '../identity/IdentityBlock.vue'
</script>

<template>
  <IdentityBlock
    title="Ana García"
    subtitle="Diseñadora"
    src="/avatars/ana.jpg"
    size="lg"
    as="h1"
  >
    <template #trailing>
      <button>Editar</button>
    </template>
  </IdentityBlock>
</template>
```

### Notas
- Con `stack="narrow"` el bloque se apila automáticamente por debajo de 20 rem de ancho.
- La ranura `details` va debajo del subtítulo para contenido adicional como insignias o enlaces.
