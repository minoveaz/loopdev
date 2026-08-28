import { describe, expect, it } from 'vitest';
import {
  ActivityItemSchema,
  CreateTaskCommandSchema,
  NoteReadSchema,
  NoteSchema,
  TaskErrorCodeSchema,
  TaskSchema,
  TimelineEventSchema,
} from '../tasks';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  workspaceId: '00000000-0000-4200-9000-000000000002',
  brandId: '00000000-0000-4200-9000-000000000003',
  relationId: '00000000-0000-4200-9000-000000000004',
  taskId: '00000000-0000-4200-9000-000000000005',
  actorId: '00000000-0000-4200-9000-000000000006',
};
const timestamp = '2026-08-19T00:00:00.000Z';

describe('CRM Tasks contracts', () => {
  it('requires the organization/workspace/brand scope and fixed relation', () => {
    const task = TaskSchema.safeParse({
      id: ids.taskId,
      organizationId: ids.organizationId,
      tenantId: ids.organizationId,
      workspaceId: ids.workspaceId,
      brandId: ids.brandId,
      title: 'Call customer',
      description: null,
      status: 'open',
      priority: 'normal',
      type: null,
      assignedUserId: ids.actorId,
      dueAt: null,
      relationType: 'lead',
      relationId: ids.relationId,
      createdBy: ids.actorId,
      completedAt: null,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    expect(task.success).toBe(true);
    expect(
      CreateTaskCommandSchema.safeParse({
        organizationId: ids.organizationId,
        title: 'Call customer',
        relationType: 'lead',
        relationId: ids.relationId,
        idempotencyKey: 'tasks-create-001',
      }).success,
    ).toBe(true);
  });

  it('keeps notes redacted and timeline events append-only in the read contract', () => {
    const note = NoteSchema.parse({
      id: ids.taskId,
      organizationId: ids.organizationId,
      workspaceId: ids.workspaceId,
      brandId: ids.brandId,
      relationType: 'contact',
      relationId: ids.relationId,
      authorId: ids.actorId,
      body: 'Private context',
      permissions: { canEdit: true, canModerate: false },
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    expect(note.body).toBe('Private context');
    expect(
      NoteReadSchema.safeParse({
        ...note,
        body: null,
        permissions: { canEdit: false, canModerate: false },
      }).success,
    ).toBe(true);

    const event = TimelineEventSchema.parse({
      id: ids.taskId,
      organizationId: ids.organizationId,
      workspaceId: ids.workspaceId,
      brandId: ids.brandId,
      relationType: 'contact',
      relationId: ids.relationId,
      type: 'assignment',
      actorId: ids.actorId,
      actorType: 'user',
      origin: 'task',
      occurredAt: timestamp,
      summary: 'Task assignment changed',
      metadata: { assignedUserId: ids.actorId },
    });
    expect(
      ActivityItemSchema.safeParse({
        kind: 'event',
        source: { sourceType: 'event', sourceId: event.id },
        event,
      }).success,
    ).toBe(true);
  });

  it('exposes only stable task error codes', () => {
    expect(TaskErrorCodeSchema.safeParse('IDEMPOTENCY_CONFLICT').success).toBe(true);
    expect(TaskErrorCodeSchema.safeParse('INTERNAL_STACK').success).toBe(false);
  });
});
