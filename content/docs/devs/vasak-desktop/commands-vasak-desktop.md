---
title: "Comandos del escritorio | vasak-desktop"
weight: 31
description: "Catálogo de comandos que vasak-desktop expone al escritorio, para conectar funcionalidades nuevas a las que ya existen."
---

Comandos que `vasak-desktop` registra en `tauri::generate_handler!` y que una
funcionalidad nueva del escritorio puede invocar. Están agrupados por lo que
hacen, no por archivo: varios módulos exponen comandos del mismo tema.

Todos viven en `src-tauri/src/commands/` o en el módulo del tema
(`clipboard/`, `screen_time/`, `tray/`) y se registran en `src-tauri/src/lib.rs`.

## Audio y micrófono
- `get_audio_volume()` - El volumen de salida actual
- `set_audio_volume(volume: i64)` - Fijar el volumen de salida
- `toggle_audio_mute()` - Alternar el silencio de la salida
- `get_audio_devices()` - Listar los dispositivos de audio
- `get_audio_outputs()` - Las salidas disponibles: los sinks y las de cada placa con otro perfil
- `set_audio_output(sink_id: Option<String>, card: Option<String>, profile: Option<String>)` - Elegir una salida por sink, o cambiar el perfil de la placa y fijarla
- `set_audio_device(device_id: String)` - Cambiar la salida por omisión
- `get_microphone()` - Volumen y silencio del micrófono por omisión
- `set_microphone_volume(volume: i64)` - Fijar el volumen del micrófono
- `toggle_microphone_mute()` - Alternar el silencio del micrófono y devolver cómo quedó
- `get_audio_input_devices()` - Listar las entradas de audio
- `set_audio_input_device(device_id: String)` - Cambiar la entrada por omisión
- `get_bluetooth_audio_profile(address: String)` - El perfil de audio de unos auriculares Bluetooth, por su MAC

## Ecualizador
- `equalizer_state()` - El estado entero: bandas, perfil y si está prendido
- `equalizer_set_gain(band: u32, gain: f64)` - Mover una banda
- `equalizer_set_preset(preset: String)` - Elegir un perfil de fábrica, o `custom` para volver a los valores propios
- `equalizer_set_enabled(enabled: bool)` - Prender o apagar el filtro

## Música (MPRIS)
- `music_play_pause(player: String)` - Reproducir o pausar
- `music_next_track(player: String)` - Pasar a la pista siguiente
- `music_previous_track(player: String)` - Volver a la pista anterior
- `music_now_playing()` - La pista que suena ahora
- `music_stop(player: String)` - Detener la reproducción
- `music_raise(player: String)` - Traer al frente la ventana del reproductor
- `music_set_position(player: String, position: i64)` - Saltar a un punto de la pista, en microsegundos
- `music_set_volume(player: String, volume: f64)` - Fijar el volumen del reproductor
- `music_set_shuffle(player: String, shuffle: bool)` - Prender o apagar el modo aleatorio
- `music_set_loop(player: String, status: String)` - El modo de repetición
- `music_players()` - Los reproductores que hay ahora, para poder elegir entre ellos
- `music_select_player(player: String)` - Elegir un reproductor a mano; con el vacío vuelve la elección automática
- `music_artwork(url: String)` - Los bytes de la carátula, que el WebView no puede leer del disco

## Notificaciones
- `send_notify(summary: String, body: Option<String>, urgency: Option<String>)` - Enviar una notificación
- `clear_notifications()` - Limpiar todas las notificaciones
- `get_all_notifications()` - La lista de notificaciones
- `delete_notification(id: u32)` - Eliminar una notificación
- `invoke_notification_action(id: u32, action_key: String)` - Ejecutar una acción de una notificación
- `get_do_not_disturb()` - El estado de «No molestar»
- `set_do_not_disturb(enabled: bool)` - Poner o quitar «No molestar» y devolver el estado anterior
- `get_game_mode()` - Si el modo juego está puesto
- `set_game_mode(enabled: bool)` - Poner o sacar el modo juego y devolver el estado anterior

## Portapapeles
- `toggle_clipboard()` - Abrir o cerrar la superposición del historial
- `hide_clipboard()` - Esconder la superposición, sin preguntar si está abierta
- `clipboard_history()` - El historial, de lo más reciente a lo más viejo
- `clipboard_pick(id: u64)` - Volver a poner una entrada en el portapapeles
- `clipboard_clear()` - Vaciar el historial, sin tocar el portapapeles vivo

## Teléfonos (Vasak Connect)
- `toggle_connect_menu()` - Mostrar u ocultar la lista de aplicaciones del teléfono
- `connect_list_devices()` - Los teléfonos conectados ahora
- `connect_list_apps(serial: String, refresh: bool)` - Las aplicaciones instaladas en un teléfono
- `connect_launch_app(serial: String, package: String)` - Abrir una aplicación del teléfono en su propia ventana
- `connect_stop_app(serial: String, package: String)` - Cerrar una aplicación del teléfono
- `connect_list_running()` - Las ventanas de teléfono abiertas ahora
- `connect_list_cameras(serial: String, refresh: bool)` - Las cámaras de un teléfono
- `connect_start_webcam(serial: String, camera_id: String, size: String, fps: u32)` - Empezar a escribir una cámara del teléfono en el dispositivo de bucle y devolver su ruta
- `connect_stop_webcam()` - Cortar el flujo de la cámara
- `connect_webcam_state()` - Qué está haciendo el puente de cámara y si puede funcionar

