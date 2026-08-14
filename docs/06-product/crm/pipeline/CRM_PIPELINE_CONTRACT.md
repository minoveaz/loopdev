---
title: CRM Pipeline and Opportunities Domain Contract
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/85
---

# Contrato de Pipeline y Opportunities

## Read models

```ts
type OpportunityOrigin = 'manual' | 'lead_conversion';
type StageTerminalType = 'open' | 'won' | 'lost';
type StageChangeOrigin = 'board' | 'record' | 'system' | 'conversion' | 'reopen';
type ActivityType = 'note' | 'task' | 'stage_change' | 'assignment' | 'conversion' | 'reopen';

type PipelineStage = {
  id: string;
  tenantId: string;
  workspaceId: string;
  name: string;
  stageOrder: number;
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
  lastActivity: {
    at: string;
    type: ActivityType;
    actorId: string | null;
    actorName: string | null;
  } | null;
  activityHealth: 'fresh' | 'stale' | 'overdue' | 'unknown';
  version: number;
  createdAt: string;
  updatedAt: string;
};

type OpportunityCardViewModel = {
  id: string;
  name: string;
  contact: { id: string; displayName: string };
  productLabel: string;
  origin: OpportunityOrigin;
  stageId: string;
  amountLabel: string | null;
  assignedUserName: string | null;
  expectedCloseDate: string | null;
  lastActivity: Opportunity['lastActivity'];
  activityHealth: Opportunity['activityHealth'];
  indicators: Array<{
    id: string;
    label: string;
    tone: 'neutral' | 'warning' | 'critical' | 'success';
  }>;
  permissions: {
    canOpen: boolean;
    canMove: boolean;
    canEdit: boolean;
    canAssign: boolean;
  };
};

type PipelineBoardColumn = {
  stage: PipelineStage;
  items: OpportunityCardViewModel[];
  nextCursor: string | null;
  totalCount: number;
  totalAmount: number | null;
};
```

## Commands and queries

| Operation | Input | Result |
| --- | --- | --- |
| `listOpportunities` | scope, filters, cursor, limit, sort | Paginated authorized Opportunities |
| `getOpportunity` | opportunityId, scope | Opportunity with Contact, Lead and stage summaries |
| `listPipelineBoard` | scope, filters | Paginated `PipelineBoardColumn` read model |
| `createManualOpportunity` | Contact, product, fields, idempotency key | Opportunity with `origin=manual` |
| `moveOpportunityStage` | opportunityId, stageId, expectedVersion, reason | Updated Opportunity and audit event |
| `reopenOpportunity` | opportunityId, targetStageId, expectedVersion, reason | Reopened Opportunity and audit event |
| `updateOpportunity` | opportunityId, patch, expectedVersion | Updated Opportunity or conflict |
| `configurePipelineStage` | stageId or create input, admin scope | Updated stage configuration |
| `createOpportunityFromLead` | leadId, productKey, fields, idempotency key | Idempotent conversion Opportunity |

## Rules

- Every query and command is tenant/workspace scoped and authorized server-side.
- Contact is mandatory. Lead is optional for manual Opportunities and required for `lead_conversion`.
- `productKey` is mandatory, normalized and stable; it is not only a display label.
- Lead conversion preserves `contactId`, `leadId`, product and attribution; Contact cannot change in conversion.
- Stage IDs are immutable compatibility keys; names and order are mutable by admin.
- Conversion uniqueness is `(tenantId, leadId, productKey, origin=lead_conversion)`.
- The first successful conversion changes Lead `cualificado` to `convertido`; later product keys remain allowed.
- Manual Pipeline creation does not change Lead status by itself.
- Manual creation idempotency identifies one creation operation. Reusing a key with a different
  payload returns `IDEMPOTENCY_CONFLICT`; distinct keys may create legitimate manual Opportunities.
- `lead_conversion` always starts at stable stage ID `qualified`; manual creation starts at the
  workspace's configured active open default stage and fails with `INVALID_STAGE` if none exists.
- Critical commands are transactional, idempotent and protected by database constraints.
- Stage moves require authorized transition, optimistic version and audit event.
- Normal stage movement records `StageChangeOrigin`; reopening `won` or `lost` requires the explicit
  `reopenOpportunity` command, elevated permission and a non-empty reason.
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
  | 'INVALID_STAGE_CONFIGURATION'
  | 'REOPEN_FORBIDDEN'
  | 'REOPEN_REASON_REQUIRED'
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
