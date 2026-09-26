---
title: "Troubleshooting | vasak-desktop"
weight: 9999
---

## Common Setup Problems

Here you will find solutions for common errors during the project setup.

### Error: "Rust toolchain not found"

```bash
# Make sure Rust is in your PATH
source $HOME/.cargo/env

# Check again
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

### Bun/npm does not install packages

```bash
# Clear the cache
bun pm cache rm --all  # For Bun
npm cache clean --force  # For npm

# Try again
bun install  # or npm install
```

### Cargo takes a long time to compile

This is normal the first time (it can take 10-30 minutes).

```bash
# For faster builds, use mold if it is available
# Fedora
sudo dnf install mold

# Configure Cargo to use mold
# Edit ~/.cargo/config.toml
[build]
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

### Recommended IDE Configuration

See [Project Setup](/docs/devs/vasak-desktop/setup-project/) in the IDE section.

### Final Check

Run this to confirm that everything is correct:

```bash
cat << 'EOF' > verify-setup.sh
#!/bin/bash

echo "=== Checking Vasak Desktop Setup ==="
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
echo "=== Checking the build ==="
echo "Frontend..."
bun run build --dry-run 2>&1 | grep -q "error" && echo "❌ Frontend error" || echo "✓ Frontend OK"

echo "Backend..."
cargo check 2>&1 | grep -q "error" && echo "❌ Backend error" || echo "✓ Backend OK"

echo
echo "=== Setup complete ==="
EOF

chmod +x verify-setup.sh
./verify-setup.sh
```

## Building

Solutions for common errors when building the project.

## Common Build Problems

### Error: "linking with `cc` failed"

```bash
# Make sure you have gcc installed
sudo dnf install gcc  # Fedora
sudo apt install build-essential  # Ubuntu

# Or try using mold (see the optimization section)
```

### Error: "gtk3-devel not found" or similar

```bash
# Install the missing libraries (see Project Setup)
sudo dnf install gtk3-devel dbus-devel  # Fedora
sudo apt install libgtk-3-dev libdbus-1-dev  # Ubuntu
```

### Error: "Could not find OpenSSL"

```bash
# Install OpenSSL
sudo dnf install openssl-devel  # Fedora
sudo apt install libssl-dev     # Ubuntu

# Or specify the location
export OPENSSL_DIR=/usr/lib/openssl-1.0
cargo build
```

### The build takes a very long time

```bash
# Use parallel compilation (default)
# But you can limit it
cargo build -j 4  # Use 4 cores instead of all of them

# Or use a faster linker (mold)
# See the optimization section
```

### Error: "Binary already exists"

```bash
# The binary is in use, stop the processes
pkill -f vasak-desktop

# Then try building again
cargo build
```

## Common Dependency Problems

### Error: "Dependency conflict"

```bash
# Frontend - resolve conflicts
bun install --latest  # Updates everything

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

# Or specify a timeout
bun install --timeout 300000
```

### Package not found

```bash
# Check that it exists
npm search package-name

# Check the syntax in package.json
bun install
```

### The build fails after updating

```bash
# Clean everything and rebuild
rm -rf node_modules/ bun.lock src-tauri/target/ Cargo.lock
bun install
cargo check

# If it still fails, revert the changes
git checkout package.json Cargo.toml
bun install
cargo check
```
