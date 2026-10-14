---
title: "El escritorio no arranca"
weight: 41
description: "Qué hacer cuando el escritorio de VasakOS no inicia: llegar a la terminal, leer los errores del arranque y volver a un estado que funcione."
aliases: ["/docs/user/errores/"]
---

Con el escritorio en marcha, los errores se ven en el **Monitor del sistema**, en la
pantalla **Registros** (ver [Errores y registros en el monitor](/docs/user/monitoring/)).
Esta página es para cuando el escritorio **no llega a pintar** y el monitor no está
disponible: hay que mirar desde una terminal.

## Llegar a una terminal

- Con el sistema ya arrancado pero sin escritorio, cambia a una terminal de texto con
  **Ctrl+Alt+F2** (o F3 hasta F6) y entra con tu usuario y contraseña. Para volver al
  escritorio, prueba **Ctrl+Alt+F1**.
- Si el equipo no arranca, arranca desde el USB de instalación en modo Live.

## Leer los errores del arranque

```bash
# Errores del arranque actual, del sistema
journalctl -b -p err

# Errores de tu sesión de escritorio
journalctl --user -b -p err

# El servicio del escritorio, con las últimas líneas
systemctl --user status vasak-desktop.service
journalctl --user -u vasak-desktop.service -b --no-pager | tail -50
```

`-b` limita al arranque actual y `-p err` deja los errores. `--no-pager` imprime todo de una
vez y `tail -50` muestra el final, que es lo más reciente.

## El archivo del escritorio

`vasak-desktop` también deja un archivo por día, con más detalle del que va al diario:

```bash
less ~/.local/share/vasak-desktop/logs/vasak-desktop-$(date +%F).log
```

## Si el equipo no arranca

Arranca desde el USB de instalación en modo Live, monta tu instalación y entra con
`arch-chroot`:

```bash
sudo mount /dev/sdXY /mnt
sudo arch-chroot /mnt
journalctl -b -1 -p err
```

`-b -1` es el arranque anterior, el que falló. Desde ahí se reinstalan paquetes o se corrige
la configuración.

## Un programa que se cierra solo

```bash
# ¿Hubo un volcado de memoria?
coredumpctl list | grep vasak

# Detalle del último
coredumpctl info
```

## Reintentar

- Reiniciar el escritorio: `systemctl --user restart vasak-desktop.service`.
- Cerrar la sesión y volver a entrar.
- Reiniciar el equipo.

## Antes de reportar

Reúne lo que obtuviste y sigue el [reporte de errores](/docs/user/report-bugs/). Con el
escritorio en marcha, en cambio, los mensajes se copian directo desde el monitor.
