---
title: "vsk-store"
description: "El cliente del almacén del sistema: comprobar quién es el sincronizador antes de creerle, pedir una vuelta, leer el estado y escuchar los avisos."
weight: 12
---

# `tauri-plugin-vsk-store`

El cliente del **almacén del sistema** de VasakOS. `vasak-accounts-sync` mantiene
en segundo plano una base cifrada por cuenta con el correo, el calendario y los
contactos, y la publica en el bus de sesión como `ar.net.vasak.os.AccountsStore`.
Las aplicaciones leen de ahí sin esperar a la red, y este plugin es la única forma
en que lo hacen.

- **Crate:** `tauri-plugin-vsk-store`
- **Paquete JS:** `@vasakgroup/plugin-vsk-store`
- **Plataforma:** Linux con el bus de sesión; sin el sincronizador el plugin carga
  igual y todo queda **no disponible**, nunca roto

## Qué hace el plugin

- **Comprueba quién tiene el nombre del sincronizador antes de creerle nada.** El
  bus de sesión deja que cualquier proceso tome un nombre libre: si el
  sincronizador no arrancó o se está reiniciando, otro programa de la sesión
  podría hacerse pasar por él y mostrar correo, eventos o contactos inventados
  bajo la cuenta real de la persona (`vasak-accounts#77`). El plugin exige que el
  dueño ejecute **el mismo archivo** que `/usr/bin/vasak-accounts-sync`, en los
  mismos espacios de nombres que la aplicación y sin variables del cargador, y
  desde ahí habla **sólo con ese dueño**, por su nombre único. Si el nombre cambia
  de dueño, vuelve a comprobar.
- **«Actualizar»**: le pide al sincronizador una vuelta y dice a qué cuentas no se
  les pudo pedir y por qué.
- **El estado de la sincronización** de un área de cada cuenta.
- **Los avisos**: los cambios del almacén, juntando los de una misma vuelta, y los
  del estado, pasados a la ventana como eventos.

Es una primera capa, no un límite completo: un programa del mismo usuario todavía
puede pasarla por otros caminos. Cerrarlo pide que el bus mismo decida quién puede
tomar el nombre (AppArmor mediando D-Bus), y eso se sigue en `vasak-accounts#77`.

Lo que se lee del almacén lo sigue decidiendo el permiso `store.<área>` de
`vasak-permissions` para cada aplicación: el plugin no da acceso a nada que la
aplicación no tenga.

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-vsk-store = "0.4"
```

```bash
bun add @vasakgroup/plugin-vsk-store
```

```rust
// src-tauri/src/lib.rs
tauri::Builder::default()
    // Las áreas cuyos cambios le interesan a la aplicación.
    .plugin(tauri_plugin_vsk_store::init(&["calendar"]))
```

`init` recibe las áreas del almacén que a la aplicación le importan —`email`,
`calendar`, `contacts`—: los avisos y los estados de las demás no la despiertan.
Un nombre que no es un área se descarta al arrancar en vez de llegar al bus.

Las lecturas propias de cada aplicación pasan por el mismo cliente comprobado, así
que la comprobación del dueño no se saltea:

```rust
use tauri_plugin_vsk_store::StoreExt;

let json: String = app.store().call_json("ListCalendars", &()).await?;
```

## Permisos

`vsk-store:default`, en el archivo de capacidades:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["vsk-store:default"]
}
```

El permiso por omisión habilita los dos comandos, `request_sync` y `sync_status`.
También existen `vsk-store:allow-request-sync`, `vsk-store:deny-request-sync`,
`vsk-store:allow-sync-status` y `vsk-store:deny-sync-status` para concederlos o
negarlos por separado.

## API de JavaScript

### `requestSync(accountIds): Promise<SyncRequestFailure[]>`

El botón «Actualizar». Le pide al sincronizador una vuelta de esas cuentas y
devuelve **las que no se pudieron pedir**, con su motivo; vacío quiere decir que se
pidieron todas. La lista no se queda en silencio cuando algo falla: una actualización
que no hace nada y no lo dice se lee como que no había nada nuevo.

### `syncStatus(area): Promise<AccountSyncStatus[]>`

El estado de la sincronización de esa área en cada cuenta: `off`, `pending`,
`syncing`, `synced`, `unavailable` o `failed`, con el detalle y desde cuándo fue la
última vuelta buena. Las cuentas sin esa área no aparecen. `area` tiene que ser una
de las que la aplicación registró en `init`; el resto se responde sin ir al bus.

