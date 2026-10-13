---
title: "user-data"
description: "Los datos de la cuenta que inició sesión —nombre, nombre completo, foto y directorio personal—, listos para el panel del escritorio."
weight: 4
---

# `tauri-plugin-user-data`

Devuelve quién inició sesión y cómo se ve: el nombre de la cuenta, el nombre
completo, la foto de perfil ya codificada como data URI y el directorio
personal. Es lo que dibuja la cara y el nombre en el panel del escritorio.

- **Crate:** `tauri-plugin-user-data`
- **Paquete JS:** `@vasakgroup/plugin-user-data`
- **Plataforma:** Linux en el escritorio (lee `passwd`, `getent` y
  `/var/lib/AccountsService`)

## Instalación

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-user-data = "2.1.1"
```

```bash
bun add @vasakgroup/plugin-user-data
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_user_data::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

`init` no recibe argumentos. El plugin consulta el sistema en cada llamada, así
que no hay nada que configurar ni que mantener sincronizado.

## Permisos

`user-data:default`, en el archivo de capacidades:

```json
// src-tauri/capabilities/default.json
{
  "permissions": ["user-data:default"]
}
```

El permiso por omisión habilita el único comando del plugin. También existen
`user-data:allow-get-user-info` y `user-data:deny-get-user-info` por separado,
que es lo que el permiso por omisión incluye.

## API de JavaScript

### `getUserData(): Promise<UserInfo | null>`

Devuelve los datos de la cuenta de la sesión, o `null` si el backend no contestó
nada. El objeto trae:

- `username` — El nombre de la cuenta (`pato`). Siempre hay uno.
- `full_name` — El nombre completo (`Joaquin Decima`). Si la cuenta no lo tiene,
  es el mismo nombre de la cuenta.
- `avatar_data` — La foto como data URI (`data:image/png;base64,…`), lista para
  un `<img src>`. Nunca viene vacía: si no hay ninguna foto utilizable, llega un
  ícono genérico.
- `home_dir` — El directorio personal (`/home/pato`).

La interfaz `UserInfo` que exporta el paquete declara `username`, `full_name` y
`avatar_data`; `home_dir` viaja igual en la respuesta.

## Comandos Rust

- `get_user_info()` — El nombre de la cuenta, el nombre completo, la foto como
  data URI y el directorio personal.

## Ejemplo

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUserData, type UserInfo } from "@vasakgroup/plugin-user-data";

const cuenta = ref<UserInfo | null>(null);

onMounted(async () => {
  cuenta.value = await getUserData();
});
</script>

<template>
  <img v-if="cuenta" :src="cuenta.avatar_data" :alt="cuenta.full_name" />
  <p v-if="cuenta">{{ cuenta.full_name }}</p>
</template>
```

## Detalles de implementación

- **Nunca falla por un entorno incompleto.** El comando devuelve siempre datos
  utilizables: sin `USER`, sin `passwd` o sin `HOME` igual hay nombre, nombre
  completo y directorio.
- **El nombre de la cuenta** sale de `USER`; si no está, de `passwd` por uid
  (`getpwuid`); y si tampoco, del uid como número. Una aplicación lanzada desde
  una unidad de systemd puede no tener `USER`, y ahí es donde antes fallaba.
- **El nombre completo** es el quinto campo de `getent passwd <cuenta>` (GECOS),
  cortado en la primera coma: de `Joaquin Decima,Oficina 3,555-1234` queda
  `Joaquin Decima`. Si está vacío, se usa el nombre de la cuenta.
- **El directorio personal** es el sexto campo de esa misma línea, con `HOME`
  como respaldo.
- **La foto** se busca en orden: `~/.face`, `~/.face.icon`,
  `/var/lib/AccountsService/icons/<cuenta>` y
  `/usr/share/icons/default/user.png`. Gana la primera que exista y sea una
  imagen que se pueda dibujar.
- **El tipo se detecta por el contenido**, no por la extensión: PNG, JPEG, GIF,
  BMP, WebP y SVG. Dos de las cuatro rutas no tienen extensión, y por el nombre
  un `.face` en JPEG se declaraba PNG y no se dibujaba.
- **Tope de 4 MiB por foto.** La imagen viaja al WebView en base64, dentro de un
  solo mensaje de IPC, así que un archivo enorme se saltea en lugar de cargarse.
  El tope se aplica al leer, no sólo al medir el archivo.
- **Un archivo ilegible, vacío o que no sea una imagen se saltea** y se sigue con
  la ruta siguiente: es mejor la foto del sistema que un hueco por un archivo
  roto.
- **Sin foto de reserva no hay hueco**: el plugin guarda un SVG genérico
  empotrado y lo entrega cuando ninguna ruta sirvió. Va dentro del binario y no
  como ruta a un archivo del tema, que puede no estar.
- **Sin eventos**: el plugin no emite ninguno. Quien quiera datos frescos vuelve
  a llamar a `getUserData()`, que consulta el sistema cada vez.
