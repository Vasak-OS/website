---
title: "network-manager"
description: "Wi-Fi, VPN y el estado de la red vía NetworkManager sobre D-Bus, con eventos cuando algo cambia."
weight: 11
---

# `tauri-plugin-network-manager`

Administra la red del equipo a través de NetworkManager, por D-Bus: escanear y
conectar redes Wi-Fi, leer el estado de la conexión activa, prender y apagar el
radio inalámbrico y crear, conectar y borrar perfiles de VPN. Avisa al frontend
cuando la red o la VPN cambian, así que el panel no necesita preguntar en un
temporizador.

- **Crate:** `tauri-plugin-network-manager`
- **Paquete JS:** `@vasakgroup/plugin-network-manager`
- **Plataforma:** Linux con NetworkManager en el bus de sistema (D-Bus), zbus 4
  y Rust 1.77.2 o superior

## Instalación

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

## Permisos

`network-manager:default` habilita la lectura del estado y las operaciones de
Wi-Fi:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["network-manager:default"]
}
```

El conjunto por omisión incluye `get_network_state`, `list_wifi_networks`,
`rescan_wifi`, `connect_to_wifi`, `disconnect_from_wifi`,
`get_saved_wifi_networks`, `delete_wifi_connection`, `toggle_network_state`,
`get_wireless_enabled`, `set_wireless_enabled`, `is_wireless_available`,
`list_vpn_profiles` y `get_vpn_status`.

Quedan afuera las estadísticas y las interfaces, que se habilitan una por una:

```json
{
  "permissions": [
    "network-manager:allow-get-network-stats",
    "network-manager:allow-get-network-interfaces"
  ]
}
```

Para modificar VPN está el conjunto `network-manager:vpn_management`, que junta
`connect_vpn`, `disconnect_vpn`, `create_vpn_profile`, `update_vpn_profile` y
`delete_vpn_profile`:

```json
{
  "permissions": ["network-manager:default", "network-manager:vpn_management"]
}
```

Cada una de esas cinco también se puede habilitar suelta, con
`network-manager:allow-connect-vpn`, `network-manager:allow-disconnect-vpn`,
`network-manager:allow-create-vpn-profile`,
`network-manager:allow-update-vpn-profile` y
`network-manager:allow-delete-vpn-profile`.

## API de JavaScript

### `getCurrentNetworkState(): Promise<NetworkInfo>`

La conexión que lleva la ruta por omisión, que es la que describe el panel:
`connection_type` sale del tipo de dispositivo (`"Ethernet"`, `"WiFi"`,
`"Modem"`, `"VPN"`, `"WireGuard"` o `"Unknown"`), y en Wi-Fi se agregan el SSID
y la seguridad del punto de acceso activo. `is_connected` es `true` sólo si la
conexión está activada **y** NetworkManager informa conectividad completa: estar
asociado a un punto de acceso sin salida a internet se informa como no
conectado. Si no hay ninguna conexión, devuelve el valor por omisión
(`is_connected` en `false`, la IP en `0.0.0.0`, el ícono
`network-offline-symbolic`) en vez de fallar.

### `listWifiNetworks(options?): Promise<NetworkInfo[]>`

Redes al alcance, deduplicadas por SSID y ordenadas de mayor a menor señal.
Cada una trae `connection_type: "wifi"`, la seguridad detectada y un ícono
acorde a la señal.

```typescript
const redes = await listWifiNetworks({ forceRefresh: true, ttlMs: 500 });
```

| Opción | Tipo | Por omisión | Qué hace |
|---|---|---|---|
| `forceRefresh` | `boolean` | `false` | Ignora la caché en memoria y vuelve a preguntar |
| `ttlMs` | `number` | `3000` | Vida de la caché, en milisegundos (se limita a 250–30000) |

### `rescanWifi(): Promise<NetworkInfo[]>`

Pide un `RequestScan` a los dispositivos inalámbricos, invalida la caché y
devuelve la lista fresca. Si no hay ningún dispositivo inalámbrico, falla en vez
de devolver una lista vacía sin explicación.

### `connectToWifi(config): Promise<void>`

Acepta las dos formas del objeto: la cómoda para el frontend (`securityType`) y
la que espera Rust (`security_type`). Arma la conexión y la activa con
`AddAndActivateConnection`, dejando que NetworkManager elija el dispositivo.

| Valor | Cómo se arma | Cuándo |
|---|---|---|
| `none` | Sin sección de seguridad | Red abierta |
| `wep` | `key-mgmt: none` y `wep-key0` | WEP estático |
| `wpa-psk` | `key-mgmt: wpa-psk` y `psk` | WPA1 |
| `wpa2-psk` | Igual que `wpa-psk` más `proto: rsn` | WPA2 |
| `wpa3-psk` | `key-mgmt: sae` y `psk` | WPA3 |
| `wpa-eap` | `key-mgmt: wpa-eap`, `identity` y `password` | WPA empresarial |

`username` es la identidad para `wpa-eap`; con las demás no se usa.

### `disconnectFromWifi(): Promise<void>`

Desactiva la conexión activa. Si no hay ninguna, no hace nada y termina bien.

### `getSavedWifiNetworks(): Promise<NetworkInfo[]>`

Las redes Wi-Fi guardadas en la configuración de NetworkManager, con el nombre
de la conexión en `name` y el SSID en `ssid`. La seguridad se lee de
`key-mgmt`, que alcanza para distinguir abierta, `wpa-psk` y `wpa-eap`: una red
WPA2 guardada se informa como `wpa-psk`. Como no son redes al alcance, llegan
con `signal_strength` en `0` e `is_connected` en `false`.

### `deleteWifiConnection(ssid): Promise<void>`

Borra la primera conexión Wi-Fi guardada cuyo SSID coincida. Si no encuentra
ninguna, lanza un error en vez de dar por hecho el borrado.

### `toggleNetwork(enabled): Promise<void>`

Prende o apaga toda la red (`NetworkingEnabled`). El comando de Rust devuelve el
estado resultante; la función de JavaScript no lo entrega.

### `getWirelessEnabled(): Promise<boolean>`

Si el radio Wi-Fi está prendido.

### `setWirelessEnabled(enabled): Promise<void>`

Prende o apaga el radio Wi-Fi, sin tocar el resto de las conexiones.

### `isWirelessAvailable(): Promise<boolean>`

Si hay al menos un dispositivo inalámbrico en el equipo. Sirve para esconder la
sección de Wi-Fi en una máquina de escritorio cableada.

### `getNetworkStats(): Promise<NetworkStats>`

Ancho de banda de la interfaz activa:

```typescript
interface NetworkStats {
  download_speed: number;      // bytes por segundo
  upload_speed: number;        // bytes por segundo
  total_downloaded: number;    // bytes
  total_uploaded: number;      // bytes
  connection_duration: number; // segundos
  interface: string;           // por ejemplo "wlan0"
}
```

### `getNetworkInterfaces(): Promise<string[]>`

Los nombres de las interfaces de red del equipo, sin `lo`.

### `listVpnProfiles(): Promise<VpnProfile[]>`

Los perfiles de VPN guardados, ordenados por nombre. La VPN que levantó otra
aplicación no está en esta lista: no es una conexión de NetworkManager.

### `getVpnStatus(): Promise<VpnStatus>`

El estado del túnel activo, con su IP, su puerta de enlace y la interfaz por la
que sale. Sin túnel, devuelve el estado por omisión (`disconnected`). Dos
campos merecen atención:

- `interface` — la interfaz del túnel (`sdwan0`, `tailscale0`, `wg0`…).
- `managed_externally` — lo levantó su propia aplicación (Twingate, Tailscale,
  `wg-quick`) y no NetworkManager. Se puede mostrar, pero no conectar ni
  desconectar desde el escritorio: eso pelearía con el programa que la
  administra.

### `connectVpn(uuid): Promise<void>`

Activa el perfil por UUID. Si ya está conectado ese mismo perfil, lanza el
error `VPN_ALREADY_CONNECTED` en vez de repetir la operación. Necesita el
permiso de gestión de VPN.

### `disconnectVpn(uuid?): Promise<void>`

Desactiva la VPN indicada; sin `uuid`, la que esté activa. Sólo puede con los
túneles que administra NetworkManager: si no hay ninguno, lanza
`VPN_NOT_ACTIVE`, y si el UUID pedido no está activo, `VPN_PROFILE_NOT_FOUND`.
El túnel de otra aplicación (`managed_externally`) no se desconecta desde acá.

### `createVpnProfile(config): Promise<VpnProfile>`

Crea el perfil en la configuración de NetworkManager y devuelve su UUID nuevo.
El `id` es obligatorio: en blanco, lanza `VPN_INVALID_CONFIG`.

### `updateVpnProfile(config): Promise<VpnProfile>`

Actualiza el perfil por UUID. Sólo se toca lo que venga en el objeto: el resto
de las secciones de la conexión (IPv4, rutas, DNS, permisos) se conservan tal
como estaban, y `settings` y `secrets` se mezclan con lo que ya había.

### `deleteVpnProfile(uuid): Promise<void>`

Borra el perfil por UUID. Necesita el permiso de gestión de VPN.

### Errores

Todas las funciones rechazan con un `NetworkManagerError` que trae `code` para
no tener que mirar el texto del mensaje:

```typescript
import { connectToWifi, NetworkManagerErrorCode, WiFiSecurityType } from "@vasakgroup/plugin-network-manager";

