---
Title: "¡Gracias, Soplos Linux! Tu review, punto por punto"
tags:
  - "vasakos"
  - "review"
  - "comunidad"
  - "soplos-linux"
  - "vasak-installer"
  - "vasak file manager"
date: "2026-10-19"
img: "https://i.ytimg.com/vi/0_Qkd3Ewdns/maxresdefault.jpg"
description: "Soplos Linux probó VasakOS en VMware, Virt-Manager y Proxmox. Repasamos cada detalle que señaló: lo ya resuelto y lo que seguimos trabajando."
layout: post
---

Sergi, de **[Soplos Linux](https://www.youtube.com/watch?v=0_Qkd3Ewdns)**, le dedicó casi una hora a VasakOS: lo probó en VMware, Virt-Manager y Proxmox, repasó la instalación, el rendimiento y la interfaz, y fue anotando con honestidad lo que le gustó y lo que todavía hay que pulir. **Muchísimas gracias.** Ese tipo de prueba, detallada y bien intencionada, es exactamente lo que nos ayuda a mejorar.

<center><iframe class="aspect-video rounded-corner" src="https://www.youtube-nocookie.com/embed/0_Qkd3Ewdns" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center>

<br/>

## Lo que señalaste, y en qué andamos

Fuimos uno por uno. Marcamos lo que ya está resuelto y enlazamos el issue de lo que seguimos trabajando.

### Instalador

- 🔧 **Al elegir el idioma con el mouse no se marcaba** (había que dar Enter). En corrección: [vasak-installer#91](https://github.com/Vasak-OS/vasak-installer/issues/91).
- 🔧 **El teclado no tomaba el layout elegido en la sesión viva** (sí funcionaba ya instalado). Lo estamos viendo: [vasak-installer#92](https://github.com/Vasak-OS/vasak-installer/issues/92).
- 🔧 **El español de España aparecía sólo como «European Spanish»** y no salía al buscar «Spanish». Vamos a hacerlo encontrable: [vasak-installer#93](https://github.com/Vasak-OS/vasak-installer/issues/93).
- 🔧 **Falta particionado manual.** Es una función que queremos sumar y ya está anotada: [vasak-installer#85](https://github.com/Vasak-OS/vasak-installer/issues/85).
- 🔎 **Detecta 1080 pero no aplicaba la resolución nativa** en la sesión viva. Lo estamos revisando.

### Escritorio

- ✅ **Los widgets y applets no se cerraban al hacer clic fuera.** Resuelto: [vasak-desktop#262](https://github.com/Vasak-OS/vasak-desktop/issues/262).
- ✅ **El escritorio arrancaba con widgets en pantalla.** Ya no vienen por omisión: [vasak-desktop#259](https://github.com/Vasak-OS/vasak-desktop/issues/259).
- ✅ **El WebKit consumía de más** (unos 470–500 MB). Afinado para bajar el consumo: [vasak-settings#202](https://github.com/Vasak-OS/vasak-settings/issues/202) y [vasak-desktop#265](https://github.com/Vasak-OS/vasak-desktop/issues/265).

### Gestor de archivos

- ✅ **Las dos columnas volvían a aparecer y no se guardaba el cambio de vista.** El gestor ya conserva el estado de la interfaz: [vasak-file-manager#120](https://github.com/Vasak-OS/vasak-file-manager/issues/120).
- ✅ **Faltaban tamaños de ícono más grandes.** Sumamos el zoom de íconos (Ctrl +/−/0 y Ctrl+scroll): [vasak-file-manager#134](https://github.com/Vasak-OS/vasak-file-manager/issues/134).
- 🔎 **Algunos atajos del gestor** (Ctrl+T, Ctrl+W, Ctrl+Q) y la **claridad del panel de atajos** quedaron anotados; los estamos evaluando sobre el sistema de configuración de atajos ([vasak-settings#4](https://github.com/Vasak-OS/vasak-settings/issues/4)).

Y gracias por destacar lo que ya nos enorgullece: los **perfiles de AppArmor por aplicación**, la **cuenta de administrador separada**, el instalador propio con su selección de navegador y drivers, y el centro de control. Vamos por ese camino.

## Seguimos

Nos quedamos con cada punto. **Gracias de nuevo, Sergi** — y esperamos ese segundo video sobre personalización tanto como vos.
