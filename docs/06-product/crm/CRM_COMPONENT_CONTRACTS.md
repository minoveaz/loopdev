---
title: CRM component contracts and route approval
status: phase-3-contract-definition
owner: crm
reviewed_at: 2026-08-14
---

# CRM component contracts and route approval

## Contract boundary

Shared UI receives display data and callbacks. CRM features own queries,
authorization, mutations, idempotency, audit events, and cache invalidation.
Every server operation resolves organization, workspace, membership and
capabilities server-side; client role checks never authorize access.

All list contracts expose `items`, `nextCursor`, `hasMore`, `loading`, `empty`,
`error`, `forbidden`, and `stale`. Mutations expose `idle`, `pending`,
`success`, `validation-error`, `forbidden`, `conflict`, and `server-error`.
Errors include a request id but never cross-organization existence or PII.

## Approved route compositions

| Route family | Canvas mode | Composition | Consumer |
| --- | --- | --- | --- |
| `/sales-crm/contacts` | data | context header + actions + contact table + cursor state | Contacts list |
| `/sales-crm/contacts/:id` | record | contact detail + authorized notes + contact timeline | Contact record |
| `/sales-crm/leads` | data | lead list + filters + qualification/conversion commands | Leads list |
| `/sales-crm/leads/:id` | record | lead detail + attribution + activity + conversion | Lead record |
| `/sales-crm/pipeline` | board | pipeline board + stage columns + opportunity cards | Opportunity board |
| `/sales-crm/opportunities/:id` | record | opportunity record + related entities + activity | Opportunity record |
| `/sales-crm/customers/:id` | record | Customer 360 sections + related records + notes/timeline | Customer 360 |
| `/sales-crm/tasks` | data | task list + filters + row actions | Tasks list |
| `/sales-crm/tasks/my-day` | overview | task groups + priority summary + completion | My Day |
| `/sales-crm/tasks/:id` | record | task record + relation + assignment + activity | Task record |

## Definitive ownership

- `@loopdev/ui`: existing primitives, generic table/dialog/pagination and
  shell runtime only.
- `crm-shared`: authorized lookup, append-only activity model and notes.
- `contacts`, `leads`, `pipeline`, `customer-360`, `tasks`: domain entities,
  forms, commands and route-specific compositions.
- `SuiteRuntime` and `SuiteCanvas`: navigation and layout only; no CRM query or
  mutation.

## Implementation gates

Before implementation of any `create` boundary:

1. Reconcile the read model with `packages/contracts/src/crm`.
2. Approve capability and field-redaction matrices.
3. Add contract, RLS, route, accessibility and state tests.
4. Define cursor, sort/filter, idempotency and expected-version behavior.
5. Register a shared component only after a second real consumer and an
   agnostic contract are evidenced.
