---
title: Marketing Insights Component Audit
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/marketing-insights/MARKETING_INSIGHTS_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/150
---

# Marketing Insights Component Audit

Reuse Shell, `@loopdev/ui` tables, filters, metric states and charts only after their availability
audit. Implement `InsightsOverview`, `CampaignMetricTable` and `AttributionEvidencePanel` as module
widgets, and query/filter features over Analytics-owned data. No analytics pipeline, CRM mutation or
visualization primitive is added to Canvas or shared UI without a second consumer.

```text
App Router -> SuiteRuntime -> SuiteCanvas -> insight widgets -> query features
	-> MarketingEvent and AttributionRecord read entities -> Analytics contracts
```

Analytics ingestion, aggregation, CRM joins and authorization remain outside UI and Canvas. Shared
chart promotion requires a second consumer plus visual/accessibility certification.
