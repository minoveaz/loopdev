Automation can create communications, cost and compliance impact. Dependencies are Workflow,
Communications, consent enforcement, Integration Hub where applicable and Platform audit. Require
deterministic workflow fixtures and a tenant-gated environment. Rollback pauses definitions and
disables activation while preserving run/audit evidence; recovery and cancellation require an
approved incident runbook.
---
title: Marketing Automation Impact Assessment
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/151
---

# Marketing Automation Impact Assessment

```text
Contracts: required
Schema: planned
RLS: required
Storage: none
Secrets/providers: required
AI: planned
Billing/entitlements: planned
Observability: required
Rollout/rollback: required
```

No-go: no Workflow and Communications contracts, consent policy, rate/cost limits, idempotent worker
design, RLS proof, audit trail, recovery, kill switch or incident runbook. Validate tenant isolation,
duplicate prevention, pause/retry/recovery and irreversible-action safeguards before release.
