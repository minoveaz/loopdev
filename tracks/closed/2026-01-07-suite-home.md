---
id: suite-home
title: Suite Home System
status: closed
created: 2026-01-07
updated: 2026-08-12
owner: platform
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/suite-home_20260107
---

# Suite Home System

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

# Plan: Suite Home System

## Phase 1: Ideation & Contract (DoR)
- [x] Task: Create directory `src/components/composites/workspace/SuiteHomeLayout`. 38a2622
- [x] Task: Define `userHistories.md` focusing on the Activation Principle. 38a2622
- [x] Task: Create `types.ts` with support for priority swapping. 38a2622
- [~] Task: Conductor - User Manual Verification 'Definition of Readiness'

## Phase 2: Development & Hardening (Chassis)
### A. Structural Blocks
- [x] Task: Implement `SuiteHomeHero` and `SuiteHomeNotices`. 38a2622
- [x] Task: Implement `SuiteHomeQuickStart` and `SuiteHomeInsights`. 38a2622
- [x] Task: Implement `SuiteHomeModules` with status telemetry. 38a2622
- [x] Task: Implement `SuiteHomeActivity` with 3-way responsive layout. 38a2622
### B. Integration
- [x] Task: Assemble `SuiteHomeLayout` with adaptive ordering. 38a2622
- [x] Task: Add Vitest tests and Storybook stories.
- [x] Task: Conductor - User Manual Verification 'DS Chassis Complete'

## Phase 3: Suite Implementation (Marketing Studio)
- [x] Task: Create `marketingStudio.home.config.ts`.
- [x] Task: Implement the `/marketing-studio` landing using the config.
- [x] Task: Verify real data integration (Mocks first, then Supabase contract).
- [x] Task: Conductor - User Manual Verification 'Suite Active'

## Phase 4: Persistence & Certification (DoD)
- [x] Task: Register in `COMPONENT_REGISTRY.json`.
- [x] Task: Apply `CertificationStamp`.
- [x] Task: Update `ENGINEERING_LOG.md`.
- [x] Task: Conductor - User Manual Verification 'Definition of Done'

---

### spec.md

# Especificación: Suite Home System (v2.1)

## 1. Concepto: El Chasis de Activación
`SuiteHomeLayout` no es una landing, es un **Panel de Control Arquitectónico**. Su diseño se basa en la separación de:
- **Columna Principal (8-9 cols):** Trabajo y Acción.
- **Columna Secundaria (3-4 cols):** Conciencia del Sistema y Memoria.

## 2. Grid Lógico y Responsividad
- **Desktop XL (≥1440px):** 12 columnas. Columna principal + Lateral derecha (Timeline).
- **Desktop/Tablet (1024px - 1439px):** 12/8 columnas. Timeline se mueve al final (bloque horizontal).
- **Mobile (<1024px):** 1 columna. Command List style. Timeline en modo Accordion.

## 3. Bloques del Layout (Jerarquía Visual)

### [A] Hero (Orientación) - 96px a 120px
- Saludo industrial, isotipo de suite y línea de contexto dinámica.
- **Visual:** Aireado, sin ruido, `BlueprintBackground` sutil.

### [B] System Notices (Gobernanza)
- Barra delgada de alertas críticas entre el Hero y la Acción.

### [C] Activation Layer (Acción y Control)
- **QuickStart:** Fila de tarjetas pequeñas, bordes 0.5px, alta clicabilidad.
- **Insights:** Métricas grandes con `StatusPulse` integrado para mostrar "vida".

### [D] Module Grid (Navegación)
- Tarjetas medianas con **CTA Explícito** (Continuar | Abrir | Configurar) y telemetría de estado.

### [E] Activity Timeline (Memoria)
- Tipografía `JetBrains Mono`, ultra-compacto.
- Tres modos de renderizado según breakpoint (Lateral | Final | Accordion).

## 4. Criterios de Aceptación
- [ ] Implementar Grid System 12/8/1.
- [ ] Timeline con lógica de reposicionamiento dinámico.
- [ ] Cards de QuickStart con efecto hover "Glow Azul".
- [ ] 100% de cumplimiento con el ADN v3.9 (Gris carbón #181b21, Bordes 0.5px).


---

### metadata.json

```json
{
  "track_id": "suite-home_20260107",
  "type": "feature",
  "status": "new",
  "created_at": "2026-01-07T19:30:00Z",
  "updated_at": "2026-01-07T19:30:00Z",
  "description": "Implement the agnostic SuiteHomeLayout template and the Marketing Studio Home configuration."
}
```
