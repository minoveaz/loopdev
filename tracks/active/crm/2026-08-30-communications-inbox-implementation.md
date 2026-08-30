---
id: communications-inbox-implementation
title: Implementacion de CRM Communications Inbox
status: active
created: 2026-08-30
updated: 2026-08-30
owner: crm
lead: null
branch: feature/crm-communications-inbox-implementation
branches: []
phase: 0
pull_requests: []
issues: [158]
packages:
  - docs/06-product/communications/crm-communications-inbox
  - packages/contracts/src/communications/communications.ts
  - apps/loopdev-os/src/suites/sales-crm
release: not-required
areas: [crm, communications, frontend, platform]
dependencies:
  - communications-core-implementation
  - docs/06-product/communications/crm-communications-inbox
blocked_by:
  - Docker/Supabase validation for real Communications Core persistence and provider integration
supersedes: []
---

# Implementacion de CRM Communications Inbox

## Outcome

Deliver the first production-directed CRM Communications Inbox by adapting the validated WhatsApp POC to the approved Communications Core boundary. The current slice remains deterministic and mock-backed while the product workflow, contracts and responsive composition are certified; real provider execution, persistence and durable processing remain owned by Communications Core.

## Context

PR #160 merged the Chatwoot -> LoopDev reference guide into `develop`. The implementation branch keeps Communications Core commits and is now synchronized with that `develop` tip. The Inbox remains a CRM composition; Communications Core remains the owner of provider policy, delivery, consent, tenant authorization and persistence.

The WhatsApp POC is the capability source for this track, not a persistence or ownership source. Its useful behavior will be mapped into canonical Communications contracts and CRM-owned presentation: triage, assignment, lifecycle, internal notes, policy-aware outbound messaging, templates, delivery states, webhook-derived activity and CRM context. Legacy POC tables and direct provider access remain excluded from the Inbox.

## Scope

### Included

- Register the Communications module in the existing Sales CRM suite.
- Add the `/sales-crm/communications` route using the `SplitWorkspace` composition contract.
- Build deterministic mock read models for the conversation list, selected thread and CRM context.
- Cover the first agent workflow: filter, select, self-assign, reply, internal note and lifecycle state presentation.
- Add the first authorized read adapter from Communications Core to the CRM Inbox.
- Adapt the useful WhatsApp POC capabilities into public read/action contracts without importing legacy tables, provider credentials or Core repositories into the UI.
- Prepare the Inbox for authorized reply, note, assignment, lifecycle, template and delivery-state flows as the Core handoff becomes available.
- Render policy-aware states for account pause, expired window, failed send, forbidden, empty and loading.
- Preserve the responsive sequence list -> conversation -> context on small screens.

### Excluded

- Direct Supabase reads or writes from UI components.
- Provider calls, webhook processing, migrations, RLS, worker behavior and server authorization changes; these remain owned by `communications-core-implementation` and are consumed through its public boundary.
- Media, calls, additional channels, labels, teams, routing, macros, bulk actions, AI and SLA.
- Promotion of CRM workflow components into `@loopdev/ui` before a second real consumer.

## Approved decisions

| Date       | Decision                                                                  | Reason                                                                                                                        | Impact                                                                                             | Approved by |
| ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| 2026-08-30 | Start with a deterministic mock-backed UI vertical slice.                 | Docker/Supabase is unavailable locally and the approved contract is sufficient to validate the user experience independently. | The mock adapter must use public contract-shaped read models and be replaceable by an API adapter. | User        |
| 2026-08-30 | Compose Inbox inside Sales CRM `SuiteRuntime` and `SplitWorkspace`.       | Preserves platform ownership and the approved CRM information hierarchy.                                                      | No parallel shell, sidebar, header or overlay manager is allowed.                                  | User        |
| 2026-08-30 | Keep conversation workflow CRM-owned until a second real consumer exists. | VitaBlue is a future consumer, not current implementation evidence.                                                           | Shared promotion is deferred; the contract remains provider-neutral.                               | User        |
| 2026-08-30 | Use this existing Inbox track as the POC adaptation and CRM integration track; keep provider execution and durable operations in Communications Core. | The Inbox already consumes Core and owns the CRM workflow, while a third track would duplicate scope and ownership. | Add an explicit POC capability map and integration phases without moving provider, webhook, persistence or worker ownership into the UI track. | User |
| 2026-08-30 | Rescue POC behavior through canonical contracts and adapters, not through legacy POC tables or direct provider access. | The POC proves useful workflows but its legacy storage and shortcuts do not satisfy current tenant and ownership boundaries. | Preserve product behavior while allowing the underlying implementation to be replaced by authorized Core services. | User |

