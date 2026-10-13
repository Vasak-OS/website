---
title: "vsk-journal"
description: "Escribe el registro de la aplicación en el diario del sistema, firmado con su propio nombre, y deja rastro del panic con el archivo y la línea."
weight: 6
---

# `tauri-plugin-vsk-journal`

Anota lo que hace la aplicación en el diario del sistema bajo el nombre del ejecutable,
para encontrarlo con `journalctl -t`. Instala además un gancho de pánico que deja el
mensaje, el archivo y la línea con prioridad de crítico; sin diario, escribe a `stderr`.

- **Crate:** `tauri-plugin-vsk-journal`
- **Paquete JS:** `@vasakgroup/plugin-vsk-journal`
- **Plataforma:** Linux con `systemd-journald`; sin él, el registro cae a `stderr`

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-vsk-journal = "2.0"
```

```bash
bun add @vasakgroup/plugin-vsk-journal
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_vsk_journal::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

`init` firma con el nombre del ejecutable. Cuando el ejecutable no se llama como la
aplicación, se arranca con un identificador propio:

```rust
.plugin(tauri_plugin_vsk_journal::init_con_identificador("vasak-terminal"))
```

Un identificador inválido no aborta el arranque: se cae al del ejecutable, porque
una aplicación que no abre por un problema de registro sería peor que una que
registra con un nombre distinto del pedido.

## Permisos

`vsk-journal:default`, en el archivo de capacidades:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["vsk-journal:default"]
}
```

El permiso por omisión habilita los dos comandos, `registrar` e `identificador`.
También existen `vsk-journal:allow-registrar`, `vsk-journal:deny-registrar`,
`vsk-journal:allow-identificador` y `vsk-journal:deny-identificador` para
concederlos o negarlos por separado.

## API de JavaScript

### `log(level, message): Promise<void>`

Anota una línea en el diario. `level` es un número de syslog y se acota al rango
0–7 en lugar de rechazarse, porque un nivel inventado no es motivo para perder el
mensaje. `message` se recorta a 16 KiB agregando `… (recortado)` al final, para no
serializar megabytes por una línea de registro. El identificador no se elige desde
acá: lo pone Rust.

### `error(message): Promise<void>`

Atajo de `log` con el nivel de error (3).

### `warn(message): Promise<void>`

Atajo de `log` con el nivel de aviso (4).

### `info(message): Promise<void>`

Atajo de `log` con el nivel informativo (6).

### `debug(message): Promise<void>`

Atajo de `log` con el nivel de depuración (7).

### `getIdentifier(): Promise<string>`

El nombre con el que esta aplicación firma sus entradas, que es con el que se
buscan con `journalctl -t`.

### `captureFailures(options?): () => void`

Engancha `error` y `unhandledrejection` —los dos fallos de la interfaz que no dejan
rastro— y replica lo que va a `console.error` y `console.warn`, sin reemplazarlos.
Devuelve la función que suelta todo lo que enganchó; llamarla al desmontar evita que
cada montaje sume un escucha y el mismo error se anote varias veces. Las opciones
(`target`, `console`, `sink`) existen para poder probarlo; por omisión escucha
`window`, replica la consola de verdad y manda al diario.

### `normalizeLevel(level): number`

Acota un nivel al rango 0–7. Lo que no es un número cae al nivel informativo.

### `truncate(message, limit?): string`

Recorta un mensaje al límite indicado (16 KiB por omisión) dejando claro que se
recortó.

### `describe(value): string`

Convierte cualquier cosa en algo legible. Un `Error` aporta su `stack`, que es lo
único que sirve para encontrar dónde pasó; un objeto se serializa y, si no se puede
—referencias circulares, que en un evento del DOM son la norma—, cae al `String(...)`
en lugar de lanzar una excepción dentro del propio registro.

### `describeErrorEvent(event): string`

El texto de un `ErrorEvent`, con el archivo, la línea y la columna si los trae.

### `Level` y `MESSAGE_LIMIT`

`Level` es la tabla de nombres de syslog a número (`Emergency` 0, `Alert` 1,
`Critical` 2, `Error` 3, `Warning` 4, `Notice` 5, `Info` 6, `Debug` 7), y
`MESSAGE_LIMIT` es el límite de 16 KiB que usa `truncate`.

## Comandos Rust

- `registrar(diario, nivel, mensaje)` — Anota una línea en el diario a nombre de la
  interfaz. El `diario` es el estado que el plugin registra y que Tauri inyecta; el
  nivel se acota y el mensaje se recorta, y la capa queda fija en `interfaz`, que es
  de donde viene.
- `identificador(diario)` — Devuelve el nombre con el que la aplicación firma sus
  entradas.

Los dos los llama el paquete de JavaScript, que los invoca como
`plugin:vsk-journal|registrar` y `plugin:vsk-journal|identificador`.

## Ejemplo

```typescript
import {
  captureFailures,
  error,
  getIdentifier,
  Level,
  log,
} from "@vasakgroup/plugin-vsk-journal";

