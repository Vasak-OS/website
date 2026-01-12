---
title: "Lineamientos de codigo | vasak-desktop"
weight: 10
---

Estándares y mejores prácticas para mantener la calidad del código.

## Principios Generales

### 1. Claridad Primero

El código debe ser fácil de entender:

```rust
// ❌ Difícil de leer
fn calc(a: Vec<i32>) -> i32 { a.iter().fold(0, |acc, x| acc + if x % 2 == 0 { x } else { 0 }) }

// ✅ Claro
fn sum_even_numbers(numbers: Vec<i32>) -> i32 {
    numbers
        .iter()
        .filter(|n| n % 2 == 0)
        .sum()
}
```

### 2. Consistencia

Mantén consistencia en todo el proyecto:

- Usa la misma nomenclatura
- Sigue la misma estructura
- Aplica los mismos patrones

### 3. Documentación

Documenta todo lo que no sea obvio:

```rust
/// Obtiene el volumen actual del dispositivo de audio.
/// 
/// # Returns
/// El volumen en porcentaje (0-100)
pub fn get_volume() -> Result<u32> {
    // Implementación
}
```

```typescript
/**
 * Maneja el cambio de volumen del usuario.
 * @param newLevel - Nuevo nivel de volumen (0-100)
 */
function handleVolumeChange(newLevel: number) {
    // Implementación
}
```

### 4. Errores Explícitos

Maneja errores de forma explícita:

```rust
// ❌ No haces nada con el error
let file = std::fs::read_to_string("config.toml");

// ✅ Manejo explícito
let file = std::fs::read_to_string("config.toml")
    .map_err(|e| format!("Error al leer config: {}", e))?;
```

## Guía de Estilo TypeScript/JavaScript

### Nomenclatura

```typescript
// Constantes: UPPER_SNAKE_CASE
const MAX_VOLUME = 100;
const DEFAULT_THEME = 'dark';

// Variables/Funciones: camelCase
let currentVolume = 50;
function handleVolumeChange() { }

// Clases/Interfaces/Tipos: PascalCase
class AudioManager { }
interface Device { }
type Status = 'active' | 'inactive';

// Archivos de componentes: PascalCase
// AudioControl.vue
// UserCard.vue

// Archivos de utilidad: camelCase
// audioHelper.ts
// deviceManager.ts
```

### Formato

```typescript
// Indentación: 2 espacios
const config = {
  name: 'app',
  settings: {
    theme: 'dark'
  }
};

// Comillas: simples para strings
const greeting = 'Hello, world';

// Punto y coma: siempre
const value = 42;
const name = 'test';

// Espacios: alrededor de operadores
let result = a + b;  // ✅
let result = a+b;    // ❌

// Llaves: misma línea
if (condition) {     // ✅
  // código
}

if (condition)       // ❌
{
  // código
}
```

### Componentes Vue

```vue
<template>
  <!-- Usa v-if/v-show apropiadamente -->
  <div v-if="isVisible" class="component">
    <!-- Uno por línea cuando sea posible -->
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
// Importa en orden: externos, internos, tipos
import { ref, computed, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';

import Button from '@/components/buttons/Button.vue';
import type { Device } from '@/interfaces/device';

// Declara props y emits al inicio
interface Props {
  title: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

// Variables reactivas
const isLoading = ref(false);
const data = ref<Device[]>([]);

// Computed properties
const isActive = computed(() => !isLoading.value);

// Métodos
function handleClick() {
  isLoading.value = true;
  // lógica
}

// Lifecycle hooks al final
onMounted(() => {
  // Cargar datos
});
</script>

<style scoped>
/* Usa classes sobre estilos inline */
.component {
  display: flex;
  flex-direction: column;
}

/* Agrupa estilos relacionados */
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

### Manejo de Errores

```typescript
// ✅ Manejo explícito
try {
  const volume = await invoke('get_volume') as number;
  handleVolumeUpdate(volume);
} catch (error) {
  console.error('Error al obtener volumen:', error);
  showErrorNotification('No se pudo obtener el volumen');
}

// ❌ Ignorar errores
const volume = await invoke('get_volume');
handleVolumeUpdate(volume); // ¿Qué si falla?
```

## Guía de Estilo Rust

### Nomenclatura

```rust
// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES: u32 = 3;
const DEFAULT_TIMEOUT_MS: u64 = 5000;

// Variables/Funciones: snake_case
let current_volume = 50;
fn get_device_list() { }

// Structs/Enums/Traits: PascalCase
struct AudioDevice { }
enum DeviceStatus { }
trait DeviceManager { }

// Módulos: snake_case
mod audio_service;
mod dbus_service;

// Archivos: snake_case
// audio_service.rs
// dbus_handler.rs
```

### Formato

```rust
// Indentación: 4 espacios
fn example() {
    let value = 42;
    if condition {
        // código
    }
}

