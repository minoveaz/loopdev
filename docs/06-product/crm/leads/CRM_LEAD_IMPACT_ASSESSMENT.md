---
title: CRM Lead Impact Assessment
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/84
---

# Impact Assessment de CRM Lead

## Scope

`CRM-02` entregara lista, captura, detalle, edicion, estados y creacion de oportunidad desde Lead.
Preparara atribucion manual, campana, WhatsApp simulado, referral, social y partner sin activar proveedores reales.

## Impact matrix

| Surface | Impact | Required work | Exit evidence |
| --- | --- | --- | --- |
| Contracts | required | Lead schemas, source/attribution, status transitions, conversion and errors | Contract build/typecheck and consumer compatibility |
| Schema | required | Additive lead fields, contact relation, source identifiers, status and indexes | Migration replay and generated types |
| RLS | required | Tenant scope, role actions and privileged-path restrictions | Two-tenant role matrix |
| Storage | none | No files/documents in Leads | Explicit exclusion |
| Secrets/providers | planned | No real provider; reserve adapter/account references for H2; active referral/social/partner values | No browser secrets; fixture/manual source capture only |
| AI | none | No scoring or recommendation | AI surfaces hidden |
| Billing/entitlements | planned | CRM entitlement check only | Server-side access check |
| Observability | required | State transition, capture, conversion and idempotency audit/logs | Traceable mutation evidence without PII |
| Rollout/rollback | required | Additive schema, idempotent capture and application rollback | Staging and rollback evidence |
| Frontend | required | Lead data table, capture form, split detail, attribution and states | Component/route/E2E evidence |
| Test data | required | Manual, campaign, WhatsApp simulated, referral, social and partner sources; repeated external IDs | Deterministic fixture and idempotency evidence |

## Dependencies

```text
Contacts contract and CRM-01
  -> Lead contract
  -> source/idempotency schema
  -> RLS and role transitions
  -> Lead UX and components
  -> readiness review before tests
```

Leads does not implement real Marketing or WhatsApp integrations in this slice.

## No-go conditions

- Lead without an authorized Contact relation.
- Duplicate external event creates a second lead.
- Cross-tenant source or contact reference is accepted.
- Status transition bypasses authorization or audit.
- Conversion creates a duplicate Contact or loses Lead attribution.
- Qualified conversion creates duplicate Opportunities for the same Lead and normalized product key.
- Manual Pipeline Opportunities are incorrectly treated as the Lead conversion Opportunity.
- The Lead is not moved to `convertido` after the first successful conversion, or is moved by a manual Pipeline Opportunity.
- A visible stage rename changes the stable stage ID or historical records.
