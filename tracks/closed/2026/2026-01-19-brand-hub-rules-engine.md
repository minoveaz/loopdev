---
id: brand-hub-rules-engine
title: Brand Hub Rules Engine (v1.0)
status: closed
created: 2026-01-19
updated: 2026-08-12
owner: marketing-studio
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/brand-hub-rules-engine_20260119
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Brand Hub Rules Engine (v1.0)

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

# Plan: Brand Hub Rules Engine (v1.0)

## Phase 0: Ideation & Product Specs
- [x] Task: Create `userHistories.md` based on official design docs (No-code, Severity, Explainability).
- [x] Task: Create `spec.md` with detailed Block Map (Rail, List, Editor, Policies).
- [x] Task: Define Domain Model in `docs/05-operations/BRAND_HUB_DOMAIN.md` (Update for Governance Rules).

## Phase 1: Contracts & Data Modeling
- [x] Task: Create `src/brands/rules.schema.ts` in `@loopdev/contracts`.
    - Define `RuleTriggerSchema`.
    - Define `RuleConditionSchema`.
    - Define `RuleActionSchema`.
- [x] Task: Export new schemas in `index.ts`.
- [x] Task: Update `BrandSchema` to include `rulesEngine` collection.

## Phase 2: Core Components (The Logic Atoms)
- [x] Task: Create `DomainBadge` & `SeverityBadge` atoms.
- [x] Task: Create `RuleRow` molecule with logic summary.
- [x] Task: Create `RuleDomainRail` composite with telemetry stats.
- [x] Task: Create `RuleEditor` with explainability templates.

## Phase 3: Page Assembly & Navigation
- [x] Task: Create page route `.../governance/rules/page.tsx`.
- [x] Task: Implement the Layout (Rail + List + Editor structure).
- [x] Task: Map navigation in `layout.tsx` and `mock-brands.ts`.
- [x] Task: Connect to `useActiveBrand` hook with fixture fallback for LoopDev.

## Phase 4: Infrastructure & Persistence
- [x] Task: Create SQL Migration for `rules_engine` JSONB column.
- [x] Task: Update SQL Seeder with initial LoopDev Governance rules.

## Phase 5: Verification
- [x] Task: Unit Tests for Rule Validation Logic (Contracts PASSED ✅).
- [x] Task: Conductor verification: `Rules Engine Operational`.
- [x] Task: Manual verification with real DB data: SUCCESS ✅.

---

### spec.md

# Spec: Brand Hub Rules Engine (v1.0)

> **Status:** Implementation Ready
> **Route:** `/marketing-studio/brand-hub/brands/:brandId/governance/rules-engine`
> **Chassis:** `ModuleWorkspace`

## 1. Product Objective
Transform brand guidelines from static PDFs into declarative, versioned, and audit-ready logic. This engine defines "the laws" that the rest of the system (Inspector, Preflight, AI Engine) executes.

## 2. Canvas Architecture (Block Map)

### Block A: Rule Domains Rail
- **Ontology:** Groups rules into Identity, Visual, and Typography.
- **Telemetry:** Displays `ruleCount`, `blockCount`, and `warnCount` per domain.
- **Interaction:** Filtering the Rule List.

### Block B: Rule List
- **Component:** `RuleRow`.
- **Fields:** Name, Domain, Condition Summary, Severity (WARN/BLOCK), User/Time metadata.
- **States:** Loading Skeleton, Empty, Error.

### Block C: Rule Editor (Declarative Config)
- **Scope:** Domain, Target (colorToken, claim, etc.), Filter.
- **Logic:** Metric, Operator (<, ==, etc.), Threshold.
- **Enforcement:** `blockPublish`, `allowOverride`, `requiresAck`.
- **Approval:** Sign-off role requirement.

### Block D & E: Policies
- **Severity Policy:** Global toggles for BLOCK/WARN behaviors.
- **Approval Matrix:** Per-domain mapping of who approves what (e.g., Legal for Identity).

