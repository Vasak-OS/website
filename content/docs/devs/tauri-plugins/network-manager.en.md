---
title: "network-manager"
description: "Wi-Fi, VPN and network state through NetworkManager over D-Bus, with events as things change."
weight: 11
---

# `tauri-plugin-network-manager`

Manages the machine's network through NetworkManager, over D-Bus: scanning and
connecting Wi-Fi networks, reading the state of the active connection, turning
the wireless radio on and off, and creating, connecting and deleting VPN
profiles. It tells the frontend when the network or the VPN changes, so the panel
does not need to poll on a timer.

- **Crate:** `tauri-plugin-network-manager`
- **JS package:** `@vasakgroup/plugin-network-manager`
- **Platform:** Linux with NetworkManager on the system bus (D-Bus), zbus 4 and
  Rust 1.77.2 or newer

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-network-manager = { git = "https://github.com/Vasak-OS/tauri-plugin-network-manager" }
```

```bash
bun add @vasakgroup/plugin-network-manager
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_network_manager::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Permissions

`network-manager:default` enables state reads and the Wi-Fi operations:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["network-manager:default"]
}
```

The default set includes `get_network_state`, `list_wifi_networks`,
`rescan_wifi`, `connect_to_wifi`, `disconnect_from_wifi`,
`get_saved_wifi_networks`, `delete_wifi_connection`, `toggle_network_state`,
`get_wireless_enabled`, `set_wireless_enabled`, `is_wireless_available`,
`list_vpn_profiles` and `get_vpn_status`.

Statistics and interfaces are left out; they are enabled one by one:

```json
{
  "permissions": [
    "network-manager:allow-get-network-stats",
    "network-manager:allow-get-network-interfaces"
  ]
}
```

VPN mutations have their own set, `network-manager:vpn_management`, which
gathers `connect_vpn`, `disconnect_vpn`, `create_vpn_profile`,
`update_vpn_profile` and `delete_vpn_profile`:

```json
{
  "permissions": ["network-manager:default", "network-manager:vpn_management"]
}
```

Each of those five can also be enabled on its own, with
`network-manager:allow-connect-vpn`, `network-manager:allow-disconnect-vpn`,
`network-manager:allow-create-vpn-profile`,
`network-manager:allow-update-vpn-profile` and
`network-manager:allow-delete-vpn-profile`.

## JavaScript API

### `getCurrentNetworkState(): Promise<NetworkInfo>`

The connection carrying the default route, which is the one the panel describes:
`connection_type` comes from the device type (`"Ethernet"`, `"WiFi"`, `"Modem"`,
`"VPN"`, `"WireGuard"` or `"Unknown"`), and on Wi-Fi the SSID and security of the
active access point are added. `is_connected` is `true` only if the connection is
activated **and** NetworkManager reports full connectivity: being associated with
an access point that has no way out to the internet is reported as not
connected. With no connection at all it returns the default value
(`is_connected` in `false`, the IP in `0.0.0.0`, the icon
`network-offline-symbolic`) instead of failing.

### `listWifiNetworks(options?): Promise<NetworkInfo[]>`

Networks in range, deduplicated by SSID and sorted from strongest to weakest
signal. Each one carries `connection_type: "wifi"`, the detected security and an
icon matching the signal.

```typescript
const networks = await listWifiNetworks({ forceRefresh: true, ttlMs: 500 });
```

| Option | Type | Default | What it does |
|---|---|---|---|
| `forceRefresh` | `boolean` | `false` | Ignores the in-memory cache and asks again |
| `ttlMs` | `number` | `3000` | Cache lifetime, in milliseconds (clamped to 250–30000) |

### `rescanWifi(): Promise<NetworkInfo[]>`

Asks the wireless devices for a `RequestScan`, invalidates the cache and returns
the fresh list. With no wireless device at all it fails instead of returning an
empty list with no explanation.

### `connectToWifi(config): Promise<void>`

Accepts both shapes of the object: the frontend-friendly one (`securityType`) and
the one Rust expects (`security_type`). It builds the connection and activates it
with `AddAndActivateConnection`, letting NetworkManager pick the device.

| Value | How it is built | When |
|---|---|---|
| `none` | No security section | Open network |
| `wep` | `key-mgmt: none` and `wep-key0` | Static WEP |
| `wpa-psk` | `key-mgmt: wpa-psk` and `psk` | WPA1 |
| `wpa2-psk` | Same as `wpa-psk` plus `proto: rsn` | WPA2 |
| `wpa3-psk` | `key-mgmt: sae` and `psk` | WPA3 |
| `wpa-eap` | `key-mgmt: wpa-eap`, `identity` and `password` | Enterprise WPA |

`username` is the identity for `wpa-eap`; the others do not use it.

### `disconnectFromWifi(): Promise<void>`

Deactivates the active connection. With none active it does nothing and finishes
fine.

### `getSavedWifiNetworks(): Promise<NetworkInfo[]>`

The Wi-Fi networks saved in NetworkManager's configuration, with the connection
name in `name` and the SSID in `ssid`. Security is read from `key-mgmt`, which is
enough to tell open, `wpa-psk` and `wpa-eap` apart: a saved WPA2 network is
reported as `wpa-psk`. Since these are not networks in range, they arrive with
`signal_strength` at `0` and `is_connected` at `false`.

### `deleteWifiConnection(ssid): Promise<void>`

Deletes the first saved Wi-Fi connection whose SSID matches. If none is found it
throws an error instead of taking the deletion for granted.

### `toggleNetwork(enabled): Promise<void>`

Turns all networking on or off (`NetworkingEnabled`). The Rust command returns
the resulting state; the JavaScript function does not hand it over.

### `getWirelessEnabled(): Promise<boolean>`

Whether the Wi-Fi radio is on.

### `setWirelessEnabled(enabled): Promise<void>`

Turns the Wi-Fi radio on or off, without touching the other connections.

### `isWirelessAvailable(): Promise<boolean>`

Whether there is at least one wireless device in the machine. Useful to hide the
Wi-Fi section on a wired desktop.

### `getNetworkStats(): Promise<NetworkStats>`

Bandwidth of the active interface:

```typescript
interface NetworkStats {
  download_speed: number;      // bytes per second
  upload_speed: number;        // bytes per second
  total_downloaded: number;    // bytes
  total_uploaded: number;      // bytes
  connection_duration: number; // seconds
  interface: string;           // for example "wlan0"
}
```

### `getNetworkInterfaces(): Promise<string[]>`

The machine's network interface names, without `lo`.

### `listVpnProfiles(): Promise<VpnProfile[]>`

The saved VPN profiles, sorted by name. A VPN brought up by another application
is not in this list: it is not a NetworkManager connection.

### `getVpnStatus(): Promise<VpnStatus>`

The state of the active tunnel, with its IP, its gateway and the interface it
leaves through. With no tunnel it returns the default state (`disconnected`).
Two fields deserve attention:

- `interface` — the tunnel's interface (`sdwan0`, `tailscale0`, `wg0`…).
- `managed_externally` — its own application brought it up (Twingate, Tailscale,
  `wg-quick`) and not NetworkManager. It can be shown, but not connected or
  disconnected from the desktop: doing so would fight the program managing it.

### `connectVpn(uuid): Promise<void>`

Activates the profile by UUID. If that very profile is already connected it
throws `VPN_ALREADY_CONNECTED` instead of repeating the operation. It needs the
VPN management permission.

### `disconnectVpn(uuid?): Promise<void>`

Deactivates the given VPN; without `uuid`, the active one. It only works with the
tunnels NetworkManager manages: if there is none it throws `VPN_NOT_ACTIVE`, and
if the requested UUID is not active, `VPN_PROFILE_NOT_FOUND`. Another
application's tunnel (`managed_externally`) is not disconnected from here.

### `createVpnProfile(config): Promise<VpnProfile>`

Creates the profile in NetworkManager's configuration and returns its new UUID.
The `id` is required: blank, it throws `VPN_INVALID_CONFIG`.

### `updateVpnProfile(config): Promise<VpnProfile>`

Updates the profile by UUID. Only what arrives in the object is touched: the rest
of the connection's sections (IPv4, routes, DNS, permissions) are kept as they
were, and `settings` and `secrets` are merged with what was already there.

### `deleteVpnProfile(uuid): Promise<void>`

Deletes the profile by UUID. It needs the VPN management permission.

### Errors

Every function rejects with a `NetworkManagerError` carrying `code`, so there is
no need to read the message text:

```typescript
import { connectToWifi, NetworkManagerErrorCode, WiFiSecurityType } from "@vasakgroup/plugin-network-manager";

