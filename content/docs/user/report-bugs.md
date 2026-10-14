---
title: "Cómo reportar errores"
weight: 50
description: "Qué información incluir en un reporte de error de VasakOS para que se pueda reproducir y arreglar."
aliases: ["/docs/user/reporte-errores/"]
---

> **¿Es un problema de seguridad?** Entonces esta página no es la que buscas.
> No abras un issue público: deja el problema a la vista de cualquiera mientras
> todavía no hay arreglo. Va por el reporte privado, y está explicado en
> [Seguridad](/docs/user/security/).

## Antes de Reportar

Antes de reportar un error, verifica si ya ha sido reportado:

1. Visita [GitHub Issues de Vasak Desktop](https://github.com/Vasak-OS/vasak-desktop/issues)
2. Usa la búsqueda para encontrar problemas similares
3. Si encuentras un issue parecido, añade un comentario con tu información

## Información Necesaria para un Buen Reporte

Un buen reporte de error debe incluir:

### Descripción del Problema
- Qué intentabas hacer cuando ocurrió el error
- Qué esperabas que sucediera
- Qué sucedió realmente
- ¿Se puede reproducir? (Sí/No/A veces)

### Información del Sistema

```bash
# Copia y pega el resultado de estos comandos
echo "=== SISTEMA ==="
uname -a

echo -e "\n=== DISTRIBUCIÓN ==="
grep PRETTY_NAME /etc/os-release

echo -e "\n=== VERSIÓN DE VASAK-DESKTOP ==="
pacman -Q vasak-desktop 2>/dev/null || echo "No instalado"

echo -e "\n=== SESIÓN ==="
echo "$XDG_SESSION_TYPE ($XDG_CURRENT_DESKTOP)"
```

### Pasos para Reproducir

Lista los pasos exactos para reproducir el error:

```
1. Abre la aplicación
2. Ve a [Menú/Opción]
3. Haz clic en [Botón]
4. El error ocurre aquí
```

### Logs Relevantes

Los mensajes se copian desde el **Monitor del sistema**, en la pantalla **Registros** (ver
[Errores y registros en el monitor](/docs/user/monitoring/)):

1. Abre **Monitor del sistema → Registros**.
2. En **Aplicación** deja **Todo el ecosistema** y activa **Sólo errores**.
3. Reproduce el error y copia los mensajes del momento, con la hora.

Si el escritorio no arranca, los mismos mensajes salen del diario con `journalctl`, como
cuenta [El escritorio no arranca](/docs/user/errors/). Y si el fallo es del propio
escritorio, su archivo del día trae más detalle:
`~/.local/share/vasak-desktop/logs/vasak-desktop-AAAA-MM-DD.log`.

### Adjuntos Útiles

Si es relevante, incluye:
- **Captura de pantalla** - Muestra el estado visual del error
- **Video** - Si es difícil de reproducir en texto
- **Archivo de configuración** - Si el error está relacionado con configuración
  ```bash
  cat ~/.config/vasak/vasak.conf
  ```

## Plantilla para Reporte

Usa esta plantilla al crear un issue:

```markdown
## Descripción del Problema
[Describe aquí qué está mal]

## Pasos para Reproducir
1. [Primer paso]
2. [Segundo paso]
3. [Paso donde ocurre el error]

## Comportamiento Esperado
[Qué debería suceder]

## Comportamiento Actual
[Qué sucede realmente]

## Información del Sistema
- OS: [ej: VasakOS (Arch Linux)]
- Versión de vasak-desktop: [salida de `pacman -Q vasak-desktop`]
- Tipo de Sesión: Wayland
- GPU: [ej: NVIDIA / AMD / Intel]

## Logs
[Adjunta los logs relevantes aquí]
\`\`\`
[Contenido del log]
\`\`\`

## Adjuntos
- [ ] Captura de pantalla
- [ ] Video
- [ ] Archivo de configuración
```

## Crear un Issue en GitHub

### Paso 1: Reúne tu Información

```bash
# Crea un archivo con toda la información
cat > ~/vasak-reporte.md << 'EOF'
## Descripción
[Tu descripción aquí]

## Sistema
$(uname -a)
$(cat /etc/os-release | grep PRETTY_NAME)

## Versión
$(pacman -Q vasak-desktop 2>/dev/null || echo "Desconocida")

## Logs
EOF
```

### Paso 2: Ve a GitHub

1. Abre https://github.com/Vasak-OS/vasak-desktop/issues/new
2. Haz clic en "New Issue"
3. Selecciona "Bug Report" (si hay plantillas)
4. Rellena la información

### Paso 3: Proporciona Contexto

- **Título claro:** No usar "Error", "Bug" o "No funciona"
  - ❌ Malo: "Error con el panel"
  - ✅ Bueno: "Panel desaparece cuando se conecta monitor externo"

- **Descripción detallada:** Más detalles = más fácil de arreglar

- **Logs:** Copia los logs relevantes entre triple backticks

## Errores Críticos (Crash de la Aplicación)

Si la aplicación se cierra inesperadamente:

### Captura el Core Dump

```bash
# Habilitar core dumps
ulimit -c unlimited

# Ejecutar Vasak Desktop
vasak-desktop

# Si se crashea, captura el core dump
coredumpctl list
coredumpctl info [number]
```

### Recolecta Información de Debug

El archivo del día del escritorio ya trae el detalle del cierre: reproduce el fallo y
adjunta `~/.local/share/vasak-desktop/logs/vasak-desktop-AAAA-MM-DD.log` junto con la salida
de `coredumpctl info`. Los mensajes de las demás aplicaciones se copian desde
**Monitor del sistema → Registros**.

### Adjunta al Reporte

- El archivo de log completo
- Salida de `coredumpctl info`
- Información del sistema

## Errores de Hardware/Periféricos

Si el error es relacionado con:

### Bluetooth

```bash
# Captura información de Bluetooth
rfkill list bluetooth
bluetoothctl show
journalctl -u bluetooth -n 100
```

### Audio (PipeWire)

```bash
# Información de audio
wpctl status
systemctl --user status pipewire wireplumber --no-pager
journalctl --user -u wireplumber | tail -50
```

### Red/WiFi

```bash
# Información de red
nmcli device
nmcli radio
journalctl -u NetworkManager | tail -50
```

## Seguimiento del Reporte

Después de reportar:

1. **Responde preguntas** - Los desarrolladores pueden pedir más información
2. **Prueba soluciones** - Si sugieren una, pruébala y reporta el resultado
3. **Verifica en versiones nuevas** - El error podría estar arreglado en la siguiente versión
4. **Cierra si se resuelve** - Cuando se arregle, puedes cerrar el issue

## Consejos para Mejores Reportes

✅ **Haz:**
- Ser específico y detallado
- Incluir logs relevantes
- Ser cortés y respetuoso
- Actualizar con información nueva
- Probar con versiones nuevas

❌ **No hagas:**
- Reportar "no funciona" sin detalles
- Incluir logs de 10,000 líneas sin filtrar
- Ser grosero o exigente
- Reportar el mismo error múltiples veces
- Cambiar completamente el tema del issue

## Canales de Reporte Alternativos

- **GitHub Issues**: https://github.com/Vasak-OS/vasak-desktop/issues
- **Foro de VasakOS**: *Aún no disponible*
- **Telegram**: https://t.me/VasakOS
- **Discord**: *Aún no disponible*

## Información de Contacto

Para errores de seguridad críticos, contacta a:
- **Security Email**: os@vasak.net.ar
- **No crear issue público** para vulnerabilidades de seguridad
