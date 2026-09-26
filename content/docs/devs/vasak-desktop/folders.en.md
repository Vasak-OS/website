---
title: "Folder System | vasak-desktop"
weight: 20
---

Detailed guide to the project's folder structure.

## Root Structure

{{< mermaid >}}
graph TD
    Root["📁 vasak-desktop/"]
    
    Root --> Src["📁 src/<br/><small>Vue.js frontend</small>"]
    Root --> SrcTauri["📁 src-tauri/<br/><small>Rust backend</small>"]
    Root --> IndexHTML["📄 index.html"]
    Root --> PackageJSON["📄 package.json"]
    Root --> TSConfig["📄 tsconfig.json"]
    Root --> ViteConfig["📄 vite.config.ts"]
    Root --> License["📄 LICENSE"]
    Root --> Readme["📄 README.md"]
    Root --> GitIgnore["📄 .gitignore"]
    
    style Root fill:#667eea,stroke:#764ba2,color:#fff
    style Src fill:#f093fb,stroke:#f5576c,color:#fff
    style SrcTauri fill:#4facfe,stroke:#00f2fe,color:#fff
    style IndexHTML fill:#fa709a,stroke:#fee140,color:#fff
    style PackageJSON fill:#30cfd0,stroke:#330867,color:#fff
    style TSConfig fill:#a8edea,stroke:#fed6e3,color:#333
    style ViteConfig fill:#ffecd2,stroke:#fcb69f,color:#333
    style License fill:#ff9a9e,stroke:#fecfef,color:#333
    style Readme fill:#fbc2eb,stroke:#a6c1ee,color:#333
    style GitIgnore fill:#fdcbf1,stroke:#e6dee9,color:#333
{{< /mermaid >}}

## Frontend (`src/`)

### Frontend Root

{{< mermaid >}}
graph TD
    SrcRoot["📁 src/"]
    SrcRoot --> AppVue["📄 App.vue<br/><small>Root component</small>"]
    SrcRoot --> MainTs["📄 main.ts<br/><small>Entry point</small>"]
    SrcRoot --> StyleCss["📄 style.css<br/><small>Global styles</small>"]
    SrcRoot --> ViteEnv["📄 vite-env.d.ts<br/><small>Vite types</small>"]
    SrcRoot --> AssetsDir["📁 assets/<br/><small>Static assets</small>"]
    SrcRoot --> ComponentsDir["📁 components/<br/><small>Reusable components</small>"]
    SrcRoot --> InterfacesDir["📁 interfaces/<br/><small>TS interfaces</small>"]
    SrcRoot --> LayoutsDir["📁 layouts/<br/><small>Layouts/templates</small>"]
    SrcRoot --> RoutesDir["📁 routes/<br/><small>Routing</small>"]
    SrcRoot --> ToolsDir["📁 tools/<br/><small>Controllers</small>"]
    SrcRoot --> TypesDir["📁 types/<br/><small>TS types</small>"]
    SrcRoot --> ViewsDir["📁 views/<br/><small>Views/pages</small>"]
    
    style SrcRoot fill:#667eea,stroke:#764ba2,color:#fff
    style AppVue fill:#f093fb,stroke:#f5576c,color:#fff
    style MainTs fill:#f093fb,stroke:#f5576c,color:#fff
    style StyleCss fill:#f093fb,stroke:#f5576c,color:#fff
    style ViteEnv fill:#f093fb,stroke:#f5576c,color:#fff
    style AssetsDir fill:#4facfe,stroke:#00f2fe,color:#fff
    style ComponentsDir fill:#4facfe,stroke:#00f2fe,color:#fff
    style InterfacesDir fill:#4facfe,stroke:#00f2fe,color:#fff
    style LayoutsDir fill:#4facfe,stroke:#00f2fe,color:#fff
    style RoutesDir fill:#4facfe,stroke:#00f2fe,color:#fff
    style ToolsDir fill:#4facfe,stroke:#00f2fe,color:#fff
    style TypesDir fill:#4facfe,stroke:#00f2fe,color:#fff
    style ViewsDir fill:#4facfe,stroke:#00f2fe,color:#fff
{{< /mermaid >}}

### `src/assets/`

Static assets (images, vectors):

