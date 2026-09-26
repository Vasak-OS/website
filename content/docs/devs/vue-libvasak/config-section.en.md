---
title: "Layout | ConfigSection"
weight: 50
---

# `ConfigSection`

Description
- Container component for configuration sections: title, icon and grouped content.

Props
- `title` (string) — Section title. **Required**.
- `icon` (string) — Text or symbol shown next to the title. Default: `''`.
- `customClass` (string | Record<string, boolean>) — Additional classes.

Slots
- Default — Section content (controls, descriptions, etc.).

Usage
```vue
<script setup lang="ts">
import ConfigSection from '../layout/ConfigSection.vue'
</script>

<template>
  <ConfigSection title="Network" icon="🌐">
    <div class="grid gap-2">
      <!-- controls -->
    </div>
  </ConfigSection>
</template>
```
