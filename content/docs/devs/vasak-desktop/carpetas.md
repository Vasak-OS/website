---
title: "Sistema de Carpetas | vasak-desktop"
weight: 20
---

Guía detallada sobre la estructura de carpetas del proyecto.

## Estructura Raíz

```
vasak-desktop/
├── src/                          # Frontend (Vue.js)
├── src-tauri/                    # Backend (Rust)
├── docs/                         # Documentación (Este directorio)
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias Frontend
├── tsconfig.json                 # Configuración TypeScript
├── tsconfig.node.json            # TypeScript para Node
├── vite.config.ts                # Configuración Vite
├── postcss.config.js             # Configuración PostCSS
├── tailwind.config.js            # Configuración Tailwind
├── LICENSE                       # Licencia del proyecto
├── README.md                     # Documentación principal
└── .gitignore                    # Archivos a ignorar en Git
```

## Frontend (`src/`)

### Raíz de Frontend

```
src/
├── App.vue                       # Componente raíz
├── main.ts                       # Punto de entrada
├── style.css                     # Estilos globales
├── vite-env.d.ts                # Tipos de entorno Vite
├── assets/                       # Recursos estáticos
├── components/                   # Componentes reutilizables
├── interfaces/                   # Interfaces TypeScript
├── layouts/                      # Layouts/Plantillas
├── routes/                       # Enrutamiento
├── tools/                        # Controladores/Servicios
├── types/                        # Tipos TypeScript
└── views/                        # Vistas/Páginas
```

### `src/assets/`

Recursos estáticos (imágenes, vectores):

```
src/assets/
├── img/                          # Imágenes rasterizadas
│   ├── logo.png
│   ├── background.jpg
│   └── ...
└── vectors/                      # Gráficos vectoriales
    ├── icons/
    ├── illustrations/
    └── ...
```

**Uso**:
```typescript
import logo from '@/assets/img/logo.png';
// Disponible en plantillas como:
// <img src="@/assets/img/logo.png" />
```

### `src/components/`

Componentes Vue reutilizables:

```
src/components/
├── SearchMenuComponent.vue       # Búsqueda en menú
│
├── areas/                        # Áreas grandes de interfaz
│   ├── audio/
│   │   ├── AudioApplet.vue
│   │   └── AudioPanel.vue
│   ├── bluetooth/
│   │   ├── BluetoothDeviceList.vue
│   │   └── BluetoothSettings.vue
│   ├── network/
│   │   ├── WiFiList.vue
│   │   └── NetworkSettings.vue
│   ├── panel/
│   │   ├── SystemPanel.vue
│   │   ├── TrayArea.vue
│   │   └── ClockWidget.vue
│   ├── control-center/
│   │   ├── ControlCenter.vue
│   │   └── QuickSettings.vue
│   ├── menu/
│   │   ├── AppMenu.vue
│   │   └── AppGrid.vue
│   └── configuration/
│       ├── Settings.vue
│       └── Preferences.vue
│
├── buttons/                      # Componentes de botones
│   ├── AppMenuButton.vue        # Botón del menú de aplicaciones
│   ├── CategoryMenuPill.vue      # Píldora de categoría
│   ├── ConfigSidebarButton.vue   # Botón de barra lateral
│   ├── SessionButton.vue         # Botón de sesión
│   ├── TrayIconBattery.vue       # Icono de batería
│   ├── TrayIconBluetooth.vue     # Icono de Bluetooth
│   ├── TrayIconNetwork.vue       # Icono de red
│   ├── TrayIconSound.vue         # Icono de sonido
│   └── WindowPanelButton.vue     # Botón del panel
│
├── cards/                        # Componentes de tarjetas
│   ├── AppMenuCard.vue          # Tarjeta de menú
│   ├── BluetoothDeviceCard.vue   # Tarjeta de dispositivo BT
│   ├── CurrentWeatherCard.vue    # Tarjeta de clima actual
│   ├── DailyWeatherCard.vue      # Tarjeta de clima diario
│   ├── NetworkWiFiCard.vue       # Tarjeta de WiFi
│   ├── NotificationCard.vue      # Tarjeta de notificación
│   ├── NotificationGroupCard.vue # Grupo de notificaciones
│   ├── UserControlCenterCard.vue # Tarjeta de usuario
│   └── UserMenuCard.vue          # Tarjeta de menú de usuario
│
├── controls/                     # Controles interactivos
│   ├── AudioDeviceSelector.vue   # Selector de dispositivo audio
│   ├── BluetoothControl.vue      # Control de Bluetooth
│   ├── BrightnessControl.vue     # Control de brillo
│   ├── NetworkControl.vue        # Control de red
│   ├── SearchButtonControl.vue   # Control de búsqueda
│   ├── ThemeToggle.vue           # Toggle de tema
│   ├── TrayMusicControl.vue      # Control de música
│   └── VolumeControl.vue         # Control de volumen
│
├── icon/                         # Componentes de iconos
│   └── WeatherIcon.vue          # Icono del clima
│
└── widgets/                      # Widgets reutilizables
    ├── DesktopClockWidget.vue   # Reloj en escritorio
    ├── MusicWidget.vue          # Widget de música
    ├── PanelClockwidget.vue     # Reloj en panel
    └── WeatherWidget.vue        # Widget de clima
```

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

