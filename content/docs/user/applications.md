---
title: "Las aplicaciones del sistema"
weight: 20
description: "Qué trae VasakOS: archivos, terminal, imágenes, música, capturas, monitor del sistema, ajustes y el llavero de claves."
---

VasakOS trae sus propias aplicaciones, escritas para este sistema. Todas comparten el mismo
aspecto, el mismo menú del clic derecho y el mismo tema, y todas siguen el pack de iconos
que tengas puesto.

Ninguna es obligatoria: se pueden desinstalar con `pacman` y reemplazar por las que quieras.

## Archivos

`vasak-file-manager` · El gestor de archivos.

Arrastrar y soltar funciona también **hacia afuera** de la ventana, hacia otras
aplicaciones, que en Wayland no es gratis: lo hace posible uno de los
[plugins del sistema](/docs/devs/plugins/#drag-and-drop-wayland).

## Terminal

`vasak-terminal` · La terminal, con pestañas.

## Imágenes

`vasak-gallery` · El visor de imágenes y videos.

## Música

`vasak-resonance` · El reproductor de audio. Lo que esté sonando aparece además en el
widget de música del centro de control, con sus controles.

## Capturas

`vasak-shot` · Las capturas de pantalla. **Captura primero y muestra el selector después**,
así lo que quedó en pantalla es lo que había cuando apretaste la tecla y no lo que quedó
después de que se abriera una interfaz.

| Cómo | Qué hace |
| --- | --- |
| `Impr Pant` | Abre el selector: arrastrá una zona, o apretá Intro para toda la pantalla. |
| `Mayús+Impr Pant` | Guarda toda la pantalla directo, sin interfaz. |
| `vasak-shot --pantalla` | Guarda y copia toda la pantalla, imprime la ruta y sale. |

En el selector: **Intro** guarda y copia, **Ctrl+C** copia sin guardar, **Esc** cancela.

Las capturas van a `~/Imágenes/Capturas`, o su equivalente en el idioma de la instalación:
la carpeta la decide `user-dirs.dirs` y no es «Pictures» en todas las máquinas.

## Monitor del sistema

`vasak-monitor` · Cinco pantallas: **Recursos**, **Aplicaciones**, **Servicios**,
**Limpieza** y **Registros**.

La de Registros es la más útil cuando algo falla: tiene un selector de aplicación y muestra
lo que dejó escrito cada una, sin escribir un comando. Es lo mismo que
[`journalctl -t`](/docs/user/logs/), con el filtro puesto por vos.

## Ajustes

`vasak-settings` · La configuración del sistema: apariencia, fondos, iconos, panel,
pantallas, audio, red, Wi-Fi, Bluetooth, VPN, usuarios, idioma y teclado, fecha y hora,
energía, brillo, atajos, pantalla de inicio de sesión, y las opciones del compositor
—ventanas, espacios de trabajo, efectos, plugins y autoinicio—.

## Llavero de claves

`vasak-keyring` · Guarda contraseñas y secretos de las aplicaciones, cifrado con AES-256-GCM
y Argon2id. Se desbloquea solo al iniciar sesión, con tu misma contraseña.

## Teléfono

`vasak-connect` · Usá las aplicaciones de tu celular Android como ventanas de VasakOS. No es
un escritorio de Android dentro de una ventana: cada aplicación se abre en su **propia
ventana nativa**, junto a las del sistema.

Se configura en **Ajustes → Teléfonos**.

## Lo que no se ve

Parte del sistema no son ventanas sino servicios que arrancan con la sesión:

| Servicio | Qué hace |
| --- | --- |
| `vasak-flare-daemon` | Recibe las notificaciones y guarda el historial que ves en el centro de control. |
| `vasak-permissions` | Los permisos que piden las aplicaciones: cámara, micrófono, pantalla, cuentas. |
| `polkit-vasak-agent` | El diálogo que pide tu contraseña cuando algo necesita permisos de administrador. |
| `vasak-accounts` | Las cuentas en línea. |
| `vasak-press-and-hold` | Mantener una tecla para elegir un carácter acentuado. |
| `vasak-session-manager` | La pantalla de inicio de sesión y la de bloqueo. |

Cómo leer lo que escriben, y cómo comprobar que están corriendo, está en
[logs y diagnóstico](/docs/user/logs/#los-servicios-de-la-sesión).
