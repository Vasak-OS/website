---
title: "Solución de problemas"
weight: 30
description: "Los problemas más frecuentes de VasakOS y cómo salir de ellos: sesión, pantalla, audio, red, bluetooth, rendimiento y configuración."
---

Antes de nada, dos cosas que resuelven o explican la mayoría de los casos.

**Mirá lo que dejó escrito.** Cada aplicación de VasakOS escribe en el diario del sistema
con su propio nombre, así que no hace falta reproducir el problema para verlo:

```bash
journalctl -t vasak-desktop -b -p err --no-pager
```

La guía completa está en [logs y diagnóstico](/docs/user/logs/).

**Actualizá antes de investigar.** VasakOS es rolling release y muchos problemas ya están
arreglados en el repositorio:

```bash
sudo pacman -Syu
```

> VasakOS es Arch Linux por debajo. Todo lo que se instala o se quita se hace con `pacman`;
> si una guía de internet te dice `apt`, `dnf` o `zypper`, no es para este sistema.

---

## La sesión no arranca

### Vuelvo a la pantalla de inicio de sesión apenas entro

La sesión gráfica la arranca `vasak-session`, que lanza el compositor **Wayfire** dentro de
`uwsm`. Si alguna de esas piezas falta o falla, la sesión muere y volvés al selector.

```bash
journalctl --user -b -u 'wayfire*' -u 'graphical-session*' --no-pager | tail -50
```

Si el mensaje habla de `uwsm`, verificá que el paquete esté instalado — sin él la sesión
muere antes de que arranque el compositor:

```bash
pacman -Q uwsm wayfire vasak-desktop
```

### Entro pero no hay panel ni fondo

El panel, el fondo y el menú son ventanas de un solo proceso, `vasak-desktop`, dibujadas
como capas del compositor. Si el proceso no está, no hay ninguna de las tres.

```bash
pgrep -a vasak-desktop            # ¿está corriendo?
journalctl -t vasak-desktop -b --no-pager | tail -40
```

Para levantarlo de nuevo sin cerrar la sesión:

```bash
pkill vasak-desktop && (vasak-desktop &)
```

> El panel **no** es un proceso aparte: `vasak-panel` es el nombre de la capa con la que se
> dibuja, no un programa. `pkill vasak-panel` no encuentra nada.

---

## Pantalla y monitores

### El panel no aparece en todos los monitores

El escritorio se entera de los monitores por el compositor. Después de enchufar o
desenchufar una pantalla:

```bash
journalctl -t vasak-desktop -b --no-pager | grep -i -E "monitor|output"
```

Si el monitor nuevo no aparece en la lista, reiniciá el escritorio con el `pkill` de arriba.
Los widgets del escritorio que no entren en la resolución nueva se reubican solos.

### La resolución o la escala están mal

Eso lo decide Wayfire, no VasakOS. Se configura en **Ajustes → Pantallas**, y lo que se
guarda queda en `~/.config/wayfire.ini`, en una sección por monitor:

```ini
[output:HDMI-A-1]
mode = 1920x1080@60000
scale = 1.0
```

Los nombres de los monitores salen de:

```bash
wlr-randr
```

### Todo se ve demasiado chico o demasiado grande

`scale` en la sección del monitor: `1.0` es tamaño real, `1.5` y `2.0` agrandan, `0.8`
achica. Wayfire relee el archivo al guardarlo, sin reiniciar.

---

## El teclado escribe otra distribución

La distribución que elegiste al instalar queda en `/etc/vconsole.conf`, y `vasak-session`
la exporta al compositor. Wayfire, por su cuenta, escribiría siempre en inglés. También se
cambia sin terminal desde **Ajustes → Idioma y Teclado**.

```bash
cat /etc/vconsole.conf            # lo que quedó configurado
localectl set-x11-keymap latam    # cambiarlo
```

Un `xkb_layout` escrito a mano en `~/.config/wayfire.ini` le gana a lo anterior; si lo
pusiste alguna vez y ya no lo querés, dejá el valor vacío. Los cambios se aplican al
volver a iniciar sesión.

---

## Audio

VasakOS usa **PipeWire** con **WirePlumber**. No usa PulseAudio ni JACK por separado:
PipeWire los reemplaza a los dos y responde por ellos.

### No se escucha nada

```bash
systemctl --user status pipewire pipewire-pulse wireplumber
```

Si alguno está caído:

```bash
systemctl --user restart pipewire pipewire-pulse wireplumber
```

Después, verificá que la salida elegida sea la correcta:

```bash
wpctl status                      # lista dispositivos; cada uno con su número
wpctl set-default 47              # poner como predeterminado el del número 47
```

Lo mismo se hace sin terminal desde **Ajustes → Audio salida**.

> No hace falta agregarse al grupo `audio`. Ese consejo es de la época de OSS y ALSA
> directo; con PipeWire el acceso va por la sesión de systemd y sumarse al grupo no
> arregla nada.

### El sonido se corta o llega tarde

Suele ser el tamaño del buffer, sobre todo con USB o Bluetooth. Se ajusta en un archivo de
usuario:

```bash
mkdir -p ~/.config/wireplumber/wireplumber.conf.d
cat > ~/.config/wireplumber/wireplumber.conf.d/50-buffer.conf <<'EOF'
monitor.alsa.rules = [
  {
    matches = [ { node.name = "~alsa_output.*" } ]
    actions = { update-props = { api.alsa.period-size = 1024 } } 
  }
]
EOF
systemctl --user restart wireplumber
```

