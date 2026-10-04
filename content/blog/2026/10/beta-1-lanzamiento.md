---
Title: "VasakOS Beta 1: el primer paso hacia un sistema completo"
seotitle: "VasakOS Beta 1: instalador, apps nativas, Wayland | VasakOS"
tags: ["beta", "lanzamiento", "iso", "descargas", "wayland", "rust"]
date: "2026-10-04"
img: "https://i.postimg.cc/4yNLXL7Y/image.png"
description: "VasakOS Beta 1: primera versión completa con instalador gráfico, apps nativas y escritorio Wayland listo para usar."
weight: 10
layout: post
---

Hoy, 4 de octubre de 2026, marcamos un hito que venimos persiguiendo desde que empezó este proyecto: **VasakOS Beta 1 ya es realidad**.

No ha sido un camino corto. Lo que empezó como una idea —construir un sistema operativo desde cero sobre Arch Linux, con un escritorio propio en Wayland y aplicaciones nativas en Rust— se fue transformando en miles de commits, decenas de noches sin dormir, y una comunidad que creció alrededor de la idea de que *sí se puede hacer un Linux de escritorio que se sienta propio, coherente y moderno*.

Hoy, ese sueño da su primer paso oficial: **VasakOS Beta 1**.

## ¿Qué trae la Beta 1?

Esta no es una alpha con promesas. La Beta 1 es la primera versión que **se instala, se usa y se vive**.

### Escritorio completo en Wayland
El escritorio `vasak-desktop` corre sobre Wayfire (wlroots) y systemd. Tiene panel, menú de aplicaciones, área de notificaciones, control de red, sonido, brillo, energía, bloqueo de pantalla y gestos de trackpad. Todo escrito en Rust, con GTK4 y gtk-layer-shell. No hay X11, no hay capas de compatibilidad: es Wayland nativo de verdad.

### Aplicaciones nativas (y funcionando)
- **Vasak Terminal** — terminal con pestañas, paleta de colores del sistema, ligera y rápida
- **Vasak File Manager** — pestañas, vista dividida, progreso real en copiar/mover/borrar, deshacer con Ctrl+Z, montaje SMB/sshfs
- **Vasak Settings** — usuarios, red, sonido, pantalla, energía, apariencia, plugins del compositor
- **Vasak Gallery** — visor de imágenes y organizador
- **Vasak Resonance** — reproductor de audio con listas de reproducción y radios
- **Vasak Terminal** — terminal con pestañas, paleta de colores del sistema

### Instalador gráfico propio: **Vasak Installer**
Ya no hace falta `sudo calamares` desde la terminal. La ISO trae **Vasak Installer**, nuestro propio instalador gráfico escrito en Rust/Tauri. Parte de Calamares, sí, pero con nuestra configuración, nuestras ramas de instalación y nuestra integración. La ISO arranca, eliges idioma, teclado, zona horaria, particionas (o dejas que lo haga el instalador), creas tu usuario y listo. Al reiniciar, estás en VasakOS.

### Repositorio propio firmado
La ISO viene con el repositorio `vasakos` ya configurado y firmado con GPG. `pacman -Syu` te trae actualizaciones del sistema base de Arch **y** de los paquetes de VasakOS (escritorio, apps, servicios, instalador) desde nuestro repositorio firmado con GPG.

### Seguridad y privacidad
- **Vasak Keyring** — llavero nativo (Secret Service) con AES-256-GCM + Argon2id, desbloqueo automático por PAM al iniciar sesión
- **Vasak Permissions** — pide permiso antes de que una app use cámara, micrófono, pantalla o tus cuentas
- **Polkit-vasak** — agente PolicyKit nativo, sin depender de `polkit-gnome`
- **Vasak Accounts** — demonio centralizado de cuentas OAuth2, permisos por app
- **Vasak Flare Daemon** — notificaciones freedesktop con historial persistente
- **Vasak Keyring** — llavero nativo con AES-256-GCM y Argon2id

### Personalización real
El sistema de temas usa **CSS variables** y **CSS masks**. Cambias colores, bordes, redondeos, sombras editando un archivo CSS. No hay que recompilar, no hay que reiniciar. El escritorio se adapta en caliente.

