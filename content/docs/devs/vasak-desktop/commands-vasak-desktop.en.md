---
title: "Desktop commands | vasak-desktop"
weight: 31
description: "Catalogue of the commands vasak-desktop exposes to the desktop, to connect new features to the existing ones."
---

Commands `vasak-desktop` registers in `tauri::generate_handler!` that a new
desktop feature can invoke. They are grouped by what they do, not by file:
several modules expose commands on the same subject.

They all live in `src-tauri/src/commands/` or in the module of the subject
(`clipboard/`, `screen_time/`, `tray/`) and are registered in
`src-tauri/src/lib.rs`.

## Audio and microphone
- `get_audio_volume()` - The current output volume
- `set_audio_volume(volume: i64)` - Set the output volume
- `toggle_audio_mute()` - Toggle the output mute
- `get_audio_devices()` - List the audio devices
- `get_audio_outputs()` - The available outputs: the sinks and each card's outputs under another profile
- `set_audio_output(sink_id: Option<String>, card: Option<String>, profile: Option<String>)` - Pick an output by sink, or switch the card's profile and pin it
- `set_audio_device(device_id: String)` - Switch the default output
- `get_microphone()` - Volume and mute of the default microphone
- `set_microphone_volume(volume: i64)` - Set the microphone volume
- `toggle_microphone_mute()` - Toggle the microphone mute and return how it ended up
- `get_audio_input_devices()` - List the audio inputs
- `set_audio_input_device(device_id: String)` - Switch the default input
- `get_bluetooth_audio_profile(address: String)` - The audio profile of Bluetooth headphones, by MAC

## Equalizer
- `equalizer_state()` - The whole state: bands, preset and whether it is on
- `equalizer_set_gain(band: u32, gain: f64)` - Move a band
- `equalizer_set_preset(preset: String)` - Pick a factory preset, or `custom` to go back to your own values
- `equalizer_set_enabled(enabled: bool)` - Turn the filter on or off

## Music (MPRIS)
- `music_play_pause(player: String)` - Play or pause
- `music_next_track(player: String)` - Skip to the next track
- `music_previous_track(player: String)` - Go back to the previous track
- `music_now_playing()` - The track playing now
- `music_stop(player: String)` - Stop playback
- `music_raise(player: String)` - Bring the player's window to the front
- `music_set_position(player: String, position: i64)` - Jump to a point in the track, in microseconds
- `music_set_volume(player: String, volume: f64)` - Set the player's volume
- `music_set_shuffle(player: String, shuffle: bool)` - Turn shuffle on or off
- `music_set_loop(player: String, status: String)` - The repeat mode
- `music_players()` - The players present right now, so one can be chosen
- `music_select_player(player: String)` - Pick a player by hand; empty goes back to the automatic choice
- `music_artwork(url: String)` - The cover art bytes, which the WebView cannot read from disk

## Notifications
- `send_notify(summary: String, body: Option<String>, urgency: Option<String>)` - Send a notification
- `clear_notifications()` - Clear every notification
- `get_all_notifications()` - The list of notifications
- `delete_notification(id: u32)` - Delete one notification
- `invoke_notification_action(id: u32, action_key: String)` - Run an action of a notification
- `get_do_not_disturb()` - The «Do not disturb» state
- `set_do_not_disturb(enabled: bool)` - Turn «Do not disturb» on or off and return the previous state
- `get_game_mode()` - Whether game mode is on
- `set_game_mode(enabled: bool)` - Turn game mode on or off and return the previous state

## Clipboard
- `toggle_clipboard()` - Open or close the history overlay
- `hide_clipboard()` - Hide the overlay without asking whether it is open
- `clipboard_history()` - The history, newest first
- `clipboard_pick(id: u64)` - Put an entry back on the clipboard
- `clipboard_clear()` - Empty the history, without touching the live clipboard