### `onStoreChanged(handler): Promise<UnlistenFn>`

Avisa cuando cambió lo guardado de las áreas que la aplicación escucha. El
`handler` recibe las áreas que cambiaron, sin repetir. Los avisos de una misma
vuelta se juntan medio segundo antes de llegar: una vuelta escribe de a lotes y
avisa por cada uno, y la ventana relee una vez. Devuelve la función que corta la
escucha; llamarla al desmontar evita que cada montaje sume un escucha.

### `onSyncStatus(handler): Promise<UnlistenFn>`

Avisa cuando cambió el estado de la sincronización. Es el mismo corte: cada vuelta
relee los estados una vez.

### `syncLine(status, failure, now?, locale?): SyncLine | null`

La línea que va debajo de la cuenta: tono, clave de traducción, el dato que
reemplaza `{0}` y si el punto late mientras el sincronizador trabaja. Lo que no se
pudo pedir va primero, porque es lo que la persona acaba de hacer y lo que espera
ver. `null` cuando no hay nada que decir: el área todavía no se encendió.

### `syncedWhen(iso, now?, locale?): string`

Cuándo fue la última vuelta buena, corto: la hora si fue hoy y el día si no. Vacío
si la fecha no se entiende.

### Tipos y constantes

`StoreArea` (`'email' | 'calendar' | 'contacts'`), `SyncTone` (`'neutral' |
'accent' | 'success' | 'warning' | 'error'`), `AccountSyncStatus`,
`SyncRequestFailure` y `SyncLine`. `CHANGED_EVENT` es `'vsk-store://changed'` y
`STATUS_EVENT` es `'vsk-store://status'`.

## Comandos Rust

- `request_sync(account_ids)` — Pide una vuelta de esas cuentas. Devuelve las que
  el sincronizador no aceptó con su motivo (`denied`, `too_soon`, `unavailable` o
  `failed`). Más de 64 cuentas en un pedido se rechaza sin tocar el bus: nadie
  tiene tantas, así que un pedido así no salió de la ventana.
- `sync_status(area)` — El estado de la sincronización de esa área en cada cuenta.
  Un área que la aplicación no registró no llega al sincronizador.

Los dos los llama el paquete de JavaScript, que los invoca como
`plugin:vsk-store|request_sync` y `plugin:vsk-store|sync_status`.

## Ejemplo

```typescript
import {
  onStoreChanged,
  onSyncStatus,
  requestSync,
  syncLine,
  syncStatus,
} from "@vasakgroup/plugin-vsk-store";

const failures = await requestSync([cuenta.id]);
const statuses = await syncStatus("calendar");

// La línea que va debajo de cada cuenta: tono, clave y si late.
const line = syncLine(statuses[0], failures[0]);

// Releer una vez por vuelta, no una vez por lote.
const soltarCambios = await onStoreChanged((areas) => recargar(areas));
const soltarEstados = await onSyncStatus(() => recargarEstados());

// Al desmontar.
soltarCambios();
soltarEstados();
```

## Detalles de implementación

- La comprobación del dueño mira el proceso del nombre único en el bus: que su
  ejecutable sea el sincronizador instalado, que los espacios de nombres coincidan
  con los de la aplicación y que no haya variables del cargador. Desde ahí, las
  llamadas y las señales van al nombre único y no al nombre bien conocido, que es
  el que se puede tomar.
- Las llamadas al almacén no tienen tope de tiempo a propósito: la primera lectura
  puede abrir el diálogo de `vasak-permissions`, y la respuesta llega cuando la
  persona lo cierra.
- Si el dueño comprobado ya no está —el servicio se reinició— se vuelve a comprobar
  y se intenta una vez más, en lugar de fallar la lectura.
- Los avisos que llegan en ráfaga se juntan 500 ms y se pasan una sola vez por
  área, en el orden en que llegaron. Un área que la aplicación no escucha no cuenta
  ni despierta a la ventana.
- Si no hay almacén o la conexión se corta, la escucha vuelve a intentar cada 15
  segundos durante toda la sesión, sin ruido para la interfaz.
- El estado del área se arma a partir del JSON de `GetStatus` del sincronizador:
  las cuentas sin esa área no aparecen, y un texto de área que no es una de las
  tres no se pasa tal cual a ningún lado.
