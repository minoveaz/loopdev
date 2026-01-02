# User Histories: Toast System (Enterprise Orchestrator) v2.0

## 🧬 Block 0: Visual DNA (The 4 Pillars)

### Story 0.1: Trinity Chromatic Balance
**As a** Designer, **I want** the toast to use Blue for structure, Yellow for actions, and Purple for AI processes **so that** the user identifies the nature of the feedback by color hierarchy.
- **Criteria:** 
  - Standard/Success/Info use Blue borders.
  - Action buttons use Yellow Energy.
  - Loading/AI states use Innovation Purple accents.

### Story 0.2: Grid Syntax (Semantic Texture)
**As a** System, **I want** to apply the correct grid texture based on the toast type **so that** the surface communicates its intent.
- **Criteria:**
  - **Standard Toasts:** Use "Blueprint Grid" (Lines) to denote structural confirmation.
  - **Loading/AI Toasts:** Use "Neural Grid" (Points) to denote processing/intelligence.

### Story 0.3: Geometry & Contextual Brackets
**As a** System, **I want** technical metadata (e.g., `{ ERR_404 }`, `{ 12:45 }`) to be wrapped in brackets that match the status color **so that** the information is semantically grouped and visually harmonious.

### Story 0.4: Surface Soul (Glassmorphism)
**As a** User, **I want** the toast to have a blurred crystal surface (`backdrop-blur`) **so that** it feels premium and doesn't completely hide the content behind it.

---

## 📋 Core Stories (Functional)

### Story 1: Intelligent State Update (The Flow)
**As a** Developer, **I want** to transition a toast from `loading` to `success/error` using an ID **so that** the user sees a single, fluid story (e.g., "Uploading..." -> "Uploaded").
- **Criteria:** `update(id, patch)` support with smooth visual transition.

### Story 2: Boxed Semantic Icons
**As a** User, **I want** icons to be presented in a "boxed" container (LoopDev style) **so that** the status is clear even without reading the text.

---

## 🛡️ Scalability & Noise Control (Enterprise Grade)

### Story 3: Smart Deduplication (Anti-Spam)
**As a** System, **I want** to group identical notifications using a `dedupeKey` **so that** performing 50 batch actions only shows 1 toast with an updated counter.

### Story 4: Scope & Tenant Isolation
**As a** Multi-tasking User, **I want** toasts to be isolated by `tenantId` and `moduleId` **so that** I don't see notifications from a background workspace in my current view.

### Story 5: Rate Limiting & Queue
**As a** Performance Engineer, **I want** a limit of `maxVisible` (3-5) items **so that** the UI remains clean and the main thread isn't overloaded during mass events.

---

## 🌍 Accessibility & Governance

### Story 6: A11y Silence & Voice
**As a** Screen Reader User, **I want** `error` variants to be assertive and `success` to be polite **so that** my workflow isn't interrupted by non-critical info.
- **Criteria:** `role="alert"` vs `role="status"`. Supports `prefers-reduced-motion`.

### Story 7: Tenant Policy Engine

**As a** SaaS Admin, **I want** to configure if my users see "success" toasts or change their screen position **so that** the system adapts to our corporate culture.



---



## 🏗️ Platform & Infrastructure Stories (Fase 3 Ready)



### Story 8: Tenant Data Isolation (Privacy)

**As a** Multi-tenant User, **I want** to only see notifications belonging to my active workspace **so that** I don't see sensitive data from other clients in parallel tabs.

- **Acceptance Criteria:**

  - `toast.show()` requires a `tenantId`.

  - The `ToastViewport` filters out any notification where `toast.tenantId !== session.tenantId`.



### Story 9: Error Telemetry

**As a** Root Admin, **I want** every "error" toast to trigger a telemetry event **so that** I can track system stability without manual reporting.

- **Acceptance Criteria:**

  - Automatic logging of variant, title, and timestamp when variant is `error`.



---

*Certified for Production - LoopDev.lab v2.1 (Infra Ready)*
