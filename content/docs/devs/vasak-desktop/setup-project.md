---
title: "Setup del Proyecto | vasak-desktop"
weight: 1
---

Cómo dejar el entorno listo para trabajar sobre `vasak-desktop`.

## Requisitos previos

- **Sistema**: Linux con Wayland. Lo más cómodo es VasakOS o cualquier Arch, porque es
  contra lo que se empaqueta; en Fedora o Debian se puede compilar, pero los nombres de los
  paquetes cambian.
- **Memoria**: 4 GB como mínimo, 8 GB para compilar cómodo.
- **Disco**: 5 GB libres. El directorio `target/` de Rust crece rápido.

> Antes de seguir, hacé la
> [instalación de dependencias para desarrolladores](/docs/devs/dev-dependencies/): de acá
> en adelante son las específicas de `vasak-desktop`.

### Dependencias del sistema

#### Arch y derivadas — incluido VasakOS

Son las mismas que declara el PKGBUILD, así que si compila con esto, compila el paquete:

```bash
sudo pacman -S --needed cairo desktop-file-utils gdk-pixbuf2 glib2 gtk3 \
    hicolor-icon-theme libsoup3 pango webkit2gtk-4.1 networkmanager dbus \
    upower gtk-layer-shell gst-plugins-good gst-libav
sudo pacman -S --needed git openssl appmenu-gtk-module libappindicator-gtk3 \
    librsvg cargo bun rust
```

`gst-plugins-good` y `gst-libav` son para el fondo de escritorio en movimiento: sin ellos
WebKit no decodifica el video y el fondo queda fijo. `upower` es el indicador de batería, y
`gtk-layer-shell` es lo que permite dibujar el panel como una capa del compositor.

#### Fedora y derivadas

```bash
sudo dnf group install "Development Tools"
sudo dnf install gtk3-devel glib2-devel cairo-devel dbus-devel libxkbcommon-devel \
    webkit2gtk4.1-devel libsoup3-devel gtk-layer-shell-devel \
    wayland-devel wayland-protocols-devel
```

#### Debian y derivadas

```bash
sudo apt install libgtk-3-dev libglib2.0-dev libcairo-dev libdbus-1-dev \
    libxkbcommon-dev libwebkit2gtk-4.1-dev libsoup-3.0-dev \
    libgtk-layer-shell-dev libwayland-dev wayland-protocols
```

## Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/Vasak-OS/vasak-desktop.git
cd vasak-desktop

# Crear una rama para desarrollo
git checkout -b fix/descripcion-corta
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

## La estructura

Después de clonar:

```
vasak-desktop/
├── src/                     # Interfaz (Vue 3 + TypeScript)
│   ├── components/          # Componentes
│   ├── views/               # Una por ventana: panel, escritorio, menú, centro de control
│   ├── services/            # Los envoltorios de las llamadas al backend
│   ├── tools/               # Lógica sin interfaz, y donde viven los tests
│   ├── App.vue
│   └── main.ts
│
├── src-tauri/               # Backend (Rust)
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs           # Registro de comandos y plugins
│   │   └── commands/        # Los comandos que llama la interfaz
│   ├── locales/             # Los textos, un .yml por idioma
│   ├── capabilities/        # Qué puede llamar cada ventana
│   ├── Cargo.toml
│   └── tauri.conf.json      # Configuración de Tauri, incluida la CSP
│
├── package.json
├── biome.json               # Formato y lint del frontend
├── vite.config.ts
└── index.html
```

`tauri.conf.json` va **dentro de `src-tauri/`**, no en la raíz.

Cada carpeta está explicada a fondo en
[sistema de carpetas](/docs/devs/vasak-desktop/folders/).

## Verificar que todo está bien

Antes de escribir nada, comprobá que el proyecto está sano. Es lo mismo que hay que dejar
en verde antes de abrir un pull request:

```bash
bun test                                          # tests del frontend
bunx --bun vue-tsc --noEmit                       # tipos
bunx --bun biome check .                          # formato y lint
cargo test --manifest-path src-tauri/Cargo.toml   # tests del backend
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets
```

Y que arranque:

```bash
bunx --bun tauri dev
```

> Para **compilar** usá siempre `tauri build`, nunca `cargo build --release` a secas: con
> `cargo` el binario queda apuntando al servidor de desarrollo, la ventana abre vacía y
> todo parece roto por otra razón.

Si algo falla, mirá
[solución de problemas](/docs/devs/vasak-desktop/troubleshooting/) antes de
[reportar el error](/docs/user/report-bugs/).