try {
  await connectToWifi({
    ssid: "Oficina",
    password: "…",
    securityType: WiFiSecurityType.WPA2_PSK,
  });
} catch (error) {
  const { code } = error as { code: NetworkManagerErrorCode };
  if (code === NetworkManagerErrorCode.CONNECTION_FAILED) {
    avisar("No se pudo conectar. Revisa la contraseña.");
  } else if (code === NetworkManagerErrorCode.UNSUPPORTED_SECURITY) {
    avisar("Ese tipo de seguridad no está soportado.");
  }
}
```

Los códigos son `NOT_INITIALIZED`, `NO_CONNECTION`, `PERMISSION_DENIED`,
`UNSUPPORTED_SECURITY`, `CONNECTION_FAILED`, `NETWORK_NOT_FOUND`,
`OPERATION_FAILED`, `VPN_PROFILE_NOT_FOUND`, `VPN_ALREADY_CONNECTED`,
`VPN_AUTH_FAILED`, `VPN_INVALID_CONFIG`, `VPN_ACTIVATION_FAILED`,
`VPN_PLUGIN_UNAVAILABLE`, `VPN_NOT_ACTIVE` y `UNKNOWN`.

## Comandos Rust

- `get_network_state()` — Estado de la conexión activa.
- `list_wifi_networks(force_refresh, ttl_ms)` — Redes al alcance, con caché
  opcional (`ttl_ms` se limita a 250–30000).
- `rescan_wifi()` — Escaneo explícito y lista fresca.
- `connect_to_wifi(config)` — Conecta con `WiFiConnectionConfig`.
- `disconnect_from_wifi()` — Desactiva la conexión activa.
- `get_saved_wifi_networks()` — Redes Wi-Fi guardadas.
- `delete_wifi_connection(ssid)` — Borra la conexión guardada de ese SSID.
- `toggle_network_state(enabled)` — Prende o apaga toda la red; devuelve el
  estado resultante.
- `get_wireless_enabled()` — Si el radio Wi-Fi está prendido.
- `set_wireless_enabled(enabled)` — Prende o apaga el radio Wi-Fi.
- `is_wireless_available()` — Si hay algún dispositivo inalámbrico.
- `get_network_stats()` — Ancho de banda de la interfaz activa.
- `get_network_interfaces()` — Interfaces de red, sin `lo`.
- `list_vpn_profiles()` — Perfiles de VPN guardados, ordenados por nombre.
- `get_vpn_status()` — Estado del túnel activo.
- `connect_vpn(uuid)` — Activa el perfil por UUID.
- `disconnect_vpn(uuid)` — Desactiva la VPN indicada, o la activa si el
  argumento no viene.
- `create_vpn_profile(config)` — Crea el perfil y devuelve su UUID.
- `update_vpn_profile(config)` — Actualiza el perfil conservando lo que no se
  toca.
- `delete_vpn_profile(uuid)` — Borra el perfil por UUID.

Todos corren su trabajo fuera del hilo que los llama, así que ninguno congela la
interfaz mientras NetworkManager responde.

## Eventos

| Evento | Cuándo se emite | Carga |
|---|---|---|
| `network-changed` | NetworkManager cambió de estado | `NetworkInfo` |
| `vpn-changed` | Cambió el estado del túnel | `VpnEventPayload` |
| `vpn-connected` | El túnel pasó a `connected` | `VpnEventPayload` |
| `vpn-disconnected` | El túnel pasó a `disconnected` | `VpnEventPayload` |
| `vpn-failed` | El túnel quedó en `failed` | `VpnEventPayload`, con `reason` |

```typescript
import { listen } from "@tauri-apps/api/event";
import type { NetworkInfo, VpnEventPayload } from "@vasakgroup/plugin-network-manager";

