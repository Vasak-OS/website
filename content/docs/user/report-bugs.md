---
title: "Cómo reportar errores"
weight: 50
description: "Qué información incluir en un reporte de error de VasakOS, en qué repositorio abrirlo y cómo juntar los datos con un solo comando."
aliases: ["/docs/user/reporte-errores/"]
---

Un reporte sirve si alguien puede **reproducir** el problema. Todo lo demás es secundario.

## Antes de abrirlo

1. Actualizá: `sudo pacman -Syu`. VasakOS es rolling release y puede estar arreglado.
2. Buscá si ya está reportado, en el repositorio de la aplicación que falla. Si encontrás
   uno parecido, sumá tu información ahí en vez de abrir otro: dos casos en el mismo issue
   valen más que dos issues sueltos.

## En qué repositorio

Cada aplicación tiene el suyo, dentro de [github.com/Vasak-OS](https://github.com/Vasak-OS).
Si no sabés cuál falla, abrilo en el de la aplicación donde lo viste; se puede mover.

| Lo que falla | Repositorio |
| --- | --- |
| Panel, menú, notificaciones, widgets del escritorio | `vasak-desktop` |
| Ajustes | `vasak-settings` |
| Archivos | `vasak-file-manager` |
| Terminal | `vasak-terminal` |
| Imágenes | `vasak-gallery` |
| Música | `vasak-resonance` |
| Monitor del sistema | `vasak-monitor` |
| Capturas | `vasak-shot` |
| Instalación | `vasak-installer` |
| Inicio de sesión, pantalla de bloqueo | `vasak-session-manager` |
| Que no aparezca una notificación | `vasak-flare-daemon` |
| Un paquete que no instala o no actualiza | `PKGBUILDS` |

## Juntar la información

Este comando arma un archivo con lo que casi siempre se termina pidiendo. Reproducí el
problema **antes** de ejecutarlo, así el registro lo incluye:

```bash
APP=vasak-desktop     # cambiala por la que falla
{
  echo "== VasakOS ==";   cat /etc/vasakos/vasakos-release
  echo "== kernel ==";    uname -r
  echo "== sesión ==";    echo "$XDG_SESSION_TYPE / $XDG_CURRENT_DESKTOP"
  echo "== paquetes ==";  pacman -Q | grep -E '^(vasak|uwsm|wayfire|pipewire)'
  echo "== video ==";     lspci -k | grep -A 2 -i vga
  echo "== registro =="; journalctl -t "$APP" -b --no-pager | tail -200
} > ~/vasak-reporte-$(date +%Y%m%d-%H%M%S).txt
```

> **Miralo antes de subirlo.** El registro puede incluir nombres de archivos, redes wifi y
> rutas de tu carpeta personal. Es un archivo de texto: borrá lo que no quieras publicar.

Si el problema es visual —algo mal dibujado, un icono equivocado, una ventana fuera de
lugar—, una captura vale más que el registro. Se saca con **Capturas** o con la tecla
`Impr Pant`.

## Qué escribir

El título es lo primero que se lee y lo que decide si alguien lo abre:

- Malo: «Error en el panel», «No funciona».
- Bueno: «El panel desaparece al conectar un monitor externo por HDMI».

Y en el cuerpo, cuatro cosas:

```markdown
## Qué pasa
Una línea. Qué hacías y qué salió mal.

## Cómo reproducirlo
1. …
2. …
3. Acá pasa el error.

## Qué esperaba que pasara

## Datos
- VasakOS: (lo que dice `cat /etc/vasakos/vasakos-release`)
- Versión de la aplicación: (lo que dice `pacman -Q vasak-desktop`)
- Equipo: marca y modelo, y la placa de video si el problema es visual

<!-- Adjuntar acá el archivo del comando de arriba -->
```

Si el problema aparece **a veces**, decilo y contá cuándo: «después de suspender», «con dos
monitores», «sólo la primera vez del día». Un error intermitente con contexto se arregla; un
error intermitente sin contexto se cierra por no poder reproducirse.

## Si la aplicación se cierra sola

Ese es el caso donde el registro importa más que todo lo demás, porque el motivo queda
escrito con prioridad de crítico:

```bash
journalctl -t vasak-desktop -p crit -b --no-pager
```

Pegá eso en el issue tal cual. Dice el archivo y la línea donde se cayó, que es
exactamente lo que hace falta para arreglarlo.

## Si es un problema de seguridad

No lo abras como issue público. Escribí a los canales de contacto de
[github.com/Vasak-OS](https://github.com/Vasak-OS) y esperá respuesta antes de publicar
nada.