{{< mermaid >}}
graph TD
    Assets["📁 src/assets/"]
    Assets --> Img["📁 img/<br/><small>Raster images</small>"]
    Assets --> Vectors["📁 vectors/<br/><small>Vector graphics</small>"]
    
    Img --> Logo["🖼️ logo.png"]
    Img --> BgJpg["🖼️ background.jpg"]
    Img --> ImgMore["📄 ..."]
    
    Vectors --> Icons["📁 icons/"]
    Vectors --> Illustrations["📁 illustrations/"]
    Vectors --> VecMore["📄 ..."]
    
    style Assets fill:#667eea,stroke:#764ba2,color:#fff
    style Img fill:#4facfe,stroke:#00f2fe,color:#fff
    style Vectors fill:#4facfe,stroke:#00f2fe,color:#fff
    style Logo fill:#43e97b,stroke:#38f9d7,color:#fff
    style BgJpg fill:#43e97b,stroke:#38f9d7,color:#fff
    style ImgMore fill:#43e97b,stroke:#38f9d7,color:#fff
    style Icons fill:#43e97b,stroke:#38f9d7,color:#fff
    style Illustrations fill:#43e97b,stroke:#38f9d7,color:#fff
    style VecMore fill:#43e97b,stroke:#38f9d7,color:#fff
{{< /mermaid >}}

**Usage**:
```typescript
import logo from '@/assets/img/logo.png';
// Available in templates as:
// <img src="@/assets/img/logo.png" />
```

### `src/components/`

Reusable Vue components:

{{< mermaid >}}
graph LR
    Components["📁 src/components/"]
    Components --> SearchMenu["📄 SearchMenuComponent.vue<br/><small>Menu search</small>"]
    Components --> Areas["📁 areas/<br/><small>Large areas</small>"]
    Components --> Buttons["📁 buttons/<br/><small>Buttons</small>"]
    Components --> Cards["📁 cards/<br/><small>Cards</small>"]
    Components --> Controls["📁 controls/<br/><small>Interactive controls</small>"]
    Components --> Icon["📁 icon/<br/><small>Icons</small>"]
    Components --> Widgets["📁 widgets/<br/><small>Reusable widgets</small>"]
    
    Areas --> Audio["🔊 audio/"]
    Areas --> Bluetooth["📱 bluetooth/"]
    Areas --> Network["🌐 network/"]
    Areas --> Panel["📊 panel/"]
    Areas --> ControlCenter["⚙️ control-center/"]
    Areas --> Menu["🎯 menu/"]
    Areas --> Configuration["⚙️ configuration/"]
    
    Buttons --> BtnMenu["🔘 AppMenuButton.vue"]
    Buttons --> BtnCategory["🔘 CategoryMenuPill.vue"]
    Buttons --> BtnSidebar["🔘 ConfigSidebarButton.vue"]
    Buttons --> BtnSession["🔘 SessionButton.vue"]
    Buttons --> BtnBattery["🔌 TrayIconBattery.vue"]
    
    Cards --> CardMenu["🎴 AppMenuCard.vue"]
    Cards --> CardBT["🎴 BluetoothDeviceCard.vue"]
    Cards --> CardWeather["🎴 CurrentWeatherCard.vue"]
    Cards --> CardWiFi["🎴 NetworkWiFiCard.vue"]
    
    Controls --> CtrlAudio["🎚️ AudioDeviceSelector.vue"]
    Controls --> CtrlBT["🎚️ BluetoothControl.vue"]
    Controls --> CtrlBrightness["🎚️ BrightnessControl.vue"]
    Controls --> CtrlNetwork["🎚️ NetworkControl.vue"]
    
    Widgets --> ClockWidget["⏰ DesktopClockWidget.vue"]
    Widgets --> MusicWidget["🎵 MusicWidget.vue"]
    Widgets --> WeatherWidget["🌤️ WeatherWidget.vue"]
    
    style Components fill:#667eea,stroke:#764ba2,color:#fff
    style SearchMenu fill:#f093fb,stroke:#f5576c,color:#fff
    style Areas fill:#4facfe,stroke:#00f2fe,color:#fff
    style Buttons fill:#4facfe,stroke:#00f2fe,color:#fff
    style Cards fill:#4facfe,stroke:#00f2fe,color:#fff
    style Controls fill:#4facfe,stroke:#00f2fe,color:#fff
    style Icon fill:#4facfe,stroke:#00f2fe,color:#fff
    style Widgets fill:#4facfe,stroke:#00f2fe,color:#fff
{{< /mermaid >}}

