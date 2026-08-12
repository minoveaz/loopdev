---
id: brand-hub-operation
title: Brand Hub Operation
status: closed
created: 2026-01-08
updated: 2026-08-12
owner: marketing-studio
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/brand-hub-operation_20260108
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Brand Hub Operation

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

# Plan: Brand Hub Operation

## Phase 1: Chasis & Architecture (The Foundation)
- [x] Task: Implement Route Groups and Nested Layouts (brand-hub/layout + brands/[brandId]/layout). 8a34dd9
- [x] Task: Implement "Focus Enforcement" (SuiteSidebar -> Rail when in Brand Hub). 8a34dd9
- [x] Task: Define the State Machine for Panels (sidebarMode, flyout, inspector). 8a34dd9
- [x] Task: Create the "Shell" version of the Inspector with basic tabs. 8a34dd9
- [x] Task: Conductor - User Manual Verification 'Chasis Operational'

## Phase 2: High-Fidelity Furniture (Nivel 2.5)
- [x] Task: Implement `ModuleHeader` with dynamic breadcrumbs. 8a34dd9
- [x] Task: Implement `ModuleSidebar` with searchable brand list (Module Mode). 8a34dd9
- [x] Task: Implement `ModuleSidebar` with Brand Spine (Brand Mode). 8a34dd9
- [x] Task: Implement `SidebarFlyout` with Learn/Navigate modes. 8a34dd9
- [x] Task: Implement `ModuleToolbar` (BrandToolbar) with state-aware actions. 3688a46

## Phase 3: The "Brain" (Inspector & Governance)
- [x] Task: Define Global Inspector Types (`InspectorContext`, `Intent`). 3688a46
- [x] Task: Create `UnifiedInspector` (Shell Component). 3688a46
- [x] Task: Create Reusable UI Blocks (`ContextBlock`, `ImpactBlock`, `DiffBlock`). 3688a46
- [x] Task: Implement `BrandInspector` renderer using Blocks. 3688a46
- [x] Task: Integrate Inspector with Layout and Toolbar actions. 3688a46

## Phase 4: Data & Interaction (Real Operation)
- [x] Task: Create `useBrands` and `useActiveBrand` hooks (Supabase). 8a34dd9
- [x] Task: Implement "Selection Sync" (Layout -> Inspector Context). 3688a46
- [x] Task: Add "Read-only" enforcement for Published versions. 8a34dd9
- [x] Task: Add loading states (Skeletons) for all panels. 8a34dd9

## Phase 5: Validation & Certification
- [x] Task: Perform UI Audit for v3.9 compliance.
- [x] Task: Verify responsive behavior and layout heights.
- [ ] Task: Create E2E Tests for Critical Flows (Inspector, Toolbar).
- [ ] Task: Update `ENGINEERING_LOG.md`.
- [ ] Task: Conductor - User Manual Verification 'Brand Hub Certified'

---

### spec.md

# Especificación: Brand Hub Operativo (v2.0)

## 1. Propósito
Implementar la navegación y el layout definitivo del Brand Hub siguiendo el contrato de rutas v1.0. El sistema gestiona dos modos operativos: **Module Mode** (Contexto Global) e **Identity Mode** (Contexto de Marca), orquestados por un `ModuleWorkspace` que integra navegación, intención y consecuencia.

## 2. Estructura de Rutas y Mapping
- **Global Anchor:** `/marketing-studio/brand-hub/overview`.
- **Foco:** `SuiteSidebar` colapsa automáticamente a modo **Rail** en cualquier ruta bajo `/brand-hub`.

## 3. Arquitectura de Paneles (The 4-Pane System)

### 3.1 ModuleSidebar (Navegación & Ontología)
Este componente muta según el modo:
- **Module Mode:** Lista virtualizada de marcas con búsqueda y badging de estado (`{ DRAFT }`).
- **Brand Mode:** Árbol de navegación semántico (Identity, Visual, Rules, Governance).

### 3.2 SidebarFlyout (Significado)
- **Rol:** Panel explicativo "Learn & Navigate".
- **Contenido:** Guías semánticas que explican *qué* es la sección actual antes de entrar en detalle.

### 3.3 ModuleToolbar (Intención)
El puente entre intención y decisión. Altura fija industrial (44px).

**Máquina de Estados:**
1.  **Directory Mode:** Filtros globales + "Create Brand".
2.  **Read-Only Mode:** Acciones de análisis ("Compare", "Impact") + "Create Draft".
3.  **Draft Mode:** Acciones de trabajo ("Save", "Discard") + "Request Approval".
4.  **Governance:** Acciones de decisión ("Approve", "Reject") -> Disparan Inspector.

### 3.4 ModuleInspector (Consecuencia - NUEVO)
El cerebro de consecuencias. Responde a "¿Qué implica esto?".

**Arquitectura:**
- **Shell:** `UnifiedInspector` (gestiona Tabs, Header, Close).
- **Renderer:** `BrandInspector` (inyecta contenido específico del módulo).
- **Blocks (DS):** Componentes UI estandarizados en `@loopdev/ui`:
    - `ContextBlock`: Metadatos clave-valor.
    - `ImpactBlock`: Alerta visual de radio de explosión (Blast Radius).
    - `DiffBlock`: Visualización simplificada de cambios (+/-).
    - `GovernanceBlock`: Cadena de custodia y aprobación.

