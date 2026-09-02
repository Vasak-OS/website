---
title: "Instalar VasakOS"
description: "Guía completa para instalar VasakOS: crear el USB booteable, arrancar en modo Live, particionar e instalar junto a otro sistema."
weight: 5
---

Esta guía cubre la instalación desde cero. Si sólo querés las aplicaciones de VasakOS sobre
un Arch Linux que ya tenés, saltá a [repositorio de paquetes](/docs/user/repository/).

## Antes de empezar

- **Hacé una copia de seguridad.** Cualquier instalación puede tocar la tabla de
  particiones. VasakOS está en Beta; tratalo como tal.
- Necesitás un pendrive de 8 GB o más y un disco de al menos **20 GiB**.
- **La conexión a internet no es opcional y tiene que aguantar toda la instalación.**
  VasakOS no se copia desde el pendrive: se descarga de los repositorios mientras se
  instala. Si la conexión se corta a la mitad, la instalación se interrumpe y hay que
  empezar de nuevo. A cambio, el sistema queda con los paquetes del día, no con los que
  tenía la ISO cuando se armó.
- Calculá entre **quince minutos y una hora**, según la conexión.
- Revisá los [requisitos](/downloads/) del sistema.

## 1. Descargar y verificar la ISO

Bajá la imagen desde [Descargas](/downloads/) y verificá el checksum antes de escribirla:

```bash
sha256sum vasakos-2026.08.19-x86_64.iso
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
sudo dd if=vasakos-2026.08.19-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
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

El instalador es **vasak-installer**, y se abre desde el icono del escritorio. Reemplazó a
Calamares: por dentro es una interfaz sobre
[archinstall](https://wiki.archlinux.org/title/Archinstall), y todos los pasos se responden
en la ventana.

Son diez pantallas y se puede volver atrás en cualquiera hasta la última.

1. **Bienvenida.**
2. **Conexión.** Comprueba que haya una ruta a internet y te dice cuánto se va a descargar.
   Si no hay, conectate desde el icono de red del panel y volvé a comprobar.
3. **Región.** Idioma, zona horaria y formato de fecha y números.
4. **Teclado.** Probalo en el campo de prueba, sobre todo si usás distribución
   latinoamericana.
5. **Disco.** Es el paso que hay que leer con atención; está detallado abajo.
6. **Tu cuenta.** Nombre completo, nombre de usuario, contraseña y nombre del equipo. El
   nombre de usuario es el de tu carpeta personal y **no se puede cambiar después**. Tu
   contraseña también es la que desbloquea el [llavero de claves](/state/).
7. **Complementos.** Qué más instalar; está detallado abajo.
8. **Resumen.** Todo lo elegido en una pantalla. Es el último punto en el que podés volver
   atrás: al confirmar, el disco se borra.
9. **Instalación.** Entre quince minutos y una hora. No apagues el equipo ni cierres la
   ventana.
10. **Fin.** Reiniciá y quitá el pendrive.

### El paso del disco

> **Hoy la única opción es borrar el disco entero.** No hay instalación junto a otro
> sistema ni particionado manual. Si en ese equipo tenés Windows u otra distribución que
> querés conservar, **este instalador no es el camino**: hacé copia de todo antes de seguir.

El instalador te muestra los discos que encuentra y descarta los que no sirven: el que está
montado —normalmente el pendrive del que arrancaste— y los de menos de 20 GiB. Elegido el
disco, quedan tres decisiones:

- **Sistema de archivos.**

  | | Cuándo |
  | --- | --- |
  | **Btrfs** | Recomendado. Comprime al escribir, permite instantáneas y separa el hogar y los registros en subvolúmenes. |
  | **Ext4** | El más conocido y el más simple. Sin instantáneas ni compresión. |
  | **XFS** | Rápido con archivos grandes. Sin instantáneas. |

- **Cifrado del disco.** Cifra el sistema entero con LUKS y te pide una frase en cada
  arranque, antes de la pantalla de inicio de sesión.

  > Si perdés la frase, perdés los datos. No hay copia, no hay pregunta de seguridad y no
  > hay forma de recuperarlo.

- **zram como memoria de intercambio.** Comprime la memoria en vez de reservar espacio en
  el disco. Recomendado, sobre todo con poca memoria.

Antes de aplicar nada, el instalador muestra las particiones que va a crear, con sus
tamaños, sus opciones de montaje y —en Btrfs— sus subvolúmenes.

### El paso de los complementos

Todo lo de esta pantalla es opcional y se puede instalar después. Lo que viene marcado es
lo que la mayoría necesita; nada viene marcado «por las dudas».

- **Navegador**: Firefox, Chromium o Brave. Se elige uno solo, y también podés elegir
  ninguno. Firefox viene marcado porque es el que trae la ISO.
- **Impresión y escaneo**: soporte de impresoras y de escáneres.
- **Controladores**: NVIDIA propietario o libre, Vulkan de AMD o de Intel, y wifi Broadcom.
  El instalador mira qué hardware tenés y marca los que corresponden; podés desmarcarlos si
  preferís los libres.
- **Extras**: suite ofimática, herramientas de desarrollo y paquetes para juegos.

Ninguno de estos es necesario para que el sistema arranque, así que si uno falla al
instalarse el resto de la instalación sigue.

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
