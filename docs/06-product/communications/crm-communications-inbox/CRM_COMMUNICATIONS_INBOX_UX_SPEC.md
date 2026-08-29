---
title: CRM Communications Inbox UX Specification
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

# CRM Communications Inbox UX Specification

## Purpose

CRM Communications Inbox lets authorized commercial teams triage and handle customer WhatsApp conversations while keeping the canonical CRM relationship in context. It consumes Communications Core; it never owns provider accounts, credentials, webhook processing or delivery policy.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| Inbox | `/sales-crm/communications` | `split` | Triage and act on authorized conversations. |
| Conversation | `/sales-crm/communications/:conversationId` | `split` | Read thread, reply and inspect CRM context. |
| Contact conversation history | From contact record | `split` | Open an authorized conversation without duplicating the inbox. |

`SuiteSidebar` provides the CRM module entry. `ModuleContextSidebar` contains inbox filters and conversation selection; `SuiteCanvas` contains the conversation header, timeline and composer; `ModuleContextPanel` contains the selected contact's CRM context. The mandatory platform zones remain present through `SuiteRuntime`; the panel is context, not a second navigation system.

## Roles and actions

| Role | Actions |
| --- | --- |
| Agent | Read and operate conversations assigned in authorized workspaces, assign an eligible conversation to self, reply, add internal note and change permitted lifecycle state. |
| Manager | Agent actions plus reassign and operate all conversations in authorized workspaces. |
| Viewer | Read authorized conversations and CRM context; no reply or lifecycle mutation. |
| Organization administrator | Uses separate account settings; not a routine inbox action. |

Every disabled action must explain whether permission, connection health or channel policy prevents it. Account management and export are excluded from the first inbox vertical.

## Workflow and states

The first lifecycle is `open -> pending | snoozed | closed`, with authorized reopen. An inbound conversation starts `open` and unassigned. The initial inbox filters are `Open`, `Assigned to me`, `Unassigned`, `Pending`, `Snoozed` and `Closed`; saved views, teams, labels, bulk actions and macros are deferred.

The list row has stable density and shows contact identity, last-message preview, WhatsApp channel, unread state, timestamp, assigned agent and conversation status. The header shows selected contact, channel, status and assignment. The timeline differentiates inbound, outbound, internal note and system event. The composer has unambiguous `Reply` and `Internal note` modes; notes never reach the contact.

If the account is disconnected, outbound is paused by the account kill switch, the user lacks permission, the message failed, no conversation is selected, the list is empty, or the WhatsApp 24-hour window has expired, the screen renders a specific state. A paused account preserves authorized reading and history but disables replies with an operational status. Expired windows disable free text and provide the approved-template selection permitted by Core policy. The Inbox never bypasses Core validation or displays templates rejected, archived or outside the current organization.

Desktop displays the three declared work areas. Tablet may collapse the CRM context panel. Mobile shows inbox, conversation and CRM context as sequential views while preserving the same actions, semantics and accessible labels. Loading preserves stable list and composer geometry; destructive actions require confirmation.

## Journeys and exclusions

1. An agent opens `Open`, selects an inbound WhatsApp conversation and sees the CRM contact context. If the inbound number was unknown, the contact is visibly pending identity review.
2. The agent assigns it to self, writes a reply and receives a visible queued/sent/failed result.
3. The agent records an internal note, marks the conversation pending, and the timeline identifies the actor and state change.
4. A manager reassigns or closes a permitted conversation; a viewer can inspect but not mutate it.

Excluded: other live channels, attachments, audio, calls, AI suggestions, translation, SLA, campaigns, customer service cases, automated routing, bulk actions, external applications and standalone inbox navigation.