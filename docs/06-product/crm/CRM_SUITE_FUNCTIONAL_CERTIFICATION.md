# CRM Suite functional certification

**Phase:** F3 — completed
**Base:** `origin/develop@6255ec367c245067ec92f4bf1a7a74f91c0cb53f`

> **UI completion note (2026-09-06):** This historical matrix does not certify the newly completed
> Pipeline, Tasks or Customer 360 route composition. Visual certification remains pending until the
> authenticated desktop/mobile browser gates, accessibility checks and staging readiness gates below
> are run against a release candidate. The synthetic inbox fixture is for local/E2E reproduction
> only and is never evidence of a live WhatsApp/WABA integration.

## Certification matrix

| Slice           | API evidence                                                                                       | UI evidence                           | Persistence/security gate                    | Status            |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------- | ----------------- |
| Contacts        | `contacts/route.test.ts`                                                                           | `contacts/ContactFormDialog.test.tsx` | tenant isolation from F2                     | pending execution |
| Leads           | `capture/route.test.ts`, `leads/route.test.ts`, `conversion/route.test.ts`, `status/route.test.ts` | `leads/*.test.ts(x)`                  | idempotency, assignment and conversion audit | pending execution |
| Pipeline        | `opportunities/route.test.ts`                                                                      | pipeline shell/components             | stage constraints and tenant FKs             | pending execution |
| Tasks and Notes | `tasks/route.test.ts`, `notes/route.test.ts`                                                       | task/note surfaces                    | actor attribution and timeline append-only   | pending execution |
| Customer 360    | `contacts/[contactId]/customer-360/route.test.ts`                                                  | customer workspace surfaces           | deduplicated activity projection             | pending execution |

## Required end-to-end journey

1. Create or resolve a Contact in organization A.
2. Capture an idempotent Lead for that Contact.
3. Qualify and convert the Lead into an Opportunity.
4. Move the Opportunity through a valid Pipeline stage.
5. Create and complete a Task, add a Note, and verify timeline attribution.
6. Read Customer 360 and verify the Contact, Lead, Opportunity, Task, Note and Activity projection.
7. Repeat negative reads and mutations from organization B; all cross-tenant operations must fail or
   return no data.

## Available develop validation

`origin/develop` provides the following targeted commands:

- `pnpm test` for API, service, contract and UI unit/component tests;
- `pnpm e2e:crm:quick` for the CRM primitive certification;
- `pnpm e2e:crm:matrix` for desktop/mobile CRM certification;
- `pnpm test:crm:backend-http` for the HTTP backend flow;
- `pnpm test:data:domain` for database-domain validation.

## Exit gates

- [ ] Issues #82, #84, #85, #87 and #88 have linked evidence.
- [ ] Targeted API/service/UI tests pass from the develop snapshot.
- [ ] Authenticated E2E flow passes on desktop and mobile profiles.
- [ ] Full journey persists across all CRM slices.
- [ ] No P0/P1 defect remains without explicit disposition.
- [ ] Fixtures, claims and simulated critical-route responses are removed or explicitly accepted.

## Execution results

| Validation                                         | Result                                         | Evidence                                                                                                       |
| -------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| CRM API, service and UI tests                      | PASS — 26 files, 133 tests                     | `pnpm --filter loopdev-os exec vitest run ...`                                                                 |
| CRM contract tests                                 | PASS — 3 files, 15 tests                       | `pnpm --filter @loopdev/contracts exec vitest run ...`                                                         |
| CRM E2E quick                                      | PASS — 6/6 desktop                             | `pnpm e2e:crm:quick`                                                                                           |
| CRM E2E matrix                                     | PASS — 18/18 desktop/mobile/mobile-compact     | `pnpm e2e:crm:matrix`                                                                                          |
| Contacts frontend E2E                              | PASS — 1/1 desktop with official fixture       | `e2e/contacts-form.certification.spec.mjs`                                                                     |
| Database domain suite                              | PASS — 8 files, 220 tests                      | `pnpm test:data:domain`                                                                                        |
| CRM backend bootstrap/HTTP                         | PASS — authenticated bootstrap and HTTP checks | `pnpm test:crm:bootstrap && pnpm test:crm:backend-http` with `SUPABASE_DB_CONTAINER=supabase_db_loopdev`       |
| Persisted Contact → Lead                           | PASS — capture 201 and qualification 200       | Authenticated local Supabase journey                                                                           |
| Persisted Lead → Opportunity conversion            | PASS after fix `c5aece7`                       | `POST /api/crm/leads/conversion` returns 201; RPC was invoked unbound (`supabase.rpc` lost its client context) |
| Persisted Opportunity → Task → Note → Customer 360 | PASS                                           | Task create 201, completion 200, Note create 201, Customer 360 read 200; cross-tenant read denied 403          |

The frontend certification includes responsive desktop/mobile/compact layouts, overflow checks,
selection/menu behavior, command-bar contracts, light/dark themes and the Contacts form/table
contract with the official fixture. The authenticated backend
HTTP certification also passed Opportunity idempotency, stage transition, reopen, optimistic
version conflict and viewer mutation denial.

## Review findings

| Finding                                                                        | Severity       | Consequence                                                                                                   | Required action                                                                                        |
| ------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| No existing E2E chains Contact → Lead → Opportunity → Task/Note → Customer 360 | High           | Unit/API coverage does not prove cross-service persistence                                                    | Add and run an authenticated persisted journey                                                         |
| API/service tests mock repositories and authorization                          | Medium         | Contract behavior is covered, database wiring is not                                                          | Keep domain suite plus persisted HTTP journey                                                          |
| CRM primitive E2E uses UI fixture data                                         | Medium         | Responsive primitives are certified, not real CRM persistence                                                 | Retain as visual/UI gate; do not use as functional closure evidence                                    |
| Lead conversion RPC was invoked through an unbound method                      | High/P1, fixed | The JavaScript call failed before reaching PostgREST (`Cannot read properties of undefined (reading 'rest')`) | Call `supabase.rpc(...)` with its receiver preserved; commit `c5aece7`; rerun authenticated conversion |

The authenticated persisted journey now passes through Contact, Lead, Opportunity, Task, Note and
Customer 360. Cross-tenant Customer 360 access was denied with 403. Issues #82, #84, #85, #87 and
#88 were reconciled with this evidence and closed after explicit user approval.
