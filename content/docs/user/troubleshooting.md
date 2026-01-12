# Solución de Problemas - Vasak Desktop

## Problemas de Inicio

### La aplicación no inicia

#### Síntoma
Ejecutas `vasak-desktop` pero nada sucede o se cierra inmediatamente.

#### Solución Paso a Paso

**Paso 1: Verifica servicios del sistema**

```bash
# Comprueba que D-Bus está corriendo
systemctl --user status dbus

# Si no está corriendo, inicia lo
systemctl --user start dbus
```

**Paso 2: Verifica servicios opcionales**

```bash
# Dependiendo de tus funcionalidades, estos pueden ser necesarios
systemctl --user status pulseaudio
systemctl --user status bluetooth
sudo systemctl status NetworkManager
```

**Paso 3: Ejecuta con logs de debug**

```bash
# Ejecutar con logs detallados
RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-debug.log

# Revisa el archivo generado
less vasak-debug.log
```

**Paso 4: Limpia caché y configuración**

```bash
# Backup de configuración (por si acaso)
mv ~/.config/vasak ~/.config/vasak.backup

# Intenta iniciar de nuevo
vasak-desktop
```

**Paso 5: Reinstala la aplicación**

```bash
# Según tu gestor de paquetes
sudo apt remove vasak-desktop
sudo apt install vasak-desktop

# O si usas otra distro
sudo dnf remove vasak-desktop
sudo dnf install vasak-desktop
```

---

## Problemas de Pantalla y Monitor

### Panel no aparece

#### Síntoma
No ves el panel del sistema en ninguna pantalla.

#### Solución

```bash
# Reinicia solo el panel
pkill -f vasak-panel
# Debería reiniciarse automáticamente en 2-3 segundos

# Si no se reinicia:
RUST_LOG=debug vasak-desktop --debug-panel 2>&1 | tee panel-debug.log

# Reinicia la aplicación completa
pkill -f vasak-desktop
sleep 2
vasak-desktop &
```

### Panel no cubre todos los monitores

#### Síntoma
El panel no aparece en todos los monitores conectados.

#### Solución

```bash
# Verifica la detección de monitores
xrandr --query  # Para X11

# O para Wayland con wlr-randr
wlr-randr  

# Reinicia la aplicación para redetectar monitores
pkill vasak-desktop
sleep 2
vasak-desktop
```

### Resolución incorrecta o pixelado

#### Síntoma
La interfaz se ve pixelada o a resolución incorrecta.

#### Solución

```bash
# Verifica tu resolución actual
xrandr --query | grep connected

# Si es incorrecta, ajústala
xrandr --output HDMI-1 --mode 1920x1080

# En Wayland, normalmente se detecta automáticamente
# Si no, verifica en configuración de monitor del sistema
```

---

## Problemas de Audio

### Sin sonido

#### Síntoma
No hay sonido en ninguna aplicación.

#### Solución Paso a Paso

**Paso 1: Verifica que el servicio de audio está corriendo**

```bash
# Para PulseAudio
systemctl --user status pulseaudio
systemctl --user start pulseaudio  # Si no está corriendo

# O para PipeWire (más reciente)
systemctl --user status pipewire
systemctl --user start pipewire
```

**Paso 2: Verifica dispositivos de audio**

```bash
# Lista dispositivos
pactl list sinks short

# Ejemplo de salida:
# 0	alsa_output.pci-0000_00_1f.3.analog-stereo	module-alsa-card.c	s16le 2ch 44100Hz	SUSPENDED

# Si ves SUSPENDED, el dispositivo no está activo
# Reactívalo:
pactl set-sink-state <ID> running
```

**Paso 3: Verifica volumen**

```bash
# Ver volumen actual
pactl list sinks | grep Volume

# Establecer volumen (0-100%)
pactl set-sink-volume <ID> 50%

# O subir volumen
pactl set-sink-volume @DEFAULT_SINK@ +10%
```

**Paso 4: Verifica que no está silenciado**

```bash
# Ver si está muted
pactl list sinks | grep Mute

# Des-silenciar
pactl set-sink-mute <ID> false
```

**Paso 5: Restaura configuración**

```bash
# Si nada funciona, restaura a valores por defecto
pulseaudio --kill
rm -rf ~/.config/pulse/
rm -rf ~/.local/share/pulse/
systemctl --user start pulseaudio
```

### Audio entrecortado o latencia

#### Síntoma
El audio suena entrecortado, con pausas o con demora.

#### Solución

```bash
# Aumenta el buffer de PulseAudio
# Edita: ~/.config/pulse/daemon.conf

# Busca o añade:
default-fragment-size = 4096
default-tlength = 16384

# Reinicia
systemctl --user restart pulseaudio
```

### Volumen muy bajo

#### Síntoma
El volumen está al máximo pero muy bajo.

#### Solución

