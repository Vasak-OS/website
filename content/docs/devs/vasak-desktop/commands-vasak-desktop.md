---
title: "Comandos del escritorio | vasak-desktop"
weight: 31
---

Comandos implementados en `vasak-desktop` accesibles para nuevas funcionalidades dentro del escritorio

## Audio
- `get_audio_volume()` - Obtener volumen actual
- `set_audio_volume(volume: u32)` - Establecer volumen
- `toggle_audio_mute()` - Alternar mute
- `get_audio_devices()` - Listar dispositivos de audio
- `set_audio_device(device_id: String)` - Cambiar dispositivo
- `toggle_audio_applet()` - Mostrar/ocultar applet de audio

## Brillo
- `get_brightness_info()` - Información de brillo actual
- `set_brightness_info(brightness: u32)` - Establecer brillo

## Notificaciones
- `send_notify(notification: NotificationData)` - Enviar notificación
- `clear_notifications()` - Limpiar todas las notificaciones
- `get_all_notifications()` - Obtener lista de notificaciones
- `delete_notification(id: String)` - Eliminar notificación específica
- `invoke_notification_action(id: String, action: String)` - Ejecutar acción

## Red
- `toggle_network_applet()` - Mostrar/ocultar applet de red

## Bluetooth
- `toggle_bluetooth_applet()` - Mostrar/ocultar applet de bluetooth

## Música (MPRIS)
- `music_play_pause()` - Play/Pause
- `music_next_track()` - Siguiente pista
- `music_previous_track()` - Pista anterior
- `music_now_playing()` - Información de pista actual

## Búsqueda
- `global_search(query: String)` - Búsqueda global de aplicaciones
- `execute_search_result(result: SearchResult)` - Ejecutar resultado
- `toggle_search()` - Mostrar/ocultar búsqueda

## Atajos de Teclado
- `get_shortcuts()` - Obtener todos los atajos
- `update_shortcut(id: String, new_keys: Vec<String>)` - Actualizar atajo
- `add_custom_shortcut(shortcut: CustomShortcut)` - Añadir atajo personalizado
- `delete_shortcut(id: String)` - Eliminar atajo
- `execute_shortcut(command: String)` - Ejecutar comando de atajo
- `check_shortcut_conflicts(keys: Vec<String>)` - Verificar conflictos

## Sistema
- `get_system_info()` - Información del sistema
- `get_cpu_usage_only()` - Uso de CPU
- `get_memory_usage_only()` - Uso de memoria
- `get_system_config()` - Configuración del sistema
- `set_system_config(config: SystemConfig)` - Establecer configuración
- `get_current_system_state()` - Estado actual del sistema

## Tema
- `toggle_system_theme()` - Alternar tema oscuro/claro
- `get_gtk_themes()` - Listar temas GTK disponibles
- `get_cursor_themes()` - Listar temas de cursor
- `get_icon_packs()` - Listar packs de iconos

## Sesión
- `logout()` - Cerrar sesión
- `shutdown()` - Apagar sistema
- `reboot()` - Reiniciar sistema
- `suspend()` - Suspender sistema
- `detect_display_server()` - Detectar X11/Wayland

**Ubicación**: Todos estos comandos están definidos en `src-tauri/src/commands/` y registrados en `src-tauri/src/lib.rs`.