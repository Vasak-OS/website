---
title: "Code guidelines | vasak-desktop"
weight: 105
---

Standards and best practices for keeping the quality of the code up.

## General principles

### Clarity first

The code should be easy to understand:

```rust
// ❌ Hard to read
fn calc(a: Vec<i32>) -> i32 { a.iter().fold(0, |acc, x| acc + if x % 2 == 0 { x } else { 0 }) }

// ✅ Clear
fn sum_even_numbers(numbers: Vec<i32>) -> i32 {
    numbers
        .iter()
        .filter(|n| n % 2 == 0)
        .sum()
}
```

### Consistency

Stay consistent across the whole project:

- Use the same naming
- Follow the same structure
- Apply the same patterns

### Documentation

Document everything that is not obvious:

```rust
/// Gets the current volume of the audio device.
///
/// # Returns
/// The volume as a percentage (0-100)
pub fn get_volume() -> Result<u32> {
    // Implementation
}
```

```typescript
/**
 * Handles the user's volume change.
 * @param newLevel - New volume level (0-100)
 */
function handleVolumeChange(newLevel: number) {
    // Implementation
}
```

### Explicit errors

Handle errors explicitly:

```rust
// ❌ Doing nothing with the error
let file = std::fs::read_to_string("config.toml");

// ✅ Explicit handling
let file = std::fs::read_to_string("config.toml")
    .map_err(|e| format!("Error reading config: {}", e))?;
```

## TypeScript/JavaScript style guide

### Naming

```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_VOLUME = 100;
const DEFAULT_THEME = 'dark';

// Variables/functions: camelCase
let currentVolume = 50;
function handleVolumeChange() { }

// Classes/interfaces/types: PascalCase
class AudioManager { }
interface Device { }
type Status = 'active' | 'inactive';

// Component files: PascalCase
// AudioControl.vue
// UserCard.vue

// Utility files: camelCase
// audioHelper.ts
// deviceManager.ts
```

### Formatting

```typescript
// Indentation: 2 spaces
const config = {
  name: 'app',
  settings: {
    theme: 'dark'
  }
};

// Quotes: single for strings
const greeting = 'Hello, world';

// Semicolons: always
const value = 42;
const name = 'test';

// Spaces: around operators
let result = a + b;  // ✅
let result = a+b;    // ❌

// Braces: same line
if (condition) {     // ✅
  // code
}

if (condition)       // ❌
{
  // code
}
```

### Vue components

```vue
<template>
  <!-- Use v-if/v-show appropriately -->
  <div v-if="isVisible" class="component">
    <!-- One per line where possible -->
    <button
      @click="handleClick"
      class="btn btn-primary"
      :disabled="isLoading"
    >
      Click me
    </button>
  </div>
</template>

<script setup lang="ts">
// Import in order: external, internal, types
import { ref, computed, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';

import Button from '@/components/buttons/Button.vue';
import type { Device } from '@/interfaces/device';

// Declare props and emits at the start
interface Props {
  title: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

// Reactive variables
const isLoading = ref(false);
const data = ref<Device[]>([]);

// Computed properties
const isActive = computed(() => !isLoading.value);

// Methods
function handleClick() {
  isLoading.value = true;
  // logic
}

// Lifecycle hooks at the end
onMounted(() => {
  // Load data
});
</script>

<style scoped>
/* Use classes over inline styles */
.component {
  display: flex;
  flex-direction: column;
}

/* Group related styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}
</style>
```

### Error handling

```typescript
// ✅ Explicit handling
try {
  const volume = await invoke('get_volume') as number;
  handleVolumeUpdate(volume);
} catch (error) {
  console.error('Error getting the volume:', error);
  showErrorNotification('Could not get the volume');
}

// ❌ Ignoring errors
const volume = await invoke('get_volume');
handleVolumeUpdate(volume); // What if it fails?
```

## Rust style guide

### Naming

```rust
// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES: u32 = 3;
const DEFAULT_TIMEOUT_MS: u64 = 5000;

// Variables/functions: snake_case
let current_volume = 50;
fn get_device_list() { }

// Structs/Enums/Traits: PascalCase
struct AudioDevice { }
enum DeviceStatus { }
trait DeviceManager { }

// Modules: snake_case
mod audio_service;
mod dbus_service;

// Files: snake_case
// audio_service.rs
// dbus_handler.rs
```

### Formatting

```rust
// Indentation: 4 spaces
fn example() {
    let value = 42;
    if condition {
        // code
    }
}

// Maximum line length: ~100 characters
let long_name = function_with_many_arguments(
    arg1,
    arg2,
    arg3,
);

// Documentation: document public functions
/// Gets the current volume of the device.
///
/// # Returns
/// Volume as a percentage (0-100)
///
/// # Errors
/// Returns an error if D-Bus is not available
pub fn get_volume() -> Result<u32> {
    // implementation
}

// Error handling: use ?
pub fn process() -> Result<()> {
    let value = get_value()?;
    let result = transform(value)?;
    Ok(result)
}
```

