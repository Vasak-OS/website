---
title: "vsk-contextual-menu"
description: "El menú contextual del sistema para las aplicaciones de VasakOS: se dibuja dentro de la página o en una ventana propia pegada al clic."
weight: 7
---

# `tauri-plugin-vsk-contextual-menu`

El menú del clic derecho de VasakOS. Un solo menú para todo el sistema: las
aplicaciones describen *qué* opciones ofrecen y el plugin decide cómo se ven,
cómo responden al teclado y cómo se cierran. El escritorio, el gestor de
archivos, la galería y lo que venga se ven igual.

- **Crate:** `tauri-plugin-vsk-contextual-menu`
- **Paquete JS:** `@vasakgroup/plugin-vsk-contextual-menu`
- **Plataforma:** Linux (Wayland y X11) con Tauri 2

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-vsk-contextual-menu = "2"
```

```bash
bun add @vasakgroup/plugin-vsk-contextual-menu
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_vsk_contextual_menu::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

`init()` deja la ventana del menú en la ruta por omisión, `#/vsk-context-menu`.
Sólo hace falta cambiarla si la aplicación no puede registrar esa ruta:

```rust
.plugin(tauri_plugin_vsk_contextual_menu::init_with_route("#/lo-que-sea"))
```

La ruta es la parte que va después de `index.html`, con su almohadilla.

## Permisos

`vsk-contextual-menu:default` habilita los cinco comandos (`open_menu_window`,
`close_menu_window`, `take_pending_menu`, `resolve_menu`, `show_menu_window`).
No hay más permisos que los `allow-` y `deny-` por comando.

La ventana del menú lleva la etiqueta `vsk_context_menu` y **tiene que estar
incluida en la capability**: si no, se queda sin permisos y el menú se dibuja
sin los colores del sistema y sin traducciones. La misma lista de permisos
cubre los dos lados, porque los dos invocan al plugin:

```json
// src-tauri/capabilities/default.json
{
  "windows": ["main", "vsk_context_menu"],
  "permissions": [
    "vsk-contextual-menu:default",
    "core:event:default"
  ]
}
```

`core:event:default` es lo que permite escuchar `config-changed`, el aviso con
el que el menú se entera de que cambió el esquema de colores.

El modo dentro del DOM no invoca ningún comando del plugin, pero sí lee la
paleta del sistema: necesita los permisos del complemento config-manager
(`read_config` y `get_scheme_by_id`). Sin ellos el menú se sigue dibujando, con
los colores del sistema o con los de fábrica.

## API de JavaScript

### `showContextMenu(items, donde, opciones?): Promise<MenuChoice | null>`

Abre el menú y devuelve lo que se eligió, o `null` si se cerró sin elegir nada.
`items` es el árbol de renglones y `donde` es el evento del clic derecho (le
corta el menú que dibuja el motor del navegador) o un `{ x, y }` propio. Si ya
había un menú abierto en esa ventana, lo cierra antes de abrir el nuevo.

`opciones`:

| Campo | Qué hace |
|---|---|
| `minWidth` | Ancho mínimo, en píxeles. Por omisión, 200. |
| `maxWidth` | Ancho máximo, antes de cortar el texto con puntos suspensivos. Por omisión, 420. |
| `window` | Dibujar el menú en una ventana propia en vez de dentro de la página. |

### `closeContextMenu(): void`

Cierra el menú abierto, si hay alguno. Quien lo abrió recibe `null`, igual que
si se hubiera descartado con Escape.

### `disableNativeContextMenu(): void`

Apaga el menú del clic derecho que dibuja el motor del navegador en toda la
ventana. Evita «Recargar» e «Inspeccionar elemento» sobre una aplicación que no
es una página web; los menús propios siguen abriéndose igual.

### `setupContextMenu(opciones?): void`

Todo lo anterior junto, para el arranque de la aplicación. Acepta
`iconResolver` (cómo convertir un nombre de icono del sistema en una imagen) y
`disableNative` (por omisión, apaga el menú de WebKit). Además pide la paleta
del sistema por adelantado, para que el primer clic derecho no espere.

### `setIconResolver(resolutor): void`

Enseña al menú a convertir nombres de iconos en imágenes. El resolutor recibe
el nombre y devuelve una imagen, como `getIconSource` de
[`vicons`](/docs/devs/tauri-plugins/vicons/); pasar `null` lo quita. El plugin
no depende de vicons a propósito: así se puede usar en cualquier aplicación.

