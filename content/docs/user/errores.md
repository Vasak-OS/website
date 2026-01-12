# Visualización de Errores - Vasak Desktop

## Cómo ver errores en tiempo real

Vasak Desktop utiliza el sistema de logging estándar de Rust. Los errores se envían a `stderr` y pueden visualizarse de varias formas.

### 1. Ejecutar con logs habilitados

#### Ver todos los logs (incluyendo errores)

```bash
RUST_LOG=debug vasak-desktop
```

#### Ver solo advertencias y errores

```bash
RUST_LOG=warn vasak-desktop
```

#### Guardar logs en un archivo

```bash
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-errors-$(date +%Y%m%d).log
```

### 2. Usar journalctl (si la app se ejecuta como servicio)

```bash
# Ver logs en tiempo real con nivel ERROR o superior
journalctl --user -p err -f | grep vasak

# Ver última hora de errores
journalctl --user -p err --since "1 hour ago" | grep vasak

# Ver todos los logs
journalctl --user | grep vasak
```

### 3. Ver errores específicos de componentes

#### Errores de red

```bash
RUST_LOG=vasak_desktop::network=debug vasak-desktop 2>&1 | grep -i error
```

#### Errores de Bluetooth

```bash
RUST_LOG=vasak_desktop::bluetooth=debug vasak-desktop 2>&1 | grep -i error
```

#### Errores de Audio

```bash
RUST_LOG=vasak_desktop::audio=debug vasak-desktop 2>&1 | grep -i error
```

#### Errores de D-Bus

```bash
# Ver actividad D-Bus del sistema
dbus-monitor --system | grep -i error

# Ver actividad D-Bus de sesión de usuario
dbus-monitor --session | grep -i error
```

## Entender los mensajes de error

### Estructura de un mensaje de log

```
[TIMESTAMP] [LEVEL] [MODULE] - MESSAGE
```

Ejemplo:
```
[2024-01-12T14:35:22Z] ERROR vasak_desktop::audio - Failed to connect to PulseAudio: Connection refused
```

- **TIMESTAMP** - Fecha y hora del error
- **LEVEL** - Nivel de severidad (ERROR, WARN, etc.)
- **MODULE** - Componente que generó el error
- **MESSAGE** - Descripción del problema

### Errores Comunes y Significado

#### "Connection refused"
Significa que se intentó conectar a un servicio (como PulseAudio, D-Bus) pero no está disponible.

**Solución común:** Reinicia el servicio
```bash
systemctl --user restart pulseaudio
# o para PipeWire:
systemctl --user restart pipewire
```

#### "Permission denied"
Significa que falta permisos para acceder a un recurso.

**Solución común:** Verifica tu membresía en grupos de usuarios
```bash
# Para audio
sudo usermod -a -G audio $USER

# Para bluetooth
sudo usermod -a -G bluetooth $USER
```

#### "Failed to load configuration"
El archivo de configuración está corrupto o no se puede leer.

**Solución común:** Restaura la configuración a valores por defecto
```bash
# Copia la configuración a backup
mv ~/.config/vasak ~/.config/vasak.backup

# Al reiniciar, se recreará con valores por defecto
vasak-desktop
```

#### "D-Bus service not available"
Un servicio del sistema no se encuentra disponible.

**Solución común:** Verifica que los servicios estén corriendo
```bash
systemctl --user status
```

## Generar un reporte de error detallado

Si necesitas compartir información de error para reporte:

```bash
# Ejecutar con logs y capturar todo
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-error-report-$(date +%Y%m%d-%H%M%S).log

# Añadir información del sistema al archivo
echo "=== INFORMACIÓN DEL SISTEMA ===" >> vasak-error-report-*.log
echo "Fecha: $(date)" >> vasak-error-report-*.log
echo "Distro: $(lsb_release -d)" >> vasak-error-report-*.log
echo "Kernel: $(uname -r)" >> vasak-error-report-*.log
echo "Sesión: $XDG_SESSION_TYPE" >> vasak-error-report-*.log
```

El archivo generado puede ser adjuntado en un issue de GitHub.

Ver también: [Cómo Reportar Errores](./reporte-errores.md)

## Errores en la consola del navegador (herramientas de desarrollo)

Si ejecutas Vasak Desktop en modo desarrollo:

1. Presiona `F12` para abrir las Herramientas de Desarrollo
2. Ve a la pestaña **Console**
3. Busca mensajes en rojo (errores) o amarillo (advertencias)

Ejemplo de error en la consola:
```
TypeError: Cannot read property 'forEach' of undefined
    at AudioControl.vue:45:12
```

## Monitoreo continuo de errores

Para monitorear errores mientras usas la aplicación:

```bash
# Ejecutar con logs en una terminal
RUST_LOG=warn vasak-desktop

# O ver logs del sistema en tiempo real
journalctl --user -f | grep vasak
```

## Capturar información del crash

Si la aplicación se cierra inesperadamente:

```bash
# Ver si hay core dumps recientes
coredumpctl list | grep vasak

# Ver detalles del último core dump
coredumpctl info

# Extraer backtrace del último crash
coredumpctl debug
```

## Logs menos verbose (reducir ruido)

Si los logs son demasiado detallados:

```bash
# Solo errores críticos
RUST_LOG=error vasak-desktop

# Solo advertencias y errores
RUST_LOG=warn vasak-desktop
```
# Ejecutar sin mostrar errores en la interfaz
VASAK_SUPPRESS_ERRORS=1 vasak-desktop
```

**Nota:** Esto solo oculta la notificación visual, pero los errores siguen registrándose en los logs.
