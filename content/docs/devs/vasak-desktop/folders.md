---
title: "Sistema de Carpetas | vasak-desktop"
weight: 20
description: "Estructura de carpetas de Vasak Desktop: qué vive en cada directorio y cómo se relacionan entre sí."
---

Guía detallada sobre la estructura de carpetas del proyecto.

## Estructura Raíz

{{< mermaid >}}
graph TD
    Root["📁 vasak-desktop/"]
    
    Root --> Src["📁 src/<br/><small>Frontend Vue.js</small>"]
    Root --> SrcTauri["📁 src-tauri/<br/><small>Backend Rust</small>"]
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

### Raíz de Frontend

{{< mermaid >}}
graph TD
    SrcRoot["📁 src/"]
    SrcRoot --> AppVue["📄 App.vue<br/><small>Componente raíz</small>"]
    SrcRoot --> MainTs["📄 main.ts<br/><small>Punto de entrada</small>"]
    SrcRoot --> StyleCss["📄 style.css<br/><small>Estilos globales</small>"]
    SrcRoot --> ViteEnv["📄 vite-env.d.ts<br/><small>Tipos Vite</small>"]
    SrcRoot --> AssetsDir["📁 assets/<br/><small>Recursos estáticos</small>"]
    SrcRoot --> ComponentsDir["📁 components/<br/><small>Componentes reutilizables</small>"]
    SrcRoot --> InterfacesDir["📁 interfaces/<br/><small>Interfaces TS</small>"]
    SrcRoot --> LayoutsDir["📁 layouts/<br/><small>Layouts/Plantillas</small>"]
    SrcRoot --> RoutesDir["📁 routes/<br/><small>Enrutamiento</small>"]
    SrcRoot --> ToolsDir["📁 tools/<br/><small>Controladores</small>"]
    SrcRoot --> TypesDir["📁 types/<br/><small>Tipos TS</small>"]
    SrcRoot --> ViewsDir["📁 views/<br/><small>Vistas/Páginas</small>"]
    
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

Recursos estáticos (imágenes, vectores):

{{< mermaid >}}
graph TD
    Assets["📁 src/assets/"]
    Assets --> Img["📁 img/<br/><small>Imágenes rasterizadas</small>"]
    Assets --> Vectors["📁 vectors/<br/><small>Gráficos vectoriales</small>"]
    
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

**Uso**:
```typescript
import logo from '@/assets/img/logo.png';
// Disponible en plantillas como:
// <img src="@/assets/img/logo.png" />
```

### `src/components/`

Componentes Vue reutilizables:

{{< mermaid >}}
graph LR
    Components["📁 src/components/"]
    Components --> SearchMenu["📄 SearchMenuComponent.vue<br/><small>Búsqueda en menú</small>"]
    Components --> Areas["📁 areas/<br/><small>Áreas grandes</small>"]
    Components --> Buttons["📁 buttons/<br/><small>Botones</small>"]
    Components --> Cards["📁 cards/<br/><small>Tarjetas</small>"]
    Components --> Controls["📁 controls/<br/><small>Controles interactivos</small>"]
    Components --> Icon["📁 icon/<br/><small>Iconos</small>"]
    Components --> Widgets["📁 widgets/<br/><small>Widgets reutilizables</small>"]
    
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

**Estructura de un Componente**:

```vue
<template>
  <div class="component">
    <!-- Contenido -->
  </div>
</template>

<script setup lang="ts">
// Lógica del componente
</script>

<style scoped>
/* Estilos locales */
</style>
```

### `src/interfaces/`

Definiciones de interfaces TypeScript:

{{< mermaid >}}
graph TD
    Interfaces["📁 src/interfaces/"]
    Interfaces --> Battery["📄 battery.ts<br/><small>Interface Battery</small>"]
    Interfaces --> Notifications["📄 notifications.ts<br/><small>Interface Notification</small>"]
    Interfaces --> Tray["📄 tray.ts<br/><small>Interface Tray</small>"]
    
    style Interfaces fill:#667eea,stroke:#764ba2,color:#fff
    style Battery fill:#43e97b,stroke:#38f9d7,color:#fff
    style Notifications fill:#43e97b,stroke:#38f9d7,color:#fff
    style Tray fill:#43e97b,stroke:#38f9d7,color:#fff
{{< /mermaid >}}

