---
Title: "¡Gracias, Máquinas Linuxeras! Tomamos nota de tu review"
tags:
  - "vasakos"
  - "review"
  - "comunidad"
  - "maquinas-linuxeras"
  - "vasak-desktop"
  - "vasak-installer"
date: "2026-10-13"
img: "https://i.ytimg.com/vi/AAiNVjEG688/maxresdefault.jpg"
description: "Máquinas Linuxeras probó la beta de VasakOS. Le agradecemos la review y repasamos, uno por uno, los detalles que marcó y en qué andamos con cada uno."
layout: post
---

Ubaldo, de **[Máquinas Linuxeras](https://www.youtube.com/watch?v=AAiNVjEG688)**, se tomó el tiempo de probar la beta de VasakOS y de contarlo con el cuidado que lo caracteriza: cada observación sustentada, sin apuro. Desde acá, **gracias**. Una review así de atenta vale oro para un proyecto que recién empieza, y no vamos a dejar pasar ninguno de los detalles que marcaste.

<center><iframe class="aspect-video rounded-corner" src="https://www.youtube-nocookie.com/embed/AAiNVjEG688" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center>

<br/>

## Lo que marcaste, y en qué andamos

Repasamos cada punto del video. Los que ya están resueltos los dejamos marcados; los que todavía no, con su issue para que puedas seguirlos.

- 🔧 **El instalador no toma la opción del combo al elegirla con el mouse** (hay que apretar Enter, y si no te das cuenta queda la opción vieja). Lo estamos corrigiendo: [vasak-installer#91](https://github.com/Vasak-OS/vasak-installer/issues/91).
- 🔧 **No hay atajo directo `Super+1…4` para saltar entre escritorios** (hoy va con el mouse o con el overview). Vamos a sumar el salto directo por número: [vasak-desktop-settings#14](https://github.com/Vasak-OS/vasak-desktop-settings/issues/14).
- ✅ **El pendrive nuevo no se detectaba ni se montaba en el gestor de archivos.** Ya resuelto: [vasak-file-manager#44](https://github.com/Vasak-OS/vasak-file-manager/issues/44).
- ✅ **La tienda todavía no instalaba aplicaciones.** La tienda ya descubre, busca e instala (incluido el AUR): [vasak-store#5](https://github.com/Vasak-OS/vasak-store/issues/5) y [vasak-store#1](https://github.com/Vasak-OS/vasak-store/issues/1).
- ✅ **El WebKit consumía de más y se sentía pesado.** Afinamos el WebKit de las apps para bajar el consumo: [vasak-desktop#265](https://github.com/Vasak-OS/vasak-desktop/issues/265). Es una mejora que seguimos puliendo.

Y un par que ya funcionaban y nos alegró que destacaras: elegir la **salida de audio** (por ejemplo mandar todo al HDMI) ya estaba resuelto en [vasak-desktop#230](https://github.com/Vasak-OS/vasak-desktop/issues/230), y el centro de control, los temas de color y el registro de servicios para reportar errores son justamente por donde queremos que vaya el sistema.

## Seguimos

Todo esto está en beta y se está construyendo a la vista. Que alguien lo pruebe con la seriedad con la que vos lo hiciste es la mejor forma de que avance bien. **Gracias de nuevo, Ubaldo** — nos quedamos con la lista y a seguir.