### `openContextMenuWindow(items, punto, opciones?): Promise<MenuChoice | null>`

Abre el menú en una ventana propia y espera lo que se elija. Es lo que llama
`showContextMenu` con `window: true`; casi nunca hace falta llamarla a mano.
Suma a mano la posición de la ventana para pasar el clic a coordenadas de
pantalla, que son las que necesita Rust.

### `mountContextMenuWindow(): Promise<void>`

Dibuja el menú en la ventana que el plugin abrió. Es lo único que tiene que
hacer la ruta que la aplicación registró para el menú.

### `useContextMenu()`

El envoltorio para Vue. Devuelve `{ show, close }` y cierra el menú cuando el
componente se desmonta, para que un menú abierto no quede huérfano.

### `useContextMenuWindow(): void`

Para el componente que la aplicación pone en la ruta del menú; llama a
`mountContextMenuWindow` al montar.

### El árbol de renglones

`MenuEntry` es la misma unión de tipos que entiende el lado de Rust:

| Tipo | Campos |
|---|---|
| `item` | `id`, `label`, `icon?`, `accelerator?`, `disabled?`, `danger?`. El `type` es opcional. |
| `checkbox` | `id`, `label`, `checked?`, `disabled?`. Al elegirla, `MenuChoice` trae el estado nuevo. |
| `submenu` | `label`, `icon?`, `items`. Sólo en modo dentro del DOM. |
| `separator` | Ninguno. Separa grupos de opciones. |
| `label` | `label`. Título de grupo, que no se puede elegir. |

Tres cosas que conviene tener presentes:

- `label` llega ya traducido: el menú no traduce nada por su cuenta.
- `accelerator` es `Ctrl+C` tal como se lee; el menú lo **muestra**, no lo
  escucha. El atajo lo sigue atendiendo la aplicación.
- `danger` pinta la opción con el color de error, para lo que destruye algo.

## Comandos Rust

- `open_menu_window(request)` — Abre el menú en una ventana propia, pegada al
  clic. `request` trae `items`, `x`, `y` (coordenadas físicas de la pantalla) y
  `minWidth`/`maxWidth` opcionales.
- `take_pending_menu()` — Los ítems que tiene que dibujar la ventana del menú.
  No los saca del estado: el menú sigue abierto hasta que alguien lo resuelva.
- `show_menu_window()` — Muestra la ventana, ya con los ítems dibujados
  adentro. Sólo hace algo si la llama la propia ventana del menú.
- `resolve_menu(id, checked)` — Se eligió una opción. `checked` sólo viene
  cuando fue una casilla.
- `close_menu_window()` — Se cerró el menú sin elegir nada.

Los dos últimos cierran la ventana y le avisan a quien pidió el menú. Si la
ventana no se pudo abrir, `open_menu_window` contesta igual: sin eso, quien
pidió el menú esperaría para siempre.

## Eventos

| Evento | Cuándo se emite | Carga |
|---|---|---|
| `vsk-context-menu-result` | Se eligió una opción, se cerró el menú sin elegir, o la ventana no se pudo abrir | `{ id: string \| null, checked: boolean \| null }` |

Va sólo a la ventana que pidió el menú, con `null` en `id` cuando se descartó.
`showContextMenu` y `openContextMenuWindow` ya lo escuchan por su cuenta: la
aplicación recibe la respuesta en el valor de retorno, no en un escucha propio.

## Ejemplo

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  setupContextMenu,
  showContextMenu,
} from "@vasakgroup/plugin-vsk-contextual-menu";
import { getIconSource } from "@vasakgroup/plugin-vicons";

const showHidden = ref(false);

onMounted(() => {
  // Una sola vez, al arrancar: el menú ya sabe dibujar iconos del sistema.
  setupContextMenu({ iconResolver: getIconSource });
});