### Descargas

| Espejo | Enlace |
|--------|--------|
| **MediaFire** | [Descargar desde MediaFire](https://www.mediafire.com/file/10rjk90eojzjkl3/vasakos-2026.10.04-x86_64.iso/file) |
| **Mega** | [Descargar desde Mega](https://mega.nz/file/P9BlhDLQ#Wp6SizDnHWMMW9uGPvUYDXb5bmjLfzsBpHPHD7CP6eQ) |
| **SourceForge** | [Descargar desde SourceForge](https://sourceforge.net/projects/vasakos/files/Beta/vasakos-2026.10.04-x86_64.iso/download) |

**SHA256:** `8c2d59a398f4c0f7046728a34419fe3dcb72e164acfb6faeb2d839b5d1749c75`

> **Verifica siempre el checksum** antes de escribir la ISO. `sha256sum vasakos-2026.10.04-x86_64.iso`

**Tamaño de la ISO:** 2.13 GB

## Requisitos

| Mínimo | Recomendado |
|--------|-------------|
| CPU x86_64 | CPU 4+ núcleos |
| 4 GB RAM | 8 GB+ RAM |
| 30 GB disco | 40+ GB disco |
| Pendrive 8 GB | Pendrive 8 GB+ |
| GPU 3D básica | GPU con drivers libres (Intel/AMD) |

## Lo que viene después

La Beta 1 es **el primer paso**, no la meta. Lo que viene:

- **Vasak Installer** completo (particionado avanzado, LUKS, Btrfs, ZFS)
- **Vasak Store** — tienda de apps AppImage y nativas
- **Vasak Prism** — launcher global (archivos, apps, web, comandos)
- **Vasak Calendar / Mail / Contacts** — suite de productividad
- **Vasak Shot** — capturas con anotaciones
- **Vasak Monitor** — monitor de sistema visual
- **Soporte multiidioma** completo en el instalador y el escritorio
- **Documentación completa** en español e inglés
- **Soporte de hardware exótico** (NVIDIA propietario, WiFi raro, laptops extrañas)

## Cómo ayudar

VasakOS es **software libre (GPLv3)**. Todo el código está en [GitHub](https://github.com/Vasak-OS). Puedes:

- **Reportar bugs** en [GitHub Issues](https://github.com/Vasak-OS)
- **Proponer features** en [Discussions](https://github.com/Vasak-OS/discussions)
- **Traducir** la interfaz y la docs
- **Empaquetar** apps para el repositorio
- **Probar** en hardware raro y reportar
- **Donar** en [Ko-fi](https://ko-fi.com/vasakos) o [GitHub Sponsors](https://github.com/sponsors/Vasak-OS)

## Un agradecimiento enorme

A **Tauri**, **WirePlumber**, **Wayfire/wlroots**, **GTK4**, **Rust**, **Arch Linux** y a toda la comunidad upstream que hace posible que un puñado de locos pueda construir un sistema operativo desde cero.

A los que probaron las alphas, reportaron bugs, propusieron features, aguantaron instalaciones rotas y siguieron ahí: **gracias**. Esto es de ustedes tanto como nuestro.

---

**Descarga VasakOS Beta 1 hoy:** [MediaFire](https://www.mediafire.com/file/10rjk90eojzjkl3/vasakos-2026.10.04-x86_64.iso/file) | [Mega](https://mega.nz/file/P9BlhDLQ#Wp6SizDnHWMMW9uGPvUYDXb5bmjLfzsBpHPHD7CP6eQ) | [SourceForge](https://sourceforge.net/projects/vasakos/files/Beta/vasakos-2026.10.04-x86_64.iso/download)

**SHA256:** `8c2d59a398f4c0f7046728a34419fe3dcb72e164acfb6faeb2d839b5d1749c75`

**Changelog completo:** [/changelogs/20261004/](/changelogs/20261004/)

**Estado del proyecto:** [/state/](/state/)

---

*VasakOS Beta 1 — 4 de octubre de 2026 — Hecho con amor en Argentina para el mundo*