**Contrato de Datos:**
Todo el inspector se hidrata desde un objeto `InspectorContext`:
```ts
{
  intent: 'inspect' | 'impact' | 'compare';
  mode: 'read' | 'draft' | 'locked';
  entity: { type: string; id: string; ... };
  permissions: { canEdit: boolean; ... };
}
```

## 4. Reglas Técnicas de Estado (Zero Bugs)
1. **URL-First State:** El `brandId` y la `view` se derivan siempre de la ruta.
2. **State Machine de Paneles:** Definición estricta de estados para Sidebar, Flyout e Inspector.
3. **Selection Sync:** Si se selecciona un item en el Canvas (o Toolbar), el Inspector se abre automáticamente en la tab relevante.
4. **No Orphan Panels:** Al cambiar de marca, se resetea el `entityRef` del Inspector.

## 5. Criterios de Aceptación (Checklist de Ingeniería)
- [x] Transición suave Module Mode <-> Brand Mode.
- [x] Toolbar muestra acciones contextuales correctas (Draft vs Published).
- [x] Inspector utiliza bloques reutilizables del Design System.
- [x] Alturas sincronizadas (Header 56px, Toolbar 44px).
- [x] 100% Compliance con ADN v3.9 (Bordes, Sombras, Tipografía).

---

### userHistories.md

# User Histories: Brand Hub Operation (v2.0)

**Strategic Goal:** "Operability through Structured Meaning & Contextual Consequence"

## 🧬 Bloque 0: ADN de Composición
1. **Hierarchical Flow:** El usuario nunca debe dudar de si está viendo el módulo o una marca específica.
2. **State Reactivity:** El Inspector es el espejo del trabajo realizado en el Canvas.

## 📚 Historias de Usuario

### [A] Navegación y Descubrimiento
1. **[NAVEGACIÓN] Transición de Niveles**
   - **HU:** Como usuario, quiero entrar en `/brands` y seleccionar una marca, viendo cómo mi entorno (Sidebar/Toolbar) cambia instantáneamente al contexto de esa marca.
2. **[EXPLORACIÓN] Sidebar Search**
   - **HU:** Como usuario, quiero filtrar la lista de marcas escribiendo en el sidebar para encontrar rápidamente un item específico.
3. **[APRENDIZAJE] Contextual Flyout**
   - **HU:** Como usuario novel, al navegar por "Visual System", quiero ver una guía rápida en el Flyout que me explique los conceptos antes de editar.

### [B] Intención Operativa (Toolbar)
4. **[INTENCIÓN] Read-Only Safety**
   - **HU:** Como usuario en una marca publicada, quiero ver claramente "Create Draft" como acción principal, entendiendo que no puedo romper nada accidentalmente.
5. **[INTENCIÓN] Draft Efficiency**
   - **HU:** Como editor, quiero tener botones accesibles para "Save" y "Request Approval" en la barra superior.
6. **[INTENCIÓN] Impact Awareness**
   - **HU:** Como usuario, quiero un botón de "Impact" que me lleve directamente al análisis de consecuencias antes de hacer cambios.

### [C] Consecuencia y Gobernanza (Inspector)
7. **[INSPECT] Entity Context**
   - **HU:** Como usuario, al seleccionar un objeto o abrir el panel de info, quiero ver sus metadatos (Autor, Versión) en un formato estandarizado.
8. **[IMPACT] Blast Radius**
   - **HU:** Como arquitecto, quiero ver una tarjeta de alerta (Amarilla/Roja) indicando cuántos módulos se verán afectados si modifico esta marca.
9. **[DIFF] Visual Comparison**
   - **HU:** Como revisor, quiero ver un bloque de "Diff" que me muestre qué se añadió (+) y qué se eliminó (-) en este borrador.
10. **[GOVERNANCE] Approval Chain**
    - **HU:** Como manager, quiero ver el estado de la cadena de aprobación (Quién aprobó, Quién falta) en el panel de gobernanza.

### [D] Resiliencia Técnica
11. **[ESTADO] Persistencia**
    - **HU:** Si refresco la página con el Inspector abierto en la pestaña "Impact", quiero que el sistema restaure ese estado exacto.

## 📐 Criterios de Aceptación Técnicos
- [x] Implementar `ModuleSidebar` con soporte condicional.
- [x] Implementar `BrandToolbar` orquestador (State Machine).
- [x] Implementar `UnifiedInspector` + `InspectorBlocks` (Context, Impact, Diff).
- [ ] Test E2E cubriendo el flujo: Open Brand -> Create Draft -> Check Impact.


---

### metadata.json

```json
{
  "track_id": "brand-hub-operation_20260108",
  "type": "feature",
  "status": "new",
  "created_at": "2026-01-08T12:30:00Z",
  "updated_at": "2026-01-08T12:30:00Z",
  "description": "Implement the operational Brand Hub module using ModuleWorkspace and connected data."
}
```
