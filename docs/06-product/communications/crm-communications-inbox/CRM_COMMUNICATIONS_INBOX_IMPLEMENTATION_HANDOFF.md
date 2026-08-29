---
title: CRM Communications Inbox Implementation Handoff
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

# CRM Communications Inbox Implementation Handoff

## Read first

1. [Transversal definition](../COMMUNICATIONS_CORE_DEFINITION.md)
2. [Inbox UX specification](CRM_COMMUNICATIONS_INBOX_UX_SPEC.md)
3. [Inbox component audit](CRM_COMMUNICATIONS_INBOX_COMPONENT_AUDIT.md)
4. [Inbox contract](CRM_COMMUNICATIONS_INBOX_CONTRACT.md)
5. [Inbox impact assessment](CRM_COMMUNICATIONS_INBOX_IMPACT_ASSESSMENT.md)
6. [Communications Core contract](../communications-core/COMMUNICATIONS_CORE_CONTRACT.md)

## Delivery instruction

Repository: `minoveaz/loopdev`. Parent Issue: [#156](https://github.com/minoveaz/loopdev/issues/156). Delivery Issue: [#158](https://github.com/minoveaz/loopdev/issues/158). After approval and Issue readiness confirmation, create `feature/crm-communications-inbox-implementation` from updated `develop`. Use `feat(crm): implement communications inbox <slice> (#158)` and a delivery PR with `Closes #158`.

The GitHub Project item records the Issue, track, gate, priority, lane, dependencies and evidence. It remains `Ready` until the first code commit.

## Outcome and Definition of Ready

Implement the first CRM conversation workspace through `SuiteRuntime` and `SplitWorkspace`, consuming public Core APIs and CRM entity references. Deliver WhatsApp inbox list, thread, inbound/outbound delivery states, policy-aware text reply, approved-template selection and dispatch, internal note, assignment and lifecycle state. Render an account-paused state when Core's server-side kill switch blocks outbound and retries, while preserving authorized conversation reading. Maintain server-side authorization, accessibility, responsive behavior, audit and tenant isolation.

Before code, approve both packages; resolve retention and rollout decisions; audit reusable components; and define focused contract, shell, accessibility, RLS, webhook, Meta onboarding, template lifecycle and E2E evidence. Do not implement media, other channels, automated routing, AI, campaigns, calls, SLA, bulk actions or a standalone Communications suite.