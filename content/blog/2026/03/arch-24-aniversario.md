---
Title: "24 años de Arch Linux: simple, rolling, nuestra casa"
tags: ["arch-linux", "aniversario", "rolling-release", "pacman", "aur", "historia"]
date: "2026-03-11"
img: "/img/posts/arch-24.svg"
description: "24 años de Arch: el 11/03/2002 salió Arch 0.1 Homer. Su filosofía KISS y rolling release son la base de VasakOS."
weight: 10
layout: post
---

Hoy, 11 de marzo de 2026, se cumplen **24 años** del lanzamiento de **Arch Linux 0.1 «Homer»**. Lo anunció Judd Vinet en la lista de correo con una frase que resume todo:

> *Arch Linux is a lightweight and flexible Linux distribution that tries to Keep It Simple.*

Veinticuatro años después, esa promesa —**Keep It Simple, Stupid (KISS)**— sigue siendo el faro que guía cada decisión del proyecto. Y es la razón por la que **VasakOS existe sobre Arch**.

## Lo que Arch nos dio (y nadie más)

| Característica | Qué significa para VasakOS |
|----------------|----------------------------|
| **Rolling release real** | El kernel, mesa, wayland, pipewire, rust… llegan días después de upstream. Sin congelaciones de seis meses. |
| **Pacman + makepkg** | Gestión de paquetes binarios *y* compilación desde fuente con un mismo herramienta. Nuestros PKGBUILDs viven en `PKGBUILDS/`. |
| **AUR (Arch User Repository)** | El mayor repositorio comunitario del mundo. Si falta algo, alguien ya lo empaquetó. |
| **Sin capas de abstracción innecesarias** | `/etc` es `/etc`, systemd es systemd, el kernel es el kernel. Nada de overlays que ocultan lo que pasa. |
| **Comunidad técnica** | El foro, la wiki y IRC/Matrix son referencias de calidad, no solo «cómo instalar X». |

## De Judd a Levente: la continuidad

Judd Vinet fundó Arch en 2002. En 2007 pasó el testigo a **Aaron Griffin**, y desde 2020 el *lead developer* es **Levente Polyak**. En todo ese tiempo, **la filosofía no cambió**: el usuario decide, el sistema no impone.

Esa estabilidad ideológica es lo que permite a proyectos como VasakOS construir **sobre una base predecible**. Sabemos que `pacman -Syu` mañana seguirá funcionando igual que hoy, y que los paquetes base no traerán sorpresas.

## VasakOS = Arch + escritorio Wayland + apps Rust

No ocultamos que somos Arch. Al contrario: **queremos que se note**.

- Nuestro instalador añade el repositorio de VasakOS y el de Arch, y listo.
- Nuestros paquetes (`vasak-desktop`, `vasak-terminal`, `vasak-file-manager`…) se construyen con `makepkg` y se firman con la misma infraestructura.
- Las actualizaciones de Arch (kernel, glibc, systemd…) llegan a VasakOS **el mismo día**.
- La wiki de Arch es *nuestra* wiki para todo lo que no sea específico de nuestro escritorio.

## El futuro: 24 más (al menos)

Arch no tiene «versiones» ni «ciclos de vida». Mientras haya gente que valore la simplicidad, la transparencia y el control, Arch seguirá ahí. Y VasakOS con ella.

**Gracias a Judd, a Aaron, a Levente, a los *Trusted Users* del AUR, a los mantenedores de `[core]`, `[extra]`, `[community]`, a los autores de la Wiki y a cada usuario que alguna vez leyó `man pacman` antes de preguntar.**

---

**¿Cuál fue tu primer `pacman -S` memorable?** Cuéntanos en [Telegram](https://t.me/VasakOS) o en [GitHub](https://github.com/Vasak-OS). Y si quieres ayudarnos a empaquetar más cosas para VasakOS, la [guía de empaquetado](/docs/devs/contribution/#empaquetado) te espera.

![Arch Linux 0.1 Homer](/img/posts/arch-24.jpg)
*Arch Linux 0.1 «Homer», 11 de marzo de 2002. Captura de archivo.*