---
Title: "Hace 35 años se lanzó Linux 0.02: el kernel que hizo posible VasakOS"
seotitle: "Aniversario lanzamiento Linux: 35 años del kernel | VasakOS"
tags: ["linux", "aniversario", "kernel", "vasakos", "open-source", "arch-linux", "wayland"]
date: "2026-10-15"
img: "/img/posts/linux-35.svg"
description: "Este mes se cumplen 35 años del lanzamiento oficial de Linux (0.02, 5 de octubre de 1991). Te contamos cómo ese kernel hizo posible VasakOS sobre Arch Linux."
weight: 10
layout: post
---

Este mes de octubre se cumplen **35 años del lanzamiento oficial de Linux**. No hablamos del anuncio —esa historia ya la contamos en [agosto](/blog/2026/08/linux-35-aniversario/)—, sino del momento en que Linux pasó de ser una promesa a ser algo que podías **descargar, compilar y usar**.

La cronología es corta pero decisiva:

- **25 de agosto de 1991**: Linus Benedict Torvalds, estudiante de 21 años en Helsinki, anuncia en `comp.os.minix` que está haciendo un sistema operativo libre *"solo como hobby"*.
- **17 de septiembre de 1991**: aparece la versión **0.01**, subida a un servidor FTP de la universidad. Apenas unos cientos de personas la descargan, ni siquiera tenía un anuncio formal.
- **5 de octubre de 1991**: Linus publica la versión **0.02**. Esta vez sí hay anuncio, con notas, novedades y una invitación clara a probarla y reportar errores. La historia lo considera el **primer lanzamiento oficial y público de Linux**.

Tres fechas, tres pasos: el anuncio, el código suelto y, finalmente, **un lanzamiento de verdad**.

## Octubre de 1991: cuando Linux se pudo probar por primera vez

La 0.02 era diminuta para los estándares de hoy: corría solo en procesadores **386 con bus AT**, necesitaba Minix para compilarse y el propio Linus advertía que todavía le faltaban muchas cosas. Pero traía algo que la 0.01 no tenía: **la intención de construir comunidad**.

El mensaje del 5 de octubre no solo decía *"acá está el código"*. Decía *"pruébenlo, díganme qué anda mal, díganme qué les gustaría ver"*. Incluía un shell portado, utilidades básicas y soporte para más hardware. Era la primera vez que alguien ajeno a Helsinki podía bajar Linux y sentir que **estaba participando en algo**, no solo mirando.

Ese gesto —publicar temprano, pedir feedback, iterar en público— se convirtió en la cultura del kernel. Y 35 años después, sigue siendo nuestra cultura en VasakOS: si probaste la [Beta 1](/blog/2026/10/beta-1-lanzamiento/), ya sabés de qué hablamos.

## ¿Por qué Linux hizo posible VasakOS?

Porque VasakOS no es "compatible con Linux". **VasakOS *es* Linux**: un escritorio propio construido sobre el mismo kernel que nació en octubre de 1991. Sin cada una de estas decisiones de hace 35 años, nuestro proyecto no existiría:

- **El kernel libre**: Linus eligió la licencia **GPLv2**. Eso significa que cualquiera puede usar, estudiar, modificar y redistribuir el código. Nosotros lo usamos tal cual, sin pedir permiso ni pagar licencias.
- **El desarrollo abierto**: el kernel superó las **36 millones de líneas** con aportes de más de **2 000 desarrolladores por ciclo**. Cada versión —cada 9 o 10 semanas— trae soporte para hardware nuevo que nos llega gratis.
- **La base Arch Linux**: elegimos Arch porque es *rolling release*. Cuando el kernel nuevo sale upstream, llega a tus manos en días, no en seis meses. Podés ver [el estado del proyecto](/state/) para seguir ese ritmo.
- **Gráficos modernos con DRM/KMS**: nuestro compositor Wayfire corre sobre la API moderna del kernel para gráficos, sin capas X11 en el medio. Wayland nativo, directo al hardware.
- **Hardware que simplemente funciona**: Wi-Fi, GPU, sonido, Bluetooth, sensores de tu laptop. Todo eso lo escriben y mantienen los desarrolladores del kernel y proyectos como Mesa.
- **La pila completa sobre Linux**: **systemd** (arranque y servicios), **PipeWire** (audio y video), **Mesa** (gráficos 3D), **GTK4** (interfaz) y nuestras apps en **Rust + Tauri** con interfaces en **Vue.js** y **Tailwind CSS** corren sobre las llamadas al sistema que Linus empezó a implementar en 1991.

En resumen: cuando instalás VasakOS desde [/downloads/](/downloads/), estás instalando al descendiente directo de aquella 0.02. El mismo kernel que hoy impulsa el **96 % de los servidores web**, el **100 % del TOP500** de supercomputadoras y los más de 3 000 millones de dispositivos Android.

## Gracias a quienes lo hicieron posible

A **Linus Torvalds** y a los mantenedores del kernel que sostienen el proyecto desde hace décadas. A los equipos de **Arch Linux**, **Wayfire**, **Tauri**, **Vue.js**, **Tailwind CSS**, **WirePlumber**, **systemd**, **Mesa** y **GTK**, cuyo trabajo upstream aprovechamos todos los días.

Y a nuestra propia gente: al **equipo de VasakOS** y a la **comunidad** que prueba ISOs, reporta bugs con logs completos, traduce textos, escribe documentación y responde dudas en el grupo. Cada reporte bien hecho es heredero directo de aquel *"pruébenlo y cuéntenme"* de octubre de 1991.

## Sumate a la historia

La mejor forma de celebrar este aniversario es haciendo lo mismo que Linus pidió hace 35 años: **probar, opinar y construir**.

- **Probá y reportá**: bajá la Beta, usala y contanos qué se rompe en [GitHub](https://github.com/Vasak-OS).
- **Escribí código**: mirá nuestra [guía de contribución](/docs/devs/contribution/) y elegí un issue marcado como `good-first-issue`.
- **Traducí, documentá, diseñá**: no todo es Rust. La documentación en [/docs/](/docs/) y las traducciones necesitan manos.
- **Conversá con nosotros**: estamos en [Telegram](https://t.me/VasakOS), donde la comunidad comparte capturas, dudas e ideas.

Y gracias a quienes sostienen el proyecto con su aporte en [/donate/](/donate/): cada ayuda mantiene vivo este trabajo.

---

**¿Cuál fue tu primer contacto con Linux?** ¿Un Ubuntu en un CD, un servidor, una Raspberry, Android sin saberlo, o directamente VasakOS? Contanos en [Telegram](https://t.me/VasakOS) o en [GitHub](https://github.com/Vasak-OS). Nos encanta leer esas historias.
