import { describe, expect, it } from 'vitest';
import {
  AuthorizedNoteSummarySchema,
  Customer360RecordViewSchema,
  Customer360ScopeSchema,
  Customer360SectionQuerySchema,
} from '../customer-360';
import { ActivityItemSchema } from '../tasks';

const ids = {
  tenantId: '00000000-0000-4200-9000-000000000001',
  workspaceId: '00000000-0000-4200-9000-000000000002',
  brandId: '00000000-0000-4200-9000-000000000003',
  contactId: '00000000-0000-4200-9000-000000000004',
  sourceId: '00000000-0000-4200-9000-000000000005',
  actorId: '00000000-0000-4200-9000-000000000006',
};
const timestamp = '2026-08-19T00:00:00.000Z';

describe('Customer 360 contracts', () => {
  it('normalizes the organization compatibility alias into the tenant scope', () => {
    expect(
      Customer360ScopeSchema.parse({
        organizationId: ids.tenantId,
        workspaceId: ids.workspaceId,
        brandId: ids.brandId,
        contactId: ids.contactId,
      }),
    ).toEqual({
      tenantId: ids.tenantId,
      workspaceId: ids.workspaceId,
      brandId: ids.brandId,
      contactId: ids.contactId,
    });
  });

  it('keeps section cursors independent and bounds each section', () => {
    const query = Customer360SectionQuerySchema.parse({
      tenantId: ids.tenantId,
      contactId: ids.contactId,
      section: 'timeline',
      limit: '10',
    });
    expect(query).toMatchObject({
      tenantId: ids.tenantId,
      section: 'timeline',
      limit: 10,
      cursor: undefined,
    });
    expect(
      Customer360SectionQuerySchema.safeParse({
        tenantId: ids.tenantId,
        contactId: ids.contactId,
        section: 'timeline',
        limit: '101',
      }).success,
    ).toBe(false);
    expect(Customer360RecordViewSchema.shape.view.parse('record')).toBe('record');
    expect(
      Customer360SectionQuerySchema.safeParse({
        tenantId: ids.tenantId,
        contactId: ids.contactId,
        section: 'unknown',
      }).success,
    ).toBe(false);
  });

  it('represents authorized note summaries without exposing a body when denied', () => {
    const note = AuthorizedNoteSummarySchema.parse({
      id: ids.sourceId,
      organizationId: ids.tenantId,
      tenantId: ids.tenantId,
      workspaceId: ids.workspaceId,
      brandId: ids.brandId,
      relationType: 'contact',
      relationId: ids.contactId,
      authorId: ids.actorId,
      body: null,
      permissions: { canEdit: false, canModerate: false },
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: { sourceType: 'note', sourceId: ids.sourceId },
    });
    expect(note.body).toBeNull();
  });

  it('keeps timeline sources stable for authorized deduplication', () => {
    const event = {
      id: ids.sourceId,
      organizationId: ids.tenantId,
      tenantId: ids.tenantId,
      workspaceId: ids.workspaceId,
      brandId: ids.brandId,
      relationType: 'contact' as const,
      relationId: ids.contactId,
      type: 'task' as const,
      actorId: ids.actorId,
      actorType: 'user' as const,
      origin: 'task' as const,
      occurredAt: timestamp,
      summary: 'Task created',
      metadata: {},
    };
    expect(
      ActivityItemSchema.parse({
        kind: 'event',
        source: { sourceType: 'task', sourceId: ids.sourceId },
        event,
      }).source,
    ).toEqual({ sourceType: 'task', sourceId: ids.sourceId });
  });
});
