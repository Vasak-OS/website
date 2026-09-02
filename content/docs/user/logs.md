---
title: "Logs y diagnóstico"
weight: 45
description: "Cómo leer los registros de VasakOS con journalctl y con el Monitor: cada aplicación escribe en el diario del sistema con su propio nombre."
aliases: ["/docs/user/errors/", "/docs/user/errores/"]
---

Cada aplicación de VasakOS escribe en el **diario de systemd** con su propio nombre. Eso es
lo que hace que se pueda leer lo que dejó una sola de ellas, sin filtrar a mano entre todo
lo que escribe la sesión.

No hace falta lanzar nada desde una terminal ni reproducir el problema: lo que pasó ya está
guardado.

## Lo primero que conviene probar

```bash
journalctl -t vasak-desktop -n 100 --no-pager
```

`-t` filtra por el nombre de la aplicación. Reemplazalo por la que te interese:
`vasak-terminal`, `vasak-file-manager`, `vasak-settings`, `vasak-gallery`,
`vasak-resonance`, `vasak-monitor`, `vasak-shot` o `vasak-installer`.

Las opciones que más se usan:

```bash
journalctl -t vasak-desktop -f                 # en vivo, mientras reproducís el problema
journalctl -t vasak-desktop -b                 # sólo desde el último arranque
journalctl -t vasak-desktop -p err             # sólo errores
journalctl -t vasak-desktop --since "10 min ago"
```

## Desde el Monitor, sin terminal

**Monitor del sistema** trae un visor de registros con un selector de aplicación: elegís
una de la lista y ves lo que dejó, sin escribir ningún comando. Es la misma información que
`journalctl -t`, con el filtro puesto por vos.

## Separar la interfaz del núcleo

Las aplicaciones de VasakOS son dos mitades: la interfaz, escrita en Vue, y el núcleo,
escrito en Rust. Cada mensaje del diario dice de cuál de las dos salió, en el campo
`VSK_CAPA`, y eso ahorra la mitad de la búsqueda: los dos problemas se arreglan en archivos
distintos.

```bash
journalctl -t vasak-resonance VSK_CAPA=interfaz   # lo que rompió la ventana
journalctl -t vasak-resonance VSK_CAPA=nucleo     # lo que rompió el backend
```

## Si una aplicación se cerró sola

Cuando una aplicación aborta, el mensaje que explica por qué queda en el diario con
prioridad de crítico, con el archivo y la línea donde pasó:

```bash
journalctl -t vasak-desktop -p crit -b
```

Vale la pena mirar esto **antes** que cualquier otra cosa: es lo que convierte un «se cerró
sola» en un reporte que se puede arreglar.

## Más detalle del habitual

En condiciones normales las aplicaciones no escriben todo lo que saben. Para pedirles el
detalle completo hay que lanzarlas desde una terminal con `RUST_LOG`:

```bash
RUST_LOG=debug vasak-desktop
```

| Nivel | Qué muestra |
| --- | --- |
| `error` | Sólo lo que dejó de funcionar. |
| `warn` | Lo anterior, más lo que podría fallar. |
| `info` | Lo anterior, más el funcionamiento normal. |
| `debug` | Lo anterior, más el detalle que sirve para diagnosticar. |
| `trace` | Todo. Suele ser demasiado. |

También se puede pedir detalle de una sola parte, en vez de la aplicación entera:

```bash
RUST_LOG=vasak_desktop::audio=debug vasak-desktop
```

> Lanzar el escritorio así desde una terminal, con la sesión ya iniciada, abre una segunda
> instancia. Para el escritorio conviene `journalctl`; `RUST_LOG` es más útil con las
> aplicaciones que se abren y se cierran.

## Guardar los registros para un reporte

```bash
journalctl -t vasak-desktop -b --no-pager > vasak-desktop-$(date +%Y%m%d-%H%M%S).log
```

Ese archivo es lo que conviene adjuntar en un
[reporte de error](/docs/user/report-bugs/). Antes de subirlo, mirá lo que contiene: el
diario puede incluir nombres de archivos, redes wifi o rutas de tu carpeta personal.

## Dónde vive la configuración

Si sospechás que el problema es de configuración y no de la aplicación:

```
~/.config/vasak/vasak.conf        # tema, iconos, cursor, modo oscuro
~/.config/vasak/schemes/          # esquemas de color propios
/usr/share/vasak-schemes/         # los esquemas que trae el sistema
```

Mover `vasak.conf` a un lado y volver a abrir la aplicación la deja con la configuración de
fábrica, sin desinstalar nada:

```bash
mv ~/.config/vasak/vasak.conf ~/.config/vasak/vasak.conf.bak
```

## Depurar D-Bus

El escritorio habla con el resto del sistema por D-Bus: audio, bluetooth, red,
notificaciones. Para ver ese tráfico:

```bash
dbus-monitor --session                 # lo de la sesión
dbus-monitor --system                  # lo del sistema
```

## Los servicios de la sesión

Parte de VasakOS no son ventanas sino servicios que systemd arranca con la sesión
gráfica: el que atiende las notificaciones, el llavero, el agente de permisos. Esos se
leen por unidad, con `--user`:

```bash
systemctl --user status vasak-flare-daemon     # ¿está corriendo?
journalctl --user -u vasak-flare-daemon -f     # qué dejó
```

Las unidades de la sesión son:

| Unidad | Qué hace |
| --- | --- |
| `vasak-flare-daemon` | Recibe las notificaciones y guarda el historial. |
| `vasak-keyring` | El llavero de claves. |
| `vasak-permissions-agent` | Los permisos que piden las aplicaciones. |
| `polkit-vasak-agent` | Los pedidos de autorización de administrador. |
| `vasak-connect` | El vínculo con el teléfono. |
| `vasak-press-and-hold` | Mantener una tecla para elegir acento. |
| `vasak-idle` | Apagar la pantalla y bloquear por inactividad. |

Verlas todas juntas:

```bash
systemctl --user list-units 'vasak*' 'polkit-vasak*'
```