## Architecture and contracts

```text
Sales CRM route
  -> SalesCrmShell / SuiteRuntime
  -> SplitWorkspace
  -> communications-inbox widget
  -> conversation features and entities
  -> public Communications and CRM read models
  -> mock adapter now / authorized API adapter later
```

The route owns composition. Features own user actions and view state. The mock adapter owns deterministic fixture data only. No UI layer resolves organization authorization, calls a provider or imports Core repositories.

The adaptation flow is:

```text
WhatsApp POC capability inventory
  -> canonical Communications contracts and policies
  -> authorized read/action adapters
  -> CRM Inbox workflow and context
  -> Core-backed persistence, provider execution and delivery events
```

### POC capability map

| POC capability | Inbox adaptation | System owner | Current state |
| --- | --- | --- | --- |
| Conversation triage, search and filters | Inbox list and operational density | CRM Inbox | Implemented with fixtures and authorized read path |
| Thread timeline and CRM context | SplitWorkspace thread/context workflow | CRM Inbox + CRM read model | Implemented in mock-backed slice |
| Self-assignment and lifecycle | Granular authorized actions and state feedback | Communications Core contract + CRM Inbox presentation | Implemented through the authorized Inbox action adapter; live persistence evidence pending |
| Reply and internal note | Separate public reply and team-only note flows | Core policy and persistence; Inbox composer | Implemented through the authorized Inbox action adapter; live provider/RLS evidence pending |
| 24-hour window and approved templates | Policy-aware composer and template path | Communications Core | Implemented: approved-template read, parameter UI, policy gate and server-side dispatch |
| Queued/sent/delivered/read/failed states | Message status presentation and recovery feedback | Communications Core worker/events | Contract and service primitives prepared; end-to-end evidence pending |
| Signed webhook, media and interactive inbound events | Normalized activity/read model; media rendering deferred | Communications Core / webhook worker | Parser and canonical entry prepared; Inbox rendering pending |
| Organization isolation and auditability | Capability-driven controls and safe context | Platform/Communications Core | Contracts and authorization paths present; Docker/Supabase evidence pending |

## Branch strategy

Implementation continues on `feature/crm-communications-inbox-implementation`, based on the Communications Core tip and synchronized with the PR #160 merge into `develop`. The delivery Pull Request targets `develop` and includes `Closes #158` after the implementation slice and validation gates are complete.

## Fases

### Phase 0: Readiness and route composition

**Objective:** Register the module and establish the first route and SplitWorkspace composition without real persistence.

**Definition of Ready**

- [x] Inbox UX, component audit, contract, impact assessment and handoff reviewed.
- [x] Chatwoot -> LoopDev reference guide merged through PR #160.
- [x] Communications Core implementation branch is available as a local dependency.
- [x] Local Docker/Supabase limitation is recorded; mocks are explicitly allowed for this slice.

**Deliverables**

- [x] Communications module registered in Sales CRM navigation and config.
- [x] `/sales-crm/communications` route mounted through the existing suite shell.
- [x] Public-contract-shaped deterministic fixtures and view model boundary.
- [x] Authorized `GET /api/communications/inbox` read adapter and development seed.
- [x] Shared Inbox contracts, separated provider surfaces, injected copy/formatters and source-contract validation.

**Validation**

- [x] Track validator and generated index.
- [x] Focused route/config lint and editor diagnostics.
- [x] Accessibility and responsive behavior checks before visual review.
- [x] Focused API route tests cover validation, authentication, permission and response forwarding.

**Evidence:** `SalesCrmShell.tsx`, `config.ts`, `communications/CommunicationsInboxWidget.tsx`, `communications/inbox.fixture.ts` and `CommunicationsInbox.test.tsx`.

**State:** in progress

### Phase 1: POC capability adaptation and Core handoff

**Objective:** Convert the POC capability map into stable Inbox-facing contracts and authorized adapters without moving provider ownership into the CRM UI.

