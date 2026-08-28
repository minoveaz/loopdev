---
title: Image Studio Contract
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/145
---

# Image Studio Contract

## Scope

Image Studio owns the editor document, element-level validation, template application and export
intent for an image project. Creative Studio owns project/version/variant lifecycle; Asset Library
owns asset binaries and resulting artifact lifecycle; Brand Hub supplies published context.

## Read models and operations

```ts
type ImageDocument = {
  projectId: string;
  projectVersionId: string | null;
  organizationId: string;
  format: { width: number; height: number; unit: 'px' };
  elements: Array<{ id: string; kind: 'text' | 'shape' | 'image' | 'group'; assetId?: string }>;
  templateId: string | null;
  updatedAt: string;
};

type ImageExportIntent = {
  projectId: string;
  sourceVersionId: string;
  format: 'png' | 'jpeg' | 'webp';
  dimensions: { width: number; height: number };
  idempotencyKey: string;
};
```

| Operation | Input | Result |
| --- | --- | --- |
| `getImageWorkspace` | authorized Creative Studio project context | Image document, published brand context and authorized asset references. |
| `autosaveImageDraft` | document patch, expected draft revision | Saved draft reference or conflict. |
| `validateImageDocument` | document and selected export intent | Allowlisted validation result; no provider call. |
| `saveImageVersion` | validated document reference, asset references, idempotency key | Append-only Creative Studio version. |
| `requestImageExport` | validated export intent | Authorized asynchronous artifact request. |
| `getImageExportStatus` | export request ID and scope | Processing, success or recoverable failure result. |

## Rules and errors

- All project, document, brand and asset references resolve to the same authorized organization.
- Image asset elements use opaque Asset Library IDs; document payloads contain no binary, public URL,
  base64 or `data:` URL source of truth.
- Autosave updates only an authorized draft; explicit save creates an append-only project version.
- Export is idempotent by project/version/format/dimensions/actor intent and creates an artifact
  reference only after authorized processing succeeds.
- Proposed permissions are `marketing.image.read`, `marketing.image.edit` and
  `marketing.image.export`; Platform Core resolves them server-side.

```ts
type ImageStudioErrorCode =
  | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT' | 'PROJECT_VERTICAL_MISMATCH' | 'ASSET_REFERENCE_FORBIDDEN'
  | 'PUBLISHED_BRAND_CONTEXT_REQUIRED' | 'EXPORT_NOT_AVAILABLE';
```