**Ejemplo**:
```typescript
// battery.ts
export interface Battery {
  level: number;
  status: 'charging' | 'discharging' | 'full';
  timeRemaining?: number;
}
```

### `src/layouts/`

Layouts/Plantillas de página:

{{< mermaid >}}
graph TD
    Layouts["📁 src/layouts/"]
    Layouts --> ConfigLayout["📄 ConfigAppLayout.vue<br/><small>Layout para configuración</small>"]
    
    style Layouts fill:#667eea,stroke:#764ba2,color:#fff
    style ConfigLayout fill:#f093fb,stroke:#f5576c,color:#fff
{{< /mermaid >}}

**Uso**: Envuelve vistas para mantener estructura consistente

### `src/routes/`

Configuración de enrutamiento Vue Router:

{{< mermaid >}}
graph TD
    Routes["📁 src/routes/"]
    Routes --> IndexTs["📄 index.ts<br/><small>Configuración de rutas</small>"]
    
    style Routes fill:#667eea,stroke:#764ba2,color:#fff
    style IndexTs fill:#4facfe,stroke:#00f2fe,color:#fff
{{< /mermaid >}}

**Ejemplo**:
```typescript
export const routes = [
  { path: '/', component: DesktopView },
  { path: '/panel', component: PanelView },
  { path: '/menu', component: MenuView },
];
```

### `src/tools/`

Controladores y servicios (Business Logic):

{{< mermaid >}}
graph TD
    Tools["📁 src/tools/"]
    Tools --> BatteryCtrl["📄 battery.controller.ts<br/><small>Lógica de batería</small>"]
    Tools --> BluetoothCtrl["📄 bluetooth.controller.ts<br/><small>Lógica de Bluetooth</small>"]
    Tools --> NetworkCtrl["📄 network.controller.ts<br/><small>Lógica de red</small>"]
    Tools --> TrayCtrl["📄 tray.controller.ts<br/><small>Lógica de bandeja</small>"]
    
    style Tools fill:#667eea,stroke:#764ba2,color:#fff
    style BatteryCtrl fill:#feca57,stroke:#ff9a56,color:#fff
    style BluetoothCtrl fill:#feca57,stroke:#ff9a56,color:#fff
    style NetworkCtrl fill:#feca57,stroke:#ff9a56,color:#fff
    style TrayCtrl fill:#feca57,stroke:#ff9a56,color:#fff
{{< /mermaid >}}

**Responsabilidad**: 
- Llamar comandos del backend
- Procesar datos
- Manejar lógica compleja

### `src/types/`

Definiciones de tipos TypeScript:

{{< mermaid >}}
graph TD
    Types["📁 src/types/"]
    Types --> LibVasakTypes["📄 vue-libvasak.d.ts<br/><small>Tipos de librerías externas</small>"]
    
    style Types fill:#667eea,stroke:#764ba2,color:#fff
    style LibVasakTypes fill:#fa709a,stroke:#f5576c,color:#fff
{{< /mermaid >}}

**Uso**: Extiende tipos de librerías o define tipos globales

### `src/views/`

Vistas/Páginas principales:

{{< mermaid >}}
graph TD
    Views["📁 src/views/"]
    Views --> ControlCenter["📄 ControlCenterView.vue<br/><small>Centro de control</small>"]
    Views --> Desktop["📄 DesktopView.vue<br/><small>Escritorio</small>"]
    Views --> Menu["📄 MenuView.vue<br/><small>Menú de apps</small>"]
    Views --> Panel["📄 PanelView.vue<br/><small>Panel</small>"]
    Views --> Applets["📁 applets/<br/><small>Mini-aplicaciones</small>"]
    Views --> Apps["📁 apps/<br/><small>Aplicaciones</small>"]
    
    Applets --> AudioApplet["📄 AudioAppletView.vue<br/><small>Applet de audio</small>"]
    Applets --> BluetoothApplet["📄 BluetoothAppletView.vue<br/><small>Applet de Bluetooth</small>"]
    Applets --> NetworkApplet["📄 NetworkAppletView.vue<br/><small>Applet de red</small>"]
    
    Apps --> Settings["📄 SettingsApp.vue<br/><small>Aplicación de Settings</small>"]
    Apps --> FileManager["📄 FileManagerView.vue<br/><small>Gestor de archivos</small>"]
    
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