**Definition of Ready**

- [ ] Phase 0 visual, keyboard and responsive evidence is complete.
- [ ] Communications Core publishes the read/action contract required by each selected capability.
- [ ] POC capability map has an explicit disposition: adapt now, defer, or reject.

**Deliverables**

- [ ] Inbox read model exposes the conversation, participant, assignment, lifecycle, policy and delivery data required by the workflow.
- [ ] Authorized adapters cover reply, internal note, assignment and lifecycle actions with normalized pending/success/failure feedback.
- [ ] Composer contract supports the 24-hour policy and an approved-template path without exposing provider credentials.
- [ ] Delivery and webhook-derived activity can be consumed as Core-owned read data.
- [ ] Deferred POC capabilities are recorded with rationale, especially media rendering, calls, routing, macros, bulk actions, AI and SLA.

**Validation**

- [ ] Contract and consumer tests cover supported capabilities and unsupported actions.
- [ ] API authorization tests cover read, reply, note, assignment and lifecycle boundaries.
- [ ] Fixture and production adapters satisfy the same public Inbox contract.
- [ ] `pnpm validate:changed` and source-contract ownership checks pass.

**Evidencia:** Actions and approved-template adapters are implemented in `apps/loopdev-os/src/app/api/communications/inbox/actions/route.ts` and `apps/loopdev-os/src/app/api/communications/templates/route.ts`; live persistence and delivery evidence remain blocked by Docker/Supabase.

**State:** pending

### Phase 2: Production integration and pilot readiness

**Objective:** Connect the adapted Inbox workflow to real Core persistence and provider events, then prepare the design-partner pilot.

**Definition of Ready**

- [ ] Phase 1 contract and adapter evidence is complete.
- [ ] Communications Core Fases 1 a 4 have the required Docker/Supabase validation.
- [ ] WABA, secrets and pilot users are available outside Git and logs.

**Deliverables**

- [ ] Real read and action adapters replace fixture-local mutations behind the same provider boundary.
- [ ] Webhook, delivery, retry, template and policy states are visible in the Inbox read model.
- [ ] End-to-end pilot path is documented with rollout, rollback and residual risks.
- [ ] Observability and audit references are available for agent actions and provider outcomes.

**Validation**

- [ ] Docker/Supabase migrations and pgTAP isolation checks pass.
- [ ] Signed webhook, duplicate event, delivery, policy and provider failure tests pass.
- [ ] Desktop, tablet and mobile E2E evidence passes after explicit visual approval.
- [ ] Security review and pilot gate are approved.

**Evidencia:** Pendiente de entorno Docker/Supabase y activación protegida.

**State:** pending

## Change log

| Date | Change | Reason | Phase impact | Approved by |
| ---- | ------ | ------ | ------------ | ----------- |

## Risks and blockers

| Risk or blocker                                              | Impact                                                   | Mitigation                                                                                                    | Owner                   | State |
| ------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------- | ----- |
| Core persistence and RLS are not executable on this machine. | Real integration cannot be certified locally.            | Keep the adapter boundary explicit and complete the Docker/Supabase handoff before live data.                 | communications/platform | open  |
| A CRM widget could become a hidden shared component.         | Future consumers would inherit CRM nouns or permissions. | Keep ownership in CRM and defer promotion until a second real consumer.                                       | crm/platform            | open  |
| Conversation actions may drift from Core policy.             | UI could suggest unsupported sends or transitions.       | Capabilities now derive from granular permissions; mutations remain behind the future authorized API adapter. | crm/communications      | open  |
| POC scope could expand into an unbounded omnichannel rebuild. | Delivery would lose focus and duplicate future tracks. | Maintain the capability map and explicitly defer media rendering, calls, routing, macros, bulk actions, AI and SLA. | crm/communications | open |

## Criterios de cierre

- [ ] Mock-backed Inbox route renders the approved first workflow.
- [ ] Every selected POC capability has an adapted, deferred or rejected disposition recorded in the capability map.
- [ ] Loading, empty, forbidden, paused, expired-window, failed-send and conflict states are covered.
- [ ] Keyboard, accessibility, responsive and theme evidence is complete.
- [ ] Real API handoff, Core ownership boundaries and remaining Docker/Supabase gates are documented.
- [ ] Pull Request validation passes and closure is approved explicitly by the user.

