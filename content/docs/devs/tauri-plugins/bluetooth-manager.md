---
title: "bluetooth-manager"
description: "Adaptadores, emparejamiento y conexión de dispositivos Bluetooth por BlueZ, con aviso de cada cambio y sin sondear el bus."
weight: 10
---

# `tauri-plugin-bluetooth-manager`

Administra los adaptadores y los dispositivos Bluetooth del equipo a través de
BlueZ, por D-Bus: encender el adaptador, escanear, emparejar, conectar y
desconectar. Una sola consulta al arrancar y, después, sólo señales: lo que la
interfaz muestra se pone al día sola, aunque el cambio lo haya hecho otra
aplicación o el propio BlueZ.

- **Crate:** `tauri-plugin-bluetooth-manager`
- **Paquete JS:** `@vasakgroup/plugin-bluetooth-manager`
- **Plataforma:** Linux con BlueZ (bus del sistema). Sin BlueZ el plugin carga igual, `bluetooth_plugin_status` devuelve `false` y los comandos fallan.

## Instalación

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

## Permisos

Los identificadores llevan guion medio, y cada comando tiene el suyo más su
`deny-` correspondiente. Se listan en el archivo de capacidades:

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

El plugin no publica un conjunto `default` utilizable —su lista interna nombra
los permisos con guion bajo y los identificadores reales llevan guion medio—,
así que la lista va completa, como arriba. Sólo hacen falta los permisos de los
comandos que la aplicación use: `bluetooth-manager:allow-list-adapters`, por
ejemplo, deja listar adaptadores y nada más.

## API de JavaScript

Cada función envuelve un comando del plugin. Las de comando rechazan con el
mensaje de BlueZ como texto (`D-Bus error: …`); las ayudas de más abajo atrapan
ese error y devuelven un valor por omisión, según dice cada una.

### `listAdapters(): Promise<AdapterInfo[]>`

Todos los adaptadores del equipo. La lista viene vacía si no hay ninguno.

### `setAdapterPowered(adapterPath: string, powered: boolean): Promise<void>`

Enciende (`true`) o apaga (`false`) el adaptador. Apagarlo corta las conexiones
que tenga.

### `getAdapterState(adapterPath: string): Promise<AdapterInfo>`

El adaptador leído en el momento, sin esperar señales. Si la aplicación lo usa,
necesita `bluetooth-manager:allow-get-adapter-state`.

### `startScan(adapterPath: string): Promise<void>`

Arranca el descubrimiento de dispositivos en el adaptador. Si ya había un
escaneo en curso, no falla: lo da por bueno.

### `stopScan(adapterPath: string): Promise<void>`

Detiene el descubrimiento. Si no había ninguno, tampoco falla.

### `listDevices(adapterPath: string): Promise<DeviceInfo[]>`

Los dispositivos conocidos del adaptador —vistos, emparejados o conectados—, en
el momento de la llamada.

### `getDeviceInfo(devicePath: string): Promise<DeviceInfo>`

Un dispositivo leído en el momento, por su ruta de objeto en el bus
(`/org/bluez/hci0/dev_AA_BB_CC_DD_EE_FF`), incluida la batería si la publica.

### `listPairedDevices(adapterPath: string): Promise<DeviceInfo[]>`

Sólo los que están emparejados. Es un filtro de `listDevices`.

### `connectDevice(devicePath: string): Promise<void>`

Conecta el dispositivo. Si ya estaba conectado o la conexión estaba en curso, no
falla.

### `disconnectDevice(devicePath: string): Promise<void>`

Desconecta el dispositivo. Si ya estaba desconectado, no falla.

### `isBluetoothPluginInitialized(): Promise<boolean>`

Si el plugin pudo hablar con BlueZ al arrancar. Es el mismo dato que
`bluetooth_plugin_status`.

Además de las anteriores, el paquete trae ayudas que combinan esas llamadas:

### `isBluetoothAvailable(): Promise<boolean>`

Si hay al menos un adaptador. Ante un error devuelve `false`.

### `getDefaultAdapter(): Promise<AdapterInfo | null>`

