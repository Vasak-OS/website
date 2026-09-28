---
title: "Setup del Proyecto | vasak-desktop"
weight: 1
description: "Configurar el entorno de desarrollo de Vasak Desktop paso a paso, desde clonar el repositorio hasta compilarlo."
---

# Setup del Proyecto - Vasak Desktop

Guía completa para configurar tu entorno de desarrollo de Vasak Desktop.

## Requisitos Previos

### Requisitos del Sistema

- **OS**: Linux (Fedora, Ubuntu, Debian, Arch, etc.)
- **RAM**: Mínimo 4GB (8GB recomendado)
- **Almacenamiento**: 5GB espacio libre
- **Internet**: Conexión para descargar dependencias

> Es sumamente importante realizar la [instalación de dependencias para desarrolladores](/docs/devs/dev-dependencies/) dado que de aquí en adelante son dependencias específicas de `vasak-desktop`

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

Si quieres entender más sobre el [Sistemas de carpetas](/docs/devs/vasak-desktop/folders/) lee el artículo donde explicamos más a fondo cada uno de estos lugares, para que sea más fácil encontrar lo que estás buscando

## Verificar que Todo Está Correcto

```bash
# Comprobar que todo compila correctamente
bun run tauri build

# Si finaliza sin errores, ¡estás listo!
```

En caso de tener problemas revisa nuestra página de [Solución de problemas](/docs/devs/vasak-desktop/troubleshooting/) antes de [reportar errores](/docs/user/reporte-errores/).