Subí `period-size` si sigue cortándose; bajalo si lo que te molesta es la latencia.

---

## Red y wifi

La red la maneja **NetworkManager**, y el control del panel es una interfaz sobre él.

### No aparecen las redes

```bash
systemctl status NetworkManager           # ¿está corriendo?
nmcli radio wifi                          # ¿la radio está encendida?
nmcli radio wifi on
nmcli device wifi list                    # ¿ve redes?
rfkill list                               # ¿hay un bloqueo por hardware?
rfkill unblock wifi
```

Si `rfkill` dice `Hard blocked: yes`, es el interruptor físico o la combinación de teclas
del equipo; ningún comando lo destraba.

### La placa no aparece en absoluto

Falta el firmware o el controlador:

```bash
lspci -k | grep -A 3 -i network            # qué placa hay y qué módulo la maneja
journalctl -b | grep -i firmware           # ¿pidió firmware que no está?
```

Las placas **Broadcom** casi siempre necesitan un controlador que no viene de fábrica; es
uno de los complementos que ofrece el instalador y también se puede instalar después.

### Se conecta pero no navega

```bash
ip route                                   # ¿hay ruta por defecto?
ping -c 3 1.1.1.1                          # ¿hay red?
ping -c 3 archlinux.org                    # ¿hay DNS?
```

Si lo primero anda y lo segundo no, el problema es de DNS, no de conexión.

---

## Bluetooth

### No encuentra dispositivos

```bash
systemctl status bluetooth
sudo systemctl enable --now bluetooth
rfkill list bluetooth
rfkill unblock bluetooth
bluetoothctl scan on
```

### Se conecta y se corta

Casi siempre es interferencia con el wifi de 2,4 GHz. Si podés, pasá el wifi a 5 GHz. Si el
dispositivo es de audio y se corta al reproducir, mirá arriba la sección de buffer: el
audio por Bluetooth es el caso más sensible.

---

## Rendimiento

### Algo consume CPU o memoria de más

**Monitor del sistema** muestra procesos, recursos y registros en un solo lugar. Desde la
terminal:

```bash
systemd-cgtop --order=cpu
journalctl -t vasak-desktop -b -p warning --no-pager | tail -30
```

Dos causas propias de VasakOS que vale la pena descartar:

- **Fondo de escritorio en movimiento.** Un video de fondo se decodifica todo el tiempo.
  Se apaga en **Ajustes → Fondos**, donde además se puede dejar que se pause solo con
  batería.
- **Widgets del escritorio.** Cada uno hace su trabajo. Con el clic derecho sobre el fondo
  entrás al modo edición y podés sacar los que no uses.

### Una ventana no responde

```bash
pgrep -a vasak-               # qué aplicaciones de VasakOS están abiertas, con su número
kill 12345                    # pedirle que cierre, con el número que devolvió pgrep
kill -9 12345                 # obligarla, si no cierra
```

---

## Configuración

### Cambié algo en Ajustes y no se aplicó

La configuración del escritorio vive en `~/.config/vasak/vasak.conf`. Casi todo se aplica
al instante; lo que no, se aplica al volver a abrir la aplicación.

```bash
journalctl -t vasak-settings -b --no-pager | tail -20
```

### Volver a la configuración de fábrica

```bash
mv ~/.config/vasak/vasak.conf ~/.config/vasak/vasak.conf.bak
pkill vasak-desktop && (vasak-desktop &)
```

Si lo que querés reiniciar es el compositor —atajos, monitores, plugins—, el archivo es
`~/.config/wayfire.ini`. Guardá una copia antes de borrarlo: `vasak-config-migrate` agrega
las opciones nuevas de cada actualización, pero no devuelve lo que borraste.

---

## Permisos

### «Permission denied» al hacer algo del sistema

Los pedidos de administrador los atiende `polkit-vasak-agent`, y los permisos que piden las
aplicaciones, `vasak-permissions-agent`. Si ninguno de los dos está corriendo, el diálogo
de autorización nunca aparece y la operación falla sin explicación:

```bash
systemctl --user status polkit-vasak-agent vasak-permissions-agent
systemctl --user restart polkit-vasak-agent vasak-permissions-agent
```

---

## Cuando nada de esto alcanza

1. Reinstalá el escritorio sin tocar tu configuración:

   ```bash
   sudo pacman -S vasak-desktop vasak-desktop-settings
   ```

2. Probá con una cuenta nueva. Si ahí anda, el problema está en tu configuración y no en
   el sistema:

   ```bash
   sudo useradd -m prueba && sudo passwd prueba
   ```

3. Juntá lo que hace falta para el reporte:

   ```bash
   {
     echo "== sistema ==";  cat /etc/vasakos/vasakos-release; uname -r
     echo "== paquetes =="; pacman -Q | grep -E '^(vasak|uwsm|wayfire)'
     echo "== sesión ==";   echo "$XDG_SESSION_TYPE $XDG_CURRENT_DESKTOP"
     echo "== registro =="; journalctl -t vasak-desktop -b --no-pager | tail -100
   } > vasak-diagnostico-$(date +%Y%m%d-%H%M%S).txt
   ```

   Revisá el archivo antes de subirlo: puede tener nombres de redes o rutas personales.

4. Abrilo como issue siguiendo [cómo reportar errores](/docs/user/report-bugs/).
