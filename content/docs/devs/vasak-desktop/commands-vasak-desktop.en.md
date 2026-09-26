---
title: "Desktop commands | vasak-desktop"
weight: 31
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
- `global_search(query: String)` - Global application search
- `execute_search_result(result: SearchResult)` - Run a result
- `toggle_search()` - Show/hide search

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
