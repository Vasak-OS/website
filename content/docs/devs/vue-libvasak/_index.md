---
title: "vue-libvasak"
description: "Biblioteca de componentes Vue de VasakOS: qué trae, quién la usa hoy y por qué ya no se le suman componentes."
icon: "fa-brands fa-vuejs"
weight: 3
---

Una biblioteca de componentes Vue: botones, tarjetas, controles de formulario y el marco de
ventana.

> **El repositorio está archivado desde febrero de 2026 y no recibe cambios.** La versión
> publicada es la `0.2.3` y no va a haber otra.
>
> Hoy la usa **una sola** aplicación, `vasak-desktop`, y de los trece componentes usa
> **uno**: `WindowFrame`. Lo que unifica el aspecto del resto del sistema no es esta
> biblioteca sino los [plugins de VasakOS](/docs/devs/plugins/) —los iconos, los temas y la
> configuración compartida—, más la plantilla [vapp](/docs/devs/vapp/), que es de donde
> arranca cualquier aplicación nueva.

Estas páginas quedan como referencia: sirven para leer el código que todavía la usa, no
para empezar algo nuevo. **Si estás escribiendo una aplicación de VasakOS, no la agregues.**

## Lo que trae

| Componente | Para qué |
| --- | --- |
| [ActionButton](/docs/devs/vue-libvasak/action-button/) | Botón de acción con variantes. |
| [ConfigSection](/docs/devs/vue-libvasak/config-section/) | Bloque de una pantalla de ajustes. |
| [DeviceCard](/docs/devs/vue-libvasak/device-card/) | Tarjeta de un dispositivo. |
| [FormGroup](/docs/devs/vue-libvasak/form-group/) | Etiqueta y campo de un formulario. |
| [ListCard](/docs/devs/vue-libvasak/list-card/) | Fila de una lista. |
| [SideBar](/docs/devs/vue-libvasak/side-bar/) · [SideButton](/docs/devs/vue-libvasak/side-button/) | Barra lateral y sus botones. |
| [SliderControl](/docs/devs/vue-libvasak/slider-control/) | Deslizador con etiqueta. |
| [SwitchToggle](/docs/devs/vue-libvasak/switch-toggle/) · [ToggleControl](/docs/devs/vue-libvasak/toggle-control/) | Interruptores. |
| [TrayIconButton](/docs/devs/vue-libvasak/tray-icon-button/) | Icono de la bandeja del panel. |
| [WindowFrame](/docs/devs/vue-libvasak/windowframe/) | Marco de ventana. El único que sigue en uso. |

También exporta `TopBar`, que nunca se documentó y no se usa en ninguna aplicación.
