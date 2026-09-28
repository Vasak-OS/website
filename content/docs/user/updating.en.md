---
title: "Updating the system"
description: "How to update VasakOS, what to do with .pacnew files, how to roll back an update and what rolling release actually means in practice."
weight: 15
---

VasakOS is **rolling release**: there are no versions that fall behind, and no big migration
every couple of years. Updates arrive continuously from the Arch Linux repositories and from
the VasakOS repository.

## The notification

You do not need to remember. VasakOS checks for updates two minutes after you log in, and
then once a day, and lets you know when there is something. If the machine was off when the
check was due, it checks as soon as it starts.

The notification does not repeat itself every day: as long as the set of pending packages
does not change, it stays quiet for a week, or until the kernel changes.

In **Settings → Updates** you can see what there is to update, what is worth checking before
doing it — whether there is room on the boot partition, whether any `.pacnew` files are
still unapplied, whether a reboot will be needed and why — and from there you can turn the
notification off or change how often it checks.

It still **cannot apply updates from there**: that needs administrator privileges and is
going to be part of the store. For now, apply them from the terminal.

## Updating

```bash
sudo pacman -Syu
```

That is all. It updates the base system and the VasakOS applications in the same operation.

> **Never use `pacman -Sy package`** to install a single thing. It syncs the database
> without updating the system and leaves the machine in a mixed state —old libraries with
> new packages— which is the number one cause of broken systems on Arch. Always `-Syu`.

## How often

Once a week is fine. What is worth avoiding is letting months go by: the bigger the update,
the more likely something will need manual intervention.

Before a large update, check for announcements in [the blog](/en/blog/) and in
[Arch Linux news](https://archlinux.org/news/).

And one more reason not to let months pass: **the notification does not distinguish a
security update from an ordinary one**, because the pacman package database has no field that
says so. Whoever defers updates also defers the ones that close a hole, without noticing
that they were different. This is explained in [Security](/en/docs/user/security/).

## `.pacnew` files

When an update brings a new version of a configuration file you edited, pacman does not
overwrite it: it leaves it alongside with the `.pacnew` extension.

```bash
sudo pacdiff
```

`pacdiff` (from the `pacman-contrib` package) goes through them one by one and lets you
compare and merge. Ignoring them indefinitely means new services run with old configuration.

## Freeing space

pacman keeps every package it downloads. Over time that is several GB:

```bash
sudo paccache -r        # keeps the last 3 versions of each package
sudo paccache -ruk0     # removes those of uninstalled packages
```

## Rolling back an update

If an update broke something, you can reinstall the previous version from pacman's cache:

```bash
ls /var/cache/pacman/pkg/ | grep package-name
sudo pacman -U /var/cache/pacman/pkg/package-name-VERSION.pkg.tar.zst
```

To stop the next update from upgrading it again while you investigate, add it temporarily to
`IgnorePkg` in `/etc/pacman.conf`:

```conf
IgnorePkg = package-name
```

Remember to remove it once the problem is resolved: a package frozen indefinitely ends up
incompatible with the rest of the system.

## If the system does not boot after updating

1. In the boot menu, choose an earlier kernel entry if one is available.
2. If there is none, boot from the installation USB in Live mode and mount your
   installation:

   ```bash
   sudo mount /dev/sdXY /mnt
   sudo arch-chroot /mnt
   ```

   From there you can reinstall packages or read the logs with `journalctl -b -1 -p err`.

3. Save those logs: they are exactly what is needed to
   [report the problem](/en/docs/user/report-bugs/).