```
src/interfaces/
├── battery.ts                    # Interface Battery
├── notifications.ts              # Interface Notification
└── tray.ts                       # Interface Tray
```

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

```
src/layouts/
└── ConfigAppLayout.vue          # Layout para configuración
```

**Uso**: Envuelve vistas para mantener estructura consistente

### `src/routes/`

Configuración de enrutamiento Vue Router:

```
src/routes/
└── index.ts                      # Configuración de rutas
```

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

```
src/tools/
├── battery.controller.ts         # Lógica de batería
├── bluetooth.controller.ts       # Lógica de Bluetooth
├── network.controller.ts         # Lógica de red
└── tray.controller.ts            # Lógica de bandeja
```

**Responsabilidad**: 
- Llamar comandos del backend
- Procesar datos
- Manejar lógica compleja

### `src/types/`

Definiciones de tipos TypeScript:

```
src/types/
└── vue-libvasak.d.ts            # Tipos de librerías externas
```

**Uso**: Extiende tipos de librerías o define tipos globales

### `src/views/`

Vistas/Páginas principales:

```
src/views/
├── ControlCenterView.vue         # Vista del centro de control
├── DesktopView.vue              # Vista del escritorio
├── MenuView.vue                 # Vista del menú de apps
├── PanelView.vue                # Vista del panel
├── applets/                      # Vistas de mini-aplicaciones
│   ├── AudioAppletView.vue      # Applet de audio
│   ├── BluetoothAppletView.vue  # Applet de Bluetooth
│   ├── NetworkAppletView.vue    # Applet de red
│   └── ...
└── apps/                         # Vistas de aplicaciones
    ├── SettingsApp.vue
    ├── FileManagerView.vue
    └── ...
```

## Backend (`src-tauri/`)

### Estructura Tauri

```
src-tauri/
├── Cargo.toml                    # Dependencias Rust
├── Cargo.lock                    # Lock de dependencias
├── build.rs                      # Script de compilación
├── tauri.conf.json               # Configuración Tauri
├── clippy-report.json            # Reporte de linting
│
├── capabilities/                 # Configuración de capacidades
│   └── default.json              # Permisos IPC
│
├── gen/                          # Generado automáticamente
│   └── schemas/
│
├── icons/                        # Iconos de la aplicación
│   ├── 128x128.png
│   ├── 256x256.png
│   └── ...
│
├── src/                          # Código fuente Rust
│   ├── lib.rs                   # Módulos principales
│   ├── main.rs                  # Punto de entrada
│   ├── error.rs                 # Manejo de errores
│   ├── structs.rs               # Estructuras compartidas
│   ├── constants.rs             # Constantes
│   │
│   ├── commands/                # Manejadores de comandos IPC
│   │   ├── mod.rs              # Módulo principal
│   │   ├── audio_commands.rs    # Comandos de audio
│   │   ├── bluetooth_commands.rs# Comandos de Bluetooth
│   │   └── ...
│   │
│   ├── window_manager/          # Gestión de ventanas
│   │   ├── mod.rs
│   │   ├── window_controller.rs # Control de ventanas
│   │   └── monitor_handler.rs   # Manejo de monitores
│   │
│   ├── audio.rs                 # Integración de audio
│   ├── brightness.rs            # Control de brillo
│   ├── bluetooth.rs             # Integración Bluetooth
│   ├── network.rs               # Integración de red
│   ├── notifications.rs         # Sistema de notificaciones
│   │
│   ├── dbus_service.rs          # Integración D-Bus
│   ├── eventloops.rs            # Bucles de eventos
│   ├── platform_shortcuts.rs    # Atajos de teclado
│   ├── menu_manager.rs          # Gestor de menús
│   ├── app_url.rs              # URLs de aplicaciones
│   │
│   ├── tray/                    # Bandeja del sistema
│   │   ├── mod.rs
│   │   └── tray_icon.rs
│   │
│   ├── applets/                 # Mini-aplicaciones
│   │   ├── mod.rs
│   │   └── audio_applet.rs
│   │
│   ├── utils/                   # Funciones de utilidad
│   │   ├── mod.rs
│   │   ├── helpers.rs
│   │   └── ...
│   │
│   └── windows_apps/            # Gestión de aplicaciones
│       ├── mod.rs
│       └── app_launcher.rs
│
├── target/                       # Artefactos de compilación
│   ├── debug/
│   ├── release/
│   └── (binarios compilados)
│
└── tests/                        # Tests Rust
    └── shortcut_mapping_test.rs
```

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

## Directorio `docs/`

Documentación del proyecto:

```
docs/
├── user/                         # Documentación para usuarios
│   ├── README.md
│   ├── logs.md
│   ├── errores.md
│   ├── reporte-errores.md
│   ├── faq.md
│   └── troubleshooting.md
│
└── devs/                         # Documentación para desarrolladores
    ├── README.md
    ├── setup-proyecto.md
    ├── compilacion.md
    ├── dependencias.md
    ├── arquitectura.md
    ├── dbus.md
    ├── carpetas.md               # Este archivo
    ├── lineamientos.md
    ├── componentes-vue.md
    ├── comandos-rust.md
    ├── debugging.md
    └── contribucion.md
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

## Siguientes Pasos

- [Arquitectura General](arquitectura.md)
- [Componentes Vue](componentes-vue.md)
- [Comandos Rust](comandos-rust.md)
