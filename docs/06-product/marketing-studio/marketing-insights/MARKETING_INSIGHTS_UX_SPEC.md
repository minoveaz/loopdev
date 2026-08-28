---
title: Marketing Insights UX Specification
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/150
---

# Marketing Insights UX Specification

This deferred module presents authorized marketing events, campaign measures and attributable CRM
evidence using `overview`, `data`, `record` and `split` Canvas recipes. It reads immutable semantic
events and never edits CRM revenue, contacts, leads or opportunities. States are `loading`, `empty`,
`error`, `forbidden`, stale-data and success; mobile prioritizes a compact metric list and detail.

Activation gate: Analytics event taxonomy, freshness, attribution definition, CRM reference policy,
privacy/retention and metric-owner approval.

## Views and journeys

Proposed routes are `/marketing-studio/insights` (`overview`),
`/marketing-studio/insights/campaigns` (`data`) and
`/marketing-studio/insights/campaigns/:campaignId` (`record`). Marketers and Analysts read metrics;
Viewers receive authorized summaries only. Required filters are time range and metric; campaign,
brand, workspace, channel and attribution model are optional when authorized. Negative journeys cover
stale/missing events, unavailable attribution, forbidden CRM evidence and empty ranges. Product,
Analytics owner and Tech Lead approve definitions, freshness and responsive visualization.
