---
Title: "Descargas"
seotitle: "Descargar VasakOS — ISO x86_64, checksum SHA256 y requisitos | VasakOS"
description: "Descargá la ISO oficial de VasakOS para x86_64. Mirrors, checksum SHA256, requisitos mínimos y guía paso a paso para crear el USB booteable e instalar."
tags: [descargas, download, iso, vasakos iso, descargar vasakos, arch linux, linux]
type: downloads
img: "/img/posts/download.svg"
date: "2022-03-19"
lastmod: "2026-06-14"
---

> **Es una versión Alpha.** Se instala y se usa, pero hay funciones incompletas y cambios entre compilaciones. Antes de reemplazar tu sistema principal, revisá el [estado del proyecto](/state/).

## Instalar paso a paso

1. **Descargá la ISO** desde cualquiera de los mirrors de arriba.
2. **Verificá el SHA256** con el comando de tu sistema. Si no coincide, la descarga se
   corrompió o el mirror está comprometido: no la uses.
3. **Creá el USB booteable.** Recomendamos [Ventoy](https://www.ventoy.net/) porque te deja
   copiar la ISO como un archivo más y conservar varias en el mismo pendrive. También
   sirven `dd`, [balenaEtcher](https://etcher.balena.io/) o Rufus.

   ```bash
   sudo dd if=vasakos-2026.06.14-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
   ```

   Reemplazá `/dev/sdX` por tu pendrive — `lsblk` te dice cuál es. **Escribir en el disco
   equivocado borra ese disco.**
4. **Arrancá desde el USB.** En la mayoría de los equipos se entra al menú de arranque con
   F12, F11, F9 o Esc. Si tenés Secure Boot activado, desactivalo.
5. **Probá en modo Live.** Antes de instalar, verificá que anden el wifi, el sonido, el
   brillo y la resolución de pantalla.
6. **Instalá** desde el icono del instalador en el escritorio.

## Después de instalar

El repositorio de paquetes de VasakOS ya viene configurado en la ISO, así que las
actualizaciones llegan con:

```bash
sudo pacman -Syu
```

Si querés usar las aplicaciones de VasakOS sobre una instalación de Arch Linux ya existente,
seguí la guía de [repositorio de paquetes](/docs/user/repository/).

## Si algo falla

Un reporte útil incluye el modelo del equipo, la placa de video, en qué paso falló y los
logs. La guía completa está en [reportar errores](/docs/user/reporte-errores/).