try {
  await connectToWifi({
    ssid: "Office",
    password: "…",
    securityType: WiFiSecurityType.WPA2_PSK,
  });
} catch (error) {
  const { code } = error as { code: NetworkManagerErrorCode };
  if (code === NetworkManagerErrorCode.CONNECTION_FAILED) {
    notify("Could not connect. Check the password.");
  } else if (code === NetworkManagerErrorCode.UNSUPPORTED_SECURITY) {
    notify("That security type is not supported.");
  }
}
```

The codes are `NOT_INITIALIZED`, `NO_CONNECTION`, `PERMISSION_DENIED`,
`UNSUPPORTED_SECURITY`, `CONNECTION_FAILED`, `NETWORK_NOT_FOUND`,
`OPERATION_FAILED`, `VPN_PROFILE_NOT_FOUND`, `VPN_ALREADY_CONNECTED`,
`VPN_AUTH_FAILED`, `VPN_INVALID_CONFIG`, `VPN_ACTIVATION_FAILED`,
`VPN_PLUGIN_UNAVAILABLE`, `VPN_NOT_ACTIVE` and `UNKNOWN`.

## Rust commands

- `get_network_state()` — State of the active connection.
- `list_wifi_networks(force_refresh, ttl_ms)` — Networks in range, with an
  optional cache (`ttl_ms` is clamped to 250–30000).
- `rescan_wifi()` — Explicit scan and fresh list.
- `connect_to_wifi(config)` — Connects with a `WiFiConnectionConfig`.
- `disconnect_from_wifi()` — Deactivates the active connection.
- `get_saved_wifi_networks()` — Saved Wi-Fi networks.
- `delete_wifi_connection(ssid)` — Deletes the saved connection for that SSID.
- `toggle_network_state(enabled)` — Turns all networking on or off; returns the
  resulting state.
- `get_wireless_enabled()` — Whether the Wi-Fi radio is on.
- `set_wireless_enabled(enabled)` — Turns the Wi-Fi radio on or off.
- `is_wireless_available()` — Whether there is any wireless device.
- `get_network_stats()` — Bandwidth of the active interface.
- `get_network_interfaces()` — Network interfaces, without `lo`.
- `list_vpn_profiles()` — Saved VPN profiles, sorted by name.
- `get_vpn_status()` — State of the active tunnel.
- `connect_vpn(uuid)` — Activates the profile by UUID.
- `disconnect_vpn(uuid)` — Deactivates the given VPN, or the active one when the
  argument is not passed.
- `create_vpn_profile(config)` — Creates the profile and returns its UUID.
- `update_vpn_profile(config)` — Updates the profile, keeping what is not touched.
- `delete_vpn_profile(uuid)` — Deletes the profile by UUID.

All of them run their work off the thread that calls them, so none of them
freezes the interface while NetworkManager answers.

## Events

| Event | When it fires | Payload |
|---|---|---|
| `network-changed` | NetworkManager changed state | `NetworkInfo` |
| `vpn-changed` | The tunnel's state changed | `VpnEventPayload` |
| `vpn-connected` | The tunnel moved to `connected` | `VpnEventPayload` |
| `vpn-disconnected` | The tunnel moved to `disconnected` | `VpnEventPayload` |
| `vpn-failed` | The tunnel ended in `failed` | `VpnEventPayload`, with `reason` |

```typescript
import { listen } from "@tauri-apps/api/event";
import type { NetworkInfo, VpnEventPayload } from "@vasakgroup/plugin-network-manager";

