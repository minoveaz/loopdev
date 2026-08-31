---
title: Campaign Orchestrator Contract
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/148
---

# Campaign Orchestrator Contract

## Read models and operations

```ts
type CampaignStatus = 'draft' | 'planned' | 'active' | 'completed' | 'archived';
type CampaignItemStatus = 'draft' | 'planned' | 'delivery_pending' | 'delivered' | 'failed' | 'archived';

type Campaign = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  brandId: string | null;
  name: string;
  objective: string;
  status: CampaignStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CampaignItem = {
  id: string;
  campaignId: string;
  organizationId: string;
  contentVersionId: string;
  plannedAt: string | null;
  status: CampaignItemStatus;
  deliveryReference: string | null;
  createdAt: string;
  updatedAt: string;
};
```

| Operation | Input | Result |
| --- | --- | --- |
| `listCampaigns` | scope, filters, cursor, limit, order | Paginated authorized campaigns. |
| `getCampaign` | campaign ID and scope | Campaign with items and authorized external evidence. |
| `createCampaign` | objective, name, optional dates/context, idempotency key | Draft campaign. |
| `updateCampaign` | campaign ID, patch, expected version | Updated campaign or conflict. |
| `createCampaignItem` | campaign ID, approved content version ID, date, idempotency key | Planned campaign item. |
| `updateCampaignItemPlan` | item ID, date, expected version | Updated internal planning state. |
| `archiveCampaign` | campaign ID, reason, expected version | Archived campaign preserving audit history. |
| `getCampaignDeliveryEvidence` | campaign/item ID and scope | Read-only provider-owned evidence when available. |

## Rules, permissions and errors

- A CampaignItem references an approved immutable Content Engine version in the same authorized organization.
- Planning is not publishing. `delivery_pending`, `delivered` and `failed` may be written only by an
  approved Publishing & Integrations contract with idempotent external evidence.
- CRM references are read-only, server-authorized and never alter CRM ownership/lifecycle.
- Commands enforce expected version. Creation requires idempotency scoped to organization, actor and intent.
- Proposed permissions are `marketing.campaign.read`, `marketing.campaign.manage` and
  `marketing.campaign.review`; Platform Core resolves them server-side.

```ts
type CampaignOrchestratorErrorCode =
  | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT' | 'APPROVED_CONTENT_REQUIRED' | 'DELIVERY_STATE_OWNED_EXTERNALLY'
  | 'CRM_REFERENCE_FORBIDDEN';
```