```bash
# Verifica amplificación
pactl list sinks | grep -A 30 "Volume levels"

# Intenta usar el amplificador de software
pactl set-sink-volume @DEFAULT_SINK@ 150%
```

---

## Problemas de Bluetooth

### Bluetooth no detecta dispositivos

#### Síntoma
No puedes parear o conectar dispositivos Bluetooth.

#### Solución Paso a Paso

**Paso 1: Verifica que Bluetooth está habilitado**

```bash
# Ver estado
rfkill list bluetooth

# Si está blocked (bloqueado en software)
rfkill unblock bluetooth

# Si está hard-blocked (físicamente bloqueado)
# Verifica tu laptop/teclado para atajos Bluetooth
```

**Paso 2: Inicia el servicio de Bluetooth**

```bash
sudo systemctl start bluetooth
sudo systemctl enable bluetooth

# Verifica estado
sudo systemctl status bluetooth
```

**Paso 3: Verifica interfaz Bluetooth**

```bash
# Ver adaptadores
hciconfig -a

# Si no aparece ninguno, el hardware podría no estar soportado
# Verifica:
lsusb | grep -i bluetooth
```

**Paso 4: Pon el adaptador en modo discoverable**

```bash
# Inicia bluetoothctl
bluetoothctl

# Dentro de bluetoothctl:
power on              # Enciende el adaptador
discoverable on       # Pon en modo descubierto
scan on              # Busca dispositivos

# Espera a que vea tu dispositivo, luego:
pair XX:XX:XX:XX:XX:XX  # MAC del dispositivo
trust XX:XX:XX:XX:XX:XX
connect XX:XX:XX:XX:XX:XX

exit
```

**Paso 5: Verifica permisos**

```bash
# Asegúrate de que estás en el grupo bluetooth
groups | grep bluetooth

# Si no aparece, añádete
sudo usermod -a -G bluetooth $USER

# Necesitarás cerrar sesión y entrar de nuevo
```

### Se desconecta frecuentemente

#### Síntoma
El dispositivo Bluetooth se desconecta solo.

#### Solución

```bash
# Aumenta la distancia o elimina interferencias
# Problemas típicos:
# - Microondas
# - WiFi en el mismo canal
# - Muchos dispositivos Bluetooth simultáneamente

# Verifica integridad del adaptador
sudo hciconfig hci0 reset

# Si sigue desconectándose, probablemente sea:
# - Problema del dispositivo (batería baja)
# - Controlador Bluetooth del sistema
# - Interferencia de radio
```

---

## Problemas de Red/WiFi

### WiFi no aparece o no se conecta

#### Síntoma
No ves redes WiFi disponibles o no puedes conectarte.

#### Solución Paso a Paso

**Paso 1: Verifica que WiFi está habilitado**

```bash
# Ver estado
rfkill list wifi

# Habilitar si está bloqueado
rfkill unblock wifi

# Ver dispositivo físico
ip link show | grep -i wlan

# Activar interfaz
sudo ip link set wlan0 up
```

**Paso 2: Verifica NetworkManager**

```bash
# Debe estar corriendo
systemctl status NetworkManager
sudo systemctl start NetworkManager

# Ver estado de red
nmcli device status
nmcli radio
```

**Paso 3: Recarga el adaptador WiFi**

```bash
# Desactiva y activa WiFi
nmcli radio wifi off
sleep 2
nmcli radio wifi on

# Recarga dispositivo
sudo ip link set wlan0 down
sleep 2
sudo ip link set wlan0 up
```

**Paso 4: Escanea redes disponibles**

```bash
# Ver redes
nmcli device wifi list

# Si no ve redes, el adaptador podría estar dañado
# Comprueba físicamente
lsusb | grep -i network  # Para USB
lspci | grep -i network  # Para integrado
```

**Paso 5: Conecta a una red**

```bash
# Conectar a una red abierta
nmcli device wifi connect "SSID"

# Conectar a una red protegida
nmcli device wifi connect "SSID" password "contraseña"

# Verificar conexión
nmcli device status
ping 8.8.8.8
```

### Conexión lenta

#### Síntoma
La conexión de red es muy lenta.

#### Solución

```bash
# Verifica la velocidad
nmcli device wifi list | grep SSID

# Comprueba interferencias (cambia canal)
# Normalmente los routers auto-seleccionan, pero puedes:

# Ver canales activos en tu zona
sudo iwlist wlan0 scan | grep Channel

# Si es WiFi 5GHz, generalmente menos interferencias
# Configura en tu router
```

### Sin conexión de red

#### Síntoma
No hay conexión incluso aunque aparezca conectado.

#### Solución

```bash
# Verifica configuración IP
ip addr show

# Si no tiene IP (inet), solicita una
sudo dhclient wlan0

# O con NetworkManager
nmcli connection down "SSID"
nmcli connection up "SSID"

# Verifica DNS
cat /etc/resolv.conf
ping 8.8.8.8  # Prueba DNS de Google
```

---

