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