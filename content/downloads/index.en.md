---
Title: "Downloads"
seotitle: "Download VasakOS — x86_64 ISO, SHA256 checksum and requirements | VasakOS"
description: "Download the official VasakOS ISO for x86_64. Mirrors, SHA256 checksum, minimum requirements and a step-by-step guide to create the bootable USB and install."
tags: [downloads, download, iso, vasakos iso, download vasakos, arch linux, linux]
type: downloads
img: "/img/posts/download.svg"
date: "2022-03-19"
lastmod: "2026-06-14"
---

> **This is an Alpha release.** It installs and runs, but some features are incomplete and
> things change between builds. Before replacing your main system, read the
> [state of the project](/en/state/).

## Installing step by step

1. **Download the ISO** from any of the mirrors above.
2. **Verify the SHA256** with your system's command. If it does not match, the download
   was corrupted or the mirror is compromised: do not use it.
3. **Create the bootable USB.** We recommend [Ventoy](https://www.ventoy.net/) because it
   lets you copy the ISO as one more file and keep several on the same stick. `dd`,
   [balenaEtcher](https://etcher.balena.io/) and Rufus work too.

   ```bash
   sudo dd if=vasakos-2026.06.14-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
   ```

   Replace `/dev/sdX` with your USB stick — `lsblk` tells you which one it is. **Writing
   to the wrong disk erases that disk.**
4. **Boot from the USB.** On most machines you reach the boot menu with F12, F11, F9 or
   Esc. If you have Secure Boot enabled, turn it off.
5. **Try it in Live mode.** Before installing, check that the wifi, the sound, the
   brightness and the screen resolution all work.
6. **Install** from the installer icon on the desktop.

## After installing

The VasakOS package repository is already configured in the ISO, so updates arrive with:

```bash
sudo pacman -Syu
```

If you want to use the VasakOS applications on an existing Arch Linux installation,
follow the [package repository](/en/docs/user/repository/) guide.

## If something fails

A useful report includes the machine model, the graphics card, which step failed, and the
logs. The full guide is in [reporting bugs](/en/docs/user/report-bugs/).
