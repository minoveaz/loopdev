---
title: Content Engine Contract
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/147
---

# Content Engine Contract

## Scope

Content Engine owns editorial item/version and review lifecycle. Brand Hub supplies published context,
Asset Library supplies authorized asset references and Campaign Orchestrator links approved content by
reference. Platform Core resolves actor, organization and authorization server-side.

## Read models and operations

```ts
type ContentStatus = 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'archived';

type ContentItem = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  brandId: string | null;
  name: string;
  status: ContentStatus;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
};

type ContentVersion = {
  id: string;
  contentId: string;
  organizationId: string;
  versionNumber: number;
  body: { format: 'plain_text' | 'rich_text'; value: string };
  assetReferences: string[];
  brandVersionId: string;
  status: ContentStatus;
  createdByUserId: string;
  createdAt: string;
};
```

| Operation | Input | Result |
| --- | --- | --- |
| `listContentItems` | scope, filters, cursor, limit, order | Paginated authorized content items. |
| `getContentItem` | content ID and scope | Item, authorized versions and review summary. |
| `createContentItem` | name, published brand version, idempotency key | New item and initial draft version. |
| `createContentDraft` | item ID, source version ID, idempotency key | Append-only draft derived from a version. |
| `updateContentDraft` | item/version ID, body/metadata patch, expected version | Updated draft or conflict. |
| `requestContentReview` | item/version ID, expected version | Version in review and audit event. |
| `decideContentReview` | version ID, decision/reason, expected version | Authorized decision and audit event. |
| `getApprovedContentReference` | content/version ID and consumer scope | Immutable approved content reference. |
| `archiveContentItem` | item ID, reason, expected version | Archived item without deleting versions/audit. |

## Rules, permissions and errors

- Only approved, unexpired Asset Library references may be newly attached to a version.
- Brand context must be a published Brand Hub version in the same authorized organization.
- Approval is version-specific; edits after approval require a new draft and invalidate no historical evidence.
- Commands validate expected version. Creation and review transitions use scoped idempotency keys.
- `scheduled` and `published` are excluded until a future external publishing contract exists.
- Proposed permissions are `marketing.content.read`, `marketing.content.manage` and
  `marketing.content.review`; Platform Core resolves them server-side.

```ts
type ContentEngineErrorCode =
  | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT' | 'INVALID_STATUS_TRANSITION' | 'PUBLISHED_BRAND_CONTEXT_REQUIRED'
  | 'ASSET_REFERENCE_FORBIDDEN' | 'APPROVED_VERSION_REQUIRED';
```
