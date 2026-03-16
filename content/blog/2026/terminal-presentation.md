---
Title: "Vasak Terminal: una terminal moderna basada en Tauri para el ecosistema Vasak OS"
tags: [ vasak os,
    vasak terminal,
    linux terminal,
    tauri,
    vuejs,
    rust,
    xterm,
    arch linux,
    open source]
date: "2026-03-16"
img: "https://i.postimg.cc/dVgZx66s/photo-2026-03-16-11-54-57.jpg"
---

El ecosistema de **Vasak OS** continúa creciendo. Luego de presentar nuevas aplicaciones como el gestor de archivos, hoy queremos mostrar otro componente fundamental del sistema: **Vasak Terminal**.

Se trata de la terminal que acompañará al **Vasak Desktop**, diseñada para integrarse completamente con el entorno y ofrecer una experiencia moderna, simple y potente para usuarios de Linux.

Aunque todavía queda mucho por mejorar, queremos mostrar una **primera versión en estado BETA** de lo que será la terminal oficial del ecosistema Vasak OS.

---

## Una terminal pensada para integrarse con el sistema

Uno de los objetivos de Vasak OS es ofrecer **un ecosistema completo de aplicaciones** que funcionen de forma coherente entre sí.

Vasak Terminal sigue esa filosofía: no es simplemente una terminal más, sino una aplicación diseñada específicamente para integrarse con el entorno de escritorio.

Entre otras cosas, esto permite:

- Integración con el sistema de **temas del desktop**
- Soporte automático para **modo claro y oscuro**
- Comportamiento reactivo ante cambios visuales del sistema
- Uso del mismo **core del ecosistema (VAPP Core)** que utilizan otras aplicaciones como el file manager

Esto permite mantener una **experiencia visual consistente en todo el sistema**.

---

## Tecnologías utilizadas

**Vasak Terminal** forma parte de la nueva arquitectura del ecosistema Vasak OS basada en tecnologías modernas. La aplicación está construida con:

- **Tauri** para el framework de aplicación
- **Vue.js** para la interfaz
- **TypeScript** para la lógica de frontend
- **Rust** en el backend
- **xterm.js** para el renderizado de la terminal
- **pty en Rust** para la integración con el shell del sistema

El uso de **pty en Rust** permite interactuar directamente con el shell del sistema, ofreciendo una experiencia de terminal real mientras se mantiene la eficiencia y seguridad que ofrece Rust.

Este enfoque también facilita que el proyecto pueda evolucionar y escalar con el tiempo.

---

## Arquitectura modular

Siguiendo el mismo enfoque que utilizamos con otras aplicaciones del sistema, **Vasak Terminal se desarrolla en un repositorio independiente**. Esto permite:

- Evolucionar la aplicación sin afectar al desktop
- Facilitar la colaboración de nuevos desarrolladores
- ;antener una arquitectura modular dentro del ecosistema

Repositorio del proyecto:

https://github.com/Vasak-OS/vasak-terminal

---

## Funcionalidades actuales

Aunque todavía estamos en una etapa temprana de desarrollo, la terminal ya incluye algunas funcionalidades importantes. Entre ellas:

- **Soporte para múltiples tabs**
- Apertura de nuevas pestañas
- Cierre de pestañas
- Interfaz integrada con el diseño del desktop
- Soporte para **transparencia**
- Adaptación automática al **modo claro y oscuro**

Las pestañas funcionan con la misma lógica que otras aplicaciones del ecosistema, como el gestor de archivos, manteniendo una experiencia consistente en todo el sistema.

---

## Interfaz integrada con el ecosistema

Vasak Terminal comparte el mismo diseño general que otras aplicaciones del sistema. Incluye:

- Barra superior de navegación
- Sistema de tabs integrado
- Comportamiento reactivo ante cambios visuales del sistema
- Soporte para transparencia

El objetivo es que la terminal **no se sienta como una aplicación externa**, sino como una parte natural del entorno.

---

## Una terminal para todos los usuarios

Aunque la terminal es una herramienta tradicionalmente asociada a usuarios avanzados, el objetivo de Vasak Terminal es ofrecer una experiencia que funcione tanto para:

- Usuarios nuevos
- Usuarios intermedios
- Usuarios avanzados

La idea es que **los usuarios no necesiten instalar terminales externas**, ya que el propio ecosistema proveerá todas las herramientas necesarias. A medida que el desarrollo avance iremos incorporando nuevas funcionalidades que mejoren la productividad y amplíen las capacidades de la aplicación.

---

## Estado del proyecto

Actualmente **Vasak Terminal se encuentra en estado BETA**.

La aplicación será incluida en la **próxima ISO de Vasak OS**, la cual traerá varios cambios importantes en el ecosistema.

Todavía queda mucho trabajo por hacer, pero esta primera versión ya permite ver la dirección que está tomando el proyecto.

---

## Captura de pantalla

Aquí puedes ver una vista preliminar de Vasak Terminal funcionando dentro del entorno:

![Vasak Terminal Screenshot](https://i.postimg.cc/dVgZx66s/photo-2026-03-16-11-54-57.jpg)

---

## Un proyecto abierto a la comunidad

Como todos los componentes de Vasak OS, **Vasak Terminal es un proyecto open source**.Si te interesa colaborar con el desarrollo, podés hacerlo desde el repositorio oficial:

https://github.com/Vasak-OS/vasak-terminal

También estamos buscando colaboradores en diferentes áreas:

- Desarrollo
- UI/UX
- Testing
- Documentación

El proyecto todavía está en una etapa temprana y **toda colaboración puede marcar una gran diferencia**.

---

Seguimos construyendo el ecosistema de **VasakOS** paso a paso. Y esto recién empieza.