---
title: "Logs y Debugging [Para usuarios]"
weight: 5
---

## Sistema de Logging

Vasak Desktop utiliza el sistema de logging estándar de Rust mediante el crate `log`. Los mensajes de registro **no se guardan en archivos** por defecto, sino que se envían a la salida de error estándar (`stderr`).

## Cómo ver los logs

### Ejecutar con logs habilitados

Para ver los logs al ejecutar la aplicación, usa la variable de entorno `RUST_LOG`:

```bash
# Ver todos los logs (muy detallado)
RUST_LOG=debug vasak-desktop

# Ver solo advertencias y errores
RUST_LOG=warn vasak-desktop

# Ver logs específicos de un módulo
RUST_LOG=vasak_desktop::audio=debug vasak-desktop
```

**Niveles de log disponibles:**
- `error` - Solo errores críticos
- `warn` - Advertencias y errores
- `info` - Información general + warn + error
- `debug` - Información detallada (recomendado para depuración)
- `trace` - Extremadamente detallado (para desarrollo)

### Ver logs si ejecutas desde un lanzador

Si inicias Vasak Desktop desde un lanzador de aplicaciones o al iniciar sesión, puedes ver los logs con `journalctl`:

```bash
# Ver logs en tiempo real
journalctl --user -f | grep vasak

# Ver logs recientes
journalctl --user --since "10 minutes ago" | grep vasak

# Ver solo errores
journalctl --user -p err | grep vasak
```

### Redirigir logs a un archivo

Si necesitas guardar los logs en un archivo para análisis:

```bash
# Guardar logs en un archivo
RUST_LOG=debug vasak-desktop 2>&1 | tee ~/vasak-desktop.log

# Solo guardar stderr (logs)
RUST_LOG=debug vasak-desktop 2> ~/vasak-desktop.log
```

## Archivos de configuración

La configuración del sistema se guarda en:

```
~/.config/vasak/system_config.json
```

Este archivo contiene:
- `dark_mode` - Estado del modo oscuro
- `icon_pack` - Pack de iconos seleccionado
- `cursor_theme` - Tema del cursor
- `gtk_theme` - Tema GTK

## Depuración avanzada

Los archivos de log contienen información con diferentes niveles de detalle:

- **DEBUG** - Información detallada para desarrolladores (mucho contenido)
- **INFO** - Información general sobre el funcionamiento
- **WARN** - Advertencias (algo podría no funcionar correctamente)
- **ERROR** - Errores (algo dejó de funcionar)
- **CRITICAL** - Errores graves que pueden causar crashes

## Limpieza de Logs

Los logs se regeneran automáticamente. Si necesitas limpiar logs antiguos:

```bash
# Eliminar todos los logs
rm -rf ~/.local/share/vasak-desktop/logs/

# Eliminar solo logs de más de 30 días
find ~/.local/share/vasak-desktop/logs -name "*.log" -mtime +30 -delete
```

## Exportar Logs para Reporte

Si necesitas compartir logs para un reporte de errores:

```bash
# Crear un archivo comprimido con todos los logs

### Capturar logs para reportar un error

Si necesitas compartir logs con los desarrolladores:

```bash
# Ejecutar con logs completos y guardar
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-debug-$(date +%Y%m%d-%H%M%S).log
```

Esto creará un archivo con fecha y hora que puedes adjuntar en un reporte de error.

## Logs de D-Bus

Para depurar la comunicación D-Bus (utilizada para audio, bluetooth, notificaciones):

```bash
# Ver mensajes D-Bus del sistema
dbus-monitor --system

# Ver mensajes D-Bus de sesión de usuario
dbus-monitor --session
```

## Información adicional

### Verificar si la aplicación está ejecutándose

```bash
ps aux | grep vasak-desktop
```

### Ver uso de recursos

```bash
# CPU y memoria
top -p $(pgrep vasak-desktop)

# O con htop
htop -p $(pgrep vasak-desktop)
```

---

**Nota**: Si encuentras un error, consulta la [guía de reporte de errores](./reporte-errores.md) para saber qué información incluir.

