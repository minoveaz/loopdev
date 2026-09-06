# CRM Suite closure matrix

**Snapshot:** 2026-09-06
**Integration base:** `origin/develop@6255ec367c245067ec92f4bf1a7a74f91c0cb53f`
**Closure track:** `crm-suite-closure`

This matrix is the Phase 0 source of truth for module ownership, integrated evidence, active
branches and remaining work. A branch marked `rescue-review` must not be merged or deleted until
its diff against `origin/develop` has been reviewed.

## Module status

| Module                   | Current state                        | Integrated evidence                                                                                                                                 | Primary paths                                                                                       | Follow-up                     |
| ------------------------ | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------- |
| CRM foundation           | Integrated                           | PR #27, `5d71ac9f`                                                                                                                                  | `apps/loopdev-os/src/services/crm`, `packages/contracts/src/crm`                                    | F2 security evidence          |
| Contacts                 | Integrated, closure evidence pending | PRs #114/#134, `6d5f8e8d`, `e858368a`                                                                                                               | `apps/loopdev-os/src/app/api/crm/contacts`, CRM contracts                                           | Issue #82 / F3                |
| Leads backend            | Integrated                           | PR #119, `10351840`                                                                                                                                 | `apps/loopdev-os/src/services/crm/leads.ts`, capture API                                            | Issue #84 / F3                |
| Leads frontend           | Integrated via latest delivery       | PR #178, `6255ec36`                                                                                                                                 | `apps/loopdev-os/src/suites/sales-crm/leads`, `/sales-crm/leads`                                    | Rescue review of old branches |
| Pipeline / Opportunities | Integrated                           | PR #121, `f577f045`                                                                                                                                 | opportunities API, pipeline contracts and services                                                  | Issue #85 / F3                |
| Tasks                    | Integrated                           | PR #126, `b6f063c8`, `686800d8`                                                                                                                     | tasks API/service, task contracts                                                                   | Issue #87 / F3                |
| Customer 360             | Integrated                           | PR #128, `95b98d15`; PR #130, `518765e2`                                                                                                            | `packages/contracts/src/crm/customer-workspace.ts`                                                  | Issue #88 / F3                |
| Daily Operation          | Cross-cutting hardening integrated   | PR #129, `0c656cf6`                                                                                                                                 | CRM activities, notes, timeline surfaces                                                            | Validate through F3/F5        |
| Communications Core      | In progress, not integrated          | Issue #157; branch `feature/communications-core-implementation`                                                                                     | `apps/loopdev-os/src/services/communications`, communications migrations                            | F4                            |
| Communications Inbox     | In progress, must follow Core        | branch `feature/crm-communications-inbox-implementation`                                                                                            | communications routes and inbox UI                                                                  | F4                            |
| CRM database/RLS         | Partially evidenced                  | `20260827000000_crm_core_catalog_foundation.sql`, `20260828000000_crm_lead_capture_idempotency.sql`, `20260907000000_crm_lead_assignment_scope.sql` | `supabase/migrations`, `supabase/tests/database/005_crm_security.sql`, `006_crm_tasks_contract.sql` | Issues #70–#78 / F2           |
| CI/staging/operations    | Pending closure evidence             | PRs #169, #173 provide adjacent governance evidence                                                                                                 | `.github/workflows`, staging/bootstrap and validation scripts                                       | Issues #76–#81, #90–#92 / F5  |

## Branch classification

