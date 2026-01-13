---
title: "Compilacion | vasak-desktop"
weight: 5
---

Guía para compilar Vasak Desktop. Sobre la misma veremos como realizar compilaciones

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
