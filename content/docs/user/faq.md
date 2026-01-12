---
title: "Preguntas Frecuentes"
weight: 20
---

# Preguntas Frecuentes - Vasak Desktop

## Instalación y Configuración

### ¿Cómo instalo Vasak Desktop?

Consulta el README principal del proyecto para instrucciones de instalación. La instalación varía según tu distribución de Linux.

### ¿Qué requisitos necesito?

- **Sistema Operativo**: Linux (cualquier distribución moderna)
- **Gestor de Pantallas**: X11 o Wayland
- **Memoria RAM**: Mínimo 4GB (recomendado 8GB)
- **Almacenamiento**: 200MB de espacio libre
- **Compositor**: Composición de ventanas habilitada (normalmente por defecto)

### ¿Vasak Desktop es compatible con [Mi Distribución]?

Vasak Desktop está diseñado para ser compatible con la mayoría de distribuciones Linux modernas:

- ✅ **Fedora, Ubuntu, Debian** - Totalmente soportadas
- ✅ **Arch, Manjaro** - Totalmente soportadas
- ✅ **openSUSE, Gentoo** - Generalmente compatibles
- ⚠️ **Otras distribuciones** - Depende del sistema base

La compatibilidad depende de que tengas los paquetes necesarios instalados.

### ¿Funciona con Wayland/X11?

Sí, Vasak Desktop está diseñado para funcionar con ambos:

- **Wayland** - Recomendado en sistemas modernos
- **X11** - Totalmente soportado para retrocompatibilidad

Para ver cuál usas:
```bash
echo $XDG_SESSION_TYPE
```

## Uso General

### ¿Dónde encuentro la configuración?

La configuración del sistema se guarda en:
```
~/.config/vasak/system_config.json
```

Este archivo JSON contiene:
- `dark_mode` - Activar/desactivar modo oscuro
- `gtk_theme` - Tema GTK (ej: "Adwaita", "Adwaita-dark")
- `icon_pack` - Pack de iconos (ej: "Adwaita", "Papirus")
- `cursor_theme` - Tema del cursor

**Nota**: No edites este archivo manualmente. Usa los controles integrados de Vasak Desktop para cambiar estos ajustes.

### ¿Cómo cambio el tema/apariencia?

Vasak Desktop permite configurar:

1. **Modo oscuro/claro** - Alterna desde el control center o el panel
2. **Tema GTK** - Se aplica automáticamente según el modo oscuro
3. **Pack de iconos** - Configurable desde la aplicación de configuración
4. **Tema del cursor** - Configurable desde la aplicación de configuración

Los cambios se aplican inmediatamente mediante `gsettings` y se guardan en `~/.config/vasak/system_config.json`.

### ¿Puedo personalizar los atajos de teclado?

Sí, Vasak Desktop incluye un sistema completo de atajos. Usa la aplicación de configuración para:
- Ver todos los atajos disponibles
- Modificar atajos existentes
- Crear atajos personalizados
- Detectar conflictos de atajos

Los atajos se guardan automáticamente en `~/.config/vasak/shortcuts.json`.

### ¿Dónde se guardan las preferencias de usuario?

Las preferencias se guardan en:
```
~/.config/vasak/
```

Archivos principales:
- `system_config.json` - Configuración del sistema (tema, iconos, cursor)
- `shortcuts.json` - Atajos de teclado personalizados

### ¿Se puede usar con múltiples monitores?

Sí, totalmente soportado. Vasak Desktop:
- Detecta monitores automáticamente
- Extiende el panel a todos los monitores
- Maneja aplicaciones en diferentes monitores

## Problemas Comunes

### La aplicación no inicia

1. Ejecuta con logs para ver el error:
   ```bash
   RUST_LOG=debug vasak-desktop
   ```

2. Verifica que no haya otra instancia corriendo:
   ```bash
   ps aux | grep vasak-desktop
   ```

