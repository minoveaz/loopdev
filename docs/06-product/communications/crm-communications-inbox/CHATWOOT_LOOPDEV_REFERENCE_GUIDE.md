---
title: Chatwoot to LoopDev Conversation Workspace Reference Guide
status: proposed
version: 0.1
created: 2026-08-30
updated: 2026-08-30
owner: crm
authority: CRM Communications Inbox UX Specification
program_track: tracks/planned/crm/2026-08-29-communications-core-crm-inbox-definition.md
issue: https://github.com/minoveaz/loopdev/issues/158
---

# Chatwoot to LoopDev Conversation Workspace Reference Guide

## Purpose and authority

This guide records which Chatwoot inbox patterns inform LoopDev's conversation
experience. Chatwoot is product evidence only. It is not an architectural,
visual, source-code or data-model dependency.

The authoritative LoopDev boundaries remain:

- Communications Core owns provider accounts, conversations, messages, delivery,
  consent, policy and server-side authorization.
- CRM owns contacts, leads, opportunities, activities and commercial context.
- Platform owns AppShell, SuiteRuntime, SuiteCanvas, navigation and composition
  recipes.
- The consuming suite owns domain copy, permissions presentation, context panels
  and user actions.

This document extends the [CRM Communications Inbox UX specification](CRM_COMMUNICATIONS_INBOX_UX_SPEC.md)
and does not replace the public [Inbox contract](CRM_COMMUNICATIONS_INBOX_CONTRACT.md).

## Reference principles

1. Adopt operational patterns that reduce agent effort and ambiguity.
2. Adapt every pattern to LoopDev organization isolation, server-side policy and
   the active suite context.
3. Defer capabilities that need an approved contract, provider, storage,
   routing or compliance model.
4. Reject provider-specific architecture, copied source code and copied visual
   identity.
5. Keep the first consumer useful without making the shared layer CRM-aware.

## Canonical LoopDev anatomy

Every consuming experience preserves the mandatory platform zones:

```text
PlatformHeader
└── SuiteSidebar
    └── SuiteRuntime
        └── SplitWorkspace
            ├── ModuleContextSidebar
            │   ├── inbox filters
            │   └── conversation list
            ├── SuiteCanvas
            │   ├── conversation header
            │   ├── message timeline
            │   └── Reply / Internal note composer
            └── ModuleContextPanel
                └── consumer-owned context
```

The `ModuleContextSidebar` selects conversation context. The
`ModuleContextPanel` inspects or acts on the selected context. Neither is a
second global navigation system.

On small screens the composition becomes a semantic sequence:

```text
conversation list -> conversation thread -> consumer context
```

The URL-backed selection and accessible labels remain stable across the
transformation.

## Pattern translation matrix

| Chatwoot pattern | LoopDev decision | CRM first vertical | Future consumer boundary |
| --- | --- | --- | --- |
| Inbox list with unread count and last activity | Adopt | WhatsApp conversations scoped to authorized organization and workspace | Any channel-aware conversation list |
| Open, pending and resolved lifecycle | Adapt | `open`, `pending`, `snoozed`, `closed` with Core authorization | Consumer may expose only states supported by its policy |
| Self-assignment and reassignment | Adapt | Agent self-assigns; Manager reassigns in authorized workspaces | Consumer supplies eligible actors and permission labels |
| Public reply and internal note modes | Adopt | Explicit `Reply` and `Internal note`; notes never reach the contact | Any consumer with a human collaboration workflow |
| Contact or customer side panel | Adapt | CRM contact, identity-review state and Customer 360 context | VitaBlue can provide policy, claim or appointment context |
| Channel or inbox identity in conversation header | Adapt | WhatsApp account and channel status from Core, without credentials | Consumer renders a safe channel summary from a public read model |
| Labels and sidebar filtering | Defer | Not in the first vertical; no contract or governance yet | Add only with shared label ownership and permission design |
| Teams and automatic routing | Defer | New inbound conversations remain unassigned | Requires capacity, routing and audit contracts |
| Canned responses and macros | Defer | Approved WhatsApp templates are the only policy-aware option outside the window | Saved replies need channel capability and localization rules |
| Attachments, audio, calls and rich media | Defer | Text and internal notes only | Requires Storage, provider and retention gates |
| Typing indicators and collision prevention | Defer | Optimistic concurrency protects mutations; presence is not first-slice scope | Add with realtime and privacy evidence |
| AI, bots and automation | Reject for first vertical | No AI or automation decision is implied by an inbound message | Separate approved capability and safety contract |
| Chatwoot account and inbox data model | Reject | Use organization, workspace, brand context and Communications Core | No consumer may create a parallel provider model |
| Chatwoot visual identity or source code | Reject | Use LoopDev tokens, recipes and components | No copied styles or implementation |

