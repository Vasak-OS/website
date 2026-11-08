// El catálogo de `commands-vasak-desktop` describe comandos de Tauri que viven
// en otro repositorio: nada los compila del lado del sitio y nada avisa cuando
// uno se va o aparece. La página se quedó con una veintena de comandos que ya
// no existen y sin los cien que sí, y no había forma de enterarse.
//
// Acá se ata contra una lista fijada a mano desde la fuente —igual que
// `plugin-docs.test.ts` y `vue-libvasak-docs.test.ts`—: los comandos que
// `vasak-desktop` registra en `tauri::generate_handler!` de
// `src-tauri/src/lib.rs`. La lista no se lee del repositorio del escritorio a
// propósito: esta prueba corre en CI sólo con este repo y su trabajo es avisar
// cuando la documentación se degrada, no generarla.
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

/** Los 131 comandos que el escritorio registra hoy, en orden alfabético. */
const COMMANDS = [
  'allow_wallpaper_asset', 'apply_night_light', 'batch_invoke', 'battery_exists',
  'battery_fetch_info', 'calendar_locations', 'calendar_occurrences',
  'calendar_tasks', 'clear_notifications', 'clipboard_clear',
  'clipboard_history', 'clipboard_pick', 'connect_launch_app',
  'connect_list_apps', 'connect_list_cameras', 'connect_list_devices',
  'connect_list_running', 'connect_start_webcam', 'connect_stop_app',
  'connect_stop_webcam', 'connect_webcam_state', 'delete_notification',
  'detect_display_server', 'dismiss_applet', 'dismiss_popups',
  'equalizer_set_enabled', 'equalizer_set_gain', 'equalizer_set_preset',
  'equalizer_state', 'get_airplane_mode', 'get_all_notifications',
  'get_audio_devices', 'get_audio_input_devices', 'get_audio_outputs',
  'get_audio_volume', 'get_battery_info', 'get_bluetooth_audio_profile',
  'get_do_not_disturb', 'get_game_mode', 'get_keep_awake',
  'get_keyboard_layout', 'get_last_log_lines', 'get_launcher_entries',
  'get_log_file_path', 'get_menu_items', 'get_microphone',
  'get_night_light_state', 'get_tray_items', 'get_tray_menu',
  'get_tray_popup_data', 'get_windows', 'get_workspaces', 'hide_clipboard',
  'hide_control_center', 'hide_wallpaper_picker', 'init_sni_watcher',
  'invoke_notification_action', 'lock_screen', 'lock_screen_available',
  'log_from_frontend', 'logout', 'music_artwork', 'music_next_track',
  'music_now_playing', 'music_play_pause', 'music_players',
  'music_previous_track', 'music_raise', 'music_select_player',
  'music_set_loop', 'music_set_position', 'music_set_shuffle',
  'music_set_volume', 'music_stop', 'next_keyboard_layout', 'open_app',
  'open_calendar', 'open_settings', 'open_settings_section', 'open_tray_popup',
  'prepare_wallpaper', 'present_window', 'privacy_in_use',
  'privacy_stop_screen', 'read_log_file', 'reboot',
  'request_calendar_access_again', 'screen_time_range', 'send_notify',
  'set_airplane_mode', 'set_audio_device', 'set_audio_input_device',
  'set_audio_output', 'set_audio_volume', 'set_do_not_disturb',
  'set_game_mode', 'set_keep_awake', 'set_menu_button',
  'set_microphone_volume', 'set_night_light_enabled',
  'set_panel_input_region', 'show_osd', 'show_panel', 'shutdown', 'suspend',
  'switch_workspace', 'system_stats', 'toggle_applet', 'toggle_audio_mute',
  'toggle_clipboard', 'toggle_connect_menu', 'toggle_control_center',
  'toggle_menu', 'toggle_microphone_mute', 'toggle_session_popup',
  'toggle_wallpaper_picker', 'toggle_window', 'tray_item_activate',
  'tray_item_secondary_activate', 'tray_menu_item_click', 'tray_popup_click',
  'twingate_authorize', 'twingate_info', 'unblock_radios',
  'wallpaper_catalog', 'wallpaper_pixels', 'weather_cached', 'weather_claim',
  'weather_place', 'weather_release', 'weather_store',
] as const;

/** El catálogo en los dos idiomas del sitio. */
const CATALOGOS = [
  'content/docs/devs/vasak-desktop/commands-vasak-desktop.md',
  'content/docs/devs/vasak-desktop/commands-vasak-desktop.en.md',
] as const;

describe('el catálogo de comandos del escritorio', () => {
  test('nombra cada comando que el escritorio registra, en los dos idiomas', () => {
    // En el catálogo cada comando va como `` `nombre(...)` ``: quien lo busca
    // lo copia de ahí, y uno que falte no se encuentra en ningún lado.
    const faltantes: string[] = [];
    for (const catalogo of CATALOGOS) {
      const texto = readFileSync(catalogo, 'utf8');
      for (const comando of COMMANDS) {
        if (!texto.includes(`\`${comando}(`)) faltantes.push(`${catalogo} (falta \`${comando}\`)`);
      }
    }
    expect(faltantes).toEqual([]);
  });

  test('el catálogo existe y conserva el reenvío de la búsqueda al lanzador', () => {
    // La sección de la búsqueda no es un comando: es lo que quedó cuando los
    // comandos se fueron a vasak-prism, y se explica ahí mismo.
    for (const catalogo of CATALOGOS) {
      const texto = readFileSync(catalogo, 'utf8');
      expect(texto).toContain('org.vasak.os.Desktop');
      expect(texto).toContain('ar.net.vasak.Prism');
    }
  });
});
