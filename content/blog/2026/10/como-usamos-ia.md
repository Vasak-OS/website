---
Title: "Cómo usamos (y no usamos) asistencia de IA en el desarrollo de VasakOS"
seotitle: "Cómo usamos IA en VasakOS: reglas y responsabilidad"
tags: ["vasakos", "inteligencia artificial", "ia", "desarrollo", "transparencia"]
date: "2026-10-14"
img: "/img/posts/ia-vasakos.svg"
description: "Cómo usamos asistencia de IA en VasakOS: qué hacemos, qué no, por qué el código sigue siendo responsabilidad humana y cómo puedes colaborar."
weight: 10
layout: post
---

*Transparencia sobre herramientas, límites y responsabilidad humana*

En VasakOS el código que llega a los repositorios es responsabilidad de personas.

Usamos herramientas de asistencia (incluidos modelos de lenguaje) en algunas etapas del trabajo, pero con reglas claras. Este artículo explica exactamente cuáles son esas reglas, para que cualquiera pueda saber qué esperar del proyecto.

---

# Por qué hablamos de esto

Hay un rechazo legítimo en parte de la comunidad Linux y del software libre hacia el uso de IA generativa. Las críticas suelen centrarse en:

- Código publicado sin comprensión real
- Deuda técnica difícil de mantener
- Problemas de licencia y procedencia
- Pérdida de calidad y de responsabilidad

Compartimos varias de esas preocupaciones. Por eso preferimos ser explícitos desde el principio en lugar de dejar que se asuma o se descubra después.

# Qué sí hacemos

Usamos asistencia de IA de forma limitada y siempre subordinada a criterio humano. Algunos ejemplos concretos:

- Explorar ideas o enfoques posibles ante un problema
- Generar borradores iniciales de documentación o comentarios
- Sugerir nombres, estructuras o refactors que luego se revisan y reescriben
- Ayudar a entender código ajeno o a buscar posibles causas de un bug
- Redactar textos explicativos (como este mismo artículo) que después se editan y validan

En ningún caso el resultado de un modelo se convierte automáticamente en código del proyecto.

# Qué no hacemos

- No mergeamos código generado por IA sin revisión humana completa.
- No aceptamos pull requests cuyo autor no pueda explicar y defender lo que está enviando.
- No usamos modelos para «rellenar» funcionalidades que nadie del equipo entiende.
- No ocultamos el uso de estas herramientas cuando es relevante.
- No presentamos el trabajo asistido como si fuera puramente humano cuando no lo es.

Si alguien envía un cambio y no puede responder con claridad a «¿por qué está escrito así?» o «¿qué pasa si falla en este caso?», el cambio no se acepta, venga de donde venga la sugerencia inicial.

# El criterio que importa: responsabilidad

La regla más importante es simple:

> Quien propone un cambio es responsable de ese cambio. Tiene que entenderlo, poder mantenerlo y responder por él.

La herramienta que se haya usado para llegar a ese cambio es secundaria. Lo que cuenta es si una persona del proyecto (o un colaborador externo) asume la responsabilidad técnica y de mantenimiento.

Esto se aplica tanto al equipo principal como a cualquier persona que envíe un pull request.

# Cómo se traduce en la práctica

1. Todo código pasa por revisión.
2. Se espera comprensión real, no solo «compila y parece funcionar».
3. Se prioriza la mantenibilidad a largo plazo sobre la velocidad de entrega.
4. Si un cambio introduce complejidad innecesaria o patrones difíciles de seguir, se rechaza o se reescribe, aunque la idea original haya salido de una sugerencia automática.

Preferimos avanzar más despacio y con código que podamos sostener, que avanzar rápido con cosas que nadie del equipo domina del todo.

# Comunicaciones y redes sociales

Actualmente VasakOS cuenta con un solo desarrollador a tiempo completo. No tenemos un equipo de comunicación ni personas dedicadas a gestionar redes sociales, comunicados o la presencia pública del proyecto.

Por esa razón, gran parte de los textos de redes sociales, anuncios y comunicados se redactan con asistencia de IA y luego se revisan antes de publicarse. Es una decisión práctica: preferimos mantener una presencia mínima y coherente antes que desaparecer de los canales por falta de tiempo.

Esto no cambia la regla principal del proyecto. El código sigue siendo responsabilidad humana. Las comunicaciones, en cambio, son un área donde la asistencia nos permite seguir existiendo públicamente mientras el equipo es tan pequeño.

# Sobre calidad, licencias y deuda técnica

Somos conscientes de los riesgos:

- Los modelos pueden inventar APIs, usar patrones obsoletos o generar código sutilmente incorrecto.
- La procedencia exacta del entrenamiento de muchos modelos no es transparente.
- El código «que funciona» pero que nadie entiende se convierte en deuda técnica cara.

Por eso tratamos cualquier sugerencia de IA con el mismo (o mayor) escepticismo que una contribución de alguien desconocido. Se revisa, se prueba, se discute y, si es necesario, se reescribe por completo.

# Te necesitamos

Si llegaste hasta aquí y te interesa el proyecto, hay muchas formas de ayudar que no requieren ser desarrollador:

- Probar las ISOs y reportar problemas
- Mejorar o traducir la [documentación](/docs/)
- Revisar y comentar issues
- Ayudar con diseño, iconos o material visual
- Gestionar o moderar canales de comunidad
- Escribir o revisar comunicados y contenido para redes

Cualquier ayuda suma. Cuantas más personas se involucren, menos necesitaremos apoyarnos en herramientas automáticas para mantener el proyecto vivo y visible. En [Buscamos colaboradores para construir VasakOS](/blog/2026/03/buscamos-colaboradores-para-construir-vasakos/) está la lista de perfiles que hacen falta, y en la [guía de contribución](/docs/devs/contribution/) están las reglas para enviar cambios.

Puedes empezar por los repositorios en [GitHub](https://github.com/Vasak-OS), el canal de [Telegram](https://t.me/VasakOS) o [Discord](https://discord.gg/7wKrVNBC), o simplemente abriendo un issue con una idea o un problema.

# Cierre

VasakOS se construye en público, con repositorios abiertos, issues abiertos y decisiones visibles. El [estado del proyecto](/state/) se actualiza con cada release. El uso de herramientas de asistencia no cambia eso: el código que publicamos sigue siendo responsabilidad de quienes lo revisan y lo aceptan.

Si tienes dudas, críticas o quieres proponer mejoras a estas reglas, el lugar para hablarlo es el mismo de siempre: los [issues de los repositorios](https://github.com/Vasak-OS) o los canales de la comunidad.

El objetivo no es convencer a nadie de que la IA es buena o mala. Es dejar claro cómo trabajamos nosotros.
