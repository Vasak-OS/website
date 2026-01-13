---
title: "D-Bus - Integracion con el sistema | vasak-desktop"
weight: 25
---

Guía completa sobre D-Bus y cómo Vasak Desktop se integra con el sistema Linux.

## ¿Qué es D-Bus?

D-Bus (Desktop Bus) es un sistema de comunicación entre procesos (IPC) estándar en Linux.

**Propósito**: Permite que aplicaciones y servicios del sistema se comuniquen de manera estandarizada.

**Ejemplo**:
- PulseAudio expone servicios de audio a través de D-Bus
- NetworkManager expone servicios de red
- UPower expone información de batería
- Freedesktop expone notificaciones

## Arquitectura D-Bus

{{< mermaid >}}
graph TB
    Daemon["D-Bus Daemon<br/>(dbus-daemon)"]
    
    App1["App 1"]
    DBusSrv["D-Bus<br/>Service"]
    Service["Servicio"]
    
    Daemon --> App1
    Daemon --> DBusSrv
    Daemon --> Service
    
    style Daemon fill:#ffe0b2
    style App1 fill:#c8e6c9
    style DBusSrv fill:#c8e6c9
    style Service fill:#c8e6c9
{{< /mermaid >}}

### Tipos de Buses

1. **Session Bus** - Comunicación por usuario
   - Ejecutado como `dbus-daemon --session`
   - Normalmente ya está corriendo
   - Ubicación: `unix:abstract=/tmp/dbus-XXXXXX`

2. **System Bus** - Comunicación a nivel de sistema
   - Ejecutado como root
   - Para operaciones privilegiadas
   - Ubicación: `unix:/var/run/dbus/system_bus_socket`

Vasak Desktop usa principalmente el **Session Bus**.

## Conceptos Clave

### Nombre del Servicio (Bus Name)

Identificador único para un servicio:

```
org.freedesktop.AudioManager
org.freedesktop.NetworkManager
org.freedesktop.DBus.Properties
```

Formato: `org.domain.interface`

### Ruta de Objeto (Object Path)

Localización del objeto en el servicio:

```
/org/freedesktop/NetworkManager
/org/freedesktop/NetworkManager/ActiveConnection/0
```

Formato jerárquico similar a paths de archivos.

### Interfaz

Define métodos, señales y propiedades de un objeto:

```
org.freedesktop.NetworkManager.Device
org.freedesktop.DBus.Properties
```

### Métodos

Funciones que se pueden llamar:

```
interface: org.freedesktop.NetworkManager
method: Activate(objpath: in, objpath: in) -> (objpath: out)
```

### Señales

Eventos que se pueden escuchar:

```
signal: StateChanged(uint32: state)
signal: PropertiesChanged(dict: properties)
```

### Propiedades

Valores que se pueden leer/escribir:

```
property: State (read) -> uint32
property: Connectivity (read) -> uint32
```

## D-Bus en Vasak Desktop

### Módulo D-Bus

**Ubicación**: `src-tauri/src/dbus_service.rs`

```rust
// Ejemplo de conexión D-Bus
use zbus::Connection;

pub struct DbusService {
    connection: Connection,
}

impl DbusService {
    pub async fn new() -> Result<Self> {
        let connection = Connection::session().await?;
        Ok(DbusService { connection })
    }
}
```

### Servicios Utilizados

#### Audio (PulseAudio / PipeWire)

**Servicio**: `org.pulseaudio.Server` o `org.PipeWire.Core1`

**Funcionalidad**:
- Obtener dispositivos de audio
- Cambiar volumen
- Cambiar entrada/salida de audio
- Muteado

**Código**: `src-tauri/src/audio.rs`

#### Bluetooth

**Servicio**: `org.bluez`

**Rutas**: 
- `/org/bluez/hci0` - Adaptador
- `/org/bluez/hci0/dev_XX_XX_XX_XX_XX_XX` - Dispositivo

**Funcionalidad**:
- Escanear dispositivos
- Parear dispositivos
- Conectar/Desconectar
- Ver propiedades

