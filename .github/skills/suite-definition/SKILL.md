---
name: suite-definition
description: 'Use when defining or reviewing a LoopDev product suite before implementation.'
argument-hint: 'Define or review a LoopDev suite'
user-invocable: true
disable-model-invocation: false
---

# Suite Definition

Use this skill to define the product and architecture boundary of a suite before
implementation. A suite contains one or more modules; this workflow composes
`.github/skills/module-definition/SKILL.md` for each initial module.

## Branch and scope

Work on a dedicated `docs/<area>-<topic>` branch based on the current `develop`.
Keep the work documentation-only until the approval gate passes. Do not
fast-forward a documentation branch with all of `develop` merely to synchronize
implementation history.

## Required sources

Read the current product architecture roadmap, the suite definition governance
documents, the module-definition skill, relevant ADRs, tracks, security
documents, and registry entries. Treat CRM and Marketing Studio as evidence and
precedent, not as templates whose domain decisions can be copied.

## Required definition

1. Define users, problem, value, success signal, and suite boundaries.
2. List included, excluded, shared, future, and deferred modules.
3. Record module dependencies, ownership, and sequencing.
4. Define suite entry, navigation, global context, workspace recipes, and
   cross-module transitions using the platform Shell contracts.
5. Cover loading, empty, error, forbidden, and responsive states.
6. Define entities, organization tenancy, memberships, permissions, events,
   integrations, ownership, audit, retention, and sensitive data.
7. Audit reuse from `@loopdev/ui` and record any justified design-system gaps.
8. Invoke module-definition for every committed initial module.
9. Record contracts, schema, RLS, storage, providers, AI, billing,
   observability, rollout, rollback, validation, and operational impact.
10. Create the implementation handoff with acceptance criteria, evidence,
    risks, dependencies, and one concrete next action.

## Platform constraints

Every suite must use the platform-owned `AppShell`, `SuiteShell`, `SuiteRuntime`,
`SuiteCanvas`, navigation schemas, access maps, and registered Canvas recipes.
Do not create parallel headers, sidebars, rails, or navigation primitives. Keep
business rules, repositories, persistence, and mutations outside Shell and
Canvas foundation layers.

## Approval gate

Do not create implementation code or mark a suite ready until scope,
dependencies, experience, contracts, tenancy, security, component reuse,
module packages, operational impact, validation, and handoff are complete.
Unresolved items must be explicitly deferred with an owner, risk, dependency,
and approval record. User approval is required in the owning track.

## Output and validation

Produce the suite definition, initial module packages, component and contract
evidence, impact and security review, owning track, and implementation handoff.
Run the narrowest applicable documentation and track validation; do not launch
frontend, mobile, backend, or database test suites for documentation-only
changes unless the changed files require them.