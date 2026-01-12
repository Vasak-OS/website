---
title: "Arquitectura General | vasak-desktop"
weight: 15
---

Visión general de la arquitectura de Vasak Desktop y cómo se estructuran los componentes.

## ¿Qué es Vasak Desktop?

Vasak Desktop NO es un entorno de escritorio completo (como GNOME o KDE). Es una **interfaz de escritorio ligera** que no cuenta con un **WM** propio pero que proporciona:

- **Panel Superior** - Barra de tareas con applets de sistema
- **Vista de Escritorio** - Fondo con widgets opcionales
- **Control Center** - Acceso rápido a configuración
- **Menú de Aplicaciones** - Búsqueda y lanzamiento de apps
- **File Manager** - Herramienta para revisar archivos
- **Search Launcher** - Herramienta de busqueda rapida 
- **Config Manager** - Herramienta de configuracion del sistema operativo

Se ejecuta como varias ventanas de Tauri independientes que se comunican vía IPC.

> El resto de herramientas de VasakOS que no comparten el Backend con el desktop comparten una arquitectura similar y pueden integrarse de la misma manera con las configuraciones del desktop

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                         │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    ┌────▼────────┐          ┌──────▼─────────┐
    │  Ventana    │          │   Ventana      │
    │  PANEL      │          │   DESKTOP      │
    │  (Top Bar)  │          │   (Background) │
    └────┬────────┘          └────┬───────────┘
         │                        │
         └────────┬───────────────┘
                  │
         ┌────────▼────────────┐
         │  Frontend Vue.js    │
         │  (TypeScript + CSS) │
         └────────┬────────────┘
                  │
         ┌────────▼────────────────────┐
         │  IPC (Tauri Bridge)         │
         │  Frontend ←→ Backend        │
         └────────┬────────────────────┘
                  │
         ┌────────▼────────────────────┐
         │  Backend Rust (Tauri)       │
         │  - Comandos de sistema      │
         │  - Integración D-Bus        │
         │  - Gestión de ventanas      │
         └────────┬────────────────────┘
                  │
    ┌─────────────┼──────────────┐
    │             │              │
┌───▼───┐   ┌────▼────┐   ┌────▼────┐
│ D-Bus │   │ GTK     │   │ System  │
│ (IPC) │   │ (Theme) │   │ (FS/IO) │
└───┬───┘   └─────────┘   └─────────┘
    │
┌───▼──────────────────────────────┐
│ Servicios del Sistema            │
│ (PulseAudio, NetworkManager,     │
│  BlueZ, MPRIS, gsettings...)     │
└──────────────────────────────────┘
```

## Ventanas de la Aplicación

Vasak Desktop se compone de **2 ventanas independientes**:

### Ventana 1: Panel (Top Bar)

```json
{
  "label": "panel",
  "title": "Vasak Panel",
  "width": [ancho de pantalla],
  "height": 40,
  "y": 0,
  "decorations": false,
  "alwaysOnTop": true
}
```

Muestra:
- Menú de aplicaciones
- Widgets (reloj, música)
- Applets de sistema (audio, red, bluetooth, batería)
- Control center

### Ventana 2: Desktop (Background)

```json
{
  "label": "desktop",
  "title": "Vasak Desktop",
  "fullscreen": true,
  "decorations": false,
  "alwaysOnBottom": true,
  "skipTaskbar": true
}
```

Muestra:
- Fondo de escritorio
- Widgets opcionales (clima, reloj)

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend)

**Tecnología**: Vue.js 3.5.18, TypeScript, Tailwind CSS 4.1

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── buttons/        # Botones de interfaz
│   ├── cards/          # Tarjetas de información
│   ├── controls/       # Controles interactivos (audio, brillo, etc.)
│   └── areas/          # Áreas completas (panel, control-center, menu)
├── views/              # Páginas principales
│   ├── PanelView.vue       # Ventana panel superior
│   ├── DesktopView.vue     # Ventana fondo escritorio
│   ├── MenuView.vue        # Vista del menú de apps
│   └── ControlCenterView.vue # Centro de control
├── routes/             # Configuración de rutas
├── tools/              # Controllers (battery, network, bluetooth, tray)
└── main.ts             # Punto de entrada
```

**Flujo de Datos**:
- Componentes → `invoke('command')` → Backend
- Backend → `emit('event')` → Componentes actualizan

### 2. Capa de Comunicación (IPC)

**Tecnología**: Tauri IPC Bridge

Conecta Frontend y Backend:

```
Vue Component → 
  invoke('get_audio_volume') →
    Backend Command Handler →
      D-Bus / System Call →
        Resultado →
          Retorna a Frontend
```

**Seguridad**: Solo comandos explícitamente registrados pueden ser invocados.

### 3. Capa de Lógica (Backend)

**Tecnología**: Rust 1.70+, Tauri 2.x

```
src-tauri/src/
├── main.rs              # Punto de entrada, setup de ventanas
├── lib.rs              # Registro de comandos y módulos
├── commands/           # Manejadores de comandos IPC
│   ├── audio.rs        # Control de audio (volumen, mute, dispositivos)
│   ├── bluetooth.rs    # Control de bluetooth
│   ├── network.rs      # Control de red
│   ├── brightness.rs   # Control de brillo
│   ├── notifications.rs # Sistema de notificaciones
│   ├── shortcuts.rs    # Gestión de atajos de teclado
│   ├── search.rs       # Búsqueda global de aplicaciones
│   ├── system_config.rs # Configuración del sistema (tema, iconos)
│   ├── theme.rs        # Temas GTK, iconos, cursores
│   └── session.rs      # Logout, shutdown, reboot, suspend
├── window_manager/     # Gestión de ventanas Tauri
├── monitor_manager.rs  # Gestión de monitores
├── dbus_service.rs     # Integración D-Bus
├── audio.rs           # Módulo de audio (backend)
├── brightness.rs      # Módulo de brillo (backend)
├── notifications.rs   # Sistema de notificaciones (backend)
├── tray/              # Implementación de tray icons
├── utils/             # Funciones de utilidad
│   ├── shortcuts/     # Sistema de atajos
│   └── search/        # Motor de búsqueda
└── structs.rs         # Estructuras compartidas
```

**Responsabilidades del Backend**:
- Ejecutar comandos del sistema vía shell o APIs nativas
- Comunicar con servicios del sistema vía D-Bus
- Gestionar eventos de hardware y notificaciones
- Aplicar configuración del sistema (gsettings, archivos de config)
- Manejar las ventanas de Tauri

### 4. Capa de Integración del Sistema (D-Bus)

**Tecnología**: Zbus (Rust) + D-Bus

Interfaz estándar de Linux para:
- Control de audio (PulseAudio/PipeWire)
- Bluetooth (BlueZ)
- Red (NetworkManager)
- Notificaciones (Freedesktop)
- Energía (UPower)

Ver [D-Bus](dbus.md) para más detalles.

### 5. Capa de Hardware/SO

**Componentes del Sistema**:
- PulseAudio / PipeWire (Audio)
- BlueZ (Bluetooth)
- NetworkManager (Red)
- X11 / Wayland (Ventanas)
- Compositor (Efectos visuales)

> El soporte actual sobre Wayland es **EXPERIMENTAL**

## Flujo de Datos Típico

### Ejemplo: Cambiar Volumen

```
1. Usuario: Mueve slider de volumen en Control Center
2. Vue Component: emit('volume-changed', newValue)
3. Pinia Store: actualiza estado local
4. Backend Handler: invoke('set_audio_volume', {level: 50})
5. IPC Bridge: Tauri envía comando al backend
6. Backend Rust: 
   - Conecta a D-Bus (PulseAudio/PipeWire)
   - Ejecuta: pactl set-sink-volume @DEFAULT_SINK@ 50%
7. Sistema OS: Cambia volumen real
8. D-Bus Event: Emite evento de cambio
9. Backend escucha: Recibe confirmación
10. Backend emite: event('audio_volume_changed', newValue)
11. Vue escucha: Recibe evento
12. Vue actualiza: Refleja el cambio visual
```

## Estructura de Directorios

### Frontend (`src/`)

```
src/
├── App.vue                    # Componente raíz
├── main.ts                   # Entry point
├── style.css                 # Estilos globales
├── vite-env.d.ts            # Tipos Vite
│
├── assets/                   # Recursos estáticos
│   ├── img/
│   └── vectors/
│
├── components/              # Componentes reutilizables
│   ├── SearchMenuComponent.vue
│   ├── areas/              # Áreas grandes
│   │   ├── panel/
│   │   ├── control-center/
│   │   ├── menu/
│   │   └── ...
│   ├── buttons/            # Componentes de botones
│   ├── cards/              # Componentes de tarjetas
│   ├── controls/           # Controles interactivos
│   ├── icon/              # Iconos
│   └── widgets/           # Widgets reutilizables
│
├── interfaces/             # Interfaces TypeScript
│   ├── battery.ts
│   ├── notifications.ts
│   └── tray.ts
│
├── layouts/               # Layouts de página
│   └── ConfigAppLayout.vue
│
├── routes/               # Enrutamiento Vue Router
│   └── index.ts
│
├── tools/                # Controladores (lógica)
│   ├── battery.controller.ts
│   ├── bluetooth.controller.ts
│   ├── network.controller.ts
│   └── tray.controller.ts
│
├── types/               # Tipos TypeScript
│   └── vue-libvasak.d.ts
│
└── views/              # Vistas/Páginas principales
    ├── ControlCenterView.vue
    ├── DesktopView.vue
    ├── MenuView.vue
    ├── PanelView.vue
    ├── applets/       # Vistas de pequeñas app
    └── apps/          # Vistas de apps
```