async function onRightClick(event: MouseEvent) {
  const choice = await showContextMenu(
    [
      { id: "open", label: t("actions.open"), icon: "document-open" },
      { id: "copy", label: t("actions.copy"), icon: "edit-copy", accelerator: "Ctrl+C" },
      { type: "separator" },
      { type: "checkbox", id: "hidden", label: t("view.hidden"), checked: showHidden.value },
      { type: "submenu", label: t("actions.openWith"), items: [
        { id: "with-editor", label: t("apps.editor") },
        { id: "with-terminal", label: t("apps.terminal") },
      ] },
      { type: "label", label: t("groups.danger") },
      { id: "delete", label: t("actions.delete"), icon: "edit-delete", danger: true },
    ],
    event,
  );

  if (choice?.id === "copy") copy();
  if (choice?.id === "hidden") showHidden.value = choice.checked ?? false;
  if (choice?.id === "delete") remove();
}
</script>

<template>
  <div class="files" @contextmenu="onRightClick" />
</template>
```

En modo ventana hacen falta las dos mitades: la aplicación abre el menú con
`window: true` y registra una ruta que lo dibuja.

```ts
// La aplicación que pide el menú (por ejemplo, el panel).
const choice = await showContextMenu(items, event, { window: true });
```

```vue
<!-- El componente de la ruta que la aplicación registró para el menú. -->
<script setup lang="ts">
import { useContextMenuWindow } from "@vasakgroup/plugin-vsk-contextual-menu";

useContextMenuWindow();
</script>

<template><div /></template>
```

## Detalles de implementación

- Los dos modos dibujan con el mismo componente: el menú se ve y se maneja
  igual adentro de la página que en su propia ventana.
- Dentro del DOM el único límite es la ventana de la aplicación. En modo
  ventana el límite es la pantalla: sirve para el panel —una franja de treinta
  píxeles— y para los clics cerca del borde de abajo, donde el menú quedaría
  recortado.
- La ventana del menú es transparente, sin decoración, no redimensionable,
  siempre encima y fuera de la barra de tareas. Nace del tamaño exacto de sus
  renglones (32 px por opción, 9 px por separador, 26 px por título, más el
  aire y el borde) y se corre hacia adentro cuando el clic cae cerca del borde
  de la pantalla. Se crea cada vez y se cierra al elegir o al perder el foco:
  mantenerla viva costaría un webview en memoria por algo que se abre unos
  segundos. Deja 8 px de borde transparente para la sombra, medidos igual en
  Rust y en el JavaScript que dibuja.
- Los submenús no entran en modo ventana —la ventana mide lo que mide el menú
  y el submenú quedaría afuera—, así que ese modo los rechaza. En modo dentro
  del DOM son parte del mismo dibujo.
- Los colores y el redondeo salen del complemento config-manager: el esquema
  elegido en el sistema y el radio de las esquinas. Se leen una sola vez y se
  guardan; el evento `config-changed` los vuelve a pedir. Si config-manager no
  está o no contesta, el menú cae a las variables del sistema (`--use-*`) y de
  ahí a los colores de fábrica: no se queda sin dibujar por no saber de qué
  color pintarse. De esa lectura se ocupa el propio menú; no forma parte de lo
  que el paquete exporta.
- El `type` de una opción común es opcional: antes de cruzar a Rust, el plugin
  completa `type: "item"` en cada renglón —también adentro de los submenús—,
  porque del lado de Rust el árbol es un enum etiquetado por ese campo y sin él
  la deserialización falla.
- En modo ventana el menú no se cierra cuando la página pierde el foco o
  cambia de tamaño: al mapearse la ventana se disparan `blur` y `resize` que no
  significan que alguien se haya ido a otra cosa, y el menú se habría cerrado a
  los cien milisegundos de abrirse. El foco lo mira la ventana de verdad, y
  sólo cierra si lo perdió **después** de haberlo tenido.
- El teclado es el de cualquier menú del escritorio: flechas para moverse,
  Inicio y Fin para los extremos, Enter y espacio para elegir, Escape para
  volver del submenú al padre y para cerrar el menú, y escribir salta a la
  opción que empieza así. Los submenús se abren al pasar por encima.
- El estilo va como CSS plano y no como clases de Tailwind: el plugin se
  publica compilado y el escaneo de la aplicación no ve las clases que vienen
  adentro de un paquete, así que llegarían sin estilo.
- Lo que el plugin **no** puede hacer es cambiarle el menú a las aplicaciones
  ajenas: en Wayland cada cliente dibuja el suyo en su propia superficie y no
  hay protocolo para reemplazarlo. Para esas, la vía es el tema de GTK y de Qt.