await listen<NetworkInfo>("network-changed", (evento) => {
  const red = evento.payload;
  console.log(red.is_connected ? `Conectado a ${red.ssid}` : "Sin conexión");
});

await listen<VpnEventPayload>("vpn-failed", (evento) => {
  console.error("La VPN falló:", evento.payload.reason);
});
```

## Ejemplo

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

const redes = ref<NetworkInfo[]>([]);
const estado = ref<NetworkInfo | null>(null);
const vpn = ref<VpnStatus | null>(null);
const clave = ref("");
let desuscribir: (() => void) | null = null;

async function refrescar() {
  estado.value = await getCurrentNetworkState();
  vpn.value = await getVpnStatus();
}

onMounted(async () => {
  await refrescar();
  redes.value = await listWifiNetworks();
  desuscribir = await listen("network-changed", refrescar);
});

onUnmounted(() => desuscribir?.());

async function conectar(red: NetworkInfo) {
  await connectToWifi({
    ssid: red.ssid,
    password: clave.value || undefined,
    securityType: red.security_type,
  });
  redes.value = await listWifiNetworks({ forceRefresh: true });
}
</script>

<template>
  <p>{{ estado?.is_connected ? `Conectado a ${estado.ssid}` : "Sin conexión" }}</p>

  <p v-if="vpn?.state === 'connected'">
    VPN {{ vpn.active_profile_name }}
    <span v-if="vpn.managed_externally">(la administra otra aplicación)</span>
  </p>

  <ul>
    <li v-for="red in redes" :key="red.ssid">
      {{ red.ssid }} — {{ red.signal_strength }}%
      <button v-if="!red.is_connected" @click="conectar(red)">Conectar</button>
    </li>
  </ul>

  <input v-model="clave" type="password" placeholder="Contraseña" />
  <button @click="disconnectFromWifi">Desconectar</button>
</template>
```

