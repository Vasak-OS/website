---
title: "Debugging"
weight: 35
description: "Debugging VasakOS applications: logging, breakpoints and diagnostics, with a worked example on vasak-desktop."
---

Techniques and tools for debugging code in any **VAPP**; the examples use `vasak-desktop` so
that there is a broad use case.

## Frontend debugging (Vue.js / TypeScript)

### 1. Browser developer tools

**Open DevTools**:
```
F12 or Ctrl+Shift+I or Cmd+Option+I
```

**Main tabs**:
- **Console**: see logs and errors
- **Elements**: inspect the DOM
- **Network**: see requests
- **Sources**: step-by-step debugger
- **Vue DevTools**: Vue.js extension

### 2. Console logging

```typescript
// Normal logs
console.log('Volume:', volume);

// Information
console.info('Operation completed');

// Warnings
console.warn('Unusual values detected');

// Errors
console.error('An error occurred:', error);

// Group related logs
console.group('Audio Settings');
console.log('Volume:', volume);
console.log('Device:', device);
console.groupEnd();

// Data table
console.table([
  { name: 'Device 1', volume: 50 },
  { name: 'Device 2', volume: 75 }
]);

// Timing
console.time('loadAudio');
loadAudio();
console.timeEnd('loadAudio');
```

### 3. Step-by-step debugger

In the **Sources** tab of DevTools:

```typescript
// Conditional breakpoint
function updateVolume(newVolume) {
  // Right-click on the line number
  // Choose "Add conditional breakpoint"
  // Condition: newVolume < 0 || newVolume > 100
  this.volume = newVolume;
}

// Inside DevTools, you can:
// - Step over (F10)
// - Step into (F11)
// - Step out (Shift+F11)
// - See local variables
// - Run commands in the console while stopped
```

### 4. Vue DevTools

An extension for debugging Vue:

```
1. Install: https://devtools.vuejs.org/
2. Open DevTools (F12)
3. Go to the "Vue" tab
4. Inspect components
5. Modify data in real time
6. See emitted events
```

### 5. Tagged logs

```typescript
// Create a custom log function
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

// Usage
log.audio('Volume changed to:', 50);
log.network('WiFi connected to:', 'MyNetwork');
```

## Backend debugging (Rust)

### 1. Print debugging

```rust
// Simple log
println!("Volume: {}", volume);

// Debug format
println!("Struct: {:?}", device);

// Pretty print
println!("Struct: {:#?}", device);

// With eprint for stderr
eprintln!("Error: {}", error);
```

### 2. Debug macros

```rust
// The dbg! macro
let volume = dbg!(get_volume()); // Prints the value and returns it

// assert!/assert_eq!
assert_eq!(volume, 50, "Volume should be 50");

// debug_assert!
debug_assert!(volume <= 100, "Volume out of range");
```

### 3. Environment variables for logging

```bash
# Show all logs
RUST_LOG=debug cargo run

# Only a specific module
RUST_LOG=vasak_desktop::audio=debug cargo run

# TRACE level (very verbose)
RUST_LOG=trace cargo run

# Multiple modules
RUST_LOG=vasak_desktop::audio=debug,vasak_desktop::network=info cargo run

# Backtrace on panics
RUST_BACKTRACE=1 cargo run
RUST_BACKTRACE=full cargo run
```

### 4. Log macros (if you use the `log` crate)

```rust
use log::{debug, info, warn, error};

debug!("Debug message: {:?}", data);
info!("Information message");
warn!("Warning message");
error!("Error message");
```

### 5. The GDB/LLDB debugger

```bash
# Run with the debugger (Linux)
lldb target/debug/vasak-desktop

# At the prompt:
# (lldb) b main           # Breakpoint in main
# (lldb) r                # Run
# (lldb) c                # Continue
# (lldb) n                # Next line
# (lldb) s                # Step into function
# (lldb) p variable_name  # Print variable
# (lldb) q                # Quit
```

## IPC debugging (frontend ↔ backend)

### 1. Watching the IPC commands

**Frontend**:
```typescript
// Before calling the command
console.log('Calling:', 'set_volume', { level: 50 });

// In the call
const result = await invoke('set_volume', { level: 50 });

console.log('Result:', result);
```

