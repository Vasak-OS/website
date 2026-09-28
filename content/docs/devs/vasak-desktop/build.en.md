---
title: "Build | vasak-desktop"
weight: 5
description: "How to build Vasak Desktop: development commands, production builds, and what to check when a build fails."
---

Guide for building Vasak Desktop. It also covers how to run builds.

## Production Build

### Full Build

```bash
# Build everything for production
bun run tauri build

# Or with the Tauri CLI
cargo tauri build
```

**Note**: The production build takes **15-30 minutes** the first time.

### Result

After building you will find:

```
src-tauri/target/release/
├── bundle/                    # Distributable packages
│   ├── deb/                  # Debian package (.deb)
│   ├── appimage/             # AppImage - currently disabled
│   ├── rpm/                  # RPM package - currently disabled
│   └── (other formats)
└── vasak-desktop             # Executable binary
```

### Install the Package Locally

```bash
# Debian/Ubuntu
sudo apt install ./src-tauri/target/release/bundle/deb/*.deb
```

## Debug Build

For development with debug symbols:

```bash
# Backend with debug symbols
cargo build

# Run with debug symbols
RUST_BACKTRACE=1 cargo run

# Or for maximum verbosity
RUST_LOG=trace RUST_BACKTRACE=full cargo run
```

## Conditional Build

### Specific Features

```bash
# Build without certain components
cargo build --no-default-features

# Build with only specific features
cargo build --features "audio,bluetooth"

# See available features
cargo build --features
```

### Building for a Specific Platform

```bash
# Build for X11 specifically
cargo build --features "x11"

# Build for Wayland specifically
cargo build --features "wayland"
```

## Build Optimization

### Faster Builds

```bash
# Use the parallel mold linker
# 1. Install mold
sudo dnf install mold  # Fedora
sudo apt install mold  # Ubuntu

# 2. Configure Cargo (~/.cargo/config.toml)
[build]
rustflags = ["-C", "link-arg=-fuse-ld=mold"]

# 3. Build normally (it will be faster)
cargo build
```

## Build Cache Management

```bash
# Clean everything and rebuild from scratch
cargo clean

# Clean only the release directory
rm -rf target/release/
cargo build --release

# Clean Bun's cache
bun pm cache rm --all
```
