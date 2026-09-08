---
title: "Contribuir al proyecto"
weight: 55
description: "Cómo se trabaja en VasakOS: ramas, commits, tests, changelog y pull requests."
aliases: ["/docs/devs/contribucion/"]
---

Cómo contribuir a cualquier repositorio de [Vasak-OS](https://github.com/Vasak-OS). El
ejemplo usa `vasak-desktop`, pero vale para todos.

## Las tres reglas que no se negocian

**Cada cambio va con tests, en el mismo commit.** Si el repositorio tiene poca cobertura, se
suman algunos de lo que está alrededor: así sube mientras se avanza. Lo que conviene probar
es lo que se rompe callado —parsers, límites, entradas mal formadas—, no la interfaz. Y
comprobá que el test sirve reintroduciendo el error a propósito: uno que pasa siempre no
prueba nada.

**Todo texto que ve una persona va traducido.** En los `.yml` de `src-tauri/locales/`,
nunca literal en un `.vue`. Ver [i18n](/docs/devs/plugins/#i18n).

**Toda dependencia nueva va al PKGBUILD, en el acto.** Si compila en tu máquina porque la
biblioteca ya estaba puesta por otro paquete, no está declarada: en una instalación limpia
falla.

## Preparar el fork

```bash
git clone https://github.com/TU_USUARIO/vasak-desktop.git
cd vasak-desktop
git remote add upstream https://github.com/Vasak-OS/vasak-desktop.git
```

## Una rama por cambio

```bash
git fetch upstream && git checkout main && git merge upstream/main
git checkout -b fix/descripcion-corta
```

| Prefijo | Para qué |
| --- | --- |
| `fix/` | Corregir algo que está mal. |
| `enhancement/` | Funcionalidad nueva. |
| `refactor/` | Reorganizar sin cambiar el comportamiento. |
| `docs/` | Documentación. |
| `chore/` | Tareas sin código funcional: versiones, dependencias. |

La descripción va en castellano y dice **qué resuelve**, no qué archivo toca:
`fix/el-panel-desaparece-con-monitor-externo`, no `fix/panel-vue`.

## Commits

El mensaje se escribe para quien lo va a leer dentro de un año, buscando por qué el código
está así. El asunto dice **qué cambia**, y el cuerpo, **por qué** —qué se rompía antes:

```
El clima vuelve a mostrarse

La política de contenido nombraba api.open-meteo.com pero no
geocoding-api.open-meteo.com, que es contra quien se traduce la zona horaria a
coordenadas. El widget arranca por ahí, así que el webview cortaba el primer
pedido en silencio y no se llegaba nunca al pronóstico.
```

Un cambio que no se puede explicar en un párrafo suele ser dos cambios.

> Agregá los archivos que tocaste, uno por uno. `git add .` arrastra lo que quedó del
> último build y ensucia el diff que otra persona tiene que revisar.

## Changelog

Cada cambio se anota en el `CHANGELOG.md` de la raíz del workspace, agrupado por paquete y
descrito en términos de **qué gana o qué deja de sufrir quien usa el sistema** —no de qué
función se tocó—, con el hash corto al final. `⚡` para rendimiento, `🔒` para seguridad.

## Antes de abrir el pull request

Todo esto tiene que estar en verde:

```bash
bun test
bunx --bun vue-tsc --noEmit
bunx --bun biome check .
cargo test --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets
```

## El pull request

```bash
git push origin fix/descripcion-corta
```

En GitHub, contra `main` del repositorio original. Tres cosas más:

1. **Ponele su etiqueta.** Las que hay son `bug`, `enhancement`, `documentation`,
   `question`, `help wanted`, `good first issue`, `duplicate`, `invalid` y `wontfix`. No hay
   etiqueta `feature`: la funcionalidad nueva es `enhancement`.
2. **Sumalo al proyecto «VasakOS Roadmap»**, que es donde se sigue el estado de todo.
3. **Escribí la descripción como si el revisor no supiera nada del problema**: qué pasaba,
   por qué pasaba, qué cambia y cómo lo verificaste.

Un PR que dice «arregla el bug» obliga a quien revisa a reconstruir el razonamiento desde
el diff, y es la razón más común de que uno quede parado.

### Verificación

Contá qué corriste y qué dio. Si no probaste algo, decilo:

```markdown
## Verificación
- `bun test`: 45 pass, 0 fail.
- `cargo test`: 101 pass, 0 fail, 2 ignored.
- `biome check` y `vue-tsc --noEmit`: limpios.

No lo probé corriendo el escritorio.
```

> VasakOS es **Wayland puro**. No hay nada que probar en X11, y un PR que dice haberlo
> probado ahí describe algo que no pasó.

## Revisión

Los pull requests los revisa CodeRabbit automáticamente, además de las personas. Respondé a
los comentarios; si no vas a aplicar uno, decí por qué —también es una respuesta válida.

Después de aplicar cambios, el mismo push actualiza el PR.

## Después del merge

```bash
git checkout main
git pull upstream main
git branch -d fix/descripcion-corta
```

Las ramas mergeadas se borran, en local y en el remoto. Una lista de ramas viejas hace que
nadie encuentre las que están vivas.
