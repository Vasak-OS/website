---
title: "Contribución al Proyecto"
weight: 55
description: "Cómo contribuir al desarrollo de VasakOS: reportar un error, proponer una mejora o enviar un pull request."
---

Guía para contribuir al desarrollo de **VasakOS**. Esto aplica a desarrollos propios o comunitarios dentro del mismo entorno. 

## Proceso de Contribución

### Fork y Clone

```bash
# En GitHub, haz Fork del repositorio
# https://github.com/Vasak-OS/vasak-desktop

# Clone tu fork
git clone https://github.com/TU_USUARIO/vasak-desktop.git
cd vasak-desktop

# Añade el repositorio original como remote
git remote add upstream https://github.com/Vasak-OS/vasak-desktop.git
```

### Crea una Rama

```bash
# Actualiza main desde upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crea una rama para tu feature
git checkout -b feature/descripcion-corta

# O para bugfix
git checkout -b bugfix/descripcion-corta

# O para docs
git checkout -b docs/descripcion-corta
```

**Convención de nombres**:
- `feature/feature-name` - Nueva funcionalidad
- `bugfix/bug-name` - Corrección de bug
- `refactor/refactor-name` - Refactorización
- `docs/doc-name` - Documentación
- `chore/chore-name` - Tareas sin código funcional

### Realiza tus Cambios

Realiza los cambios en el proyecto según creas conveninete para lo que estes intentando de resolver, recuerda que puedes utilizar varios commit si quieres organizarte pero evita exederte o que los mismos no tengan sentido. Recopila toda la información que creas importante para PR y para la documentación.

**Checklist**:
- [ ] Código sigue lineamientos
- [ ] Tests pasan
- [ ] Sin errores de linting
- [ ] Documentación actualizada
- [ ] Commits bien descriptos

### Commits

```bash
# Ver cambios
git status

# Añadir cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat(audio): add volume normalization

Implement automatic volume normalization to provide
consistent output levels across different devices.

Closes #1234"
```

**Formato de mensaje** (Conventional Commits):
```
type(scope): subject

body

footer
```

**Tipos**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Ejemplo**:
```
feat(audio): add volume normalization

Implement automatic volume normalization to provide
consistent output levels across different devices.
This prevents audio clipping and improves user
experience when switching between devices.

- Added VolumeNormalizer struct
- Integrated with audio pipeline
- Added unit tests

Closes #1234
Fixes #5678
```

### Push y Pull Request

```bash
# Push tu rama
git push origin feature/descripcion-corta

# En GitHub, crea un Pull Request
# Contra: Vasak-OS/vasak-desktop main
# Desde: TU_USUARIO/vasak-desktop feature/descripcion-corta
```

**Template de PR** (auto-rellenado):

```markdown
## Descripción
Breve descripción de qué hace este PR.

## Tipo de Cambio
- [ ] Nueva funcionalidad
- [ ] Corrección de bug
- [ ] Cambio que rompe compatibilidad
- [ ] Documentación

## Cambios
- Cambio 1
- Cambio 2
- Cambio 3

## Testing
- [ ] Testeado en X11
- [ ] Testeado en Wayland
- [ ] Pruebas unitarias pasadas
- [ ] Pruebas de integración pasadas

## Checklist
- [ ] Mi código sigue los lineamientos
- [ ] He hecho self-review
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] He añadido tests
- [ ] Los tests pasan localmente

## Benchmark (Si aplica)
```

### Revisión y Feedback

- Los mantenedores revisarán tu PR
- Responde a los comentarios
- Haz cambios si es necesario
- Re-quiere revisión cuando hayas hecho cambios

```bash
# Después de cambios
git add .
git commit -m "Address review feedback

- Changed X to Y
- Added comment for Z"

git push origin feature/descripcion-corta
```

### Merge

Una vez aprobado:
- Los mantenedores harán merge de tu PR
- Tu branch se puede eliminar

```bash
# Limpiar local
git checkout main
git branch -d feature/descripcion-corta
git pull upstream main
```

## Tipos de Contribución

### Nuevas Funcionalidades

**Pasos:**
1. Discute en un issue primero
2. Sigue la arquitectura establecida
3. Añade tests
4. Documenta el cambio

### Corrección de Bugs

**Pasos:**
1. Abre un issue describiendo el bug
2. Crea rama desde issue
3. Reproduce el bug con test
4. Arregla el bug
5. Test debe pasar
6. Documenta la corrección

### Documentación

