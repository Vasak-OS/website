---
title: "Solucion de Problemas | vasak-desktop"
weight: 9999
---

## Error: "Rust toolchain not found"

```bash
# Asegúrate de que Rust está en tu PATH
source $HOME/.cargo/env

# Verifica nuevamente
rustc --version
```

## Error: "GTK development libraries not found"

```bash
# Fedora
sudo dnf install gtk3-devel

# Ubuntu/Debian
sudo apt-get install libgtk-3-dev

# Arch
sudo pacman -S gtk3
```

## Error: "D-Bus development libraries not found"

```bash
# Fedora
sudo dnf install dbus-devel

# Ubuntu/Debian
sudo apt-get install libdbus-1-dev

# Arch
sudo pacman -S dbus
```

## Bun/npm no instala paquetes

```bash
# Limpia caché
bun pm cache rm --all  # Para Bun
npm cache clean --force  # Para npm

# Intenta nuevamente
bun install  # o npm install
```

## Cargo tarda mucho en compilar

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

## Configuración Recomendada del IDE

Ver [Iniciar Proyecto](setup-proyecto.md) en la sección de IDE.

## Verificación Final

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