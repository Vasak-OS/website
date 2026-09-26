---
title: "Overall Architecture | vasak-desktop"
weight: 15
---

Overview of the Vasak Desktop architecture and how its components are laid out.

## What is Vasak Desktop?

Vasak Desktop is NOT a full desktop environment (like GNOME or KDE). It is a **lightweight desktop interface** that has no **WM** of its own but that provides:

- **Top Panel** - Taskbar with system applets
- **Desktop View** - Wallpaper with optional widgets
- **Control Center** - Quick access to settings
- **Application Menu** - Search and launch apps
- **File Manager** - Tool for browsing files
- **Search Launcher** - Fast search tool
- **Config Manager** - Tool for configuring the operating system

It runs as several independent Tauri windows that talk to each other over IPC.

> The rest of the VasakOS tools that do not share the desktop backend follow a similar architecture and can be integrated the same way with the desktop settings.

## High-level Architecture

{{< mermaid >}}
graph TD
    User["👤 END USER"]
    
    Panel["🪟 PANEL Window<br/>(Top Bar)"]
    Desktop["🖥️ DESKTOP Window<br/>(Background)"]
    
    Frontend["🎨 Vue.js Frontend<br/>(TypeScript + CSS)"]
    
    IPC["🔗 Tauri IPC Bridge<br/>(Frontend ↔ Backend)"]
    
    Backend["⚙️ Rust Backend<br/>- System commands<br/>- D-Bus integration<br/>- Window management"]
    
    DBus["🔌 D-Bus<br/>(IPC)"]
    GTK["🎭 GTK<br/>(Theme)"]
    System["📁 System<br/>(FS/IO)"]
    
    Services["🔧 System Services<br/>(PulseAudio, NetworkManager,<br/>BlueZ, MPRIS, gsettings...)"]
    
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

## Application Windows

Vasak Desktop is made up of **2 independent windows**:

### Window 1: Panel (Top Bar)

```json
{
  "label": "panel",
  "title": "Vasak Panel",
  "width": [screen width],
  "height": 40,
  "y": 0,
  "decorations": false,
  "alwaysOnTop": true
}
```

It shows:
- Application menu
- Widgets (clock, music)
- System applets (audio, network, bluetooth, battery)
- Control center

### Window 2: Desktop (Background)

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

It shows:
- Desktop wallpaper
- Optional widgets (weather, clock)

## Application Layers

### 1. Presentation Layer (Frontend)

**Technology**: Vue.js 3.5.18, TypeScript, Tailwind CSS 4.1

{{< mermaid >}}
graph LR
    Frontend["🎨 Vue.js Frontend<br/><small>src/</small>"]
    
    Frontend --> App["📄 App.vue<br/><small>Root component</small>"]
    Frontend --> Main["📄 main.ts<br/><small>Entry point</small>"]
    Frontend --> Style["📄 style.css<br/><small>Global styles</small>"]
    
    Frontend --> Views["📁 views/<br/><small>Main pages</small>"]
    Frontend --> Components["📁 components/<br/><small>Reusable components</small>"]
    Frontend --> Routes["📁 routes/<br/><small>Route configuration</small>"]
    Frontend --> Tools["📁 tools/<br/><small>Controllers</small>"]
    
    Views --> ViewPanel["📄 PanelView.vue<br/><small>Top panel window</small>"]
    Views --> ViewDesktop["📄 DesktopView.vue<br/><small>Desktop background window</small>"]
    Views --> ViewMenu["📄 MenuView.vue<br/><small>App menu view</small>"]
    Views --> ViewCC["📄 ControlCenterView.vue<br/><small>Control center</small>"]
    
    Components --> CompBtns["📁 buttons/<br/><small>Interface buttons</small>"]
    Components --> CompCards["📁 cards/<br/><small>Information cards</small>"]
    Components --> CompCtrl["📁 controls/<br/><small>Interactive controls</small>"]
    Components --> CompAreas["📁 areas/<br/><small>Full areas</small>"]
    
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

**Data flow**:
- Components → `invoke('command')` → Backend
- Backend → `emit('event')` → Components update

### 2. Communication Layer (IPC)

**Technology**: Tauri IPC Bridge

{{< mermaid >}}
sequenceDiagram
    participant VueComp as Vue<br/>Component
    participant Invoke as invoke()
    participant IPCBridge as IPC Bridge
    participant BackendCmd as Backend<br/>Command
    participant DBusService as D-Bus /<br/>System Call
    participant Result as Result
    
    VueComp->>Invoke: invoke('get_audio_volume')
    activate Invoke
    Invoke->>IPCBridge: sends the serialized command
    deactivate Invoke
    
    activate IPCBridge
    IPCBridge->>BackendCmd: #64 (Backend Handler)
    deactivate IPCBridge
    
    activate BackendCmd
    BackendCmd->>DBusService: D-Bus query / system call
    deactivate BackendCmd
    
    activate DBusService
    DBusService->>Result: gets the value (e.g. 50%)
    deactivate DBusService
    
    activate Result
    Result->>IPCBridge: returns the response
    deactivate Result
    
    activate IPCBridge
    IPCBridge->>VueComp: resolves the Promise with the result
    deactivate IPCBridge
    
    activate VueComp
    VueComp->>VueComp: updates local state
    deactivate VueComp
    
    Note over VueComp,Result: Only explicitly registered commands can be invoked
{{< /mermaid >}}