## Detalles de implementación

- Todo pasa por **zbus 4 en modo bloqueante** contra el bus de sistema. Por eso
  cada comando corre su trabajo con `spawn_blocking`: llamar a zbus bloqueante
  desde un hilo de Tokio hace que zbus intente levantar un runtime dentro del
  que ya está manejando ese hilo, y eso no falla con un error sino que aborta la
  aplicación. Un comando síncrono tampoco servía: corre en el hilo principal y
  cada escaneo congelaba la interfaz.
- Para describir la conexión activa se mira la **ruta por omisión**
  (`PrimaryConnection`), no el primer elemento de la lista de conexiones
  activas: esa lista no tiene orden y contiene también el loopback, un túnel o
  un puente, lo que hacía mostrar el ícono de cable en una notebook por Wi-Fi.
  Y no alcanza con que la conexión esté activada: sin conectividad completa
  informada por NetworkManager, la conexión se muestra como no conectada.
- Los íconos salen de la señal: débil hasta 25, aceptable hasta 50, buena hasta
  75 y excelente hasta 100. Ethernet, módem, VPN y el resto tienen su propio
  ícono; lo que no es Wi-Fi no se dibuja como cable.
- La seguridad de una red al alcance se detecta primero por la propiedad
  `KeyMgmt` del punto de acceso y, si no está, por los bits de `WpaFlags` y
  `RsnFlags`, con los flags de privacidad como último recurso: una red cifrada
  sin gestión de claves se informa como WEP.
- La lista de redes Wi-Fi se cachea en memoria **3 segundos** por omisión.
  `rescanWifi` invalida la caché antes de pedir el escaneo.
- `getVpnStatus` no se limita a lo que NetworkManager archiva como `vpn`:
  también ve los túneles que levantó otra aplicación (`tun`, `tap`,
  `ip-tunnel`, `wireguard`). Cuando hay más de uno, gana el que administra
  NetworkManager, que es el único que además se puede conectar y desconectar
  desde el escritorio. Los túneles conocidos se muestran con el nombre del
  producto —Twingate, Tailscale, NordVPN, Proton VPN, ZeroTier, WireGuard— y no
  con el de la interfaz.
- Las estadísticas se leen de `/sys/class/net/<interfaz>/statistics`, sin
  involucrar a NetworkManager. Los totales y la duración cuentan desde que el
  contador arrancó a seguir esa interfaz, no desde que el equipo se conectó, y
  el contador se reinicia cuando cambia la interfaz que se está midiendo.
- Los eventos pasan por una ventana de **250 milisegundos** que junta las
  transiciones seguidas en una sola emisión, y `vpn-changed` no se repite si el
  estado es el mismo que la vez anterior.
- El plugin registra con `env_logger` a nivel `Info`; `RUST_LOG=debug` agrega el
  detalle de las llamadas de conexión. Para mirar el tráfico D-Bus,
  `busctl monitor org.freedesktop.NetworkManager`.
