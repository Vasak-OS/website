---
title: "Troubleshooting"
weight: 30
description: "A step-by-step guide to the most common VasakOS problems: boot, session, audio, network and screen."
---

> **First, the monitor.** Half of these problems are seen and fixed from the **System
> Monitor**: **Logs** for the errors, **Services** to restart a service and **Applications**
> to see or close a process. It is explained in
> [Errors and logs in the monitor](/en/docs/user/monitoring/). If the desktop never paints,
> the way in is the terminal: see [The desktop does not start](/en/docs/user/errors/).

## The session

The desktop runs as a systemd **user** service, managed by `uwsm`; that is why the session
commands carry `--user`.

```bash
# Desktop status
systemctl --user status vasak-desktop.service

# Restart it (equivalent to reloading the desktop)
systemctl --user restart vasak-desktop.service

# Its last messages
journalctl --user -u vasak-desktop.service -b --no-pager | tail -50
```

If the service enters a restart loop, systemd gives up after five tries within a minute and
leaves the reason in the journal: that is where the cause is.

## An application does not open

1. Look in **System Monitor → Logs**, with **Errors only** and that application picked under
   **Application**.
2. If the service shows as failed, restart it from **Services**.
3. For the desktop itself there is more detail in its file for the day:

   ```bash
   less ~/.local/share/vasak-desktop/logs/vasak-desktop-$(date +%F).log
   ```

4. If nothing clears it up, reinstall the package:

   ```bash
   sudo pacman -S vasak-desktop
   ```

## The panel does not appear

The panel is part of the desktop, not a separate process: there is no `vasak-panel` to
restart. Restart the desktop:

```bash
systemctl --user restart vasak-desktop.service
```

If the panel still does not paint, look in **Logs** filtered by `vasak-desktop`: the desktop
warns after twenty seconds if the panel never reported itself.

## Screen

Resolution, scaling, layout and brightness are set from **Settings → Displays** (and
**Brightness and night light**). The session is **Wayland**, so `xrandr` is not used: that is
X11.

If a hot-plugged monitor does not appear, unplug it and plug it back in, or restart the
desktop. To see what the compositor detected, the optional `wlr-randr` package lists the
outputs.

## Audio

Sound runs on **PipeWire**, with WirePlumber:

```bash
# Audio service status
systemctl --user status pipewire pipewire-pulse wireplumber

# Restart them if something got stuck
systemctl --user restart pipewire pipewire-pulse wireplumber

# See the selected output and the volumes
wpctl status
```

Pick the output and the per-application volume from **Settings → Audio output**. There is no
PulseAudio of its own to restart.

## Bluetooth

```bash
# Is it blocked?
rfkill list bluetooth
rfkill unblock bluetooth

# The service is the system's, not the session's
sudo systemctl enable --now bluetooth
systemctl status bluetooth

# Pair
bluetoothctl
```

Inside `bluetoothctl`: `power on`, `scan on`, `pair <MAC>`, `trust <MAC>`, `connect <MAC>`.

There is no group to add yourself to in order to use it: the system grants access when it is
needed.

## Network and WiFi

The network is handled by **NetworkManager**; for everyday use, **Settings → Wi-Fi**.

```bash
# Status
nmcli device status
nmcli radio

# Turn WiFi on
nmcli radio wifi on

# List networks and connect
nmcli device wifi list
nmcli device wifi connect "SSID" password "password"
```

`/etc/resolv.conf` is not edited by hand and `dhclient` is not used: NetworkManager and
systemd-resolved take care of that. If the interface says "connected" but there is no
network, look at `journalctl -u NetworkManager`, or **Logs** with **The whole system**.

## High consumption

Measure it in **System Monitor → Resources** and **Applications**: **Applications** groups
the processes of a single program and sorts by consumption, and **Close** asks the program to
quit while giving it time to save.

## The configuration is not applied

Settings are changed from **Settings**, which validates and applies them immediately. Their
values live in two files:

- `~/.config/vasak/vasak.conf` — the system configuration, as `key = value`.
- `~/.config/wayfire.ini` — the shortcuts and the compositor's behaviour.

To check the first one:

```bash
cat ~/.config/vasak/vasak.conf
```

If you suspect it got corrupted, move it and log back in: it is recreated with the default
values.

```bash
mv ~/.config/vasak/vasak.conf ~/.config/vasak/vasak.conf.backup
```

## Permissions

Camera and microphone permissions are not given through Unix groups: the VasakOS permissions
service grants them, with a prompt the first time an application asks for them. What has been
granted is reviewed from **Settings → Privacy and security**.

## When nothing works

```bash
# Restart the desktop
systemctl --user restart vasak-desktop.service

# If it does not come up, the end of the log
journalctl --user -u vasak-desktop.service -b --no-pager | tail -50
```

If the failure is the whole machine, reboot. With the messages from the monitor or from
`journalctl` at hand, follow the [bug report guide](/en/docs/user/report-bugs/).