**Security**: Only explicitly registered commands can be invoked.

### 3. Logic Layer (Backend)

**Technology**: Rust 1.70+, Tauri 2.x

{{< mermaid >}}
graph LR
    Backend["⚙️ Rust Backend<br/><small>src-tauri/src/</small>"]
    
    Backend --> Main["📄 main.rs<br/><small>Entry point<br/>window setup</small>"]
    Backend --> Lib["📄 lib.rs<br/><small>Command and<br/>module registration</small>"]
    Backend --> Structs["📄 structs.rs<br/><small>Shared structures</small>"]
    
    Backend --> Commands["📁 commands/<br/><small>IPC handlers</small>"]
    Backend --> WindowMgr["📁 window_manager/<br/><small>Window management</small>"]
    Backend --> MonitorMgr["📄 monitor_manager.rs<br/><small>Monitor management</small>"]
    Backend --> DBusService["📄 dbus_service.rs<br/><small>D-Bus integration</small>"]
    Backend --> Tray["📁 tray/<br/><small>System tray</small>"]
    Backend --> Utils["📁 utils/<br/><small>Utility functions</small>"]
    
    Commands --> AudioCmd["📄 audio.rs<br/><small>Audio control</small>"]
    Commands --> BluetoothCmd["📄 bluetooth.rs<br/><small>Bluetooth control</small>"]
    Commands --> NetworkCmd["📄 network.rs<br/><small>Network control</small>"]
    Commands --> BrightnessCmd["📄 brightness.rs<br/><small>Brightness control</small>"]
    Commands --> NotificationsCmd["📄 notifications.rs<br/><small>Notification system</small>"]
    Commands --> ShortcutsCmd["📄 shortcuts.rs<br/><small>Shortcut management</small>"]
    Commands --> SearchCmd["📄 search.rs<br/><small>App search</small>"]
    Commands --> SystemConfigCmd["📄 system_config.rs<br/><small>OS configuration</small>"]
    Commands --> ThemeCmd["📄 theme.rs<br/><small>GTK themes, icons</small>"]
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

**Backend responsibilities**:
- Run system commands via shell or native APIs
- Talk to system services over D-Bus
- Handle hardware events and notifications
- Apply system settings (gsettings, config files)
- Manage the Tauri windows

### 4. System Integration Layer (D-Bus)

**Technology**: Zbus (Rust) + D-Bus

The standard Linux interface for:
- Audio control (PulseAudio/PipeWire)
- Bluetooth (BlueZ)
- Network (NetworkManager)
- Notifications (Freedesktop)
- Power (UPower)

See [D-Bus](/en/docs/devs/vasak-desktop/dbus/) for more details.

### 5. Hardware/OS Layer

**System components**:
- PulseAudio / PipeWire (Audio)
- BlueZ (Bluetooth)
- NetworkManager (Network)
- X11 / Wayland (Windows)
- Compositor (Visual effects)

> Current Wayland support is **EXPERIMENTAL**

## Typical Data Flow

### Example: Changing the Volume

{{< mermaid >}}
sequenceDiagram
    participant User
    participant VueComponent as Vue Component
    participant PiniaStore as Pinia Store
    participant BackendHandler as Backend Handler
    participant IPCBridge as IPC Bridge
    participant BackendRust as Rust Backend
    participant SystemOS as OS System
    participant DBusEvent as D-Bus Event
    
    User->>VueComponent: Moves the volume slider
    activate VueComponent
    VueComponent->>PiniaStore: emit('volume-changed', newValue)
    activate PiniaStore
    PiniaStore->>PiniaStore: updates local state
    deactivate PiniaStore
    
    VueComponent->>BackendHandler: invoke('set_audio_volume', {level: 50})
    deactivate VueComponent
    
    activate BackendHandler
    BackendHandler->>IPCBridge: sends the command
    deactivate BackendHandler
    
    activate IPCBridge
    IPCBridge->>BackendRust: runs set_audio_volume
    deactivate IPCBridge
    
    activate BackendRust
    BackendRust->>SystemOS: pactl set-sink-volume @DEFAULT_SINK@ 50%
    activate SystemOS
    SystemOS->>SystemOS: Changes the actual volume
    deactivate SystemOS
    
    SystemOS->>DBusEvent: Emits a change event
    activate DBusEvent
    DBusEvent->>BackendRust: Receives the confirmation
    deactivate DBusEvent
    deactivate BackendRust
    
    BackendRust->>VueComponent: event('audio_volume_changed', newValue)
    activate VueComponent
    VueComponent->>User: Reflects the visual change
    deactivate VueComponent
{{< /mermaid >}}

