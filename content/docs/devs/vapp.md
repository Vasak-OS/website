---
title: "vapp | Plantilla de aplicaciones"
description: "El punto de partida de una aplicación de VasakOS: Tauri 2, Vue 3, TypeScript y Tailwind 4, con los plugins y las decisiones ya resueltas."
weight: 10
---

# `vapp`

Punto de partida para una aplicación del escritorio: Tauri 2, Vue 3, TypeScript
y Tailwind 4, con los plugins de VasakOS ya conectados y con las decisiones que
las aplicaciones reales tuvieron que aprender rompiéndose. Lo que trae no es
relleno: cada pieza está porque su ausencia causó un problema concreto en
`vasak-resonance`, `vasak-terminal`, `vasak-gallery` o `vasak-desktop`.

Repositorio: [github.com/Vasak-OS/vapp](https://github.com/Vasak-OS/vapp)

## Arrancar una aplicación nueva

```bash
git clone https://github.com/Vasak-OS/vapp mi-app && cd mi-app && rm -rf .git && git init
```

Después hay que cambiar el nombre en **cinco lugares**, y son cinco, no uno:

| Archivo | Qué cambiar |
|---|---|
| `package.json` | `name` |
| `src-tauri/Cargo.toml` | `name`, `[lib] name` (`mi_app_lib`) y `description` |
| `src-tauri/tauri.conf.json` | `productName` e `identifier` (`ar.net.vasak.mi-app`) |
| `index.html` | el `<title>` |
| `src-tauri/src/main.rs` | la llamada a `mi_app_lib::run()` |

El `identifier` decide dónde van la configuración y los datos del usuario:
cambiarlo después de la primera ejecución deja huérfano lo que ya se guardó.

Antes de escribir nada conviene comprobar que los tests pasan: si el `name`
quedó a medio cambiar, el test de catálogos lo dice enseguida.

```bash
bun install
bun test                                          # frontend
cargo test --manifest-path src-tauri/Cargo.toml    # backend
bunx --bun tauri dev
```

## Lo que ya viene resuelto

### El marco de la ventana

`WindowAppLayout` recibe el contenido en un `slot`, así que la aplicación va
adentro:

```vue
<WindowAppLayout>
  <MiContenido />
</WindowAppLayout>
```

Sin ese `slot`, el layout descartaba en silencio todo lo que se le pusiera dentro
y la ventana abría vacía, con el relleno de la plantilla todavía puesto. No hay
ningún error: simplemente no aparece nada.

### Idioma de la sesión

`src-tauri/src/locales.rs` resuelve dos cosas que se rompen calladas.

**Dónde están los catálogos.** El plugin de i18n solo prueba rutas relativas al
ejecutable y al directorio de trabajo, y ninguna existe cuando el binario está en
`/usr/bin`. Sin la ruta explícita, un paquete instalado muestra las claves crudas
(`inicio.titulo`) en lugar de los textos. Al empaquetar, el PKGBUILD tiene que
instalar los `.yml`:

```bash
install -dm755 "${pkgdir}/usr/share/${pkgname}/locales"
install -Dm644 "$srcdir/$pkgname/src-tauri/locales/"*.yml \
    "${pkgdir}/usr/share/${pkgname}/locales/"
```

**Qué idioma usar.** Se recorren `LC_ALL`, `LC_MESSAGES` y `LANG` en ese orden,
salteando las vacías: `LC_ALL=""` junto a `LANG=en_US.UTF-8` es una máquina en
inglés, y quedarse con la vacía la dejaría en español.

### Escribir textos traducidos

Todo texto que ve una persona va en los `.yml`. Nunca una cadena literal en un
`.vue`. El `t()` del plugin toma un solo argumento y no interpola; la convención
es el marcador `{0}` y `src/tools/interpolar.ts`:

```ts
import { interpolar } from "@/tools/interpolar";
interpolar(t("inicio.saludo"), nombre);
```

Conviene usar el ayudante y no `replace` a mano. `String.prototype.replace`
interpreta `$&`, `$$`, `` $` `` y `$'` en la cadena de reemplazo: una canción
llamada «Rock $& Roll» se mostraba como «Rock {0} Roll», y una con `$'` perdía el
texto que venía después. No hay plurales: van dos claves con sufijo `One`/`Other`
y la vista elige con `claveSegunCantidad()`.

Dos reglas de los `.yml`, las dos con test:

1. **Si el valor contiene `: `, va entre comillas.** Sin ellas el parser lo lee
   como un mapeo anidado, rompe el archivo entero y el plugin paniquea al
   arrancar: la aplicación no abre.
2. **Los idiomas tienen las mismas claves y los mismos marcadores.** Una clave
   que falta se muestra cruda; un `{0}` que está en uno y no en el otro pierde el
   dato.

### Política de contenido

`tauri.conf.json` trae una CSP con `script-src 'self'`, que es lo que bloquea la
inyección de script. Si la aplicación necesita algo más —una API externa en
`connect-src`, `blob:` en `img-src`— se agrega ahí, sin aflojar la política
entera.

`style-src` lleva `'unsafe-inline'` a propósito: Vue escribe estilos en línea con
`:style` y Tailwind inyecta los suyos. `main.ts` registra un reportador de
violaciones, que hace falta porque una violación de CSP no se ve: el recurso no
carga y la interfaz queda a medias sin decir nada. Las rutas absolutas de
archivos no están permitidas; se usa `convertFileSrc()`, que devuelve una URL del
protocolo de assets.

### Clic derecho, tema y forma

- `setupContextMenu({ iconResolver: getIconSource })` en `main.ts`. Sin eso, el
  clic derecho abre el menú del motor del navegador, con «Recargar» e
  «Inspeccionar elemento».
- `useConfigStore()` del plugin de configuración, y `App.vue` escuchando
  `config-changed` para que el cambio de tema se aplique sin reiniciar. Los
  colores salen de variables CSS (`--use-*`), no de valores fijos.
- Los botones, campos, tarjetas, menús, pestañas, globos y diálogos salen de
  `@vasakgroup/vue-libvasak`; una aplicación no dibuja los suyos. La forma —radios,
  bordes, sombras, estados y tiempos— viene de
  `@vasakgroup/vue-libvasak/tokens.css`. Los colores salen solo del esquema: ni
  hexadecimales, ni `rgb()`, ni la paleta de Tailwind. Lo que cambia con el ancho
  va con consultas de contenedor (`@container`, `@sm:`) o un `ResizeObserver`,
  nunca con `sm:`/`md:` ni `matchMedia`.

### Iconos

`ThemeIcon` de la librería, siempre por **nombre** y nunca por ruta: el pack de
iconos cambia en caliente y sus rutas no son estables.

```vue
<ThemeIcon name="internet-mail" :size="24" :alt="t('app.nombre')" />
<ThemeIcon name="view-refresh" type="symbol" :size="16" />
```

`type` elige la variante: `icon` es la común en color y `symbol` la monocroma, la
de los botones de acción. El `alt` va vacío por omisión, para cuando el icono
acompaña a un texto que ya dice lo mismo; cuando el icono **es** la etiqueta, se
pasa.

## Tests

Cada cambio va con sus pruebas, en el mismo commit. Lo que conviene probar es lo
que se rompe callado: parsers, recortes de texto, límites, entradas mal formadas,
plurales y marcadores de interpolación. La plantilla trae los dos lados armados:

- `tests/interpolar.test.ts` — la interpolación, con los tres casos del `$`.
- `tests/design-guard.test.ts` — la guardia del diseño: colores del esquema,
  radios del sistema, iconos del tema y sin puntos de corte de la pantalla.
- `src-tauri/tests/locales.rs` — que los catálogos parseen, tengan las mismas
  claves, ningún texto vacío y los marcadores coincidan.
- `src-tauri/src/locales.rs` — la detección de idioma.

Conviene comprobar que un test sirve reintroduciendo el bug a propósito y viendo
que falle: un test que pasa siempre no prueba nada.

## Compilar y empaquetar

```bash
bun run lint          # biome
bun test
cargo test --manifest-path src-tauri/Cargo.toml
bunx --bun tauri build
```

La compilación va siempre con `tauri build`, nunca con `cargo build --release` a
secas: con `cargo` el binario queda apuntando al servidor de desarrollo, la
página carga vacía y todo parece roto por otra razón.

El PKGBUILD necesita, además de los `.yml`, dos cosas:

- `options=('!lto')` — makepkg inyecta `-flto` global y los crates que compilan C
  o assembly emiten bitcode que el enlazador de rustc no resuelve. Cargo ya hace
  su propio LTO.
- `RUSTFLAGS="-C target-cpu=x86-64"` y `unset CARGO_ENCODED_RUSTFLAGS` — el
  `target-cpu=native` de la máquina que compila produce binarios que mueren con
  `SIGILL` en cualquier CPU más vieja.

## Rendimiento

Estas aplicaciones corren en el escritorio de alguien y su JavaScript comparte
hilo con el dibujado: un cálculo de 30 ms son dos cuadros perdidos. Lo aprendido:

- **No sondear si se puede escuchar.** Y si hay que sondear, pausar con
  `document.hidden`: nadie lee una pantalla que no está en pantalla.
- **Un temporizador, no N.** Un `setInterval` por elemento se multiplica sin que
  nadie lo note.
