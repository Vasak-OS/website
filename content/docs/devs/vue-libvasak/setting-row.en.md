---
title: "Layout | SettingRow"
weight: 104
description: "SettingRow: settings row — label and description on the left, control on the right, responsive."
---

# `SettingRow`

### Description
- A settings row: label and description on the left, the control on the right. It stacks in narrow containers (from 256 px the control sits to the right). With `controlId` the label points to the matching control.

### Props
- `label` (string) — The name of the setting. **Required**.
- `description` (string) — The help text below the label.
- `controlId` (string) — The `id` of the slot control. With it the label names the control.
- `disabled` (boolean) — Dims the whole row and marks it as disabled. Default: `false`.

### Usage
```vue
<script setup lang="ts">
import SettingRow from '../layout/SettingRow.vue'
import SwitchToggle from '../controls/SwitchToggle.vue'
</script>

<template>
  <SettingRow
    label="Notifications"
    description="Show system alerts"
    control-id="switch-notifications"
  >
    <SwitchToggle id="switch-notifications" />
  </SettingRow>
</template>
```

### Notes
- The default slot receives `labelId` and `descriptionId` for controls that prefer `aria-labelledby` and `aria-describedby`.
- The `leading` and `footer` slots allow a side icon or content below the row.