**Backend**:
```rust
#[tauri::command]
pub fn set_volume(level: u32) -> Result<(), String> {
    eprintln!("📡 IPC set_volume called with level: {}", level);
    // implementation
}
```

### 2. Tauri debug info

```bash
# See Tauri information
cargo tauri info

# Output:
# Platform: Linux
# Tauri version: 2.8.0
# Node.js version: v20.0.0
```

## D-Bus debugging

### 1. D-Bus monitor

```bash
# See all D-Bus messages
dbus-monitor --session

# Filter by interface
dbus-monitor --session \
  "interface='org.pulseaudio.Server'"

# Filter signals only
dbus-monitor --session type='signal'
```

### 2. Calling D-Bus from the CLI

```bash
# Call a method
dbus-send --session --print-reply \
  /org/pulseaudio/core1 \
  org.PulseAudio.Core1.GetVolume

# See properties
busctl --user get-property \
  org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager \
  State
```

### 3. D-Bus logs in Rust

```rust
// Enable zbus logging
env_logger::Builder::from_default_env()
    .format_timestamp_millis()
    .init();

// Then run with:
RUST_LOG=zbus=debug cargo run
```

## Rendering debugging

### 1. Inspecting the DOM

```typescript
// In the console
document.querySelector('.panel');
document.querySelectorAll('.btn');

// Modify styles
document.querySelector('.panel').style.background = 'red';

// See registered events
monitorEvents(element, 'click');
unmonitorEvents(element);
```

### 2. Performance profiling

```typescript
// In the console
performance.mark('start-operation');

// ... do something ...

performance.mark('end-operation');
performance.measure('operation', 'start-operation', 'end-operation');
performance.getEntriesByName('operation');
```

### 3. The Vue component hierarchy

With Vue DevTools:
1. Open DevTools
2. Go to the "Vue" tab
3. Expand the component tree
4. Click a component to see its props and state
5. Modify data in real time

## Performance debugging

### 1. Frontend

```typescript
// Measure render time
console.time('render');
// ... operation ...
console.timeEnd('render');

// Vue timeline
import { useRenderTracking } from '@vueuse/core';

// In DevTools > Performance tab
// Record the session and analyse the flamegraph
```

### 2. Backend

```bash
# Build with debug optimisations
RUSTFLAGS="-C debuginfo=full" cargo build

# See build times
cargo build -Z timings

# Profiler (Linux)
perf record -F 99 ./target/debug/vasak-desktop
perf report
```

## Async/await debugging

### 1. Promises in the frontend

```typescript
// See the promise state
const promise = invoke('get_volume');
console.log(promise); // See in the console what it does

// Using async/await
async function checkVolume() {
  try {
    const volume = await invoke('get_volume');
    console.log('Volume:', volume);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 2. Async in Rust

```rust
// With logs
#[tauri::command]
pub async fn get_device() -> Result<Device> {
    eprintln!("🔄 Starting get_device");

    // Simulate async work
    tokio::time::sleep(Duration::from_secs(1)).await;

    eprintln!("✓ Finished get_device");
    Ok(device)
}
```

## Memory leak debugging

### 1. Frontend

```typescript
// In DevTools > Memory tab
// 1. Take a heap snapshot
// 2. Perform the operation you think leaks
// 3. Take another heap snapshot
// 4. Compare the two

// For manual debugging
let listeners = [];

// ❌ Memory leak - the listeners are never cleaned up
element.addEventListener('click', handler);
listeners.push(handler);

// ✅ Correct - clean up on unmount
onUnmounted(() => {
  listeners.forEach(h => element.removeEventListener('click', h));
});
```

### 2. Backend

```bash
# Use valgrind (Linux)
valgrind --leak-check=full ./target/debug/vasak-desktop

# Use perf for memory
perf record -e cache-misses ./target/debug/vasak-desktop
```

## Thread debugging

### 1. Rust threads

```rust
use std::thread;

let handle = thread::spawn(|| {
    eprintln!("🧵 Thread: {:?}", thread::current().id());
    // work
});

eprintln!("🧵 Main: {:?}", thread::current().id());
handle.join().unwrap();
```

### 2. Tokio tasks

```rust
#[tokio::main]
async fn main() {
    eprintln!("📋 Task started");

    let task = tokio::spawn(async {
        eprintln!("📋 Task running");
        // async work
    });

    task.await.unwrap();
    eprintln!("📋 Task finished");
}
```
