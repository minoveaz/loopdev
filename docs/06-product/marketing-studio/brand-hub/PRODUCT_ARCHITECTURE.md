# Brand Hub — Product Architecture & Feature Set

> **Scope:** Marketing Studio · Brand Hub
> **Purpose:** Define the functional scope, navigation structure, and feature capabilities for the product team.
> **Status:** Vision Document (North Star).

---

## 1. Vision: The "Endgame" Architecture
This structure represents the mature, industrial-grade version of the product. It is the target state for Phase 4+.

### 🧠 Navigation Tree (Full Scope)

```text
BRAND HUB

  Overview
  ├─ Brand Dashboard (Multi-brand view)
  ├─ Activity & Alerts
  └─ Quick Actions

  Identity System
  ├─ Brand Profile
  │   ├─ Basics (Name, Legal, Markets)
  │   ├─ Brand Story (Mission, Positioning)
  │   └─ Voice & Tone (Guidelines)
  ├─ Logos
  │   ├─ Variants (Light/Dark, Mono, Layout)
  │   ├─ Usage Rules (Min size, clear space)
  │   └─ Export Packs (SVG/PNG/PDF)
  ├─ Colors
  │   ├─ Tokens (semantic)
  │   ├─ Palettes (brand/neutral/semantic)
  │   ├─ Accessibility (contrast checks)
  │   └─ Export (CSS/JSON/Figma tokens)
  ├─ Typography
  │   ├─ Fonts
  │   ├─ Typescale (roles)
  │   ├─ Fallbacks & Licensing
  │   └─ Export (CSS)
  ├─ Iconography
  │   ├─ Icon Set
  │   ├─ Guidelines
  │   └─ Export
  ├─ Imagery
  │   ├─ Photography style
  │   ├─ Illustration style
  │   └─ Do/Don’t examples
  └─ Templates
      ├─ Social templates
      ├─ Ads templates
      ├─ Email templates
      └─ Presentation templates

  Design Tokens (System Layer)
  ├─ Token Registry (single source)
  ├─ Token Sets (web / email / print)
  ├─ Themes (light/dark)
  ├─ Platforms (css / tailwind / figma)
  └─ Change Diff (what changed)

  Guidelines (Documentation)
  ├─ Brand Guidelines (pages)
  ├─ Do / Don’t Library
  ├─ Examples Gallery
  └─ Public Sharing (optional)

  Rules & Guardrails (Differential USP) 💎
  ├─ Rules Catalog
  │   ├─ Visual rules (logo/color/type)
  │   ├─ Copy rules (tone, terms, forbidden claims)
  │   ├─ Channel rules (LinkedIn/Meta/Email)
  │   └─ Legal rules (disclaimers)
  ├─ Validation Engine
  │   ├─ Validate Asset
  │   ├─ Validate Copy
  │   └─ Validate Campaign
  ├─ Enforcement Modes
  │   ├─ Warn
  │   ├─ Block
  │   └─ Require Approval
  └─ Exceptions
      ├─ Exception Requests
      └─ Approved Exceptions

  Governance
  ├─ Roles & Permissions
  ├─ Approval Workflows
  ├─ Review Queues
  ├─ Audit Log
  └─ Compliance Reports

  Versions & Releases
  ├─ Draft Workspace
  ├─ Release Notes
  ├─ Publish / Rollback
  └─ Version History

  Integrations
  ├─ Asset Manager Links
  ├─ Figma / Tokens Sync
  ├─ CDN / Distribution
  ├─ Webhooks
  └─ API Keys (scoped)

  Consumption (Cross-Module)
  ├─ Where Used (dependencies)
  │   ├─ Campaign Orchestrator
  │   ├─ Content Engine
  │   ├─ Studio
  │   └─ Others
  ├─ Embed / Snippets
  │   ├─ Token snippet (CSS/JSON)
  │   ├─ Guidelines embed
  │   └─ Brand badge
  └─ SLA & Health

  Settings
  ├─ Brand Settings
  ├─ Markets & Locales
  ├─ Naming Conventions
  └─ Data Retention
```

---

## 2. Execution Strategy: The "Compact" MVP (Phases 1-2)
This is the tactical subset we build first to deliver immediate value without over-engineering.

```text
BRAND HUB (Phase 1/2 Scope)

  Overview
  ├─ Dashboard (Brand List)

  [Brand Name] Workspace
  ├─ Identity
  │   ├─ Basics (Name, Description)
  │   ├─ Logos (Grid Layout)
  │   ├─ Colors (Palette Editor)
  │   └─ Typography (Font Selector)
  ├─ Rules (Placeholder / JSON Editor v1)
  └─ Settings (Delete / Archive)
```

---

## 3. Key Feature Analysis

### Identity System (Standard)
*   **Role:** The baseline expectation. Matches competitors like Frontify.
*   **Criticality:** High. Without this, it's not a Brand Hub.

### Design Tokens (Technical)
*   **Role:** The bridge between Brand and Engineering.
*   **Differentiation:** High. Treats brand as code, enabling automatic CSS updates.

### Rules & Guardrails (USP)
*   **Role:** The "Brand Police".
*   **Differentiation:** Very High. Most tools document rules; LoopDev enforces them via software.
*   **Complexity:** High. Requires a JSON Rules Engine.

### Consumption (Platform Intelligence)
*   **Role:** Dependency tracking.
*   **Value:** Prevents breaking changes in campaigns when a brand is updated.

---

## 4. Strategic Engineering Decisions (Closed Gates)
These decisions are final for V1 implementation.

### 🔒 Decision 1: Active Guardrails (Warn vs Block)
*   **Verdict:** **WARN by default.**
*   **Reasoning:** Blocking frustrates users during the creative process.
*   **Implementation:** UI shows "⚠️ Tone mismatch". Blocking is only enabled for "Strict/Regulated" mode (future Enterprise tier).

### 🔒 Decision 2: Brand-as-Code (Token UX)
*   **Verdict:** **Visual UI -> Auto-Generated Tokens.**
*   **Reasoning:** Our user is a Brand Manager, not a Developer.
*   **Implementation:** User picks a color visually. System auto-generates `brand.primary`. No raw JSON editing in V1.

### 🔒 Decision 3: Cross-Module Dependencies
*   **Verdict:** **Event-Driven / Asynchronous.**
*   **Reasoning:** Brand Hub must not crash if the Campaign Module is down.
*   **Implementation:** "Soft Locking". If you try to delete a logo, we check usage asynchronously. If check fails, we warn but allow force-delete (with audit log).

---

## 5. The V1 Anti-Scope (Explicit Cuts)
To ensure we deliver a high-quality industrial module, we explicitly **REJECT** the following features for V1.

*   ❌ **No Inheritance:** Brands are flat. No "Parent Brand -> Sub-brand" cascading logic.
*   ❌ **No Regional Overrides:** One Brand = One Global Definition.
*   ❌ **No Custom Rules DSL:** Rules are limited to our pre-defined JSON Schema. No custom script writing.
*   ❌ **No Visual Rule Editor:** Rules are configured via simple toggles/inputs, not a complex logic builder.
*   ❌ **No "Public" Portal:** Sharing is via internal user invite only (Viewer Role). No public URLs yet.

---

**Note:** This document serves as the Product Backlog. Engineering should refer to `ROADMAP_BRAND_HUB.md` for the execution plan.
