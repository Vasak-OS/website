---
Title: "35 años de Linux: el hobby que cambió el mundo"
tags: ["linux", "aniversario", "kernel", "torvalds", "historia", "open-source"]
date: "2026-08-25"
img: "/img/posts/linux-35.svg"
description: "35 años de Linux: el 25/08/1991 Linus anunció su hobby. Hoy impulsa el 96 % de servidores, Android y VasakOS."
weight: 10
layout: post
---

Hoy, 25 de agosto de 2026, se cumplen **35 años** desde que un estudiante de 21 años en Helsinki escribió en comp.os.minix:

> *Hello everybody out there using minix-*
>
> *I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones.*

Ese mensaje, firmado por **Linus Benedict Torvalds**, era el anuncio de lo que hoy llamamos Linux. Nadie —ni él— imaginaba que ese «hobby» terminaría impulsando:

- **El 96 % de los servidores web** del planeta
- **Todos los smartphones Android** (más de 3 000 millones de dispositivos)
- **El 100 % de los supercomputadores** del TOP500
- **La Estación Espacial Internacional**, los rovers de Marte y la infraestructura crítica de bancos, bolsas y gobiernos
- **VasakOS**, nuestro escritorio sobre Arch Linux con Wayland y aplicaciones nativas en Rust

## De «solo un hobby» a infraestructura mundial

La genialidad de Torvalds no fue solo escribir un kernel, sino **elegir la GPLv2** y abrir el desarrollo a cualquiera. Ese decisión convirtió a Linux en el primer proyecto de software libre verdaderamente global: miles de desarrolladores de empresas competidoras (Intel, AMD, Red Hat, Google, IBM, Samsung…) colaboran cada día en el mismo código.

En 2026 el kernel supera los **36 millones de líneas** y recibe contribuciones de más de **2 000 desarrolladores por ciclo de release**. Cada versión —ahora cada 9-10 semanas— añade soporte para hardware nuevo, sistemas de archivos, arquitecturas y mejoras de rendimiento que benefician a todo el ecosistema.

## Linux y VasakOS: la base sobre la que construimos

VasakOS nace **sobre Arch Linux**, que a su vez vive sobre el kernel de Linux. Nuestra decisión de usar Arch como base no es casual:

- **Rolling release**: el kernel nuevo llega a nuestros usuarios días después de su publicación upstream, sin esperas de seis meses.
- **Upstream first**: aportamos parches al kernel y a los subsistemas (drm, input, usb…) en lugar de mantener forks privados.
- **Wayland nativo**: el compositor Wayfire corre sobre DRM/KMS, la API moderna del kernel para gráficos, sin capas X11 de por medio.
- **Hardware enablement**: desde controladores de GPU hasta sensores de portátiles, todo viene del kernel.

Cuando instalas VasakOS, **estás instalando Linux**. El mismo kernel que usa Google en sus servidores, NASA en sus sondas y Steam Deck en tu salón.

## Un «gracias» que no cabe en un commit

A Linus, a los **mantenedores de subsistemas** (Greg KH, David Airlie, Christian Brauner, Ted Ts'o, Jens Axboe…), a los **desarrolladores de drivers** que hacen que tu Wi-Fi, tu GPU y tu impresora funcionen, a los **equipos de seguridad** (KSPP, Kernel Self Protection Project) y a **cada persona que alguna vez reportó un bug, probó un rc o escribió una línea de documentación**.

Sin vosotros, VasakOS no existiría.

---

**¿Cuál fue tu primer contacto con Linux?** Cuéntanos en [Telegram](https://t.me/VasakOS) o en [GitHub](https://github.com/Vasak-OS). Y si quieres celebrarlo contribuyendo, nuestra [guía de inicio](/docs/devs/contribution/) te espera.

![Linus Torvalds en 1991](/img/posts/linux-35.jpg)
*Linus Torvalds, 1991. Foto: dominio público / Linux Foundation.*