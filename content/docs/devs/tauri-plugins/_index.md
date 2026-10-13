---
title: "Plugins de Tauri"
description: "Los plugins de Tauri que comparten las aplicaciones de VasakOS: configuración, íconos, idioma, red, Bluetooth, pantalla y la interfaz del sistema."
icon: "fa-solid fa-plug"
weight: 3
---

Cada plugin es un crate de Rust que corre en el proceso de la aplicación y un
paquete de TypeScript que envuelve sus comandos. Separan del sistema las piezas
que más de una aplicación necesita: leer y escribir la configuración, pedir
íconos al tema, administrar la red o el Bluetooth, ajustar el brillo y el perfil
de energía, y dibujar la interfaz común.

Todos se registran igual y todos se protegen con el sistema de permisos de
Tauri. La forma general, que cada página repite con sus nombres, es:

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-<nombre> = "2"
```

```bash
bun add @vasakgroup/plugin-<nombre>
```

```rust
// src-tauri/src/lib.rs
tauri::Builder::default()
    .plugin(tauri_plugin_<nombre>::init())
```

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["<nombre>:default"]
}
```

Los paquetes se publican como `@vasakgroup/plugin-*` en npm y los crates en
crates.io; el código vive en
[github.com/Vasak-OS](https://github.com/Vasak-OS). Los plugins que solo tienen
sentido en Linux lo declaran, con la dependencia de sistema que necesitan.

## Plugins

### Sistema y configuración
- [config-manager](/docs/devs/tauri-plugins/config-manager/) — Lee y escribe la configuración de VasakOS en tiempo real, y deriva el esquema de color del fondo de pantalla.
- [user-data](/docs/devs/tauri-plugins/user-data/) — Los datos de la cuenta que inició sesión: nombre, foto y carpetas del sistema.
- [i18n](/docs/devs/tauri-plugins/i18n/) — Traducciones para las aplicaciones, con el idioma del sistema como valor por omisión.

### Interfaz
- [vicons](/docs/devs/tauri-plugins/vicons/) — Íconos del tema del sistema como data URI para `<img>`, con caché y aviso de cambios de tema.
- [vsk-journal](/docs/devs/tauri-plugins/vsk-journal/) — Un registro de lo que hace la aplicación, a la terminal y a la consola del navegador.
- [vsk-contextual-menu](/docs/devs/tauri-plugins/vsk-contextual-menu/) — El menú contextual del sistema, dibujado en una ventana propia o dentro de la página.
- [drag-and-drop-wayland](/docs/devs/tauri-plugins/drag-and-drop-wayland/) — Arrastrar y soltar nativo en Wayland, para mover archivos dentro y fuera de la aplicación.

### Hardware y red
- [display-manager](/docs/devs/tauri-plugins/display-manager/) — El brillo por monitor y la luz nocturna.
- [power-profiles](/docs/devs/tauri-plugins/power-profiles/) — El perfil de energía de `power-profiles-daemon`.
- [bluetooth-manager](/docs/devs/tauri-plugins/bluetooth-manager/) — Adaptadores, emparejamiento y conexión de dispositivos Bluetooth.
- [network-manager](/docs/devs/tauri-plugins/network-manager/) — Wi-Fi, VPN y el estado de la red.
