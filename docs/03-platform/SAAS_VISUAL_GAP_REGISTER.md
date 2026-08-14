---
title: SaaS visual gap register
status: phase-0-governance
owner: platform
reviewed_at: 2026-08-14
---

# SaaS visual gap register

| ID | Gap | Impact | Owner | Next action | Status |
| --- | --- | --- | --- | --- | --- |
| VIS-01 | Grid rendering exists in CSS utilities and React primitives | Drift and duplicated fixes | platform | Select canonical primitive and migration path | open |
| VIS-02 | Grid opacity/intensity is not one shared token contract | Contrast inconsistency | platform | Define intensity tokens and theme rules | open |
| VIS-03 | Surface/depth names are not yet recipes | Ad hoc composition | platform | Promote surface taxonomy into shared contracts | mitigated |
| VIS-04 | Direct Tailwind colors coexist with semantic variables | Theme drift | platform | Inventory and replace high-risk direct colors | open |
| VIS-05 | Loading/empty/error/forbidden recipes vary by consumer | UX inconsistency | platform + suites | Build state reference compositions | open |
| VIS-06 | Reduced-motion and grid performance evidence is incomplete | Accessibility/performance risk | platform | Add browser validation gate | open |
| VIS-07 | No standard view specification was required historically | Missing review evidence | governance | Require template in suite tracks | mitigated |
| VIS-08 | Canvas mode and visual recipe were previously conflated | Contract rigidity | platform | Keep structural and visual contracts separate | mitigated |
| VIS-09 | Tenant and suite accents have unclear limits in some views | Brand leakage | platform | Define theme boundary tests | open |
| VIS-10 | Visual exceptions lack a single registry | Permanent one-off styling | governance | Link exception IDs to track evidence | open |

## Exception policy

No exception is active by default. A consumer may temporarily diverge only when
it provides an owner, rationale, approval reference, scope, review date and
removal plan.

## Phase 1 entry criteria

- VIS-01, VIS-02 and VIS-04 have implementation owners.
- At least one reference composition exists for `DataWorkspace`,
  `RecordWorkspace` and `BoardWorkspace`.
- State and accessibility recipes have executable validation plans.
