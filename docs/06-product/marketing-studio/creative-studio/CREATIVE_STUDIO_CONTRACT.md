---
title: Creative Studio Contract
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/144
---

# Creative Studio Contract

## Read models

```ts
type CreativeVertical = 'image' | 'video';
type CreativeProjectStatus = 'draft' | 'in_review' | 'approved' | 'archived';

type CreativeProject = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  brandId: string | null;
  vertical: CreativeVertical;
  name: string;
  status: CreativeProjectStatus;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
};

type CreativeVersion = {
  id: string;
  projectId: string;
  organizationId: string;
  versionNumber: number;
  editorDocumentReference: string;
  assetReferences: string[];
  createdByUserId: string;
  createdAt: string;
};

type CreativeVariant = {
  id: string;
  projectVersionId: string;
  organizationId: string;
  format: string;
  channel: string | null;
  status: 'draft' | 'ready' | 'archived';
  createdAt: string;
};
```

`editorDocumentReference` is a vertical-owned authorized document reference, not inline base64,
provider data or an Asset Library binary. Brand context must refer to an authorized published version.

## Commands and queries

| Operation | Input | Result |
| --- | --- | --- |
| `listCreativeProjects` | scope, filters, cursor, limit, order | Authorized project page. |
| `getCreativeProject` | project ID and scope | Project with authorized version/variant summary. |
| `createCreativeProject` | vertical, brand reference, name, idempotency key | New project and initial draft. |
| `createCreativeVersion` | project ID, editor document reference, asset references, idempotency key | Append-only project version. |
| `createCreativeVariant` | project version ID, format/channel, idempotency key | Variant linked to its version. |
| `archiveCreativeProject` | project ID, reason, expected version | Archived project without deleting history. |
| `getVerticalWorkspaceContext` | project ID, vertical and scope | Authorized project, published brand and asset-reference context. |

## Rules, permissions and errors

- Project, version, variant, brand and asset references must share an authorized organization scope.
- Versions are append-only. A conflict returns instead of silently replacing another editor state.
- The vertical owns validation of its editor document; Creative Studio validates only reference,
  scope, status and lifecycle boundaries.
- New projects and versions require idempotency keys scoped to organization, actor and command intent.
- Proposed permissions are `marketing.creative.read`, `marketing.creative.manage` and
  `marketing.creative.review`; Platform Core resolves them server-side.

```ts
type CreativeStudioErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'VERTICAL_NOT_AVAILABLE'
  | 'PUBLISHED_BRAND_CONTEXT_REQUIRED'
  | 'ASSET_REFERENCE_FORBIDDEN';
```