### Module structure

```rust
// Use clippy for linting
#![allow(dead_code)] // If necessary

// Imports at the start
use std::collections::HashMap;
use zbus::Connection;

use crate::error::{Error, Result};
use crate::structs::Device;

// Private types
pub struct AudioService {
    connection: Connection,
}

// Implementation in this order:
impl AudioService {
    // Constructor
    pub fn new(connection: Connection) -> Self {
        // ...
    }

    // Public methods
    pub fn get_volume(&self) -> Result<u32> {
        // ...
    }

    // Private methods
    fn validate_input(&self) -> Result<()> {
        // ...
    }
}
```

### Rust error handling

```rust
// ✅ Use Result<T>
pub fn set_volume(level: u32) -> Result<()> {
    if level > 100 {
        return Err(Error::InvalidVolume);
    }
    // implementation
    Ok(())
}

// ✅ Use the ? operator
pub fn process() -> Result<()> {
    let value = get_value()?;  // Propagates the error
    Ok(value)
}

// ✅ Use match for complex cases
match operation() {
    Ok(result) => println!("Success: {}", result),
    Err(e) => eprintln!("Error: {}", e),
}
```

## Testing

### TypeScript/Vue

```typescript
// Name tests clearly
describe('AudioControl', () => {
  it('should increase volume when plus button is clicked', () => {
    // arrange
    const wrapper = mount(AudioControl);

    // act
    wrapper.find('.btn-plus').trigger('click');

    // assert
    expect(wrapper.vm.volume).toBe(51);
  });
});
```

### Rust

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_volume_validation() {
        // Arrange
        let invalid_volume = 150;

        // Act & Assert
        assert!(validate_volume(invalid_volume).is_err());
    }

    #[tokio::test]
    async fn test_get_volume() {
        // For async tests
        let result = get_volume().await;
        assert!(result.is_ok());
    }
}
```

## Performance

### TypeScript

```typescript
// ❌ Unnecessary re-rendering
<div v-for="item in items" :key="index">
  {{ item }}
</div>

// ✅ Use unique IDs as the key
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

// ❌ A computed that is always recalculated
const filtered = computed(() => {
  return items.value.filter(/* expensive operation */);
});

// ✅ Cache the results
const filtered = computed(() => {
  if (!needsRefresh.value) return cached.value;
  cached.value = items.value.filter(/* expensive operation */);
  return cached.value;
});
```

### Rust

```rust
// ❌ Unnecessary cloning
fn process(items: Vec<Item>) {
    let copy = items.clone();  // Why?
    transform(copy);
}

// ✅ Use references
fn process(items: &[Item]) {
    transform(items);
}

// ❌ Unnecessary allocations
pub fn get_names() -> Vec<String> {
    vec!["a".to_string(), "b".to_string()]
}

// ✅ Use Cow for flexible cases
pub fn get_names() -> Vec<&'static str> {
    vec!["a", "b"]
}
```

## Commits and versioning

### Commit messages

Use the Conventional Commits format:

```
<type>(<scope>): <description>

<body>

<footer>
```

**Types**:
- `feat:` New functionality
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting changes
- `refactor:` Refactoring with no functional change
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Configuration changes

**Examples**:

```
feat(audio): add support for volume normalization

Implement automatic volume normalization across
different audio devices to provide consistent
output levels.

Fixes #1234
```

```
fix(network): resolve WiFi disconnect issue

Changed connection retry logic to use exponential
backoff instead of fixed intervals.

Closes #5678
```

## Linting and formatting

### Rust

```bash
# Run clippy for warnings
cargo clippy

# Format the code
cargo fmt

# Check before committing
cargo check
cargo fmt --check
cargo clippy -- -D warnings
```

### TypeScript

```bash
# ESLint
npm run lint

# Prettier (automatic formatting)
npx prettier --write src/

# TypeScript check
npx tsc --noEmit
```

## Code review

### PR checklist

- [ ] The code follows the guidelines
- [ ] It is documented
- [ ] It has tests
- [ ] It introduces no regressions
- [ ] Performance validated
- [ ] Commit messages are clear

### When reviewing code

1. **Clarity**: is it easy to understand?
2. **Correctness**: does it do what it intends to?
3. **Style**: does it follow the guidelines?
4. **Testing**: is it well tested?
5. **Performance**: is it efficient?

## Useful resources

- [Rust Book](https://doc.rust-lang.org/book/)
- [Vue 3 Guide](https://vuejs.org/guide/introduction.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clippy Lints](https://doc.rust-lang.org/clippy/)
