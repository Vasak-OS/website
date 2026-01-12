---
title: "Gestion de dependencias | vasak-desktop"
weight: 10
---

Guía completa para gestionar dependencias del proyecto.

## Dependencias del Frontend (JavaScript/TypeScript)

### Archivo: `package.json`

Las dependencias se definen en este archivo:

```json
{
  "dependencies": {
    "vue": "^3.5.26",
    "vue-router": "^4.6.4",
    "pinia": "^3.0.4",
    "@tauri-apps/api": "^2.9.1",
    "@vasakgroup/plugin-bluetooth-manager": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vite": "^7.3.0",
    "tailwindcss": "^4.1.18"
  }
}
```

### Instalar Todas las Dependencias

```bash
bun install
```

### Añadir una Nueva Dependencia

```bash
bun add nombre-paquete

# dev dependency
bun add -D nombre-paquete
```

### Actualizar Dependencias

```bash
# Ver qué paquetes tienen actualizaciones
bun outdated

# Actualizar todos
bun update

# Actualizar paquete específico
bun add nombre-paquete@latest

# Actualizar versión major (cambios incompatibles)
bun add nombre-paquete@^5.0.0  # Si está en v4
```

### Remover Dependencia

```bash
# Bun
bun remove nombre-paquete
```

### Limpiar Dependencias No Utilizadas

```bash
# Bun
bun install --frozen-lockfile  # Después de eliminar de package.json
```

## Dependencias del Backend (Rust)

### Archivo: `src-tauri/Cargo.toml`

Ejemplo de estructura:

```toml
[package]
name = "vasak-desktop"
version = "0.5.2"

[dependencies]
tauri = { version = "2", features = ["protocol-asset"] }
serde = { version = "1", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
zbus = { version = "4", features = ["tokio"] }

[dev-dependencies]
tokio-test = "0.4"
```

### Estructura de Versiones

- `1.0` - Exacto: versión 1.0.0
- `^1.0` - Compatible: 1.0 a 1.999
- `~1.0` - Parche: 1.0.x solamente
- `1.0.*` - Parche: 1.0.x solamente
- `>=1.0, <2.0` - Rango: desde 1.0 hasta antes de 2.0

### Añadir Dependencia Rust

```bash
cd src-tauri

# Añadir dependencia
cargo add nombre-crate

# Añadir con features específicos
cargo add nombre-crate --features "feature1,feature2"

# Añadir versión específica
cargo add nombre-crate@1.2.3

# Añadir como dev-dependency
cargo add --dev nombre-crate
```

### Actualizar Dependencias Rust

```bash
cd src-tauri

# Ver qué tiene actualizaciones
cargo outdated

# Actualizar todo
cargo update

# Actualizar crate específico
cargo update -p nombre-crate

# Ver cambios de versión
cargo update --verbose
```

### Remover Dependencia Rust

```bash
cd src-tauri

# Remover
cargo remove nombre-crate

# O editar Cargo.toml directamente
# y ejecutar:
cargo update
```

## Dependencias del Sistema

### Verificar Dependencias Instaladas

```bash
# Listar paquetes instalados
pkg-config --list-all | grep -E "(gtk|glib|cairo|dbus)"

# O específicamente
pkg-config --modversion gtk+-3.0
pkg-config --modversion dbus-1
```

### Actualizar Dependencias del Sistema

```bash
# Fedora
sudo dnf update
sudo dnf install gtk3-devel dbus-devel  # Si faltan

# Ubuntu/Debian
sudo apt update
sudo apt install libgtk-3-dev libdbus-1-dev

# Arch
sudo pacman -Syu
sudo pacman -S gtk3 dbus
```

## Bloqueo de Versiones (Lock Files)

### `bun.lock` (Frontend)

- Generado automáticamente por Bun
- Contiene versiones exactas instaladas
- Debe commitirse a Git

```bash
# Reinstalar versiones exactas del lock file
bun install --frozen-lockfile
```

### `Cargo.lock` (Backend)

- Generado automáticamente por Cargo
- Debe commitirse a Git

```bash
# Para librerías, normalmente no se commitea
# Para aplicaciones ejecutables, sí se commitea
```

## Versiones de Dependencias Críticas

### Versiones Soportadas

```
- Bun: Latest
- Rust: 1.70+
- Vue.js: 3.5+
- Tauri: 2.8+
```

### Verificar Versiones

