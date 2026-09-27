---
title: "Arquitectura General | vasak-desktop"
weight: 15
description: "Arquitectura general de Vasak Desktop: cómo se estructuran los componentes, los procesos y la comunicación interna."
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
- **Config Manager** - Herramienta de configuración del sistema operativo

Se ejecuta como varias ventanas de Tauri independientes que se comunican vía IPC.

> El resto de herramientas de VasakOS que no comparten el Backend con el desktop comparten una arquitectura similar y pueden integrarse de la misma manera con las configuraciones del desktop

## Arquitectura de Alto Nivel

{{< mermaid >}}
graph TD
    User["👤 USUARIO FINAL"]
    
    Panel["🪟 Ventana PANEL<br/>(Top Bar)"]
    Desktop["🖥️ Ventana DESKTOP<br/>(Background)"]
    
    Frontend["🎨 Frontend Vue.js<br/>(TypeScript + CSS)"]
    
    IPC["🔗 IPC Tauri Bridge<br/>(Frontend ↔ Backend)"]
    
    Backend["⚙️ Backend Rust<br/>- Comandos de sistema<br/>- Integración D-Bus<br/>- Gestión de ventanas"]
    
    DBus["🔌 D-Bus<br/>(IPC)"]
    GTK["🎭 GTK<br/>(Theme)"]
    System["📁 System<br/>(FS/IO)"]
    
    Services["🔧 Servicios del Sistema<br/>(PulseAudio, NetworkManager,<br/>BlueZ, MPRIS, gsettings...)"]
    
    User --> Panel
    User --> Desktop
    Panel --> Frontend
    Desktop --> Frontend
    Frontend --> IPC
    IPC --> Backend
    Backend --> DBus
    Backend --> GTK
    Backend --> System
    DBus --> Services
    
    style User fill:#e1f5ff
    style Panel fill:#fff3e0
    style Desktop fill:#fff3e0
    style Frontend fill:#f3e5f5
    style IPC fill:#ffe0b2
    style Backend fill:#c8e6c9
    style DBus fill:#ffccbc
    style GTK fill:#ffccbc
    style System fill:#ffccbc
    style Services fill:#b3e5fc
{{< /mermaid >}}

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

{{< mermaid >}}
graph LR
    Frontend["🎨 Frontend Vue.js<br/><small>src/</small>"]
    
    Frontend --> App["📄 App.vue<br/><small>Componente raíz</small>"]
    Frontend --> Main["📄 main.ts<br/><small>Entry point</small>"]
    Frontend --> Style["📄 style.css<br/><small>Estilos globales</small>"]
    
    Frontend --> Views["📁 views/<br/><small>Páginas principales</small>"]
    Frontend --> Components["📁 components/<br/><small>Componentes reutilizables</small>"]
    Frontend --> Routes["📁 routes/<br/><small>Configuración de rutas</small>"]
    Frontend --> Tools["📁 tools/<br/><small>Controllers</small>"]
    
    Views --> ViewPanel["📄 PanelView.vue<br/><small>Ventana panel superior</small>"]
    Views --> ViewDesktop["📄 DesktopView.vue<br/><small>Ventana fondo escritorio</small>"]
    Views --> ViewMenu["📄 MenuView.vue<br/><small>Vista del menú de apps</small>"]
    Views --> ViewCC["📄 ControlCenterView.vue<br/><small>Centro de control</small>"]
    
    Components --> CompBtns["📁 buttons/<br/><small>Botones de interfaz</small>"]
    Components --> CompCards["📁 cards/<br/><small>Tarjetas de información</small>"]
    Components --> CompCtrl["📁 controls/<br/><small>Controles interactivos</small>"]
    Components --> CompAreas["📁 areas/<br/><small>Áreas completas</small>"]
    
    CompAreas --> AreaPanel["📁 panel/"]
    CompAreas --> AreaCC["📁 control-center/"]
    CompAreas --> AreaMenu["📁 menu/"]
    
    Tools --> ToolBat["📄 battery.controller.ts"]
    Tools --> ToolNet["📄 network.controller.ts"]
    Tools --> ToolBT["📄 bluetooth.controller.ts"]
    Tools --> ToolTray["📄 tray.controller.ts"]
    
    Routes --> RouteIdx["📄 index.ts"]
    
    style Frontend fill:#667eea,stroke:#764ba2,color:#fff
    style App fill:#f3e5f5,stroke:#ce93d8,color:#000
    style Views fill:#4facfe,stroke:#00f2fe,color:#fff
    style Components fill:#43e97b,stroke:#38f9d7,color:#fff
    style Routes fill:#feca57,stroke:#ff9a56,color:#fff
    style Tools fill:#fa709a,stroke:#f5576c,color:#fff
    style ViewPanel fill:#f3e5f5,stroke:#ce93d8,color:#000
    style ViewDesktop fill:#f3e5f5,stroke:#ce93d8,color:#000
    style ViewMenu fill:#f3e5f5,stroke:#ce93d8,color:#000
    style ViewCC fill:#f3e5f5,stroke:#ce93d8,color:#000
{{< /mermaid >}}

