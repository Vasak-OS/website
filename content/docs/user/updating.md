---
title: "Actualizar el sistema"
description: "Cómo actualizar VasakOS, qué hacer con los archivos .pacnew, cómo volver atrás una actualización y qué significa rolling release en la práctica."
weight: 15
---

VasakOS es **rolling release**: no hay versiones que se queden atrás ni una migración grande
cada dos años. Las actualizaciones llegan continuamente desde los repositorios de Arch
Linux y desde el repositorio de VasakOS.

## Actualizar

```bash
sudo pacman -Syu
```

Eso es todo. Actualiza el sistema base y las aplicaciones de VasakOS en la misma operación.

> **Nunca uses `pacman -Sy paquete`** para instalar algo suelto. Sincroniza la base de datos
> sin actualizar el sistema y deja el equipo en un estado mezclado —bibliotecas viejas con
> paquetes nuevos— que es la causa número uno de sistemas rotos en Arch. Siempre `-Syu`.

## Cada cuánto

Una vez por semana está bien. Lo que conviene evitar es dejar pasar meses: cuanto más
grande la actualización, más probable que algo requiera intervención manual.

Antes de una actualización grande, mirá si hay avisos en
[el blog](/blog/) y en [Arch Linux news](https://archlinux.org/news/).

## Archivos `.pacnew`

Cuando una actualización trae una versión nueva de un archivo de configuración que vos
editaste, pacman no la pisa: la deja al lado con extensión `.pacnew`.

```bash
sudo pacdiff
```

`pacdiff` (del paquete `pacman-contrib`) los recorre uno por uno y te deja comparar y
combinar. Ignorarlos indefinidamente hace que servicios nuevos funcionen con configuración
vieja.

## Liberar espacio

pacman guarda todos los paquetes que descarga. Con el tiempo son varios GB:

```bash
sudo paccache -r        # deja las últimas 3 versiones de cada paquete
sudo paccache -ruk0     # borra las de paquetes desinstalados
```

## Volver atrás una actualización

Si una actualización rompió algo, se puede reinstalar la versión anterior desde la caché de
pacman:

```bash
ls /var/cache/pacman/pkg/ | grep nombre-del-paquete
sudo pacman -U /var/cache/pacman/pkg/nombre-del-paquete-VERSION.pkg.tar.zst
```

Para que la próxima actualización no lo vuelva a subir mientras investigás, agregalo
temporalmente a `IgnorePkg` en `/etc/pacman.conf`:

```conf
IgnorePkg = nombre-del-paquete
```

Acordate de sacarlo cuando el problema esté resuelto: un paquete congelado indefinidamente
termina siendo incompatible con el resto del sistema.

## Si el sistema no arranca después de actualizar

1. En el menú de arranque, elegí una entrada de kernel anterior si está disponible.
2. Si no, arrancá desde el USB de instalación en modo Live y montá tu instalación:

   ```bash
   sudo mount /dev/sdXY /mnt
   sudo arch-chroot /mnt
   ```

   Desde ahí podés reinstalar paquetes o revisar los logs con
   `journalctl -b -1 -p err`.

3. Guardá esos logs: son exactamente lo que hace falta para
   [reportar el problema](/docs/user/report-bugs/).
