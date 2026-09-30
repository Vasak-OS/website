---
title: "Desktop commands | vasak-desktop"
weight: 31
description: "Catalogue of the commands vasak-desktop exposes to the desktop, to connect new features to the existing ones."
---

Commands implemented in `vasak-desktop` that new desktop features can use

## Audio
- `get_audio_volume()` - Get the current volume
- `set_audio_volume(volume: u32)` - Set the volume
- `toggle_audio_mute()` - Toggle mute
- `get_audio_devices()` - List audio devices
- `set_audio_device(device_id: String)` - Switch device
- `toggle_audio_applet()` - Show/hide the audio applet

## Brightness
- `get_brightness_info()` - Current brightness information
- `set_brightness_info(brightness: u32)` - Set the brightness

## Notifications
- `send_notify(notification: NotificationData)` - Send a notification
- `clear_notifications()` - Clear all notifications
- `get_all_notifications()` - Get the list of notifications
- `delete_notification(id: String)` - Delete a specific notification
- `invoke_notification_action(id: String, action: String)` - Run an action

## Network
- `toggle_network_applet()` - Show/hide the network applet

## Bluetooth
- `toggle_bluetooth_applet()` - Show/hide the Bluetooth applet

## Music (MPRIS)
- `music_play_pause()` - Play/Pause
- `music_next_track()` - Next track
- `music_previous_track()` - Previous track
- `music_now_playing()` - Current track information

## Search

Global search is no longer part of `vasak-desktop`: it lives in the launcher,
[`vasak-prism`](https://github.com/Vasak-OS/vasak-prism), a separate
application that stays resident. The `global_search`, `execute_search_result`
and `toggle_search` commands left the desktop with
[vasak-desktop#104](https://github.com/Vasak-OS/vasak-desktop/pull/104) and
can no longer be invoked from the frontend.

What the desktop keeps is a **D-Bus forward**: the `OpenSearch` and
`ToggleSearch` methods of the `org.vasak.os.Desktop` service still exist so
that a shortcut, script or configuration that still calls them does not go
dead. They do not run the search: they call the launcher's `Toggle` method,
which shows or hides its window.

| | Bus name | Object | Interface | Method |
|---|---|---|---|---|
| Desktop (forwards) | `org.vasak.os.Desktop` | any | any | `OpenSearch`, `ToggleSearch` |
| Launcher (target) | `ar.net.vasak.Prism` | `/ar/net/vasak/Prism` | `ar.net.vasak.Prism` | `Toggle` |

```bash
# Still works, for compatibility: goes through the desktop
busctl --user --expect-reply=no call org.vasak.os.Desktop /org/vasak/os/Desktop \
  org.vasak.os.Desktop ToggleSearch

# What new code should use: straight to the launcher
busctl --user call ar.net.vasak.Prism /ar/net/vasak/Prism \
  ar.net.vasak.Prism Toggle
```

The desktop service handles everything addressed to its name without looking
at the object or the interface, so the path in the first example is a
convention, not a requirement. And since no method of that service replies, the caller
has to ask not to wait for one (`--expect-reply=no` in `busctl`; `--type=method_call`
without `--print-reply` in `dbus-send`); otherwise the call hangs until the D-Bus timeout. The launcher installs a D-Bus activation file:
if it is not running, the bus starts it on that same call. If `vasak-prism` is
not installed, the forward fails and the desktop logs it without crashing. The
launcher also exposes `Show` and `Hide` on the same object.

## Keyboard Shortcuts
- `get_shortcuts()` - Get all shortcuts
- `update_shortcut(id: String, new_keys: Vec<String>)` - Update a shortcut
- `add_custom_shortcut(shortcut: CustomShortcut)` - Add a custom shortcut
- `delete_shortcut(id: String)` - Delete a shortcut
- `execute_shortcut(command: String)` - Run a shortcut command
- `check_shortcut_conflicts(keys: Vec<String>)` - Check for conflicts

## System
- `get_system_info()` - System information
- `get_cpu_usage_only()` - CPU usage
- `get_memory_usage_only()` - Memory usage
- `get_system_config()` - System configuration
- `set_system_config(config: SystemConfig)` - Set the configuration
- `get_current_system_state()` - Current system state

## Theme
- `toggle_system_theme()` - Toggle dark/light theme
- `get_gtk_themes()` - List the available GTK themes
- `get_cursor_themes()` - List the cursor themes
- `get_icon_packs()` - List the icon packs

## Session
- `logout()` - Log out
- `shutdown()` - Shut down the system
- `reboot()` - Reboot the system
- `suspend()` - Suspend the system
- `detect_display_server()` - Detect X11/Wayland

**Location**: All of these commands are defined in `src-tauri/src/commands/` and registered in `src-tauri/src/lib.rs`.