## Phones (Vasak Connect)
- `toggle_connect_menu()` - Show or hide the phone's application list
- `connect_list_devices()` - The phones connected right now
- `connect_list_apps(serial: String, refresh: bool)` - The apps installed on a phone
- `connect_launch_app(serial: String, package: String)` - Open a phone app in its own window
- `connect_stop_app(serial: String, package: String)` - Close a phone app
- `connect_list_running()` - The phone windows open right now
- `connect_list_cameras(serial: String, refresh: bool)` - The cameras a phone has
- `connect_start_webcam(serial: String, camera_id: String, size: String, fps: u32)` - Start writing a phone camera into the loopback device and return its path
- `connect_stop_webcam()` - Stop the camera stream
- `connect_webcam_state()` - What the camera bridge is doing and whether it can work

## Network, radios and VPN
- `get_airplane_mode()` - The airplane mode state that is already known
- `set_airplane_mode(enabled: bool)` - Turn airplane mode on or off and return the previous state
- `unblock_radios(kind: String)` - Unblock the radios of one kind (`wlan` or `bluetooth`)
- `twingate_info()` - The state of the Twingate client and its resources
- `twingate_authorize(resource: String)` - Start the authorization of a blocked resource

## Panel, menus and applets
- `toggle_applet(applet: String, anchor: Option<AnchorRect>)` - Open or close a panel applet, hanging from the button that asked for it
- `dismiss_applet(applet: String)` - Close an applet with its animation
- `dismiss_popups()` - Close whatever is open on a click on the desktop
- `toggle_menu(anchor: Option<AnchorRect>)` - Open or close the menu, hanging from its panel button
- `set_menu_button(side: String, anchor: AnchorRect)` - Tell where the panel drew the menu button
- `get_menu_items()` - The applications in the menu
- `show_panel()` - Show the panel
- `toggle_control_center()` - Open or close the control center
- `hide_control_center()` - Hide the control center without asking whether it is open
- `show_osd(icon: String, value: f64, maximum: f64, label: String)` - Show the on-screen indicator for volume, brightness or whatever else
- `toggle_session_popup(action: String)` - Open or close the session window (shut down, restart, suspend)

## Desktop and windows
- `get_windows()` - The open windows
- `toggle_window(window_id: String)` - Show or hide a window
- `present_window(window_id: String)` - Bring a window to the front, without minimizing it
- `open_app(path: &str)` - Open an application by its `.desktop` file
- `open_settings()` - Open Settings
- `open_settings_section(section: String)` - Open Settings at a section
- `open_calendar()` - Open the calendar
- `get_workspaces()` - The workspaces of the focused screen
- `switch_workspace(index: u32)` - Go to workspace number `index`, from zero
- `get_keyboard_layout()` - The current keyboard layout
- `next_keyboard_layout()` - Switch to the next layout and return the one that remained
- `set_panel_input_region(rects: Vec<InputRect>)` - Crop what the pointer receives on the panel to the pills
- `batch_invoke(requests: Vec<BatchRequest>)` - Ask for several commands in one call and get one answer per command

## Session, power and lock
- `logout(display_server: String)` - Log out
- `shutdown()` - Shut the machine down
- `reboot()` - Restart the machine
- `suspend(display_server: String)` - Suspend the machine
- `detect_display_server()` - Say whether the session is Wayland, X11 or unknown
- `lock_screen()` - Lock the screen, with no confirmation
- `lock_screen_available()` - Whether the Lock button can do anything
- `get_keep_awake()` - Whether «keep awake» is on
- `set_keep_awake(enabled: bool)` - Turn it on or off and return whether it was on
- `get_night_light_state()` - The night light state
- `set_night_light_enabled(enabled: bool)` - Turn night light on or off with the saved settings
- `apply_night_light()` - Apply the night light settings that were just saved
- `battery_exists()` - Whether the machine has a battery
- `battery_fetch_info()` - Read the battery from the system again
- `get_battery_info()` - The battery that is already known
- `system_stats()` - CPU and memory usage, and the highest temperature

## Wallpaper
- `toggle_wallpaper_picker()` - Open or close the wallpaper picker
- `hide_wallpaper_picker()` - Hide it without asking whether it is open
- `wallpaper_catalog(current: Option<String>, custom_folder: Option<String>)` - The carousel row: the official wallpapers, the ones in your own folder and the current one, with their thumbnails
- `prepare_wallpaper(path: String)` - Prepare a video to be used as wallpaper; an image comes back unchanged
- `allow_wallpaper_asset(path: String)` - Authorize a wallpaper file in the asset protocol and return its canonical path
- `wallpaper_pixels(path: String)` - The wallpaper pixels, to derive the scheme colors