## Validation evidence

| Date       | Validation                                      | Result                                                                                                 | Reference                                                                                                           |
| ---------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 2026-08-30 | Communications Inbox API route tests            | Passed: 4 cases covering query validation, authentication, permission and model forwarding             | `apps/loopdev-os/src/app/api/communications/inbox/route.test.ts`                                                    |
| 2026-08-30 | Focused ESLint and editor diagnostics           | Passed for the Communications service, route, provider and shell integration                           | `apps/loopdev-os/src/services/communications/inbox.ts`, `apps/loopdev-os/src/app/api/communications/inbox/route.ts` |
| 2026-08-30 | Local HTTP route probe                          | Passed: unauthenticated request returns `401 Unauthorized`                                             | `GET /api/communications/inbox`                                                                                     |
| 2026-08-30 | Communications Inbox UI Vitest                  | Blocked before test execution by the workspace Radix `aria-hidden` resolution error                    | `apps/loopdev-os/src/app/sales-crm/communications/CommunicationsInbox.test.tsx`                                     |
| 2026-08-30 | Communications Inbox focused UI/Axe and mobile-surface tests | Passed: 5 cases, including list -> thread -> context responsive flow and Axe | `apps/loopdev-os/src/app/sales-crm/communications/CommunicationsInbox.test.tsx` |
| 2026-08-30 | Shell changed-only validation                   | Partial: 10 tests passed; 3 suites blocked by the workspace Radix `aria-hidden` resolution error | `pnpm test:shell:changed` |
| 2026-08-30 | Contracts, source-contract and ownership checks | Passed: shared contracts build, no local redeclarations and zero hardcoded component contract findings | `packages/contracts/src/communications/inbox.ts`, `apps/loopdev-os/src/suites/sales-crm/communications`             |
| 2026-08-30 | Communications Inbox action and template tests | Passed: 21 focused tests covering Core provider parameter handling, authorized action dispatch, template listing, template UI interpolation and expired-window gating | `apps/loopdev-os/src/app/api/communications/inbox/actions/route.test.ts`, `apps/loopdev-os/src/app/api/communications/templates/route.test.ts`, `apps/loopdev-os/src/app/sales-crm/communications/CommunicationsInbox.test.tsx`, `apps/loopdev-os/src/services/communications/whatsapp.test.ts` |
| 2026-08-30 | Contracts build and Communications typecheck | Contracts build passed; app typecheck reports only pre-existing `.next` operation route and Contacts fixture errors, with no Communications diagnostics | `packages/contracts`, `apps/loopdev-os/tsconfig.json` |

## Session handoff

- **Date:** 2026-08-30.
- **Continuation branch:** `feature/crm-communications-inbox-implementation`.
- **Starting commit:** `f74198f`.
- **State reached:** POC adaptation is connected to the existing Inbox track; mock-backed Inbox route, SplitWorkspace wiring, deterministic fixtures, responsive list -> thread -> context flow, authorized actions and approved-template dispatch are implemented.
- **Decisions, blockers and risks:** The Inbox track coordinates CRM adaptation; Communications Core remains owner of provider policy, persistence, webhook, worker and tenant authorization. Docker/Supabase validation, live read-model refresh and delivery/webhook evidence remain pending.
- **Validation executed:** Focused Communications, provider and API tests passed 21 cases; contracts build passed; Communications lint passed; app typecheck still reports only the known `.next` operation route and Contacts fixture errors.
- **Next concrete action:** Complete Core-backed delivery/webhook read-model integration and run Docker/Supabase/RLS validation before visual review and pilot readiness.
- **Current integration:** `GET /api/communications/inbox` reads conversations, CRM contacts, channels and messages through the authenticated Supabase server client. `GET /api/communications/templates` and `POST /api/communications/inbox/actions` provide authorized template and Inbox action boundaries. `supabase/seed_communications_inbox.sql` provides one idempotent development conversation for `estar-protegidos`.
- **Current limitation:** Live provider persistence, delivery status, webhook-derived activity and worker processing require Communications Core migrations and an active Docker/Supabase environment. The fixture adapter remains available for isolated UI tests and E2E bypass.

## Closure

Pending explicit user approval.