El primer adaptador de la lista, o `null` si no hay ninguno. Ante un error
devuelve `null`.

### `isBluetoothEnabled(): Promise<boolean>`

Si el adaptador por omisión está encendido. `false` si no hay adaptador o si la
consulta falla.

### `toggleBluetooth(): Promise<boolean>`

Invierte el estado del adaptador por omisión y devuelve el estado nuevo. Falla
si no hay adaptador: para encenderlo hace falta uno.

### `getConnectedDevicesCount(adapterPath: string): Promise<number>`

Cuántos dispositivos del adaptador están conectados. Ante un error devuelve
`0`.

### `getConnectedDevices(adapterPath: string): Promise<DeviceInfo[]>`

Los dispositivos conectados del adaptador. Ante un error devuelve una lista
vacía.

### `getAvailableDevices(adapterPath: string): Promise<DeviceInfo[]>`

Los que no están conectados. Ante un error devuelve una lista vacía.

### `findDeviceByAddress(adapterPath: string, address: string): Promise<DeviceInfo | null>`

Busca por dirección MAC, sin distinguir mayúsculas. `null` si no está.

### `scanForDevices(adapterPath: string, timeoutMs = 10000): Promise<DeviceInfo[]>`

Escanea, espera `timeoutMs` (diez segundos por omisión), detiene el escaneo y
devuelve la lista. Detiene el escaneo también si algo falla en el medio.

### `AdapterInfo`

Lo que describe un adaptador:

| Campo | Tipo | Qué es |
|---|---|---|
| `path` | `string` | Ruta del objeto en el bus, por ejemplo `/org/bluez/hci0`. Es lo que reciben los comandos. |
| `address` | `string` | Dirección MAC del adaptador. |
| `name` | `string` | Nombre del adaptador, que fija el sistema (`hci0`). |
| `alias` | `string` | Nombre visible, que puede cambiar quien usa el equipo. |
| `class` | `number` | Clase de dispositivo, según Bluetooth SIG. |
| `powered` | `boolean` | Si el adaptador está encendido. |
| `discoverable` | `boolean` | Si el equipo se deja ver por otros. |
| `discoverableTimeout` | `number` | Cuántos segundos dura el modo visible. |
| `pairable` | `boolean` | Si acepta emparejamientos. |
| `pairableTimeout` | `number` | Cuántos segundos dura el modo emparejable. |
| `discovering` | `boolean` | Si hay un escaneo en curso. |
| `uuids` | `string[]` | Los servicios que el adaptador anuncia. |
| `modalias?` | `string` | El identificador del hardware, si BlueZ lo publica. |

### `DeviceInfo`

Lo que describe un dispositivo. Los campos con `?` pueden faltar, y faltar no es
lo mismo que venir vacíos:

| Campo | Tipo | Qué es |
|---|---|---|
| `path` | `string` | Ruta del objeto en el bus. Es lo que reciben `connectDevice` y `disconnectDevice`. |
| `address` | `string` | Dirección MAC. |
| `name?` | `string` | Nombre que anuncia el dispositivo. |
| `alias?` | `string` | Nombre con el que se lo conoce en el equipo; lo puede cambiar quien lo usa. |
| `class?` | `number` | Clase de dispositivo, según Bluetooth SIG. |
| `appearance?` | `number` | Aspecto declarado, un código de Bluetooth SIG. |
| `icon?` | `string` | Nombre de icono sugerido por BlueZ (`audio-headset`, `input-mouse`). |
| `paired` | `boolean` | Si está emparejado. |
| `trusted` | `boolean` | Si está marcado como de confianza. |
| `blocked` | `boolean` | Si está bloqueado. |
| `legacyPairing` | `boolean` | Si usa el emparejamiento viejo (PIN). |
| `rssi?` | `number` | Potencia de la señal recibida, en dBm. |
| `txPower?` | `number` | Potencia de transmisión anunciada, en dBm. |
| `connected` | `boolean` | Si está conectado ahora. |
| `uuids` | `string[]` | Los servicios que anuncia. |
| `adapter` | `string` | Ruta del adaptador al que pertenece. |
| `servicesResolved` | `boolean` | Si BlueZ ya terminó de resolver sus servicios. Mientras sea `false`, la lista de `uuids` puede estar incompleta. |
| `battery?` | `number` | Batería en porcentaje (0–100). Sólo lo que la publique; ausente no es cero, es «no lo sé». |
| `manufacturer?` | `string` | Fabricante, deducido de `manufacturerData` contra la tabla de identificadores de Bluetooth SIG. |
| `manufacturerData?` | `Record<string, number[]>` | Los datos crudos del fabricante: identificador → bytes. |
| `serviceData?` | `Record<string, number[]>` | Los datos crudos de servicios: UUID → bytes. |
| `modalias?` | `string` | El identificador del hardware, si lo publica. |

