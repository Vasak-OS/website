---
title: "Preguntas Frecuentes"
weight: 20
---

## Instalación y Configuración

### ¿Cómo instalo VasakOS?

VasakOS cuenta con un instalador el cual puedes seguir paso a paso, tambien existen otras distribuciones que utilizan el escritorio de VasakOS cuya instalaciones dependen de su propio instalador

### ¿Qué requisitos necesito?

- **Memoria RAM**: Mínimo 4GB (recomendado 8GB)
- **Almacenamiento**: 100GB
- **Internet**: Necesario

### ¿Vasak Desktop es compatible con [Mi Distribución]?

Vasak Desktop está diseñado para ser compatible con VasakOS y bases Arch, sin embargo es posible migrarlos a otras bases como lo hacen ostras distribuciones:

- ✅ **Arch, Manjaro** - Totalmente soportadas
- ⚠️ **Ubuntu, Debian** - Generalmente compatibles [Trabajando en compatibilidad]
- ⚠️ **Fedora, Almalinux** - Generalmente compatibles
- ⚠️ **openSUSE, Gentoo** - Generalmente compatibles
- ⚠️ **Otras distribuciones** - Depende del sistema base

La compatibilidad depende de que tengas los paquetes necesarios instalados.

### ¿Funciona con Wayland/X11?

Sí, Vasak Desktop actualmente funciona con ambos:

- **Wayland** - Experimental aun en desarrollo
- **X11** - Totalmente soportado

Sin embargo se planea en un futuro solo mantener Wayland para evitar dificultades de mantenibilidad del codigo

Para ver cuál usas:
```bash
echo $XDG_SESSION_TYPE
```

## Uso General

### ¿Dónde encuentro la configuración?

La configuración del sistema se guarda en:
```
~/.config/vasak/vasak.conf
```

Este archivo JSON contiene:
- `dark_mode` - Activar/desactivar modo oscuro
- `gtk_theme` - Tema GTK (ej: "Adwaita", "Adwaita-dark")
- `icon_pack` - Pack de iconos (ej: "Adwaita", "Papirus")
- `cursor_theme` - Tema del cursor

**Nota**: No edites este archivo manualmente. Usa los controles integrados de Vasak Desktop para cambiar estos ajustes.

### ¿Cómo cambio el tema/apariencia?

Vasak Desktop permite configurar:

1. **Modo oscuro/claro** - Alterna desde el control center o el panel
2. **Tema GTK** - Se aplica automáticamente según el modo oscuro
3. **Pack de iconos** - Configurable desde la aplicación de configuración
4. **Tema del cursor** - Configurable desde la aplicación de configuración

Los cambios se aplican inmediatamente mediante `gsettings`.

### ¿Puedo personalizar los atajos de teclado?

Sí, Vasak Desktop incluye un sistema completo de atajos. Usa la aplicación de configuración para:

- Ver todos los atajos disponibles
- Modificar atajos existentes
- Crear atajos personalizados
- Detectar conflictos de atajos

Los atajos se guardan automáticamente en `~/.config/vasak/shortcuts.json`.

### ¿Dónde se guardan las preferencias de usuario?

Las preferencias se guardan en:
```
~/.config/vasak/
```

Archivos principales:
- `vasak.conf` - Configuración del sistema
- `shortcuts.json` - Atajos de teclado personalizados

### ¿Se puede usar con múltiples monitores?

Sí, totalmente soportado. Vasak Desktop:

- Detecta monitores automáticamente
- Extiende el background a todos los monitores
- Maneja aplicaciones en diferentes monitores

## Soporte Adicional

- **Documentación oficial**: https://os.vasak.net.ar/docs
- **Foro de la comunidad**: [URL del foro]
- **Chat**: https://t.me/VasakOS
- **Reportar bugs**: https://github.com/Vasak-OS/vasak-desktop/issues

¿No encontraste tu respuesta? Contacta con la comunidad o crea un issue detallado.
