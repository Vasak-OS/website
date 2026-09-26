---
title: "Project Setup | vasak-desktop"
weight: 1
---

# Project Setup - Vasak Desktop

Complete guide to setting up your Vasak Desktop development environment.

## Prerequisites

### System Requirements

- **OS**: Linux (Fedora, Ubuntu, Debian, Arch, etc.)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 5GB of free space
- **Internet**: A connection to download dependencies

> It is extremely important to complete the [developer dependency installation](/en/docs/devs/dev-dependencies/), because from here on the dependencies are specific to `vasak-desktop`

### System Dependencies for [`vasak-desktop`]

#### Fedora and derivatives

```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install gtk3-devel glib2-devel cairo-devel dbus-devel libxkbcommon-devel
sudo dnf install libwayland-devel libxcb-devel

# For Wayland development
sudo dnf install wayland-devel wayland-protocols-devel
```

#### Debian and derivatives

```bash
sudo apt install libgtk-3-dev libglib2.0-dev libcairo-dev libdbus-1-dev libxkbcommon-dev
sudo apt install libwayland-dev libxcb-xfixes0-dev libxcb-shape0-dev

# For Wayland development
sudo apt install wayland-protocols libwayland-dev
```

#### Arch and derivatives

```bash
sudo pacman -S gtk3 glib2 cairo dbus libxkbcommon
sudo pacman -S wayland wayland-protocols libxcb
```


## Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Vasak-OS/vasak-desktop.git
cd vasak-desktop

# Create a branch for your work
git checkout -b feature/my-feature
```

## Install the Dependencies

### Frontend (JavaScript/TypeScript)

```bash
bun install
```

### Backend (Rust)

Rust dependencies are handled automatically by Cargo.

```bash
# Check that they download correctly
cargo check

# Download and index the dependencies
cargo build --release  # (this takes a while the first time)
```

## Initial Structure

After cloning you should have:

```
vasak-desktop/
├── src/                    # Frontend (Vue.js)
│   ├── components/        # Vue components
│   ├── views/            # Views/pages
│   ├── App.vue           # Root component
│   └── main.ts           # Entry point
│
├── src-tauri/            # Backend (Rust)
│   ├── src/              # Rust code
│   │   ├── lib.rs       # Backend modules
│   │   ├── main.rs      # Entry point
│   │   ├── commands/    # IPC commands
│   │   └── ...          # Other modules
│   └── Cargo.toml        # Rust dependencies
│
├── package.json          # Frontend dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── tauri.conf.json       # Tauri configuration
```

If you want to understand more, read the [folder system](/en/docs/devs/vasak-desktop/folders/) article, where each of these places is explained in depth, so it is easier to find what you are looking for.

## Check That Everything Is Correct

```bash
# Verify that everything builds correctly
bun run tauri build

# If it finishes without errors, you are ready to go!
```

If you run into problems, check our [Troubleshooting](/en/docs/devs/vasak-desktop/troubleshooting/) page before [reporting bugs](/en/docs/user/report-bugs/).
