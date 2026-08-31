---
title: CRM Communications Inbox Impact Assessment
status: approved
version: 0.1
created: 2026-08-29
updated: 2026-08-29
owner: crm
program_track: tracks/planned/crm/2026-08-29-communications-core-crm-inbox-definition.md
issue: https://github.com/minoveaz/loopdev/issues/158
approver: User
approved_at: 2026-08-29
---

# CRM Communications Inbox Impact Assessment

## Classification

```text
Contracts: required
Schema: planned
RLS: required
Storage: none
Secrets/providers: none
AI: none
Billing/entitlements: planned
Observability: required
Rollout/rollback: required
```

The Inbox requires no provider secret or direct provider call. It may require additive indexes, read projections or assignment history after the Core contract is approved. Attachments are explicitly excluded, so no Storage impact exists in this vertical.

## Required evidence and no-go

Required evidence: public Core and Inbox contract tests; two-organization and workspace isolation tests; permission tests for agent, manager and viewer; Meta onboarding and account-health states; webhook-to-inbox projection tests; free-text reply, template selection and 24-hour restriction tests; loading, empty, error, forbidden and mobile accessibility evidence; delivery-state observability; tenant-gated rollout for one designated partner organization; and rollback evidence that a Core kill switch disables Inbox reply/retry actions without losing authorized conversation history.

No-go: a parallel shell, client-side organization authorization, missing Core policy enforcement, showing a message body outside scope, send action without idempotency, unfinished account disconnect state, or UI that enables free-text WhatsApp replies after the Core reports the window expired.