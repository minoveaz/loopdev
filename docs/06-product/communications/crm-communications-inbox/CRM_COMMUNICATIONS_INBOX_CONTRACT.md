---
title: CRM Communications Inbox Contract
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

# CRM Communications Inbox Contract

## Scope

The Inbox owns CRM-specific read composition and user interaction. It consumes Communications Core public operations and CRM contact references. It does not write provider data directly, resolve organization context from the client, or duplicate conversation persistence.

## Read models and operations

```ts
type InboxConversation = {
  conversationId: string;
  contact: { id: string; displayName: string; phone: string | null };
  channel: 'whatsapp';
  status: 'open' | 'pending' | 'snoozed' | 'closed';
  assignedToUserId: string | null;
  unreadCount: number;
  preview: string | null;
  lastMessageAt: string | null;
  windowExpiresAt: string | null;
};
```

| Operation | Input | Result |
| --- | --- | --- |
| `listInboxConversations` | authorized filters, cursor, limit, order | Paginated inbox rows and counts. |
| `getInboxConversation` | conversation ID and authorized scope | Thread, delivery events, notes and CRM summary. |
| `assignConversation` | conversation ID, assignee and expected version | Updated assignment or conflict. |
| `changeConversationStatus` | conversation ID, target state and expected version | Updated lifecycle state and audit event. |
| `sendInboxReply` | conversation ID, body, idempotency key | Core dispatch outcome and message state. |
| `addInboxInternalNote` | conversation ID, body, idempotency key | Persisted internal-only note. |

## Rules and errors

- Inbox reads and actions resolve active organization, workspace and actor server-side. Agent operates assigned conversations and may self-assign in authorized workspaces; Manager may reassign and operate authorized workspace conversations; Viewer is read-only.
- Replies delegate to `sendCommunication`; the UI cannot override consent, window or template policy. Outside the customer window, it requests only an approved same-organization template and validated parameters.
- Assignment and lifecycle transitions use optimistic concurrency and audit actor, timestamp and reason where required.
- A new inbound conversation is `open` and unassigned. Agent may self-assign only when eligible in the active authorized workspace; Manager may assign or reassign; automatic routing is out of scope.
- Search, filters and previews cannot expose conversations outside authorized CRM and Communications scope.
- Conversation bodies and contact PII are not returned to a user lacking both required permissions.
- A contact created from an unknown inbound number remains pending identity review and does not imply lead, opportunity, commercial assignment or marketing consent.
- Inbox reads remain available when the Core account kill switch pauses outbound. Every reply action must render the normalized paused-account state and cannot enqueue a dispatch or retry.

```ts
type CrmCommunicationsInboxErrorCode =
  | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFLICT'
  | 'ASSIGNMENT_NOT_ALLOWED' | 'INVALID_STATUS_TRANSITION' | 'ACCOUNT_UNAVAILABLE'
  | 'MESSAGE_WINDOW_EXPIRED' | 'TEMPLATE_REQUIRED' | 'CONSENT_REQUIRED'
  | 'PROVIDER_REJECTED' | 'PROVIDER_UNAVAILABLE';
```

Success and failure responses use the platform envelope with `traceId`. Cursor format and sorting fields must be stable before implementation.