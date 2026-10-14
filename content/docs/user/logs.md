---
title: "Logs y diagnóstico"
weight: 45
description: "Dónde quedan los mensajes de VasakOS: la pantalla Registros del monitor del sistema y los archivos de log que escribe cada aplicación."
---

Los **errores** de VasakOS se ven en el **Monitor del sistema**, en la pantalla
**Registros**. Esta página explica además dónde queda cada archivo, por si hay que
adjuntarlo a un reporte.

## Los errores, en el monitor

Abre **Monitor del sistema → Registros** y activa **Sólo errores**. La pantalla lee el
diario del sistema del arranque actual y lo acota por aplicación; está explicada en
[Errores y registros en el monitor](/docs/user/monitoring/).

El monitor necesita el escritorio en marcha. Si el problema es justamente que el escritorio
no arranca, la vía es la terminal: ver [El escritorio no arranca](/docs/user/errors/).

## El archivo de log del escritorio

Además del diario, `vasak-desktop` escribe su propio archivo, con más detalle del que va al
diario:

```
~/.local/share/vasak-desktop/logs/vasak-desktop-AAAA-MM-DD.log
```

Es un archivo por día y se conservan los últimos siete: los más viejos se borran solos. Ahí
queda todo lo que pasa en el escritorio —errores y avisos incluidos—, y es lo que conviene
mirar cuando el escritorio hace algo raro.

## Desde la terminal

El diario completo se consulta con `journalctl`, sin interfaz. Es la misma información que
muestra el monitor:

```bash
# Errores del arranque actual, del sistema
journalctl -b -p err

# Errores del arranque actual, de tu sesión de escritorio
journalctl --user -b -p err

# Un servicio puntual
journalctl --user -u vasak-desktop.service -b
```

`-b` limita al arranque actual y `-p err` deja los errores. Para seguirlos en vivo, agrega
`-f`; para ver todo, sin filtrar por nivel, quita el `-p err`.

## Exportar para un reporte

Para adjuntar los mensajes a un [reporte de error](/docs/user/report-bugs/), guarda la
salida en un archivo:

```bash
journalctl -b -p err --no-pager > errores-$(date +%F).log
journalctl --user -b -p err --no-pager >> errores-$(date +%F).log
```

Los del monitor se copian directo de la pantalla **Registros**.
