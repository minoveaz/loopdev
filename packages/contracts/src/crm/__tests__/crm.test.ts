import { describe, expect, it } from 'vitest';
import { CrmActivitySchema, CrmAuditEventSchema, CrmContactConsentSchema, CrmCompanySchema, CrmContactSchema, CrmCreateLeadCommandSchema, CrmLeadSchema, CrmNoteSchema, CrmRelatedPersonSchema, CrmTaskSchema } from '../crm';

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

  it('keeps related people distinct from contactable contacts', () => {
    const related = CrmRelatedPersonSchema.parse({ id: ids.id, organizationId: ids.organizationId, contactId: ids.contactId, firstName: 'Lucía', role: 'insured', createdAt: timestamp, updatedAt: timestamp });
    expect(related.isContactable).toBe(false);
    expect(CrmCompanySchema.safeParse({ id: ids.id, organizationId: ids.organizationId, name: 'Acme', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });

  it('requires channel consent and a source for lead commands', () => {
    expect(CrmContactConsentSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, contactId: ids.contactId, channel: 'whatsapp', purpose: 'customer support', status: 'granted', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(CrmCreateLeadCommandSchema.safeParse({ organizationId: ids.organizationId, contactId: ids.contactId, source: 'facebook' }).success).toBe(true);
  });

  it('keeps notes scoped and auditable', () => {
    expect(CrmNoteSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, leadId: ids.leadId, authorUserId: ids.id, body: 'Follow up tomorrow', visibility: 'team', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(CrmNoteSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, authorUserId: ids.id, body: 'Orphan note', createdAt: timestamp, updatedAt: timestamp }).success).toBe(false);
    expect(CrmAuditEventSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, entityType: 'lead', entityId: ids.leadId, action: 'stage_changed', createdAt: timestamp }).success).toBe(true);
  });
});