### Block F: Explainability Templates
- Content for `Why`, `Risk`, `How to fix`.
- Visual `DO` and `DON'T` micro-examples.

## 3. Inspector Mapping (Consequences)
- **Context:** Metadata and Scope.
- **Validation:** What the rule checks.
- **Explain:** Why/Risk/Fix + Examples.
- **Diff:** Draft vs Published comparison.
- **Impact:** List of affected modules/views.

## 4. Technical Integration
- **Contracts:** `rules.schema.ts` defining the Trigger/Condition/Action structure.
- **Spine:** Persistent JSONB column in `public.brands`.
- **States:** Published (Read-only) vs Draft (Editable).

## 5. Success Criteria
1. Full visual parity with the provided wireframe.
2. Rule Editor correctly blocks/allows inputs based on Brand Status.
3. Domain filtering works seamlessly.
4. Inspector correctly visualizes the consequence of the selected rule.

---

### userHistories.md

# User Histories: Brand Rules Engine (v1.0)

**Goal:** Establish a declarative, explainable, and versioned governance system that transforms "human rules" into machine-executable laws.

## 📚 Historias de Usuario

### [A] Rule Definition & Logic
1. **[DECLARATIVE] No-Code Rules**
   - **HU:** As a Brand Admin, I want to define governance rules (Thresholds, Operators, Metrics) without writing code, so that I can adapt the system to new brand requirements quickly.
2. **[DOMAINS] Ontology Navigation**
   - **HU:** As a user, I want rules grouped by domains (Identity, Visual, Typography) so that I can easily find and manage the specific constraints of each brand area.
3. **[TARGETING] Granular Scope**
   - **HU:** As a Designer, I want to apply rules to specific targets (e.g., "only background color tokens") so that the governance is precise and doesn't trigger false positives.

### [B] Enforcement & Severity
4. **[SEVERITY] Control Outcomes**
   - **HU:** As a Brand Guardian, I want to decide if a rule violation should only "WARN" (allow with ack) or "BLOCK" (prevent publishing) to balance flexibility and strict compliance.
5. **[POLICY] Global Enforcement**
   - **HU:** As an Admin, I want to define a global severity policy (e.g., "BLOCK always prevents publish") to ensure consistency in how rules are enforced across the entire tenant.

### [C] Explainability & AI
6. **[EXPLAIN] Human-Readable Logic**
   - **HU:** As a Content Creator, when a rule blocks me, I want to see a clear explanation (Why, Risk, How to Fix) so that I can resolve the issue without calling support.
7. **[EXAMPLES] DO/DON'T Guidance**
   - **HU:** As a Designer, I want to see visual micro-examples of what is allowed and what isn't for each rule to avoid ambiguity.
8. **[AI_CONTEXT] Machine Meaning**
   - **HU:** As a system, I need the rules to be structured in JSON so that AI agents can understand brand boundaries during automated layout or copy generation.

### [D] Governance & Drafts
9. **[SAFE_EDIT] Draft-Only Edits**
   - **HU:** As an Editor, I must be forced to create a Brand Draft before modifying rules, ensuring the "laws" of the live brand are never changed by accident.
10. **[APPROVAL] Sensitive Gates**
    - **HU:** As a Legal Officer, I want to flag specific rules (like Forbidden Language) as "Approval Required" so that any change to them must be signed off by my department.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `RuleRow` con badges de severidad y resumen de condición.
- [ ] Implementar `RuleEditor` con estados Read-only/Draft.
- [ ] Implementar `RuleDomainRail` con contadores de alertas/bloqueos.
- [ ] Implementar `ExplainTemplateEditor` (Why/Risk/Fix/Examples).
- [ ] Integrar con el Inspector (Tabs: Context, Validation, Explain, Diff, Impact).
- [ ] Soporte para matriz de aprobación por dominio.
