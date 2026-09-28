---
title: "Instalar VasakOS"
description: "Guía completa para instalar VasakOS: crear el USB booteable, arrancar en modo Live, particionar e instalar junto a otro sistema."
weight: 5
---

Esta guía cubre la instalación desde cero. Si sólo quieres las aplicaciones de VasakOS sobre
un Arch Linux que ya tienes, salta a [repositorio de paquetes](/docs/user/repository/).

## Antes de empezar

- **Haz una copia de seguridad.** Cualquier instalación puede tocar la tabla de
  particiones. VasakOS está en Alpha; tratalo como tal.
- Necesitas un pendrive de 8 GB o más y una conexión a internet durante la instalación.
- Revisa los [requisitos](/downloads/) del sistema.

## 1. Descargar y verificar la ISO

Baja la imagen desde [Descargas](/downloads/) y verifica el checksum antes de escribirla:

```bash
sha256sum vasakos-2026.06.14-x86_64.iso
```

El resultado tiene que coincidir carácter por carácter con el SHA256 publicado en la página
de descargas. Si no coincide, la descarga se cortó o el mirror está comprometido: bajala de
nuevo, preferentemente desde otro mirror.

## 2. Crear el USB booteable

### Con Ventoy (recomendado)

[Ventoy](https://www.ventoy.net/) se instala una sola vez en el pendrive y después las ISOs
se copian como archivos comunes. Puedes tener varias distribuciones en el mismo pendrive y
no tienes que volver a formatearlo cada vez.

### Con `dd`

```bash
lsblk                       # identifica el pendrive: /dev/sdb, /dev/sdc…
sudo umount /dev/sdX*       # desmonta cualquier partición montada
sudo dd if=vasakos-2026.06.14-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
```

> `dd` no pregunta ni avisa. Si pones el disco equivocado en `of=`, ese disco se pierde.
> Verifica dos veces con `lsblk` antes de ejecutarlo.

### Desde Windows

[Rufus](https://rufus.ie/) en modo DD, o [balenaEtcher](https://etcher.balena.io/).

## 3. Arrancar desde el USB

1. Entra al menú de arranque del equipo. Según el fabricante suele ser **F12**, **F11**,
   **F9**, **F8** o **Esc** apenas se enciende.
2. Elige el pendrive. Si aparece dos veces, prefiere la entrada **UEFI**.
3. Si el equipo ignora el pendrive, entra a la BIOS/UEFI y **desactiva Secure Boot**.
   VasakOS todavía no firma su kernel para Secure Boot.

## 4. Probar antes de instalar

La ISO arranca en modo Live: el sistema completo corre desde el pendrive sin tocar el
disco. Aprovecha para verificar lo que suele fallar:

- **Wifi**: que aparezcan las redes y puedes conectarte.
- **Sonido**: que se escuche y que el control de volumen funcione.
- **Pantalla**: resolución correcta y brillo ajustable en notebooks.
- **Touchpad**: gestos y tap-to-click.
- **Suspensión**: cerrar y abrir la tapa.

Si algo de esto no anda en Live, tampoco va a andar instalado. Es el momento de
[reportarlo](/docs/user/report-bugs/).

## 5. Instalar

El instalador es [Calamares](https://calamares.io/) y se abre desde el icono del escritorio.

1. **Idioma y zona horaria.**
2. **Teclado**: pruébalo en el campo de prueba, sobre todo si usas distribución latinoamericana.
3. **Particionado**:
   - *Borrar disco*: la opción más simple, elimina todo lo que haya.
   - *Instalar junto a*: reduce una partición existente y usa el espacio liberado.
   - *Manual*: si sabes lo que haces. Como mínimo necesitas una partición raíz `/` de
     20 GB y, en equipos UEFI, una partición EFI de 512 MB montada en `/boot/efi`.
4. **Usuario y contraseña.** La contraseña del usuario también sirve para desbloquear el
   [llavero de claves](/state/).
5. **Resumen y confirmación.** Es el último punto en el que puedes volver atrás.

Al terminar, reinicia y quita el pendrive.

## 6. Después de instalar

```bash
sudo pacman -Syu
```

El repositorio de VasakOS ya viene configurado en la ISO, así que esa única orden actualiza
tanto el sistema base de Arch como las aplicaciones de VasakOS.

## Si algo sale mal

- El equipo arranca al sistema anterior y no ve VasakOS → la entrada de arranque no quedó
  registrada. Mira [solución de problemas](/docs/user/troubleshooting/).
- Se queda en una pantalla negra después del logo → puede ser el driver de video.
  Prueba agregando `nomodeset` a los parámetros del kernel para arrancar y desde ahí instalar
  el driver correcto.
- Cualquier otra cosa: [cómo reportar errores](/docs/user/report-bugs/).