await listen<NetworkInfo>("network-changed", (event) => {
  const network = event.payload;
  console.log(network.is_connected ? `Connected to ${network.ssid}` : "Disconnected");
});

await listen<VpnEventPayload>("vpn-failed", (event) => {
  console.error("The VPN failed:", event.payload.reason);
});
```

## Example

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import {
  listWifiNetworks,
  connectToWifi,
  disconnectFromWifi,
  getCurrentNetworkState,
  getVpnStatus,
  type NetworkInfo,
  type VpnStatus,
} from "@vasakgroup/plugin-network-manager";

const networks = ref<NetworkInfo[]>([]);
const state = ref<NetworkInfo | null>(null);
const vpn = ref<VpnStatus | null>(null);
const password = ref("");
let unlisten: (() => void) | null = null;

async function refresh() {
  state.value = await getCurrentNetworkState();
  vpn.value = await getVpnStatus();
}

onMounted(async () => {
  await refresh();
  networks.value = await listWifiNetworks();
  unlisten = await listen("network-changed", refresh);
});

onUnmounted(() => unlisten?.());

async function connect(network: NetworkInfo) {
  await connectToWifi({
    ssid: network.ssid,
    password: password.value || undefined,
    securityType: network.security_type,
  });
  networks.value = await listWifiNetworks({ forceRefresh: true });
}
</script>

<template>
  <p>{{ state?.is_connected ? `Connected to ${state.ssid}` : "Disconnected" }}</p>

  <p v-if="vpn?.state === 'connected'">
    VPN {{ vpn.active_profile_name }}
    <span v-if="vpn.managed_externally">(managed by another application)</span>
  </p>

  <ul>
    <li v-for="network in networks" :key="network.ssid">
      {{ network.ssid }} — {{ network.signal_strength }}%
      <button v-if="!network.is_connected" @click="connect(network)">Connect</button>
    </li>
  </ul>

  <input v-model="password" type="password" placeholder="Password" />
  <button @click="disconnectFromWifi">Disconnect</button>
</template>
```

