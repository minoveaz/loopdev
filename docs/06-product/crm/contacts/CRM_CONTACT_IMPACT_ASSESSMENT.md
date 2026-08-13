---
title: CRM Contact Impact Assessment
status: approved
version: 1.1
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/82
approver: User
approved_at: 2026-08-13
---

# Impact Assessment de CRM Contact

## 1. Scope

`CRM-01` entregara Contactos y Customer 360 minimo sobre `SuiteRuntime + SuiteCanvas + FSD`.
Incluye lista, busqueda, crear, editar, detalle, posible duplicado y merge humano auditado.

## 2. Impact matrix

| Surface | Impact | Required work | Exit evidence |
| --- | --- | --- | --- |
| Contracts | required | Public schemas for Contact, commands, responses, pagination, errors and duplicate review | Contract typecheck/build and consumer compatibility |
| Schema | required | Additive CRM contact fields, scope columns, timestamps, normalized identifiers and indexes | Reset/replay, generated types, migration review |
| RLS | required | Verb-specific policies, organization/workspace scope, active membership and privileged-path controls | Positive/negative two-tenant role matrix |
| Storage | none | No documents or uploads in CRM-01 | Explicitly excluded from slice |
| Secrets/providers | none | No live Marketing/WhatsApp provider in CRM-01 | No provider credentials or browser secrets |
| AI | none | No scoring, recommendations or AI merge decision | Surfaces remain hidden |
| Billing/entitlements | planned | Confirm CRM workspace entitlement only; no billing implementation | Server-side feature/entitlement check |
| Observability | required | Trace ID, structured errors, mutation audit, merge audit and PII-safe logs | Logs and audit evidence without sensitive payloads |
| Rollout/rollback | required | Additive migration, seed, feature entitlement, application rollback and no destructive cleanup | Staging deploy, rollback note and release evidence |
| Frontend | required | Data Canvas list, split Canvas detail, forms, states, permissions and responsive behavior | Component/route/E2E evidence for delivered surface |
| Accessibility | required | Keyboard, focus, dialog semantics, labels and error association | Axe/browser evidence for Contact flows |
| Test data | required | Synthetic contacts, two organizations, duplicate candidates and deterministic seed | Fixture replay and import dry-run report |

## 3. Dependency map

```text
UX-00 approved
  -> CRM Contact Contract
  -> SEC-01/SEC-02/SEC-03/SEC-04
  -> DB-01/DB-02
  -> CRM-01 frontend vertical slice
  -> readiness review before test
```

CRM-01 must not silently absorb pipeline, leads, documents, communications, billing or AI work.

## 4. Schema and data controls

- Migration is additive and forward-only.
- All tenant-owned rows include `organization_id`.
- Workspace and brand references are organization-consistent.
- Normalized phone/email support deterministic duplicate checks inside one organization.
- Personal fields are optional for Contact creation; logs and analytics redact them.
- Merge preserves references and writes an append-only audit event.
- No production data is included in fixtures, seeds, screenshots or tests.

## 5. Rollout and rollback

- Rollout is behind the CRM organization entitlement/feature control.
- Staging uses synthetic data and two organizations.
- No destructive migration or data cleanup is allowed in CRM-01.
- Application rollback must remain compatible with the additive schema.
- If RLS, tenant integrity, persistence or duplicate handling fails, the release is `NOT READY`.

## 6. Definition of Ready for CRM-01

- [x] Contact contract reviewed by Product Owner and Tech Lead.
- [x] Impact matrix reviewed and linked from the delivery Issue.
- [x] SuiteRuntime/SuiteCanvas usage confirmed on the branch.
- [x] Data/security dependencies assigned or explicitly sequenced.
- [x] No unrelated files are included in the implementation commit.
- [x] Acceptance cases and readiness checklist references are present.

## 7. Aprobacion

Impact assessment aprobado el 2026-08-13 por User. `CRM-01` queda listo para iniciar implementacion
cuando se active el carril de trabajo; cualquier cambio de schema, RLS o alcance requiere actualizar
este documento y la evidencia del Issue.