## Comandos Rust

Los comandos que expone el plugin; el paquete de JavaScript envuelve cada uno.
Menos `bluetooth_plugin_status`, todos leen o escriben BlueZ:

- `list_adapters()` — Los adaptadores de la máquina.
- `set_adapter_powered(adapter_path, powered)` — Enciende o apaga el adaptador.
- `get_adapter_state(adapter_path)` — El adaptador leído en el momento.
- `start_scan(adapter_path)` — Arranca el descubrimiento de dispositivos.
- `stop_scan(adapter_path)` — Detiene el descubrimiento.
- `list_devices(adapter_path)` — Los dispositivos conocidos del adaptador.
- `list_paired_devices(adapter_path)` — Sólo los emparejados.
- `get_device_info(device_path)` — Un dispositivo leído en el momento.
- `connect_device(device_path)` — Conecta el dispositivo.
- `disconnect_device(device_path)` — Desconecta el dispositivo.
- `bluetooth_plugin_status()` — Si el plugin pudo inicializarse.

## Eventos

Todo lo que pasa en BlueZ llega al frontend por un solo evento, `bluetooth-change`,
con un `data` distinto según el caso:

| Evento | Cuándo se emite | Carga |
|---|---|---|
| `bluetooth-change` | Cambió algo en los adaptadores o los dispositivos, o el plugin no pudo leer o decodificar una señal | `BluetoothChange` |

El payload trae `changeType` y, además, `change_type` con el mismo valor: el
nombre viejo queda por compatibilidad con las aplicaciones que lo leían hasta la
2.1, está marcado como obsoleto a favor de `changeType` y se va en la próxima
versión mayor. `data` lleva el objeto o el dato suelto:

| `changeType` | Cuándo | `data` |
|---|---|---|
| `adapter-added` | Apareció un adaptador | `AdapterInfo` |
| `adapter-removed` | Se fue un adaptador | `{ path }` |
| `adapter-property-changed` | Cambió una propiedad del adaptador: encendido, visible, nombre | `AdapterInfo` releído |
| `device-added` | Apareció un dispositivo | `DeviceInfo` |
| `device-removed` | Se fue un dispositivo | `{ path }` |
| `device-connected` | Un dispositivo se conectó | `DeviceInfo`; `{ path, connected: true }` si no se pudo releer |
| `device-disconnected` | Un dispositivo se desconectó | `DeviceInfo`; `{ path }` si no se pudo releer |
| `device-property-changed` | Cambió una propiedad del dispositivo: señal, batería, nombre, emparejamiento | `DeviceInfo` releído |
| `error` | El plugin no pudo leer o decodificar algo | `{ message }` |
| `dbus-error` | Se cortó la conexión con el bus | `{ message }` |

El paquete exporta los nombres en `BluetoothChangeType`, para no escribirlos a
mano:

```typescript
import { listen } from "@tauri-apps/api/event";
import { BluetoothChangeType, listDevices } from "@vasakgroup/plugin-bluetooth-manager";

await listen("bluetooth-change", async (evento) => {
  const cambio = evento.payload;
  if (
    cambio.changeType === BluetoothChangeType.DEVICE_ADDED ||
    cambio.changeType === BluetoothChangeType.DEVICE_REMOVED
  ) {
    // volver a dibujar la lista de dispositivos
  }
});
```