**Flujo de Datos**:
- Componentes → `invoke('command')` → Backend
- Backend → `emit('event')` → Componentes actualizan

### 2. Capa de Comunicación (IPC)

**Tecnología**: Tauri IPC Bridge

{{< mermaid >}}
sequenceDiagram
    participant VueComp as Vue<br/>Component
    participant Invoke as invoke()
    participant IPCBridge as IPC Bridge
    participant BackendCmd as Backend<br/>Command
    participant DBusService as D-Bus /<br/>System Call
    participant Result as Resultado
    
    VueComp->>Invoke: invoke('get_audio_volume')
    activate Invoke
    Invoke->>IPCBridge: envía comando serializado
    deactivate Invoke
    
    activate IPCBridge
    IPCBridge->>BackendCmd: #64 (Backend Handler)
    deactivate IPCBridge
    
    activate BackendCmd
    BackendCmd->>DBusService: consulta D-Bus / llamada sistema
    deactivate BackendCmd
    
    activate DBusService
    DBusService->>Result: obtiene valor (ej: 50%)
    deactivate DBusService
    
    activate Result
    Result->>IPCBridge: retorna respuesta
    deactivate Result
    
    activate IPCBridge
    IPCBridge->>VueComp: resolve Promise con resultado
    deactivate IPCBridge
    
    activate VueComp
    VueComp->>VueComp: actualiza estado local
    deactivate VueComp
    
    Note over VueComp,Result: Solo comandos explícitamente registrados pueden ser invocados
{{< /mermaid >}}

**Seguridad**: Solo comandos explícitamente registrados pueden ser invocados.

### 3. Capa de Lógica (Backend)

**Tecnología**: Rust 1.70+, Tauri 2.x

