---
title: "Dependencias de Desarrollo"
weight: 5
---

A continuacion encontratas todas las dependencias que debera instalar en su entorno de desarrollo para construir o colaborar con el proyecto, lo mismo aplica para aplicaciones ya existentes o **VAPPs** propias...

## Bun (Frontend)

```bash
curl -fsSL https://bun.sh/install | bash
```

> Mas informacion sobre la instalacion de Bun en [su sitio web](https://bun.com/docs/installation)

## Rust (Backend)

```bash
# Instalar Rust (si aún no lo tienes)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Actualizar a la versión mínima requerida
rustup update

# Verificar versión (debe ser 1.70+)
rustc --version
```

## Tauri CLI [Opcional]

```bash
# Después de instalar Rust
cargo install tauri-cli

# O usar bun
bun add -g @tauri-apps/cli
```

## Dependnecias del Sistema [Tauri]

Las dependendencias minimas para que el poryecto **tauri** inicie. Recomendamos recurrir a su [documentacion oficial](https://v2.tauri.app/start/prerequisites/) para estar al dia con esta informacion

### Debian y derivadas

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

### Arch y derivadas

```bash
sudo pacman -Syu
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  libappindicator-gtk3 \
  librsvg \
  xdotool
```

### Fedora y derivadas

```bash
sudo dnf check-update
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel \
  libxdo-devel
sudo dnf group install "c-development"
```

En caso de que tu distro no se encuentre, puedes verlo en la documentacion oficial y puedes agregarlo a la documentacion

## Herramientas [Opcionales]

```bash
# Git
sudo dnf install git  # Fedora
sudo apt-get install git  # Ubuntu/Debian
sudo pacman -Sy git

# Editor/IDE
# VS Code
sudo dnf install code  # Fedora
# O descarga desde https://code.visualstudio.com

# Herramientas de debug
sudo dnf install gdb valgrind  # Fedora
sudo apt-get install gdb valgrind  # Ubuntu/Debian
sudo pacman -Sy gdb valgrid
```

## Verificar Instalación

```bash
# Verificar Bun/Node
bun --version

# Verificar Rust
rustc --version
cargo --version

# Verificar Tauri CLI
cargo tauri --version
```