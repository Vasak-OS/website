---
title: "Comandos del escritorio | vasak-desktop"
weight: 31
description: "Los comandos Tauri que expone vasak-desktop a su interfaz, agrupados por área."
---

Los **74** comandos que `vasak-desktop` registra en `src-tauri/src/lib.rs` y que su interfaz
puede llamar con `invoke()`. Cada uno está definido en `src-tauri/src/commands/`, en el
archivo del área que le corresponde.

Esta lista salió del registro de comandos del código, no de la memoria de nadie. Si agregás
uno, agregalo también acá.

> **Qué ya no está.** Los temas, el pack de iconos y la configuración del escritorio
> (`get_gtk_themes`, `get_cursor_themes`, `get_icon_packs`, `get_system_config`,
> `toggle_system_theme`) se fueron al
> [plugin config-manager](/docs/devs/plugins/#config-manager). La información del sistema
> (`get_system_info`, `get_cpu_usage_only`, `get_memory_usage_only`) vive en
> `vasak-monitor`, y los atajos de teclado, en `vasak-settings`. Si viste esos nombres en
> código viejo, es de antes de que se separaran.

Los argumentos `State`, `AppHandle` y `Window` no se listan: los pone Tauri, no quien llama.

## Audio

- `get_audio_devices()`
- `get_audio_volume()`
- `set_audio_device(device_id: String)`
- `set_audio_volume(volume: i64)`
- `toggle_audio_applet()`
- `toggle_audio_mute()`

## Brillo

- `get_brightness_info()`
- `set_brightness_info(brightness: u32)`

## Batería

- `battery_exists()`
- `battery_fetch_info()`
- `get_battery_info()`

## Bluetooth

- `toggle_bluetooth_applet()`

## Red

- `toggle_network_applet()`

## Twingate (VPN)

- `toggle_twingate_applet()`
- `twingate_authorize(resource: String)`
- `twingate_info()`

## Notificaciones

- `clear_notifications()`
- `delete_notification(id: u32)`
- `get_all_notifications()`
- `invoke_notification_action(id: u32, action_key: String)`
- `send_notify(summary: String, body: Option<String>, urgency: Option<String>)`

## Música (MPRIS)

- `music_next_track(player: String)`
- `music_now_playing()`
- `music_play_pause(player: String)`
- `music_previous_track(player: String)`

## Clima

- `weather_cached()`
- `weather_claim()`
- `weather_place()`
- `weather_release()`
- `weather_store(datos: Value, lugar: Option<Value>)`

## Menú y búsqueda

- `execute_search_result(id: String, category: String, exec: Option<String>)`
- `get_menu_items()`
- `global_search(query: String, limit: Option<usize>)`
- `toggle_menu()`
- `toggle_search()`

## Ventanas del escritorio

- `hide_control_center()`
- `show_osd(icon: String, value: f64, maximum: f64, label: String)`
- `show_panel()`
- `toggle_control_center()`
- `toggle_session_popup(action: String)`

## Bandeja del sistema

- `get_tray_items()`
- `get_tray_menu(service_name: String)`
- `get_tray_popup_data()`
- `init_sni_watcher()`
- `open_tray_popup(service_name: String)`
- `tray_item_activate(service_name: String, x: i32, y: i32)`
- `tray_item_secondary_activate(service_name: String, x: i32, y: i32)`
- `tray_menu_item_click(service_name: String, menu_id: i32)`
- `tray_popup_click(menu_id: i32)`

## Ventanas abiertas

- `get_windows()`
- `toggle_window(window_id: String)`

## Abrir cosas

- `open_app(path: &str)`
- `open_settings()`
- `open_settings_section(section: String)`

## Sesión

- `detect_display_server()`
- `logout(_display_server: String)`
- `reboot()`
- `shutdown()`
- `suspend(_display_server: String)`

## Registros

- `get_last_log_lines(lines: usize)`
- `get_log_file_path()`
- `log_from_frontend(level: String, message: String)`
- `read_log_file()`

## Teléfono

- `connect_launch_app(serial: String, package: String)`
- `connect_list_apps(serial: String, refresh: bool)`
- `connect_list_cameras(serial: String, refresh: bool)`
- `connect_list_devices()`
- `connect_list_running()`
- `connect_start_webcam(serial: String, camera_id: String, size: String, fps: u32)`
- `connect_stop_app(serial: String, package: String)`
- `connect_stop_webcam()`
- `connect_webcam_state()`
- `toggle_connect_menu()`

## Interno

- `batch_invoke(requests: Vec<BatchRequest>)`
