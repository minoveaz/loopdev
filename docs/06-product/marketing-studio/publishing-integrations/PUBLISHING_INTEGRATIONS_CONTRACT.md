---
title: Publishing and Integrations Contract
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/149
---

# Publishing and Integrations Contract

Proposed entities are `ChannelConnection` and `Publication`. A publication references one approved
immutable Content Engine version and authorized channel connection in the same organization.

Operations: `listConnections`, `getPublication`, `requestPublication`, `retryPublication` and
`getDeliveryEvidence`. Requests require idempotency; provider callbacks are verified server-side;
retries/recovery use durable jobs. Proposed errors: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`,
`APPROVED_CONTENT_REQUIRED`, `CONNECTION_UNAVAILABLE`, `IDEMPOTENCY_CONFLICT` and `DELIVERY_FAILED`.
Marketing never returns provider secrets, tokens or unverified webhook data to the browser.

## Models, scope and envelopes

```ts
type PublishingErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'CONNECTION_UNAVAILABLE' | 'APPROVED_CONTENT_REQUIRED' | 'IDEMPOTENCY_CONFLICT' | 'DELIVERY_FAILED';
type ChannelConnection = { id: string; organizationId: string; provider: string; status: 'active' | 'disabled'; createdAt: string };
type Publication = { id: string; organizationId: string; contentVersionId: string; connectionId: string; campaignItemId: string | null; status: 'requested' | 'queued' | 'scheduled' | 'delivered' | 'failed' | 'cancelled'; externalReference: string | null; createdAt: string; updatedAt: string };
type RequestPublicationInput = { contentVersionId: string; connectionId: string; campaignItemId?: string; scheduledAt?: string; idempotencyKey: string };
type Page<T> = { items: T[]; nextCursor: string | null };
type Result<T> = { ok: true; data: T } | { ok: false; error: { code: PublishingErrorCode; message: string } };
```

List operations accept allowlisted filters, order, cursor and limit. Commands and callbacks resolve
organization scope server-side; callbacks verify provider identity and expected status transition.
Proposed permissions are `marketing.publish.read`, `marketing.publish.manage` and
`marketing.publish.retry`. Compatibility additions remain additive.
