---
title: "Tauri plugins"
description: "The Tauri plugins that VasakOS applications share: settings, icons, language, network, Bluetooth, display and the common interface."
icon: "fa-solid fa-plug"
weight: 3
---

Each plugin is a Rust crate that runs inside the application process and a
TypeScript package that wraps its commands. They lift out of the system the
pieces more than one application needs: reading and writing settings, asking the
theme for icons, managing the network or Bluetooth, adjusting brightness and the
power profile, and drawing the common interface.

They all register the same way and all are gated by the Tauri permission system.
The general shape, which each page repeats with its own names, is:

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-<name> = "2"
```

```bash
bun add @vasakgroup/plugin-<name>
```

```rust
// src-tauri/src/lib.rs
tauri::Builder::default()
    .plugin(tauri_plugin_<name>::init())
```

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["<name>:default"]
}
```

Packages are published as `@vasakgroup/plugin-*` on npm and the crates on
crates.io; the code lives at
[github.com/Vasak-OS](https://github.com/Vasak-OS). Plugins that only make sense
on Linux say so, together with the system dependency they need.

## Plugins

### System and settings
- [config-manager](/en/docs/devs/tauri-plugins/config-manager/) — Reads and writes the VasakOS configuration in real time, and derives the color scheme from the wallpaper.
- [user-data](/en/docs/devs/tauri-plugins/user-data/) — The data of the signed-in account: name, picture and system folders.
- [i18n](/en/docs/devs/tauri-plugins/i18n/) — Translations for applications, with the system language as the default.

### Interface
- [vicons](/en/docs/devs/tauri-plugins/vicons/) — System theme icons as data URIs for `<img>`, with caching and theme-change notifications.
- [vsk-journal](/en/docs/devs/tauri-plugins/vsk-journal/) — A log of what the application does, to the terminal and the browser console.
- [vsk-contextual-menu](/en/docs/devs/tauri-plugins/vsk-contextual-menu/) — The system context menu, drawn in its own window or inside the page.
- [drag-and-drop-wayland](/en/docs/devs/tauri-plugins/drag-and-drop-wayland/) — Native drag and drop on Wayland, to move files in and out of the application.

### Hardware and network
- [display-manager](/en/docs/devs/tauri-plugins/display-manager/) — Per-monitor brightness and night light.
- [power-profiles](/en/docs/devs/tauri-plugins/power-profiles/) — The `power-profiles-daemon` power profile.
- [bluetooth-manager](/en/docs/devs/tauri-plugins/bluetooth-manager/) — Adapters, pairing and connection of Bluetooth devices.
- [network-manager](/en/docs/devs/tauri-plugins/network-manager/) — Wi-Fi, VPN and network state.
