---
title: "vapp | Application template"
description: "The starting point for a VasakOS application: Tauri 2, Vue 3, TypeScript and Tailwind 4, with the plugins and the decisions already solved."
weight: 10
---

# `vapp`

The starting point for a desktop application: Tauri 2, Vue 3, TypeScript and
Tailwind 4, with the VasakOS plugins already wired in and with the decisions
that the real applications had to learn the hard way. What it ships is not
filler: every piece is there because its absence caused a concrete problem in
`vasak-resonance`, `vasak-terminal`, `vasak-gallery` or `vasak-desktop`.

Repository: [github.com/Vasak-OS/vapp](https://github.com/Vasak-OS/vapp)

## Starting a new application

```bash
git clone https://github.com/Vasak-OS/vapp my-app && cd my-app && rm -rf .git && git init
```

The name then has to be changed in **five places**, and there are five, not one:

| File | What to change |
|---|---|
| `package.json` | `name` |
| `src-tauri/Cargo.toml` | `name`, `[lib] name` (`my_app_lib`) and `description` |
| `src-tauri/tauri.conf.json` | `productName` and `identifier` (`ar.net.vasak.my-app`) |
| `index.html` | the `<title>` |
| `src-tauri/src/main.rs` | the call to `my_app_lib::run()` |

The `identifier` decides where the configuration and the user data go: changing
it after the first run orphans whatever was already saved.

Before writing anything, it pays to check that the tests pass: if the `name` was
left half-changed, the catalog test says so right away.

```bash
bun install
bun test                                          # frontend
cargo test --manifest-path src-tauri/Cargo.toml    # backend
bunx --bun tauri dev
```

## What is already solved

### The window frame

`WindowAppLayout` takes the content in a `slot`, so the application goes inside:

```vue
<WindowAppLayout>
  <MyContent />
</WindowAppLayout>
```

Without that `slot`, the layout silently discarded everything placed inside and
the window opened empty, still carrying the template's placeholder. There is no
error: nothing simply shows up.

### Session language

`src-tauri/src/locales.rs` solves two things that break quietly.

**Where the catalogs are.** The i18n plugin only tries paths relative to the
executable and the working directory, and neither exists when the binary is in
`/usr/bin`. Without the explicit path, an installed package shows the raw keys
(`inicio.titulo`) instead of the texts. When packaging, the PKGBUILD has to
install the `.yml` files:

```bash
install -dm755 "${pkgdir}/usr/share/${pkgname}/locales"
install -Dm644 "$srcdir/$pkgname/src-tauri/locales/"*.yml \
    "${pkgdir}/usr/share/${pkgname}/locales/"
```

**Which language to use.** `LC_ALL`, `LC_MESSAGES` and `LANG` are read in that
order, skipping the empty ones: `LC_ALL=""` next to `LANG=en_US.UTF-8` is an
English machine, and taking the empty one would leave it in Spanish.

### Writing translated texts

Every text a person sees goes in the `.yml` files. Never a literal string in a
`.vue`. The plugin's `t()` takes a single argument and does not interpolate; the
convention is the `{0}` marker and `src/tools/interpolar.ts`:

```ts
import { interpolar } from "@/tools/interpolar";
interpolar(t("inicio.saludo"), nombre);
```

It is better to use the helper than `replace` by hand.
`String.prototype.replace` interprets `$&`, `$$`, `` $` `` and `$'` in the
replacement string: a song called "Rock $& Roll" showed up as "Rock {0} Roll",
and one with `$'` lost the text that came after it. There are no plurals: two
keys with a `One`/`Other` suffix are used and the view picks with
`claveSegunCantidad()`.

Two rules for the `.yml` files, both with a test:

1. **If the value contains `: `, it goes in quotes.** Otherwise the parser reads
   it as a nested mapping, breaks the whole file and the plugin panics on start:
   the application does not open.
2. **The languages have the same keys and the same markers.** A missing key shows
   up raw; a `{0}` present in one and not the other loses the data.

### Content policy

`tauri.conf.json` ships a CSP with `script-src 'self'`, which is what blocks
script injection. If the application needs more —an external API in
`connect-src`, `blob:` in `img-src`— it is added there, without loosening the
whole policy.

`style-src` carries `'unsafe-inline'` on purpose: Vue writes inline styles with
`:style` and Tailwind injects its own. `main.ts` registers a violation reporter,
which is needed because a CSP violation is invisible: the resource does not load
and the interface is left half-drawn without saying anything. Absolute file paths
are not allowed; `convertFileSrc()` is used, which returns an assets-protocol
URL.

### Right click, theme and shape

- `setupContextMenu({ iconResolver: getIconSource })` in `main.ts`. Without it,
  right click opens the browser engine's menu, with "Reload" and "Inspect
  element".
- `useConfigStore()` from the settings plugin, and `App.vue` listening for
  `config-changed` so the theme change applies without restarting. Colors come
  from CSS variables (`--use-*`), not fixed values.
- Buttons, fields, cards, menus, tabs, bubbles and dialogs come from
  `@vasakgroup/vue-libvasak`; an application does not draw its own. The shape —
  radii, borders, shadows, states and timings— comes from
  `@vasakgroup/vue-libvasak/tokens.css`. Colors come only from the scheme:
  neither hex values, nor `rgb()`, nor the Tailwind palette. What changes with
  width uses container queries (`@container`, `@sm:`) or a `ResizeObserver`,
  never `sm:`/`md:` or `matchMedia`.

### Icons

`ThemeIcon` from the library, always by **name** and never by path: the icon pack
changes live and its paths are not stable.

```vue
<ThemeIcon name="internet-mail" :size="24" :alt="t('app.nombre')" />
<ThemeIcon name="view-refresh" type="symbol" :size="16" />
```

`type` picks the variant: `icon` is the colored common one and `symbol` the
monochrome one, the one for action buttons. `alt` is empty by default, for when
the icon accompanies a text that already says the same thing; when the icon
**is** the label, it is passed.

## Tests

Every change ships with its tests, in the same commit. What is worth testing is
what breaks quietly: parsers, text truncation, limits, malformed input, plurals
and interpolation markers. The template ships both sides wired up:

- `tests/interpolar.test.ts` — interpolation, with the three `$` cases.
- `tests/design-guard.test.ts` — the design guard: scheme colors, system radii,
  theme icons and no screen breakpoints.
- `src-tauri/tests/locales.rs` — that the catalogs parse, share the same keys,
  hold no empty text and match their markers.
- `src-tauri/src/locales.rs` — language detection.

It is worth checking that a test works by reintroducing the bug on purpose and
watching it fail: a test that always passes proves nothing.

## Building and packaging

```bash
bun run lint          # biome
bun test
cargo test --manifest-path src-tauri/Cargo.toml
bunx --bun tauri build
```

Always build with `tauri build`, never with a bare `cargo build --release`: with
`cargo` the binary ends up pointing at the development server, the page loads
empty and everything looks broken for another reason.

The PKGBUILD needs, besides the `.yml` files, two things:

- `options=('!lto')` — makepkg injects a global `-flto` and the crates that
  compile C or assembly emit bitcode that rustc's linker cannot resolve. Cargo
  already does its own LTO.
- `RUSTFLAGS="-C target-cpu=x86-64"` and `unset CARGO_ENCODED_RUSTFLAGS` — the
  build machine's `target-cpu=native` produces binaries that die with `SIGILL`
  on any older CPU.

## Performance

These applications run on someone's desktop and their JavaScript shares a thread
with drawing: a 30 ms computation is two dropped frames. What we learned:

- **Do not poll when you can listen.** And if polling is needed, pause with
  `document.hidden`: nobody reads a screen that is not on screen.
- **One timer, not N.** One `setInterval` per element multiplies without anyone
  noticing.
