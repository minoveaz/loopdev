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
