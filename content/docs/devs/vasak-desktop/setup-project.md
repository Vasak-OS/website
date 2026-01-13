---
title: "Setup del Proyecto | vasak-desktop"
weight: 1
---

# Setup del Proyecto - Vasak Desktop

Guía completa para configurar tu entorno de desarrollo de Vasak Desktop.

## Requisitos Previos

### Requisitos del Sistema

- **OS**: Linux (Fedora, Ubuntu, Debian, Arch, etc.)
- **RAM**: Mínimo 4GB (8GB recomendado)
- **Almacenamiento**: 5GB espacio libre
- **Internet**: Conexión para descargar dependencias

> Es sumamente importante realizar la [instalacion de dependencias para desarrolladores](/docs/devs/dev-dependencies/) dado que de aqui en adelante son dependnecias especificas de `vasak-desktop`

### Dependencias del Sistema [`vasak-desktop`]

#### Fedora y derivadas

```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install gtk3-devel glib2-devel cairo-devel dbus-devel libxkbcommon-devel
sudo dnf install libwayland-devel libxcb-devel

# Para desarrollo de Wayland
sudo dnf install wayland-devel wayland-protocols-devel
```

#### Debian y derivadas

```bash
sudo apt install libgtk-3-dev libglib2.0-dev libcairo-dev libdbus-1-dev libxkbcommon-dev
sudo apt install libwayland-dev libxcb-xfixes0-dev libxcb-shape0-dev

# Para desarrollo de Wayland
sudo apt install wayland-protocols libwayland-dev
```

#### Arch y derivadas

```bash
sudo pacman -S gtk3 glib2 cairo dbus libxkbcommon
sudo pacman -S wayland wayland-protocols libxcb
```


## Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/Vasak-OS/vasak-desktop.git
cd vasak-desktop

# Crear una rama para desarrollo
git checkout -b feature/mi-feature
```

## Instalar Dependencias

### Frontend (JavaScript/TypeScript)

```bash
bun install
```

### Backend (Rust)

Las dependencias de Rust se manejan automáticamente con Cargo.

```bash
# Verificar que se descargan correctamente
cargo check

# Descargar e indexar dependencias
cargo build --release  # (Esto toma tiempo la primera vez)
```

## Estructura Inicial

Después de clonar, deberías tener:

```
vasak-desktop/
├── src/                    # Frontend (Vue.js)
│   ├── components/        # Componentes Vue
│   ├── views/            # Vistas/Páginas
│   ├── App.vue           # Componente raíz
│   └── main.ts           # Punto de entrada
│
├── src-tauri/            # Backend (Rust)
│   ├── src/              # Código Rust
│   │   ├── lib.rs       # Módulos del backend
│   │   ├── main.rs      # Punto de entrada
│   │   ├── commands/    # Comandos IPC
│   │   └── ...          # Otros módulos
│   └── Cargo.toml        # Dependencias Rust
│
├── package.json          # Dependencias Frontend
├── tsconfig.json         # Configuración TypeScript
├── vite.config.ts        # Configuración Vite
└── tauri.conf.json       # Configuración Tauri
```

## Verificar que Todo Está Correcto

```bash
# Comprobar que todo compila correctamente
bun run tauri build

# Si finaliza sin errores, ¡estás listo!
```

## Próximos Pasos

1. **Ejecutar en desarrollo**: Ver [Compilación](compilacion.md)
2. **Entender arquitectura**: Ver [Arquitectura General](arquitectura.md)
3. **Conocer estructura**: Ver [Sistema de Carpetas](carpetas.md)

## Troubleshooting

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

## Siguientes Pasos

- [Compilación](compilacion.md) - Cómo ejecutar en desarrollo
- [Dependencias](dependencias.md) - Gestionar dependencias
- [Arquitectura General](arquitectura.md) - Entender la estructura
