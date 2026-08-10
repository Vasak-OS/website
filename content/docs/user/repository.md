---
title: "Repositorio de paquetes"
description: "Cómo agregar el repositorio pacman de VasakOS a Arch Linux, importar la clave GPG y usar las aplicaciones de VasakOS sin instalar la distribución completa."
weight: 10
---

VasakOS publica sus paquetes en un repositorio pacman propio llamado **`vasakos`**, firmado
con GPG. Si instalaste desde la ISO ya lo tenés configurado y no necesitás hacer nada:
`sudo pacman -Syu` actualiza todo.

Esta guía es para usar las aplicaciones de VasakOS sobre una instalación de **Arch Linux**
existente, o para reconfigurar el repositorio si algo se rompió.

## Qué hay en el repositorio

El escritorio, las aplicaciones y los servicios de VasakOS: `vasak-desktop`,
`vasak-file-manager`, `vasak-terminal`, `vasak-settings`, `vasak-gallery`,
`vasak-resonance`, `vasak-keyring`, `vasak-flare-daemon`, `polkit-vasak-agent`, el tema de
iconos y los fondos de pantalla. La lista completa con versiones está en
[estado del proyecto](/state/).

No hay paquetes de Arch duplicados: todo lo demás viene de los repositorios oficiales.

## Agregarlo a Arch Linux

### 1. Configuración inicial

Agregá al final de `/etc/pacman.conf`:

```conf
[vasakos]
SigLevel = Optional TrustAll
Server = https://repo.vasak.net.ar/repo/$arch/$repo
```

`Optional TrustAll` es temporal: hace falta para poder instalar el llavero, que es
justamente lo que permite verificar las firmas.

### 2. Instalar el llavero y la lista de mirrors

```bash
sudo pacman -Sy vasakos-keyring vasakos-mirrorlist
sudo pacman-key --populate vasakos
```

### 3. Pasar a la configuración definitiva

Ahora reemplazá el bloque que agregaste por este, que verifica las firmas de verdad y toma
los servidores del paquete de mirrors:

```conf
[vasakos]
Include = /etc/pacman.d/vasakos-mirrorlist
```

```bash
sudo pacman -Syu
```

### 4. Instalar lo que quieras

```bash
sudo pacman -S vasak-desktop vasak-file-manager vasak-terminal
```

## La clave de firma

Los paquetes y la base de datos están firmados con:

```
Joaquin (Pato) Decima (VasakOS Repository Key) <jdecima@vasak.net.ar>
307E04B769840811099F4077ED5D59DA704DEBE2
```

La clave se distribuye en el paquete `vasakos-keyring`, no por descarga suelta: así se
actualiza y se revoca como cualquier otro paquete.

## Problemas frecuentes

**`error: vasakos: signature from ... is unknown trust`**

El llavero no está poblado. Ejecutá:

```bash
sudo pacman-key --populate vasakos
```

**`error: failed retrieving file 'vasakos.db'`**

El mirror no responde o `pacman.conf` apunta a una ruta vieja. Verificá que
`/etc/pacman.d/vasakos-mirrorlist` tenga:

```conf
Server = https://repo.vasak.net.ar/repo/$arch/$repo
```

**Conflictos con paquetes de otro entorno de escritorio**

Las aplicaciones de VasakOS no reemplazan a las de GNOME o KDE, pero sí compiten por ser el
manejador predeterminado de cada tipo de archivo y por implementar servicios D-Bus como el
llavero o el agente de PolicyKit. Si ya tenés `gnome-keyring` corriendo, no instales
`vasak-keyring` sin desactivar el otro primero.

## Para desarrolladores

Los scripts que construyen el repositorio son públicos:

- [PKGBUILDS](https://github.com/Vasak-OS/PKGBUILDS) — los PKGBUILD de cada paquete.
- [repository-script](https://github.com/Vasak-OS/repository-script) — el script que firma
  los paquetes y arma la base de datos.