**Structure of a component**:

```vue
<template>
  <div class="component">
    <!-- Content -->
  </div>
</template>

<script setup lang="ts">
// Component logic
</script>

<style scoped>
/* Local styles */
</style>
```

### `src/interfaces/`

TypeScript interface definitions:

{{< mermaid >}}
graph TD
    Interfaces["📁 src/interfaces/"]
    Interfaces --> Battery["📄 battery.ts<br/><small>Battery interface</small>"]
    Interfaces --> Notifications["📄 notifications.ts<br/><small>Notification interface</small>"]
    Interfaces --> Tray["📄 tray.ts<br/><small>Tray interface</small>"]
    
    style Interfaces fill:#667eea,stroke:#764ba2,color:#fff
    style Battery fill:#43e97b,stroke:#38f9d7,color:#fff
    style Notifications fill:#43e97b,stroke:#38f9d7,color:#fff
    style Tray fill:#43e97b,stroke:#38f9d7,color:#fff
{{< /mermaid >}}

**Example**:
```typescript
// battery.ts
export interface Battery {
  level: number;
  status: 'charging' | 'discharging' | 'full';
  timeRemaining?: number;
}
```

### `src/layouts/`

Page layouts/templates:

{{< mermaid >}}
graph TD
    Layouts["📁 src/layouts/"]
    Layouts --> ConfigLayout["📄 ConfigAppLayout.vue<br/><small>Layout for the configuration</small>"]
    
    style Layouts fill:#667eea,stroke:#764ba2,color:#fff
    style ConfigLayout fill:#f093fb,stroke:#f5576c,color:#fff
{{< /mermaid >}}

**Usage**: wraps views to keep the structure consistent

### `src/routes/`

Vue Router routing configuration:

{{< mermaid >}}
graph TD
    Routes["📁 src/routes/"]
    Routes --> IndexTs["📄 index.ts<br/><small>Route configuration</small>"]
    
    style Routes fill:#667eea,stroke:#764ba2,color:#fff
    style IndexTs fill:#4facfe,stroke:#00f2fe,color:#fff
{{< /mermaid >}}

**Example**:
```typescript
export const routes = [
  { path: '/', component: DesktopView },
  { path: '/panel', component: PanelView },
  { path: '/menu', component: MenuView },
];
```

### `src/tools/`

Controllers and services (business logic):

{{< mermaid >}}
graph TD
    Tools["📁 src/tools/"]
    Tools --> BatteryCtrl["📄 battery.controller.ts<br/><small>Battery logic</small>"]
    Tools --> BluetoothCtrl["📄 bluetooth.controller.ts<br/><small>Bluetooth logic</small>"]
    Tools --> NetworkCtrl["📄 network.controller.ts<br/><small>Network logic</small>"]
    Tools --> TrayCtrl["📄 tray.controller.ts<br/><small>Tray logic</small>"]
    
    style Tools fill:#667eea,stroke:#764ba2,color:#fff
    style BatteryCtrl fill:#feca57,stroke:#ff9a56,color:#fff
    style BluetoothCtrl fill:#feca57,stroke:#ff9a56,color:#fff
    style NetworkCtrl fill:#feca57,stroke:#ff9a56,color:#fff
    style TrayCtrl fill:#feca57,stroke:#ff9a56,color:#fff
{{< /mermaid >}}

**Responsibility**:
- Call backend commands
- Process data
- Handle complex logic

### `src/types/`

TypeScript type definitions:

{{< mermaid >}}
graph TD
    Types["📁 src/types/"]
    Types --> LibVasakTypes["📄 vue-libvasak.d.ts<br/><small>Types from external libraries</small>"]
    
    style Types fill:#667eea,stroke:#764ba2,color:#fff
    style LibVasakTypes fill:#fa709a,stroke:#f5576c,color:#fff
{{< /mermaid >}}

**Usage**: extends library types or defines global types

### `src/views/`

Main views/pages:

