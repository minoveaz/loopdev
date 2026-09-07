import { describe, expect, it } from 'vitest';
import { crmContacts, crmCustomer360, crmLeads, createCrmContact, createCrmLead, moveCrmOpportunity, resetCrmRuntime, updateCrmContact } from './runtimeAdapter';

describe('CRM runtime adapter', () => {
  it('provides valid deterministic local CRM records', async () => {
    resetCrmRuntime();
    const organizationId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const contacts = await crmContacts('sandbox', organizationId);
    const leads = await crmLeads('preview', organizationId);
    const customer = await crmCustomer360('preview', organizationId, contacts.items[0].id);
    expect(contacts.items[0].id).toBe('11111111-1111-4111-8111-111111111111');
    expect(leads.items[0].contactId).toBe(contacts.items[0].id);
    expect(customer.contact.id).toBe(contacts.items[0].id);
    expect((await crmCustomer360('sandbox', organizationId, '88888888-8888-4888-8888-888888888888')).leads).toHaveLength(0);
  });

  it('supports non-UUID local organization keys without invalid mock entities', async () => {
    resetCrmRuntime();
    const contacts = await crmContacts('sandbox', 'default-organization');
    expect(contacts.items[0].organizationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('creates a local lead from an existing contact', async () => {
    resetCrmRuntime();
    const organizationId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
    const result = createCrmLead('sandbox', {
      organizationId,
      contactId: '88888888-8888-4888-8888-888888888888',
      interest: 'New opportunity',
      source: { kind: 'manual', utm: {} },
    });

    expect(result.lead.contactId).toBe(result.contact.id);
    await expect(crmCustomer360('sandbox', organizationId, '99999999-9999-4999-8999-999999999999')).rejects.toThrow(
      'could not be found',
    );
  });

  it('creates and updates contacts locally while blocking Preview', async () => {
      resetCrmRuntime();
      const organizationId = 'local-org-key';
      const contact = createCrmContact('sandbox', {
        organizationId,
        firstName: 'Marta',
        email: 'marta@example.com',
        phone: null,
      });
      const updated = updateCrmContact('sandbox', {
        organizationId,
        contactId: contact.id,
        firstName: 'Marta Updated',
        expectedUpdatedAt: contact.updatedAt,
      });
      expect(updated.firstName).toBe('Marta Updated');
      expect(updated.organizationId).toMatch(/^[0-9a-f-]{36}$/);
      expect(() => createCrmContact('preview', {
        organizationId,
        firstName: 'Blocked',
        email: 'blocked@example.com',
        phone: null,
      })).toThrow('read-only');
      expect(() => updateCrmContact('preview', {
        organizationId,
        contactId: contact.id,
        firstName: 'Blocked',
        expectedUpdatedAt: updated.updatedAt,
      })).toThrow('read-only');
    });
  it('keeps preview read-only while sandbox mutations stay local', async () => {
    resetCrmRuntime();
    const organizationId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    await expect(() => moveCrmOpportunity('preview', organizationId, '33333333-3333-4333-8333-333333333333', 'won')).toThrow(
      'read-only',
    );
    const updated = moveCrmOpportunity(
      'sandbox',
      organizationId,
      '33333333-3333-4333-8333-333333333333',
      'proposal',
    );
    expect(updated.stageKey).toBe('proposal');
  });
});
