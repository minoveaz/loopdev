---
title: CRM Pipeline and Opportunities Impact Assessment
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/85
---

# Impact assessment de Pipeline

| Area | Classification | Impact | Evidence required |
| --- | --- | --- | --- |
| Contracts | required | Opportunity, activity summary, stage history, board columns, commands, errors, reopening and Lead conversion | Typecheck, compatibility and contract tests |
| Schema | required | Opportunities, stages, origins, product key, version, activity/timeline references and unique conversion constraint | Migration review and rollback |
| RLS | required | Per-verb tenant/workspace/brand/contact/lead/stage scope | pgTAP and cross-tenant tests |
| Storage | none | No documents or attachments in pilot | No storage paths |
| Secrets/providers | none | Manual Opportunities and Lead-derived Opportunities; no live provider | No browser secrets |
| AI | none | No scoring or automated decisions | Explicit exclusion |
| Billing/entitlements | planned | Only existing CRM entitlement gates | Permission evidence |
| Observability | required | Stage moves, reopening reasons, creates, conversions, activity, conflicts and idempotency | Redacted audit/log evidence |
| Rollout/rollback | required | Additive migrations, seed stages, reversible deployment | Staging rollback and restore evidence |

## Data sensitivity

Contact identifiers and commercial information are confidential. Logs, analytics and screenshots must
exclude unnecessary PII, tokens, payloads and cross-tenant data. Retention and export audit follow CRM
Core policy.

## Dependencies

- Contact contract and RLS.
- Lead contract and conversion semantics.
- Tenant/workspace/brand membership and kill switches.
- Existing `SuiteRuntime`, `SuiteCanvas`, `KanbanBoard` and table primitives.
- CRM pilot staging, synthetic fixtures and readiness review.

## Tests and environments

Required: unit tests for stage transitions and idempotency, integration tests for commands/RLS,
concurrency test for conversion uniqueness, E2E for board/table/detail/create, accessibility checks,
responsive checks and staging evidence. No production data in development or test fixtures.

## No-go conditions

- Stage IDs are changed to rename a visible stage.
- A user can move or read an Opportunity across tenant/workspace scope.
- Conversion creates duplicate Opportunities for the same conversion tuple.
- Contact or Lead can be changed silently during conversion.
- Manual Pipeline creation changes Lead status without an explicit conversion.
- Board drag and drop bypasses server authorization or audit.
- Rollback leaves orphaned Opportunity/Lead relationships.
- Activity or stage history is reconstructed only from client state or loses historical stage labels.
- Board aggregates or pagination expose data outside the active tenant/workspace scope.
- A manual idempotency key is reused with a different payload without a conflict.
