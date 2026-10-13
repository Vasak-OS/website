---
title: "Layout | PageHeader"
weight: 68
description: "PageHeader: page header with section, title, description, icon, and actions."
---

# `PageHeader`

### Description
- The header of a page: the section it belongs to, the title, a description, and the page actions.
- Adapts by the width of the header, not the screen: from 448 px actions go to the right; narrower, below.

### Props
- `title` (string) — Page title. **Required**.
- `eyebrow` (string) — Small line above with the section the page belongs to.
- `description` (string) — Description of the page content.
- `icon` (string) — Theme icon name, in a box on the left.
- `iconType` (`'icon'|'symbol'`) — Theme icon variant. Defaults to: `'icon'`.
- `size` (`'md'|'lg'`) — Title size. Defaults to: `'md'`.
- `as` (`'h1'|'h2'`) — Heading level. A page has a single `h1`. Defaults to: `'h1'`.

### Usage
```vue
<script setup lang="ts">
import PageHeader from '../layout/PageHeader.vue'
import ActionButton from '../controls/ActionButton.vue'
</script>

<template>
  <PageHeader
    title="General"
    eyebrow="Settings"
    description="General system settings."
    icon="settings"
  >
    <template #actions>
      <ActionButton label="Reset" variant="secondary" />
    </template>
  </PageHeader>
</template>
```
