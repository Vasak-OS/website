---
title: "Plugins de VasakOS"
description: "Los plugins de Tauri que comparten las aplicaciones de VasakOS: configuración, iconos, traducciones, menú contextual, registros, red, bluetooth y datos de usuario."
icon: "fa-solid fa-puzzle-piece"
weight: 2
---

Lo que hace que las aplicaciones de VasakOS se sientan como un solo sistema no es una
biblioteca de componentes: son estos plugins. Cada uno resuelve una cosa que **todas** las
aplicaciones necesitan y que ninguna debería resolver por su cuenta, porque hacerlo cada
una a su manera es exactamente lo que produce un escritorio que parece cinco escritorios.

Todos son plugins de **Tauri 2**, con una mitad en Rust y otra en TypeScript, y todos son
específicos de Linux.

## Cuáles hay

| Plugin | Qué resuelve | Aplicaciones que lo usan |
| --- | --- | --- |
| [config-manager](#config-manager) | Tema, iconos, cursor y configuración compartida. | 14 |
| [vicons](#vicons) | Iconos del sistema, del tema que esté puesto. | 13 |
| [i18n](#i18n) | Traducciones. | 13 |
| [vsk-contextual-menu](#vsk-contextual-menu) | El menú del clic derecho. | 9 |
| [vsk-journal](#vsk-journal) | Registro en el diario del sistema. | 9 |
| [network-manager](#network-manager) | Wi-Fi, redes y VPN. | 2 |
| [bluetooth-manager](#bluetooth-manager) | Adaptadores y dispositivos Bluetooth. | 2 |
| [user-data](#user-data) | Quién inició sesión. | 1 |
| [drag-and-drop-wayland](#drag-and-drop-wayland) | Arrastrar archivos fuera de la ventana. | 1 |

Los cuatro primeros vienen ya enchufados en [vapp](/docs/devs/vapp/), que es de donde
conviene arrancar cualquier aplicación nueva.

## Cómo se enchufa uno

Los dos lados, siempre. En Rust, al construir la aplicación:

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_config_manager::init())
    .plugin(tauri_plugin_vicons::init())
    .run(tauri::generate_context!())
    .expect("error al arrancar");
```

Y en el frontend, el paquete de npm correspondiente:

```bash
bun add @vasakgroup/plugin-config-manager @vasakgroup/plugin-vicons
```

> Cada dependencia nueva va **también** al `PKGBUILD` del paquete, en el acto. Un plugin
> que compila en tu máquina porque la biblioteca ya estaba instalada por otro paquete no
> está declarado: en una instalación limpia falla.

---

## config-manager

`@vasakgroup/plugin-config-manager` · `tauri-plugin-config-manager`

Guarda, lee y **observa** la configuración compartida del escritorio: modo oscuro, tema
GTK, pack de iconos, tema del cursor. Es el que hace que cambiar el tema en Ajustes lo
cambie en todas las ventanas abiertas, sin reiniciar ninguna.

Los archivos que maneja:

```
~/.config/vasak/vasak.conf     # la configuración de la sesión
~/.config/vasak/schemes/       # esquemas de color propios
/usr/share/vasak-schemes/      # los que trae el sistema
```

Es el plugin más usado del ecosistema, y el que hay que enchufar primero: sin él una
aplicación no sigue el tema del sistema.

## vicons

`@vasakgroup/plugin-vicons` · `tauri-plugin-vicons`

Devuelve iconos del sistema por nombre, en base64, listos para el `src` de un `<img>`.
Resuelve contra el tema de iconos que esté puesto —GTK 3—, cachea, y avisa cuando el tema
cambia para que los iconos se redibujen solos.

Pedir un icono por nombre, en vez de empaquetarlo con la aplicación, es lo que permite que
cambiar el pack de iconos cambie el sistema entero.

> Un nombre que sólo existe en su versión simbólica **no falla** al pedirlo a color:
> devuelve `image-missing`, el icono de imagen rota. Si el icono tiene que verse a color
> —el logo de un navegador, por ejemplo—, verificá que exista en `scalable/`.

## i18n

`@vasakgroup/tauri-plugin-i18n` · `tauri-plugin-i18n-vsk`

Traducciones, sobre `rust_i18n`. Los textos viven en archivos YAML por idioma, del lado de
Rust, y la interfaz los pide con `t()`.

**Todo texto que ve una persona va traducido.** No hay excepción para «esto es temporal».

> `t()` **no interpola**. Para meter un valor en una cadena, la traducción lleva `{0}` y se
> reemplaza a mano:
>
> ```ts
> t('components.Card.unread').replace('{0}', String(cantidad))
> ```

## vsk-contextual-menu

`@vasakgroup/plugin-vsk-contextual-menu` · `tauri-plugin-vsk-contextual-menu`

El menú del clic derecho, uno solo para todo el escritorio. La aplicación describe **qué**
opciones ofrece; el plugin decide cómo se ven, cómo responden al teclado y cómo se cierran.

- Sigue el tema del sistema —colores y redondeo— sin que la aplicación haga nada.
- Iconos del sistema, atajos, casillas, submenús, separadores y títulos.
- Teclado completo: flechas, Inicio y Fin, Escape, y escribir para saltar a una opción.

Escribir un menú propio con HTML es la forma más rápida de que una aplicación se note
ajena al resto.

## vsk-journal

`@vasakgroup/plugin-vsk-journal` · `tauri-plugin-vsk-journal`

Escribe en el diario de systemd **con el nombre de la aplicación**.

Sin esto, una aplicación gráfica es hija del compositor y lo que manda por `stderr` queda
atribuido a la unidad de la sesión: no hay forma de filtrar lo que escribió una sola. El
plugin habla el protocolo nativo de `systemd-journald` —un datagrama a un socket unix—, sin
privilegios y sin `libsystemd`; si no hay socket, se cae a `stderr` y no molesta.

Lo que agrega a cada mensaje:

| Campo | Para qué |
| --- | --- |
| `SYSLOG_IDENTIFIER` | El nombre de la aplicación, para `journalctl -t vasak-terminal`. |
| `VSK_CAPA` | `interfaz` o `nucleo`, porque se arreglan en archivos distintos. |

Instala además un gancho de pánico que deja el mensaje, el archivo y la línea con prioridad
de crítico. Un cierre inesperado sin esto es un volcado sin símbolos; con esto se
diagnostica leyendo el diario.

## network-manager

`@vasakgroup/plugin-network-manager` · `tauri-plugin-network-manager`

Estado de la red, Wi-Fi y VPN, hablando con **NetworkManager** por D-Bus. Es lo que hay
detrás del control de red del panel y de las páginas de red de Ajustes.

## bluetooth-manager

`@vasakgroup/plugin-bluetooth-manager` · `tauri-plugin-bluetooth-manager`

Adaptadores y dispositivos Bluetooth, contra **BlueZ** por D-Bus. Descubrir, emparejar,
conectar y olvidar.

Antes de mostrar cualquier interfaz de Bluetooth conviene preguntar si el plugin arrancó:
en un equipo sin adaptador no hay nada que mostrar y el control no debería aparecer.

## user-data

`@vasakgroup/plugin-user-data` · `tauri-plugin-user-data`

Quién inició sesión: nombre de usuario, nombre completo y la foto de perfil en base64. Es
lo que dibuja la tarjeta del usuario en el centro de control y en la pantalla de inicio de
sesión.

## drag-and-drop-wayland

`@vasakgroup/plugin-drag-and-drop-wayland` · `tauri-plugin-drag-and-drop-wayland`

Arrastrar algo **desde** la ventana hacia afuera, en Wayland, usando GDK. WebKitGTK sabe
recibir lo que le sueltan encima, pero no sabe iniciar un arrastre hacia otra aplicación;
sin esto no se puede sacar un archivo del gestor de archivos y soltarlo en otro programa.
