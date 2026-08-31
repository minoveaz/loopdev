## Views and journeys

Proposed routes are `/marketing-studio/automations` (`data`),
`/marketing-studio/automations/:automationId` (`record`) and a draft editor in `focus`. Admins manage
authorized policy; Marketers create drafts/request activation; Viewers see authorized definitions and
runs. Required activation inputs are trigger, approved action intent, consent context and idempotency
key. Negative journeys cover missing consent, duplicate activation, rate limit, failed run, paused
workflow, unrecoverable action and revoked access. Product, Workflow, Communications and Tech Lead
approval is required before activation.
---
title: Marketing Automation UX Specification
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/151
---

# Marketing Automation UX Specification

This deferred module lets authorized users inspect automation definitions, execution history and
failures via `overview`, `data`, `record` and `split` Canvas recipes. It declares intent and approval
rules; Workflow/Communications own durable execution, retries, delivery and consent enforcement.
States include `loading`, `empty`, `error`, `forbidden`, paused, failed and success.

Activation gate: durable workflow contract, consent/communications ownership, idempotency, rate
limits, recovery, audit and kill switch approval.
