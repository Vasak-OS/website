---
title: "Preguntas frecuentes"
seotitle: "Preguntas frecuentes sobre VasakOS | VasakOS"
description: "Requisitos, compatibilidad, Wayland, personalización, actualizaciones y hardware: las preguntas más comunes sobre VasakOS, respondidas."
weight: 20
layout: faq

intro: |
  Si no encontrás tu respuesta acá, preguntá en
  [Telegram](https://t.me/VasakOS) o abrí un issue en
  [GitHub](https://github.com/Vasak-OS).

# Preguntas y respuestas. Viven en el front matter para que la página y los
# datos estructurados (FAQPage) salgan de la misma fuente y no puedan
# contradecirse.
faq:
  - q: "¿Qué es VasakOS exactamente?"
    a: |
      Una distribución de GNU/Linux basada en **Arch Linux** con un escritorio propio. No es
      Arch con otro tema: el panel, el gestor de archivos, la terminal, los ajustes, la
      galería, el reproductor de audio, el llavero de claves y el demonio de notificaciones
      son aplicaciones escritas para este sistema, en Rust con Tauri y Vue.

  - q: "¿Está listo para usarlo todos los días?"
    a: |
      Está en **Alpha**. Se instala, se usa y se actualiza, pero hay funciones incompletas y
      cambios que rompen compatibilidad entre versiones. Sirve perfectamente para probarlo y
      reportar problemas; todavía no lo recomendamos como único sistema en un equipo de
      trabajo. El detalle componente por componente está en
      [estado del proyecto](/state/).

  - q: "¿Qué requisitos necesito?"
    a: |
      Mínimo: CPU de 64 bits, 4 GB de RAM y 20 GB de disco. Recomendado: 4 núcleos, 8 GB de
      RAM y 40 GB de disco. La lista completa está en [Descargas](/downloads/).

  - q: "¿Funciona con Wayland o con X11?"
    a: |
      **Wayland.** La sesión corre sobre el compositor Wayfire, administrada por systemd a
      través de uwsm. Las aplicaciones X11 funcionan mediante Xwayland. No hay una sesión
      X11 nativa y no está planeada: mantener las dos duplicaba el trabajo sin beneficio
      para el usuario.

  - q: "¿Funciona bien con NVIDIA?"
    a: |
      Con los drivers libres (nouveau) y con las versiones recientes del driver propietario,
      sí. Las configuraciones híbridas Optimus y las tarjetas viejas con drivers legacy
      pueden necesitar ajustes manuales. Probá siempre en modo Live antes de instalar.

  - q: "¿Puedo usar el escritorio de VasakOS en otra distribución?"
    a: |
      En **Arch Linux** sí, agregando el [repositorio de paquetes](/docs/user/repository/).
      En derivadas de Arch como Manjaro o EndeavourOS suele funcionar, teniendo en cuenta que
      Manjaro retrasa los paquetes respecto de Arch y eso puede generar incompatibilidades.

      En Debian, Ubuntu, Fedora u openSUSE no hay paquetes: habría que compilar cada
      componente a mano. Es posible, pero no está soportado.

  - q: "¿Cómo actualizo el sistema?"
    a: |
      Con `sudo pacman -Syu`. VasakOS es rolling release: no hay versiones que se queden
      atrás ni migraciones grandes. La guía completa, incluyendo qué hacer con los archivos
      `.pacnew` y cómo volver atrás una actualización, está en
      [actualizar el sistema](/docs/user/updating/).

  - q: "¿Cómo cambio el aspecto del escritorio?"
    a: |
      Desde **Ajustes → Apariencia** se cambian el modo claro/oscuro, el tema GTK, el pack
      de iconos y el tema del cursor. Como la interfaz del escritorio está construida con
      tecnologías web, también se puede modificar con CSS sin recompilar nada.

  - q: "¿Dónde se guarda mi configuración?"
    a: |
      En `~/.config/vasak/`. Ahí viven `vasak.conf` con la configuración del sistema y
      `shortcuts.json` con los atajos de teclado personalizados. Conviene cambiarlos desde
      Ajustes en vez de editarlos a mano: la interfaz valida los valores y aplica los
      cambios en el momento.

  - q: "¿Puedo personalizar los atajos de teclado?"
    a: |
      Sí, desde Ajustes. Se pueden ver todos los atajos, modificarlos, crear nuevos y
      detectar conflictos entre ellos.

  - q: "¿Soporta varios monitores?"
    a: |
      Sí. Los monitores se detectan automáticamente y el fondo de pantalla se extiende a
      todos.

  - q: "¿VasakOS recolecta datos?"
    a: |
      No. El sistema no tiene telemetría, no envía información de uso a ningún servidor y no
      requiere crear ninguna cuenta. Este sitio web usa Google Analytics con la IP
      anonimizada; el sistema operativo, nada.

  - q: "¿Es gratis? ¿Va a seguir siéndolo?"
    a: |
      Sí y sí. Todo el código es libre bajo licencia GPL y podés instalarlo en los equipos
      que quieras. El proyecto se sostiene con [donaciones](/donate/) y con el trabajo de
      Vasak Group; nada de eso cambia la licencia ni agrega funciones de pago.

  - q: "¿Cómo puedo ayudar?"
    a: |
      Instalándolo y reportando lo que no funciona es la forma más útil, y no requiere saber
      programar. Si además escribís código, la guía está en
      [contribución](/docs/devs/contribution/). También hacen falta traducciones,
      documentación, iconos y fondos de pantalla.
---
