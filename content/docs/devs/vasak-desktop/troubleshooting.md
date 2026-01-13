---
title: "Solucion de Problemas | vasak-desktop"
weight: 9999
---

## Problemas Comunes de Setup

Aqui tienes la solucion de de errores comunes durante el setup del proyecto

### Error: "Rust toolchain not found"

```bash
# Asegúrate de que Rust está en tu PATH
source $HOME/.cargo/env

# Verifica nuevamente
rustc --version
```

### Error: "GTK development libraries not found"

```bash
# Fedora
sudo dnf install gtk3-devel

# Ubuntu/Debian
sudo apt-get install libgtk-3-dev

# Arch
sudo pacman -S gtk3
```

### Error: "D-Bus development libraries not found"

```bash
# Fedora
sudo dnf install dbus-devel

# Ubuntu/Debian
sudo apt-get install libdbus-1-dev

# Arch
sudo pacman -S dbus
```

### Bun/npm no instala paquetes

```bash
# Limpia caché
bun pm cache rm --all  # Para Bun
npm cache clean --force  # Para npm

# Intenta nuevamente
bun install  # o npm install
```

### Cargo tarda mucho en compilar

Esto es normal la primera vez (puede tomar 10-30 minutos). 

```bash
# Para compilaciones más rápidas, usa mold si está disponible
# Fedora
sudo dnf install mold

# Configura Cargo para usar mold
# Edita ~/.cargo/config.toml
[build]
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

### Configuración Recomendada del IDE

Ver [Iniciar Proyecto](setup-proyecto.md) en la sección de IDE.

### Verificación Final

Ejecuta esto para confirmar que todo está correcto:

```bash
cat << 'EOF' > verify-setup.sh
#!/bin/bash

echo "=== Verificando Setup de Vasak Desktop ==="
echo

echo "✓ Node/Bun:"
bun --version 2>/dev/null || npm --version

echo "✓ Rust:"
rustc --version

echo "✓ Cargo:"
cargo --version

echo "✓ Tauri CLI:"
cargo tauri --version

echo "✓ TypeScript:"
npx tsc --version

echo
echo "=== Verificando compilación ==="
echo "Frontend..."
bun run build --dry-run 2>&1 | grep -q "error" && echo "❌ Error en Frontend" || echo "✓ Frontend OK"

echo "Backend..."
cargo check 2>&1 | grep -q "error" && echo "❌ Error en Backend" || echo "✓ Backend OK"

echo
echo "=== Setup completado ==="
EOF

chmod +x verify-setup.sh
./verify-setup.sh
```

## Compilacion

Solucion de errores comunes durante la compilacion del proyecto

## Problemas Comunes de Compilación

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

## Problemas Comunes de Dependencias

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