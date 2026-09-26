---
title: "Development dependencies"
weight: 5
---

Below you will find all the dependencies you should install in your development
environment to build or contribute to the project. The same applies to existing applications or
your own **VAPPs**...

## Bun (frontend)

```bash
curl -fsSL https://bun.sh/install | bash
```

> More information about installing Bun on [its website](https://bun.com/docs/installation)

## Rust (backend)

```bash
# Install Rust (if you do not have it yet)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Update to the minimum required version
rustup update

# Check the version (it should be 1.70+)
rustc --version
```

## Tauri CLI [optional]

```bash
# After installing Rust
cargo install tauri-cli

# Or use bun
bun add -g @tauri-apps/cli
```

## System dependencies [Tauri]

The minimum dependencies for the **tauri** project to start. We recommend following its
[official documentation](https://v2.tauri.app/start/prerequisites/) to stay up to date with
this information.

### Debian and derivatives

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

### Arch and derivatives

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

### Fedora and derivatives

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

If your distro is not listed, you can find it in the official documentation and add it to the
documentation.

## Tools [optional]

```bash
# Git
sudo dnf install git  # Fedora
sudo apt-get install git  # Ubuntu/Debian
sudo pacman -Sy git

# Editor/IDE
# VS Code
sudo dnf install code  # Fedora
# Or download from https://code.visualstudio.com

# Debug tools
sudo dnf install gdb valgrind  # Fedora
sudo apt-get install gdb valgrind  # Ubuntu/Debian
sudo pacman -Sy gdb valgrid
```

## Verifying the installation

```bash
# Check Bun/Node
bun --version

# Check Rust
rustc --version
cargo --version

# Check the Tauri CLI
cargo tauri --version
```