{{< mermaid >}}
graph LR
    Backend["⚙️ Backend Rust<br/><small>src-tauri/src/</small>"]
    
    Backend --> Main["📄 main.rs<br/><small>Punto de entrada<br/>setup de ventanas</small>"]
    Backend --> Lib["📄 lib.rs<br/><small>Registro de comandos<br/>y módulos</small>"]
    Backend --> Structs["📄 structs.rs<br/><small>Estructuras compartidas</small>"]
    
    Backend --> Commands["📁 commands/<br/><small>Manejadores IPC</small>"]
    Backend --> WindowMgr["📁 window_manager/<br/><small>Gestión de ventanas</small>"]
    Backend --> MonitorMgr["📄 monitor_manager.rs<br/><small>Gestión de monitores</small>"]
    Backend --> DBusService["📄 dbus_service.rs<br/><small>Integración D-Bus</small>"]
    Backend --> Tray["📁 tray/<br/><small>Bandeja del sistema</small>"]
    Backend --> Utils["📁 utils/<br/><small>Funciones de utilidad</small>"]
    
    Commands --> AudioCmd["📄 audio.rs<br/><small>Control de audio</small>"]
    Commands --> BluetoothCmd["📄 bluetooth.rs<br/><small>Control bluetooth</small>"]
    Commands --> NetworkCmd["📄 network.rs<br/><small>Control de red</small>"]
    Commands --> BrightnessCmd["📄 brightness.rs<br/><small>Control de brillo</small>"]
    Commands --> NotificationsCmd["📄 notifications.rs<br/><small>Sistema de notificaciones</small>"]
    Commands --> ShortcutsCmd["📄 shortcuts.rs<br/><small>Gestión de atajos</small>"]
    Commands --> SearchCmd["📄 search.rs<br/><small>Búsqueda de apps</small>"]
    Commands --> SystemConfigCmd["📄 system_config.rs<br/><small>Configuración del SO</small>"]
    Commands --> ThemeCmd["📄 theme.rs<br/><small>Temas GTK, iconos</small>"]
    Commands --> SessionCmd["📄 session.rs<br/><small>Logout, shutdown, suspend</small>"]
    
    WindowMgr --> WinMod["📄 window_controller.rs"]
    
    Utils --> UtilShortcuts["📁 shortcuts/"]
    Utils --> UtilSearch["📁 search/"]
    
    style Backend fill:#667eea,stroke:#764ba2,color:#fff
    style Main fill:#4facfe,stroke:#00f2fe,color:#fff
    style Lib fill:#4facfe,stroke:#00f2fe,color:#fff
    style Structs fill:#4facfe,stroke:#00f2fe,color:#fff
    style Commands fill:#feca57,stroke:#ff9a56,color:#fff
    style WindowMgr fill:#43e97b,stroke:#38f9d7,color:#fff
    style MonitorMgr fill:#43e97b,stroke:#38f9d7,color:#fff
    style DBusService fill:#f093fb,stroke:#f5576c,color:#fff
    style Tray fill:#fa709a,stroke:#f5576c,color:#fff
    style Utils fill:#4facfe,stroke:#00f2fe,color:#fff
    style AudioCmd fill:#43e97b,stroke:#38f9d7,color:#fff
    style BluetoothCmd fill:#f093fb,stroke:#f5576c,color:#fff
    style NetworkCmd fill:#fa709a,stroke:#f5576c,color:#fff
    style BrightnessCmd fill:#feca57,stroke:#ff9a56,color:#fff
    style NotificationsCmd fill:#43e97b,stroke:#38f9d7,color:#fff
    style ShortcutsCmd fill:#feca57,stroke:#ff9a56,color:#fff
    style SearchCmd fill:#feca57,stroke:#ff9a56,color:#fff
    style SystemConfigCmd fill:#4facfe,stroke:#00f2fe,color:#fff
    style ThemeCmd fill:#feca57,stroke:#ff9a56,color:#fff
    style SessionCmd fill:#f093fb,stroke:#f5576c,color:#fff
{{< /mermaid >}}

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

Ver [D-Bus](/docs/devs/vasak-desktop/dbus/) para más detalles.

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

{{< mermaid >}}
sequenceDiagram
    participant Usuario
    participant VueComponent as Vue Component
    participant PiniaStore as Pinia Store
    participant BackendHandler as Backend Handler
    participant IPCBridge as IPC Bridge
    participant BackendRust as Backend Rust
    participant SystemOS as Sistema OS
    participant DBusEvent as D-Bus Event
    
    Usuario->>VueComponent: Mueve slider de volumen
    activate VueComponent
    VueComponent->>PiniaStore: emit('volume-changed', newValue)
    activate PiniaStore
    PiniaStore->>PiniaStore: actualiza estado local
    deactivate PiniaStore
    
    VueComponent->>BackendHandler: invoke('set_audio_volume', {level: 50})
    deactivate VueComponent
    
    activate BackendHandler
    BackendHandler->>IPCBridge: envía comando
    deactivate BackendHandler
    
    activate IPCBridge
    IPCBridge->>BackendRust: ejecuta set_audio_volume
    deactivate IPCBridge
    
    activate BackendRust
    BackendRust->>SystemOS: pactl set-sink-volume @DEFAULT_SINK@ 50%
    activate SystemOS
    SystemOS->>SystemOS: Cambia volumen real
    deactivate SystemOS
    
    SystemOS->>DBusEvent: Emite evento de cambio
    activate DBusEvent
    DBusEvent->>BackendRust: Recibe confirmación
    deactivate DBusEvent
    deactivate BackendRust
    
    BackendRust->>VueComponent: event('audio_volume_changed', newValue)
    activate VueComponent
    VueComponent->>Usuario: Refleja el cambio visual
    deactivate VueComponent
{{< /mermaid >}}

