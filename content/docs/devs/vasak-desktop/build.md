---
title: "Compilacion| vasak-desktop"
weight: 5
---

Guía para compilar y ejecutar Vasak Desktop en diferentes modos.

## Modo Desarrollo

### Ejecutar Aplicación Completa en Desarrollo

```bash
cd /path/to/vasak-desktop

# Ejecutar en modo desarrollo (con hot reload)
bun run tauri dev

# O con Tauri CLI directamente
cargo tauri dev
```

Esto abrirá:
- Vite dev server (frontend) en `http://localhost:5173`
- Ventana de Tauri con la aplicación
- Hot reload habilitado para cambios en el código


## Modo Producción

### Compilación Completa

```bash
# Compilar todo para producción
bun run tauri build

# O con Tauri CLI
cargo tauri build
```

**Nota**: La compilación en producción toma **15-30 minutos** la primera vez.

### Resultado

Después de compilar, encontrarás:

```
src-tauri/target/release/
├── bundle/                    # Paquetes distribuibles
│   ├── deb/                  # Paquete Debian (.deb)
│   ├── appimage/             # AppImage - Actualmente Apagado
│   ├── rpm/                  # Paquete RPM - Actualmente Apagado
│   └── (otros formatos)
└── vasak-desktop             # Binario ejecutable
```

### Instalar Paquete Localmente

```bash
# Debian/Ubuntu
sudo apt install ./src-tauri/target/release/bundle/deb/*.deb
```

## Compilación en Debug

Para desarrollo con símbolos de debug:

```bash
# Backend con símbolos de debug
cargo build

# Ejecutar con debug symbols
RUST_BACKTRACE=1 cargo run

# O para máxima verbosidad
RUST_LOG=trace RUST_BACKTRACE=full cargo run
```

## Compilación Condicional

### Características Específicas (Features)

```bash
# Compilar sin ciertos componentes
cargo build --no-default-features

# Compilar solo con features específicos
cargo build --features "audio,bluetooth"

# Ver features disponibles
cargo build --features
```

### Compilación Dirigida a Plataforma Específica

```bash
# Compilar para X11 específicamente
cargo build --features "x11"

# Compilar para Wayland específicamente
cargo build --features "wayland"
```

## Optimización de Compilación

### Compilación Más Rápida

```bash
# Usar compilador paralelo mold
# 1. Instala mold
sudo dnf install mold  # Fedora
sudo apt install mold  # Ubuntu

# 2. Configura Cargo (~/.cargo/config.toml)
[build]
rustflags = ["-C", "link-arg=-fuse-ld=mold"]

# 3. Compila normalmente (será más rápido)
cargo build
```

### Compilación Incremental

```bash
# Solo recompila lo que cambió
cargo build

# Útil durante desarrollo repetitivo
```

## Gestión de Caché de Compilación

```bash
# Limpiar todo y recompilar desde cero
cargo clean

# Limpiar solo el directorio de release
rm -rf target/release/
cargo build --release

# Limpiar caché de Bun
bun pm cache rm --all
```

## Compilación Cruzada

### Compilar para Arquitectura Diferente

```bash
# Listar targets disponibles
rustup target list

# Instalar target adicional (ej: ARM64)
rustup target add aarch64-unknown-linux-gnu

# Compilar para ARM64
cargo build --release --target aarch64-unknown-linux-gnu
```

## Verificación de Compilación

```bash
# Verificar que compila sin warnings
cargo check

# Compilar y ver warnings
cargo build 2>&1 | grep warning

# Verificar estilo de código (linting)
cargo clippy

# Ejecutar tests
cargo test
```

## Troubleshooting de Compilación

### Error: "linking with `cc` failed"

```bash
# Asegúrate de tener gcc instalado
sudo dnf install gcc  # Fedora
sudo apt install build-essential  # Ubuntu

# O intenta usar mold (ver sección de optimización)
```

### Error: "gtk3-devel not found" o similar

```bash
# Instala las librerías faltantes (ver Setup del Proyecto)
sudo dnf install gtk3-devel dbus-devel  # Fedora
sudo apt install libgtk-3-dev libdbus-1-dev  # Ubuntu
```

### Error: "Could not find OpenSSL"

```bash
# Instala OpenSSL
sudo dnf install openssl-devel  # Fedora
sudo apt install libssl-dev     # Ubuntu

# O especifica ubicación
export OPENSSL_DIR=/usr/lib/openssl-1.0
cargo build
```

### La compilación toma muy tiempo

```bash
# Usa compilación paralela (por defecto)
# Pero puedes limitar
cargo build -j 4  # Usar 4 cores en lugar de todos

# O usar compilador más rápido (mold)
# Ver sección de optimización
```

### Error: "Binary already exists"

```bash
# El binario está en uso, termina los procesos
pkill -f vasak-desktop

# Luego intenta compilar de nuevo
cargo build
```

## Siguientes Pasos

- [Dependencias](dependencias.md) - Gestionar paquetes
- [Debugging](debugging.md) - Depurar código
- [Arquitectura General](arquitectura.md) - Entender estructura