// Línea máxima: ~100 caracteres
let long_name = function_with_many_arguments(
    arg1,
    arg2,
    arg3,
);

// Documentación: documentar funciones públicas
/// Obtiene el volumen actual del dispositivo.
///
/// # Returns
/// Volumen en porcentaje (0-100)
///
/// # Errors
/// Retorna error si D-Bus no está disponible
pub fn get_volume() -> Result<u32> {
    // implementación
}

// Manejo de errores: usar ?
pub fn process() -> Result<()> {
    let value = get_value()?;
    let result = transform(value)?;
    Ok(result)
}
```

### Estructura de Módulo

```rust
// Usar clippy para lint
#![allow(dead_code)] // Si es necesario

// Imports al inicio
use std::collections::HashMap;
use zbus::Connection;

use crate::error::{Error, Result};
use crate::structs::Device;

// Tipos privados
pub struct AudioService {
    connection: Connection,
}

// Implementación con orden:
impl AudioService {
    // Constructor
    pub fn new(connection: Connection) -> Self {
        // ...
    }

    // Métodos públicos
    pub fn get_volume(&self) -> Result<u32> {
        // ...
    }

    // Métodos privados
    fn validate_input(&self) -> Result<()> {
        // ...
    }
}
```

### Manejo de Errores Rust

```rust
// ✅ Usar Result<T>
pub fn set_volume(level: u32) -> Result<()> {
    if level > 100 {
        return Err(Error::InvalidVolume);
    }
    // implementación
    Ok(())
}

// ✅ Usar ? operator
pub fn process() -> Result<()> {
    let value = get_value()?;  // Propaga error
    Ok(value)
}

// ✅ Usar match para casos complejos
match operation() {
    Ok(result) => println!("Éxito: {}", result),
    Err(e) => eprintln!("Error: {}", e),
}
```

## Testing

### TypeScript/Vue

```typescript
// Nombra tests claramente
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
        // Para tests async
        let result = get_volume().await;
        assert!(result.is_ok());
    }
}
```

## Rendimiento

### TypeScript

```typescript
// ❌ Re-renderizado innecesario
<div v-for="item in items" :key="index">
  {{ item }}
</div>

// ✅ Usar IDs únicas como key
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

// ❌ Computed recalculado siempre
const filtered = computed(() => {
  return items.value.filter(/* operación cara */);
});

// ✅ Cachear resultados
const filtered = computed(() => {
  if (!needsRefresh.value) return cached.value;
  cached.value = items.value.filter(/* operación cara */);
  return cached.value;
});
```

### Rust

```rust
// ❌ Clonar innecesariamente
fn process(items: Vec<Item>) {
    let copy = items.clone();  // ¿Por qué?
    transform(copy);
}

// ✅ Usar referencias
fn process(items: &[Item]) {
    transform(items);
}

// ❌ Allocaciones innecesarias
pub fn get_names() -> Vec<String> {
    vec!["a".to_string(), "b".to_string()]
}

// ✅ Usar Cow para casos flexibles
pub fn get_names() -> Vec<&'static str> {
    vec!["a", "b"]
}
```

## Commits y Versionamiento

### Mensajes de Commit

Usa el formato Conventional Commits:

```
<tipo>(<alcance>): <descripción>

<cuerpo>

<pie>
```

**Tipos**:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato
- `refactor:` Refactorización sin cambios funcionales
- `perf:` Mejora de rendimiento
- `test:` Añadir tests
- `chore:` Cambios en configuración

**Ejemplos**:

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

## Linting y Formateo

### Rust

```bash
# Ejecutar clippy para warnings
cargo clippy

# Formatear código
cargo fmt

# Verificar antes de commit
cargo check
cargo fmt --check
cargo clippy -- -D warnings
```

### TypeScript

```bash
# ESLint
npm run lint

# Prettier (formateo automático)
npx prettier --write src/

# TypeScript check
npx tsc --noEmit
```

## Revisión de Código

### Checklist para PR

- [ ] El código sigue los lineamientos
- [ ] Está documentado
- [ ] Tiene tests
- [ ] No introduce regresiones
- [ ] Rendimiento validado
- [ ] Mensajes de commit claros

### Al revisar código

1. **Claridad**: ¿Es fácil de entender?
2. **Corrección**: ¿Hace lo que pretende?
3. **Estilo**: ¿Sigue los lineamientos?
4. **Testing**: ¿Está bien testeado?
5. **Performance**: ¿Es eficiente?

## Recursos Útiles

- [Rust Book](https://doc.rust-lang.org/book/)
- [Vue 3 Guide](https://vuejs.org/guide/introduction.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clippy Lints](https://doc.rust-lang.org/clippy/)

## Siguientes Pasos

- [Componentes Vue](componentes-vue.md)
- [Comandos Rust](comandos-rust.md)
- [Debugging](debugging.md)