{{< mermaid >}}
graph TD
    Views["📁 views/"]
    Views --> ControlCenter["📄 ControlCenterView.vue<br/><small>Control center</small>"]
    Views --> Desktop["📄 DesktopView.vue<br/><small>Desktop</small>"]
    Views --> Menu["📄 MenuView.vue<br/><small>App menu</small>"]
    Views --> Panel["📄 PanelView.vue<br/><small>Panel</small>"]
    Views --> Applets["📁 applets/<br/><small>Mini-applications</small>"]
    Views --> Apps["📁 apps/<br/><small>Applications</small>"]
    
    Applets --> AudioApplet["📄 AudioAppletView.vue<br/><small>Audio applet</small>"]
    Applets --> BluetoothApplet["📄 BluetoothAppletView.vue<br/><small>Bluetooth applet</small>"]
    Applets --> NetworkApplet["📄 NetworkAppletView.vue<br/><small>Network applet</small>"]
    
    Apps --> Settings["📄 SettingsApp.vue<br/><small>Settings application</small>"]
    Apps --> FileManager["📄 FileManagerView.vue<br/><small>File manager</small>"]
    
    style Views fill:#667eea,stroke:#764ba2,color:#fff
    style ControlCenter fill:#f093fb,stroke:#f5576c,color:#fff
    style Desktop fill:#f093fb,stroke:#f5576c,color:#fff
    style Menu fill:#f093fb,stroke:#f5576c,color:#fff
    style Panel fill:#f093fb,stroke:#f5576c,color:#fff
    style Applets fill:#4facfe,stroke:#00f2fe,color:#fff
    style Apps fill:#4facfe,stroke:#00f2fe,color:#fff
    style AudioApplet fill:#43e97b,stroke:#38f9d7,color:#fff
    style BluetoothApplet fill:#43e97b,stroke:#38f9d7,color:#fff
    style NetworkApplet fill:#43e97b,stroke:#38f9d7,color:#fff
    style Settings fill:#43e97b,stroke:#38f9d7,color:#fff
    style FileManager fill:#43e97b,stroke:#38f9d7,color:#fff
{{< /mermaid >}}

## Backend (`src-tauri/`)

### Tauri Structure

{{< mermaid >}}
graph LR
    TauriRoot["📁 src-tauri/"]
    TauriRoot --> CargoToml["📄 Cargo.toml"]
    TauriRoot --> CargoLock["📄 Cargo.lock"]
    TauriRoot --> BuildRs["📄 build.rs"]
    TauriRoot --> TauriConf["📄 tauri.conf.json"]
    TauriRoot --> Capabilities["📁 capabilities/"]
    TauriRoot --> Gen["📁 gen/"]
    TauriRoot --> Icons["📁 icons/"]
    TauriRoot --> Src["📁 src/<br/><small>Rust source code</small>"]
    TauriRoot --> Target["📁 target/<br/><small>Build</small>"]
    TauriRoot --> Tests["📁 tests/"]
    
    Src --> LibRs["📄 lib.rs<br/><small>Main modules</small>"]
    Src --> MainRs["📄 main.rs<br/><small>Entry point</small>"]
    Src --> ErrorRs["📄 error.rs"]
    Src --> StructsRs["📄 structs.rs"]
    Src --> Commands["📁 commands/<br/><small>IPC handlers</small>"]
    Src --> WindowMgr["📁 window_manager/"]
    Src --> Audio["📁 audio.rs"]
    Src --> DBus["📁 dbus_service.rs"]
    Src --> Tray["📁 tray/"]
    Src --> Utils["📁 utils/"]
    
    Icons --> Icon128["🖼️ 128x128.png"]
    Icons --> Icon256["🖼️ 256x256.png"]
    
    Commands --> ModRs["📄 mod.rs"]
    Commands --> AudioCmd["📄 audio_commands.rs"]
    Commands --> BTCmd["📄 bluetooth_commands.rs"]
    
    WindowMgr --> WinCtrl["📄 window_controller.rs"]
    WindowMgr --> MonitorH["📄 monitor_handler.rs"]
    
    Tray --> TrayMod["📄 mod.rs"]
    Tray --> TrayIcon["📄 tray_icon.rs"]
    
    style TauriRoot fill:#667eea,stroke:#764ba2,color:#fff
    style CargoToml fill:#f093fb,stroke:#f5576c,color:#fff
    style CargoLock fill:#f093fb,stroke:#f5576c,color:#fff
    style BuildRs fill:#f093fb,stroke:#f5576c,color:#fff
    style TauriConf fill:#f093fb,stroke:#f5576c,color:#fff
    style Src fill:#4facfe,stroke:#00f2fe,color:#fff
    style Commands fill:#4facfe,stroke:#00f2fe,color:#fff
    style WindowMgr fill:#4facfe,stroke:#00f2fe,color:#fff
    style Tray fill:#4facfe,stroke:#00f2fe,color:#fff
    style Utils fill:#4facfe,stroke:#00f2fe,color:#fff
{{< /mermaid >}}

