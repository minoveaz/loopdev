---
title: Campaign Orchestrator Impact Assessment
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/148
---

# Campaign Orchestrator Impact Assessment

## Classification

```text
Contracts: planned
Schema: planned
RLS: planned
Storage: none
Secrets/providers: none
AI: none
Billing/entitlements: planned
Observability: planned
Rollout/rollback: planned
```

Campaign Orchestrator depends on Content Engine approval, Brand Hub context and Platform Core tenant
scope. Publishing, CRM attribution and automation are downstream owned contracts, not dependencies it
may implement implicitly.

VitaBlue is evidence of active exploratory campaign planning, readiness, asset/copy preview and
publication preparation. Its `marketing_campaign_publications` persistence must not be migrated or
reused as-is: its role-based RLS lacks the organization/workspace/brand constraints required by
LoopDev, and its browser persistence/download patterns are not authoritative.

Required evidence: contract/repository tests for approved-content-only references, idempotency,
concurrency and tenant denial; RLS design; audit for planning changes; accessibility for calendar/board;
observability for conflicts and external delivery evidence; tenant-gated rollout and rollback that
disables writes while preserving planning/audit records.

No implementation begins before Content Engine contract, permission mapping, calendar semantics,
external delivery boundary, CRM reference policy, entitlement policy and rollback are approved.
