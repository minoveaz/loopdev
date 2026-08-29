import { describe, expect, it } from 'vitest';
import { CrmActivityReadSchema, CrmActivitySchema, CrmAuditEventSchema, CrmCaptureLeadCommandSchema, CrmContactConsentSchema, CrmCompanySchema, CrmContactSchema, CrmCreateLeadCommandSchema, CrmEntityLookupPageSchema, CrmInboundContactResolutionSchema, CrmLeadSchema, CrmLeadAttributionSchema, CrmNoteReadSchema, CrmNoteSchema, CrmRelatedPersonSchema, CrmResolveWhatsAppInboundContactCommandSchema, CrmTaskSchema } from '../crm';

const ids = { organizationId: '00000000-0000-4000-9000-000000000001', contactId: '00000000-0000-4000-9000-000000000002', leadId: '00000000-0000-4000-9000-000000000003', id: '00000000-0000-4000-9000-000000000004' };
const timestamp = '2026-08-07T00:00:00.000Z';
const manualSource = { kind: 'manual' as const };

describe('CRM contracts', () => {
  it('requires an organization boundary for contacts and leads', () => {
    expect(CrmContactSchema.safeParse({ id: ids.id, firstName: 'Ana', createdAt: timestamp, updatedAt: timestamp }).success).toBe(false);
    expect(CrmLeadSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, contactId: ids.contactId, source: manualSource, createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(CrmLeadSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, contactId: ids.contactId, createdAt: timestamp, updatedAt: timestamp }).success).toBe(false);
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
    expect(CrmCreateLeadCommandSchema.safeParse({ organizationId: ids.organizationId, contactId: ids.contactId, source: manualSource }).success).toBe(true);
    expect(CrmCreateLeadCommandSchema.safeParse({ organizationId: ids.organizationId, contactId: ids.contactId, source: { kind: 'facebook' } }).success).toBe(false);
  });

  it('defines a CRM-owned resolution contract for WhatsApp inbound contacts', () => {
    expect(CrmResolveWhatsAppInboundContactCommandSchema.safeParse({ organizationId: ids.organizationId, phone: '+34600123456', profileName: 'Ana' }).success).toBe(true);
    expect(CrmResolveWhatsAppInboundContactCommandSchema.safeParse({ organizationId: ids.organizationId, phone: '600123456' }).success).toBe(false);
    expect(CrmInboundContactResolutionSchema.safeParse({ contactId: ids.contactId, organizationId: ids.organizationId, identityStatus: 'pending_identity_review', created: true }).success).toBe(true);
  });

  it('keeps notes scoped and auditable', () => {
    expect(CrmNoteSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, leadId: ids.leadId, authorUserId: ids.id, body: 'Follow up tomorrow', visibility: 'team', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(CrmNoteSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, authorUserId: ids.id, body: 'Orphan note', createdAt: timestamp, updatedAt: timestamp }).success).toBe(false);
    expect(CrmAuditEventSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, entityType: 'lead', entityId: ids.leadId, action: 'stage_changed', createdAt: timestamp }).success).toBe(true);
  });

  it('enforces shared activity deduplication and append-only shape', () => {
    const activity = {
      id: ids.id,
      organizationId: ids.organizationId,
      workspaceId: ids.organizationId,
      leadId: ids.leadId,
      type: 'task_completed',
      sourceType: 'task',
      sourceId: ids.id,
      sourceKey: `task:${ids.id}`,
      summary: 'Task completed',
      occurredAt: timestamp,
      createdAt: timestamp,
    };
    expect(CrmActivityReadSchema.safeParse(activity).success).toBe(true);
    expect(CrmActivityReadSchema.safeParse({ ...activity, sourceKey: `task:${ids.leadId}` }).success).toBe(false);
    expect(CrmActivityReadSchema.safeParse({ ...activity, details: 'private details' }).success).toBe(false);
  });

  it('redacts unauthorized note bodies and bounds lookup pages', () => {
    const note = {
      id: ids.id,
      organizationId: ids.organizationId,
      workspaceId: ids.organizationId,
      leadId: ids.leadId,
      authorUserId: ids.id,
      body: null,
      canReadBody: false,
      visibility: 'private',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    expect(CrmNoteReadSchema.safeParse(note).success).toBe(true);
    expect(CrmNoteReadSchema.safeParse({ ...note, body: 'leaked' }).success).toBe(false);
    expect(CrmEntityLookupPageSchema.safeParse({ items: [], nextCursor: null, hasMore: false }).success).toBe(true);
  });

  it('preserves source attribution for captured leads', () => {
    expect(
      CrmCaptureLeadCommandSchema.safeParse({
        organizationId: ids.organizationId,
        firstName: 'Ana',
        email: 'ana@example.test',
        interest: 'seguro de salud',
        source: { kind: 'campaign', campaign: 'health', utm: { medium: 'paid_social' } },
      }).success,
    ).toBe(true);
    expect(
      CrmCaptureLeadCommandSchema.safeParse({
        organizationId: ids.organizationId,
        interest: 'seguro de salud',
        source: { kind: 'manual' },
      }).success,
    ).toBe(false);
    expect(CrmLeadAttributionSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, leadId: ids.leadId, source: 'campaign', capturedAt: timestamp }).success).toBe(true);
  });
});