**Archivos:**
- `docs/user/*` - Para usuarios finales | [repo](https://github.com/Vasak-OS/website)
- `docs/devs/*` - Para desarrolladores | [repo](https://github.com/Vasak-OS/website)
- README.md - Para repositorio
- Code comments - Dentro del código

### Mejoras de Performance

**Requerimientos:**
1. Mide antes (con profiler)
2. Implementa mejora
3. Mide después (compara)
4. Añade benchmark si es crítico
5. Documenta cambio

### Tests

**Tipos:**
- Unit tests - Funciones individuales
- Integration tests - Componentes integrados
- E2E tests - Flujo completo del usuario

**Ubicación:**
- `src-tauri/tests/` - Tests de Rust
- `src/tests/` - Tests de Vue

## Reportes de Bugs

Ver [Cómo Reportar Errores](/docs/user/reporte-errores/)

**Requiere**:
- Descripción clara
- Pasos para reproducir
- Comportamiento esperado vs actual
- Sistema operativo y versión
- Logs relevantes

## Código Review

### Como Revisor

Verifica:
- [ ] El código funciona
- [ ] Sigue lineamientos
- [ ] Tiene tests
- [ ] Está documentado
- [ ] No introduce regresiones
- [ ] Performance es aceptable

> Comentario constructivo:
> 
> 
> ❌ "Esto está mal"
> 
> ✅ "Considerar usar X en lugar de Y porque..."
> 

### Como Autor

- Responde a todos los comentarios
- No seas defensivo
- Haz cambios si son mejoras
- Explica tu decisión si no estás de acuerdo
- Agradece el feedback

## Licencia

Toda contribución debe ser compatible con la licencia del proyecto.

Ver `LICENSE` en la raíz del proyecto.

## Comportamiento Esperado

### Código de Conducta

Nos comprometemos a mantener un ambiente respetuoso:

- Sé respetuoso con otros contribuidores
- Acepta crítica constructiva
- Enfócate en el código, no en la persona
- Respeta privacidad
- Reporta abuso

### Si Ves Comportamiento Inapropiado

Contacta a los mantenedores directamente (privadamente).

## Reconocimiento

- Contribuidores serán reconocidos en CONTRIBUTORS.md
- Commits quedan en el historio de Git
- Releases grandes pueden tener changelog especial

## Ayuda y Soporte

### Preguntas sobre Contribución

- Abre una Discusión en GitHub
- Pregunta en el chat comunitario (si existe)

### No Sabes por Dónde Empezar

Busca issues con label:
- `good-first-issue` - Para nuevos contribuidores
- `help-wanted` - Se busca ayuda
- `documentation` - Mejoras de docs

### Necesitas Ayuda

- Menciona a mantenedores con @
- Se específico con tu pregunta
- Comparte código/error si es relevante

## Cambios que No Aceptamos

❌ **No aceptamos**:
- Código que rompe compatibilidad sin versión major
- Cambios que requieren librerías propietarias
- Código que no tiene tests
- Documentación incompleta
- Cambios de estilo sin funcionalidad
- Commits enormes sin descripción

✅ **Aceptamos**:
- Nuevas funcionalidades bien testeadas
- Correcciones de bugs
- Mejoras de performance con evidencia
- Documentación mejorada
- Refactorización que mejora mantenibilidad
- Tests adicionales

## Maintenance

### Si Eres Mantenedor

Responsabilidades:
- Revisar PRs oportunamente
- Mantener código limpio
- Actualizar documentación
- Moderar comportamiento
- Planificar releases

### Merging

```bash
# Antes de merge, verifica:
git checkout main
git pull origin main
git merge --no-ff feature/branch -m "Merge feature/branch"

# Resolve conflicts si existen

git push origin main

# Elimina rama
git push origin --delete feature/branch
```

## Releases

Versionamiento: `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking changes
- `MINOR` - Nuevas funcionalidades
- `PATCH` - Bug fixes

## Próximos Pasos

1. Selecciona una issue o funcionalidad
2. Comenta que trabajarás en ello
3. Sigue este proceso de contribución
4. ¡Gracias por contribuir!

## Recursos

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## Preguntas Frecuentes

**P: ¿Puedo trabajar en múltiples cosas simultáneamente?**
R: Usa ramas diferentes para cada cosa.

**P: ¿Cuánto tiempo toma ver mi PR?**
R: Depende, típicamente 1-3 días.

**P: ¿Qué si mi PR es rechazado?**
R: Se explicarán las razones. Puedes pedir clarificación.

**P: ¿Puedo hacer commit directo?**
R: No, todos pasan por PR (incluso mantenedores).

**P: ¿Dónde veo mis contribuciones?**
R: En tu perfil GitHub y en `git log`.

---

¡Gracias por considerar contribuir a Vasak Desktop! 🎉
