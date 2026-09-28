---
title: "Rust commands | vasak-desktop"
weight: 30
description: "How to develop Tauri IPC commands in Rust inside Vasak Desktop, including the interface between both sides."
---

Guide for developing IPC commands (Tauri) in Rust.

## Concept: Tauri Commands

Commands are Rust functions that can be called from the Vue.js frontend through IPC.

{{< mermaid >}}
sequenceDiagram
    participant Frontend as 🎨 Frontend<br/>(Vue.js)
    participant Invoke as invoke()
    participant Bridge as 🔗 Tauri Bridge
    participant IPC as 📡 IPC Channel
    participant Backend as ⚙️ Backend<br/>(Rust)
    
    Frontend->>Invoke: invoke('command_name', data)
    activate Invoke
    Invoke->>Bridge: serializes the data
    deactivate Invoke
    
    activate Bridge
    Bridge->>IPC: sends it over the channel
    deactivate Bridge
    
    activate IPC
    IPC->>Backend: delivers the command
    deactivate IPC
    
    activate Backend
    Backend->>Backend: runs the Rust function
    Backend->>IPC: returns the result
    deactivate Backend
    
    activate IPC
    IPC->>Bridge: sends the response
    deactivate IPC
    
    activate Bridge
    Bridge->>Invoke: deserializes the result
    deactivate Bridge
    
    activate Invoke
    Invoke->>Frontend: resolved Promise
    deactivate Invoke
    
    Note over Frontend,Backend: Bidirectional, safe communication
{{< /mermaid >}}

## Base Structure of a Command

```rust
// src-tauri/src/commands/mod.rs

use tauri::State;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct VolumeLevel {
    pub level: u32,
}

// Simple command
#[tauri::command]
pub fn get_version() -> String {
    "0.5.2".to_string()
}

// Command with parameters
#[tauri::command]
pub fn set_volume(level: u32) -> Result<(), String> {
    if level > 100 {
        return Err("Volume must be 0-100".to_string());
    }
    
    // Logic for changing the volume
    println!("Volume set to: {}", level);
    Ok(())
}

// Async command
#[tauri::command]
pub async fn load_devices() -> Result<Vec<Device>, String> {
    // Async operation
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    Ok(vec![])
}

// Command with shared state
#[tauri::command]
pub fn get_config(state: State<AppConfig>) -> Result<String, String> {
    Ok(state.config_path.clone())
}
```

## Registering Commands

In `src/main.rs` or `src/lib.rs`:

```rust
use tauri::Manager;

mod commands;
use commands::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // Register them here
            get_version,
            set_volume,
            load_devices,
            get_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Data Types

### Simple Types

```rust
#[tauri::command]
pub fn handle_int(value: i32) -> i32 {
    value * 2
}

#[tauri::command]
pub fn handle_string(text: String) -> String {
    format!("Echo: {}", text)
}

#[tauri::command]
pub fn handle_bool(flag: bool) -> bool {
    !flag
}

#[tauri::command]
pub fn handle_float(value: f64) -> f64 {
    value.sqrt()
}
```

### Complex Types

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Device {
    pub id: String,
    pub name: String,
    pub volume: u32,
}

#[derive(Serialize, Deserialize)]
pub struct AudioSettings {
    pub volume: u32,
    pub muted: bool,
    pub device: String,
}

#[tauri::command]
pub fn get_audio_settings() -> AudioSettings {
    AudioSettings {
        volume: 50,
        muted: false,
        device: "default".to_string(),
    }
}

#[tauri::command]
pub fn update_audio_settings(settings: AudioSettings) -> Result<(), String> {
    // Update the configuration
    Ok(())
}

#[tauri::command]
pub fn get_devices() -> Vec<Device> {
    vec![
        Device {
            id: "dev1".to_string(),
            name: "Speaker".to_string(),
            volume: 50,
        },
    ]
}
```

## Error Handling

