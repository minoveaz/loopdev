---
title: CRM component implementation backlog
status: phase-3-approved-backlog
owner: crm
reviewed_at: 2026-08-14
---

# CRM component implementation backlog

Implementation remains deferred until each slice satisfies the contract gates.

## Order and dependencies

| Order | Slice | Depends on | Deliverable |
| --- | --- | --- | --- |
| 1 | CRM shared contracts | CRM schema reconciliation | Activity, notes and authorized lookup contracts plus fixtures |
| 2 | Shared state and data surfaces | Existing UI test evidence | Feedback, table, pagination and dialog contract gaps |
| 3 | Contacts foundation | Shared lookup and permissions | Contact list, detail, form and duplicate-review route contracts |
| 4 | Leads foundation | Contacts foundation | Lead list/detail/forms and capture contract |
| 5 | Pipeline foundation | Leads conversion contract | Board, stage movement and opportunity record/form |
| 6 | Customer 360 composition | Activity and notes contracts | Record sections, related read models and privacy rules |
| 7 | Tasks and My Day | Shared activity and lookup | Task list/record/form, assignment, relation and completion |

## Non-goals

This backlog does not authorize UI generation, migrations, registry promotion,
business-contract changes or route rollout. Those require a separate
implementation track with approved contracts and validation evidence.

## Exit evidence for the inventory track

- Every route has a concrete consumer and Canvas mode.
- Ownership is assigned to the narrowest layer.
- Shared promotion has explicit second-consumer and agnostic-contract gates.
- Remaining gaps are recorded rather than silently resolved.
