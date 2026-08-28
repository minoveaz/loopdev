---
title: Brand Hub Contract
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/142
---

# Brand Hub Contract

## Purpose and scope

This proposed contract defines the minimum boundary for managing brand identity and published brand
versions. It is not a schema, API implementation or authorization grant.

Every read and mutation resolves `organizationId` and the actor server-side. Workspace visibility is
an explicit policy input, not an assumption that every brand belongs to one workspace. A consumer
can read only the current published version it is authorized to use.

## Read models

```ts
type BrandStatus = 'draft' | 'active' | 'archived';
type BrandVersionStatus = 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'published' | 'superseded' | 'archived';

type Brand = {
  id: string;
  organizationId: string;
  workspaceIds: string[];
  name: string;
  status: BrandStatus;
  currentPublishedVersionId: string | null;
  createdAt: string;
  updatedAt: string;
};

type BrandVersion = {
  id: string;
  brandId: string;
  organizationId: string;
  versionNumber: number;
  status: BrandVersionStatus;
  identity: { description: string | null; market: string | null };
  guidance: { voice: string[]; prohibitedTerms: string[]; claims: string[] };
  assetReferences: Array<{ assetId: string; role: 'logo' | 'reference' }>;
  effectiveAt: string | null;
  expiresAt: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};
```

Visual tokens, typography, locales and governance fields remain extensible version content; their
validation rules must be approved before the first persistence contract. Asset IDs are opaque Asset
Library references and cannot cross organization boundaries.

## Commands and queries

| Operation | Input | Result |
| --- | --- | --- |
| `listBrands` | authorized scope, filters, cursor, limit, order | Paginated brands visible to the actor. |
| `getBrand` | brand ID and authorized scope | Brand with published-version summary. |
| `getBrandVersion` | brand ID, version ID and authorized scope | Authorized version detail. |
| `createBrand` | name, optional workspace visibility, idempotency key | New brand and initial draft version. |
| `createBrandDraft` | brand ID, source version ID, idempotency key | New immutable draft derived from a known version. |
| `updateBrandDraft` | brand ID, version ID, patch, expected version | Updated draft or conflict. |
| `requestBrandReview` | brand ID, version ID, expected version | Version in review and audit event. |
| `decideBrandReview` | version ID, approve/reject/request-changes decision, reason, expected version | Authorized decision and audit event. |
| `publishBrandVersion` | brand ID, version ID, expected version, idempotency key | Published version and superseded predecessor. |
| `getPublishedBrandContext` | brand ID and consumer scope | Stable published context for authorized consumers. |

## Lifecycle and concurrency rules

- Only an `approved` version can transition to `published`.
- Publishing is transactional: at most one published version exists for a brand at a time.
- Publishing supersedes the preceding published version without deleting history.
- Editing is permitted only for `draft` or `changes_requested`; an approved version requires a new
  draft to change its content.
- Every command validates the expected version and returns a conflict rather than silently
  overwriting another actor's work.
- `createBrand`, `createBrandDraft` and `publishBrandVersion` require idempotency keys scoped to
  organization, actor and command intent.
- No command reveals cross-organization or unauthorized workspace/brand references.

## Permissions and errors

Proposed action permissions are `marketing.brand.read`, `marketing.brand.manage`,
`marketing.brand.review` and `marketing.brand.publish`. Platform Core resolves membership and base
authorization server-side; final policy mapping is pending approval.

```ts
type BrandHubErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'INVALID_STATUS_TRANSITION'
  | 'ASSET_REFERENCE_FORBIDDEN'
  | 'PUBLISHED_VERSION_REQUIRED';
```

Responses use a typed success/error envelope. Cursor pagination, filters and order fields must be
allowlisted; compatibility additions are additive until an approved deprecation policy exists.
