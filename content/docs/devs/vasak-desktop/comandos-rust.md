---
title: "Comandos de Rust | vasak-desktop"
weight: 30
---

Guía para desarrollar comandos IPC (Tauri) en Rust.

## Concepto: Comandos Tauri

Los comandos son funciones Rust que se pueden llamar desde el frontend Vue.js a través de IPC.

```
Frontend (Vue) →  invoke('command_name', data)  → Backend (Rust)
                  ↓
              Tauri Bridge
              ↓
           IPC Channel
```

## Estructura Base de un Comando

```rust
// src-tauri/src/commands/mod.rs

use tauri::State;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct VolumeLevel {
    pub level: u32,
}

// Comando simple
#[tauri::command]
pub fn get_version() -> String {
    "0.5.2".to_string()
}

// Comando con parámetros
#[tauri::command]
pub fn set_volume(level: u32) -> Result<(), String> {
    if level > 100 {
        return Err("Volume must be 0-100".to_string());
    }
    
    // Lógica para cambiar volumen
    println!("Volumen establecido a: {}", level);
    Ok(())
}

// Comando async
#[tauri::command]
pub async fn load_devices() -> Result<Vec<Device>, String> {
    // Operación async
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    Ok(vec![])
}

// Comando con estado compartido
#[tauri::command]
pub fn get_config(state: State<AppConfig>) -> Result<String, String> {
    Ok(state.config_path.clone())
}
```

## Registrar Comandos

En `src/main.rs` o `src/lib.rs`:

```rust
use tauri::Manager;

mod commands;
use commands::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // Registra aquí
            get_version,
            set_volume,
            load_devices,
            get_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Tipos de Datos

### Tipos Simples

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

### Tipos Complejos

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
    // Actualizar configuración
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

## Manejo de Errores

```rust
// ✅ Retornar error explícitamente
#[tauri::command]
pub fn validate_input(input: String) -> Result<String, String> {
    if input.is_empty() {
        return Err("Input cannot be empty".to_string());
    }
    Ok(input.to_uppercase())
}

// ✅ Usar custom error type
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
    // Validar device
    if device_id.is_empty() {
        return Err(CommandError::DeviceNotFound);
    }
    Ok(())
}
```

## Comandos Async

```rust
use tokio::time::{sleep, Duration};

// Comando async simple
#[tauri::command]
pub async fn fetch_network_status() -> Result<NetworkStatus, String> {
    sleep(Duration::from_secs(2)).await;
    Ok(NetworkStatus {
        connected: true,
        signal: 85,
    })
}

// Async con operaciones I/O
#[tauri::command]
pub async fn read_config_file() -> Result<String, String> {
    let content = std::fs::read_to_string("config.toml")
        .map_err(|e| format!("Failed to read config: {}", e))?;
    Ok(content)
}

// Async con timeout
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
    // Operación async
    Ok(vec![])
}
```

## Acceso al Estado Compartido

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

// En main.rs
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

## Emitir Eventos al Frontend

```rust
use tauri::Manager;

