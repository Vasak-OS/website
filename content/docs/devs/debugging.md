---
title: "Debugging"
weight: 35
---

Técnicas y herramientas para depurar código en cualquier **VAPP** el ejmplo utiliza `vasak-desktop` con el fin de tener un caso de uso amplio.

## Debugging del Frontend (Vue.js / TypeScript)

### 1. Herramientas de Desarrollo del Navegador

**Abrir DevTools**:
```
F12 o Ctrl+Shift+I o Cmd+Option+I
```

**Pestañas principales**:
- **Console**: Ver logs y errores
- **Elements**: Inspeccionar DOM
- **Network**: Ver requests
- **Sources**: Debugger paso a paso
- **Vue DevTools**: Extensión Vue.js

### 2. Console Logging

```typescript
// Logs normales
console.log('Volumen:', volume);

// Información
console.info('Operación completada');

// Warnings
console.warn('Valores inusuales detectados');

// Errores
console.error('Ocurrió un error:', error);

// Grupar logs relacionados
console.group('Audio Settings');
console.log('Volumen:', volume);
console.log('Dispositivo:', device);
console.groupEnd();

// Tabla de datos
console.table([
  { name: 'Device 1', volume: 50 },
  { name: 'Device 2', volume: 75 }
]);

// Timing
console.time('loadAudio');
loadAudio();
console.timeEnd('loadAudio');
```

### 3. Debugger Paso a Paso

En **Sources** tab de DevTools:

```typescript
// Breakpoint condicional
function updateVolume(newVolume) {
  // Haz click derecho en número de línea
  // Elige "Add conditional breakpoint"
  // Condición: newVolume < 0 || newVolume > 100
  this.volume = newVolume;
}

// Dentro de DevTools, puedes:
// - Avanzar línea (F10)
// - Entrar en función (F11)
// - Salir de función (Shift+F11)
// - Ver variables locales
// - Ejecutar comandos en console mientras parado
```

### 4. Vue DevTools

Extensión para depurar Vue:

```
1. Instala: https://devtools.vuejs.org/
2. Abre DevTools (F12)
3. Ve a pestaña "Vue"
4. Inspecciona componentes
5. Modifica datos en tiempo real
6. Ve eventos emitidos
```

### 5. Logs con Tags

```typescript
// Crear función de log personalizada
const log = {
  audio: (msg: string, data?: any) => {
    console.log(`[AUDIO] ${msg}`, data || '');
  },
  network: (msg: string, data?: any) => {
    console.log(`[NETWORK] ${msg}`, data || '');
  },
  bluetooth: (msg: string, data?: any) => {
    console.log(`[BT] ${msg}`, data || '');
  },
};

// Uso
log.audio('Volumen cambió a:', 50);
log.network('WiFi conectado a:', 'MyNetwork');
```

## Debugging del Backend (Rust)

### 1. Print Debugging

```rust
// Log simple
println!("Volumen: {}", volume);

// Debug format
println!("Struct: {:?}", device);

// Pretty print
println!("Struct: {:#?}", device);

// Con eprint para stderr
eprintln!("Error: {}", error);
```

### 2. Macros de Debug

```rust
// dbg! macro
let volume = dbg!(get_volume()); // Imprime valor y lo retorna

// assert!/assert_eq!
assert_eq!(volume, 50, "Volume debería ser 50");

// debug_assert!
debug_assert!(volume <= 100, "Volume fuera de rango");
```

### 3. Variables de Entorno para Logging

```bash
# Mostrar todos los logs
RUST_LOG=debug cargo run

# Solo módulo específico
RUST_LOG=vasak_desktop::audio=debug cargo run

# Nivel TRACE (muy verboso)
RUST_LOG=trace cargo run

# Múltiples módulos
RUST_LOG=vasak_desktop::audio=debug,vasak_desktop::network=info cargo run

# Backtrace en panics
RUST_BACKTRACE=1 cargo run
RUST_BACKTRACE=full cargo run
```

### 4. Log Macros (si uses `log` crate)

```rust
use log::{debug, info, warn, error};

debug!("Debug message: {:?}", data);
info!("Information message");
warn!("Warning message");
error!("Error message");
```

### 5. Debugger GDB/LLDB

```bash
# Ejecutar con debugger (Linux)
lldb target/debug/vasak-desktop

# En el prompt:
# (lldb) b main           # Breakpoint en main
# (lldb) r                # Run
# (lldb) c                # Continue
# (lldb) n                # Next line
# (lldb) s                # Step into function
# (lldb) p variable_name  # Print variable
# (lldb) q                # Quit
```

## Debugging de IPC (Frontend ↔ Backend)

### 1. Ver Comandos IPC

**Frontend**:
```typescript
// Antes de llamar comando
console.log('Llamando:', 'set_volume', { level: 50 });

// En la llamada
const result = await invoke('set_volume', { level: 50 });

console.log('Resultado:', result);
```

