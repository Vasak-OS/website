---
title: "Documentación para desarrolladores"
description: "Cómo está construido VasakOS: la plantilla de aplicaciones, los plugins compartidos, la arquitectura del escritorio y cómo contribuir."
icon: "fa-solid fa-code"
weight: 2
---

Cómo está construido VasakOS y cómo trabajar sobre él.

Todas las aplicaciones tienen la misma forma: **Rust con Tauri 2** por debajo y **Vue 3 con
TypeScript** en la interfaz, sobre Wayland. Cada una vive en su propio repositorio dentro de
[github.com/Vasak-OS](https://github.com/Vasak-OS).

## Por dónde empezar

- **[vapp](/docs/devs/vapp/)** — la plantilla de la que arranca cualquier aplicación nueva,
  con los plugins ya enchufados y las decisiones que las aplicaciones reales aprendieron
  rompiéndose. Si vas a escribir una aplicación de VasakOS, empezá acá.
- **[Plugins de VasakOS](/docs/devs/plugins/)** — configuración, iconos, traducciones, menú
  contextual y registros. Es lo que comparten las aplicaciones y lo que hace que se sientan
  un solo sistema.
- **[vasak-desktop](/docs/devs/vasak-desktop/)** — el escritorio: panel, menú, notificaciones
  y widgets. Es la aplicación más grande y la que más se documentó.
- **[Guía de contribución](/docs/devs/contribution/)** — cómo se trabaja: ramas, commits y
  pull requests.

## Dos reglas que valen para todo el ecosistema

**Cada cambio va con tests, en el mismo commit.** Y si el repositorio tiene poca cobertura,
se suman algunos de lo que está alrededor.

**Todo texto que ve una persona va traducido.** No hay excepción para «esto es temporal».

## Y una biblioteca que ya no crece

[vue-libvasak](/docs/devs/vue-libvasak/) es la biblioteca de componentes Vue de la primera
época. Su repositorio está archivado, la usa una sola aplicación y de trece componentes usa
uno. Queda documentada como referencia para leer el código que todavía la importa; para
algo nuevo, no la agregues.
