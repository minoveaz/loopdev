# LoopDev Git Workflow

## Propósito
Este documento define el flujo de trabajo Git de LoopDev para garantizar:
- Estabilidad en `main`.
- Cambios trazables por intención.
- Revisión consistente (PR checklist).
- Compatibilidad con la gobernanza de componentes (Phase Dependency Rule).

---

## 🌿 Ramas

### Rama Estable
- **main**: Rama estable y siempre desplegable.
  - **Regla 1:** No se commitea directo.
  - **Regla 2:** Solo entra vía Pull Request.
  - **Regla 3:** Siempre debe pasar CI.

### Ramas de Trabajo
**Formato:** `tipo/<area>-<tema>`

**Tipos permitidos:**
- **feat/<area>-<tema>**: Nueva funcionalidad (ej: `feat/api-contracts`, `feat/brandhub-assets`).
- **chore/<tema>**: Tooling, refactors no funcionales, documentación.
- **fix/<tema>**: Corrección de bug (ej: `fix/toast-dedupe`).

**Reglas Operativas:**
1. **1 rama = 1 intención principal.**
2. Nombres claros y legibles.
3. Si el cambio afecta UI, debe respetar el **Phase Dependency Rule** (no introducir dependencias hacia fases futuras).

---

## 📦 Pull Requests

### Cuándo abrir un PR
- Cuando el cambio está completo para revisión.
- Cuando el cambio introduce o actualiza contratos (API, tipos, schemas).
- Cuando se quiere mergear a `main`.

### Checklist Obligatoria (DoD)
Antes de mergear, el PR debe cumplir:
- [ ] **Tests pasan** (unit / smoke / integration).
- [ ] **Docs actualizadas** si cambian contratos (@loopdev/contracts, API_STANDARDS, schemas).
- [ ] **No rompe Phase Dependency Rule (UI)**.
- [ ] **Audit-ready**: El cambio está listo para pasar el auditor (03-quality/AUDIT_PROMPT.md).

---

## 📌 Notas Finales
- Los cambios de “estándares” (protocolos, workflow, sistema visual) deben ir en PR separado (`chore/...`) para que sean revisables y trazables de forma aislada.
- Si se detecta una dependencia faltante (**Missing Component Rule**), se detiene el desarrollo del PR y se crea la tarea en la fase correspondiente.

---
*Gobernanza de Plataforma - LoopDev Engineering*