```bash
# Frontend
bun --version

# Backend
rustc --version
cargo --version
```

## Gestión de Plugins de Tauri

Vasak Desktop usa plugins específicos de Tauri:

### Plugins Principales

```json
{
  "dependencies": {
    "@tauri-apps/api": "^2.9.1",
    "@tauri-apps/plugin-fs": "^2.4.4",
    "@tauri-apps/plugin-shell": "^2",
    "@vasakgroup/plugin-bluetooth-manager": "^2.0.0",
    "@vasakgroup/plugin-network-manager": "^2.0.2",
    "@vasakgroup/plugin-config-manager": "^2.0.3"
  }
}
```

### Actualizar Plugins

```bash
# Todos los plugins a la vez
bun add @tauri-apps/api@latest
bun add @vasakgroup/plugin-bluetooth-manager@latest

# Verificar compatibilidad
cargo check
bun run build --dry-run
```

## Análisis de Dependencias

### Árbol de Dependencias (Frontend)

```bash
# Ver árbol de dependencias
bun ls --depth=10

# Filtrar por paquete
bun ls | grep pinia
```

### Árbol de Dependencias (Backend)

```bash
cd src-tauri

# Ver árbol de dependencias
cargo tree

# Filtrar por dependencia
cargo tree | grep serde

# Ver solo dependencias directas
cargo tree --depth=1
```

### Encontrar Dependencias Duplicadas

```bash
# Frontend
bun ls | grep -E "\s.*@"

# Backend
cargo tree | grep -E "├── |└── " | sort | uniq -d
```

## Auditoría de Seguridad

### Frontend

```bash
# Con Bun
bun audit

# Arreglar con Bun
bun audit --fix
```

### Backend

```bash
cd src-tauri

# Auditar dependencias Rust
cargo audit

# Actualizar crates con vulnerabilidades
cargo update -p vulnerable-crate
```

## Caché y Limpieza

### Limpiar Caché de npm/Bun

```bash
# Bun
bun pm cache rm --all
```

### Limpiar Caché de Cargo

```bash
# Cargo
cargo clean

# Caché del registro
rm -rf ~/.cargo/registry/cache
```

### Liberar Espacio

```bash
# Ver tamaño de dependencias
du -sh node_modules/
du -sh src-tauri/target/

# Limpiar ambos
rm -rf node_modules/
rm -rf src-tauri/target/

# Reinstalar
bun install
cargo build
```

## Problemas Comunes

### Error: "Dependency conflict"

```bash
# Frontend - Resuelve conflictos
bun install --latest  # Actualiza todo

# Backend
cd src-tauri
cargo update
cargo check
```

### Error: "Network timeout downloading package"

```bash
# Frontend
bun config set registry https://registry.npmjs.org/

# Backend
cargo install --registry-default

# O especifica timeout
bun install --timeout 300000
```

### Paquete no encontrado

```bash
# Verifica que existe
npm search nombre-paquete

# Verifica sintaxis en package.json
bun install
```

### Compilación falla después de actualizar

```bash
# Limpia todo y recompila
rm -rf node_modules/ bun.lock src-tauri/target/ Cargo.lock
bun install
cargo check

# Si falla, revierte cambios
git checkout package.json Cargo.toml
bun install
cargo check
```

## Mejores Prácticas

### ✅ Haz:
- Committea los archivos lock (`bun.lock`, `Cargo.lock`)
- Usa versiones exactas para producción
- Audita dependencias regularmente
- Actualiza dependencias incrementalmente
- Documenta cambios de dependencias

### ❌ No hagas:
- Elimines lock files sin razón
- Instales directamente versiones `*` en producción
- Ignores auditorías de seguridad
- Actualices todas las dependencias simultáneamente
- Uses versiones muy antiguas

## Scripts Útiles

### Actualización Segura

```bash
#!/bin/bash
# safe-update.sh

set -e

echo "🔄 Actualizando dependencias..."

# Frontend
echo "Frontend..."
bun outdated
bun update
bun install

# Backend
echo "Backend..."
cd src-tauri
cargo outdated
cargo update

# Verificar compilación
echo "Compilando..."
cd ..
bun run build --dry-run
cargo check

echo "✓ Actualización completada"
```

## Siguientes Pasos

- [Setup del Proyecto](setup-proyecto.md)
- [Compilación](compilacion.md)
- [Debugging](debugging.md)