## Estructura de Directorios

### Frontend (`src/`)

{{< mermaid >}}
graph LR
    Src["📁 src/<br/><small>Frontend Vue.js</small>"]
    Src --> AppVue["📄 App.vue<br/><small>Componente raíz</small>"]
    Src --> MainTs["📄 main.ts<br/><small>Entry point</small>"]
    Src --> StyleCss["📄 style.css<br/><small>Estilos globales</small>"]
    Src --> VieDts["📄 vite-env.d.ts<br/><small>Tipos Vite</small>"]
    Src --> Assets["📁 assets/<br/><small>Recursos estáticos</small>"]
    Src --> Components["📁 components/<br/><small>Reutilizables</small>"]
    Src --> Interfaces["📁 interfaces/<br/><small>Tipos TypeScript</small>"]
    Src --> Layouts["📁 layouts/<br/><small>Plantillas</small>"]
    Src --> Routes["📁 routes/<br/><small>Enrutamiento</small>"]
    Src --> Tools["📁 tools/<br/><small>Controladores</small>"]
    Src --> Types["📁 types/<br/><small>Definiciones</small>"]
    Src --> Views["📁 views/<br/><small>Páginas principales</small>"]
    
    Assets --> AssetsImg["📁 img/"]
    Assets --> AssetsVec["📁 vectors/"]
    
    Components --> CompMenu["📄 SearchMenuComponent.vue"]
    Components --> CompAreas["📁 areas/"]
    Components --> CompBtns["📁 buttons/"]
    Components --> CompCards["📁 cards/"]
    Components --> CompCtrl["📁 controls/"]
    Components --> CompIcon["📁 icon/"]
    Components --> CompWdg["📁 widgets/"]
    
    CompAreas --> AreaPanel["📁 panel/"]
    CompAreas --> AreaCC["📁 control-center/"]
    CompAreas --> AreaMenu["📁 menu/"]
    
    Interfaces --> IfBat["📄 battery.ts"]
    Interfaces --> IfNot["📄 notifications.ts"]
    Interfaces --> IfTray["📄 tray.ts"]
    
    Layouts --> LayConfig["📄 ConfigAppLayout.vue"]
    Routes --> RouteIdx["📄 index.ts"]
    
    Tools --> ToolBat["📄 battery.controller.ts"]
    Tools --> ToolBT["📄 bluetooth.controller.ts"]
    Tools --> ToolNet["📄 network.controller.ts"]
    Tools --> ToolTray["📄 tray.controller.ts"]
    
    Types --> TypeVue["📄 vue-libvasak.d.ts"]
    
    Views --> ViewCC["📄 ControlCenterView.vue"]
    Views --> ViewDsk["📄 DesktopView.vue"]
    Views --> ViewMnu["📄 MenuView.vue"]
    Views --> ViewPnl["📄 PanelView.vue"]
    Views --> ViewApp["📁 applets/"]
    Views --> ViewApps["📁 apps/"]
    
    style Src fill:#667eea,stroke:#764ba2,color:#fff
    style Components fill:#4facfe,stroke:#00f2fe,color:#fff
    style Assets fill:#4facfe,stroke:#00f2fe,color:#fff
    style Interfaces fill:#43e97b,stroke:#38f9d7,color:#fff
    style Layouts fill:#43e97b,stroke:#38f9d7,color:#fff
    style Routes fill:#43e97b,stroke:#38f9d7,color:#fff
    style Tools fill:#feca57,stroke:#ff9a56,color:#fff
    style Types fill:#fa709a,stroke:#f5576c,color:#fff
    style Views fill:#f093fb,stroke:#f5576c,color:#fff
{{< /mermaid >}}

