---
title: "vapp — empezar una aplicación"
description: "La plantilla oficial de aplicaciones de VasakOS: Tauri 2, Vue 3 y TypeScript con los plugins del sistema ya enchufados, y las decisiones que las aplicaciones reales aprendieron rompiéndose."
icon: "fa-solid fa-cube"
weight: 1
---

[**vapp**](https://github.com/Vasak-OS/vapp) es el punto de partida de cualquier aplicación
del escritorio: Tauri 2 + Vue 3 + TypeScript + Tailwind 4, con los plugins de VasakOS ya
enchufados.

No es andamiaje de relleno. Cada pieza está porque su ausencia causó un error concreto en
`vasak-resonance`, `vasak-terminal`, `vasak-gallery` o `vasak-desktop`, y los comentarios
del código dicen cuál. Empezar de cero en vez de clonarla es volver a pisar todos esos
problemas.

## Arrancar

```bash
git clone https://github.com/Vasak-OS/vapp mi-app && cd mi-app && rm -rf .git && git init
```

Después hay que cambiar el nombre en **cinco lugares**, y son cinco:

| Archivo | Qué cambiar |
| --- | --- |
| `package.json` | `name` |
| `src-tauri/Cargo.toml` | `name`, `[lib] name` (`mi_app_lib`), `description` |
| `src-tauri/tauri.conf.json` | `productName`, `identifier` (`ar.net.vasak.mi-app`) |
| `index.html` | `<title>` |
| `src-tauri/src/main.rs` | la llamada a `mi_app_lib::run()` |

> El `identifier` decide dónde van la configuración y los datos del usuario. Cambiarlo
> después de la primera ejecución deja huérfano todo lo que ya se guardó.

Antes de escribir nada, comprobá que los tests pasen: si el nombre quedó a medio cambiar,
el test de catálogos lo dice enseguida.

```bash
bun install
bun test
cargo test --manifest-path src-tauri/Cargo.toml
bunx --bun tauri dev
```

## Qué viene resuelto

- **El marco de la ventana.** `WindowAppLayout` recibe el contenido en un `slot`.
- **El idioma de la sesión.** `locales.rs` resuelve dónde están los catálogos —el plugin
  sólo prueba rutas relativas al ejecutable, y ninguna existe cuando el binario está en
  `/usr/bin`— y qué idioma usar, recorriendo `LC_ALL`, `LC_MESSAGES` y `LANG` y salteando
  las vacías.
- **El clic derecho**, con `setupContextMenu()`, para que no aparezca el menú del motor del
  navegador con «Recargar» e «Inspeccionar elemento».
- **El tema y los iconos**, reactivos: cambian en caliente sin reiniciar la aplicación.
- **Una CSP que no está vacía**, con un reportador de violaciones.

La explicación de cada una, con el error que la motivó, está en el
[README de vapp](https://github.com/Vasak-OS/vapp#readme).

## Textos

Todo texto que ve una persona va en los `.yml`, nunca literal en un `.vue`. Ver
[i18n](/docs/devs/plugins/#i18n).

El `t()` del plugin **no interpola**: la convención es el marcador `{0}` y el ayudante
`interpolar()`.

```ts
import { interpolar } from '@/tools/interpolar';
interpolar(t('inicio.saludo'), nombre);
```

> **Usá el ayudante, no `replace` a mano.** `String.prototype.replace` interpreta `$&`,
> `$$`, `` $` `` y `$'` en el reemplazo: una canción llamada «Rock $& Roll» se mostraba
> como «Rock {0} Roll», y una con `$'` **perdía el texto que venía después**.

Y no hay plurales automáticos: van dos claves con sufijo `One`/`Other` y la vista elige con
`claveSegunCantidad()`. Sin eso se termina mostrando «1 pistas».

Dos reglas de los `.yml`, las dos con test:

1. **Si el valor contiene `: `, va entre comillas.** Sin ellas el parser lo lee como un
   mapeo anidado, rompe el archivo entero y el plugin **paniquea al arrancar**: la
   aplicación no abre. Pasó en producción.
2. **Todos los idiomas tienen las mismas claves y los mismos marcadores.** Una clave que
   falta se muestra cruda; un `{0}` que está en uno y no en el otro pierde el dato.

## Tests

Cada cambio va con tests, en el mismo commit. Si el repositorio tiene poca cobertura, se
suman algunos de lo que está alrededor: así sube mientras se avanza, en lugar de necesitar
una campaña de testing que nunca llega.

Lo que conviene probar es **lo que se rompe callado**: parsers, recortes de texto, límites,
entradas mal formadas, plurales, marcadores de interpolación. No la interfaz.

**Comprobá que un test sirve reintroduciendo el error a propósito** y viendo que falle. Un
test que pasa siempre no prueba nada.

## Compilar y empaquetar

```bash
bun run lint
bun test
cargo test --manifest-path src-tauri/Cargo.toml
bunx --bun tauri build
```

> **Siempre `tauri build`, nunca `cargo build --release` a secas.** Con `cargo` el binario
> queda apuntando al servidor de desarrollo: la página carga vacía, no ejecuta nada de
> JavaScript, y todo parece roto por otra razón.

En el PKGBUILD hacen falta tres cosas que no son obvias:

- **Instalar los catálogos.** Sin esto la aplicación instalada muestra las claves crudas
  (`inicio.titulo`) en lugar de los textos. Le pasó al gestor de archivos, a la terminal y
  a la galería.

  ```bash
  install -dm755 "${pkgdir}/usr/share/${pkgname}/locales"
  install -Dm644 "$srcdir/$pkgname/src-tauri/locales/"*.yml \
      "${pkgdir}/usr/share/${pkgname}/locales/"
  ```

- **`options=('!lto')`.** makepkg inyecta `-flto` global y los crates que compilan C o
  assembly emiten bitcode que el enlazador de rustc no resuelve. Cargo ya hace su propio
  LTO.
- **`RUSTFLAGS="-C target-cpu=x86-64"`** y `unset CARGO_ENCODED_RUSTFLAGS`. El
  `target-cpu=native` de la máquina que compila produce binarios que mueren con SIGILL en
  cualquier CPU más vieja.

## Rendimiento

Estas aplicaciones corren en el escritorio de alguien, y su JavaScript comparte hilo con el
dibujado. Un cálculo de 30 ms son dos cuadros perdidos.

- **No sondees si podés escuchar.** Y si tenés que sondear, pausá con `document.hidden`:
  nadie lee una pantalla que no está en pantalla.
- **Un temporizador, no N.** Un `setInterval` por elemento se multiplica sin que se note.
- **Un reloj sin segundos despierta al minuto**, no a 1 Hz. 59 de cada 60 despertares no
  cambian un píxel, y `toLocaleTimeString` no es gratis.
- **Lo pesado va en Rust.** Decodificar imágenes o video, hashear, recorrer árboles de
  archivos: en el backend, y que cruce el IPC una ruta, no los bytes.
- **No copies para notificar.** Un `{ ...objeto, clave: valor }` sobre un `ref` reactivo
  copia todo el objeto en cada cambio; asignar la clave ya notifica.