## System tray
- `init_sni_watcher()` - Start the tray watcher; it does nothing if it was already running
- `get_tray_items()` - The tray items
- `get_launcher_entries()` - Progress, counter and urgency of the applications that publish them
- `tray_item_activate(service_name: String, x: i32, y: i32)` - Activate a tray item
- `tray_item_secondary_activate(service_name: String, x: i32, y: i32)` - The secondary activation of a tray item
- `get_tray_menu(service_name: String)` - The menu of a tray item
- `tray_menu_item_click(service_name: String, menu_id: i32)` - Click an entry of the tray menu
- `open_tray_popup(service_name: String, anchor: Option<AnchorRect>)` - Open the menu window of an item, hanging from its button
- `get_tray_popup_data()` - What the menu window has to draw
- `tray_popup_click(menu_id: i32)` - Click an entry in the tray menu window

## Calendar, screen time and weather
- `calendar_occurrences(from: String, to: String)` - The occurrences of the events that fall in the range, in RFC 3339
- `calendar_tasks()` - The unfinished tasks, for the tasks widget
- `calendar_locations(events: Vec<EventRef>)` - The place of a few events
- `request_calendar_access_again()` - Ask `vasak-permissions` to prompt for the calendar again
- `screen_time_range(from: String, to: String)` - The days from `from` to `to` (`YYYY-MM-DD`, both included)
- `weather_cached()` - The saved forecast, without touching the network
- `weather_claim()` - «Is it my turn to ask?»: it says yes to one window per round
- `weather_place()` - The coordinates already figured out, if some window found them
- `weather_release()` - Release the turn of a request that failed, so another window can try
- `weather_store(datos: Value, lugar: Option<Value>)` - Save what the window that claimed the turn brought back and tell every window

## Logs, privacy and diagnostics
- `log_from_frontend(level: String, message: String)` - Record a message from JavaScript
- `get_log_file_path()` - The path of the current log file
- `read_log_file()` - The contents of the log file
- `get_last_log_lines(lines: usize)` - The last N lines of the log
- `privacy_in_use()` - What is using the camera or the microphone right now
- `privacy_stop_screen(session: String)` - Stop a screen capture in progress

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
busctl --user call org.vasak.os.Desktop /org/vasak/os/Desktop \
  org.vasak.os.Desktop ToggleSearch

# What new code should use: straight to the launcher
busctl --user call ar.net.vasak.Prism /ar/net/vasak/Prism \
  ar.net.vasak.Prism Toggle
```

The desktop service handles everything addressed to its name without looking
at the object or the interface, so the path in the first example is a
convention, not a requirement. Since `vasak-desktop` 1.64.1 every method of the
service replies, so the call returns right away. What it replies depends on the
method:

- `ListWindows` returns the window list as JSON.
- `PresentWindow`, `OpenMenu`, `OpenControlCenter`, `OpenWallpaperPicker`,
  `PauseWallpaper` and `ResumeWallpaper` perform the action before replying: an
  empty return if it worked, `org.vasak.os.Desktop.Error` with the reason if not.
- `OpenSearch`, `ToggleSearch`, `OpenSessionPopup`, `PowerButtonPressed`,
  `ClearScreenTime` and `PresentApp` keep working in another task, so they reply
  with an empty return **as soon as the request is dispatched**. If something
  fails afterwards —for instance, the forward to `vasak-prism`— it is logged by
  the desktop, not reported in the reply.
- `PresentWindow` and `PresentApp` without the argument they expect return
  `org.freedesktop.DBus.Error.InvalidArgs`.
- A name the service does not have returns
  `org.freedesktop.DBus.Error.UnknownMethod`.

Callers that ask for no reply (`--expect-reply=no` in `busctl`, or `dbus-send`
without `--print-reply`) keep working the same: they get none. Before 1.64.1
almost no method replied, and a call without that flag hung until the D-Bus
timeout. The launcher installs a D-Bus activation file:
if it is not running, the bus starts it on that same call. If `vasak-prism` is
not installed, the forward fails and the desktop logs it without crashing. The
launcher also exposes `Show` and `Hide` on the same object.
