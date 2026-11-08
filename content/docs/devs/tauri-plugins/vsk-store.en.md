---
title: "vsk-store"
description: "The system store client: check who the synchronizer is before believing it, request a round, read the status and listen to the notices."
weight: 12
---

# `tauri-plugin-vsk-store`

The client for the VasakOS **system store**. `vasak-accounts-sync` keeps an
encrypted per-account database with mail, calendar and contacts in the background,
and publishes it on the session bus as `ar.net.vasak.os.AccountsStore`.
Applications read from there without waiting for the network, and this plugin is
the only way they do it.

- **Crate:** `tauri-plugin-vsk-store`
- **JS package:** `@vasakgroup/plugin-vsk-store`
- **Platform:** Linux with the session bus; without the synchronizer the plugin
  still loads and everything shows as **not available**, never broken

## What the plugin does

- **It checks who owns the synchronizer's name before believing anything.** The
  session bus lets any process take a free name: if the synchronizer did not start
  or is restarting, another program in the session could impersonate it and show
  invented mail, events or contacts under the person's real account
  (`vasak-accounts#77`). The plugin requires the name's owner to run **the same
  file** as `/usr/bin/vasak-accounts-sync`, in the same namespaces as the
  application and without loader variables, and from there it talks **only to that
  owner**, by its unique name. If the name changes owner, it checks again.
- **«Update»**: it asks the synchronizer for a round and reports which accounts
  could not be asked and why.
- **The synchronization status** of an area for each account.
- **The notices**: the store's changes, gathering those of the same round, and the
  status ones, handed to the window as events.

It is a first layer, not a complete boundary: a program of the same user can still
get past it other ways. Closing that needs the bus itself to decide who may take
the name (AppArmor mediating D-Bus), and that is tracked in `vasak-accounts#77`.

What is read from the store is still decided by the `store.<area>` permission of
`vasak-permissions` for each application: the plugin grants no access the
application does not already have.

## Installation

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
    // The store areas whose changes matter to the application.
    .plugin(tauri_plugin_vsk_store::init(&["calendar"]))
```

`init` takes the store areas the application cares about —`email`, `calendar`,
`contacts`—: notices and statuses of the others do not wake it. A name that is not
an area is discarded at startup instead of reaching the bus.

Each application's own reads go through the same verified client, so the owner
check is not skipped:

```rust
use tauri_plugin_vsk_store::StoreExt;

let json: String = app.store().call_json("ListCalendars", &()).await?;
```

## Permissions

`vsk-store:default`, in the capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["vsk-store:default"]
}
```

The default permission enables both commands, `request_sync` and `sync_status`.
There are also `vsk-store:allow-request-sync`, `vsk-store:deny-request-sync`,
`vsk-store:allow-sync-status` and `vsk-store:deny-sync-status` to grant or deny
them separately.

## JavaScript API

### `requestSync(accountIds): Promise<SyncRequestFailure[]>`

The «Update» button. It asks the synchronizer for a round of those accounts and
returns **the ones that could not be asked**, with their reason; empty means all of
them were asked. The list does not go silent when something fails: an update that
does nothing and does not say so reads as if there was nothing new.

### `syncStatus(area): Promise<AccountSyncStatus[]>`

The synchronization status of that area for each account: `off`, `pending`,
`syncing`, `synced`, `unavailable` or `failed`, with the detail and since when the
last good round was. Accounts without that area do not appear. `area` has to be one
of the ones the application registered in `init`; the rest are answered without
going to the bus.

### `onStoreChanged(handler): Promise<UnlistenFn>`

Notifies when what is stored for the areas the application listens to changed. The
`handler` receives the areas that changed, without repeats. The notices of the same
round are gathered for half a second before arriving: a round writes in batches and
notifies for each one, and the window reloads once. It returns the function that
stops the listening; calling it on unmount keeps each mount from adding one more
listener.

### `onSyncStatus(handler): Promise<UnlistenFn>`

Notifies when the synchronization status changed. Same cut: each round reloads the
statuses once.

### `syncLine(status, failure, now?, locale?): SyncLine | null`

The line that goes under the account: tone, translation key, the value that
replaces `{0}` and whether the dot pulses while the synchronizer works. What could
not be asked goes first, because it is what the person just did and expects to see.
`null` when there is nothing to say: the area is not on yet.

### `syncedWhen(iso, now?, locale?): string`

When the last good round was, short: the time if it was today and the day if not.
Empty if the date does not parse.

### Types and constants

`StoreArea` (`'email' | 'calendar' | 'contacts'`), `SyncTone` (`'neutral' |
'accent' | 'success' | 'warning' | 'error'`), `AccountSyncStatus`,
`SyncRequestFailure` and `SyncLine`. `CHANGED_EVENT` is `'vsk-store://changed'` and
`STATUS_EVENT` is `'vsk-store://status'`.

## Rust commands

- `request_sync(account_ids)` — Requests a round for those accounts. It returns the
  ones the synchronizer did not accept with their reason (`denied`, `too_soon`,
  `unavailable` or `failed`). More than 64 accounts in one request is rejected
  without touching the bus: nobody has that many, so such a request did not come
  from the window.
- `sync_status(area)` — The synchronization status of that area for each account.
  An area the application did not register never reaches the synchronizer.

Both are called by the JavaScript package, which invokes them as
`plugin:vsk-store|request_sync` and `plugin:vsk-store|sync_status`.

## Example

```typescript
import {
  onStoreChanged,
  onSyncStatus,
  requestSync,
  syncLine,
  syncStatus,
} from "@vasakgroup/plugin-vsk-store";

const failures = await requestSync([account.id]);
const statuses = await syncStatus("calendar");

// The line that goes under each account: tone, key and whether it pulses.
const line = syncLine(statuses[0], failures[0]);

// Reload once per round, not once per batch.
const stopChanges = await onStoreChanged((areas) => reload(areas));
const stopStatuses = await onSyncStatus(() => reloadStatuses());

// On unmount.
stopChanges();
stopStatuses();
```

## Implementation details

- The owner check looks at the process behind the bus's unique name: that its
  executable is the installed synchronizer, that the namespaces match the
  application's and that there are no loader variables. From there, calls and
  signals go to the unique name and not to the well-known one, which is the one
  that can be taken.
- Calls to the store have no timeout on purpose: the first read may open the
  `vasak-permissions` dialog, and the answer arrives when the person closes it.
- If the verified owner is gone —the service restarted— it checks again and tries
  once more, instead of failing the read.
- Notices arriving in a burst are gathered for 500 ms and handed over once per
  area, in the order they arrived. An area the application does not listen to does
  not count and does not wake the window.
- If there is no store or the connection drops, the listener retries every 15
  seconds for the whole session, with no noise for the interface.
- The area status is built from the synchronizer's `GetStatus` JSON: accounts
  without that area do not appear, and an area text that is not one of the three is
  never passed along.
