---
title: "user-data"
description: "The data of the signed-in account —username, full name, picture and home directory— ready for the desktop panel."
weight: 4
---

# `tauri-plugin-user-data`

Returns who is signed in and how they look: the account name, the full name, the
profile picture already encoded as a data URI and the home directory. It is what
draws the face and the name in the desktop panel.

- **Crate:** `tauri-plugin-user-data`
- **JS package:** `@vasakgroup/plugin-user-data`
- **Platform:** Linux on the desktop (reads `passwd`, `getent` and
  `/var/lib/AccountsService`)

## Installation

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-user-data = "2.1.1"
```

```bash
bun add @vasakgroup/plugin-user-data
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_user_data::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

`init` takes no arguments. The plugin queries the system on every call, so there
is nothing to configure or keep in sync.

## Permissions

`user-data:default`, in the capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["user-data:default"]
}
```

The default permission enables the plugin's only command. There are also
`user-data:allow-get-user-info` and `user-data:deny-get-user-info` on their own,
which is what the default permission includes.

## JavaScript API

### `getUserData(): Promise<UserInfo | null>`

Returns the data of the session account, or `null` when the backend answered
nothing. The object carries:

- `username` — The account name (`pato`). There is always one.
- `full_name` — The full name (`Joaquin Decima`). If the account has none, it is
  the account name itself.
- `avatar_data` — The picture as a data URI (`data:image/png;base64,…`), ready
  for an `<img src>`. It is never empty: when there is no usable picture, a
  generic icon arrives.
- `home_dir` — The home directory (`/home/pato`).

The `UserInfo` interface the package exports declares `username`, `full_name`
and `avatar_data`; `home_dir` travels in the response all the same.

## Rust commands

- `get_user_info()` — The account name, the full name, the picture as a data URI
  and the home directory.

## Example

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUserData, type UserInfo } from "@vasakgroup/plugin-user-data";

const account = ref<UserInfo | null>(null);

onMounted(async () => {
  account.value = await getUserData();
});
</script>

<template>
  <img v-if="account" :src="account.avatar_data" :alt="account.full_name" />
  <p v-if="account">{{ account.full_name }}</p>
</template>
```

## Implementation details

- **It never fails because of an incomplete environment.** The command always
  returns usable data: without `USER`, without `passwd` or without `HOME` there
  is still a username, a full name and a directory.
- **The account name** comes from `USER`; if it is missing, from `passwd` by uid
  (`getpwuid`); and if that fails too, from the uid as a number. An application
  launched from a systemd unit may not have `USER`, and that is where it used to
  fail.
- **The full name** is the fifth field of `getent passwd <account>` (GECOS), cut
  at the first comma: `Joaquin Decima,Oficina 3,555-1234` becomes
  `Joaquin Decima`. When it is empty, the account name is used.
- **The home directory** is the sixth field of that same line, with `HOME` as a
  fallback.
- **The picture** is looked up in order: `~/.face`, `~/.face.icon`,
  `/var/lib/AccountsService/icons/<account>` and
  `/usr/share/icons/default/user.png`. The first one that exists and is a
  drawable image wins.
- **The type is detected from the content**, not from the extension: PNG, JPEG,
  GIF, BMP, WebP and SVG. Two of the four paths have no extension, and going by
  the name a JPEG `.face` was declared PNG and was not drawn.
- **A 4 MiB cap per picture.** The image travels to the WebView as base64, inside
  a single IPC message, so a huge file is skipped instead of loaded. The cap is
  applied while reading, not only while measuring the file.
- **An unreadable, empty or non-image file is skipped** and the next path is
  tried: the system picture is better than a hole left by a broken file.
- **No fallback picture means no hole**: the plugin ships an embedded generic SVG
  and returns it when no path worked. It lives inside the binary, not as a path
  to a theme file that may not be there.
- **No events**: the plugin emits none. Anyone who wants fresh data calls
  `getUserData()` again, which queries the system every time.
