```text
App Router -> SuiteRuntime -> SuiteCanvas -> governance widgets -> policy features
	-> MarketingPolicy and UsageRestriction entities -> Platform policy/audit contracts
```

Platform Core owns authorization, audit repositories and enforcement infrastructure. Module UI shows
authorized policy/evidence, never evaluates or enforces policy locally.
---
title: Compliance and Governance Component Audit
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/compliance-governance/COMPLIANCE_GOVERNANCE_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/152
---

# Compliance and Governance Component Audit

Reuse Shell, tables, filters, dialogs, badges and states from `@loopdev/ui`. Implement module widgets
`PolicyList`, `RestrictionRecord` and `MarketingAuditEvidence`, plus policy-review features through
server contracts. Do not put authorization engines, audit repositories or enforcement rules in UI,
Canvas or widgets; shared promotion requires another consumer and certification.