**Código**: `src-tauri/src/bluetooth.rs`

#### Red (NetworkManager)

**Servicio**: `org.freedesktop.NetworkManager`

**Rutas**:
- `/org/freedesktop/NetworkManager` - Manager principal
- `/org/freedesktop/NetworkManager/Device/0` - Dispositivo de red
- `/org/freedesktop/NetworkManager/ActiveConnection/0` - Conexión activa

**Funcionalidad**:
- Listar dispositivos de red
- Listar conexiones WiFi
- Conectar a WiFi
- Obtener propiedades de conexión

**Código**: `src-tauri/src/network.rs`

#### Notificaciones (Freedesktop)

**Servicio**: `org.freedesktop.Notifications`

**Ruta**: `/org/freedesktop/Notifications`

**Funcionalidad**:
- Mostrar notificaciones
- Cerrar notificaciones
- Escuchar acciones de usuario

**Código**: `src-tauri/src/notifications.rs`

#### Energía (UPower)

**Servicio**: `org.freedesktop.UPower`

**Funcionalidad**:
- Información de batería
- Información de adaptador de corriente

**Código**: Parcialmente en varios módulos

## Herramientas de Debugging D-Bus

### `busctl` - Herramienta de línea de comandos

```bash
# Listar servicios en el bus de sesión
busctl list --user

# Ver interfaces de un servicio
busctl introspect --user org.freedesktop.NetworkManager /org/freedesktop/NetworkManager

# Llamar a un método
busctl call --user org.freedesktop.DBus /org/freedesktop/DBus \
  org.freedesktop.DBus ListNames
```

### `dbus-send` - Enviar mensajes D-Bus

```bash
# Obtener volumen actual
dbus-send --print-reply --system \
  /org/pulseaudio/core1 \
  org.freedesktop.DBus.Properties.Get \
  string:'org.PulseAudio.Core1' \
  string:'Volume'

# Cambiar volumen
dbus-send --system /org/pulseaudio/core1 \
  org.PulseAudio.Core1.SetVolume \
  uint32:50000
```

### `dbus-monitor` - Monitor D-Bus

```bash
# Monitorear todos los mensajes
dbus-monitor --session

# Monitorear solo mensajes de NetworkManager
dbus-monitor --session \
  "interface='org.freedesktop.NetworkManager'"

# Monitorear solo señales
dbus-monitor --session type='signal'
```

### `gdbus` - Cliente D-Bus de GNOME

```bash
# Listar servicios
gdbus call --session \
  --dest org.freedesktop.DBus \
  --object-path /org/freedesktop/DBus \
  --method org.freedesktop.DBus.ListNames

# Espiar propiedades
gdbus introspect --session \
  --dest org.freedesktop.NetworkManager \
  --object-path /org/freedesktop/NetworkManager
```

## Implementar un Comando D-Bus

### Ejemplo: Obtener Volumen de Audio

```rust
// src-tauri/src/commands/audio.rs

use zbus::Connection;

#[tauri::command]
pub async fn get_volume() -> Result<u32, String> {
    // Conectar al bus de sesión
    let connection = Connection::session()
        .await
        .map_err(|e| format!("Failed to connect to D-Bus: {}", e))?;
    
    // Obtener proxy del servicio
    let proxy = connection
        .call_method(
            Some("org.pulseaudio.Server"),           // Servicio
            "/org/pulseaudio/core1",                 // Ruta
            Some("org.freedesktop.DBus.Properties"), // Interfaz
            "Get",                                   // Método
            &("org.PulseAudio.Core1", "Volume"),    // Parámetros
        )
        .await
        .map_err(|e| format!("D-Bus call failed: {}", e))?;
    
    Ok(volume)
}
```

### Ejemplo: Escuchar Señales D-Bus

```rust
// Escuchar cambios de volumen

use zbus::MessageStream;

pub async fn listen_volume_changes() -> Result<(), Box<dyn std::error::Error>> {
    let connection = Connection::session().await?;
    
    // Crear stream de mensajes
    let mut stream = MessageStream::from(connection.clone());
    
    // Filtrar por señal
    while let Some(msg) = stream.next().await {
        match msg {
            zbus::Message::Signal(signal) => {
                if signal.interface() == Some(&"org.PulseAudio.Core1".into()) {
                    println!("Volumen cambió");
                }
            }
            _ => {}
        }
    }
    
    Ok(())
}
```

