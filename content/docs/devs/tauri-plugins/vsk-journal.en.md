---
title: "vsk-journal"
description: "Writes the application log to the system journal, signed with its own name, and leaves a trace of panics with the file and line."
weight: 6
---

# `tauri-plugin-vsk-journal`

Records what the application does in the system journal under the executable's name, so
it can be found with `journalctl -t`. It also installs a panic hook that leaves the
message, the file and the line at critical priority; with no journal, it writes to `stderr`.

- **Crate:** `tauri-plugin-vsk-journal`
- **JS package:** `@vasakgroup/plugin-vsk-journal`
- **Platform:** Linux with `systemd-journald`; without it, logging falls back to `stderr`

## Installation

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

`init` signs with the executable's name. When the executable is not named like the
application, it is started with its own identifier:

```rust
.plugin(tauri_plugin_vsk_journal::init_con_identificador("vasak-terminal"))
```

An invalid identifier does not abort startup: it falls back to the executable's,
because an application that does not open over a logging issue would be worse than
one that logs under a name other than the one asked for.

## Permissions

`vsk-journal:default`, in the capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["vsk-journal:default"]
}
```

The default permission enables both commands, `registrar` and `identificador`.
There are also `vsk-journal:allow-registrar`, `vsk-journal:deny-registrar`,
`vsk-journal:allow-identificador` and `vsk-journal:deny-identificador` to grant or
deny them separately.

## JavaScript API

### `log(level, message): Promise<void>`

Writes a line to the journal. `level` is a syslog number and is clamped to the
0–7 range instead of being rejected, because an invented level is no reason to
lose the message. `message` is truncated to 16 KiB with `… (recortado)` appended,
so as not to serialize megabytes for one log line. The identifier is not chosen
here: Rust sets it.

### `error(message): Promise<void>`

Shorthand for `log` at the error level (3).

### `warn(message): Promise<void>`

Shorthand for `log` at the warning level (4).

### `info(message): Promise<void>`

Shorthand for `log` at the informational level (6).

### `debug(message): Promise<void>`

Shorthand for `log` at the debug level (7).

### `getIdentifier(): Promise<string>`

The name this application signs its entries with, which is what they are looked up
with through `journalctl -t`.

### `captureFailures(options?): () => void`

Hooks `error` and `unhandledrejection` —the two interface failures that leave no
trace— and mirrors what goes to `console.error` and `console.warn`, without
replacing them. It returns the function that releases everything it hooked; calling
it on unmount keeps each mount from adding one more listener and the same error
from being recorded several times. The options (`target`, `console`, `sink`) exist
so it can be tested; by default it listens on `window`, mirrors the real console
and sends to the journal.

### `normalizeLevel(level): number`

Clamps a level to the 0–7 range. Anything that is not a number falls back to the
informational level.

### `truncate(message, limit?): string`

Truncates a message to the given limit (16 KiB by default) making clear that it was
truncated.

### `describe(value): string`

Turns anything into something readable. An `Error` contributes its `stack`, which
is the only thing that helps find where it happened; an object is serialized and,
if that is not possible —circular references, which are the norm in a DOM event—,
it falls back to `String(...)` instead of throwing inside the log call itself.

### `describeErrorEvent(event): string`

The text of an `ErrorEvent`, with the file, line and column when it carries them.

### `Level` and `MESSAGE_LIMIT`

`Level` is the table mapping syslog names to numbers (`Emergency` 0, `Alert` 1,
`Critical` 2, `Error` 3, `Warning` 4, `Notice` 5, `Info` 6, `Debug` 7), and
`MESSAGE_LIMIT` is the 16 KiB limit `truncate` uses.

## Rust commands

- `registrar(diario, nivel, mensaje)` — Writes a line to the journal on behalf of
  the interface. `diario` is the state the plugin registers and that Tauri injects;
  the level is clamped and the message is truncated, and the layer stays fixed at
  `interfaz`, which is where it comes from.
- `identificador(diario)` — Returns the name the application signs its entries
  with.

Both are called by the JavaScript package, which invokes them as
`plugin:vsk-journal|registrar` and `plugin:vsk-journal|identificador`.

## Example

```typescript
import {
  captureFailures,
  error,
  getIdentifier,
  Level,
  log,
} from "@vasakgroup/plugin-vsk-journal";

// Hooks the interface failures and returns how to release them.
const release = captureFailures();

await log(Level.Notice, "the main window is ready");
error("the settings could not be opened");

// What signs the entries: the executable's name.
console.log(await getIdentifier());

// On unmount, release: without this one more listener remains per mount.
release();
```

In a terminal, that application's lines are watched by its name:

```bash
journalctl --user -t vasak-terminal -f
```

## Implementation details

- It writes with the native `systemd-journald` protocol: a datagram to
  `/run/systemd/journal/socket` with `FIELD=value` pairs. No privilege and no
  `libsystemd` are needed.
- Every entry carries `MESSAGE`, `PRIORITY`, `SYSLOG_IDENTIFIER` and `VSK_CAPA`,
  which tells apart what broke the interface (`interfaz`) from what broke the core
  (`nucleo`). The panic hook adds `CODE_FILE` and `CODE_LINE`.
- A value with a newline goes in the long form of the protocol —name, newline,
  eight little-endian length bytes, the raw data— where the length rules and the
  contents are not interpreted. That way a message cannot invent fields such as
  `PRIORITY` or sign entries under someone else's name.
- Field names are validated: uppercase letters, digits and `_`, not starting with
  `_` —which `journald` reserves for `_PID`, `_UID` and `_COMM`— nor with a digit. A
  field with an invalid name is dropped without taking the rest of the message with
  it.
- A message is truncated to 16 KiB without splitting a character in half, and a
  level out of range is clamped to 7 instead of being lost.
- A panic is recorded as critical (2) and not as error (3), because it is not "an
  operation failed" but the application ending. The previous hook is kept and
  called afterwards.
- The default identifier is the executable's name, which is the one that matches
  the `_COMM` the journal already stores. It is valid if it is not empty, does not
  exceed 64 characters and has no newline, `=` or `\0`; otherwise the executable's
  is used and, as a last resort, `vasak-app`.
- The panic hook is installed when the plugin is built and not in `setup`, so a
  panic inside `setup` itself also leaves a trace.
- If the socket is not there —a container, a machine without systemd— it writes to
  `stderr`, which is where it went before the plugin. Logging never fails outward.
- The tests in `tests/diario_real.rs` check against a real `journald` that an entry
  arrives and is found by filtering with `journalctl -t`. They are marked `ignore`
  and are run by hand with `cargo test -- --ignored`.
