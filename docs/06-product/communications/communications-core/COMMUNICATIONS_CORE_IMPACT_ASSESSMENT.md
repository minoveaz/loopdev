---
title: Communications Core Impact Assessment
status: approved
version: 0.1
created: 2026-08-29
updated: 2026-08-29
owner: crm
program_track: tracks/planned/crm/2026-08-29-communications-core-crm-inbox-definition.md
issue: https://github.com/minoveaz/loopdev/issues/157
approver: User
approved_at: 2026-08-29
---

# Communications Core Impact Assessment

## Classification

```text
Contracts: required
Schema: required
RLS: required
Storage: planned
Secrets/providers: required
AI: none
Billing/entitlements: planned
Observability: required
Rollout/rollback: required
```

Existing contracts, migrations, RLS and the WhatsApp webhook are baseline evidence. They require review and alignment before any new capability is considered ready.

## Dependencies and security

- Platform Core supplies authenticated membership, permissions, audit foundation and organization scope.
- CRM supplies canonical contacts, E.164 deduplication and consent evidence by purpose through a public application command; Communications does not write CRM tables directly.
- Meta Cloud API requires Embedded Signup, verified WABA and Phone Number ID, per-organization account mapping, server-side secret references, signed webhook verification and rate/error handling. Manual configuration is restricted and audited.
- Storage is deferred until attachments and media have private paths, MIME/size validation, scanning, retention and signed access rules.
- A durable worker and queue are required before webhook persistence beyond the synchronous verification boundary, delivery handling, automated retries or purges; no browser or Edge Function loop may perform unbounded retries. Its limited service role must be least-privilege, server-only, organization-scoped and audited. The server-side kill switch must pause dispatch and retry by organization/account while preserving read and evidence paths.

## Required evidence and no-go

No implementation or provider rollout starts before: the approved permission matrix; consent policy by purpose; pending-identity handling for unknown contacts; reviewed public contract; RLS read/write isolation tests for two organizations; Embedded Signup and reconnect tests; signature and duplicate webhook tests; outbound and template policy tests; template synchronization/state tests; redacted logs and trace correlation; provider health monitoring; a documented 24-month message/note and 36-month evidence retention implementation; purge dry-run evidence; additive tenant-gated rollout; and a tested kill switch that disables outbound dispatch and retries while preserving audit and delivery history.

No-go conditions include client-accessible credentials, unverified webhook signatures, provider payload logging, direct cross-module table writes, a missing organization boundary, a worker role broader than its documented operations, automated retries without a bounded worker, or sending outside WhatsApp policy.