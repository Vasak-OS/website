---
Title: "Programmer's Day 2026: thanks to those who make VasakOS possible"
tags: ["programmer", "programmers-day", "tauri", "wireplumber", "wayfire", "wayland", "thanks", "community"]
date: "2026-09-13"
img: "/img/posts/programador-2026.svg"
description: "Day 256 (13 Sep): Programmer's Day. Thanks to Tauri, WirePlumber, Wayfire and all upstream making VasakOS possible."
weight: 10
layout: post
---

Today, **13 September 2026**, is **day 256 of the year** (2⁸). That's why we celebrate **Programmer's Day**: 256 is the number of values that fit in a byte, the basic unit of our craft.

From VasakOS we want to take this date to **publicly thank** the upstream projects and people without whom our desktop would not exist. We are not an island: every line of code we write stands on the shoulders of giants.

---

## 🦀 Tauri: the engine of our native apps

All of VasakOS's own applications —**Terminal, File Manager, Music, Settings, Session Manager**— are written in **Rust + Tauri**.

- **Tauri 1.0** (June 2022) gave us a real alternative to Electron: 600 KB binaries instead of 100 MB, Rust in the backend, system WebView (WebKitGTK on Linux) instead of bundled Chromium.
- **Tauri 2.0** (2024) brought mobile support, official plugins, and a mature API for system tray, custom windows, native menus and sidecars.
- The **Tauri team** (Daniel Thompson-Yvetot, Lucas Ferfoglia, Fabian Larsen, and dozens of *contributors*) responds to issues, reviews PRs, and maintains compatibility with WebKitGTK and GTK4 —critical for us on Wayland.
- Special thanks to **Lucas Ferfoglia** and **Fabian Larsen** for their work on the bundler, window plugins, and `webview-webkitgtk` integration.

> *Without Tauri, our native apps wouldn't be «native»: they'd be Electron in disguise.*

---

## 🎛 WirePlumber: the audio brain that saved us

VasakOS uses **PipeWire** as the multimedia server and **WirePlumber** as *session policy manager*. In 2025 we reported a critical issue: **Bluetooth A2DP devices wouldn't reconnect after suspend/hibernate** (wireplumber/wireplumber#412).

- The **WirePlumber team** (George Kiagiadakis, Julian Bouzas, and the rest of *Collabora*) **analysed, reproduced and patched the bug in days**.
- The fix landed in `wireplumber 0.5.6` and reached Arch —and thus VasakOS— the same week.
- Their work on **`libpipewire`**, **`spa`** and the *policy* API lets us write routing rules (e.g. «if headphones appear, move audio there») without touching C.

> *WirePlumber is the invisible glue that makes audio «just work» on Wayland.*

---

## 🪟 Wayfire: the compositor we chose for our desktop

Our shell, **vasak-desktop**, is a **Wayfire** plugin (Wayland Compositor based on wlroots).

- Wayfire gives us **wlroots** (the base library for Wayland compositors) with a C++ plugin architecture that lets us write the shell as just another plugin: `vasak-shell`, `vasak-panel`, `vasak-overlay`, `vasak-workspaces`…
- The **Wayfire team** (Ivan Vuković, David Rosca, and contributors) keeps wlroots in sync with every Wayland Protocols release, adds support for *foreign toplevel management*, *layer-shell*, *xdg-activation*… everything a modern desktop needs.
- When we needed **3-4 finger trackpad gestures** to switch workspaces, Wayfire already had the infrastructure; we only had to map it.

> *Wayfire + wlroots = hackable Wayland compositor, no reinventing the wheel.*

---

## 🐧 And, of course: Linux, Arch, systemd, Mesa, PipeWire, GTK, WebKitGTK, Rust, Cargo…

The list is long. Every `pacman -Syu` on VasakOS brings work from:

- **Kernel developers** (drm, input, usb, bluetooth, fs…)
- **Mesa / Radeon / Intel / AMD / Nouveau** (open GPU drivers)
- **systemd** (logind, udev, resolved, oomd…)
- **PipeWire + WirePlumber** (audio/video)
- **GTK 4 / libadwaita** (widgets, theming, accessibility)
- **WebKitGTK** (Tauri's WebView engine on Linux)
- **Rust / Cargo / rustup** (the language and toolchain of our apps)
- **Arch Linux** (rolling, pacman, AUR, wiki, community)

---

## How we give back

1. **Upstream first**: if we touch code in Tauri, WirePlumber, Wayfire, wlroots, wlroots-rs, gtk-rs, webkitgtk-rs… **the patch goes to their repo first**. Only if they don't accept (rare) do we keep it in a temporary fork.
2. **We report bugs well**: minimal steps, logs, `journalctl`, `coredumpctl`, exact version. Maintainers appreciate it.
3. **We package for Arch**: our PKGBUILDs live in `PKGBUILDS/` and many end up in `[extra]` or the AUR.
4. **We document**: the [VasakOS wiki](/docs/) and the [developer guide](/docs/devs/) explain how the pieces fit so others don't have to rediscover it.

---

## A toast to open source

256 (0x100, 1<<8, 2⁸) is a round number in binary. But what's truly round is **being able to build on the work of thousands of people who chose to share it**.

**Thanks, Tauri team. Thanks, WirePlumber team. Thanks, Wayfire team. Thanks, kernel hackers. Thanks, Arch developers. Thanks, Rustaceans. Thanks to every maintainer who reviewed a PR at 23:00 on a Sunday.**

**Happy Programmer's Day!** 🥂

---

**Which upstream project do you want to thank today?** Tell us on [Telegram](https://t.me/VasakOS) or [GitHub](https://github.com/Vasak-OS). And if you want to join, our [contribution guide](/docs/devs/contribution/) is open.

![VasakOS team coding](/img/posts/programador-2026.jpg)
*Part of the VasakOS team in a hacking session. Photo: own.*