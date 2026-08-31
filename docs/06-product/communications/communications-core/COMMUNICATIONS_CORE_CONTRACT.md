---
title: Communications Core Contract
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

# Communications Core Contract

## Scope

Core owns organization-scoped communication accounts, contact channel identities, conversations, messages, delivery history, internal notes, templates, webhook events and retry intent. It references the canonical CRM contact and never creates an alternate customer profile.

The existing public baseline is [communications.ts](../../../../packages/contracts/src/communications/communications.ts). The implementation contract must align it with persisted `accountId` and `channelId` references, actor attribution, attachment references and assignment history before those capabilities are activated.

## Read models and operations

```ts
type ConversationSummary = {
  id: string;
  organizationId: string;
  accountId: string;
  channelId: string;
  contactId: string;
  channel: 'whatsapp';
  status: 'open' | 'pending' | 'snoozed' | 'closed';
  assignedToUserId: string | null;
  lastMessageAt: string | null;
  lastActivityAt: string;
  lastInboundAt: string | null;
  windowExpiresAt: string | null;
  version: number;
};
```

| Operation | Input | Result |
| --- | --- | --- |
| `listConversations` | authorized scope, filters, cursor, limit, order | Authorized summaries and cursor. |
| `getConversation` | conversation ID and authorized scope | Conversation, messages, notes and CRM reference. |
| `receiveProviderEvent` | verified provider event | Idempotent normalized processing result. |
| `resolveInboundContact` | verified E.164 channel identity | CRM public command result for a canonical or pending-identity contact. |
| `sendCommunication` | conversation, body or template, idempotency key | Persisted message and normalized dispatch status. |
| `recordMessageStatus` | provider message ID and signed event | Idempotent delivery history update. |
| `retryCommunication` | failed message and authorized worker context | New bounded retry intent or terminal failure. |

## Rules, authorization and errors

- Organization and actor scope are resolved server-side; `organizationId` in a request is never sufficient authorization. Agent operates assigned conversations and may self-assign within an authorized workspace; Manager may reassign and operate authorized workspace conversations; Viewer is read-only; account management is separate from the inbox.
- Every event and outbound command is idempotent within organization and provider account scope.
- WhatsApp text replies require an open verified customer window. Outside it, the command requires an approved template. The first vertical manages template synchronization, approval state and dispatch; media remains deferred.
- Inbound requests CRM's public contact command to create or link a minimum contact identified by E.164 and marked pending identity review when new. Core never writes CRM tables directly. The command never creates a lead, opportunity, commercial assignment or marketing consent.
- Inbound and a contextual reply in the verified customer window do not grant marketing consent. Marketing, proactive and transactional sends require explicit consent and purpose under an approved policy.
- A new inbound conversation is unassigned. An eligible Agent may self-assign it; a Manager may assign or reassign it within an authorized workspace. Automatic routing is deferred.
- Internal notes are never delivered to a provider. Delivery states are append-only history; correction creates a new event.
- A server-side kill switch scoped to organization and account blocks outbound dispatch and retries. It does not block authorized inbox reads, audit access or delivery-history inspection.
- Provider adapters return normalized errors and never surface tokens, raw payloads or cross-organization identifiers.

```ts
type CommunicationsErrorCode =
  | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR'
  | 'CONFLICT' | 'IDEMPOTENCY_CONFLICT' | 'ACCOUNT_UNAVAILABLE'
  | 'CHANNEL_POLICY_RESTRICTED' | 'CONSENT_REQUIRED' | 'MESSAGE_WINDOW_EXPIRED'
  | 'TEMPLATE_REQUIRED' | 'PROVIDER_REJECTED' | 'PROVIDER_UNAVAILABLE';
```

Success and error responses use the platform response envelope and include a `traceId`. Pagination and ordering are finalized in the Inbox contract.

## WhatsApp account and template lifecycle

- Meta Embedded Signup is the standard organization onboarding command. It creates no browser-accessible credential and requires server-side verification of the WABA, Phone Number ID, webhook and account ownership.
- Manual account configuration is not a normal CRM screen. It is an audited, restricted support, migration or technical procedure.
- Template synchronization records the provider identifier, language, body metadata and normalized lifecycle `draft`, `approved`, `rejected` or `archived`.
- A template send validates same-organization account, approved status, parameters, recipient/channel identity, consent purpose and provider policy. It is idempotent and records delivery transitions.

## Retention and rollout

- Messages and internal notes are retained for 24 months from `lastActivityAt`; any authorized message, internal note, assignment or lifecycle update advances it. Delivery events and audit records are retained for 36 months without copying message bodies into technical logs.
- Manual conversation or message deletion is unavailable in the first vertical. A server-side purge is traceable, idempotent, dry-run capable and preserves the minimum permitted audit evidence.
- Legal hold is deferred; later implementation must be able to exempt a conversation from purge without modifying historical delivery evidence.
- Rollout sequence is Dev, one-organization internal pilot, inbound, outbound text inside the customer window, approved templates and general availability. A phase advances only after its recorded security, provider, operational and experience gates pass.
- Webhook intake, delivery-state updates, retries and purges execute through a server-side worker with a limited service role. It resolves organization scope from a verified account or persisted event, receives least-privilege access, emits audit evidence and is never callable from a browser.