## Servicios D-Bus Comunes

### NetworkManager

```bash
# Ver dispositivos
busctl --user call org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager org.freedesktop.NetworkManager GetDevices

# Ver conexiones WiFi disponibles
dbus-send --system --print-reply \
  /org/freedesktop/NetworkManager \
  org.freedesktop.NetworkManager.GetDevices
```

### PulseAudio / PipeWire

```bash
# Ver sinks (salidas de audio)
pacmd list-sinks

# O con D-Bus
busctl --user call org.pulseaudio.Server \
  /org/pulseaudio/core1 \
  org.PulseAudio.Core1.GetSinks
```

### BlueZ (Bluetooth)

```bash
# Ver dispositivos Bluetooth pareados
busctl --system list --match "type='signal',interface='org.bluez.Device1'"

# Ver adaptador
busctl --system call org.bluez \
  /org/bluez/hci0 \
  org.freedesktop.DBus.Properties.GetAll \
  s "org.bluez.Adapter1"
```

## Errores Comunes D-Bus

### Error: "Service not available"

```
org.freedesktop.DBus.Error.ServiceUnknown
```

**Causa**: El servicio no está corriendo o no existe

**Solución**:
```bash
# Iniciar el servicio
systemctl --user start pulseaudio
sudo systemctl start bluetooth
sudo systemctl start NetworkManager
```

### Error: "No such object path"

```
org.freedesktop.DBus.Error.ObjectPathNotFound
```

**Causa**: La ruta de objeto no existe

**Solución**:
```bash
# Verificar rutas disponibles
busctl --user tree org.freedesktop.NetworkManager
```

### Error: "Access Denied"

```
org.freedesktop.DBus.Error.AccessDenied
```

**Causa**: Permisos insuficientes

**Solución**:
```bash
# Usar system bus en lugar de session bus
# O añadir usuario a grupo apropiado
sudo usermod -a -G audio $USER
```

## Debugging D-Bus en Vasak

### Habilitar Logs de D-Bus

```bash
# Ejecutar con debug de D-Bus
DBUS_VERBOSE=1 vasak-desktop

# O solo para módulos específicos
RUST_LOG=vasak_desktop::dbus=debug vasak-desktop
```

### Monitorear D-Bus Mientras Ejecutas

```bash
# Terminal 1: Monitor D-Bus
dbus-monitor --session

# Terminal 2: Ejecutar Vasak con logs
RUST_LOG=debug vasak-desktop
```

### Debugging Paso a Paso

```bash
# En código Rust, añade prints
eprintln!("Conectando a D-Bus...");
let connection = Connection::session().await?;
eprintln!("Conectado!");

// Compilar con debug
cargo build
# Ejecutar
RUST_LOG=debug ./target/debug/vasak_desktop
```

## Mejores Prácticas

### ✅ Haz:
- Verifica que el servicio existe antes de usarlo
- Maneja errores de conexión D-Bus
- Usa timeouts en llamadas D-Bus
- Escucha señales para cambios del sistema
- Documenta qué servicio usas

### ❌ No hagas:
- Asumas que un servicio siempre está disponible
- Bloquees el hilo principal en llamadas D-Bus
- Ignores errores de D-Bus
- Hagas llamadas D-Bus en loops sin control
- Uses rutas hardcodeadas

## Recursos Adicionales

- [D-Bus Specification](https://dbus.freedesktop.org/doc/dbus-daemon.1.html)
- [Freedesktop Standards](https://specifications.freedesktop.org/)
- [Zbus (Rust bindings)](https://zbus.readthedocs.io/)
- [PulseAudio D-Bus API](https://www.freedesktop.org/wiki/Software/PulseAudio/DBusInterface/)
- [NetworkManager D-Bus API](https://networkmanager.dev/)
