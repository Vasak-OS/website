---
title: "Package repository"
description: "How to add the VasakOS pacman repository to Arch Linux, import the GPG key and use the VasakOS applications without installing the whole distribution."
weight: 10
---

VasakOS publishes its packages in its own pacman repository called **`vasakos`**, signed with
GPG. If you installed from the ISO it is already configured and you do not need to do
anything: `sudo pacman -Syu` updates everything.

This guide is for using the VasakOS applications on an existing **Arch Linux** installation,
or for reconfiguring the repository if something broke.

## What is in the repository

The VasakOS desktop, applications and services: `vasak-desktop`, `vasak-file-manager`,
`vasak-terminal`, `vasak-settings`, `vasak-gallery`, `vasak-resonance`, `vasak-keyring`,
`vasak-flare-daemon`, `polkit-vasak-agent`, the icon theme and the wallpapers. The full list
with versions is in [state of the project](/en/state/).

There are no duplicated Arch packages: everything else comes from the official repositories.

## Adding it to Arch Linux

### 1. Initial configuration

Add to the end of `/etc/pacman.conf`:

```conf
[vasakos]
SigLevel = Optional TrustAll
Server = https://repo.vasak.net.ar/repo/$arch/$repo
```

`Optional TrustAll` is temporary: it is needed to install the keyring, which is precisely
what allows signatures to be verified.

### 2. Install the keyring and the mirror list

```bash
sudo pacman -Sy vasakos-keyring vasakos-mirrorlist
sudo pacman-key --populate vasakos
```

### 3. Switch to the final configuration

Now replace the block you added with this one, which really verifies signatures and takes
the servers from the mirror package:

```conf
[vasakos]
Include = /etc/pacman.d/vasakos-mirrorlist
```

```bash
sudo pacman -Syu
```

### 4. Install whatever you want

```bash
sudo pacman -S vasak-desktop vasak-file-manager vasak-terminal
```

## The signing key

The packages and the database are signed with:

```
Joaquin (Pato) Decima (VasakOS Repository Key) <jdecima@vasak.net.ar>
307E04B769840811099F4077ED5D59DA704DEBE2
```

The key ships in the `vasakos-keyring` package rather than as a loose download: that way it
is updated and revoked like any other package.

## Common problems

**`error: vasakos: signature from ... is unknown trust`**

The keyring is not populated. Run:

```bash
sudo pacman-key --populate vasakos
```

**`error: failed retrieving file 'vasakos.db'`**

The mirror is not responding, or `pacman.conf` points at an old path. Check that
`/etc/pacman.d/vasakos-mirrorlist` contains:

```conf
Server = https://repo.vasak.net.ar/repo/$arch/$repo
```

**Conflicts with packages from another desktop environment**

The VasakOS applications do not replace the GNOME or KDE ones, but they do compete to be the
default handler for each file type and to implement D-Bus services such as the keyring or the
PolicyKit agent. If you already have `gnome-keyring` running, do not install
`vasak-keyring` without disabling the other one first.

## For developers

The scripts that build the repository are public:

- [PKGBUILDS](https://github.com/Vasak-OS/PKGBUILDS) — the PKGBUILD of each package.
- [repository-script](https://github.com/Vasak-OS/repository-script) — the script that signs
  the packages and builds the database.