3. Verifica los servicios del sistema necesarios:
   ```bash
   # Verifica D-Bus
   systemctl --user status dbus
   ```

### El audio no funciona

1. Verifica que PulseAudio/PipeWire está corriendo:
   ```bash
   systemctl --user status pulseaudio
   # o para PipeWire:
   systemctl --user status pipewire
   ```

2. Revisa los dispositivos de audio:
   ```bash
   pactl list sinks short
   ```

3. Si necesitas cambiar el dispositivo de audio por defecto:
   ```bash
   pactl set-default-sink [ID]
   ```

### Bluetooth no funciona

1. Verifica que Bluetooth está habilitado:
   ```bash
   rfkill list bluetooth
   ```

2. Inicia el servicio de Bluetooth:
   ```bash
   sudo systemctl start bluetooth
   ```

3. Verifica dispositivos:
   ```bash
   bluetoothctl list
   ```

### La red/WiFi no aparece

1. Verifica que NetworkManager está corriendo:
   ```bash
   sudo systemctl status NetworkManager
   ```

2. Recarga los dispositivos de red:
   ```bash
   nmcli radio wifi off
   nmcli radio wifi on
   ```

3. Revisa el estado de las conexiones:
   ```bash
   nmcli device status
   ```

## Características de Vasak Desktop

### ¿Qué es exactamente Vasak Desktop?

Vasak Desktop es una interfaz de escritorio ligera que proporciona:
- **Panel superior** - Barra de tareas con applets de sistema
- **Vista de escritorio** - Fondo con widgets opcionales
- **Control Center** - Acceso rápido a configuración del sistema
- **Menú de aplicaciones** - Búsqueda y lanzamiento de aplicaciones

**Nota**: No es un entorno de escritorio completo (como GNOME o KDE), sino una capa de interfaz que se ejecuta sobre tu sistema existente.

## Desarrollo y Debugging

### ¿Cómo ejecuto Vasak Desktop en modo desarrollo?

```bash
cd /ruta/a/vasak-desktop
bun install
bun run tauri dev
```

### ¿Cómo veo los errores de JavaScript?

Abre las herramientas de desarrollo:
```
F12 o Ctrl+Shift+I
```

Ve a la pestaña "Console" para ver los errores.

### ¿Dónde reporto bugs?

En GitHub: https://github.com/Vasak-OS/vasak-desktop/issues

Sigue la guía en [Cómo Reportar Errores](reporte-errores.md)

## Contribución

### ¿Cómo contribuyo al proyecto?

Consulta la documentación para desarrolladores en `docs/devs/`

Procesos básicos:
1. Fork el repositorio
2. Crea una rama con tu feature
3. Realiza los cambios
4. Envía un Pull Request

### ¿Puedo traducir Vasak Desktop?

Sí, contacta con los mantenedores. Generalmente:
1. Los archivos de traducción están en `src/locales/`
2. Sigue el formato existente
3. Envía un Pull Request

## Preguntas Técnicas Avanzadas

### ¿Qué es D-Bus y por qué lo necesita?

D-Bus es un sistema de comunicación entre procesos en Linux. Vasak Desktop lo usa para:
- Comunicarse con servicios del sistema
- Manejar eventos de hardware
- Controlar audio, Bluetooth, red

No necesitas entender D-Bus para usar Vasak Desktop, pero es importante que esté corriendo.

### ¿Puedo ejecutar múltiples instancias?

No es recomendado. Vasak Desktop espera ser único en la sesión. Ejecutar múltiples instancias puede causar:
- Conflictos con D-Bus
- Problemas con eventos de hardware
- Comportamiento impredecible


## Soporte Adicional

- **Documentación oficial**: [URL del repositorio]
- **Foro de la comunidad**: [URL del foro]
- **Chat**: [URL de Matrix/Discord si existe]
- **Reportar bugs**: https://github.com/Vasak-OS/vasak-desktop/issues

¿No encontraste tu respuesta? Contacta con la comunidad o crea un issue detallado.
