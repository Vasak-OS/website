---
Title: "Estado del proyecto"
seotitle: "Estado de VasakOS: qué funciona hoy y qué falta | VasakOS"
description: "Estado real de cada componente de VasakOS: escritorio, aplicaciones, servicios e instalador, con su versión publicada y qué falta para considerarlo estable."
img: "/img/posts/roadmap.svg"
type: state
date: "2026-08-10"
lastmod: "2026-08-10"
tags: [estado, roadmap, vasakos, beta, desarrollo]
---

VasakOS está en **Beta**. Esa palabra significa cosas distintas en cada proyecto, así que
acá está lo que significa en este: el sistema arranca, se instala y se usa a diario, con
las funciones que planeamos ya completas. Lo que queda es pulir errores, y todavía puede
haber cambios que rompan compatibilidad entre versiones.

Esta página se actualiza con cada release. Si algo no está listado, todavía no existe.

## Qué se puede hacer hoy

- Instalar el sistema en disco con Calamares, junto a otro sistema o solo.
- Usar el escritorio a diario: archivos, terminal, navegador, reproducir audio y ver imágenes.
- Configurar red, sonido, brillo, fecha y hora, usuarios y apariencia desde Ajustes.
- Recibir actualizaciones por `pacman` desde el repositorio oficial de VasakOS.

## Qué todavía no

- **Cuentas en línea**: el demonio existe, pero ninguna aplicación lo usa todavía.
- **Traducciones**: el sistema está en español; el soporte multiidioma está a medio camino
  y algunas aplicaciones no encuentran sus traducciones cuando están instaladas.
- **Suite ofimática y multimedia propias**: se usan las aplicaciones de siempre del ecosistema Linux.
- **Soporte de hardware exótico**: al ser Wayland puro, algunas configuraciones de NVIDIA
  con drivers propietarios pueden necesitar ajustes manuales.

## Cómo leemos cada estado

| Estado | Qué significa |
| --- | --- |
| **Estable** | Funciona y no esperamos cambios que rompan nada. |
| **Beta** | Completo en funciones, todavía puliendo errores. |
| **Alpha** | Usable, con funciones faltantes y cambios frecuentes. |
| **En desarrollo** | Existe el código, todavía no la experiencia de usuario. |
| **Planificado** | Decidido, sin escribir. |

## Reportar algo

Si encontrás un problema, el reporte más útil incluye el modelo del equipo, qué esperabas
que pasara y los logs. La guía está en [reportar errores](/docs/user/reporte-errores/), y
el seguimiento se hace en [GitHub](https://github.com/Vasak-OS).
