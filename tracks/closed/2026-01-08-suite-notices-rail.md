---
id: suite-notices-rail
title: System Notice Rail
status: closed
created: 2026-01-08
updated: 2026-08-12
owner: platform
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/suite-notices-rail_20260108
---

# System Notice Rail

## Outcome

Track histórico consolidado. El resultado y la evidencia original se preservan a continuación.

## Fases

Las fases históricas se conservan en el historial migrado.

## Criterios de cierre

- [x] Consolidado en el sistema de tracks de un archivo.
- [x] Cerrado por la política de migración aprobada explícitamente por el usuario el 2026-08-12.

## Cierre

Cerrado durante la migración de gobernanza de tracks con aprobación explícita del usuario.

## Historial migrado

### plan.md

# Plan: System Notice Rail

## Phase 1: Foundations & Contract
- [~] Task: Define `SuiteNotice` type and update `types.ts` in `SuiteHomeLayout`.
- [~] Task: Scaffold `SystemNoticeRail` component (agnostic).
- [ ] Task: Conductor - User Manual Verification 'Definition of Readiness'

## Phase 2: Industrialization & Visuals
- [x] Task: Implement the 0.5px border and semantic alpha backgrounds.
- [x] Task: Integrate Material Symbols with custom weight (Lab standard).
- [x] Task: Add technical link-buttons for actions.

## Phase 3: Intelligence & Behavior
- [x] Task: Implement priority sorting logic (danger > warning > info).
- [x] Task: Implement `maxVisible: 1` logic with expand/collapse.
- [x] Task: Implement local dismissal logic.

## Phase 4: Validation & Certification
- [x] Task: Integrate into `SuiteHomeLayout` and `Marketing Studio`.
- [x] Task: Write tests and Storybook stories.
- [x] Task: Conductor - User Manual Verification 'Definition of Done'

---

### spec.md

# Especificación: System Notice Rail (v1.0)

## 1. Propósito
El `SystemNoticeRail` es un componente de infraestructura diseñado para la **Gobernanza Operativa**. Proporciona avisos accionables y no bloqueantes sobre el estado del sistema, límites de uso o necesidades de mantenimiento.

## 2. Anatomía Visual (Industrial Grade)
- **Altura Base:** 40px (Compact Mode).
- **Contenedor:**
    - Fondo con Alpha (6-10%) para permitir visibilidad de la grilla inferior.
    - Borde técnico de 0.5px (`border-border-technical`).
    - Esquinas: `rounded-xl`.
    - Sin sombras "soft"; solo bordes definidos y glow sutil.
- **Jerarquía Interna:**
    - `SeverityDot/Icon` → `Title` → `Description` (Opcional) → `Actions` → `Dismiss`.

## 3. Lógica de Sistema (Agnóstica)
- **Severidades:** `danger`, `warning`, `info`, `success`.
- **Ámbitos (Scope):** `system`, `suite`, `module`, `integration`.
- **Priorización:** El rail ordena automáticamente los avisos por severidad (`danger > warning > info`).
- **Visibilidad:** Máximo 1 aviso visible por defecto (expandible mediante popover/drawer).

## 4. Comportamiento e Interacción
- **Dismissible:** Configurable por aviso.
- **Persistencia:** Los avisos cerrados se guardan en el estado de sesión (o localStorage).
- **Acciones:** Cada aviso requiere un `Primary CTA` obligatorio orientado a la resolución inmediata (ej: "Reconectar", "Recargar").

## 5. Criterios de Aceptación
- [ ] Implementar el motor de ordenamiento por severidad.
- [ ] Soporte para fondo con transparencia y borde de 0.5px.
- [ ] Responsive: Adaptar el layout en móviles a una estructura más vertical o simplificada.
- [ ] API limpia: Cero lógica de dominio (ej: "Marketing") dentro del componente base.

---

### userHistories.md

# User Histories: System Notice Rail

**Component:** SystemNoticeRail
**Strategic Goal:** Operational Awareness without friction.

## 🧬 Bloque 0: ADN Industrial
1. **Infrastructure Feel:** El componente no debe parecer una "alerta de bootstrap". Debe sentirse como una parte integral del chasis (`bg-shell-canvas` + alpha).
2. **Technical Contrast:** Uso de tipografía `Inter Medium` para el título y `JetBrains Mono` (opcional) para descripciones técnicas.

## 📚 Historias de Usuario

### A. Conciencia de Estado (Status Awareness)
1. **Claridad de Riesgo:** Como administrador, quiero que el color del rail cambie según la severidad del aviso para saber instantáneamente la urgencia de la tarea.
2. **Contexto de Origen:** Como usuario, quiero ver el icono del ámbito (ej: una pieza de puzzle para una integración caída) para saber exactamente qué parte del sistema necesita atención.

### B. Acción y Gobernanza (Actionable Governance)
1. **Resolución Inmediata:** Como usuario, quiero un botón de acción directa dentro del rail para solucionar el problema sin tener que buscar en el menú.
2. **Limpieza de Espacio:** Como usuario, quiero poder cerrar avisos informativos que ya he leído para mantener mi espacio de trabajo limpio.

### C. Inteligencia de Sistema (System Intelligence)
1. **Autogestión de Prioridad:** Como sistema, si hay varios avisos, quiero mostrar siempre el de mayor peligro (`danger`) para proteger la integridad operativa.
2. **Adaptabilidad de Pantalla:** Como usuario móvil, quiero que el rail sea compacto pero legible, ocultando la descripción si el espacio es crítico.

## 📐 Criterios de Aceptación Técnicos
- [ ] Soporte para `maxVisible: 1`.
- [ ] Las acciones deben ser del tipo "link-button técnico" (minimalistas).
- [ ] Los bordes deben ser de 0.5px.


---

### metadata.json

```json
{
  "track_id": "suite-notices-rail_20260108",
  "type": "refactor",
  "status": "new",
  "created_at": "2026-01-08T09:00:00Z",
  "updated_at": "2026-01-08T09:00:00Z",
  "description": "Refactor SuiteHomeNotices into SystemNoticeRail: an industrial infrastructure piece for operational governance."
}
```
