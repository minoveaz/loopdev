---
title: Communications Core Component Audit
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

# Communications Core Component Audit

## Ownership boundary

```text
App Router -> SuiteRuntime/SuiteCanvas -> communications-inbox widget -> features -> entities -> shared
```

Communications Core owns no standalone shell component. Its UI contract is consumed by domain entities and features; the CRM Inbox package owns the visible workflow composition.

| Surface | Classification | Rationale |
| --- | --- | --- |
| PlatformHeader, SuiteSidebar, context panel and Canvas | Reuse from `@loopdev/ui` | Platform-owned mandatory zones. |
| Account health badge and policy restriction alert | Compose inside suite widget | Consumer-specific presentation of Core read models. |
| Conversation row, transcript item and composer | Implement as module feature | First consumer is CRM; no second real consumer exists. |
| Account, channel, conversation, message and template models | Implement as domain entity | Public contracts and server use cases, not UI primitives. |
| Provider adapter and webhook processing | Implement as domain/application infrastructure | Server-only, never a UI component. |

## Duplicate and promotion rules

Do not copy Chatwoot components or create a generic chat library. A visual primitive may be promoted only after a second real LoopDev consumer needs the same semantics and accessibility behavior. The Core must not make `@loopdev/ui` depend on Communications, CRM or provider concepts.

## Required component evidence

Before implementation, audit existing UI primitives for list virtualization, avatars, badges, buttons, menus, form controls, dialogs, empty states, loading states and accessible status announcements. Any new component must record owner, public API, responsive behavior, keyboard behavior and registry evidence.