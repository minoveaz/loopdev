---
title: Video Studio Contract
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/146
---

# Video Studio Contract

## Scope

Video Studio owns the video editor document, scene validation and render intent. Creative Studio owns
project/version/variant lifecycle; Asset Library owns source-media and resulting-artifact lifecycle;
Workflow/Platform Core owns durable job execution, retries and recovery. The render engine is an
implementation decision and must not be exposed as a client-side provider contract.

## Read models and operations

```ts
type VideoDocument = {
  projectId: string;
  projectVersionId: string | null;
  organizationId: string;
  frameRate: number;
  durationInFrames: number;
  scenes: Array<{ id: string; startFrame: number; durationInFrames: number; assetIds: string[] }>;
  templateId: string | null;
  updatedAt: string;
};

type VideoRenderIntent = {
  projectId: string;
  sourceVersionId: string;
  format: 'mp4' | 'webm';
  dimensions: { width: number; height: number };
  idempotencyKey: string;
};

type VideoRenderStatus = 'queued' | 'rendering' | 'succeeded' | 'failed' | 'cancelled';
```

| Operation | Input | Result |
| --- | --- | --- |
| `getVideoWorkspace` | authorized Creative Studio project context | Video document, published brand and authorized asset context. |
| `autosaveVideoDraft` | document patch, expected draft revision | Saved draft reference or conflict. |
| `validateVideoDocument` | document and render intent | Allowlisted scene/timing/asset validation result. |
| `saveVideoVersion` | validated document reference, asset references, idempotency key | Append-only Creative Studio version. |
| `requestVideoRender` | validated render intent | Durable job reference in `queued` state. |
| `getVideoRenderStatus` | render request ID and scope | Authorized status and artifact reference only on success. |
| `cancelVideoRender` | request ID and idempotency key | Cancel outcome if the job policy permits it. |

## Rules, permissions and errors

- Project, document, scenes, brand and asset references must remain in the same authorized organization.
- Scene references use opaque Asset Library IDs. Editor documents contain no binary, public URL,
  base64 or `data:` URL source of truth.
- Autosave updates only a permitted draft; explicit save creates an append-only project version.
- Render requests are idempotent by project/version/format/dimensions/actor intent. Only a successful
  job may create/link an Asset Library artifact; retry/cancel/recovery are durable job concerns.
- Proposed permissions are `marketing.video.read`, `marketing.video.edit`, `marketing.video.render`
  and `marketing.video.cancel`; Platform Core resolves them server-side.

```ts
type VideoStudioErrorCode =
  | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT' | 'PROJECT_VERTICAL_MISMATCH' | 'ASSET_REFERENCE_FORBIDDEN'
  | 'PUBLISHED_BRAND_CONTEXT_REQUIRED' | 'RENDER_NOT_AVAILABLE' | 'RENDER_NOT_CANCELLABLE';
```
