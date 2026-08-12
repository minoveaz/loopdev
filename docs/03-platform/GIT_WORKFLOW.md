# LoopDev Git Workflow

## Propósito

Este documento define el flujo de trabajo Git de LoopDev para garantizar:

- Estabilidad en `main`.
- Cambios trazables por intención.
- Revisión consistente (PR checklist).
- Compatibilidad con la gobernanza de componentes (Phase Dependency Rule).
- Integración controlada en `develop` antes de publicar en `main`.

---

## 🌿 Ramas

### Ramas protegidas

### Rama de integración

- **develop**: rama de integración y validación de cambios aprobados.
  - **Regla 1:** no se commitea ni se hace push directo.
  - **Regla 2:** los cambios entran mediante Pull Request.
  - **Regla 3:** siempre debe pasar CI y revisión requerida.

### Rama estable

- **main**: Rama estable y siempre desplegable.
  - **Regla 1:** no se commitea ni se hace push directo.
  - **Regla 2:** solo recibe cambios mediante PR de release desde `develop`.
  - **Regla 3:** siempre debe pasar CI y revisión adicional.

### Ramas de Trabajo

**Formato:** `tipo/<area>-<tema>`

**Tipos permitidos:**

- **feature/<area>-<tema>**: nueva funcionalidad (ej: `feature/api-contracts`, `feature/brandhub-assets`).
- **fix/<area>-<tema>**: corrección de bug (ej: `fix/ui-toast-dedupe`).
- **chore/<area>-<tema>**: tooling, refactors no funcionales o mantenimiento.
- **docs/<area>-<tema>**: documentación.
- **test/<area>-<tema>**: tests y herramientas de validación.

**Reglas Operativas:**

1. **1 rama = 1 intención principal.**
2. Las ramas se crean desde el último `develop` actualizado.
3. Los nombres deben ser claros y legibles.
4. Si el cambio afecta UI, debe respetar el **Phase Dependency Rule** (no introducir dependencias hacia fases futuras).
5. Las ramas de estándares, workflows y Design System deben mantenerse separadas de cambios de producto no relacionados.

La convención se valida automáticamente en cada Pull Request. Los nombres deben usar minúsculas, palabras separadas por guiones y un único prefijo permitido. Las ramas protegidas `develop` y `main` son excepciones.

## Commits

Los commits son unidades coherentes, revisables y reversibles. Se utiliza Conventional Commits:

```text
type(scope): descripción breve en imperativo
```

Tipos habituales: `feat`, `fix`, `chore`, `docs`, `test`, `refactor` y `perf`.

El scope es obligatorio para commits de trabajo y debe ser una palabra o ruta corta en minúsculas. La descripción debe comenzar después de `: ` y no terminar en punto. Los commits de merge generados por la plataforma quedan fuera de esta regla cuando no forman parte del rango de trabajo de un Pull Request.

Se hace commit cuando una unidad funcional, visual o documental está completa y pasa su validación focalizada. No se agrupan todas las tareas de una rama en un único commit ni se crean commits por cada cambio mínimo de estilo.

Antes de confirmar:

```bash
git status
git diff --stat
git diff --cached --check
```

### Hooks locales

Activa los hooks del repositorio una vez en cada clon:

```bash
pnpm hooks:install
```

Los hooks validan mensajes de commit, whitespace staged, nombres de rama y pushes directos a `develop` o `main`. El `pre-push` solo ejecuta comprobaciones rápidas; lint, auditoría frontend, typecheck, tests y build completos pertenecen a CI.

Los cambios generados por builds, archivos locales previos, secretos y cambios de otras tareas deben revisarse y mantenerse fuera del commit salvo decisión explícita.

---

## 📦 Pull Requests

### Título

El título del PR debe usar el mismo formato que un commit:

```text
type(scope): descripción breve en imperativo
```

Ejemplos:

```text
feat(shell): add module shell contract
chore(governance): standardize Git workflow
fix(marketing): restore asset navigation
```

El PR debe incluir `Closes #<id>` o `Refs #<id>` cuando exista una Issue asociada. La validación automática comprueba el título, la rama de origen y todos los commits propios del PR.

### Cuándo abrir un PR

- Cuando el cambio está completo para revisión.
- Cuando el cambio introduce o actualiza contratos (API, tipos, schemas).
- Cuando la unidad de trabajo tiene validación local suficiente.
- Cuando se quiere integrar una rama en `develop`.

El PR hacia `main` se reserva para releases desde `develop` y requiere validación y aprobación adicionales.

### Checklist Obligatoria (DoD)

Antes de mergear, el PR debe cumplir:

- [ ] **Tests pasan** (unit / smoke / integration).
- [ ] **Docs actualizadas** si cambian contratos (@loopdev/contracts, API_STANDARDS, schemas).
- [ ] **No rompe Phase Dependency Rule (UI)**.
- [ ] **Audit-ready**: El cambio está listo para pasar el auditor (03-quality/AUDIT_PROMPT.md).
- [ ] La rama tiene una única intención y usa la convención aprobada.
- [ ] Los commits usan Conventional Commits y no mezclan cambios no relacionados.
- [ ] Se ejecutaron las validaciones requeridas para el tipo de cambio.
- [ ] El PR describe riesgos, contratos, migraciones, RLS, secretos e integraciones afectadas.
- [ ] En cambios frontend se confirma que no se modifican Supabase, migraciones, RLS ni persistencia real sin autorización.

---

## 📌 Notas Finales

- Los cambios de “estándares” (protocolos, workflow, sistema visual) deben ir en PR separado (`chore/...`) para que sean revisables y trazables de forma aislada.
- Si se detecta una dependencia faltante (**Missing Component Rule**), se detiene el desarrollo del PR y se crea la tarea en la fase correspondiente.
- La convención de rama preferida usa `feature/`; `feat` se mantiene como tipo de commit.
- El flujo normal es `develop` -> PR validado -> `main` mediante release.

---

_Gobernanza de Plataforma - LoopDev Engineering_
