---
title: "Solución de problemas"
weight: 30
description: "Guía paso a paso para los problemas más frecuentes de VasakOS: arranque, sesión, audio, red y pantalla."
---

> **Primero, el monitor.** La mitad de estos problemas se ven y se resuelven desde el
> **Monitor del sistema**: **Registros** para los errores, **Servicios** para reiniciar un
> servicio y **Aplicaciones** para ver o cerrar un proceso. Está explicado en
> [Errores y registros en el monitor](/docs/user/monitoring/). Si el escritorio no llega a
> pintar, la vía es la terminal: ver [El escritorio no arranca](/docs/user/errors/).

## La sesión

El escritorio corre como un servicio de **usuario** de systemd, gestionado por `uwsm`; por
eso los comandos de la sesión llevan `--user`.

```bash
# Estado del escritorio
systemctl --user status vasak-desktop.service

# Reiniciarlo (equivale a recargar el escritorio)
systemctl --user restart vasak-desktop.service

# Sus últimos mensajes
journalctl --user -u vasak-desktop.service -b --no-pager | tail -50
```

Si el servicio entra en un bucle de reinicios, systemd se rinde a los cinco intentos en un
minuto y deja el motivo en el diario: ahí está la causa.

## Una aplicación no abre

1. Mira en **Monitor del sistema → Registros**, con **Sólo errores** y esa aplicación
   elegida en **Aplicación**.
2. Si el servicio aparece en fallo, reinícialo desde **Servicios**.
3. Para el propio escritorio hay más detalle en su archivo del día:

   ```bash
   less ~/.local/share/vasak-desktop/logs/vasak-desktop-$(date +%F).log
   ```

4. Si nada lo aclara, reinstala el paquete:

   ```bash
   sudo pacman -S vasak-desktop
   ```

## El panel no aparece

El panel es parte del escritorio, no un proceso aparte: no hay un `vasak-panel` que
reiniciar. Reinicia el escritorio:

```bash
systemctl --user restart vasak-desktop.service
```

Si el panel sigue sin pintar, mira **Registros** filtrando por `vasak-desktop`: el escritorio
avisa a los veinte segundos si el panel no llegó a reportarse.

## Pantalla

La resolución, la escala, la disposición y el brillo se ajustan desde
**Configuración → Pantallas** (y **Brillo y luz nocturna**). La sesión es **Wayland**, así
que no se usa `xrandr`: eso es de X11.

Si un monitor conectado en caliente no aparece, desconéctalo y vuelve a conectarlo, o
reinicia el escritorio. Para ver lo que detectó el compositor, el paquete opcional
`wlr-randr` lista las salidas.

## Audio

El sonido corre sobre **PipeWire**, con WirePlumber:

```bash
# Estado de los servicios de audio
systemctl --user status pipewire pipewire-pulse wireplumber

# Reiniciarlos si algo quedó trabado
systemctl --user restart pipewire pipewire-pulse wireplumber

# Ver la salida elegida y los volúmenes
wpctl status
```

Elige la salida y el volumen por aplicación desde **Configuración → Audio salida**. No hay
un PulseAudio propio que reiniciar.

## Bluetooth

```bash
# ¿Está bloqueado?
rfkill list bluetooth
rfkill unblock bluetooth

# El servicio es del sistema, no de la sesión
sudo systemctl enable --now bluetooth
systemctl status bluetooth

# Emparejar
bluetoothctl
```

Dentro de `bluetoothctl`: `power on`, `scan on`, `pair <MAC>`, `trust <MAC>`,
`connect <MAC>`.

No hay que agregarse a ningún grupo para usarlo: el acceso lo concede el sistema cuando hace
falta.

## Red y WiFi

La red la maneja **NetworkManager**; para lo cotidiano, **Configuración → Wi-Fi**.

```bash
# Estado
nmcli device status
nmcli radio

# Encender el WiFi
nmcli radio wifi on

# Ver redes y conectarse
nmcli device wifi list
nmcli device wifi connect "SSID" password "contraseña"
```

No se edita `/etc/resolv.conf` a mano ni se usa `dhclient`: de eso se ocupan NetworkManager
y systemd-resolved. Si la interfaz dice «conectado» pero no hay red, mira
`journalctl -u NetworkManager`, o **Registros** con **Todo el sistema**.

## Consumo alto

Mídelo en **Monitor del sistema → Recursos** y **Aplicaciones**: **Aplicaciones** agrupa los
procesos de un mismo programa y ordena por consumo, y **Cerrar** le pide al programa que
termine dándole tiempo a guardar.

## La configuración no se aplica

Los ajustes se cambian desde **Configuración**, que valida y aplica en el momento. Sus
valores viven en dos archivos:

- `~/.config/vasak/vasak.conf` — la configuración del sistema, en `clave = valor`.
- `~/.config/wayfire.ini` — los atajos y el comportamiento del compositor.

Para revisar el primero:

```bash
cat ~/.config/vasak/vasak.conf
```

Si sospechas que quedó corrupto, muévelo y vuelve a entrar: se recrea con los valores por
defecto.

```bash
mv ~/.config/vasak/vasak.conf ~/.config/vasak/vasak.conf.backup
```

## Permisos

Los permisos de cámara y micrófono no se dan con los grupos de Unix: los concede el servicio
de permisos de VasakOS, con un aviso la primera vez que una aplicación los pide. Lo concedido
se revisa desde **Configuración → Privacidad y seguridad**.

## Cuando nada funciona

```bash
# Reinicia el escritorio
systemctl --user restart vasak-desktop.service

# Si no levanta, el final del registro
journalctl --user -u vasak-desktop.service -b --no-pager | tail -50
```

Si el fallo es del equipo entero, reinicia. Con los mensajes del monitor o de `journalctl` a
mano, sigue el [reporte de errores](/docs/user/report-bugs/).
