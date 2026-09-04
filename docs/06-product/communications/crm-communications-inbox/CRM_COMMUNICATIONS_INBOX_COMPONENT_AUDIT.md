---
title: CRM Communications Inbox Component Audit
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

# CRM Communications Inbox Component Audit

## Composition boundary

```text
route -> SuiteRuntime/SuiteCanvas -> communications-inbox widget -> conversation features -> conversation/contact entities -> shared
```

| Surface | Classification | Rationale |
| --- | --- | --- |
| AppShell, SuiteRuntime, SuiteCanvas and declared context zones | Reuse from `@loopdev/ui` | Platform-owned composition. |
| Inbox list, filters and conversation workspace | Compose inside suite widget | CRM workflow composed in `SplitWorkspace`. |
| Assign, reply, add-note, close, reopen and snooze actions | Implement as module features | User commands against public Communications contracts. |
| Conversation, message, delivery state and assignment view models | Implement as domain entities | CRM presentation of Communications read models. |
| Contact summary, lead and activity context | Compose existing CRM entities | CRM remains the owner of relationship data. |
| Conversation row, message item and policy-aware composer | Implement as module feature | No second consumer proves shared promotion yet. |
| Conversation Workspace portability boundary | Defer shared promotion | Define a provider-neutral composition contract now; promote only after a second real consumer such as VitaBlue. |

## Constraints and evidence

The inbox may not mount its own sidebar, header or overlay manager. It must audit existing list, avatar, badge, menu, dialog, tooltip, input, empty-state and accessibility primitives before creating UI. New module components need keyboard navigation, focus restoration, screen-reader labels, stable dimensions and responsive evidence. Chatwoot informs workflow anatomy only; no component, styles or source code are reused.

## Future consumer review

The CRM widget must keep the conversation list, timeline and composer free of
CRM-specific nouns and data. CRM-specific ownership remains in the context
panel and feature actions. A future VitaBlue consumer may replace that panel
with policy, claim or appointment context while retaining the same Core policy
states and conversation semantics.

The portability contract and Chatwoot pattern decisions are recorded in the
[Chatwoot -> LoopDev reference guide](CHATWOOT_LOOPDEV_REFERENCE_GUIDE.md).