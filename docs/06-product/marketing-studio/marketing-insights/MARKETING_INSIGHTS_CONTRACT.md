---
title: Marketing Insights Contract
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/150
---

# Marketing Insights Contract

`MarketingEvent` and `AttributionRecord` are Analytics-owned event/read-model contracts with
Campaign/Content references. Operations: `listMarketingMetrics`, `getCampaignInsights` and
`getAttributionEvidence`, all scoped server-side by organization and authorized dimensions.
Events are immutable, idempotent and timestamped; metric definitions/freshness are explicit.
Errors: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `METRIC_NOT_AVAILABLE`, `STALE_DATA` and
`CRM_REFERENCE_FORBIDDEN`. No cross-tenant event, personal data or CRM mutation is exposed.

## Models, queries and compatibility

```ts
type InsightsErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'METRIC_NOT_AVAILABLE' | 'STALE_DATA' | 'CRM_REFERENCE_FORBIDDEN';
type MarketingMetric = { key: string; value: number; unit: 'count' | 'ratio' | 'currency'; measuredAt: string; freshness: 'fresh' | 'stale' };
type AttributionRecord = { id: string; organizationId: string; campaignId: string | null; eventId: string; model: string; evidenceReference: string; measuredAt: string };
type MetricQuery = { from: string; to: string; metric: string; campaignId?: string; brandId?: string; workspaceId?: string; cursor?: string; limit?: number; order?: 'asc' | 'desc' };
type Page<T> = { items: T[]; nextCursor: string | null };
type Result<T> = { ok: true; data: T } | { ok: false; error: { code: InsightsErrorCode; message: string } };
```

`listMarketingMetrics` returns a cursor page; `getCampaignInsights` returns an authorized summary;
`getAttributionEvidence` returns redacted evidence where Analytics/CRM policy allows. Dimensions are
allowlisted and organization-scoped server-side. Proposed permission: `marketing.insights.read`.
