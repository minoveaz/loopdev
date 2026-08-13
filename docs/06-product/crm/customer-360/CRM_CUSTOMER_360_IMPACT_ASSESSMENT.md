---
title: CRM Customer 360 Impact Assessment
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/88
---

# Impact assessment de Customer 360

| Area | Classification | Impact | Evidence required |
| --- | --- | --- | --- |
| Contracts | required | Aggregated read model, independent cursors, section states, activity deduplication, permissions and context commands | Contract/typecheck tests |
| Schema | planned | No new entity; bounded indexes/read queries, permission-audit support and source references may be required | Query and migration review |
| RLS | required | Contact scope plus related Lead/Opportunity/Task/Note authorization | pgTAP and cross-tenant tests |
| Storage | none | No documents or attachments | No storage paths |
| Secrets/providers | none | No external provider | No browser secrets |
| AI | none | No scoring or inference | Explicit exclusion |
| Billing/entitlements | planned | Existing CRM gates | Permission evidence |
| Observability | required | Projection reads, denied data, sensitive reads, freshness, deduplication and context mutations | Redacted audit evidence |
| Rollout/rollback | required | Additive indexes/read models and reversible query changes | Staging rollback evidence |

## Data sensitivity

Customer 360 aggregates confidential Contact and commercial data. Unauthorized Notes and sensitive
Contact fields must be omitted. Logs and analytics exclude PII and Note bodies.

## Dependencies

- Contact, Lead, Pipeline and Tasks contracts/RLS.
- ActivitySource and ActivityItem contracts.
- Customer 360 readiness review.
- Tenant/workspace membership and kill switches.

## Tests and environments

Required: aggregation and deduplication unit tests, RLS tests, permission tests, query bounds,
context mutation tests, E2E for record/split/overview, accessibility/responsive checks and staging evidence.

## No-go conditions

- Customer 360 creates a duplicate entity or mutates source ownership.
- Related records cross tenant/workspace scope.
- Activity appears twice through indirect relations.
- Unauthorized Notes or Contact fields are visible.
- Aggregate queries are unbounded or bypass RLS.
- Context mutations do not emit their source activity event.
- Sections share one cursor or block independently paginated loading.
- Cache keys omit tenant, workspace, contact or permission scope.
- N+1 queries appear in Customer 360 aggregation.
- Stale or partial sections are presented as fully fresh data.
