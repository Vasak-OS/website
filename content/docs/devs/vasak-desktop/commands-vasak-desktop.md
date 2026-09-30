---
title: "Comandos del escritorio | vasak-desktop"
weight: 31
description: "Catálogo de comandos que vasak-desktop expone al escritorio, para conectar funcionalidades nuevas a las que ya existen."
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

La búsqueda global ya no es parte de `vasak-desktop`: vive en el lanzador,
[`vasak-prism`](https://github.com/Vasak-OS/vasak-prism), que es una aplicación
aparte y queda residente. Los comandos `global_search`, `execute_search_result`
y `toggle_search` salieron del escritorio con
[vasak-desktop#104](https://github.com/Vasak-OS/vasak-desktop/pull/104) y no
se pueden invocar desde el frontend.

Lo que sí queda en el escritorio es un **reenvío por D-Bus**: los métodos
`OpenSearch` y `ToggleSearch` del servicio `org.vasak.os.Desktop` siguen
existiendo para que un atajo, un script o una configuración que todavía los
llame no quede muerto. No hacen la búsqueda: llaman al método `Toggle` del
lanzador, que muestra u oculta su ventana.

| | Nombre en el bus | Objeto | Interfaz | Método |
|---|---|---|---|---|
| Escritorio (reenvía) | `org.vasak.os.Desktop` | cualquiera | cualquiera | `OpenSearch`, `ToggleSearch` |
| Lanzador (destino) | `ar.net.vasak.Prism` | `/ar/net/vasak/Prism` | `ar.net.vasak.Prism` | `Toggle` |

```bash
# Lo que sigue funcionando por compatibilidad: pasa por el escritorio
busctl --user --expect-reply=no call org.vasak.os.Desktop /org/vasak/os/Desktop \
  org.vasak.os.Desktop ToggleSearch

# Lo que conviene usar en algo nuevo: directo al lanzador
busctl --user call ar.net.vasak.Prism /ar/net/vasak/Prism \
  ar.net.vasak.Prism Toggle
```

El servicio del escritorio atiende todo lo que llega a su nombre sin mirar el
objeto ni la interfaz, así que la ruta del primer ejemplo es una convención y
no un requisito. Y como ningún método de ese servicio contesta, quien
llama tiene que pedir que no se espere respuesta (`--expect-reply=no` en
`busctl`; en `dbus-send`, `--type=method_call` sin
`--print-reply`); si no, la llamada queda colgada hasta
que vence el tiempo de D-Bus. El lanzador instala un archivo de activación por D-Bus: si no
está corriendo, el bus lo levanta con esa misma llamada. Si `vasak-prism` no
está instalado, el reenvío falla y el escritorio lo anota en su registro, sin
caerse. El lanzador expone además `Show` y `Hide` en el mismo objeto.

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