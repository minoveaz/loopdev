---
id: brand-hub-overview
title: Brand Hub Overview Page (v1.1)
status: closed
created: 2026-01-11
updated: 2026-08-12
owner: marketing
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/brand-hub-overview_20260111
---

# Brand Hub Overview Page (v1.1)

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

# Plan: Brand Hub Overview Page (v1.1)

## Phase 1: Foundations & Types
- [ ] Task: Define TypeScript interfaces for `BrandSummary`, `BrandHealth`, `RecentEvent`.
- [ ] Task: Create mock data fixtures matching these interfaces.
- [ ] Task: **Define InspectorContext mapping for Brand Overview interactions.** (Mapping table).
- [ ] Task: Clean up the existing `page.tsx` placeholder.

## Phase 2: Component Library (Atoms & Molecules)
- [ ] Task: Create `StatusChip` and `SeverityPill` (if not in UI package).
- [ ] Task: Create `MetricTile` (clickable card with label, value, status).
- [ ] Task: Create `AuditEventRow` (list item for activity feed).
- [ ] Task: Create `ActionCard` (rich button with description).

## Phase 3: Composites (The 5 Blocks)
- [ ] Task: Implement `BrandStatusSnapshot` (Header block with Mode Awareness).
- [ ] Task: Implement `BrandHealthPanel` (Grid of MetricTiles with Green/Yellow/Red).
- [ ] Task: Implement `GovernanceSummary` (Read-only matrix).
- [ ] Task: Implement `RecentActivityFeed` (List of events).
- [ ] Task: Implement `ActionLauncher` (Logic for available actions).

## Phase 4: Assembly & Layout
- [ ] Task: Assemble the page using the CSS Grid layout defined in Spec (Row 1, Row 2 cols, Row 3 cols).
- [ ] Task: Ensure responsive behavior (stacking on mobile).
- [ ] Task: Add Skeleton loading states and Error Boundaries for all blocks.

## Phase 5: Consequence Wiring
- [ ] Task: Wire up `BrandHealthPanel` tiles to open Inspector (Validation/Governance/Impact tabs).
- [ ] Task: Wire up `RecentActivityFeed` items to open Inspector (Context/Diff tabs).
- [ ] Task: Ensure `UnifiedInspector` receives the correct context entity based on selection.

## Phase 6: Validation
- [ ] Task: Verify Read-Only vs Draft states.
- [ ] Task: Verify URL persistence (Deep-link consistency).
- [ ] Task: Audit UI against v3.9 standards.
- [ ] Task: Conductor - User Manual Verification 'Overview Page Operational'.

---

### spec.md

# BrandHub — Identity · Brand Overview Page Spec (v1.1)

> **View:** Identity → Overview (Brand Mode)
> **Route:** `/marketing-studio/brand-hub/brands/:brandId/overview`
> **Purpose:** Operational console for a single Brand. This view **does not define** identity; it **supervises** brand truth: state, health, governance, dependencies, and next safe actions.

---

## 0) Non‑Responsibilities (Guardrails)
This page **must not**:
* Edit tokens (Colors/Typography)
* Edit narrative (Narrative view)
* Store or browse binary assets
* Execute publishing directly without preflight
* Show marketing analytics (reach, impressions, etc.)

It **must**:
* Give instant clarity on brand state and risk
* Provide safe entry points into changes
* Make dependencies and governance visible

---

## 1) Information Architecture (Exact Content)

### 1.1 Page Header Block (Canvas)
**Block name:** `BrandStatusSnapshot`
**Always visible fields**
* Brand name (redundant with header, but present as in-canvas anchor)
* **Status Chip:** `{ PUBLISHED }` | `{ DRAFT }` | `{ ARCHIVED }`
* **Mode Chip (Crucial):**
    *   `{ READ ONLY }`: No changes allowed here.
    *   `{ DRAFT MODE }`: Working copy active.
    *   `{ REVIEW MODE }`: Locked for approval.
* Active version label: `vX.Y.Z` (published baseline)
* Draft indicator: `Draft vX.Y.Z+draft` or `Draft pending approval`
* Last updated: timestamp + actor
* Lock reason (if locked): e.g. `Locked: awaiting Legal approval`

**Primary actions (do not execute here; only deep-link)**
* `Open Publish Preflight` (→ `/publish`) **only when draft exists and user can publish**
* `Create Draft` (invokes draft creation flow; see interactions)

### 1.2 Health Indicators Block
**Block name:** `BrandHealthPanel`
**Indicators (Visual Contract)**
*   **OK** → Green (Success/Nuetral)
*   **WARN** → Yellow (Warning)
*   **BLOCK** → Red (Critical)

**Metrics:**
1. **Compliance**: `Critical: N` `Warnings: N`
2. **Approvals**: `Pending: N` `Required: N`
3. **Overrides**: `Active overrides: N`
4. **Dependencies**: `Consumers: N` (across modules)

*Interaction:* Each indicator is clickable and drives the Inspector (Explain tab for WARN/BLOCK).

### 1.3 Governance Summary Block
**Block name:** `GovernanceSummary`
* Governance profile name: e.g. `Enterprise · Strict`
* **Editable domains matrix** (Values):
    *   `Allowed` (Editable freely)
    *   `Approval Required` (Editable with checks)
    *   `Restricted` (Admin only)
* Approval chain summary.
Clickable rows open Inspector → Governance tab.