// Emitir evento a una ventana específica
#[tauri::command]
pub fn notify_volume_change(
    window: tauri::Window,
    new_volume: u32,
) -> Result<(), String> {
    window.emit("volume_changed", new_volume)
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Emitir evento a todas las ventanas
#[tauri::command]
pub fn notify_globally(
    app: tauri::AppHandle,
    message: String,
) -> Result<(), String> {
    app.emit_all("global_event", message)
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Emitir de forma asíncrona
#[tauri::command]
pub async fn long_operation(window: tauri::Window) -> Result<String, String> {
    for i in 0..10 {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        window.emit("progress", i)
            .map_err(|e| e.to_string())?;
    }
    Ok("Completado".to_string())
}
```

## Acceso al Filesystem

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

## Integración con D-Bus

```rust
use zbus::Connection;

#[tauri::command]
pub async fn get_volume_from_dbus() -> Result<u32, String> {
    // Conectar al bus de sesión
    let connection = Connection::session()
        .await
        .map_err(|e| format!("D-Bus connection failed: {}", e))?;
    
    // Obtener información
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

## Validación de Entrada

```rust
#[tauri::command]
pub fn process_data(
    name: String,
    age: u32,
    email: String,
) -> Result<ProcessedData, String> {
    // Validar nombre
    if name.is_empty() || name.len() > 100 {
        return Err("Invalid name length".to_string());
    }
    
    // Validar edad
    if age < 18 || age > 120 {
        return Err("Invalid age".to_string());
    }
    
    // Validar email
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

## Comandos Relacionados con Hardware

```rust
// Control de brillo
#[tauri::command]
pub fn set_brightness(level: u32) -> Result<(), String> {
    if level > 100 {
        return Err("Brightness must be 0-100".to_string());
    }
    
    // Usar D-Bus o archivo sysfs
    std::fs::write(
        "/sys/class/backlight/intel_backlight/brightness",
        format!("{}", level * 255 / 100)
    ).map_err(|e| e.to_string())
}

// Control de Bluetooth
#[tauri::command]
pub async fn scan_bluetooth_devices() -> Result<Vec<Device>, String> {
    // Usar BlueZ D-Bus API
    Ok(vec![])
}

// Control de red
#[tauri::command]
pub async fn get_wifi_networks() -> Result<Vec<WiFiNetwork>, String> {
    // Usar NetworkManager D-Bus API
    Ok(vec![])
}
```

## Permisología (Tauri Capabilities)

En `src-tauri/capabilities/default.json`:

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

Restringir comandos:

```json
{
  "commands": {
    "allow": ["safe_command"],
    "deny": ["dangerous_command"]
  }
}
```

## Testing de Comandos

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

## Mejores Prácticas

### ✅ Haz:
- Valida entrada siempre
- Retorna errores explícitos
- Documenta comandos
- Usa tipos en lugar de strings
- Maneja timeouts en async
- Limpia recursos

### ❌ No hagas:
- Confíes en entrada del frontend
- Ignores errores
- Bloquees el hilo principal
- Uses unwrap en producción
- Hagas operaciones muy largas sin feedback
- Guardes secretos en el código

## Checklist de Comando

- [ ] Nombre descriptivo
- [ ] Validación de entrada
- [ ] Tipos claros
- [ ] Manejo de errores
- [ ] Documentado
- [ ] Testeado
- [ ] Registrado en lib.rs
- [ ] Performance validado

## Comandos Implementados en Vasak Desktop

### Audio
- `get_audio_volume()` - Obtener volumen actual
- `set_audio_volume(volume: u32)` - Establecer volumen
- `toggle_audio_mute()` - Alternar mute
- `get_audio_devices()` - Listar dispositivos de audio
- `set_audio_device(device_id: String)` - Cambiar dispositivo
- `toggle_audio_applet()` - Mostrar/ocultar applet de audio

### Brillo
- `get_brightness_info()` - Información de brillo actual
- `set_brightness_info(brightness: u32)` - Establecer brillo

### Notificaciones
- `send_notify(notification: NotificationData)` - Enviar notificación
- `clear_notifications()` - Limpiar todas las notificaciones
- `get_all_notifications()` - Obtener lista de notificaciones
- `delete_notification(id: String)` - Eliminar notificación específica
- `invoke_notification_action(id: String, action: String)` - Ejecutar acción

### Red
- `toggle_network_applet()` - Mostrar/ocultar applet de red

### Bluetooth
- `toggle_bluetooth_applet()` - Mostrar/ocultar applet de bluetooth

### Música (MPRIS)
- `music_play_pause()` - Play/Pause
- `music_next_track()` - Siguiente pista
- `music_previous_track()` - Pista anterior
- `music_now_playing()` - Información de pista actual

### Búsqueda
- `global_search(query: String)` - Búsqueda global de aplicaciones
- `execute_search_result(result: SearchResult)` - Ejecutar resultado
- `toggle_search()` - Mostrar/ocultar búsqueda

### Atajos de Teclado
- `get_shortcuts()` - Obtener todos los atajos
- `update_shortcut(id: String, new_keys: Vec<String>)` - Actualizar atajo
- `add_custom_shortcut(shortcut: CustomShortcut)` - Añadir atajo personalizado
- `delete_shortcut(id: String)` - Eliminar atajo
- `execute_shortcut(command: String)` - Ejecutar comando de atajo
- `check_shortcut_conflicts(keys: Vec<String>)` - Verificar conflictos

### Sistema
- `get_system_info()` - Información del sistema
- `get_cpu_usage_only()` - Uso de CPU
- `get_memory_usage_only()` - Uso de memoria
- `get_system_config()` - Configuración del sistema
- `set_system_config(config: SystemConfig)` - Establecer configuración
- `get_current_system_state()` - Estado actual del sistema

### Tema
- `toggle_system_theme()` - Alternar tema oscuro/claro
- `get_gtk_themes()` - Listar temas GTK disponibles
- `get_cursor_themes()` - Listar temas de cursor
- `get_icon_packs()` - Listar packs de iconos

### Sesión
- `logout()` - Cerrar sesión
- `shutdown()` - Apagar sistema
- `reboot()` - Reiniciar sistema
- `suspend()` - Suspender sistema
- `detect_display_server()` - Detectar X11/Wayland

**Ubicación**: Todos estos comandos están definidos en `src-tauri/src/commands/` y registrados en `src-tauri/src/lib.rs`.

## Siguientes Pasos

- [Debugging](debugging.md)
- [Lineamientos de Código](lineamientos.md)
- [Componentes Vue](componentes-vue.md)
- [D-Bus](dbus.md) - Para entender la integración con servicios del sistema

