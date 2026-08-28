---
title: Asset Library Contract
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/143
---

# Asset Library Contract

## Scope

This proposed contract owns asset metadata, versions, usage references, rights and lifecycle. It does
not define a bucket schema, upload implementation or public media API. Platform Core resolves actor,
organization and authorization server-side; all related IDs must remain in the authorized scope.

## Read models

```ts
type AssetStatus = 'draft' | 'processing' | 'in_review' | 'approved' | 'rejected' | 'archived';
type AssetKind = 'image' | 'video' | 'audio' | 'document' | 'font' | 'other';

type Asset = {
  id: string;
  organizationId: string;
  workspaceIds: string[];
  brandIds: string[];
  kind: AssetKind;
  name: string;
  status: AssetStatus;
  currentVersionId: string;
  rights: { usage: 'unknown' | 'restricted' | 'approved'; expiresAt: string | null };
  createdAt: string;
  updatedAt: string;
};

type AssetVersion = {
  id: string;
  assetId: string;
  organizationId: string;
  versionNumber: number;
  storageReference: string;
  checksum: string;
  mimeType: string;
  byteSize: number;
  status: AssetStatus;
  derivedFromVersionId: string | null;
  createdAt: string;
};

type AssetUsage = {
  assetId: string;
  assetVersionId: string;
  consumerType: 'brand_version' | 'creative_project' | 'content_version' | 'render_artifact';
  consumerId: string;
  organizationId: string;
  createdAt: string;
};
```

`storageReference` is opaque and private. It never represents a public URL, `data:` URL or binary
payload in a contract response.

## Commands and queries

| Operation | Input | Result |
| --- | --- | --- |
| `listAssets` | authorized scope, filters, cursor, limit, order | Paginated authorized assets. |
| `getAsset` | asset ID and authorized scope | Asset, versions and authorized usage summary. |
| `prepareAssetIngest` | metadata intent, expected type/size, idempotency key | Authorized ingest session/reference; no object becomes active yet. |
| `finalizeAssetIngest` | ingest reference, checksum, metadata, idempotency key | Draft/processing asset version. |
| `updateAssetMetadata` | asset ID, patch, expected version | Updated metadata or conflict. |
| `submitAssetReview` | asset/version ID, expected version | Version in review and audit event. |
| `decideAssetReview` | version ID, decision, reason, expected version | Approved/rejected version and audit event. |
| `createAssetUsage` | asset/version ID, authorized consumer reference, idempotency key | Usage reference. |
| `archiveAsset` | asset ID, reason, expected version | Archived asset without deleting referenced history. |
| `restoreAsset` | asset ID, expected version | Restored asset when policy permits. |

## Lifecycle rules

- Only approved, unexpired versions are eligible for new authorized usage.
- A checksum deduplicates only inside the organization and compatible rights/visibility policy; it
  must never leak another tenant's asset or metadata.
- Archive blocks new usage but retains authorized historical references and audit evidence.
- Object cleanup is asynchronous, idempotent and allowed only when no retained version or usage
  requires the object.
- Mutations use expected versions; ingest, finalize and usage commands require scoped idempotency.
- Cursor, order and filters are allowlisted. Cross-tenant IDs return no unauthorized data.

## Permissions and errors

Proposed permissions are `marketing.asset.read`, `marketing.asset.manage`,
`marketing.asset.review` and `marketing.asset.archive`. Final mapping is pending Platform Core review.

```ts
type AssetLibraryErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'INVALID_STATUS_TRANSITION'
  | 'ASSET_EXPIRED'
  | 'ASSET_RIGHTS_RESTRICTED'
  | 'ASSET_IN_USE'
  | 'STORAGE_REFERENCE_INVALID';
```
