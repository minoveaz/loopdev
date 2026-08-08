import { describe, expect, it } from 'vitest';
import { CrmActivitySchema, CrmContactSchema, CrmLeadSchema, CrmTaskSchema } from '../crm';

const ids = { organizationId: '00000000-0000-4000-9000-000000000001', contactId: '00000000-0000-4000-9000-000000000002', leadId: '00000000-0000-4000-9000-000000000003', id: '00000000-0000-4000-9000-000000000004' };
const timestamp = '2026-08-07T00:00:00.000Z';

describe('CRM contracts', () => {
  it('requires an organization boundary for contacts and leads', () => {
    expect(CrmContactSchema.safeParse({ id: ids.id, firstName: 'Ana', createdAt: timestamp, updatedAt: timestamp }).success).toBe(false);
    expect(CrmLeadSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, contactId: ids.contactId, createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });

  it('validates auditable activities and tasks', () => {
    expect(CrmActivitySchema.safeParse({ id: ids.id, organizationId: ids.organizationId, leadId: ids.leadId, type: 'note', summary: 'Called the customer', occurredAt: timestamp, createdAt: timestamp }).success).toBe(true);
    expect(CrmTaskSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, leadId: ids.leadId, title: 'Send quote', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });
});