## Portable Conversation Workspace contract

The shared concept is a workspace capability, not a new platform shell. A
consumer configures the following public decisions:

- participant identity and safe display fields;
- conversation list filters, ordering and pagination;
- channel capabilities and policy feedback;
- available lifecycle and assignment actions;
- composer modes and localized labels;
- selected-conversation context renderer;
- consumer-specific actions and permission explanations;
- loading, empty, forbidden, disconnected, paused and failure states.

The workspace does not resolve organization context, call a provider, read
internal repositories, decide consent, or infer the meaning of a domain record.
Those responsibilities remain with server APIs and the consuming module.

A future consumer such as VitaBlue should be able to replace the CRM context
panel with a panel containing policy, claim or appointment information while
retaining the list, timeline, composer semantics and Core policy states.
VitaBlue must not import CRM contacts or make the conversation workspace depend
on CRM entities.

## Experience states required by the first vertical

| State | Required behavior |
| --- | --- |
| Loading | Preserve list, timeline and composer geometry with skeleton content. |
| Empty inbox | Explain that no authorized conversations match the active view. |
| Filtered empty | Preserve filters and offer a clear path back to the default view. |
| No selection | Keep the workspace usable without inventing a conversation context. |
| Forbidden | Explain missing access without revealing conversation data. |
| Disconnected account | Preserve authorized history and disable provider actions. |
| Organization or account paused | Preserve reading and audit context; block outbound and retry actions. |
| Window expired | Disable free text and expose only an approved same-account template flow. |
| Send failure | Keep the draft available, show the normalized failure and make retry explicit. |
| Conflict | Refresh the affected conversation state and never silently overwrite another actor. |
| Mobile | Present list, thread and context sequentially with equivalent actions and labels. |

## Approved first journeys

1. An Agent opens the authorized Open view, selects a conversation and reviews
   the contact context.
2. The Agent self-assigns, replies inside the permitted WhatsApp window and
   sees queued, sent or failed delivery state.
3. The Agent adds an internal note and moves the conversation to Pending.
4. A Manager reassigns or closes a conversation within the authorized
   workspace.
5. A Viewer reads the conversation and context without mutation controls.
6. An unknown inbound number remains visibly pending identity review and does
   not become a lead, opportunity or marketing opt-in automatically.

## Promotion gate for shared UI

The first CRM implementation may compose feature-owned conversation rows,
message items, delivery indicators and a policy-aware composer. Promotion into
`@loopdev/ui` requires:

- a second real consumer with a confirmed workflow;
- a stable public API that contains no CRM nouns or fixture data;
- a duplicate review and ownership decision;
- keyboard, accessibility, responsive and theme evidence for both consumers;
- explicit review of data sensitivity, performance and failure boundaries.

Until that evidence exists, shared primitives may be reused, but CRM owns the
workflow composition.

## Sources and review

The reference material is the public [Chatwoot user guide](https://www.chatwoot.com/hc/user-guide/en),
including [Features explained](https://www.chatwoot.com/hc/user-guide/en/categories/features-explained)
and the [developer documentation](https://developers.chatwoot.com/). The guide
was reviewed on 2026-08-30. Chatwoot feature behavior can evolve; LoopDev
contracts and approved tracks remain authoritative.

## Change impact

| Change | Reopen |
| --- | --- |
| New consumer such as VitaBlue | Portability, ownership, responsive and visual review |
| New channel or message capability | Core contract, policy, accessibility and failure states |
| New action or permission | Inbox contract, interaction, accessibility and audit |
| New context panel data | Consumer contract, sensitivity and tenant-scope review |
| Promotion to shared UI | Component inventory, duplicate review, registry and both certification gates |
