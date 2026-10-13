---
title: "Sidebar | SideGroup"
weight: 212
description: "Sidebar item group with collapsible title and forced expansion when the sidebar is collapsed."
---

# `SideGroup`

### Description
- Groups sidebar items under a collapsible title. When the sidebar is collapsed, the title is hidden and the group opens automatically so content is not hidden.

### Props
- `title` (string) — Group title. **Required**.
- `collapsed` (boolean) — Whether the sidebar is collapsed; forces the group open. Default: `false`.
- `defaultOpen` (boolean) — Whether the group starts open. Default: `true`.

### Usage
```vue
<script setup lang="ts">
import SideGroup from '../sidebar/SideGroup.vue'
</script>

<template>
  <SideGroup title="Navigation">
    <!-- Group items -->
  </SideGroup>
</template>
```

### Notes
- The title is visually hidden when `collapsed` is `true`, but content stays accessible.
