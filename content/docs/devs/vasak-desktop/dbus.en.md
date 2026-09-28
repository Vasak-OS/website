---
title: "D-Bus - System integration | vasak-desktop"
weight: 25
description: "D-Bus in Vasak Desktop: how the desktop integrates with the Linux system through the session bus and system services."
---

Complete guide to D-Bus and how Vasak Desktop integrates with the Linux system.

## What is D-Bus?

D-Bus (Desktop Bus) is the standard inter-process communication (IPC) system in Linux.

**Purpose**: It lets applications and system services talk to each other in a standardized way.

**Example**:
- PulseAudio exposes audio services through D-Bus
- NetworkManager exposes network services
- UPower exposes battery information
- Freedesktop exposes notifications

## D-Bus Architecture

{{< mermaid >}}
graph TB
    Daemon["D-Bus Daemon<br/>(dbus-daemon)"]
    
    App1["App 1"]
    DBusSrv["D-Bus<br/>Service"]
    Service["Service"]
    
    Daemon --> App1
    Daemon --> DBusSrv
    Daemon --> Service
    
    style Daemon fill:#ffe0b2
    style App1 fill:#c8e6c9
    style DBusSrv fill:#c8e6c9
    style Service fill:#c8e6c9
{{< /mermaid >}}

### Bus Types

1. **Session Bus** - Per-user communication
   - Runs as `dbus-daemon --session`
   - Usually already running
   - Location: `unix:abstract=/tmp/dbus-XXXXXX`

2. **System Bus** - System-wide communication
   - Runs as root
   - For privileged operations
   - Location: `unix:/var/run/dbus/system_bus_socket`

Vasak Desktop mainly uses the **Session Bus**.

## Key Concepts

### Service Name (Bus Name)

Unique identifier for a service:

```
org.freedesktop.AudioManager
org.freedesktop.NetworkManager
org.freedesktop.DBus.Properties
```

Format: `org.domain.interface`

### Object Path

Location of the object within the service:

```
/org/freedesktop/NetworkManager
/org/freedesktop/NetworkManager/ActiveConnection/0
```

Hierarchical format, similar to file paths.

### Interface

Defines an object's methods, signals and properties:

```
org.freedesktop.NetworkManager.Device
org.freedesktop.DBus.Properties
```

### Methods

Functions that can be called:

```
interface: org.freedesktop.NetworkManager
method: Activate(objpath: in, objpath: in) -> (objpath: out)
```

### Signals

Events that can be listened to:

```
signal: StateChanged(uint32: state)
signal: PropertiesChanged(dict: properties)
```

### Properties

Values that can be read/written:

```
property: State (read) -> uint32
property: Connectivity (read) -> uint32
```

## D-Bus in Vasak Desktop

### D-Bus Module

**Location**: `src-tauri/src/dbus_service.rs`

```rust
// Example D-Bus connection
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

### Services Used

#### Audio (PulseAudio / PipeWire)

**Service**: `org.pulseaudio.Server` or `org.PipeWire.Core1`

**Functionality**:
- Get audio devices
- Change the volume
- Switch the audio input/output
- Mute

**Code**: `src-tauri/src/audio.rs`

#### Bluetooth

**Service**: `org.bluez`

**Paths**:
- `/org/bluez/hci0` - Adapter
- `/org/bluez/hci0/dev_XX_XX_XX_XX_XX_XX` - Device

**Functionality**:
- Scan for devices
- Pair devices
- Connect/Disconnect
- Read properties

**Code**: `src-tauri/src/bluetooth.rs`

#### Network (NetworkManager)

**Service**: `org.freedesktop.NetworkManager`

**Paths**:
- `/org/freedesktop/NetworkManager` - Main manager
- `/org/freedesktop/NetworkManager/Device/0` - Network device
- `/org/freedesktop/NetworkManager/ActiveConnection/0` - Active connection

**Functionality**:
- List network devices
- List WiFi connections
- Connect to WiFi
- Get connection properties

**Code**: `src-tauri/src/network.rs`

#### Notifications (Freedesktop)

**Service**: `org.freedesktop.Notifications`

**Path**: `/org/freedesktop/Notifications`

**Functionality**:
- Show notifications
- Close notifications
- Listen to user actions

**Code**: `src-tauri/src/notifications.rs`

#### Power (UPower)

**Service**: `org.freedesktop.UPower`

**Functionality**:
- Battery information
- AC adapter information

**Code**: Partially spread across several modules

## D-Bus Debugging Tools

### `busctl` - Command line tool

```bash
# List the services on the session bus
busctl list --user

# See the interfaces of a service
busctl introspect --user org.freedesktop.NetworkManager /org/freedesktop/NetworkManager

# Call a method
busctl call --user org.freedesktop.DBus /org/freedesktop/DBus \
  org.freedesktop.DBus ListNames
```

### `dbus-send` - Send D-Bus messages

```bash
# Get the current volume
dbus-send --print-reply --system \
  /org/pulseaudio/core1 \
  org.freedesktop.DBus.Properties.Get \
  string:'org.PulseAudio.Core1' \
  string:'Volume'

# Change the volume
dbus-send --system /org/pulseaudio/core1 \
  org.PulseAudio.Core1.SetVolume \
  uint32:50000
```

### `dbus-monitor` - D-Bus monitor

```bash
# Monitor all messages
dbus-monitor --session

# Monitor only NetworkManager messages
dbus-monitor --session \
  "interface='org.freedesktop.NetworkManager'"

