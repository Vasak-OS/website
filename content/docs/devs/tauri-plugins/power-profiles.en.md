---
title: "power-profiles"
description: "Read and change the power profile (power-profiles-daemon) over D-Bus, reporting every change without polling the bus."
weight: 9
---

# `tauri-plugin-power-profiles`

Reads and changes the machine's power profile through `power-profiles-daemon`,
over D-Bus. What the frontend asks for comes from a copy the plugin keeps up to
date with the daemon's signals: nothing polls, and the selector learns about the
change even when another application or the daemon itself made it.

- **Crate:** `tauri-plugin-power-profiles`
- **JS package:** `@vasakgroup/plugin-power-profiles`
- **Platform:** Linux with `power-profiles-daemon` (system bus). Without the daemon the plugin still loads and the profile shows as **unavailable**.

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-power-profiles = { git = "https://github.com/Vasak-OS/tauri-plugin-power-profiles", branch = "main" }
```

```bash
bun add @vasakgroup/plugin-power-profiles
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_power_profiles::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Permissions

`power-profiles:default`, in the capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["power-profiles:default"]
}
```

That permission enables both commands. To keep just one, use
`power-profiles:allow-get-power-state` and `power-profiles:allow-set-power-profile`,
and to deny them, the matching `deny-` ones.

## JavaScript API

### `getPowerState(): Promise<PowerState>`

The state as the plugin holds it, without going to the bus. It does not fail
when the daemon is missing: in that case it returns `available: false`.

`PowerState` carries four fields:

| Field | Type | What it is |
|---|---|---|
| `available` | `boolean` | Whether `power-profiles-daemon` answers. False means "unavailable", not "broken". |
| `profiles` | `PowerProfile[]` | This machine's profiles, in the daemon's order. |
| `activeProfile` | `PowerProfile \| null` | The active profile. |
| `performanceDegraded` | `string \| null` | Why performance is limited (`lap-detected`, `high-operating-temperature`), or nothing when it is not. |

A `PowerProfile` is `'power-saver'`, `'balanced'` or `'performance'`, or whatever
text the machine offers: not every machine has all three. The TypeScript type
declares them and also accepts any other text, precisely for that reason.

### `setPowerProfile(profile): Promise<PowerState>`

Changes the active profile and returns the new state. It fails, and changes
nothing, when the profile is not one of the ones the machine offers
(`unknown power profile 'turbo'`) or when there is no daemon
(`power-profiles-daemon is not available`).

### `onPowerStateChanged(handler): Promise<UnlistenFn>`

Calls `handler` on every state change —the active profile, the profile list, the
degradation— and returns the function that stops listening. The event name is
exported as `POWER_STATE_EVENT`.

## Rust commands

- `get_power_state()` — The state the plugin holds in memory. It does not go to the bus. Without the daemon it returns `available: false` and that is not an error.
- `set_power_profile(profile)` — Changes the active profile and returns the new state. It rejects a profile the machine does not offer and fails when there is no daemon.

## Events

| Event | When it fires | Payload |
|---|---|---|
| `power-profile-changed` | Something in the state changed: the active profile, the profile list, the performance degradation, or the daemon appeared or went away | `PowerState` |

It fires **only when the state really changed**, so no repeated notice arrives
when the daemon's signal confirms the change the application has just asked for.
The notice also goes out when another application or the daemon itself made the
change, for instance when it limits performance because of temperature.

```typescript
import { listen } from "@tauri-apps/api/event";
import { POWER_STATE_EVENT } from "@vasakgroup/plugin-power-profiles";

await listen(POWER_STATE_EVENT, (event) => {
  // the payload is the whole PowerState
  console.log(event.payload.activeProfile);
});
```

## Example

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  getPowerState,
  setPowerProfile,
  onPowerStateChanged,
  type PowerProfile,
  type PowerState,
} from "@vasakgroup/plugin-power-profiles";

const state = ref<PowerState | null>(null);
let stopListening: (() => void) | null = null;

onMounted(async () => {
  state.value = await getPowerState();
  stopListening = await onPowerStateChanged((next) => (state.value = next));
});

onUnmounted(() => stopListening?.());

async function change(profile: PowerProfile) {
  state.value = await setPowerProfile(profile);
}
</script>

<template>
  <select
    v-if="state?.available"
    :value="state.activeProfile"
    @change="change(($event.target as HTMLSelectElement).value as PowerProfile)"
  >
    <option v-for="profile in state.profiles" :key="profile" :value="profile">
      {{ profile }}
    </option>
  </select>

  <p v-else>The power profile is not available on this machine.</p>
</template>
```

## Implementation details

- A single `GetAll` read at startup; after that, only signals:
  `PropertiesChanged` on the daemon's object and `NameOwnerChanged` to learn
  whether it appears or goes away. In between there is no polling at all.
- The daemon has two possible names and they are tried in order:
  `org.freedesktop.UPower.PowerProfiles` (path
  `/org/freedesktop/UPower/PowerProfiles`) and the older
  `net.hadess.PowerProfiles` (path `/net/hadess/PowerProfiles`). The new one
  comes first, so the plugin keeps working the day the old one is retired.
- The signal subscriptions are set up **before** the first read: the other way
  round, a change arriving between the read and the subscription would be lost
  without warning.
- The bus connection opens in the background after `setup`, not during it: the
  application window does not wait for the daemon.
- `set_power_profile` applies the change to the copy before the daemon's signal
  arrives, so the line after the call already sees the new profile. If the
  signal arrives later, it finds nothing different and does not emit a second
  notice.
- If the daemon goes away —or the bus connection drops— the copy becomes
  unavailable and the event is emitted, instead of showing the last profile as
  if it were still true.
- From Rust, the application can use the `PowerProfilesExt` trait and
  `app.power_profiles()`, with its `state()` and `set_profile()` methods.
- Errors reach the frontend as text: `power-profiles-daemon is not available`,
  `unknown power profile 'turbo'`, `D-Bus error: …`.
- It uses `zbus` without the default features, to take the tokio executor Tauri
  already runs instead of pulling `async-io` as a second copy: the same choice
  `vasak-settings` makes.
