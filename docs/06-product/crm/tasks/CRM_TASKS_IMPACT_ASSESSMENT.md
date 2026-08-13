---
title: CRM Tasks, Notes and Timeline Impact Assessment
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/87
---

# Impact assessment de Tasks

| Area | Classification | Impact | Evidence required |
| --- | --- | --- | --- |
| Contracts | required | Task lifecycle, Note permissions/edit policy, ActivitySource, TimelineEvent actor/origin, ActivityItem, My Day pagination and commands | Typecheck and contract tests |
| Schema | required | Tasks, notes, append-only events, polymorphic relation integrity, versions and deduplication keys | Migration review and rollback |
| RLS | required | Per-verb tenant/workspace/brand and relation scope | pgTAP and cross-tenant tests |
| Storage | none | No attachments or documents in pilot | No storage paths |
| Secrets/providers | none | No external calendar, email or messaging provider | No browser secrets |
| AI | none | No automated task generation or scoring | Explicit exclusion |
| Billing/entitlements | planned | Existing CRM entitlement gates only | Permission evidence |
| Observability | required | Create, assign, complete, reopen, updateNote/moderation, actor type, event origin and timeline audit | Redacted evidence without note bodies |
| Rollout/rollback | required | Additive schema, append-only compatibility and reversible deployment | Staging rollback and restore evidence |

## Data sensitivity

Notes and task descriptions may contain personal or commercial information. They require tenant scope,
permission checks, minimised logs and exclusion from analytics/screenshots/error payloads.

## Dependencies

- Contacts, Leads and Pipeline contracts/RLS.
- Tenant/workspace/brand membership and kill switches.
- Customer 360 relation read models.
- `SuiteRuntime`, `SuiteCanvas`, table, tabs and state primitives.
- Staging, synthetic fixtures and readiness review.

## Tests and environments

Required: unit tests for lifecycle and due dates, integration/RLS tests, concurrency/version tests,
idempotency tests for complete/reopen/assign, relation integrity tests, Customer 360 deduplication,
E2E for My Day/create/complete/note/timeline, accessibility/responsive checks and staging evidence.

## No-go conditions

- Task or Note can reference another tenant.
- Completing or reopening bypasses permission, version or audit.
- Timeline events can be edited or deleted by clients.
- Note bodies appear in logs, analytics or error payloads.
- A mutation succeeds without its timeline event or leaves partial state.
- My Day or relation panels use unbounded queries.
- Customer 360 shows the same ActivityItem more than once through indirect relations.
- Note editing or moderation bypasses policy, permission or audit.
- `updateNote` bypasses optimistic concurrency or emits no edit event.
- ActivityItems omit a stable `ActivitySource` and Customer 360 cannot deduplicate them deterministically.
- System-generated and user-generated events cannot be distinguished in the audit trail.
- External calendar, email, WhatsApp, AI or push capabilities enter the pilot scope.