```rust
// ✅ Return the error explicitly
#[tauri::command]
pub fn validate_input(input: String) -> Result<String, String> {
    if input.is_empty() {
        return Err("Input cannot be empty".to_string());
    }
    Ok(input.to_uppercase())
}

// ✅ Use a custom error type
#[derive(Debug, Serialize)]
pub enum CommandError {
    #[serde(rename = "device_not_found")]
    DeviceNotFound,
    
    #[serde(rename = "invalid_volume")]
    InvalidVolume,
    
    #[serde(rename = "dbus_error")]
    DbusError(String),
}

impl std::fmt::Display for CommandError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            CommandError::DeviceNotFound => write!(f, "Device not found"),
            CommandError::InvalidVolume => write!(f, "Volume out of range"),
            CommandError::DbusError(msg) => write!(f, "D-Bus error: {}", msg),
        }
    }
}

#[tauri::command]
pub fn set_audio_device(device_id: String) -> Result<(), CommandError> {
    // Validate the device
    if device_id.is_empty() {
        return Err(CommandError::DeviceNotFound);
    }
    Ok(())
}
```

## Async Commands

```rust
use tokio::time::{sleep, Duration};

// Simple async command
#[tauri::command]
pub async fn fetch_network_status() -> Result<NetworkStatus, String> {
    sleep(Duration::from_secs(2)).await;
    Ok(NetworkStatus {
        connected: true,
        signal: 85,
    })
}

// Async with I/O operations
#[tauri::command]
pub async fn read_config_file() -> Result<String, String> {
    let content = std::fs::read_to_string("config.toml")
        .map_err(|e| format!("Failed to read config: {}", e))?;
    Ok(content)
}

// Async with a timeout
#[tauri::command]
pub async fn get_device_list() -> Result<Vec<Device>, String> {
    match tokio::time::timeout(
        Duration::from_secs(5),
        fetch_devices_from_dbus()
    ).await {
        Ok(Ok(devices)) => Ok(devices),
        Ok(Err(e)) => Err(e),
        Err(_) => Err("Operation timed out".to_string()),
    }
}

async fn fetch_devices_from_dbus() -> Result<Vec<Device>, String> {
    // Async operation
    Ok(vec![])
}
```

## Accessing Shared State

```rust
use tauri::State;
use std::sync::Mutex;

pub struct AppConfig {
    pub config_path: String,
}

pub struct AudioState {
    pub current_volume: Mutex<u32>,
}

#[tauri::command]
pub fn get_config_path(state: State<AppConfig>) -> String {
    state.config_path.clone()
}

#[tauri::command]
pub fn get_volume(state: State<AudioState>) -> u32 {
    *state.current_volume.lock().unwrap()
}

#[tauri::command]
pub fn set_volume(level: u32, state: State<AudioState>) -> Result<(), String> {
    *state.current_volume.lock().unwrap() = level;
    Ok(())
}

// In main.rs
#[tauri::command]
fn main() {
    let audio_state = AudioState {
        current_volume: Mutex::new(50),
    };
    
    tauri::Builder::default()
        .manage(AppConfig {
            config_path: "/home/user/.config".to_string(),
        })
        .manage(audio_state)
        .invoke_handler(tauri::generate_handler![
            get_config_path,
            get_volume,
            set_volume,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Emitting Events to the Frontend

```rust
use tauri::Manager;

