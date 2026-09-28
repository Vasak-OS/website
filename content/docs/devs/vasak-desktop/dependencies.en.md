---
title: "Dependency management | vasak-desktop"
weight: 10
description: "Project dependency management: how Vasak Desktop dependencies are declared, updated and resolved."
---

Complete guide to managing the project's dependencies.

## Frontend Dependencies (JavaScript/TypeScript)

### File: `package.json`

The dependencies are defined in this file:

```json
{
  "dependencies": {
    "vue": "^3.5.26",
    "vue-router": "^4.6.4",
    "pinia": "^3.0.4",
    "@tauri-apps/api": "^2.9.1",
    "@vasakgroup/plugin-bluetooth-manager": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vite": "^7.3.0",
    "tailwindcss": "^4.1.18"
  }
}
```

### Install All Dependencies

```bash
bun install
```

### Adding a New Dependency

```bash
bun add package-name

# dev dependency
bun add -D package-name
```

### Updating Dependencies

```bash
# See which packages have updates
bun outdated

# Update everything
bun update

# Update a specific package
bun add package-name@latest

# Update the major version (breaking changes)
bun add package-name@^5.0.0  # If it is on v4
```

### Removing a Dependency

```bash
# Bun
bun remove package-name
```

### Cleaning Up Unused Dependencies

```bash
# Bun
bun install --frozen-lockfile  # After removing them from package.json
```

## Backend Dependencies (Rust)

### File: `src-tauri/Cargo.toml`

Example structure:

```toml
[package]
name = "vasak-desktop"
version = "0.5.2"

[dependencies]
tauri = { version = "2", features = ["protocol-asset"] }
serde = { version = "1", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
zbus = { version = "4", features = ["tokio"] }

[dev-dependencies]
tokio-test = "0.4"
```

### Version Syntax

- `1.0` - Exact: version 1.0.0
- `^1.0` - Compatible: 1.0 through 1.999
- `~1.0` - Patch: only 1.0.x
- `1.0.*` - Patch: only 1.0.x
- `>=1.0, <2.0` - Range: from 1.0 up to but not including 2.0

### Adding a Rust Dependency

```bash
cd src-tauri

# Add a dependency
cargo add crate-name

# Add it with specific features
cargo add crate-name --features "feature1,feature2"

# Add a specific version
cargo add crate-name@1.2.3

# Add it as a dev-dependency
cargo add --dev crate-name
```

### Updating Rust Dependencies

```bash
cd src-tauri

# See what has updates
cargo outdated

# Update everything
cargo update

# Update a specific crate
cargo update -p crate-name

# See the version changes
cargo update --verbose
```

### Removing a Rust Dependency

```bash
cd src-tauri

# Remove it
cargo remove crate-name

# Or edit Cargo.toml directly
# and run:
cargo update
```

## Locking Versions (Lock Files)

### `bun.lock` (Frontend)

- Generated automatically by Bun
- Holds the exact installed versions
- Must be committed to Git

```bash
# Reinstall the exact versions from the lock file
bun install --frozen-lockfile
```

### `Cargo.lock` (Backend)

- Generated automatically by Cargo
- Must be committed to Git

```bash
# For libraries, it is usually not committed
# For executable applications, it is
```

## Dependency Analysis

### Dependency Tree (Frontend)

```bash
# See the dependency tree
bun ls --depth=10

# Filter by package
bun ls | grep pinia
```

### Dependency Tree (Backend)

```bash
cd src-tauri

# See the dependency tree
cargo tree

# Filter by dependency
cargo tree | grep serde

# See only direct dependencies
cargo tree --depth=1
```

### Finding Duplicated Dependencies

```bash
# Frontend
bun ls | grep -E "\s.*@"

# Backend
cargo tree | grep -E "├── |└── " | sort | uniq -d
```

## Security Audit

### Frontend

```bash
# With Bun
bun audit

# Fix with Bun
bun audit --fix
```

### Backend

```bash
cd src-tauri

# Audit the Rust dependencies
cargo audit

# Update crates with vulnerabilities
cargo update -p vulnerable-crate
```

## Cache and Cleanup

### Clearing the npm/Bun Cache

```bash
# Bun
bun pm cache rm --all
```

### Clearing Cargo's Cache

```bash
# Cargo
cargo clean

# Registry cache
rm -rf ~/.cargo/registry/cache
```

### Freeing Up Space

```bash
# See how much space the dependencies take
du -sh node_modules/
du -sh src-tauri/target/

# Clean both
rm -rf node_modules/
rm -rf src-tauri/target/

# Reinstall
bun install
cargo build
```

## Best Practices

### ✅ Do:
- Commit the lock files (`bun.lock`, `Cargo.lock`)
- Use exact versions for production
- Audit dependencies regularly
- Update dependencies incrementally
- Document dependency changes

### ❌ Don't:
- Delete lock files without a reason
- Install `*` versions directly in production
- Ignore security audits
- Update all dependencies at once
- Use very old versions

## Useful Scripts

### Safe Update

```bash
#!/bin/bash
# safe-update.sh

set -e

echo "🔄 Updating dependencies..."

# Frontend
echo "Frontend..."
bun outdated
bun update
bun install

# Backend
echo "Backend..."
cd src-tauri
cargo outdated
cargo update

# Verify the build
echo "Building..."
cd ..
bun run build --dry-run
cargo check

echo "✓ Update complete"
```
