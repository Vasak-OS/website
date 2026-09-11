---
title: "Seguridad"
weight: 55
description: "Dónde reportar un problema de seguridad de VasakOS, qué protege el sistema y qué todavía no, y cómo llegan los arreglos."
---

Si encontraste un problema de seguridad en VasakOS, **no abras un issue público**. Un issue
deja el problema a la vista de cualquiera mientras todavía no hay arreglo.

## Dónde reportarlo

En el repositorio que corresponda, pestaña **Security** → **Report a vulnerability**. Está
habilitado en todos los repositorios activos de la organización.

Si no sabés cuál es el repositorio, mandalo a
[vasak-permissions](https://github.com/Vasak-OS/vasak-permissions/security) y lo derivamos.

Ayuda que el reporte traiga la versión del paquete (`pacman -Q <paquete>`), qué pasa y cómo
reproducirlo. Un exploit no hace falta.

## Qué pasa después

| | |
|---|---|
| Acuse de recibo | 72 horas hábiles |
| Primer diagnóstico | 7 días |
| Plazo antes de que publiques | 90 días, o antes si el arreglo sale antes |

Los 90 días son un pedido, no una imposición: si pasan y no resolvimos, publicá.

El arreglo sale como una actualización normal y el aviso se publica **después** de que el
paquete está en el repositorio. `vasak-update` comprueba una vez por día y al iniciar sesión,
así que llega dentro de las veinticuatro horas a un equipo encendido.

Con un límite que conviene saber: **el aviso no distingue todavía una actualización de
seguridad de una cualquiera.** La base de paquetes de pacman no tiene ningún campo de
seguridad. Quien pospone las actualizaciones pospone también éstas sin enterarse de que son
distintas.

## Qué protege VasakOS, y qué todavía no

El confinamiento real lo pone AppArmor, que es independiente de cómo se lance el programa. Un
AppImage no puede leer tus claves de SSH ni de GPG, ni el llavero, ni los tokens guardados.
Todo lo que se bloquea se puede desbloquear, desde el aviso o desde Configuración.

Lo que **todavía tiene puerta de al lado**, dicho sin adornos:

- **Capturar la pantalla sin pasar por el portal.** El diálogo pregunta, pero un cliente de
  Wayland no está obligado a usarlo.
- **Cámara y micrófono por PipeWire.** El permiso se pregunta y se anota, y un programa puede
  pedirle el nodo a PipeWire igual.
- **La mayoría de los perfiles del sistema están en modo aviso**, no bloqueando: anotan lo
  que habrían impedido.

Y una que no es un agujero pero cambia la superficie: VasakOS **todavía no firma su
arranque**, así que hoy se instala con Secure Boot desactivado.

## Los documentos

- [Política de seguridad](https://github.com/Vasak-OS/.github/blob/main/SECURITY.md) — cómo
  reportar, qué entra y qué no, qué versiones se sostienen.
- [Modelo de amenazas](https://github.com/Vasak-OS/.github/blob/main/THREAT-MODEL.md) — qué
  hay para proteger, de dónde puede venir el problema, y qué queda explícitamente afuera.
- [Proceso de aviso](https://github.com/Vasak-OS/.github/blob/main/AVISOS.md) — qué pasa entre
  que un reporte se confirma y que quien ya instaló está a salvo.
