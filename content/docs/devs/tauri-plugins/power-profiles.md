---
title: "power-profiles"
description: "Leer y cambiar el perfil de energía (power-profiles-daemon) por D-Bus, avisando de cada cambio sin sondear el bus."
weight: 9
---

# `tauri-plugin-power-profiles`

Lee y cambia el perfil de energía del equipo a través de `power-profiles-daemon`,
por D-Bus. Lo que el frontend pregunta sale de una copia que el plugin mantiene
al día con las señales del demonio: nada sondea, y el selector se entera del
cambio aunque lo haya hecho otra aplicación o el demonio mismo.

- **Crate:** `tauri-plugin-power-profiles`
- **Paquete JS:** `@vasakgroup/plugin-power-profiles`
- **Plataforma:** Linux con `power-profiles-daemon` (bus del sistema). Sin el demonio el plugin carga igual y el perfil queda **no disponible**.

## Instalación

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

## Permisos

`power-profiles:default`, en el archivo de capacidades:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["power-profiles:default"]
}
```

Ese permiso habilita los dos comandos. Para dejar sólo uno se usan
`power-profiles:allow-get-power-state` y `power-profiles:allow-set-power-profile`,
y para negarlos, los `deny-` correspondientes.

## API de JavaScript

### `getPowerState(): Promise<PowerState>`

El estado tal como lo tiene el plugin, sin ir al bus. No falla por falta de
demonio: en ese caso devuelve `available: false`.

`PowerState` trae cuatro campos:

| Campo | Tipo | Qué es |
|---|---|---|
| `available` | `boolean` | Si `power-profiles-daemon` contesta. Falso es «no disponible», no «roto». |
| `profiles` | `PowerProfile[]` | Los perfiles de este equipo, en el orden del demonio. |
| `activeProfile` | `PowerProfile \| null` | El perfil activo. |
| `performanceDegraded` | `string \| null` | Por qué el rendimiento está limitado (`lap-detected`, `high-operating-temperature`), o nada si no lo está. |

Un `PowerProfile` es `'power-saver'`, `'balanced'` o `'performance'`, o el texto
que ofrezca el equipo: no todos tienen los tres. El tipo de TypeScript los
declara y además admite cualquier otro texto, justamente por eso.

### `setPowerProfile(profile): Promise<PowerState>`

Cambia el perfil activo y devuelve el estado nuevo. Falla, y no cambia nada, si
el perfil no es uno de los que ofrece el equipo
(`unknown power profile 'turbo'`) o si no hay demonio
(`power-profiles-daemon is not available`).

### `onPowerStateChanged(handler): Promise<UnlistenFn>`

Llama a `handler` con cada cambio del estado —el perfil activo, la lista de
perfiles, la degradación— y devuelve la función que deja de escuchar. El nombre
del evento está exportado como `POWER_STATE_EVENT`.

## Comandos Rust

- `get_power_state()` — El estado que el plugin tiene en memoria. No va al bus. Sin demonio devuelve `available: false` y no es un error.
- `set_power_profile(profile)` — Cambia el perfil activo y devuelve el estado nuevo. Rechaza un perfil que el equipo no ofrece y falla si no hay demonio.

## Eventos

| Evento | Cuándo se emite | Carga |
|---|---|---|
| `power-profile-changed` | Cambió algo del estado: el perfil activo, la lista de perfiles, la degradación del rendimiento, o el demonio apareció o se fue | `PowerState` |

Se emite **sólo cuando el estado cambió de verdad**, así que no llega un aviso
repetido cuando la señal del demonio confirma el cambio que acaba de pedir la
propia aplicación. El aviso también sale cuando el cambio lo hizo otra
aplicación o el demonio mismo, por ejemplo al limitar el rendimiento por
temperatura.

```typescript
import { listen } from "@tauri-apps/api/event";
import { POWER_STATE_EVENT } from "@vasakgroup/plugin-power-profiles";

await listen(POWER_STATE_EVENT, (evento) => {
  // el payload es el PowerState completo
  console.log(evento.payload.activeProfile);
});
```

## Ejemplo

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

const estado = ref<PowerState | null>(null);
let dejarDeEscuchar: (() => void) | null = null;

onMounted(async () => {
  estado.value = await getPowerState();
  dejarDeEscuchar = await onPowerStateChanged((nuevo) => (estado.value = nuevo));
});

onUnmounted(() => dejarDeEscuchar?.());

async function cambiar(perfil: PowerProfile) {
  estado.value = await setPowerProfile(perfil);
}
</script>

<template>
  <select
    v-if="estado?.available"
    :value="estado.activeProfile"
    @change="cambiar(($event.target as HTMLSelectElement).value as PowerProfile)"
  >
    <option v-for="perfil in estado.profiles" :key="perfil" :value="perfil">
      {{ perfil }}
    </option>
  </select>

  <p v-else>El perfil de energía no está disponible en este equipo.</p>
</template>
```

## Detalles de implementación

- Una sola lectura `GetAll` al arrancar; después, sólo señales: `PropertiesChanged`
  del objeto del demonio y `NameOwnerChanged` para enterarse de si aparece o se
  va. Entre medio no hay ningún sondeo.
- El demonio tiene dos nombres posibles y se prueban en orden:
  `org.freedesktop.UPower.PowerProfiles` (ruta
  `/org/freedesktop/UPower/PowerProfiles`) y el viejo `net.hadess.PowerProfiles`
  (ruta `/net/hadess/PowerProfiles`). El nuevo va primero, para que el plugin
  siga funcionando el día que el viejo se retire.
- Las suscripciones a las señales se hacen **antes** de la primera lectura: al
  revés, un cambio que llegara entre la lectura y la suscripción se perdería sin
  aviso.
- La conexión con el bus se abre en segundo plano después del `setup`, no
  durante: la ventana de la aplicación no espera al demonio.
- `set_power_profile` aplica el cambio a la copia antes de que llegue la señal
  del demonio, así que la línea siguiente a la llamada ya ve el perfil nuevo. Si
  la señal llega después, no encuentra nada distinto y no emite un segundo aviso.
- Si el demonio se va —o se cae la conexión con el bus— la copia pasa a no
  disponible y se emite el evento, en vez de seguir mostrando el último perfil
  como si siguiera siendo cierto.
- Desde Rust, la aplicación puede usar el trait `PowerProfilesExt` y
  `app.power_profiles()`, con sus métodos `state()` y `set_profile()`.
- Los errores llegan al frontend como texto: `power-profiles-daemon is not
  available`, `unknown power profile 'turbo'`, `D-Bus error: …`.
- Usa `zbus` sin las características por omisión, para tomar el ejecutor tokio
  que ya corre Tauri en lugar de traer `async-io` como segunda copia: la misma
  elección que hace `vasak-settings`.