### `src-tauri/src/lib.rs`

Defines the main modules:

```rust
// Core modules - core modules
mod app_url;
mod constants;
mod error;
mod structs;

// Feature modules - feature modules
mod applets;
mod audio;
mod brightness;
mod commands;
mod dbus_service;
mod eventloops;
mod menu_manager;
mod monitor_manager;
mod notifications;
mod tray;
mod utils;
mod window_manager;
mod windows_apps;
```

### `src-tauri/src/main.rs`

Simple entry point:

```rust
fn main() {
    vasak_desktop_lib::run()
}
```

### `src-tauri/src/commands/`

IPC command handlers:

```rust
// Reachable from the frontend
#[tauri::command]
pub fn get_volume() -> Result<u32, String> { ... }

#[tauri::command]
pub fn set_volume(level: u32) -> Result<(), String> { ... }

#[tauri::command]
pub async fn list_wifi_networks() -> Result<Vec<Network>, String> { ... }
```

### `src-tauri/src/window_manager/`

Window and monitor management:

```rust
// window_controller.rs - Window control
pub fn create_window() { ... }
pub fn close_window() { ... }

// monitor_handler.rs - Monitor handling
pub fn detect_monitors() { ... }
pub fn arrange_windows() { ... }
```

### System Integration Modules

```
audio.rs              - Volume control, devices
brightness.rs        - Screen brightness control
bluetooth.rs         - Pairing, device connection
network.rs           - WiFi scanning, connecting to networks
notifications.rs     - Showing system notifications
dbus_service.rs      - D-Bus initialization and handling
```

### `src-tauri/tauri.conf.json`

Tauri configuration:

```json
{
  "build": {
    "beforeDevCommand": "bun run dev",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "bun run build",
    "devPath": "../src",
    "distDir": "../dist",
    "withGlobalTauri": false
  },
  "app": {
    "windows": [
      {
        "title": "Vasak Desktop",
        "label": "main",
        "width": 1024,
        "height": 768
      }
    ]
  }
}
```

## Configuration (`/.`)

### `package.json`

Defines the frontend scripts and dependencies:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "tauri": "tauri"
  }
}
```

**Available scripts**:
- `bun run dev` - Development
- `bun run build` - Build
- `bun run preview` - Preview the build
- `bun run tauri` - Tauri CLI

### `tsconfig.json`

TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### `vite.config.ts`

Vite configuration:

```typescript
// Controls:
// - The frontend build
// - Hot reload
// - Optimizations
// - Aliases
```

### `.env` File

Environment variables (if it exists):

```
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

## Generated Directories (Do Not Commit)

### `node_modules/`

Frontend dependencies (generated by `bun install`):

```
node_modules/
├── vue/
├── @tauri-apps/
├── tailwindcss/
└── (hundreds more)
```

**Ignored in**: `.gitignore`

### `src-tauri/target/`

Rust build artifacts:

```
target/
├── debug/
│   ├── vasak-desktop      # Debug binary
│   └── deps/
├── release/
│   ├── vasak-desktop      # Release binary
│   └── deps/
└── (intermediate builds)
```

**Ignored in**: `.gitignore`

### `dist/`

Frontend build output:

```
dist/
├── index.html
├── assets/
│   ├── main.xxxxx.js     # Compiled JS
│   └── main.xxxxx.css    # Compiled CSS
└── (other assets)
```

**Generated by**: `npm run build`

## Naming Patterns

### Vue Components

- PascalCase: `UserCard.vue`, `AudioControl.vue`
- The file must match the component name

### Rust Files

- snake_case: `audio_commands.rs`, `window_controller.rs`
- Modules match the file names

### Import Paths

```typescript
// Frontend
import Component from '@/components/cards/UserCard.vue';
import { battery } from '@/tools/battery.controller';

// Backend (Rust)
use crate::audio::get_volume;
use crate::dbus_service::DbusService;
```

## Structure Best Practices

### ✅ Do:
- Keep components small and focused
- Group related things in folders
- Use clear naming conventions
- Document complex modules

### ❌ Don't:
- Mix responsibilities in one file
- Create purposeless "misc folders"
- Ignore the established structure
- Create excessive folder depth
