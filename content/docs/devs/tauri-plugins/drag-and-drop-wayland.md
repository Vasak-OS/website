---
title: "drag-and-drop-wayland"
description: "Arrastrar archivos y datos fuera de la aplicación con el arrastre nativo de Wayland: entrega URIs y texto, y avisa cuándo hay que borrar el original."
weight: 5
---

# `tauri-plugin-drag-and-drop-wayland`

Inicia operaciones de arrastrar y soltar nativas en Wayland, para que archivos y datos
puedan soltarse fuera de la aplicación: en el gestor de archivos, en una terminal, en un
editor o en el navegador. El arrastre lo dispara el movimiento del ratón, porque Wayland
exige que la petición salga de dentro del despacho de un evento.

- **Crate:** `tauri-plugin-drag-and-drop-wayland`
- **Paquete JS:** `@vasakgroup/plugin-drag-and-drop-wayland`
- **Plataforma:** Linux con GTK 3 y WebKitGTK. Es para Wayland; las señales propias de X11 también se contemplan

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-drag-and-drop-wayland = "2.1"
```

```bash
bun add @vasakgroup/plugin-drag-and-drop-wayland
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_drag_and_drop_wayland::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Permisos

`drag-and-drop-wayland:default`, en el archivo de capacidades:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["drag-and-drop-wayland:default"]
}
```

El permiso por omisión habilita el único comando, `start_drag`. También existen
`drag-and-drop-wayland:allow-start-drag` y
`drag-and-drop-wayland:deny-start-drag` para concederlo o negarlo por separado.

## API de JavaScript

### `startDrag(item, icon?, options?, onEvent?): Promise<void>`

Arma un arrastre y lo entrega al próximo movimiento del ratón. Se llama **con el
botón todavía apretado**, desde el gesto que lo inicia, que es lo que hace que el
compositor lo acepte. La promesa se resuelve cuando el arrastre quedó armado; el
desenlace llega por `onEvent`.

`item` admite dos formas:

- Un arreglo de rutas de archivo (`["/home/quien/informe.pdf"]`), que viajan como
  `text/uri-list` y como `text/plain`.
- Un objeto `{ data, types }`, para arrastrar datos sueltos: `data` es el mismo
  texto para todos los tipos, o un mapa que le da a cada tipo MIME lo suyo, y
  `types` es la lista de tipos MIME que se ofrecen.

`icon` es el icono que acompaña al puntero: una ruta absoluta a un archivo de
imagen, o su contenido en base64. Cuál de las dos cosas es lo decide el contenido:
si es una ruta absoluta y el archivo existe, se lee del disco; si no, se decodifica
como base64. Si no se puede cargar, el arrastre sale igual, sin icono.

`options.mode` es `"copy"` o `"move"` (por omisión `"copy"`) y **no cambia lo que se
le ofrece al destino**: las dos acciones se ofrecen siempre, porque en Wayland el
destino es el que elige y sin ninguna en común el compositor cancela el arrastre
en lugar de entregarlo. El parámetro es el que la interfaz usa para dibujar la
insignia de copiar o mover mientras el puntero está dentro de la ventana.

`onEvent` recibe un `CallbackPayload` cuando el arrastre termina:

- `result`: `"Dropped"` o `"Cancelled"`.
- `action`: `"copy"`, `"move"` o `null`. Es informativa.
- `sourceShouldDelete`: si el destino confirmó que se quedó con lo entregado y le
  toca al origen sacarlo de su lugar. **Esta es la señal que autoriza borrar, y no
  `action`**: un destino puede elegir mover y después no pedir el borrado, y borrar
  por haber visto `"move"` sería perder un archivo que nadie copió a ninguna parte.
- `cursorPos`: dónde estaba el puntero al terminar, en coordenadas de pantalla.

## Comandos Rust

- `start_drag(app, window, item, image, options, on_event)` — Arma un arrastre
  para que lo dispare el próximo movimiento del ratón: recibe el manejador de la
  aplicación y la ventana, lo que se va a entregar, el icono opcional, las opciones
  y el canal por el que se avisa el resultado. Está registrado como
  `commands::start_drag` y desde la interfaz se invoca como
  `plugin:drag-and-drop-wayland|start_drag`, que es de donde salen `item`, `image`,
  `options` y `onEvent`.

## Ejemplo

```typescript
import { startDrag } from "@vasakgroup/plugin-drag-and-drop-wayland";

// Con el botón apretado: el arrastre arranca con el próximo movimiento.
boton.addEventListener("mousedown", () => {
  void startDrag(
    ["/home/quien/informe.pdf"],
    "/usr/share/icons/hicolor/48x48/mimetypes/application-pdf.png",
    { mode: "move" },
    (payload) => {
      if (payload.result === "Dropped" && payload.sourceShouldDelete) {
        // El destino confirmó que se quedó con el archivo: recién ahora
        // corresponde sacarlo de su lugar.
        quitarDeLaLista("/home/quien/informe.pdf");
      }
    },
  );
});
```

## Detalles de implementación

- Un comando de Tauri no puede iniciar un arrastre: `gtk_drag_begin` necesita estar
  dentro del despacho de un evento para sacar de ahí el serial del agarre del ratón,
  y sin ese serial el compositor descarta la petición. Por eso `start_drag` arma el
  arrastre y lo dispara un manejador de `motion-notify-event` del `WebKitWebView`.
- Un arrastre armado vale 1500 ms. Si el movimiento no llega, porque el botón se
  soltó en el camino, se cancela y se avisa por el canal en lugar de quedar colgado
  para el próximo movimiento.
- Siempre se ofrecen `COPY` y `MOVE`; nunca `LINK` ni `ASK`, que prometerían un
  enlace que el origen no sabe cumplir.
- Los archivos se entregan como `text/uri-list` con los URIs codificados como manda
  la especificación (espacios, `#` y `?` escapados) y como `text/plain` con las
  rutas tal cual: una terminal o un campo de texto pegan lo que reciben, y un URI
  codificado pegado no es ningún archivo.
- Los manejadores se enganchan una sola vez por widget y no se desconectan: el
  destino pide los datos **después** del drop, y desconectar al terminar dejaba la
  transferencia sin quien la atendiera. Así el arrastre sigue funcionando después de
  una recarga del WebView.
- El final se avisa una sola vez, porque `drag-failed` y `drag-end` pueden llegar
  los dos.
- En Wayland no hay ninguna señal que pida borrar el original: `drag-data-delete`
  llega solo en X11. Lo que se usa es el par que define el protocolo —terminó sin
  fallar y la acción negociada fue mover—, y el fallo manda sobre todo lo demás.
- El comportamiento se midió con las sondas de `examples/` sobre Wayfire.