## Red, radios y VPN
- `get_airplane_mode()` - El estado del modo avión que ya se conoce
- `set_airplane_mode(enabled: bool)` - Poner o quitar el modo avión y devolver el estado anterior
- `unblock_radios(kind: String)` - Desbloquear las radios de un tipo (`wlan` o `bluetooth`)
- `twingate_info()` - El estado del cliente de Twingate y sus recursos
- `twingate_authorize(resource: String)` - Arrancar la autorización de un recurso bloqueado

## Panel, menús y applets
- `toggle_applet(applet: String, anchor: Option<AnchorRect>)` - Abrir o cerrar un applet del panel, colgado del botón que lo pidió
- `dismiss_applet(applet: String)` - Cerrar un applet con su animación
- `dismiss_popups()` - Cerrar lo que esté abierto por un clic en el escritorio
- `toggle_menu(anchor: Option<AnchorRect>)` - Abrir o cerrar el menú, colgado de su botón del panel
- `set_menu_button(side: String, anchor: AnchorRect)` - Avisar dónde dibujó el panel el botón del menú
- `get_menu_items()` - Las aplicaciones del menú
- `show_panel()` - Mostrar el panel
- `toggle_control_center()` - Abrir o cerrar el centro de control
- `hide_control_center()` - Esconder el centro de control, sin preguntar si está abierto
- `show_osd(icon: String, value: f64, maximum: f64, label: String)` - Mostrar el indicador en pantalla de volumen, brillo o lo que sea
- `toggle_session_popup(action: String)` - Abrir o cerrar la ventana de sesión (apagar, reiniciar, suspender)

## Escritorio y ventanas
- `get_windows()` - Las ventanas abiertas
- `toggle_window(window_id: String)` - Mostrar u ocultar una ventana
- `present_window(window_id: String)` - Traer una ventana al frente, sin minimizarla
- `open_app(path: &str)` - Abrir una aplicación por su archivo `.desktop`
- `open_settings()` - Abrir Configuración
- `open_settings_section(section: String)` - Abrir Configuración en una sección
- `open_calendar()` - Abrir el calendario
- `get_workspaces()` - Los espacios de la pantalla con foco
- `switch_workspace(index: u32)` - Pasar al espacio número `index`, desde cero
- `get_keyboard_layout()` - La distribución de teclado de ahora
- `next_keyboard_layout()` - Pasar a la distribución siguiente y devolver la que quedó
- `set_panel_input_region(rects: Vec<InputRect>)` - Recortar lo que recibe el puntero en el panel a las píldoras
- `batch_invoke(requests: Vec<BatchRequest>)` - Pedir varios comandos en una sola llamada y recibir una respuesta por cada uno

## Sesión, energía y bloqueo
- `logout(display_server: String)` - Cerrar la sesión
- `shutdown()` - Apagar el equipo
- `reboot()` - Reiniciar el equipo
- `suspend(display_server: String)` - Suspender el equipo
- `detect_display_server()` - Decir si la sesión es Wayland, X11 o desconocida
- `lock_screen()` - Bloquear la pantalla, sin confirmación
- `lock_screen_available()` - Si el botón Bloquear puede hacer algo
- `get_keep_awake()` - Si el modo «mantener despierto» está puesto
- `set_keep_awake(enabled: bool)` - Ponerlo o quitarlo y devolver si estaba puesto
- `get_night_light_state()` - El estado de la luz nocturna
- `set_night_light_enabled(enabled: bool)` - Prender o apagar la luz nocturna con la configuración guardada
- `apply_night_light()` - Aplicar la configuración de luz nocturna que se acaba de guardar
- `battery_exists()` - Si el equipo tiene batería
- `battery_fetch_info()` - Volver a leer la batería del sistema
- `get_battery_info()` - La batería que ya se conoce
- `system_stats()` - Uso de CPU, memoria y la temperatura más alta

## Fondo de pantalla
- `toggle_wallpaper_picker()` - Abrir o cerrar el selector de fondos
- `hide_wallpaper_picker()` - Esconderlo, sin preguntar si está abierto
- `wallpaper_catalog(current: Option<String>, custom_folder: Option<String>)` - La fila del carrusel: los fondos oficiales, los de la carpeta propia y el actual, con sus miniaturas
- `prepare_wallpaper(path: String)` - Preparar un video para usarlo de fondo; una imagen vuelve igual
- `allow_wallpaper_asset(path: String)` - Autorizar un archivo de fondo en el protocolo de assets y devolver su ruta canónica
- `wallpaper_pixels(path: String)` - Los píxeles del fondo, para sacar los colores del esquema