### Backend (`src-tauri/src/`)

```
src-tauri/src/
├── lib.rs                    # Módulos principales
├── main.rs                   # Entry point
├── error.rs                 # Manejador de errores
├── structs.rs               # Estructuras compartidas
├── constants.rs             # Constantes
│
├── commands/                # Comandos IPC
│   ├── audio_commands.rs
│   ├── bluetooth_commands.rs
│   ├── network_commands.rs
│   └── ...
│
├── window_manager/          # Gestión de ventanas
│   ├── mod.rs
│   ├── window_controller.rs
│   └── monitor_handler.rs
│
├── audio.rs                # Control de audio
├── brightness.rs           # Control de brillo
├── bluetooth.rs            # Bluetooth control
├── network.rs              # Network control
├── notifications.rs        # Sistema notificaciones
│
├── dbus_service.rs         # D-Bus integration
├── eventloops.rs           # Bucles de eventos
├── platform_shortcuts.rs   # Atajos de teclado
├── menu_manager.rs         # Gestión de menús
│
├── tray/                   # Bandeja del sistema
│   ├── mod.rs
│   └── tray_icon.rs
│
├── applets/                # Mini-aplicaciones
│   └── ...
│
├── utils/                  # Funciones de utilidad
│   └── ...
│
└── windows_apps/          # Manejo de aplicaciones
    └── ...
```

## Patrones de Diseño

### 1. MVC (Model-View-Controller)

**Frontend**:
- **Model**: Pinia stores
- **View**: Vue components
- **Controller**: Métodos en componentes

**Backend**:
- **Model**: Estructuras en `structs.rs`
- **Controller**: Funciones en `commands/`
- **Business Logic**: Módulos especializados

### 2. Pub-Sub (Publicar-Suscribirse)

Para eventos del sistema:

```rust
// Backend: Emitir evento
window.emit("audio_volume_changed", {level: 50})?;
```

```js
// Frontend: Escuchar evento
onMounted(() => {
  listen('audio_volume_changed', (event) => {
    state.volume = event.payload.level;
  });
});
```

### 3. Service Layer

Cada funcionalidad tiene su capa de servicio:
- `audio.rs` - Servicio de audio
- `network.rs` - Servicio de red
- `bluetooth.rs` - Servicio de Bluetooth

## Flujos de Información

### Comando (Frontend → Backend)

```typescript
// Frontend
import { invoke } from '@tauri-apps/api/tauri';

const result = await invoke('set_brightness', { 
  level: 75 
});
```

```rust
// Backend
#[tauri::command]
pub fn set_brightness(level: u32) -> Result<(), String> {
    brightness::set_level(level)?;
    Ok(())
}
```

### Evento (Backend → Frontend)

```rust
// Backend
window.emit("brightness_changed", json!({
    "level": 75
}))?;
```

```typescript
// Frontend
import { listen } from '@tauri-apps/api/event';

listen('brightness_changed', (event) => {
  console.log('Brillo:', event.payload.level);
});
```

## Configuración y Manifiestos

### `tauri.conf.json`

Define permisos y configuración de Tauri:

```json
{
  "build": {
    "beforeDevCommand": "bun run dev",
    "devUrl": "http://localhost:5173"
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

### `Cargo.toml`

Dependencias y configuración de Rust.

### `tsconfig.json`

Configuración de TypeScript.

### `vite.config.ts`

Configuración de build del frontend.

## Siguientes Pasos

- [D-Bus](dbus.md) - Sistema de comunicación
- [Sistema de Carpetas](carpetas.md) - Detalles de estructura
- [Comandos Rust](comandos-rust.md) - Desarrollo backend
- [Componentes Vue](componentes-vue.md) - Desarrollo frontend
