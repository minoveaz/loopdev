# CRM Suite contract alignment

**Phase:** F1
**Snapshot:** 2026-09-06
**Base:** `origin/develop@6255ec367c245067ec92f4bf1a7a74f91c0cb53f`

## Surface inventory

| Surface               | Location on `develop`                                                                                                       | Coverage                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Shared contracts      | `packages/contracts/src/crm/crm.ts`                                                                                         | Contacts, Leads, Pipeline, Opportunities, Activities, Notes, Tasks, errors and command envelopes                           |
| Customer 360 contract | `packages/contracts/src/crm/customer-workspace.ts`                                                                          | Contact projection query and aggregate summary                                                                             |
| CRM services          | `apps/loopdev-os/src/services/crm/`                                                                                         | Core, capture, Leads, Pipeline, Tasks, Customer 360 and operations                                                         |
| CRM APIs              | `apps/loopdev-os/src/app/api/crm/`                                                                                          | Contacts, Leads, capture, status, conversion, Opportunities, Pipeline, Tasks, Notes, Activities, Timeline and Customer 360 |
| CRM suite UI          | `apps/loopdev-os/src/suites/sales-crm/`                                                                                     | Shell, routing, Leads and shared CRM composition                                                                           |
| CRM migrations        | `supabase/migrations/20260827000000_crm_core_catalog_foundation.sql` through `20260907000000_crm_lead_assignment_scope.sql` | Core entities, shared foundation, security, Leads, Pipeline, Tasks, daily operation and assignment scope                   |
| CRM database tests    | `supabase/tests/database/005_crm_security.sql`, `006_crm_tasks_contract.sql`                                                | RLS/security and Tasks contract coverage                                                                                   |

## Alignment findings

### Contacts

- Contract schemas include query, page, create and update commands.
- API routes expose list/create/update behavior.
- Persistence is based on `crm_contacts` and organization-scoped relationships.
- Remaining concern belongs to F2/F3: permission behavior and cross-tenant test evidence.

### Leads

- Contracts cover source kind, source attribution, capture, update, status movement, errors and
  conversion-related stages.
- Services and routes cover capture, list, detail, status and conversion.
- The current authoritative implementation is the one integrated by PR #178.
- Legacy Leads branches have no CRM-specific tree delta requiring rescue.

### Pipeline and Opportunities

- Contracts distinguish stage terminal type, stage origin, Opportunity origin and command envelopes.
- API routes expose stage configuration, listing, detail, stage movement, reopen and update.
- Database migrations provide pipeline and opportunity constraints.
- Remaining concern belongs to F2/F3: server-side authorization, audit and end-to-end evidence.

### Tasks, Activities and Notes

- Contracts define lifecycle, priorities, activity sources, notes and query/read models.
- Services and routes expose task lifecycle, assignment, completion, reopen, notes, activities and
  timeline.
- `006_crm_tasks_contract.sql` provides database-level contract coverage.
- Remaining concern belongs to F2: append-only timeline and mutation permissions.

### Customer 360

- `customer-workspace.ts` defines the aggregate query and summary projection.
- Services and nested Contact routes expose the projection, sections, activity and tasks.
- The projection is correctly modeled as a Contact workspace, not a standalone CRM entity.
- Remaining concern belongs to F3: deduplication, partial loading and authenticated E2E evidence.

## F1 decisions

1. No contract or service migration is required from the superseded Leads branches.
2. `origin/develop@6255ec36` is the canonical contract baseline.
3. F1 does not introduce new CRM entities or routes.
4. Remaining gaps are validation/governance gaps and move to F2/F3 rather than being solved with
   parallel implementation branches.

## Validation plan

- [x] Build and typecheck `@loopdev/contracts`.
- [x] Run focused CRM API/service tests.
- [x] Verify CRM migration/type correspondence by inventory and contract review.
- [x] Record any discrepancy as a targeted follow-up, not as a new parallel CRM branch.

## Exit status

**Complete.** The surface inventory, alignment review and available executable validations pass.
No contract or service change is required from the superseded branches. Remaining authorization,
RLS and end-to-end concerns are explicitly deferred to F2/F3.
