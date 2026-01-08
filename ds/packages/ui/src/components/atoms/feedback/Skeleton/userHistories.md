# User Histories: Skeleton (Ghost UI) v1.5

## 📋 Core Stories (Functional & Layout)

### Story 1: Structural Mirror
**As a** User
**I want to** see placeholders that match the exact hierarchy and dimensions of the incoming content
**So that** there is zero "layout shift" when the data finally hydrates.
- **Acceptance Criteria:**
  - Matches final component paddings, gaps, and dimensions.
  - Provides variants: `text`, `avatar`, `button`, `card`, `rect`.

### Story 2: Natural Text Flow
**As a** Designer
**I want** text skeletons to have varied line widths and realistic heights
**So that** the placeholder feels like a real human-written paragraph.
- **Acceptance Criteria:**
  - `lines` prop for multi-line rendering.
  - Last line is randomly shorter (approx 60-80% width).
  - Heights are mapped to Typography line-height tokens.

### Story 3: Momentum Control (Animation)
**As a** System
**I want** to toggle between `shimmer` (gradient move) and `pulse` (opacity fade)
**So that** we can optimize performance based on the number of nodes rendered.
- **Acceptance Criteria:**
  - Default: `shimmer` for small surfaces.
  - Auto-fallback to `pulse` or `static` if `prefers-reduced-motion` is active.

---

## 🛡️ Stress & Performance Stories

### Story 4: Massive Grid Performance
**As a** Performance Engineer
**I want** skeletons in large tables (50+ rows) to use low-cost animations (opacity)
**So that** the initial boot doesn't cause CPU spikes or lag the main thread.
- **Acceptance Criteria:**
  - Validated 60fps during heavy loading sequences.

### Story 5: Composition Presets
**As a** Developer
**I want** ready-to-use patterns like `CardSkeleton` or `TableSkeleton`
**So that** I don't have to manually compose atomic blocks for every standard module.
- **Acceptance Criteria:**
  - Includes presets for CRM Kanban, Data Tables, and Dashboard Widgets.

---

## 🌍 Accessibility & Multitenancy

### Story 6: Semantic Silence (A11y)
**As a** Screen Reader User
**I want** the skeleton to be invisible to my assistive device
**So that** I don't hear "image", "gray block" repeatedly while waiting for data.
- **Acceptance Criteria:**
  - Implements `aria-hidden="true"` by default.
  - Parent container uses `aria-busy="true"` during loading.

### Story 7: Brand Synergy (Radius & Theme)
**As a** SaaS Tenant
**I want** the skeleton to inherit my brand's `border-radius` and surface contrast
**So that** the loading state feels like a native part of my theme.
- **Acceptance Criteria:**
  - Inherits `--lpd-radius-base`.
  - Contrast adjusted for Light and Dark modes to ensure visibility without "glowing" excessively in dark themes.

---
*Certified for Production - LoopDev.lab*