---
title: Communications Core UX Specification
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

# Communications Core UX Specification

## Purpose

Communications Core provides policy-aware communication operations to authorized suite experiences. It does not present a standalone product shell. The first visible consumer is CRM Communications Inbox; account administration remains a restricted CRM settings surface until a dedicated configuration module is approved.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| CRM communications inbox | `/sales-crm/communications` | `split` | First consumer; conversations and CRM context. |
| Communication account settings | `/sales-crm/settings/communications` | `data` | Restricted Meta onboarding, reconnection, template health and account view. |

All surfaces use `AppShell`, `SuiteRuntime` and `SuiteCanvas`. Communications Core never mounts a parallel header, sidebar, rail or overlay. The inbox package defines its own user interaction; Core exposes account, policy and provider state to it.

## Roles and visible actions

| Role | Visible actions |
| --- | --- |
| Agent | Read and operate assigned conversations in authorized workspaces, assign an eligible conversation to self, and send only policy-permitted replies. |
| Manager | Agent actions plus reassign and lifecycle actions within authorized workspaces. |
| Organization administrator | Start Meta Embedded Signup, reconnect an account and inspect template/account health. Manual configuration is restricted to approved support, migration or technical cases. |
| Viewer | Read-only access when `communications.read` is granted. |

No browser client receives provider credentials, raw webhook payloads or account tokens. Account management remains outside the routine inbox, and export is deferred.

## States and journeys

Core consumers receive distinct states for loading, no account, account pending, connected, disconnected, provider error, forbidden, policy-restricted, message failed and webhook processing failure. A policy-restricted reply explains the restriction without exposing provider internals.

1. An organization administrator completes Meta Embedded Signup; Core validates and stores only server-side account references and presents connection health.
2. A verified inbound webhook resolves an organization account, deduplicates the event and creates or links a CRM contact by E.164. A new contact remains pending identity review and receives neither lead/opportunity creation nor marketing consent.
3. A consumer requests an outbound reply; Core validates permissions, channel policy, consent, the WhatsApp conversation window and template requirements before dispatch.
4. Core synchronizes and manages the approved-template lifecycle before allowing a template send outside the customer window.
5. Core records queued, sent, delivered, read or failed status and makes the result available to the consumer.

Desktop, tablet and mobile preserve the same ownership. On small screens the consumer presents one task region at a time; Core policy states remain available before any send action.

## Exclusions and approval criteria

Core does not implement a support desk, call center, AI agent, marketing campaign, CRM entity editor, or a second navigation model. Its UX is ready only when all Core states map to stable contract codes, restricted actions are permission-aware, and CRM Inbox can explain WhatsApp policy constraints before dispatch.