// Emit an event to a specific window
#[tauri::command]
pub fn notify_volume_change(
    window: tauri::Window,
    new_volume: u32,
) -> Result<(), String> {
    window.emit("volume_changed", new_volume)
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Emit an event to every window
#[tauri::command]
pub fn notify_globally(
    app: tauri::AppHandle,
    message: String,
) -> Result<(), String> {
    app.emit_all("global_event", message)
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Emit asynchronously
#[tauri::command]
pub async fn long_operation(window: tauri::Window) -> Result<String, String> {
    for i in 0..10 {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        window.emit("progress", i)
            .map_err(|e| e.to_string())?;
    }
    Ok("Completed".to_string())
}
```

## Filesystem Access

```rust
use tauri::api::path;
use std::fs;

#[tauri::command]
pub fn save_config(content: String) -> Result<(), String> {
    let config_dir = path::config_dir()
        .ok_or("Cannot find config dir")?;
    
    let config_path = config_dir.join("vasak").join("config.toml");
    
    fs::create_dir_all(config_path.parent().unwrap())
        .map_err(|e| e.to_string())?;
    
    fs::write(&config_path, content)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn load_config() -> Result<String, String> {
    let config_dir = path::config_dir()
        .ok_or("Cannot find config dir")?;
    
    let config_path = config_dir.join("vasak").join("config.toml");
    
    fs::read_to_string(&config_path)
        .map_err(|e| e.to_string())
}
```

## D-Bus Integration

```rust
use zbus::Connection;

#[tauri::command]
pub async fn get_volume_from_dbus() -> Result<u32, String> {
    // Connect to the session bus
    let connection = Connection::session()
        .await
        .map_err(|e| format!("D-Bus connection failed: {}", e))?;
    
    // Get the information
    let volume = dbus_service::get_volume(&connection)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(volume)
}

#[tauri::command]
pub async fn list_bluetooth_devices() -> Result<Vec<BluetoothDevice>, String> {
    let connection = Connection::system()
        .await
        .map_err(|e| format!("D-Bus system connection failed: {}", e))?;
    
    dbus_service::list_devices(&connection)
        .await
        .map_err(|e| e.to_string())
}
```

## Input Validation

```rust
#[tauri::command]
pub fn process_data(
    name: String,
    age: u32,
    email: String,
) -> Result<ProcessedData, String> {
    // Validate the name
    if name.is_empty() || name.len() > 100 {
        return Err("Invalid name length".to_string());
    }
    
    // Validate the age
    if age < 18 || age > 120 {
        return Err("Invalid age".to_string());
    }
    
    // Validate the email
    if !email.contains('@') {
        return Err("Invalid email".to_string());
    }
    
    Ok(ProcessedData {
        name,
        age,
        email,
    })
}
```

## Hardware-related Commands

```rust
// Brightness control
#[tauri::command]
pub fn set_brightness(level: u32) -> Result<(), String> {
    if level > 100 {
        return Err("Brightness must be 0-100".to_string());
    }
    
    // Use D-Bus or a sysfs file
    std::fs::write(
        "/sys/class/backlight/intel_backlight/brightness",
        format!("{}", level * 255 / 100)
    ).map_err(|e| e.to_string())
}

// Bluetooth control
#[tauri::command]
pub async fn scan_bluetooth_devices() -> Result<Vec<Device>, String> {
    // Use the BlueZ D-Bus API
    Ok(vec![])
}

// Network control
#[tauri::command]
pub async fn get_wifi_networks() -> Result<Vec<WiFiNetwork>, String> {
    // Use the NetworkManager D-Bus API
    Ok(vec![])
}
```

## Permissions (Tauri Capabilities)

In `src-tauri/capabilities/default.json`:

```json
{
  "permission": [
    "core:window:allow-create",
    "core:fs:allow-read-file",
    "core:fs:allow-write-file",
    "core:shell:allow-execute"
  ]
}
```

Restrict commands:

```json
{
  "commands": {
    "allow": ["safe_command"],
    "deny": ["dangerous_command"]
  }
}
```

## Command Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_set_volume_valid() {
        let result = set_volume(50);
        assert!(result.is_ok());
    }

    #[test]
    fn test_set_volume_invalid() {
        let result = set_volume(150);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Volume must be 0-100");
    }

    #[tokio::test]
    async fn test_async_command() {
        let devices = load_devices().await;
        assert!(devices.is_ok());
    }
}
```

## Best Practices

### ✅ Do:
- Always validate the input
- Return errors explicitly
- Document the commands
- Use types instead of strings
- Handle timeouts in async code
- Clean up resources

### ❌ Don't:
- Trust input coming from the frontend
- Ignore errors
- Block the main thread
- Use unwrap in production
- Run very long operations without feedback
- Keep secrets in the code

## Command Checklist

- [ ] Descriptive name
- [ ] Input validation
- [ ] Clear types
- [ ] Error handling
- [ ] Documented
- [ ] Tested
- [ ] Registered in lib.rs
- [ ] Performance validated