# Monitor only signals
dbus-monitor --session type='signal'
```

### `gdbus` - GNOME D-Bus client

```bash
# List services
gdbus call --session \
  --dest org.freedesktop.DBus \
  --object-path /org/freedesktop/DBus \
  --method org.freedesktop.DBus.ListNames

# Spy on properties
gdbus introspect --session \
  --dest org.freedesktop.NetworkManager \
  --object-path /org/freedesktop/NetworkManager
```

## Implementing a D-Bus Command

### Example: Getting the Audio Volume

```rust
// src-tauri/src/commands/audio.rs

use zbus::Connection;

#[tauri::command]
pub async fn get_volume() -> Result<u32, String> {
    // Connect to the session bus
    let connection = Connection::session()
        .await
        .map_err(|e| format!("Failed to connect to D-Bus: {}", e))?;
    
    // Get a proxy for the service
    let proxy = connection
        .call_method(
            Some("org.pulseaudio.Server"),           // Service
            "/org/pulseaudio/core1",                 // Path
            Some("org.freedesktop.DBus.Properties"), // Interface
            "Get",                                   // Method
            &("org.PulseAudio.Core1", "Volume"),    // Parameters
        )
        .await
        .map_err(|e| format!("D-Bus call failed: {}", e))?;
    
    Ok(volume)
}
```

### Example: Listening to D-Bus Signals

```rust
// Listen for volume changes

use zbus::MessageStream;

pub async fn listen_volume_changes() -> Result<(), Box<dyn std::error::Error>> {
    let connection = Connection::session().await?;
    
    // Create a message stream
    let mut stream = MessageStream::from(connection.clone());
    
    // Filter by signal
    while let Some(msg) = stream.next().await {
        match msg {
            zbus::Message::Signal(signal) => {
                if signal.interface() == Some(&"org.PulseAudio.Core1".into()) {
                    println!("Volume changed");
                }
            }
            _ => {}
        }
    }
    
    Ok(())
}
```

## Common D-Bus Services

### NetworkManager

```bash
# See the devices
busctl --user call org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager org.freedesktop.NetworkManager GetDevices

# See the available WiFi connections
dbus-send --system --print-reply \
  /org/freedesktop/NetworkManager \
  org.freedesktop.NetworkManager.GetDevices
```

### PulseAudio / PipeWire

```bash
# See the sinks (audio outputs)
pacmd list-sinks

# Or with D-Bus
busctl --user call org.pulseaudio.Server \
  /org/pulseaudio/core1 \
  org.PulseAudio.Core1.GetSinks
```

### BlueZ (Bluetooth)

```bash
# See the paired Bluetooth devices
busctl --system list --match "type='signal',interface='org.bluez.Device1'"

# See the adapter
busctl --system call org.bluez \
  /org/bluez/hci0 \
  org.freedesktop.DBus.Properties.GetAll \
  s "org.bluez.Adapter1"
```

## Common D-Bus Errors

### Error: "Service not available"

```
org.freedesktop.DBus.Error.ServiceUnknown
```

**Cause**: The service is not running or does not exist

**Fix**:
```bash
# Start the service
systemctl --user start pulseaudio
sudo systemctl start bluetooth
sudo systemctl start NetworkManager
```

### Error: "No such object path"

```
org.freedesktop.DBus.Error.ObjectPathNotFound
```

**Cause**: The object path does not exist

**Fix**:
```bash
# Check the available paths
busctl --user tree org.freedesktop.NetworkManager
```

### Error: "Access Denied"

```
org.freedesktop.DBus.Error.AccessDenied
```

**Cause**: Insufficient permissions

**Fix**:
```bash
# Use the system bus instead of the session bus
# Or add the user to the appropriate group
sudo usermod -a -G audio $USER
```

## Debugging D-Bus in Vasak

### Enabling D-Bus Logs

```bash
# Run with D-Bus debugging
DBUS_VERBOSE=1 vasak-desktop

# Or only for specific modules
RUST_LOG=vasak_desktop::dbus=debug vasak-desktop
```

### Monitoring D-Bus While You Run

```bash
# Terminal 1: D-Bus monitor
dbus-monitor --session

# Terminal 2: run Vasak with logs
RUST_LOG=debug vasak-desktop
```

### Step by Step Debugging

```bash
# In the Rust code, add prints
eprintln!("Connecting to D-Bus...");
let connection = Connection::session().await?;
eprintln!("Connected!");

// Build with debug
cargo build
# Run
RUST_LOG=debug ./target/debug/vasak_desktop
```

## Best Practices

### ✅ Do:
- Check that the service exists before using it
- Handle D-Bus connection errors
- Use timeouts on D-Bus calls
- Listen to signals for system changes
- Document which service you use

### ❌ Don't:
- Assume a service is always available
- Block the main thread on D-Bus calls
- Ignore D-Bus errors
- Make D-Bus calls in uncontrolled loops
- Use hardcoded paths

## Additional Resources

- [D-Bus Specification](https://dbus.freedesktop.org/doc/dbus-daemon.1.html)
- [Freedesktop Standards](https://specifications.freedesktop.org/)
- [Zbus (Rust bindings)](https://zbus.readthedocs.io/)
- [PulseAudio D-Bus API](https://www.freedesktop.org/wiki/Software/PulseAudio/DBusInterface/)
- [NetworkManager D-Bus API](https://networkmanager.dev/)