// Engancha los fallos de la interfaz y devuelve cómo soltarlos.
const soltar = captureFailures();

await log(Level.Notice, "la ventana principal quedó lista");
error("no se pudo abrir la configuración");

// Lo que firma las entradas: el nombre del ejecutable.
console.log(await getIdentifier());

// Al desmontar, se suelta: sin esto queda un escucha más por cada montaje.
soltar();
```

En una terminal, las líneas de esa aplicación se miran por su nombre:

```bash
journalctl --user -t vasak-terminal -f
```

## Detalles de implementación

- Escribe con el protocolo nativo de `systemd-journald`: un datagrama a
  `/run/systemd/journal/socket` con pares `CAMPO=valor`. No hace falta ningún
  privilegio ni `libsystemd`.
- Cada entrada lleva `MESSAGE`, `PRIORITY`, `SYSLOG_IDENTIFIER` y `VSK_CAPA`, que
  distingue lo que rompió la interfaz (`interfaz`) de lo que rompió el núcleo
  (`nucleo`). El gancho de pánico agrega `CODE_FILE` y `CODE_LINE`.
- Un valor con un salto de línea va en la forma larga del protocolo —nombre, salto,
  ocho bytes de largo en little endian, los datos crudos— donde el largo manda y el
  contenido no se interpreta. Así un mensaje no puede inventar campos como
  `PRIORITY` ni firmar entradas a nombre de otro.
- Los nombres de campo se validan: mayúsculas, dígitos y `_`, sin empezar con `_`
  —que `journald` reserva para `_PID`, `_UID` y `_COMM`— ni con un dígito. Un campo
  con nombre inválido se descarta sin llevarse el resto del mensaje.
- Un mensaje se recorta a 16 KiB sin partir un carácter al medio, y un nivel fuera de
  rango se acota a 7 en lugar de perderse.
- Un pánico se anota como crítico (2) y no como error (3), porque no es «una
  operación falló» sino la aplicación terminándose. El gancho anterior se conserva y
  se llama después.
- El identificador por omisión es el nombre del ejecutable, que es el que coincide
  con el `_COMM` que el diario ya guarda. Sirve si no está vacío, no pasa de 64
  caracteres y no trae salto de línea, `=` ni `\0`; si no, se usa el del ejecutable y,
  como último recurso, `vasak-app`.
- El gancho de pánico se instala al construir el plugin y no en `setup`, para que un
  pánico dentro del propio `setup` también deje rastro.
- Si el socket no está —un contenedor, una máquina sin systemd— escribe a `stderr`,
  que es donde iba antes del plugin. Anotar nunca falla hacia afuera.
- Las pruebas de `tests/diario_real.rs` comprueban contra un `journald` de verdad que
  una entrada llega y se encuentra filtrando con `journalctl -t`. Están marcadas
  `ignore` y se corren a mano con `cargo test -- --ignored`.
