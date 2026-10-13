---
title: "bluetooth-manager"
description: "Bluetooth adapters, pairing and connection through BlueZ, with a notification for every change and no bus polling."
weight: 10
---

# `tauri-plugin-bluetooth-manager`

Manages the machine's Bluetooth adapters and devices through BlueZ, over D-Bus:
powering the adapter on, scanning, pairing, connecting and disconnecting. One
read at startup and, after that, only signals: whatever the interface shows
brings itself up to date, even when the change came from another application or
from BlueZ itself.

- **Crate:** `tauri-plugin-bluetooth-manager`
- **JS package:** `@vasakgroup/plugin-bluetooth-manager`
- **Platform:** Linux with BlueZ (system bus). Without BlueZ the plugin still loads, `bluetooth_plugin_status` returns `false` and the commands fail.

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-bluetooth-manager = { git = "https://github.com/Vasak-OS/tauri-plugin-bluetooth-manager", branch = "main" }
```

```bash
bun add @vasakgroup/plugin-bluetooth-manager
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_bluetooth_manager::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Permissions

Identifiers use a hyphen, and each command has its own plus the matching
`deny-`. They are listed in the capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "permissions": [
    "bluetooth-manager:allow-list-adapters",
    "bluetooth-manager:allow-set-adapter-powered",
    "bluetooth-manager:allow-get-adapter-state",
    "bluetooth-manager:allow-start-scan",
    "bluetooth-manager:allow-stop-scan",
    "bluetooth-manager:allow-list-devices",
    "bluetooth-manager:allow-list-paired-devices",
    "bluetooth-manager:allow-get-device-info",
    "bluetooth-manager:allow-connect-device",
    "bluetooth-manager:allow-disconnect-device",
    "bluetooth-manager:allow-bluetooth-plugin-status"
  ]
}
```

The plugin does not ship a usable `default` set —its internal list names the
permissions with underscores and the real identifiers use a hyphen—, so the list
goes in full, as above. Only the permissions of the commands the application uses
are needed: `bluetooth-manager:allow-list-adapters`, for instance, allows listing
adapters and nothing else.

## JavaScript API

Each function wraps one of the plugin's commands. The command ones reject with
BlueZ's message as text (`D-Bus error: …`); the helpers further down catch that
error and return a default value, as each one says.

### `listAdapters(): Promise<AdapterInfo[]>`

Every adapter on the machine. The list is empty when there is none.

### `setAdapterPowered(adapterPath: string, powered: boolean): Promise<void>`

Powers the adapter on (`true`) or off (`false`). Turning it off drops whatever
connections it has.

### `getAdapterState(adapterPath: string): Promise<AdapterInfo>`

The adapter read at that moment, without waiting for signals. If the application
uses it, it needs `bluetooth-manager:allow-get-adapter-state`.

### `startScan(adapterPath: string): Promise<void>`

Starts device discovery on the adapter. If a scan was already running it does
not fail: it takes it as good.

### `stopScan(adapterPath: string): Promise<void>`

Stops discovery. If none was running, it does not fail either.

### `listDevices(adapterPath: string): Promise<DeviceInfo[]>`

The adapter's known devices —seen, paired or connected— at the moment of the
call.

### `getDeviceInfo(devicePath: string): Promise<DeviceInfo>`

One device read at that moment, by its object path on the bus
(`/org/bluez/hci0/dev_AA_BB_CC_DD_EE_FF`), including the battery when it
publishes one.

### `listPairedDevices(adapterPath: string): Promise<DeviceInfo[]>`

Only the paired ones. It is a filter over `listDevices`.

### `connectDevice(devicePath: string): Promise<void>`

Connects the device. If it was already connected or the connection was under
way, it does not fail.

### `disconnectDevice(devicePath: string): Promise<void>`

Disconnects the device. If it was already disconnected, it does not fail.

### `isBluetoothPluginInitialized(): Promise<boolean>`

Whether the plugin could talk to BlueZ at startup. It is the same datum as
`bluetooth_plugin_status`.

Besides the above, the package brings helpers that combine those calls:

### `isBluetoothAvailable(): Promise<boolean>`

Whether there is at least one adapter. On an error it returns `false`.

### `getDefaultAdapter(): Promise<AdapterInfo | null>`

The first adapter in the list, or `null` when there is none. On an error it
returns `null`.

### `isBluetoothEnabled(): Promise<boolean>`

Whether the default adapter is powered on. `false` when there is no adapter or
the query fails.

### `toggleBluetooth(): Promise<boolean>`

Flips the default adapter's state and returns the new state. It fails when there
is no adapter: powering it on needs one.

### `getConnectedDevicesCount(adapterPath: string): Promise<number>`

How many of the adapter's devices are connected. On an error it returns `0`.

### `getConnectedDevices(adapterPath: string): Promise<DeviceInfo[]>`

The adapter's connected devices. On an error it returns an empty list.

### `getAvailableDevices(adapterPath: string): Promise<DeviceInfo[]>`

The ones that are not connected. On an error it returns an empty list.

### `findDeviceByAddress(adapterPath: string, address: string): Promise<DeviceInfo | null>`

Looks up by MAC address, case-insensitively. `null` when it is not there.

### `scanForDevices(adapterPath: string, timeoutMs = 10000): Promise<DeviceInfo[]>`

Scans, waits `timeoutMs` (ten seconds by default), stops the scan and returns
the list. It stops the scan when something fails along the way too.

### `AdapterInfo`

What describes an adapter:

| Field | Type | What it is |
|---|---|---|
| `path` | `string` | Object path on the bus, for example `/org/bluez/hci0`. It is what the commands receive. |
| `address` | `string` | The adapter's MAC address. |
| `name` | `string` | The adapter's name, set by the system (`hci0`). |
| `alias` | `string` | The visible name, which whoever uses the machine can change. |
| `class` | `number` | Device class, per Bluetooth SIG. |
| `powered` | `boolean` | Whether the adapter is powered on. |
| `discoverable` | `boolean` | Whether the machine lets itself be seen by others. |
| `discoverableTimeout` | `number` | How many seconds the visible mode lasts. |
| `pairable` | `boolean` | Whether it accepts pairings. |
| `pairableTimeout` | `number` | How many seconds the pairable mode lasts. |
| `discovering` | `boolean` | Whether a scan is running. |
| `uuids` | `string[]` | The services the adapter announces. |
| `modalias?` | `string` | The hardware identifier, when BlueZ publishes it. |

### `DeviceInfo`

What describes a device. Fields with `?` may be missing, and missing is not the
same as coming empty:

| Field | Type | What it is |
|---|---|---|
| `path` | `string` | Object path on the bus. It is what `connectDevice` and `disconnectDevice` receive. |
| `address` | `string` | MAC address. |
| `name?` | `string` | The name the device announces. |
| `alias?` | `string` | The name it is known by on the machine; whoever uses it can change it. |
| `class?` | `number` | Device class, per Bluetooth SIG. |
| `appearance?` | `number` | The declared appearance, a Bluetooth SIG code. |
| `icon?` | `string` | Icon name suggested by BlueZ (`audio-headset`, `input-mouse`). |
| `paired` | `boolean` | Whether it is paired. |
| `trusted` | `boolean` | Whether it is marked as trusted. |
| `blocked` | `boolean` | Whether it is blocked. |
| `legacyPairing` | `boolean` | Whether it uses the old pairing (PIN). |
| `rssi?` | `number` | Received signal strength, in dBm. |
| `txPower?` | `number` | Announced transmit power, in dBm. |
| `connected` | `boolean` | Whether it is connected now. |
| `uuids` | `string[]` | The services it announces. |
| `adapter` | `string` | Path of the adapter it belongs to. |
| `servicesResolved` | `boolean` | Whether BlueZ has finished resolving its services. While it is `false`, the `uuids` list may be incomplete. |
| `battery?` | `number` | Battery as a percentage (0–100). Only for devices that publish it; missing is not zero, it is "I don't know". |
| `manufacturer?` | `string` | Manufacturer, derived from `manufacturerData` against the Bluetooth SIG identifier table. |
| `manufacturerData?` | `Record<string, number[]>` | The manufacturer's raw data: identifier → bytes. |
| `serviceData?` | `Record<string, number[]>` | The raw service data: UUID → bytes. |
| `modalias?` | `string` | The hardware identifier, when it publishes one. |

## Rust commands

The commands the plugin exposes; the JavaScript package wraps each one. Except
for `bluetooth_plugin_status`, they all read or write BlueZ:

- `list_adapters()` — The machine's adapters.
- `set_adapter_powered(adapter_path, powered)` — Powers the adapter on or off.
- `get_adapter_state(adapter_path)` — The adapter read at that moment.
- `start_scan(adapter_path)` — Starts device discovery.
- `stop_scan(adapter_path)` — Stops discovery.
- `list_devices(adapter_path)` — The adapter's known devices.
- `list_paired_devices(adapter_path)` — Only the paired ones.
- `get_device_info(device_path)` — One device read at that moment.
- `connect_device(device_path)` — Connects the device.
- `disconnect_device(device_path)` — Disconnects the device.
- `bluetooth_plugin_status()` — Whether the plugin could initialize.

## Events

Everything that happens in BlueZ reaches the frontend through a single event,
`bluetooth-change`, with a different `data` depending on the case:

| Event | When it is emitted | Payload |
|---|---|---|
| `bluetooth-change` | Something changed in the adapters or the devices, or the plugin could not read or decode a signal | `BluetoothChange` |

The payload carries `changeType` and, in addition, `change_type` with the same
value: the old name stays for compatibility with applications that read it up to
2.1, is marked as deprecated in favor of `changeType` and goes away in the next
major version. `data` carries the object or the loose datum:

| `changeType` | When | `data` |
|---|---|---|
| `adapter-added` | An adapter appeared | `AdapterInfo` |
| `adapter-removed` | An adapter went away | `{ path }` |
| `adapter-property-changed` | An adapter property changed: powered, visible, name | Re-read `AdapterInfo` |
| `device-added` | A device appeared | `DeviceInfo` |
| `device-removed` | A device went away | `{ path }` |
| `device-connected` | A device connected | `DeviceInfo`; `{ path, connected: true }` when it could not be re-read |
| `device-disconnected` | A device disconnected | `DeviceInfo`; `{ path }` when it could not be re-read |
| `device-property-changed` | A device property changed: signal, battery, name, pairing | Re-read `DeviceInfo` |
| `error` | The plugin could not read or decode something | `{ message }` |
| `dbus-error` | The connection to the bus dropped | `{ message }` |

The package exports the names in `BluetoothChangeType`, so they do not have to
be written by hand:

```typescript
import { listen } from "@tauri-apps/api/event";
import { BluetoothChangeType, listDevices } from "@vasakgroup/plugin-bluetooth-manager";

