---
title: CRM Customer 360 Domain Contract
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/88
---

# Contrato Customer 360

## Read models

```ts
type Customer360Scope = {
  tenantId: string;
  workspaceId: string;
  contactId: string;
};

type Customer360View = {
  contact: ContactSummary;
  leads: LeadSummary[];
  opportunities: OpportunitySummary[];
  tasks: TaskSummary[];
  notes: AuthorizedNoteSummary[];
  timeline: ActivityItem[];
  cursors: {
    leads: string | null;
    opportunities: string | null;
    tasks: string | null;
    notes: string | null;
    timeline: string | null;
  };
  sectionState: Record<'profile' | 'leads' | 'opportunities' | 'tasks' | 'notes' | 'timeline',
    'fresh' | 'stale' | 'loading' | 'error' | 'forbidden'>;
};

type ActivitySource = {
  sourceType: 'task' | 'note' | 'event';
  sourceId: string;
};

type AuthorizedNoteSummary = {
  id: string;
  body: string;
  authorId: string;
  permissions: { canEdit: boolean; canModerate: boolean };
  source: ActivitySource;
};
```

## Queries and commands

| Operation | Input | Result |
| --- | --- | --- |
| `getCustomer360` | tenant/workspace/contact scope, section limits | Authorized profile and section summaries |
| `listCustomer360Activity` | scope, filters, cursor, limit | Deduplicated ActivityItem page |
| `listCustomer360Section` | scope, section, cursor, limit | Independently paginated authorized section |
| `createContextTask` | contactId, relation, task input, idempotency key | Task and activity event |
| `createContextNote` | contactId, body, idempotency key | Note and activity event |

## Rules

- Customer 360 is a projection, not a new domain entity.
- Every query is tenant/workspace/contact scoped and authorized server-side.
- Related Leads, Opportunities and Tasks must resolve through authorized relations.
- Notes expose permissions; unauthorized Note bodies are omitted.
- TimelineEvents are append-only.
- Activity deduplication uses `sourceType + ':' + sourceId`.
- A Task or Note appears once even when reachable through Contact and a related Lead/Opportunity.
- Unauthorized sections or Note bodies are omitted rather than exposed as empty placeholders.
- Context mutations are transactional and emit their activity event.
- No cross-tenant references or unbounded aggregate queries.
- Sections load incrementally and expose independent cursors and freshness/error state.
- Related entity changes invalidate the affected section; a stale projection is labeled as stale.
- Customer 360 reads are bounded and avoid N+1 queries; any cache must include tenant, workspace,
  contact and permission scope in its key.
- Reads of Notes and confidential Contact fields are auditable when policy requires it.

## Errors

```ts
type Customer360ErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'CROSS_TENANT_REFERENCE'
  | 'ACTIVITY_DEDUPLICATION_ERROR';
```

## Compatibility

Customer 360 is a read projection over stable Contact, Lead, Opportunity, Task, Note and Timeline
contracts. Its section order and labels may change without changing source entity IDs or event types.
