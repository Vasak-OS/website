---
title: "vicons"
description: "Íconos del tema del sistema como data URI listo para un `<img>`, con caché de 30 minutos y aviso al frontend cuando el tema cambia."
weight: 2
---

# `tauri-plugin-vicons`

Obtiene íconos del tema de iconos del sistema (GTK) y los entrega codificados en
base64, listos para poner en un `<img src>`. Cachea las búsquedas media hora y
avisa al frontend cuando el tema de iconos cambia.

- **Crate:** `tauri-plugin-vicons`
- **Paquete JS:** `@vasakgroup/plugin-vicons`
- **Plataforma:** Linux con GTK 3 (GNOME, KDE, Xfce y demás entornos)

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-vicons = { git = "https://github.com/Vasak-OS/tauri-plugin-vicons", branch = "v2" }
```

```bash
bun add @vasakgroup/plugin-vicons
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_vicons::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Permisos

`vicons:default`, en el archivo de capacidades:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["vicons:default"]
}
```

El permiso por omisión habilita las cuatro operaciones (`get_icon`,
`get_symbol`, `has_icon`, `has_symbol`). No hay permisos individuales.

## API de JavaScript

### `getIconSource(name): Promise<string>`

Devuelve un data URI completo (`data:image/png;base64,…`) listo para un
`<img src>`. `name` puede ser un nombre de icono GTK (`folder`) o una ruta de
archivo existente, que se lee directamente. Detecta el tipo MIME por los
primeros bytes (PNG, JPEG, GIF, WebP, BMP y SVG). Ante un error devuelve `""`.

### `getSymbolSource(name): Promise<string>`

Igual que `getIconSource`, pero con los íconos simbólicos del tema (los
monocromos que siguen el color del texto).

### `hasIcon(name): Promise<boolean>`

Si el tema puede dibujar ese icono regular. Antes de un error del plugin
contesta `false`, no lanza.

### `hasSymbol(name): Promise<boolean>`

Igual que `hasIcon`, para los símbolos.

### Por qué `hasIcon` y `hasSymbol` son necesarios

`getIconSource` y `getSymbolSource` **no fallan** cuando el icono no existe: el
tema devuelve `image-missing` —el cuadrito de imagen rota— como si fuera el
icono pedido, y lo que llega es un data URI válido. Comprobar el resultado no
alcanza, porque nunca está vacío. La forma correcta es preguntar primero:

```typescript
import { getSymbolSource, hasSymbol } from "@vasakgroup/plugin-vicons";

// Mal: `icono` nunca es "", así que el `if` no protege de nada.
const icono = await getSymbolSource("google-symbolic");
if (icono) mostrar(icono); // dibuja el cuadrito si el tema no lo tiene

// Bien: se pregunta primero y se elige otro nombre si falta.
const nombre = (await hasSymbol("google-symbolic"))
  ? "google-symbolic"
  : "goa-account-symbolic";
mostrar(await getSymbolSource(nombre));
```

## Comandos Rust

Los cuatro comandos reciben un único argumento `name: &str`. Si es una ruta de
archivo válida, leen el archivo; si no, la buscan en el tema de iconos de GTK.

- `get_icon(name)` — Icono regular como base64.
- `get_symbol(name)` — Icono simbólico como base64.
- `has_icon(name)` — Si el tema tiene el icono regular, sin traerlo.
- `has_symbol(name)` — Si el tema tiene el símbolo, sin traerlo.

`has_icon` y `has_symbol` hacen la misma búsqueda que su `get_` correspondiente
—mismo tamaño, mismas banderas—, así que un `true` garantiza que el `get_`
devuelve ese icono y no el cuadrito.

## Eventos

| Evento | Cuándo se emite | Carga |
|---|---|---|
| `vicons:theme-changed` | El tema de iconos del sistema cambió | `null` |

```typescript
import { listen } from "@tauri-apps/api/event";
import { getIconSource } from "@vasakgroup/plugin-vicons";

await listen("vicons:theme-changed", async () => {
  const icono = await getIconSource("folder");
  // volver a dibujar la interfaz con el icono nuevo
});
```

El plugin detecta el cambio por la señal `changed` de GTK, limpia la caché y
recién entonces emite el evento.

## Detalles de implementación

- Dos cachés separadas (`ICON_CACHE` y `SYMBOL_CACHE`); cada entrada expira a los
  **30 minutos**.
- Al cambiar el tema de iconos, las dos cachés se limpian por completo.
- GTK detecta el cambio por GSettings (`org.gnome.desktop.interface`), por
  inotify sobre `~/.config/gtk-3.0/settings.ini` y por el portal XDG.
- Escribe un registro en `{app_data_dir}/logs/icons.log` sin dependencias
  externas de logging.

## Ejemplo con Vue

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getIconSource } from "@vasakgroup/plugin-vicons";

const icon = ref("");
onMounted(async () => {
  icon.value = await getIconSource("folder");
});
</script>

<template>
  <img :src="icon" alt="folder" />
</template>
```
