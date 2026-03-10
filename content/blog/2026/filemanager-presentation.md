---
Title: "Vasak File Manager: un nuevo explorador de archivos para Vasak OS"
tags: [vasak os, vasak file manager, linux desktop, file manager, open source, rust, tauri, vuejs, linux desktop environment]
date: "2026-03-10"
img: "https://i.postimg.cc/9QN6TtXx/image.png"
---
Durante la migración de varios componentes de Vasak OS a Rust tomamos una decisión arquitectónica importante: unificar varios módulos del sistema en procesos compartidos para simplificar la comunicación interna del desktop.

Si bien esta decisión permitió avanzar más rápido en las primeras etapas del proyecto, con el tiempo comenzó a presentar algunas limitaciones, especialmente a la hora de **escalar funcionalidades complejas**.

Uno de los componentes más afectados fue el explorador de archivos.

El file manager original estaba integrado directamente dentro del desktop y funcionaba principalmente como un **visualizador básico de archivos**, lo que hacía difícil expandir sus capacidades sin impactar en la arquitectura general del sistema.

Por esta razón decidimos **separarlo completamente en una aplicación independiente**.

Hoy queremos mostrar una **versión preliminar del nuevo Vasak File Manager**, un explorador de archivos mucho más completo y preparado para evolucionar junto al sistema.

---

# Una nueva arquitectura

El nuevo explorador de archivos se encuentra en su propio repositorio:

https://github.com/Vasak-OS/vasak-file-manager

Mientras que el componente anterior fue removido del desktop principal:

https://github.com/Vasak-OS/vasak-desktop

Este cambio trae varias ventajas importantes:

- mayor independencia entre componentes del sistema
- arquitectura más escalable
- desarrollo más rápido de nuevas funcionalidades
- menor complejidad en el código del desktop

El nuevo **Vasak File Manager** está desarrollado utilizando:

- **Tauri**
- **VueJS**
- **TypeScript**

Esta combinación permite construir una aplicación moderna con una interfaz altamente reactiva, manteniendo al mismo tiempo una buena integración con el sistema.

Además, el explorador de archivos **se integra con el sistema de temas y la reactividad del desktop de Vasak OS**, lo que garantiza una experiencia visual consistente.

El proyecto toma como inspiración técnica a **Sigma File Manager**, adaptando su enfoque para integrarlo con el ecosistema de Vasak OS.

---

# Una interfaz completamente renovada

Uno de los objetivos principales del nuevo explorador fue mejorar la experiencia visual y de navegación.

Actualmente el file manager incluye dos modos de visualización:

## Vista en lista

Ideal para trabajar con grandes cantidades de archivos y visualizar información de forma ordenada.

![Vista lista](https://i.postimg.cc/J0VmX3xz/image.png)

## Vista en grilla

Pensada para navegación visual, especialmente útil cuando se trabaja con imágenes o contenido multimedia.

![Vista grilla](https://i.postimg.cc/rwnkj2jj/image.png)

Ambos modos comparten una estética más moderna y consistente con el resto del desktop.

---

# Sistema de pestañas

El nuevo explorador incluye **un sistema completo de tabs**, similar al de los navegadores modernos.

Entre las funcionalidades disponibles:

- abrir carpetas en nuevas pestañas
- duplicar pestañas
- reorganizar pestañas mediante drag & drop
- abrir directorios en nuevas tabs desde el menú contextual

Esto permite trabajar con múltiples ubicaciones del sistema de archivos de forma mucho más eficiente.

![Tabs](https://i.postimg.cc/QNQZPTS5/image.png)

---

# Búsqueda integrada

El explorador incluye **búsqueda en tiempo real** dentro del directorio actual.

A medida que el usuario escribe, los resultados se actualizan automáticamente, lo que permite localizar archivos rápidamente sin interrumpir el flujo de trabajo.

---

# Preview de archivos

Una de las mejoras más visibles es la incorporación de **preview de archivos en la barra lateral**.

Actualmente soporta:

- imágenes
- videos

Esto permite inspeccionar archivos sin necesidad de abrir aplicaciones externas.

![Preview](https://i.postimg.cc/9QN6TtXx/image.png)

---

# Funcionalidades disponibles

Además de las mejoras principales, el nuevo explorador ya incluye varias capacidades avanzadas:

- drag & drop de archivos
- operaciones de archivo (copiar, mover, eliminar)
- soporte para **split view**
- barra de rutas con breadcrumbs
- thumbnails automáticos
- operaciones asíncronas
- selección múltiple
- menú contextual
- atajos de teclado

Estas funcionalidades hacen que el explorador sea mucho más potente que la implementación anterior.

---

# Un proyecto en evolución

Si bien el nuevo **Vasak File Manager** ya es funcional, todavía se encuentra en una etapa temprana de desarrollo.

Queremos compartir esta versión preliminar para mostrar el progreso del proyecto y comenzar a construir una base sólida para el futuro del sistema.

Nuestro objetivo es seguir mejorando la experiencia del usuario y ofrecer herramientas cada vez más completas dentro del ecosistema de Vasak OS.

---

# Probar el proyecto

El desarrollo del nuevo explorador de archivos es completamente abierto.

* Repositorio del proyecto: https://github.com/Vasak-OS/vasak-file-manager

Si te interesa el desarrollo de Vasak OS, te invitamos a seguir el repositorio y participar del proyecto.