### Estructura Tauri

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
    TauriRoot --> Src["📁 src/<br/><small>Código fuente Rust</small>"]
    TauriRoot --> Target["📁 target/<br/><small>Compilación</small>"]
    TauriRoot --> Tests["📁 tests/"]
    
    Src --> LibRs["📄 lib.rs<br/><small>Módulos principales</small>"]
    Src --> MainRs["📄 main.rs<br/><small>Punto de entrada</small>"]
    Src --> ErrorRs["📄 error.rs"]
    Src --> StructsRs["📄 structs.rs"]
    Src --> Commands["📁 commands/<br/><small>Manejadores IPC</small>"]
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

Define módulos principales:

```rust
// Core modules - Módulos principales del núcleo
mod app_url;
mod constants;
mod error;
mod structs;

// Feature modules - Módulos de funcionalidades
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

Punto de entrada simple:

```rust
fn main() {
    vasak_desktop_lib::run()
}
```

### `src-tauri/src/commands/`

Manejadores de comandos IPC:

```rust
// Accesibles desde Frontend
#[tauri::command]
pub fn get_volume() -> Result<u32, String> { ... }

#[tauri::command]
pub fn set_volume(level: u32) -> Result<(), String> { ... }

#[tauri::command]
pub async fn list_wifi_networks() -> Result<Vec<Network>, String> { ... }
```

### `src-tauri/src/window_manager/`

Gestión de ventanas y monitores:

```rust
// window_controller.rs - Control de ventanas
pub fn create_window() { ... }
pub fn close_window() { ... }

// monitor_handler.rs - Manejo de monitores
pub fn detect_monitors() { ... }
pub fn arrange_windows() { ... }
```

### Módulos de Integración del Sistema

```
audio.rs              - Control de volumen, dispositivos
brightness.rs        - Control de brillo de pantalla
bluetooth.rs         - Emparejamiento, conexión de dispositivos
network.rs           - Escaneo WiFi, conexión a redes
notifications.rs     - Mostrar notificaciones del sistema
dbus_service.rs      - Inicialización y manejo D-Bus
```

### `src-tauri/tauri.conf.json`

Configuración de Tauri:

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

## Configuración (`/.`)

### `package.json`

Define scripts y dependencias del frontend:

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

**Scripts disponibles**:
- `bun run dev` - Desarrollo
- `bun run build` - Compilación
- `bun run preview` - Vista previa de build
- `bun run tauri` - CLI de Tauri

### `tsconfig.json`

Configuración de TypeScript:

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

Configuración de Vite:

```typescript
// Controla:
// - Build del frontend
// - Hot reload
// - Optimizaciones
// - Aliases
```

### Archivo `.env`

Variables de entorno (si existe):

```
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

## Directorios Generados (No Commitear)

### `node_modules/`

Dependencias del frontend (generadas por `bun install`):

```
node_modules/
├── vue/
├── @tauri-apps/
├── tailwindcss/
└── (cientos más)
```

**Ignorado en**: `.gitignore`

### `src-tauri/target/`

Artefactos de compilación Rust:

```
target/
├── debug/
│   ├── vasak-desktop      # Binario debug
│   └── deps/
├── release/
│   ├── vasak-desktop      # Binario release
│   └── deps/
└── (compilaciones intermedias)
```

**Ignorado en**: `.gitignore`

### `dist/`

Build del frontend:

```
dist/
├── index.html
├── assets/
│   ├── main.xxxxx.js     # JS compilado
│   └── main.xxxxx.css    # CSS compilado
└── (otros assets)
```

**Generado por**: `npm run build`

## Patrones de Nombres

### Componentes Vue

- PascalCase: `UserCard.vue`, `AudioControl.vue`
- Archivo debe coincidir con nombre del componente

### Archivos Rust

- snake_case: `audio_commands.rs`, `window_controller.rs`
- Módulos coinciden con nombres de archivo

### Rutas de Importación

```typescript
// Frontend
import Component from '@/components/cards/UserCard.vue';
import { battery } from '@/tools/battery.controller';

// Backend (Rust)
use crate::audio::get_volume;
use crate::dbus_service::DbusService;
```

## Mejores Prácticas de Estructura

### ✅ Haz:
- Mantén componentes pequeños y enfocados
- Agrupa relacionados en carpetas
- Usa convenciones de nombres claras
- Documenta módulos complejos

### ❌ No hagas:
- Mezcles responsabilidades en un archivo
- Crees "carpetas misc" sin propósito
- Ignores la estructura establecida
- Crees mucha profundidad de carpetas

