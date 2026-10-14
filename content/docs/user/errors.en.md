---
title: "The desktop does not start"
weight: 41
description: "What to do when the VasakOS desktop does not start: get to a terminal, read the boot errors and get back to a working state."
aliases: ["/docs/user/errores/"]
---

With the desktop up, errors are seen in the **System Monitor**, on the **Logs** screen (see
[Errors and logs in the monitor](/en/docs/user/monitoring/)). This page is for when the
desktop **never paints** and the monitor is not available: you have to look from a
terminal.

## Getting to a terminal

- With the system booted but no desktop, switch to a text terminal with **Ctrl+Alt+F2** (or
  F3 through F6) and log in with your user and password. To go back to the desktop, try
  **Ctrl+Alt+F1**.
- If the machine does not boot, boot from the installation USB in Live mode.

## Reading the boot errors

```bash
# Errors of the current boot, for the system
journalctl -b -p err

# Errors of your desktop session
journalctl --user -b -p err

# The desktop service, with the last lines
systemctl --user status vasak-desktop.service
journalctl --user -u vasak-desktop.service -b --no-pager | tail -50
```

`-b` limits it to the current boot and `-p err` keeps the errors. `--no-pager` prints it all
at once and `tail -50` shows the end, which is the most recent part.

## The desktop's own file

`vasak-desktop` also leaves one file per day, with more detail than what goes to the
journal:

```bash
less ~/.local/share/vasak-desktop/logs/vasak-desktop-$(date +%F).log
```

## If the machine does not boot

Boot from the installation USB in Live mode, mount your installation and get in with
`arch-chroot`:

```bash
sudo mount /dev/sdXY /mnt
sudo arch-chroot /mnt
journalctl -b -1 -p err
```

`-b -1` is the previous boot, the one that failed. From there you can reinstall packages or
fix the configuration.

## A program that closes on its own

```bash
# Was there a core dump?
coredumpctl list | grep vasak

# Details of the last one
coredumpctl info
```

## Trying again

- Restart the desktop: `systemctl --user restart vasak-desktop.service`.
- Log out and back in.
- Reboot the machine.

## Before reporting

Gather what you got and follow the [bug report guide](/en/docs/user/report-bugs/). With the
desktop up, on the other hand, the messages are copied straight from the monitor.
