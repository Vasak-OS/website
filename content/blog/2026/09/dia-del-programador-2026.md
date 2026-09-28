---
Title: "Día del Programador 2026: gracias a quienes hacen posible VasakOS"
tags: ["programador", "dia-del-programador", "tauri", "wireplumber", "wayfire", "wayland", "agradecimientos", "comunidad"]
date: "2026-09-13"
img: "/img/posts/programador-2026.svg"
description: "Día 256 (13 sep): Día del Programador. Gracias a Tauri, WirePlumber, Wayfire y todo upstream que hace posible VasakOS."
weight: 10
layout: post
---

Hoy, **13 de septiembre de 2026**, es el **día 256 del año** (2⁸). Por eso se celebra el **Día del Programador**: 256 es el número de valores que cabe en un byte, la unidad básica de nuestro oficio.

Desde VasakOS queremos aprovechar la fecha para **dar las gracias públicamente** a los proyectos y personas *upstream* sin los cuales nuestro escritorio no existiría. No somos una isla: cada línea de código que escribimos se apoya en hombros de gigantes.

---

## 🦀 Tauri: el motor de nuestras aplicaciones nativas

Todas las aplicaciones propias de VasakOS —**Terminal, File Manager, Music, Settings, Session Manager**— están escritas en **Rust + Tauri**.

- **Tauri 1.0** (junio 2022) nos dio una alternativa real a Electron: binarios de 600 KB en vez de 100 MB, Rust en el backend, WebView del sistema (WebKitGTK en Linux) en vez de Chromium embebido.
- **Tauri 2.0** (2024) trajo soporte móvil, plugins oficiales y una API madura para system tray, ventanas personalizadas, menús nativos y sidecars.
- El **equipo de Tauri** (Daniel Thompson-Yvetot, Lucas Ferfoglia, Fabian Larsen, y decenas de *contributors*) responde issues, revisa PRs y mantiene la compatibilidad con WebKitGTK y GTK4 —clave para nosotros en Wayland.
- Un agradecimiento especial a **Lucas Ferfoglia** y **Fabian Larsen** por su trabajo en el bundler, los plugins de ventana y la integración con `webview-webkitgtk`.

> *Sin Tauri, nuestras apps nativas no serían «nativas»: serían Electron disfrazado.*

---

## 🎛 WirePlumber: el cerebro de audio que nos salvó la vida

VasakOS usa **PipeWire** como servidor multimedia y **WirePlumber** como *session policy manager*. En 2025 reportamos un issue crítico: **los dispositivos Bluetooth A2DP no reconectaban tras suspender/hibernar** (wireplumber/wireplumber#412).

- El equipo de **WirePlumber** (George Kiagiadakis, Julian Bouzas, y el resto de *Collabora*) **analizó, reprodujo y parcheó el bug en días**.
- El fix llegó a `wireplumber 0.5.6` y subió a Arch —y por tanto a VasakOS— en la misma semana.
- Además, su trabajo en **`libpipewire`**, **`spa`** y la API de *policy* nos permite escribir reglas de enrutamiento (ej. «si hay auriculares, mueve ahí el audio») sin tocar C.

> *WirePlumber es el pegamento invisible que hace que «simplemente funcione» el audio en Wayland.*

---

## 🪟 Wayfire: el compositor que eligimos para nuestro escritorio

Nuestro shell, **vasak-desktop**, es un *plugin* de **Wayfire** (Wayland Compositor based on wlroots).

- Wayfire nos da **wlroots** (la biblioteca base de compositores Wayland) con una arquitectura de *plugins* en C++ que nos permite escribir el shell como un plugin más: `vasak-shell`, `vasak-panel`, `vasak-overlay`, `vasak-workspaces`…
- El equipo de **Wayfire** (Ivan Vuković, David Rosca, y contribuidores) mantiene wlroots al día con cada versión de Wayland Protocols, añade soporte para *foreign toplevel management*, *layer-shell*, *xdg-activation*… todo lo que un escritorio moderno necesita.
- Cuando necesitamos **gestos de trackpad de 3-4 dedos** para cambiar de espacio de trabajo, Wayfire ya tenía la infraestructura; solo hubo que mapearla.

> *Wayfire + wlroots = compositor Wayland hackeable, sin reinventar la rueda.*

---

## 🐧 Y, por supuesto: Linux, Arch, systemd, Mesa, PipeWire, GTK, WebKitGTK, Rust, Cargo…

La lista es larga. Cada `pacman -Syu` en VasakOS trae trabajo de:

- **Kernel developers** (drm, input, usb, bluetooth, fs…)
- **Mesa / Radeon / Intel / AMD / Nouveau** (drivers GPU abiertos)
- **systemd** (logind, udev, resolved, oomd…)
- **PipeWire + WirePlumber** (audio/vídeo)
- **GTK 4 / libadwaita** (widgets, theming, accesibilidad)
- **WebKitGTK** (el motor WebView de Tauri en Linux)
- **Rust / Cargo / rustup** (el lenguaje y toolchain de nuestras apps)
- **Arch Linux** (rolling, pacman, AUR, wiki, comunidad)

---

## ¿Cómo devolvemos el favor?

1. **Upstream first**: si tocamos código de Tauri, WirePlumber, Wayfire, wlroots, wlroots-rs, gtk-rs, webkitgtk-rs… **el parche va primero a su repo**. Solo si no aceptan (raro) lo mantenemos en nuestro fork temporal.
2. **Reportamos bugs bien**: pasos mínimos, logs, `journalctl`, `coredumpctl`, versión exacta. Los maintainers nos lo agradecen.
3. **Empaquetamos para Arch**: nuestros PKGBUILDs están en `PKGBUILDS/` y muchos acaban en `[extra]` o en el AUR.
3. **Documentamos**: la [wiki de VasakOS](/docs/) y la [guía de desarrollo](/docs/devs/) explican cómo encajan las piezas para que otros no tengan que redescubrirlo.

---

## Un brindis por el código abierto

El 256 (0x100, 1<<8, 2⁸) es un número redondo en binario. Pero lo redondo de verdad es **poder construir sobre el trabajo de miles de personas que decidieron compartirlo**.

**Gracias, equipo de Tauri. Gracias, equipo de WirePlumber. Gracias, equipo de Wayfire. Gracias, kernel hackers. Gracias, Arch developers. Gracias, Rustaceans. Gracias a cada maintainer que revisó un PR a las 23:00 un domingo.**

**¡Feliz Día del Programador!** 🥂

---

**¿A qué proyecto upstream quieres dar las gracias hoy?** Cuéntanos en [Telegram](https://t.me/VasakOS) o en [GitHub](https://github.com/Vasak-OS). Y si quieres sumarte, nuestra [guía de contribución](/docs/devs/contribution/) está abierta.

![Equipo VasakOS programando](/img/posts/programador-2026.jpg)
*Parte del equipo de VasakOS en una sesión de hacking. Foto: propia.*