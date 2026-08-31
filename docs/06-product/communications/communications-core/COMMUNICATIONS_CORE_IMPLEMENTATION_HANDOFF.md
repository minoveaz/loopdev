---
title: Communications Core Implementation Handoff
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

# Communications Core Implementation Handoff

## Read first

1. [Transversal definition](../COMMUNICATIONS_CORE_DEFINITION.md)
2. [UX specification](COMMUNICATIONS_CORE_UX_SPEC.md)
3. [Component audit](COMMUNICATIONS_CORE_COMPONENT_AUDIT.md)
4. [Contract](COMMUNICATIONS_CORE_CONTRACT.md)
5. [Impact assessment](COMMUNICATIONS_CORE_IMPACT_ASSESSMENT.md)

## Delivery instruction

Repository: `minoveaz/loopdev`. Parent Issue: [#156](https://github.com/minoveaz/loopdev/issues/156). Delivery Issue: [#157](https://github.com/minoveaz/loopdev/issues/157). After the package is approved and readiness is confirmed in the delivery Issue, create `feature/communications-core-implementation` from updated `develop`. Use `feat(communications): implement <slice> (#157)` and a PR with `Closes #157`.

The GitHub Project item must record its Issue, track, gate, priority, lane, dependencies and evidence. It stays `Ready` until the first implementation commit.

## Outcome and Definition of Ready

Implement server-side provider boundaries and public Communications operations without expanding the first channel beyond WhatsApp Cloud. Preserve organization isolation, idempotency, delivery history and audit. Implement retention of messages/notes for 24 months and delivery/audit evidence for 36 months, with traceable server-side purge and no manual deletion UI. Implement a server-side kill switch by organization/account that pauses outbound and retries but preserves authorized reads and evidence. CRM Inbox consumes public application APIs; it does not import Core repositories or mutate Core tables.

Before code, approve all five documents; review existing migration and webhook evidence; select the design-partner organization; and define focused contract, RLS, webhook, worker, retention, kill-switch and phase-rollout validation. Do not implement other channels, attachments, automation, campaigns or an independent suite.