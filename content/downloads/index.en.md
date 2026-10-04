---
Title: "Downloads"
seotitle: "Download VasakOS: x86_64 ISO and SHA256 | VasakOS"
description: "Download the official VasakOS ISO for x86_64. Mirrors, SHA256 checksum, minimum requirements, and step-by-step guide to create bootable USB and install."
tags: [downloads, download, iso, vasakos iso, download vasakos, arch linux, linux]
type: downloads
img: "/img/posts/download.svg"
date: "2022-03-19"
lastmod: "2026-10-04"
---

> **This is a Beta release.** It installs and works, with complete features, but there are still bugs to polish and there may be changes between builds. Before replacing your main system, check the [project status](/en/state/).

## Install Step by Step

1. **Download the ISO** from any of the mirrors above.
2. **Verify the SHA256** with your system's command. If it doesn't match, the download
   was corrupted or the mirror is compromised: don't use it.
3. **Create the bootable USB.** We recommend [Ventoy](https://www.ventoy.net/) because it lets
   you copy the ISO as a regular file and keep several on the same stick. `dd`,
   [balenaEtcher](https://etcher.balena.io/) or Rufus also work.

   ```bash
   sudo dd if=vasakos-2026.10.04-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
   ```

   Replace `/dev/sdX` with your USB stick — `lsblk` tells you which one. **Writing to the
   wrong disk wipes that disk.**
4. **Boot from the USB.** On most machines you enter the boot menu with
   F12, F11, F9 or Esc. If you have Secure Boot enabled, disable it.
5. **Test in Live mode.** Before installing, verify that wifi, sound, brightness,
   and screen resolution work.
5. **Install** from the installer icon on the desktop.

## After Installing

The VasakOS package repository comes pre-configured in the ISO, so updates arrive with:

```bash
sudo pacman -Syu
```

If you want to use VasakOS applications on an existing Arch Linux installation,
follow the [package repository](/en/docs/user/repository/) guide.

## If Something Fails

A useful report includes your machine model, GPU, which step failed, and logs.
The full guide is at [report bugs](/en/docs/user/report-bugs/).