await listen("bluetooth-change", async (event) => {
  const change = event.payload;
  if (
    change.changeType === BluetoothChangeType.DEVICE_ADDED ||
    change.changeType === BluetoothChangeType.DEVICE_REMOVED
  ) {
    // redraw the device list
  }
});
```

## Example

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { listen } from "@tauri-apps/api/event";
import {
  listAdapters,
  listDevices,
  scanForDevices,
  toggleBluetooth,
  BluetoothChangeType,
  type AdapterInfo,
  type DeviceInfo,
} from "@vasakgroup/plugin-bluetooth-manager";

const adapter = ref<AdapterInfo | null>(null);
const devices = ref<DeviceInfo[]>([]);
const scanning = ref(false);
let stopListening: (() => void) | null = null;

async function reload() {
  if (!adapter.value) return;
  devices.value = await listDevices(adapter.value.path);
}

onMounted(async () => {
  adapter.value = (await listAdapters())[0] ?? null;
  await reload();

  stopListening = await listen("bluetooth-change", async (event) => {
    const kind = event.payload.changeType;
    if (kind === BluetoothChangeType.ADAPTER_PROPERTY_CHANGED) {
      adapter.value = (await listAdapters())[0] ?? null;
    } else if (kind.startsWith("device-")) {
      await reload();
    }
  });
});

onUnmounted(() => stopListening?.());

async function search() {
  if (!adapter.value) return;
  scanning.value = true;
  try {
    devices.value = await scanForDevices(adapter.value.path, 10000);
  } finally {
    scanning.value = false;
  }
}
</script>

<template>
  <p v-if="!adapter">This machine has no Bluetooth.</p>

  <template v-else>
    <button @click="toggleBluetooth()">
      {{ adapter.powered ? "Turn off" : "Turn on" }}
    </button>
    <button :disabled="scanning" @click="search">
      {{ scanning ? "Searching…" : "Search for devices" }}
    </button>

    <ul>
      <li v-for="device in devices" :key="device.path">
        {{ device.alias ?? device.address }}
        <span v-if="device.connected"> · connected</span>
      </li>
    </ul>
  </template>
</template>
```