### 1.4 Recent Activity (Audit-lite)
**Block name:** `RecentActivityFeed`
* 5–10 most recent events in this Brand.
* Click event opens Inspector → Context tab + (Diff tab if event implies change).

### 1.5 Next Actions / Entry Points
**Block name:** `ActionLauncher`
Actions shown are derived from **brand state + role**.
* `Create Draft` (if Published and user canEdit)
* `Continue Draft` (if Draft exists and user canEdit)
* `Compare Versions` (→ `/versions/compare`)
* `View Dependencies` (→ `/dependencies`)
* `Review Approvals` (→ `/publish` or `/governance`)

---

## 2) Interactions & Inspector Mapping

### 4.1 Primary selection model
* The page supports a single active `selectionRef` for Inspector context.
* Selecting items does not navigate; it updates Inspector.

### 6.2 Selection → Tab mapping

| Selection             | Inspector EntityRef | Tab        | Notes                               |
| --------------------- | ------------------- | ---------- | ----------------------------------- |
| Snapshot chips        | `brand`             | Context    | show lifecycle + version details    |
| Compliance tile       | `brand`             | Validation | list rule checks summary            |
| Approvals tile        | `brand`             | Governance | approval chain + pending items      |
| Overrides tile        | `brand`             | Impact     | markets/channels list + conflicts   |
| Dependencies tile     | `brand`             | Impact     | consumers by module + severity      |
| Governance matrix row | `brand`             | Governance | domain-specific policy              |
| Activity event        | `audit.event`       | Context    | show event detail; Diff if possible |
| Action: Compare       | `brand`             | Diff       | link to compare route               |
| Action: Dependencies  | `brand`             | Impact     | link to dependencies route          |

---

## 3) Resilience & States

### 5.1 Partial Failure (Circuit Breaker)
* If one block fails (e.g. Activity Feed API error), the rest of the dashboard **must** load.
* The failed block shows a contained error state with a "Retry" button.

### 5.2 Onboarding (Empty State)
* If brand is new (no history, no dependencies):
* **Snapshot:** "Draft v0.0.1"
* **Activity:** "No history yet. Start by defining Identity."
* **Action:** Primary CTA "Setup Identity".

---

## 4) Reusable Patterns
* `EntityOverviewConsole` (general pattern)
* `HealthIndicatorsPanel`
* `GovernanceSummaryCard`
* `AuditLiteFeed`
* `ActionLauncher`

---

### userHistories.md

# User Histories: Brand Overview Console (v1.1)

**Goal:** Provide supervision, resilience, and safe entry points for brand operations.

## 📚 Historias de Usuario

### [A] Supervision & Status (Snapshot)
1. **[STATUS] Instant Clarity**
   - **HU:** As a user landing on the overview, I want to see immediately if the brand is `{ PUBLISHED }`, `{ DRAFT }` or `{ ARCHIVED }` via clear visual chips.
2. **[MODE] Editing Awareness**
   - **HU:** As a user, I want to clearly see whether I am in `{ READ ONLY }`, `{ DRAFT MODE }` or `{ REVIEW MODE }` so I know if changes are allowed before I try to click anything.
3. **[VERSION] Lifecycle Awareness**
   - **HU:** As a user, I want to see the current active version number (e.g., v1.2.0) and who updated it last.

### [B] Health & Risk (Indicators)
4. **[HEALTH] Risk Assessment**
   - **HU:** As a brand manager, I want to see a "Compliance" tile that turns Red/Yellow if there are critical errors, so I can prioritize fixing them.
5. **[HEALTH] Severity Explanation**
   - **HU:** As a user, when a tile is Red or Yellow, I want to know **why** and **what to do next** via the Inspector (Explain tab).
6. **[IMPACT] Dependency Visibility**
   - **HU:** As an architect, I want to see a "Dependencies" tile showing how many modules consume this brand.

### [C] Governance & Audit (Activity)
7. **[GOVERNANCE] Permission Granularity**
   - **HU:** As a user, I want to see which domains (Colors, Rules) are `Allowed`, which require `Approval`, and which are `Restricted` (Admin only).
8. **[AUDIT] Recent Changes**
   - **HU:** As a reviewer, I want to see a feed of the last 5 changes. Clicking an event must open the Inspector showing the **Diff**.

### [D] Actionability & Navigation
9. **[ACTION] Safe Entry**
   - **HU:** As an editor, I want to see a "Create Draft" button if I'm in a read-only view, or "Continue Draft" if one exists.
10. **[NAVIGATION] URL-first consistency**
    - **HU:** As a user, if I refresh or deep-link to `/brands/:id/overview`, I want the same state (Brand loaded, Inspector closed/open) without losing context.

### [E] Resilience & Onboarding
11. **[RESILIENCE] Partial failure handling**
    - **HU:** As a user, if one block (e.g. Activity) fails to load, I want the rest of the overview to remain usable so I'm not blocked.
12. **[ONBOARDING] First-brand clarity**
    - **HU:** As a user on a newly created brand, I want clear empty states explaining what has not been configured yet and where to start.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `BrandStatusSnapshot` con los 3 modos explícitos.
- [ ] Implementar `BrandHealthPanel` con código de colores semántico (Green/Yellow/Red).
- [ ] Implementar `ActionLauncher` sensible al rol y estado.
- [ ] **Crucial:** Conectar cada elemento clickeable al `UnifiedInspector`.
- [ ] Layout responsive: 2 columnas en Desktop, Stack en Mobile.
- [ ] Manejo de errores por bloque (Error Boundaries).
