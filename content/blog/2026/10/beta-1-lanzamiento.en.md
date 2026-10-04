---
Title: "VasakOS Beta 1: the first step toward a complete system"
seotitle: "VasakOS Beta 1: installer, native apps, Wayland | VasakOS"
tags: ["beta", "release", "iso", "downloads", "wayland", "rust"]
date: "2026-10-04"
img: "/img/posts/beta1-banner.jpg"
description: "VasakOS Beta 1 is here: first complete release with graphical installer, all native apps working, and a Wayland desktop ready for daily use."
weight: 10
layout: post
---

Today, October 4, 2026, we mark a milestone we've been chasing since this project began: **VasakOS Beta 1 is here**.

It hasn't been a short journey. What started as an idea — building an operating system from scratch on Arch Linux, with a custom Wayland desktop and native Rust applications — turned into thousands of commits, dozens of sleepless nights, and a community that grew around the idea that *yes, you can build a Linux desktop that feels yours, coherent, and modern*.

Today, that dream takes its first official step: **VasakOS Beta 1**.

## What's in Beta 1?

This isn't an alpha with promises. Beta 1 is the first version that **installs, works, and is ready for daily use**.

## Complete Wayland Desktop
The `vasak-desktop` runs on Wayfire (wlroots) and systemd. It has a panel, application menu, notification area, network control, sound, brightness, power, screen lock, and trackpad gestures. All written in Rust, with GTK4 and gtk-layer-shell. No X11, no compatibility layers: it's native Wayland through and through.

## Native Apps (and they work)
- **Vasak Terminal** — terminal with tabs, system color palette, lightweight and fast
- **Vasak File Manager** — tabs, split view, real progress on copy/move/delete, undo with Ctrl+Z, SMB/sshfs mounting
- **Vasak Settings** — users, network, sound, display, power, appearance, compositor plugins
- **Vasak Gallery** — image viewer and organizer
- **Vasak Resonance** — audio player with playlists and radio

## Native Graphical Installer: **Vasak Installer**
No more `sudo calamares` from the terminal. The ISO ships **Vasak Installer**, our own graphical installer written in Rust/Tauri. Based on Calamares, yes, but with our configuration, our install branches, and our integration. The ISO boots, you pick language, keyboard, timezone, partition (or let the installer handle it), create your user, and you're done. On reboot, you're in VasakOS.

## Signed Repository
The ISO comes with the `vasakos` repository pre-configured and GPG-signed. `pacman -Syu` brings you updates from both Arch's base system **and** VasakOS packages (desktop, apps, services, installer) from our GPG-signed repository.

## Security & Privacy
- **Vasak Keyring** — native keyring (Secret Service) with AES-256-GCM + Argon2id, auto-unlock via PAM at login
- **Vasak Permissions** — asks before an app uses camera, microphone, screen, or your accounts
- **Polkit-vasak** — native PolicyKit agent, no `polkit-gnome` dependency
- **Vasak Accounts** — centralized accounts daemon with OAuth2 and per-app permissions
- **Vasak Flare Daemon** — freedesktop notifications with persistent history
- **Vasak Keyring** — native keyring with AES-256-GCM and Argon2id

## Real Customization
The theming system uses **CSS variables** and **CSS masks**. Change colors, borders, rounding, shadows by editing a CSS file. No recompilation, no reboot. The desktop adapts live.

## Downloads

| Mirror | Link |
|--------|------|
| **MediaFire** | [Download from MediaFire](https://www.mediafire.com/file/10rjk90eojzjkl3/vasakos-2026.10.04-x86_64.iso/file) |
| **Mega** | [Download from Mega](https://mega.nz/file/P9BlhDLQ#Wp6SizDnHWMMW9uGPvUYDXb5bmjLfzsBpHPHD7CP6eQ) |
| **SourceForge** | [Download from SourceForge](https://sourceforge.net/projects/vasakos/files/Beta/vasakos-2026.10.04-x86_64.iso/download) |

**SHA256:** `8c2d59a398f4c0f7046728a34419fe3dcb72e164acfb6faeb2d839b5d1749c75`

> **Always verify the checksum** before writing the ISO. `sha256sum vasakos-2026.10.04-x86_64.iso`

**ISO Size:** 2.13 GB

## Requirements

| Minimum | Recommended |
|---------|-------------|
| x86_64 CPU | 4+ core CPU |
| 4 GB RAM | 8+ GB RAM |
| 30 GB disk | 40+ GB disk |
| 8 GB USB | 8 GB+ USB |
| Basic 3D GPU | Free drivers (Intel/AMD) for best Wayland experience |

## What's Next

Beta 1 is **the first step**, not the finish line. What's coming:

- **Full Vasak Installer** (advanced partitioning, LUKS, Btrfs, ZFS)
- **Vasak Store** — AppImage and native app store with sandboxing and auto-updates
- **Vasak Prism** — global launcher (files, apps, open apps, web)
- **Vasak Calendar / Mail / Contacts** — productivity suite
- **Vasak Shot** — screenshot tool with annotations
- **Vasak Monitor** — visual system monitor
- **Full multi-language support** in installer and desktop
- **Complete documentation** in Spanish and English
- **Exotic hardware support** (NVIDIA proprietary, weird WiFi, odd laptops)

## How to Help

VasakOS is **free software (GPLv3)**. All code is on [GitHub](https://github.com/Vasak-OS). You can:

- **Report bugs** on [GitHub Issues](https://github.com/Vasak-OS)
- **Propose features** on [Discussions](https://github.com/Vasak-OS/discussions)
- **Translate** the interface and docs
- **Package** apps for the repository
- **Test** on weird hardware and report
- **Donate** on [Ko-fi](https://ko-fi.com/vasakos) or [GitHub Sponsors](https://github.com/sponsors/Vasak-OS)

## A Huge Thank You

To **Tauri**, **WirePlumber**, **Wayfire/wlroots**, **GTK4**, **Rust**, **Arch Linux**, and the entire upstream community that makes it possible for a handful of crazy people to build an operating system from scratch.

To everyone who tested alphas, reported bugs, proposed features, endured broken installations, and stuck around: **thank you**. This is yours as much as ours.

---

**Download VasakOS Beta 1 today:** [MediaFire](https://www.mediafire.com/file/10rjk90eojzjkl3/vasakos-2026.10.04-x86_64.iso/file) | [Mega](https://mega.nz/file/P9BlhDLQ#Wp6SizDnHWMMW9uGPvUYDXb5bmjLfzsBpHPHD7CP6eQ) | [SourceForge](https://sourceforge.net/projects/vasakos/files/Beta/vasakos-2026.10.04-x86_64.iso/download)

**SHA256:** `8c2d59a398f4c0f7046728a34419fe3dcb72e164acfb6faeb2d839b5d1749c75`

**Full changelog:** [/changelogs/20261004/](/changelogs/20261004/)

**Project status:** [/state/](/state/)

---

*VasakOS Beta 1 — October 4, 2026 — Made with love in Argentina for the world*