| Remote branch                                     | Tip SHA    | Relation to `develop`                                                  | Classification     | Decision                                |
| ------------------------------------------------- | ---------- | ---------------------------------------------------------------------- | ------------------ | --------------------------------------- |
| `feature/crm-leads-implementation`                | `1814dd50` | Latest Leads delivery branch; PR #178 merged                           | integrated-history | Do not continue; use `develop`          |
| `feature/crm-leads-quality`                       | `2a1ee184` | WIP commits are superseded; direct tree delta is outside CRM scope     | superseded         | Archive after provenance check          |
| `feature/leads-frontend-implementation`           | `35de9aa4` | Earlier frontend commits; no CRM-specific direct tree delta vs PR #178 | superseded         | Archive after provenance check          |
| `feature/crm-leads-backend-foundation`            | `14350de1` | Backend integrated by PR #119                                          | integrated-history | Archive after evidence check            |
| `feature/crm-contacts-backend-foundation`         | `2229b02b` | Contacts backend integrated by PR #114                                 | integrated-history | Archive after evidence check            |
| `feature/crm-contacts-technical-certification`    | `e858368a` | Contacts certification integrated by PR #134                           | integrated-history | Archive after evidence check            |
| `feature/crm-contacts-ui-design`                  | `5863a2c1` | Contacts UI work already present or superseded                         | historical-review  | Do not branch from it                   |
| `feature/crm-pilot-pipeline-implementation`       | `a8dc5a8a` | Pipeline and historical Tasks delivery integrated                      | integrated-history | Archive after evidence check            |
| `feature/crm-tasks-implementation`                | `686800d8` | Tasks integrated by PR #126                                            | integrated-history | Archive after evidence check            |
| `feature/crm-customer360-implementation`          | `6e335ec3` | Customer 360 integrated by PR #128                                     | integrated-history | Archive after evidence check            |
| `feature/crm-daily-operation-hardening`           | `8fad6d8c` | Hardening integrated by PR #129                                        | integrated-history | Archive after evidence check            |
| `feature/communications-core-implementation`      | `dacb8405` | Communications commits remain outside `develop`                        | authorized-active  | Complete Core first                     |
| `feature/crm-communications-inbox-implementation` | `bc944f7e` | Inbox commits remain outside `develop`                                 | authorized-blocked | Wait for Core integration               |
| `backup/health-os-crm-wip`                        | `3420f105` | Mixed Health OS/CRM backup                                             | backup-only        | Preserve; never use as integration base |
| `integration/sales-crm-clean`                     | `122e902d` | Historical integration branch                                          | historical-review  | Do not continue                         |
| `copilot/todo-contactos-crm`                      | `5945150d` | Refers to merged Contacts work                                         | historical-review  | Archive after provenance check          |
| `feature/crm-g0-shared-foundation`                | `1b300a61` | G0 integrated by PR #111                                               | integrated-history | Archive after evidence check            |
| `feature/crm-shared-foundation`                   | `f0b63905` | Shared foundation integrated                                           | integrated-history | Archive after evidence check            |

## Pull request and issue authority

| Area                  | Integrated PRs                 | Open delivery issue | Closure phase |
| --------------------- | ------------------------------ | ------------------- | ------------- |
| Contacts              | #114, #134                     | #82                 | F3            |
| Leads                 | #119, #178                     | #84                 | F3            |
| Pipeline              | #121                           | #85                 | F3            |
| Tasks                 | #126                           | #87                 | F3            |
| Customer 360          | #128, #130                     | #88                 | F3            |
| Communications        | #159, #160 are definition/docs | #157                | F4            |
| Security/data         | migrations and database tests  | #70–#78             | F2            |
| CI/staging/operations | adjacent validation PRs        | #76–#81, #90–#92    | F5            |
| UAT/go-live           | prior delivery PRs             | #67, #68, #86, #94  | F6/F7         |

## Phase 0 decisions

1. `origin/develop@6255ec36` is the only integration base.
2. PR #178 is authoritative for the current Leads frontend delivery.
3. The two older Leads frontend/quality branches require rescue review before archival.
4. Communications Core is the only authorized implementation stream before Inbox.
5. No new CRM feature branch is authorized until Phase 1 and Phase 2 are complete.

## Phase 0 exit evidence

- [x] Integration base recorded.
- [x] Module-to-PR/Issue/path mapping recorded.
- [x] CRM remote branches classified.
- [x] Leads duplicate-work risk explicitly identified.
- [x] Communications branch dependency recorded.
- [x] Rescue diff review completed for both older Leads branches.
- [x] Closure track updated with the matrix reference.

## Leads rescue review checkpoint

Both legacy frontend branches contain commits that are not ancestors of `origin/develop` or the
authoritative PR #178 branch:

- `feature/crm-leads-quality`: `a3a83407`, `35de9aa4`, `5528ca2e`, `2a1ee184`.
- `feature/leads-frontend-implementation`: `a3a83407`, `35de9aa4`.

The direct tree comparison found no CRM-specific content missing from PR #178. The remaining
differences are unrelated platform/showcase/CI artifacts, so no cherry-pick is authorized. Both
branches are superseded and may be archived after provenance is retained.