## Problemas de Performance

### Uso alto de CPU/Memoria

#### Síntoma
Vasak Desktop usa mucho CPU o consume mucha RAM.

#### Diagnóstico

```bash
# Ver qué proceso consume más
top -p $(pgrep -f vasak-desktop)

# O usar ps
ps aux | grep vasak-desktop

# Ver consumo histórico
RUST_LOG=debug vasak-desktop 2>&1 | tee performance.log
# (Reproduce el problema, luego Ctrl+C)
```

#### Soluciones

**Opción 1: Desactiva animaciones**

```bash
# Edita: ~/.config/vasak-desktop/config.toml
[ui]
animations_enabled = false
animation_duration = 50
```

**Opción 2: Reduce tasa de refresco**

```bash
# En ~/.config/vasak-desktop/config.toml
[rendering]
refresh_rate = 30  # Reducir de 60
```

**Opción 3: Desactiva efectos visuales**

```bash
# Busca en configuración:
effects_enabled = false
blur_effects = false
transparency_effects = false
```

**Opción 4: Revisa procesos en segundo plano**

```bash
# Ver todos los procesos de Vasak
pgrep -af vasak

# Si hay procesos duplicados, termínalos
pkill -f vasak-secondary-process
```

### Aplicación lenta para responder

#### Síntoma
Los clics o interacciones tienen demora.

#### Solución

```bash
# Limpia configuración y reinicia
mv ~/.config/vasak ~/.config/vasak.backup
pkill vasak-desktop
sleep 2
vasak-desktop &
```

---

## Problemas de Configuración

### Cambios de configuración no se aplican

#### Síntoma
Los cambios en la configuración no se reflejan en la interfaz.

#### Solución

```bash
# La configuración se lee al iniciar
# Reinicia la aplicación
pkill vasak-desktop
sleep 2
vasak-desktop &

# Verifica que la configuración está guardada correctamente
cat ~/.config/vasak/system_config.json

# Verifica permisos
ls -la ~/.config/vasak/system_config.json

# Si no tienes permisos de lectura:
chmod 644 ~/.config/vasak/system_config.json
```

### Configuración corrupta

#### Síntoma
La aplicación no inicia o se comporta de manera impredecible.

#### Solución

```bash
# Respalda la configuración actual
mv ~/.config/vasak ~/.config/vasak.backup

# Al reiniciar, se recreará con valores por defecto
vasak-desktop

# Si funciona, puedes restaurar ajustes específicos copiando
# valores de ~/.config/vasak.backup/system_config.json
```

---

## Escalado y DPI

### Interfaz demasiado pequeña o grande

#### Síntoma
Los elementos de UI se ven muy pequeños o muy grandes.

#### Solución

```bash
# Ajusta la escala del sistema mediante GTK
gsettings set org.gnome.desktop.interface text-scaling-factor 1.25

# Para X11, ajusta DPI
echo "Xft.dpi: 120" >> ~/.Xresources
xrdb -merge ~/.Xresources

# Reinicia para aplicar
pkill vasak-desktop && vasak-desktop &
```
pkill -f vasak-desktop
vasak-desktop &
```

---

## Errores de Permiso

### "Permission Denied" en operaciones

#### Síntoma
Ves errores de permiso en logs.

#### Solución

```bash
# Para audio:
sudo usermod -a -G audio $USER

# Para Bluetooth:
sudo usermod -a -G bluetooth $USER

# Para acceder a dispositivos:
sudo usermod -a -G input $USER
sudo usermod -a -G dialout $USER

# Estos cambios requieren cerrar sesión y entrar de nuevo
# O ejecutar en nueva terminal:
su - $USER
```

---

## Cuando Nada Funciona

### Reinicio completo

```bash
# 1. Detén todos los procesos de Vasak
pkill -f vasak

# 2. Detén servicios relacionados
systemctl --user stop pulseaudio
systemctl --user stop dbus

# 3. Reinicia servicios del sistema
systemctl --user restart dbus
systemctl --user restart pulseaudio  # o pipewire si usas PipeWire

# 4. Inicia con debug
RUST_LOG=debug vasak-desktop 2>&1 | tee restart-debug.log
```

### Reportar el problema

Si nada funciona:

1. Recopila la información y logs:
   ```bash
   # Captura información del sistema y logs
   RUST_LOG=debug vasak-desktop 2>&1 | tee vasak-debug-report.log
   
   # Añade información del sistema
   echo "=== Información del Sistema ===" >> vasak-debug-report.log
   echo "Distro: $(lsb_release -d)" >> vasak-debug-report.log
   echo "Kernel: $(uname -r)" >> vasak-debug-report.log
   echo "Sesión: $XDG_SESSION_TYPE" >> vasak-debug-report.log
   ```

2. Abre un issue en GitHub adjuntando `vasak-debug-report.log`

Ver [Cómo Reportar Errores](reporte-errores.md) para más detalles.
