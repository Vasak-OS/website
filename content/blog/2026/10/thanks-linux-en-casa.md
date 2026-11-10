---
Title: "¡Gracias, Linux en Casa! VasakOS en Virt-Manager, paso a paso"
tags:
  - "vasakos"
  - "review"
  - "comunidad"
  - "linux-en-casa"
  - "vasak-installer"
  - "vasak-desktop"
date: "2026-10-20"
img: "https://i.ytimg.com/vi/02CL5nXxwqU/hqdefault.jpg"
description: "Linux en Casa mostró cómo instalar VasakOS en Virt-Manager, incluso en equipos modestos. Le agradecemos la review y repasamos los detalles que marcó."
layout: post
---

En **[Linux en Casa](https://www.youtube.com/watch?v=02CL5nXxwqU)** se armaron de paciencia para mostrar, paso a paso, cómo instalar VasakOS en Virt-Manager —incluso en un equipo modesto— y dejaron documentados los ajustes que hoy hacen falta para virtualizarlo. **Gracias** por el trabajo de guiar a la gente que quiere probarlo en una máquina virtual: es justo lo que muchos necesitaban.

<center><iframe class="aspect-video rounded-corner" src="https://www.youtube-nocookie.com/embed/02CL5nXxwqU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center>

<br/>

## Lo que marcaste, y en qué andamos

- 🔧 **En la máquina virtual el cursor aparecía invertido y duplicado** (había que exportar a mano `WLR_NO_HARDWARE_CURSORS=1`). Queremos detectar el entorno virtual y hacerlo solo, para que ande sin tocar nada: [vasak-desktop-settings#15](https://github.com/Vasak-OS/vasak-desktop-settings/issues/15).
- 🔧 **El teclado arrancaba en inglés en la sesión viva** (lo ajustaste editando `wifier.ini`). En revisión: [vasak-installer#92](https://github.com/Vasak-OS/vasak-installer/issues/92).
- 🔧 **No permite particionado manual.** Está anotado como función a sumar: [vasak-installer#85](https://github.com/Vasak-OS/vasak-installer/issues/85).
- ✅ **Se sentía pesado** (Wayfire + WebKit). Afinamos el WebKit de las apps para bajar el consumo: [vasak-desktop#265](https://github.com/Vasak-OS/vasak-desktop/issues/265); seguimos mejorando el rendimiento.
- 🔧 **Los atajos había que leerlos del `wifier.ini`** y el salto entre escritorios no era obvio. Vamos a sumar atajos directos por número: [vasak-desktop-settings#14](https://github.com/Vasak-OS/vasak-desktop-settings/issues/14).

Como bien aclaraste, el tema del cursor es un efecto de la virtualización —en un equipo real no pasa— pero igual queremos que la experiencia en máquina virtual sea cómoda de entrada. Y gracias por resaltar las **aplicaciones nativas en Rust**, la selección de **navegador, drivers e impresoras** en el instalador y el aviso de la **cuenta de administrador**: son decisiones que cuidamos.

## Seguimos

Tu guía deja el camino allanado para quien quiera probarlo en una VM, y los ajustes que mostraste son exactamente los que queremos que dejen de ser necesarios. **Gracias de nuevo.**