## Ejemplo

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

const adaptador = ref<AdapterInfo | null>(null);
const dispositivos = ref<DeviceInfo[]>([]);
const buscando = ref(false);
let dejarDeEscuchar: (() => void) | null = null;

async function recargar() {
  if (!adaptador.value) return;
  dispositivos.value = await listDevices(adaptador.value.path);
}

onMounted(async () => {
  adaptador.value = (await listAdapters())[0] ?? null;
  await recargar();

  dejarDeEscuchar = await listen("bluetooth-change", async (evento) => {
    const tipo = evento.payload.changeType;
    if (tipo === BluetoothChangeType.ADAPTER_PROPERTY_CHANGED) {
      adaptador.value = (await listAdapters())[0] ?? null;
    } else if (tipo.startsWith("device-")) {
      await recargar();
    }
  });
});

onUnmounted(() => dejarDeEscuchar?.());

async function buscar() {
  if (!adaptador.value) return;
  buscando.value = true;
  try {
    dispositivos.value = await scanForDevices(adaptador.value.path, 10000);
  } finally {
    buscando.value = false;
  }
}
</script>

<template>
  <p v-if="!adaptador">Este equipo no tiene Bluetooth.</p>

  <template v-else>
    <button @click="toggleBluetooth()">
      {{ adaptador.powered ? "Apagar" : "Encender" }}
    </button>
    <button :disabled="buscando" @click="buscar">
      {{ buscando ? "Buscando…" : "Buscar dispositivos" }}
    </button>

    <ul>
      <li v-for="dispositivo in dispositivos" :key="dispositivo.path">
        {{ dispositivo.alias ?? dispositivo.address }}
        <span v-if="dispositivo.connected"> · conectado</span>
      </li>
    </ul>
  </template>
</template>
```

## Detalles de implementación

- El plugin abre una sola conexión con el bus del sistema y la guarda en su
  estado. `start_scan` y `stop_scan` la reutilizan en vez de abrir la propia,
  porque BlueZ ata el descubrimiento al cliente que lo pidió: con una conexión
  que se cierra al terminar la llamada, el escaneo arrancaba y moría al instante.
- Antes de arrancar el escaneo fija `SetDiscoveryFilter` con `Transport=auto`,
  para cubrir tanto Bluetooth clásico como de bajo consumo. Si el adaptador no
  acepta el filtro, sigue con el que tenga por omisión en vez de abortar.
- Los cambios de un dispositivo se avisan a lo sumo uno cada medio segundo, por
  dispositivo. No se descarta lo que llega dentro de la ventana: se pospone, así
  que el último valor nunca se pierde. Las claves `Connected`, `Paired`,
  `Trusted`, `Blocked`, `Name` y `Alias` se avisan en el acto, sin esperar.
- La batería se pide aparte (`org.bluez.Battery1`). Los dispositivos que no la
  publican hacen que BlueZ conteste con un error, y el plugin lo traga: el campo
  queda ausente en vez de romper la lectura. Lo mismo vale para
  `manufacturerData`, `serviceData` y `modalias`, que se omiten cuando faltan.
- La inicialización espera a BlueZ durante el `setup` del plugin. Si BlueZ no
  está, la aplicación abre igual: el error va al registro, `bluetooth_plugin_status`
  devuelve `false` y los comandos fallan con el mensaje del bus.
- Deja un registro en `~/.logs/vasak/bluetooth.log`, además de la salida estándar.
  Si el archivo no se puede abrir —un `HOME` de sólo lectura, por ejemplo—, el
  plugin no se cae: sigue registrando sólo por la salida estándar y lo avisa.
- El registro propio no pisa el del anfitrión: instala sólo el suscriptor de
  `tracing` y deja libre el puente de `log`, que es de la aplicación.
- Desde Rust, la aplicación llega al estado del plugin con el trait
  `BluetoothManagerExt` y `app.bluetooth_manager()`.
- Los errores llegan al frontend como texto, con el mensaje de BlueZ tal cual
  (`D-Bus error: …`).