## Bandeja del sistema
- `init_sni_watcher()` - Arrancar el vigía de la bandeja; no hace nada si ya estaba
- `get_tray_items()` - Los ítems de la bandeja
- `get_launcher_entries()` - Progreso, contador y urgencia de las aplicaciones que los publican
- `tray_item_activate(service_name: String, x: i32, y: i32)` - Activar un ítem de la bandeja
- `tray_item_secondary_activate(service_name: String, x: i32, y: i32)` - La activación secundaria de un ítem de la bandeja
- `get_tray_menu(service_name: String)` - El menú de un ítem de la bandeja
- `tray_menu_item_click(service_name: String, menu_id: i32)` - Tocar una entrada del menú de la bandeja
- `open_tray_popup(service_name: String, anchor: Option<AnchorRect>)` - Abrir la ventana del menú de un ítem, colgada de su botón
- `get_tray_popup_data()` - Lo que la ventana del menú tiene que dibujar
- `tray_popup_click(menu_id: i32)` - Tocar una entrada en la ventana del menú de la bandeja

## Calendario, tiempo de pantalla y clima
- `calendar_occurrences(from: String, to: String)` - Las veces de los eventos que caen en el rango, en RFC 3339
- `calendar_tasks()` - Las tareas sin completar, para el widget de tareas
- `calendar_locations(events: Vec<EventRef>)` - El lugar de unos eventos
- `request_calendar_access_again()` - Pedirle a `vasak-permissions` que vuelva a preguntar por el calendario
- `screen_time_range(from: String, to: String)` - Los días de `from` a `to` (`AAAA-MM-DD`, los dos incluidos)
- `weather_cached()` - El pronóstico guardado, sin tocar la red
- `weather_claim()` - «¿Me toca pedirlo a mí?»: responde que sí a una sola ventana por vuelta
- `weather_place()` - Las coordenadas ya deducidas, si alguna ventana las averiguó
- `weather_release()` - Liberar el turno de un pedido que falló, para que otra ventana lo intente
- `weather_store(datos: Value, lugar: Option<Value>)` - Guardar lo que trajo la ventana que reclamó y avisarlo a todas

## Registros, privacidad y diagnóstico
- `log_from_frontend(level: String, message: String)` - Registrar un mensaje desde JavaScript
- `get_log_file_path()` - La ruta del archivo de registro actual
- `read_log_file()` - El contenido del archivo de registro
- `get_last_log_lines(lines: usize)` - Las últimas N líneas del registro
- `privacy_in_use()` - Qué está usando la cámara o el micrófono ahora mismo
- `privacy_stop_screen(session: String)` - Cortar una captura de pantalla en curso

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
busctl --user call org.vasak.os.Desktop /org/vasak/os/Desktop \
  org.vasak.os.Desktop ToggleSearch

# Lo que conviene usar en algo nuevo: directo al lanzador
busctl --user call ar.net.vasak.Prism /ar/net/vasak/Prism \
  ar.net.vasak.Prism Toggle
```

El servicio del escritorio atiende todo lo que llega a su nombre sin mirar el
objeto ni la interfaz, así que la ruta del primer ejemplo es una convención y
no un requisito. Desde `vasak-desktop` 1.64.1 todos los métodos del servicio
contestan, así que la llamada vuelve en el acto. Qué contestan depende del
método:

- `ListWindows` devuelve la lista de ventanas en JSON.
- `PresentWindow`, `OpenMenu`, `OpenControlCenter`, `OpenWallpaperPicker`,
  `PauseWallpaper` y `ResumeWallpaper` hacen la acción antes de contestar: un
  retorno vacío si se hizo, `org.vasak.os.Desktop.Error` con el motivo si no.
- `OpenSearch`, `ToggleSearch`, `OpenSessionPopup`, `PowerButtonPressed`,
  `ClearScreenTime` y `PresentApp` siguen trabajando en otra tarea, así que
  contestan con un retorno vacío **apenas despachan** el pedido. Si después algo
  falla —por ejemplo, el reenvío a `vasak-prism`— queda anotado en el registro
  del escritorio, no en la respuesta.
- `PresentWindow` y `PresentApp` sin el argumento que esperan devuelven
  `org.freedesktop.DBus.Error.InvalidArgs`.
- Un nombre que el servicio no tiene devuelve
  `org.freedesktop.DBus.Error.UnknownMethod`.

Quien pide no recibir respuesta (`--expect-reply=no` en `busctl`, o
`dbus-send` sin `--print-reply`) sigue funcionando igual: a ése no se le
contesta. Antes de la 1.64.1 casi ningún método contestaba y la llamada sin esa
marca quedaba colgada hasta que vencía el tiempo de D-Bus. El lanzador instala un archivo de activación por D-Bus: si no
está corriendo, el bus lo levanta con esa misma llamada. Si `vasak-prism` no
está instalado, el reenvío falla y el escritorio lo anota en su registro, sin
caerse. El lanzador expone además `Show` y `Hide` en el mismo objeto.