**Backend**:
```rust
#[tauri::command]
pub fn set_volume(level: u32) -> Result<(), String> {
    eprintln!("📡 IPC set_volume llamado con level: {}", level);
    // implementación
}
```

### 2. Tauri Debug Info

```bash
# Ver información de Tauri
cargo tauri info

# Salida:
# Platform: Linux
# Tauri version: 2.8.0
# Node.js version: v20.0.0
```

## Debugging de D-Bus

### 1. Monitor D-Bus

```bash
# Ver todos los mensajes D-Bus
dbus-monitor --session

# Filtrar por interfaz
dbus-monitor --session \
  "interface='org.pulseaudio.Server'"

# Filtrar solo señales
dbus-monitor --session type='signal'
```

### 2. Llamar D-Bus desde CLI

```bash
# Llamar método
dbus-send --session --print-reply \
  /org/pulseaudio/core1 \
  org.PulseAudio.Core1.GetVolume

# Ver propiedades
busctl --user get-property \
  org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager \
  State
```

### 3. Logs de D-Bus en Rust

```rust
// Habilitar logging de zbus
env_logger::Builder::from_default_env()
    .format_timestamp_millis()
    .init();

// Luego ejecutar con:
RUST_LOG=zbus=debug cargo run
```

## Debugging de Rendering

### 1. Inspeccionar DOM

```typescript
// En console
document.querySelector('.panel');
document.querySelectorAll('.btn');

// Modificar estilos
document.querySelector('.panel').style.background = 'red';

// Ver eventos registrados
monitorEvents(element, 'click');
unmonitorEvents(element);
```

### 2. Performance Profiling

```typescript
// En console
performance.mark('start-operation');

// ... hacer algo ...

performance.mark('end-operation');
performance.measure('operation', 'start-operation', 'end-operation');
performance.getEntriesByName('operation');
```

### 3. Vue Component Hierarchy

Con Vue DevTools:
1. Abre DevTools
2. Ve a pestaña "Vue"
3. Expande árbol de componentes
4. Haz click en componente para ver props y estado
5. Modifica datos en tiempo real

## Debugging de Performance

### 1. Frontend

```typescript
// Medir tiempo de render
console.time('render');
// ... operación ...
console.timeEnd('render');

// Timeline de Vue
import { useRenderTracking } from '@vueuse/core';

// En DevTools > Performance tab
// Graba sesión y analiza flamegraph
```

### 2. Backend

```bash
# Compilar con optimizaciones de debug
RUSTFLAGS="-C debuginfo=full" cargo build

# Ver tiempos de compilación
cargo build -Z timings

# Profiler (Linux)
perf record -F 99 ./target/debug/vasak-desktop
perf report
```

## Debugging de Async/Await

### 1. Promesas en Frontend

```typescript
// Ver estado de promesa
const promise = invoke('get_volume');
console.log(promise); // Ver en console qué hace

// Usar async/await
async function checkVolume() {
  try {
    const volume = await invoke('get_volume');
    console.log('Volume:', volume);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 2. Async en Rust

```rust
// Con logs
#[tauri::command]
pub async fn get_device() -> Result<Device> {
    eprintln!("🔄 Iniciando get_device");
    
    // Simular async work
    tokio::time::sleep(Duration::from_secs(1)).await;
    
    eprintln!("✓ Completado get_device");
    Ok(device)
}
```

## Debugging de Memory Leaks

### 1. Frontend

```typescript
// En DevTools > Memory tab
// 1. Toma un heap snapshot
// 2. Realiza operación que crees tiene leak
// 3. Toma otro heap snapshot
// 4. Compara las dos

// Para debug manual
let listeners = [];

// ❌ Memory leak - listeners nunca se limpian
element.addEventListener('click', handler);
listeners.push(handler);

// ✅ Correcto - limpiar en unmount
onUnmounted(() => {
  listeners.forEach(h => element.removeEventListener('click', h));
});
```

### 2. Backend

```bash
# Usar valgrind (Linux)
valgrind --leak-check=full ./target/debug/vasak-desktop

# Usar perf para memory
perf record -e cache-misses ./target/debug/vasak-desktop
```

## Debugging de Threads

### 1. Rust Threads

```rust
use std::thread;

let handle = thread::spawn(|| {
    eprintln!("🧵 Thread: {:?}", thread::current().id());
    // trabajo
});

eprintln!("🧵 Main: {:?}", thread::current().id());
handle.join().unwrap();
```

### 2. Tokio Tasks

```rust
#[tokio::main]
async fn main() {
    eprintln!("📋 Task iniciada");
    
    let task = tokio::spawn(async {
        eprintln!("📋 Tarea ejecutándose");
        // trabajo async
    });
    
    task.await.unwrap();
    eprintln!("📋 Task completada");
}
```
