---
title: CRM Tasks, Notes and Timeline Domain Contract
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/87
---

# Contrato de Tasks, Notes y Timeline

## Read models

```ts
type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
type TaskRelationType = 'contact' | 'lead' | 'opportunity';
type ActivityType = 'task' | 'note' | 'stage_change' | 'assignment' | 'conversion' | 'reopen';
type ActivityActorType = 'user' | 'system';
type ActivityOrigin = 'task' | 'note' | 'entity' | 'customer_360' | 'system';
type ActivitySourceType = 'task' | 'note' | 'event';

type Task = {
  id: string;
  tenantId: string;
  workspaceId: string;
  brandId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  type: string | null;
  assignedUserId: string;
  dueAt: string | null;
  relationType: TaskRelationType;
  relationId: string;
  createdBy: string;
  completedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

type Note = {
  id: string;
  tenantId: string;
  workspaceId: string;
  brandId: string | null;
  relationType: TaskRelationType;
  relationId: string;
  authorId: string;
  body: string;
  permissions: {
    canEdit: boolean;
    canModerate: boolean;
  };
  version: number;
  createdAt: string;
  updatedAt: string;
};

type TimelineEvent = {
  id: string;
  tenantId: string;
  workspaceId: string;
  relationType: TaskRelationType;
  relationId: string;
  type: ActivityType;
  actorId: string | null;
  actorType: ActivityActorType;
  origin: ActivityOrigin;
  occurredAt: string;
  summary: string;
  metadata: Record<string, string>;
};

type ActivityItem =
  | { kind: 'task'; source: ActivitySource; task: Task }
  | { kind: 'note'; source: ActivitySource; note: Note }
  | { kind: 'event'; source: ActivitySource; event: TimelineEvent };

type ActivitySource = {
  sourceType: ActivitySourceType;
  sourceId: string;
};

type MyDayView = {
  overdue: Task[];
  today: Task[];
  upcoming: Task[];
  withoutDueDate: Task[];
  counts: {
    overdue: number;
    today: number;
    completedToday: number;
    upcoming: number;
    urgentOpen: number;
  };
  nextCursor: string | null;
};
```

## Commands and queries

| Operation | Input | Result |
| --- | --- | --- |
| `listTasks` | scope, filters, cursor, limit, sort | Paginated authorized Tasks |
| `getTask` | taskId, scope | Task with relation summary |
| `createTask` | title, assignment, dueAt, relation, fields, idempotency key | Task and timeline event |
| `updateTask` | taskId, patch, expectedVersion | Task or conflict |
| `completeTask` | taskId, expectedVersion | Completed Task and event |
| `reopenTask` | taskId, expectedVersion, reason | Reopened Task and event |
| `assignTask` | taskId, assignedUserId, expectedVersion | Updated Task and event |
| `createNote` | relation, body, idempotency key | Note and timeline event |
| `updateNote` | noteId, body, expectedVersion, idempotency key | Updated Note and edit timeline event |
| `listTimeline` | relation, cursor, limit | Append-only TimelineEvent page |
| `getMyDay` | scope, date, filters, cursor, limit | Paginated `MyDayView` |

## Rules

- Commands and queries enforce tenant/workspace/brand scope server-side.
- Relation must resolve to an authorized Contact, Lead or Opportunity in the same scope.
- Relation integrity is enforced server-side: the target must exist, share tenant/workspace scope and
  remain fixed after Task creation in the pilot.
- Allowed lifecycle transitions are `open -> in_progress|completed|cancelled`,
  `in_progress -> completed|cancelled`, and `completed|cancelled -> open` only through the explicit
  reopen command.
- Completing, reopening and assigning require permission and optimistic version.
- TimelineEvent is append-only; clients cannot edit or delete historical events.
- ActivityItem is the shared read-model union for Tasks, Notes and Timeline consumers in Customer 360.
- Customer 360 must deduplicate related activity so one Task or Note appears once in the aggregated view.
- Task and Note mutations emit an auditable TimelineEvent transactionally.
- Repeating complete, reopen or assign with the same operation returns the current result without
  duplicate events; a different payload with the same idempotency key returns
  `IDEMPOTENCY_CONFLICT`.
- Idempotency keys are operation keys; reuse with a different payload returns `IDEMPOTENCY_CONFLICT`.
- Note authors may edit their own Notes according to policy; manager/admin moderation is permissioned
  and audited. Note edits do not mutate the original creation event and emit a new event.
- Note read models expose `permissions.canEdit` and `permissions.canModerate`; clients do not infer
  Note permissions from role names or ownership alone.
- `updateNote` requires `expectedVersion`, validates the edit/moderation policy and emits a new event
  transactionally without rewriting the original creation event.
- Notes are confidential and excluded from logs, analytics and ordinary error payloads.
- Customer 360 deduplicates ActivityItems by `sourceType + ':' + sourceId`, never by title, date or
  indirect relation.
- No cross-tenant relation can be created or returned.

## Errors

```ts
type TaskErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'RELATION_REQUIRED'
  | 'RELATION_NOT_FOUND'
  | 'INVALID_STATUS_TRANSITION'
  | 'ASSIGNMENT_FORBIDDEN'
  | 'DUE_DATE_INVALID'
  | 'NOTE_EDIT_FORBIDDEN'
  | 'NOTE_MODERATION_FORBIDDEN'
  | 'RELATION_CHANGE_FORBIDDEN'
  | 'CROSS_TENANT_REFERENCE';
```

## Compatibility

Task statuses, relation types and ActivityItem kinds are public contract values. TimelineEvent is
append-only. Presentation labels, ordering and grouping may change without changing stored IDs or
historical event types.