## Implementation details

- Everything goes through **zbus 4 in blocking mode** against the system bus.
  That is why every command runs its work with `spawn_blocking`: calling blocking
  zbus from a Tokio thread makes zbus try to start a runtime inside the one
  already driving that thread, and that does not fail with an error — it aborts
  the application. A synchronous command was no better either: it runs on the
  main thread, so every scan froze the interface.
- To describe the active connection it looks at the **default route**
  (`PrimaryConnection`), not the first item of the active connections list: that
  list has no order and also holds the loopback, a tunnel or a bridge, which made
  a laptop on Wi-Fi show the cable icon. And it is not enough for the connection
  to be activated: without full connectivity reported by NetworkManager, the
  connection is shown as not connected.
- Icons come from the signal: weak up to 25, fair up to 50, good up to 75 and
  excellent up to 100. Ethernet, modem, VPN and the rest have an icon of their
  own; what is not Wi-Fi is not drawn as a cable.
- The security of a network in range is detected first from the access point's
  `KeyMgmt` property and, when that is missing, from the `WpaFlags` and `RsnFlags`
  bits, with the privacy flags as a last resort: an encrypted network with no key
  management is reported as WEP.
- The Wi-Fi network list is cached in memory for **3 seconds** by default.
  `rescanWifi` invalidates the cache before asking for the scan.
- `getVpnStatus` is not limited to what NetworkManager files as `vpn`: it also
  sees the tunnels another application brought up (`tun`, `tap`, `ip-tunnel`,
  `wireguard`). When there is more than one, the one NetworkManager manages wins,
  since it is the only one that can also be connected and disconnected from the
  desktop. Known tunnels are shown with the product name —Twingate, Tailscale,
  NordVPN, Proton VPN, ZeroTier, WireGuard— and not with the interface's.
- Statistics are read from `/sys/class/net/<interface>/statistics`, without
  involving NetworkManager. The totals and the duration count from when the
  tracker started following that interface, not from when the machine connected,
  and the tracker restarts when the interface being measured changes.
- Events go through a **250-millisecond** window that coalesces back-to-back
  transitions into a single emission, and `vpn-changed` is not repeated when the
  state is the same as the previous time.
- The plugin logs with `env_logger` at `Info` level; `RUST_LOG=debug` adds the
  detail of the connection calls. To watch the D-Bus traffic,
  `busctl monitor org.freedesktop.NetworkManager`.
