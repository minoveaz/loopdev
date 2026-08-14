---
title: CRM component gaps and duplicate review
status: phase-2-analysis
owner: crm
reviewed_at: 2026-08-14
matrix: crm-component-decision-matrix.json
---

# CRM component gaps and duplicate review

## Resultado

The Phase 1 catalog contains 64 normalized boundaries. Phase 2 assigns every
boundary a decision: 6 `reuse`, 1 `variant`, 38 `compose`, and 19 `create`.
No CRM proposal is eligible for `@loopdev/ui` promotion yet.

## Collision groups resolved

| Group | Canonical boundary | Resolution |
| --- | --- | --- |
| context-header | `crm-context-header` | ModuleHeader remains shared; module headers are compositions. |
| context-actions | `crm-context-actions` | Query/action orchestration stays CRM-owned; toolbar primitives are reused. |
| data-surface | `crm-data-surface` | Tables, pagination and dialogs remain generic; rows and commands stay feature-owned. |
| record-preview | module-specific record compositions | Contact, Lead, Opportunity, Customer 360 and Task previews are not one entity widget. |
| activity-timeline | `crm-activity-model` | One append-only source key (`sourceType:sourceId`) feeds module timelines. |
| notes | `crm-authorized-notes` | Customer 360 notes reuse the shared CRM feature; no second note implementation. |
| entity-forms | module-owned forms | Shared fields may compose, but validation and commands remain entity-owned. |
| entity-lookup | `crm-contact-lookup` | Authorized lookup contract is shared; relation selectors compose it. |
| related-records | module-specific compositions | Read models are scoped to the Customer 360 or Task consumer. |

## Duplicate-review records

Each `create` decision has a review record in the matrix (`DR-001` through
`DR-019`). The review must be completed before implementation and records:

- no existing repository contract covers the behavior;
- the owner and consumer are concrete;
- the data, authorization, mutation, conflict and accessibility contracts are
  not delegated to a generic widget;
- the boundary is not a second rendering of an existing entity or timeline.

`DR-020` is reserved for any new create decision added after this review.

## Blocking gaps

1. Reconcile roadmap read models with `packages/contracts/src/crm` before
   generating types or migrations.
2. Approve role/capability matrices, field redaction, status transitions,
   server filter/sort fields, pagination limits and idempotency boundaries.
3. Define the authoritative activity event union, metadata schema, retention,
   audit boundary and cross-module fixture.
4. Define the authorized contact lookup response and limits before using it in
   Lead conversion, Opportunity forms or Task relations.
5. Add contract, RLS, accessibility, route and state tests before any `create`
   boundary is implemented.
6. Verify registry entries for existing shared primitives; do not register CRM
   proposals until a second real consumer and agnostic contract exist.

## Deferred, not rejected

Legacy `/sales-crm` pages, API routes and existing CRM schemas remain evidence
for migration planning. They are not treated as authority where they conflict
with the pinned roadmap contracts. No UI, route, migration, registry entry or
business contract was changed by this phase.
