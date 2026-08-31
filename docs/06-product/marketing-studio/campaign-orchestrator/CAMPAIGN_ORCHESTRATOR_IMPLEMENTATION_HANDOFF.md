---
title: Campaign Orchestrator Implementation Handoff
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/148
---

# Campaign Orchestrator Implementation Handoff

## Read first

1. [UX specification](CAMPAIGN_ORCHESTRATOR_UX_SPEC.md)
2. [Component audit](CAMPAIGN_ORCHESTRATOR_COMPONENT_AUDIT.md)
3. [Contract](CAMPAIGN_ORCHESTRATOR_CONTRACT.md)
4. [Impact assessment](CAMPAIGN_ORCHESTRATOR_IMPACT_ASSESSMENT.md)
5. [Content Engine contract](../content-engine/CONTENT_ENGINE_CONTRACT.md)

## Delivery instruction

Repository: `minoveaz/loopdev`. Delivery Issue: [#148](https://github.com/minoveaz/loopdev/issues/148),
under parent Issue #141. After approval and readiness confirmation, create
`feature/marketing-studio-campaign-orchestrator-implementation` from updated `develop`.

Use commits `feat(campaign-orchestrator): implement <slice> (#148)` and a PR with `Closes #148`.
The GitHub Project item records Issue, track, gate, priority, lane, dependencies and evidence, and
remains `Ready` until its first code commit.

## Outcome and Definition of Ready

Implement tenant-safe campaign objectives, calendar and approved-content associations using declared
Shell recipes. Preserve Content Engine immutability and consume read-only future delivery/CRM evidence.
Do not implement publishing, transport, providers, consent, CRM mutation or automation execution.

Before code: approve the five documents; confirm permissions, RLS, Content Engine dependency, calendar
policy, delivery/CRM contracts, tests, tenant gate and rollback. Record focused evidence in Issue #148.
The current status is `proposed`; implementation must not start.