### Backend (`src-tauri/src/`)

{{< mermaid >}}
graph LR
    SrcTauri["📁 src-tauri/src/<br/><small>Backend Rust</small>"]
    SrcTauri --> LibRs["📄 lib.rs<br/><small>Módulos principales</small>"]
    SrcTauri --> MainRs["📄 main.rs<br/><small>Entry point</small>"]
    SrcTauri --> ErrorRs["📄 error.rs<br/><small>Manejo de errores</small>"]
    SrcTauri --> StructRs["📄 structs.rs<br/><small>Estructuras compartidas</small>"]
    SrcTauri --> ConstRs["📄 constants.rs<br/><small>Constantes</small>"]
    SrcTauri --> Commands["📁 commands/<br/><small>Comandos IPC</small>"]
    SrcTauri --> WinMgr["📁 window_manager/<br/><small>Gestión de ventanas</small>"]
    SrcTauri --> AudioRs["📄 audio.rs<br/><small>Control de audio</small>"]
    SrcTauri --> BrightRs["📄 brightness.rs<br/><small>Control de brillo</small>"]
    SrcTauri --> BTRs["📄 bluetooth.rs<br/><small>Bluetooth control</small>"]
    SrcTauri --> NetRs["📄 network.rs<br/><small>Network control</small>"]
    SrcTauri --> NotifRs["📄 notifications.rs<br/><small>Sistema notificaciones</small>"]
    SrcTauri --> DBusRs["📄 dbus_service.rs<br/><small>D-Bus integration</small>"]
    SrcTauri --> EventsRs["📄 eventloops.rs<br/><small>Bucles de eventos</small>"]
    SrcTauri --> ShortcutsRs["📄 platform_shortcuts.rs<br/><small>Atajos de teclado</small>"]
    SrcTauri --> MenuRs["📄 menu_manager.rs<br/><small>Gestión de menús</small>"]
    SrcTauri --> Tray["📁 tray/<br/><small>Bandeja del sistema</small>"]
    SrcTauri --> Applets["📁 applets/<br/><small>Mini-aplicaciones</small>"]
    SrcTauri --> Utils["📁 utils/<br/><small>Funciones de utilidad</small>"]
    SrcTauri --> WinApps["📁 windows_apps/<br/><small>Manejo de aplicaciones</small>"]
    
    Commands --> AudioCmd["📄 audio_commands.rs"]
    Commands --> BTCmd["📄 bluetooth_commands.rs"]
    Commands --> NetCmd["📄 network_commands.rs"]
    
    WinMgr --> ModWin["📄 mod.rs"]
    WinMgr --> WinCtrl["📄 window_controller.rs"]
    WinMgr --> MonMgr["📄 monitor_handler.rs"]
    
    Tray --> ModTray["📄 mod.rs"]
    Tray --> TrayIcon["📄 tray_icon.rs"]
    
    style SrcTauri fill:#667eea,stroke:#764ba2,color:#fff
    style Commands fill:#4facfe,stroke:#00f2fe,color:#fff
    style WinMgr fill:#4facfe,stroke:#00f2fe,color:#fff
    style Tray fill:#4facfe,stroke:#00f2fe,color:#fff
    style Utils fill:#4facfe,stroke:#00f2fe,color:#fff
    style Applets fill:#4facfe,stroke:#00f2fe,color:#fff
    style WinApps fill:#4facfe,stroke:#00f2fe,color:#fff
    style AudioRs fill:#43e97b,stroke:#38f9d7,color:#fff
    style BrightRs fill:#feca57,stroke:#ff9a56,color:#fff
    style BTRs fill:#f093fb,stroke:#f5576c,color:#fff
    style NetRs fill:#fa709a,stroke:#f5576c,color:#fff
    style NotifRs fill:#43e97b,stroke:#38f9d7,color:#fff
    style DBusRs fill:#f093fb,stroke:#f5576c,color:#fff
{{< /mermaid >}}

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