## Implementation details

- The plugin opens a single connection to the system bus and keeps it in its
  state. `start_scan` and `stop_scan` reuse it instead of opening their own,
  because BlueZ ties discovery to the client that asked for it: with a
  connection that closes when the call returns, the scan started and died at
  once.
- Before starting the scan it sets `SetDiscoveryFilter` with `Transport=auto`,
  so it covers both classic and low-energy Bluetooth. If the adapter does not
  accept the filter, it goes on with whatever default it has instead of
  aborting.
- Changes to a device are announced at most once every half second, per device.
  What arrives inside the window is not discarded: it is postponed, so the last
  value is never lost. The keys `Connected`, `Paired`, `Trusted`, `Blocked`,
  `Name` and `Alias` are announced right away, without waiting.
- The battery is asked for separately (`org.bluez.Battery1`). Devices that do
  not publish one make BlueZ answer with an error, and the plugin swallows it:
  the field ends up missing instead of breaking the read. The same holds for
  `manufacturerData`, `serviceData` and `modalias`, which are omitted when
  absent.
- Initialization waits for BlueZ during the plugin's `setup`. If BlueZ is not
  there, the application opens anyway: the error goes to the log,
  `bluetooth_plugin_status` returns `false` and the commands fail with the bus
  message.
- It leaves a log at `~/.logs/vasak/bluetooth.log`, in addition to standard
  output. If the file cannot be opened —a read-only `HOME`, for instance— the
  plugin does not crash: it keeps logging to standard output only and says so.
- Its own log does not override the host's: it installs only the `tracing`
  subscriber and leaves the `log` bridge free, which belongs to the
  application.
- From Rust, the application reaches the plugin's state through the
  `BluetoothManagerExt` trait and `app.bluetooth_manager()`.
- Errors reach the frontend as text, with BlueZ's message as-is
  (`D-Bus error: …`).
