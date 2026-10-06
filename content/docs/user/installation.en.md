---
title: "Installing VasakOS"
description: "A complete guide to installing VasakOS: creating the bootable USB, booting in Live mode, partitioning and installing alongside another system."
weight: 5
---

This guide covers installing from scratch. If all you want is the VasakOS applications on an
Arch Linux you already have, skip to [package repository](/en/docs/user/repository/).

## Before you start

- **Make a backup.** Any installation can touch the partition table. VasakOS is in Alpha;
  treat it accordingly.
- You will need an 8 GB USB stick or larger and an internet connection during the
  installation.
- Check the system [requirements](/en/downloads/).

## 1. Download and verify the ISO

Get the image from [Downloads](/en/downloads/) and verify the checksum before writing it:

```bash
sha256sum vasakos-2026.06.14-x86_64.iso
```

The result has to match, character for character, the SHA256 published on the downloads
page. If it does not match, the download was cut short or the mirror is compromised: get it
again, preferably from a different mirror.

## 2. Create the bootable USB

### With Ventoy (recommended)

[Ventoy](https://www.ventoy.net/) is installed on the stick once, and after that the ISOs
are copied as ordinary files. You can keep several distributions on the same stick and do
not have to reformat it every time.

### With `dd`

```bash
lsblk                       # identify the stick: /dev/sdb, /dev/sdc…
sudo umount /dev/sdX*       # unmount any mounted partition
sudo dd if=vasakos-2026.06.14-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
```

> `dd` neither asks nor warns. If you put the wrong disk in `of=`, that disk is lost. Check
> twice with `lsblk` before you run it.

### From Windows

[Rufus](https://rufus.ie/) in DD mode, or [balenaEtcher](https://etcher.balena.io/).

## 3. Boot from the USB

1. Enter the machine's boot menu. Depending on the manufacturer it is usually **F12**,
   **F11**, **F9**, **F8** or **Esc** shortly after the machine powers on.
2. Choose the USB stick. If it appears twice, prefer the **UEFI** entry.
3. If the machine ignores the stick, go into the BIOS/UEFI and **disable Secure Boot**.
   VasakOS does not yet sign its kernel for Secure Boot.

## 4. Try it before installing

The ISO boots in Live mode: the whole system runs from the stick without touching the disk.
Take the chance to check the things that usually fail:

- **Wifi**: that the networks appear and you can connect.
- **Sound**: that you can hear it and the volume control works.
- **Screen**: correct resolution, and adjustable brightness on laptops.
- **Touchpad**: gestures and tap-to-click.
- **Suspend**: closing and reopening the lid.

If any of these does not work in Live mode, it will not work installed either. This is the
moment to [report it](/en/docs/user/report-bugs/).

## 5. Install

The installer is **Vasak Installer** and it opens from the icon on the desktop.

1. **Language and time zone.**
2. **Keyboard**: try it in the test field, especially if you use a Latin American layout.
3. **Partitioning**:
   - *Erase disk*: the simplest option, it removes everything.
   - *Install alongside*: shrinks an existing partition and uses the freed space.
   - *Manual*: if you know what you are doing. At minimum you need a 20 GB root `/`
     partition and, on UEFI machines, a 512 MB EFI partition mounted at `/boot/efi`.
4. **User and password.** The user's password is also used to unlock the
   [keyring](/en/state/).
5. **Summary and confirmation.** This is the last point at which you can go back.

When it finishes, reboot and remove the USB stick.

## 6. After installing

```bash
sudo pacman -Syu
```

The VasakOS repository is already configured in the ISO, so that single command updates both
the Arch base system and the VasakOS applications.

## If something goes wrong

- The machine boots into the previous system and does not see VasakOS → the boot entry was
  not written. See [troubleshooting](/en/docs/user/troubleshooting/).
- It stays on a black screen after the logo → it may be the video driver. Try adding
  `nomodeset` to the kernel parameters to boot, and install the right driver from there.
- Anything else: [how to report bugs](/en/docs/user/report-bugs/).
