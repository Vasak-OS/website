---
title: "Instalar VasakOS"
description: "Guía completa para instalar VasakOS: crear el USB booteable, arrancar en modo Live, particionar e instalar junto a otro sistema."
weight: 5
---

Esta guía cubre la instalación desde cero. Si sólo querés las aplicaciones de VasakOS sobre
un Arch Linux que ya tenés, saltá a [repositorio de paquetes](/docs/user/repository/).

## Antes de empezar

- **Hacé una copia de seguridad.** Cualquier instalación puede tocar la tabla de
  particiones. VasakOS está en Alpha; tratalo como tal.
- Necesitás un pendrive de 8 GB o más y una conexión a internet durante la instalación.
- Revisá los [requisitos](/downloads/) del sistema.

## 1. Descargar y verificar la ISO

Bajá la imagen desde [Descargas](/downloads/) y verificá el checksum antes de escribirla:

```bash
sha256sum vasakos-2026.06.14-x86_64.iso
```

El resultado tiene que coincidir carácter por carácter con el SHA256 publicado en la página
de descargas. Si no coincide, la descarga se cortó o el mirror está comprometido: bajala de
nuevo, preferentemente desde otro mirror.

## 2. Crear el USB booteable

### Con Ventoy (recomendado)

[Ventoy](https://www.ventoy.net/) se instala una sola vez en el pendrive y después las ISOs
se copian como archivos comunes. Podés tener varias distribuciones en el mismo pendrive y
no tenés que volver a formatearlo cada vez.

### Con `dd`

```bash
lsblk                       # identificá el pendrive: /dev/sdb, /dev/sdc…
sudo umount /dev/sdX*       # desmontá cualquier partición montada
sudo dd if=vasakos-2026.06.14-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
```

> `dd` no pregunta ni avisa. Si ponés el disco equivocado en `of=`, ese disco se pierde.
> Verificá dos veces con `lsblk` antes de ejecutarlo.

### Desde Windows

[Rufus](https://rufus.ie/) en modo DD, o [balenaEtcher](https://etcher.balena.io/).

## 3. Arrancar desde el USB

1. Entrá al menú de arranque del equipo. Según el fabricante suele ser **F12**, **F11**,
   **F9**, **F8** o **Esc** apenas se enciende.
2. Elegí el pendrive. Si aparece dos veces, preferí la entrada **UEFI**.
3. Si el equipo ignora el pendrive, entrá a la BIOS/UEFI y **desactivá Secure Boot**.
   VasakOS todavía no firma su kernel para Secure Boot.

## 4. Probar antes de instalar

La ISO arranca en modo Live: el sistema completo corre desde el pendrive sin tocar el
disco. Aprovechá para verificar lo que suele fallar:

- **Wifi**: que aparezcan las redes y podés conectarte.
- **Sonido**: que se escuche y que el control de volumen funcione.
- **Pantalla**: resolución correcta y brillo ajustable en notebooks.
- **Touchpad**: gestos y tap-to-click.
- **Suspensión**: cerrar y abrir la tapa.

Si algo de esto no anda en Live, tampoco va a andar instalado. Es el momento de
[reportarlo](/docs/user/report-bugs/).

## 5. Instalar

El instalador es [Calamares](https://calamares.io/) y se abre desde el icono del escritorio.

1. **Idioma y zona horaria.**
2. **Teclado**: probalo en el campo de prueba, sobre todo si usás distribución latinoamericana.
3. **Particionado**:
   - *Borrar disco*: la opción más simple, elimina todo lo que haya.
   - *Instalar junto a*: reduce una partición existente y usa el espacio liberado.
   - *Manual*: si sabés lo que hacés. Como mínimo necesitás una partición raíz `/` de
     20 GB y, en equipos UEFI, una partición EFI de 512 MB montada en `/boot/efi`.
4. **Usuario y contraseña.** La contraseña del usuario también sirve para desbloquear el
   [llavero de claves](/state/).
5. **Resumen y confirmación.** Es el último punto en el que podés volver atrás.

Al terminar, reiniciá y quitá el pendrive.

## 6. Después de instalar

```bash
sudo pacman -Syu
```

El repositorio de VasakOS ya viene configurado en la ISO, así que esa única orden actualiza
tanto el sistema base de Arch como las aplicaciones de VasakOS.

## Si algo sale mal

- El equipo arranca al sistema anterior y no ve VasakOS → la entrada de arranque no quedó
  registrada. Mirá [solución de problemas](/docs/user/troubleshooting/).
- Se queda en una pantalla negra después del logo → puede ser el driver de video.
  Probá agregando `nomodeset` a los parámetros del kernel para arrancar y desde ahí instalar
  el driver correcto.
- Cualquier otra cosa: [cómo reportar errores](/docs/user/report-bugs/).
