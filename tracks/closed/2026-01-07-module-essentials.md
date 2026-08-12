---
id: module-essentials
title: Module Essentials Kit Implementation
status: closed
created: 2026-01-07
updated: 2026-08-12
owner: platform
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/module-essentials_20260107
---

# Module Essentials Kit Implementation

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

# Plan: Module Essentials Kit Implementation

## Phase 1: Ideation & Contract (DoR)
- [x] Task: Create component directories for `ModuleHeader`, `ModuleToolbar`, `ModuleSidebar`, and `InspectorPanel`. 487eb95
- [x] Task: Define `userHistories.md` for each component incorporating Bloque 0 rules. 19e6633
- [x] Task: Create `types.ts` for each component based on the approved spec. cee29d2
- [~] Task: Conductor - User Manual Verification 'Definition of Readiness' (Protocol in workflow.md)

## Phase 2: Development & Hardening
### A. ModuleHeader
- [x] Task: Implement Brain/Body for `ModuleHeader` with breadcrumb logic. 487eb95
- [x] Task: Add Vitest tests and Storybook stories.
### B. ModuleToolbar
- [x] Task: Implement Brain/Body for `ModuleToolbar` with situational rendering. d56f86a
- [x] Task: Add Vitest tests and Storybook stories.
### C. ModuleSidebar & InspectorPanel
- [x] Task: Implement the standardized containers for Sidebar and Inspector. 19e6633
- [x] Task: Add Vitest tests and Storybook stories.
- [x] Task: Conductor - User Manual Verification 'Development & Hardening' (Protocol in workflow.md)

## Phase 3: External Audit
- [x] Task: Execute `AUDIT_UI_PROMPT` for the kit. 19e6633
- [x] Task: Verify A11y and Responsive behavior across all 4 components.
- [x] Task: Conductor - User Manual Verification 'Audit Passed' (Protocol in workflow.md)

## Phase 4: Persistence & Certification (DoD)
- [~] Task: Register components in `COMPONENT_REGISTRY.json`.
- [ ] Task: Apply `CertificationStamp` to stories.
- [ ] Task: Update `ENGINEERING_LOG.md`.
- [ ] Task: Conductor - User Manual Verification 'Definition of Done' (Protocol in workflow.md)

---

### spec.md

# Especificación: Module Essentials Kit (v0.1)

## 1. Propósito
Este kit estandariza los componentes "mueble" que se insertan en los slots del `ModuleWorkspace`. El objetivo es garantizar una experiencia de usuario industrial, consistente y de alta densidad en todos los módulos de la plataforma.

## 2. Reglas Globales (ADN LoopDev)
- **Zero Hardcoding:** Uso obligatorio de tokens `--lpd-workspace-*`, `bg-shell-canvas` y `border-border-technical` (0.5px).
- **Jerarquía de Scroll:** El Canvas es el dueño del scroll principal. Sidebar e Inspector tienen scroll interno vía `ScrollArea`. Header y Toolbar son estáticos.
- **Tipografía:** Títulos en `Inter Bold` (700). Metadatos en `JetBrains Mono`.
- **A11y:** `aria-label` obligatorio para acciones icon-only. Orden de tabulación lógico.

## 3. Componentes

### 3.1 ModuleHeader (`headerSlot`)
- **Función:** Orientación y contexto jerárquico.
- **Visual:** Altura fija (token), fondo con `backdrop-blur-md`, borde inferior de 0.5px.
- **Zonas:**
    - **Left:** Botón Back (opcional) + Título + Breadcrumbs jerárquicos.
    - **Center:** Tabs o controles de vista de alto nivel (opcional).
    - **Right:** Pill de estado (`{ DRAFT }`) + Acciones de orientación.

### 3.2 ModuleToolbar (`toolbarSlot`)
- **Función:** Control operativo del Canvas.
- **Comportamiento:** Situacional (no se renderiza si está vacío). No scrollea.
- **Zonas:**
    - **Left:** Búsqueda local y filtros primarios.
    - **Center:** Toggles de vista (List/Grid/Kanban).
    - **Right:** Acciones en masa (Bulk) y toggles de paneles laterales.

### 3.3 ModuleSidebar (`sidebarSlot`)
- **Función:** Contenedor de navegación interna.
- **Visual:** Fondo sólido `bg-shell-canvas`, sin bordes externos (los gestiona el chasis).
- **Contenido:** Búsqueda local, árbol de navegación (NavGroups) y links secundarios.

### 3.4 InspectorPanel (`inspectorSlot`)
- **Función:** Contexto profundo y propiedades.
- **Visual:** Cabecera estándar con título y botón de cierre único.
- **Contenido:** Secciones de metadatos, auditoría y asistentes de IA.

## 4. Requerimientos Técnicos
- **Patrón:** Composite Components en `ds/packages/ui`.
- **Arquitectura:** Separación estricta Brain/Body.
- **Responsive:** Soporte nativo para modo Overlay (Mobile < 1024px).

## 5. Criterios de Aceptación
- [ ] Los 4 componentes respetan las alturas y anchos definidos por tokens de CSS.
- [ ] El `ModuleHeader` muestra breadcrumbs con truncamiento inteligente.
- [ ] El `ModuleToolbar` desaparece visualmente si no tiene slots hijos.
- [ ] El `InspectorPanel` gestiona su propio cierre mediante un botón certificado.
- [ ] 100% de cumplimiento con el "Bloque 0" (ADN visual v3.9).


---

### metadata.json

```json
{
  "track_id": "module-essentials_20260107",
  "type": "feature",
  "status": "new",
  "created_at": "2026-01-07T15:00:00Z",
  "updated_at": "2026-01-07T15:00:00Z",
  "description": "Implement standard furniture for ModuleWorkspace: ModuleHeader, ModuleToolbar, ModuleSidebar, and InspectorPanel."
}
```