## Directory Structure

### Frontend (`src/`)

{{< mermaid >}}
graph LR
    Src["📁 src/<br/><small>Vue.js frontend</small>"]
    Src --> AppVue["📄 App.vue<br/><small>Root component</small>"]
    Src --> MainTs["📄 main.ts<br/><small>Entry point</small>"]
    Src --> StyleCss["📄 style.css<br/><small>Global styles</small>"]
    Src --> VieDts["📄 vite-env.d.ts<br/><small>Vite types</small>"]
    Src --> Assets["📁 assets/<br/><small>Static assets</small>"]
    Src --> Components["📁 components/<br/><small>Reusable</small>"]
    Src --> Interfaces["📁 interfaces/<br/><small>TypeScript types</small>"]
    Src --> Layouts["📁 layouts/<br/><small>Templates</small>"]
    Src --> Routes["📁 routes/<br/><small>Routing</small>"]
    Src --> Tools["📁 tools/<br/><small>Controllers</small>"]
    Src --> Types["📁 types/<br/><small>Definitions</small>"]
    Src --> Views["📁 views/<br/><small>Main pages</small>"]
    
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
    SrcTauri["📁 src-tauri/src/<br/><small>Rust backend</small>"]
    SrcTauri --> LibRs["📄 lib.rs<br/><small>Main modules</small>"]
    SrcTauri --> MainRs["📄 main.rs<br/><small>Entry point</small>"]
    SrcTauri --> ErrorRs["📄 error.rs<br/><small>Error handling</small>"]
    SrcTauri --> StructRs["📄 structs.rs<br/><small>Shared structures</small>"]
    SrcTauri --> ConstRs["📄 constants.rs<br/><small>Constants</small>"]
    SrcTauri --> Commands["📁 commands/<br/><small>IPC commands</small>"]
    SrcTauri --> WinMgr["📁 window_manager/<br/><small>Window management</small>"]
    SrcTauri --> AudioRs["📄 audio.rs<br/><small>Audio control</small>"]
    SrcTauri --> BrightRs["📄 brightness.rs<br/><small>Brightness control</small>"]
    SrcTauri --> BTRs["📄 bluetooth.rs<br/><small>Bluetooth control</small>"]
    SrcTauri --> NetRs["📄 network.rs<br/><small>Network control</small>"]
    SrcTauri --> NotifRs["📄 notifications.rs<br/><small>Notification system</small>"]
    SrcTauri --> DBusRs["📄 dbus_service.rs<br/><small>D-Bus integration</small>"]
    SrcTauri --> EventsRs["📄 eventloops.rs<br/><small>Event loops</small>"]
    SrcTauri --> ShortcutsRs["📄 platform_shortcuts.rs<br/><small>Keyboard shortcuts</small>"]
    SrcTauri --> MenuRs["📄 menu_manager.rs<br/><small>Menu management</small>"]
    SrcTauri --> Tray["📁 tray/<br/><small>System tray</small>"]
    SrcTauri --> Applets["📁 applets/<br/><small>Mini-applications</small>"]
    SrcTauri --> Utils["📁 utils/<br/><small>Utility functions</small>"]
    SrcTauri --> WinApps["📁 windows_apps/<br/><small>Application handling</small>"]
    
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

## Design Patterns

### 1. MVC (Model-View-Controller)

**Frontend**:
- **Model**: Pinia stores
- **View**: Vue components
- **Controller**: Methods in components

**Backend**:
- **Model**: Structures in `structs.rs`
- **Controller**: Functions in `commands/`
- **Business Logic**: Specialized modules

### 2. Pub-Sub (Publish-Subscribe)

For system events:

```rust
// Backend: emit the event
window.emit("audio_volume_changed", {level: 50})?;
```

```js
// Frontend: listen for the event
onMounted(() => {
  listen('audio_volume_changed', (event) => {
    state.volume = event.payload.level;
  });
});
```

### 3. Service Layer

Every feature has its own service layer:
- `audio.rs` - Audio service
- `network.rs` - Network service
- `bluetooth.rs` - Bluetooth service

## Information Flows

### Command (Frontend → Backend)

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

### Event (Backend → Frontend)

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
  console.log('Brightness:', event.payload.level);
});
```

## Configuration and Manifests

### `tauri.conf.json`

Defines Tauri permissions and configuration:

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

Rust dependencies and configuration.

### `tsconfig.json`

TypeScript configuration.

### `vite.config.ts`

Frontend build configuration.
