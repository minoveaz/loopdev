---
title: CRM Pipeline and Opportunities Domain Contract
status: proposed
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/96
---

# Contrato de Pipeline y Opportunities

## Read models

```ts
type OpportunityOrigin = 'manual' | 'lead_conversion';
type StageTerminalType = 'open' | 'won' | 'lost';

type PipelineStage = {
  id: string;
  tenantId: string;
  workspaceId: string;
  name: string;
  order: number;
  active: boolean;
  terminalType: StageTerminalType;
};

type Opportunity = {
  id: string;
  tenantId: string;
  workspaceId: string;
  brandId: string | null;
  contactId: string;
  leadId: string | null;
  productKey: string;
  origin: OpportunityOrigin;
  name: string;
  stageId: string;
  amount: number | null;
  currency: string | null;
  probability: number | null;
  expectedCloseDate: string | null;
  assignedUserId: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};
```

## Commands and queries

| Operation | Input | Result |
| --- | --- | --- |
| `listOpportunities` | scope, filters, cursor, limit, sort | Paginated authorized Opportunities |
| `getOpportunity` | opportunityId, scope | Opportunity with Contact, Lead and stage summaries |
| `listPipelineBoard` | scope, filters | Stage columns with paginated cards |
| `createManualOpportunity` | Contact, product, fields, idempotency key | Opportunity with `origin=manual` |
| `moveOpportunityStage` | opportunityId, stageId, expectedVersion, reason | Updated Opportunity and audit event |
| `updateOpportunity` | opportunityId, patch, expectedVersion | Updated Opportunity or conflict |
| `configurePipelineStage` | stageId or create input, admin scope | Updated stage configuration |
| `createOpportunityFromLead` | leadId, productKey, fields, idempotency key | Idempotent conversion Opportunity |

## Rules

- Every query and command is tenant/workspace scoped and authorized server-side.
- Contact is mandatory. Lead is optional for manual Opportunities and required for `lead_conversion`.
- Lead conversion preserves `contactId`, `leadId`, product and attribution; Contact cannot change in conversion.
- Stage IDs are immutable compatibility keys; names and order are mutable by admin.
- Conversion uniqueness is `(tenantId, leadId, productKey, origin=lead_conversion)`.
- The first successful conversion changes Lead `cualificado` to `convertido`; later product keys remain allowed.
- Manual Pipeline creation does not change Lead status by itself.
- Critical commands are transactional, idempotent and protected by database constraints.
- Stage moves require authorized transition, optimistic version and audit event.
- No cross-tenant Contact, Lead, stage or Opportunity references are returned.

## Errors and envelope

```ts
type OpportunityErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'CONTACT_REQUIRED'
  | 'LEAD_REQUIRED'
  | 'INVALID_STAGE'
  | 'STAGE_TRANSITION_FORBIDDEN'
  | 'CROSS_TENANT_REFERENCE';

type CommandEnvelope<T> = {
  data: T | null;
  error: { code: OpportunityErrorCode; message: string } | null;
  requestId: string;
};
```

No secrets, provider payloads or PII are returned in ordinary error messages.

## Compatibility

Stable stage IDs, `origin`, `productKey`, `contactId` and `leadId` are public contract fields. Visible
stage names and order are presentation/configuration and may change without historical migration.
