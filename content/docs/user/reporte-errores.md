# Cómo Reportar Errores - Vasak Desktop

## Antes de Reportar

Antes de reportar un error, verifica si ya ha sido reportado:

1. Visita [GitHub Issues de Vasak Desktop](https://github.com/Vasak-OS/vasak-desktop/issues)
2. Usa la búsqueda para encontrar problemas similares
3. Si encuentras un issue parecido, añade un comentario con tu información

## Información Necesaria para un Buen Reporte

Un buen reporte de error debe incluir:

### 1. Descripción del Problema
- Qué intentabas hacer cuando ocurrió el error
- Qué esperabas que sucediera
- Qué sucedió realmente
- ¿Se puede reproducir? (Sí/No/A veces)

### 2. Información del Sistema

```bash
# Copia y pega el resultado de estos comandos
echo "=== SISTEMA ===" 
uname -a

echo -e "\n=== DISTRIBUCIÓN ==="
cat /etc/os-release | grep PRETTY_NAME

echo -e "\n=== VERSIÓN DE VASAK DESKTOP ==="
vasak-desktop --version 2>/dev/null || echo "No instalada globalmente"

echo -e "\n=== GESTOR DE SESIÓN ==="
echo $XDG_SESSION_TYPE

echo -e "\n=== PANTALLAS ==="
xrandr --query 2>/dev/null | grep connected || wayland-info 2>/dev/null | head -20
```

### 3. Pasos para Reproducir

Lista los pasos exactos para reproducir el error:

```
1. Abre la aplicación
2. Ve a [Menú/Opción]
3. Haz clic en [Botón]
4. El error ocurre aquí
```

### 4. Logs Relevantes

Recopila los logs siguiendo esta guía:

```bash
# Ejecutar la aplicación con logs detallados
RUST_LOG=debug vasak-desktop 2>&1 | tee ~/vasak-debug-$(date +%Y%m%d-%H%M%S).log

# Reproducer el error, luego captura el archivo de log
```

Incluye tanto:
- El archivo de log generado
- La salida de la terminal donde ejecutaste el comando

### 5. Adjuntos Útiles

Si es relevante, incluye:
- **Captura de pantalla** - Muestra el estado visual del error
- **Video** - Si es difícil de reproducir en texto
- **Archivo de configuración** - Si el error está relacionado con configuración
  ```bash
  cat ~/.config/vasak/system_config.json
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
- OS: [ej: Linux - Fedora 40]
- Versión Vasak Desktop: [ej: 0.5.2]
- Tipo de Sesión: [X11 / Wayland]
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
$(vasak-desktop --version 2>/dev/null || echo "Desconocida")

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

### 1. Captura el Core Dump

```bash
# Habilitar core dumps
ulimit -c unlimited

# Ejecutar Vasak Desktop
vasak-desktop

# Si se crashea, captura el core dump
coredumpctl list
coredumpctl info [number]
```

### 2. Recolecta Información de Debug

```bash
# Ejecutar con máxima verbosidad
RUST_LOG=trace RUST_BACKTRACE=1 vasak-desktop 2>&1 | tee crash-$(date +%s).log

# Reproduce el crash
```

### 3. Adjunta al Reporte

- El archivo de log completo
- Salida de `coredumpctl info`
- Información del sistema

## Errores de Hardware/Periféricos

Si el error es relacionado con:

### Bluetooth

```bash
# Captura información de Bluetooth
hciconfig -a
bluetoothctl show
journalctl --user -u bluetooth -n 100
```

### Audio (PulseAudio)

```bash
# Información de audio
pactl info
pactl list sinks short
pactl list sources short
journalctl --user | grep -i pulse | tail -50
```

### Red/WiFi

```bash
# Información de red
nmcli device
nmcli radio
journalctl --user | grep -i network | tail -50
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

- **GitHub Issues** (Recomendado): https://github.com/Vasak-OS/vasak-desktop/issues
- **Foro de Vasak OS**: [Si existe]
- **Matrix/Discord**: [Si existe canal oficial]

## Información de Contacto

Para errores de seguridad críticos, contacta a:
- **Security Email**: [Si existe]
- **No crear issue público** para vulnerabilidades de seguridad
