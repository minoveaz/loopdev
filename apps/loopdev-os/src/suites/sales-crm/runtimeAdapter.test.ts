import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  completeCrmTask,
  createCrmContact,
  createCrmLead,
  createCrmOpportunity,
  createCrmTask,
  crmContacts,
  crmCustomer360,
  crmLeads,
  crmOpportunity,
  crmTasks,
  moveCrmOpportunity,
  moveCrmOpportunityStage,
  resetCrmRuntime,
  updateCrmContact,
  updateCrmTask,
} from './runtimeAdapter';

afterEach(() => {
  vi.unstubAllGlobals();
});

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
    expect(
      (await crmCustomer360('sandbox', organizationId, '88888888-8888-4888-8888-888888888888'))
        .leads,
    ).toHaveLength(0);
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
    await expect(
      crmCustomer360('sandbox', organizationId, '99999999-9999-4999-8999-999999999999'),
    ).rejects.toThrow('could not be found');
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
    expect(() =>
      createCrmContact('preview', {
        organizationId,
        firstName: 'Blocked',
        email: 'blocked@example.com',
        phone: null,
      }),
    ).toThrow('read-only');
    expect(() =>
      updateCrmContact('preview', {
        organizationId,
        contactId: contact.id,
        firstName: 'Blocked',
        expectedUpdatedAt: updated.updatedAt,
      }),
    ).toThrow('read-only');
  });
  it('keeps preview read-only while sandbox mutations stay local', async () => {
    resetCrmRuntime();
    const organizationId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    await expect(() =>
      moveCrmOpportunity('preview', organizationId, '33333333-3333-4333-8333-333333333333', 'won'),
    ).toThrow('read-only');
    const updated = moveCrmOpportunity(
      'sandbox',
      organizationId,
      '33333333-3333-4333-8333-333333333333',
      'proposal',
    );
    expect(updated.stageKey).toBe('proposal');
  });

  it('creates, reads and moves local opportunities without remote writes or UUID-only organization keys', async () => {
    resetCrmRuntime();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const organizationId = 'default-organization';
    const contacts = await crmContacts('sandbox', organizationId);
    const opportunity = await createCrmOpportunity('sandbox', {
      organizationId,
      contactId: contacts.items[0].id,
      productKey: 'local-product',
      name: 'Local product rollout',
      amount: 1200,
      currency: 'EUR',
      probability: 50,
      expectedCloseDate: '2026-02-01',
      idempotencyKey: 'local-opportunity-001',
    });

    expect(opportunity.organizationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(await crmOpportunity('sandbox', organizationId, opportunity.id)).toMatchObject({
      id: opportunity.id,
      name: 'Local product rollout',
    });
    const moved = await moveCrmOpportunityStage('sandbox', {
      organizationId,
      opportunityId: opportunity.id,
      stageKey: 'proposal',
      expectedVersion: opportunity.version,
      origin: 'record',
    });
    expect(moved.stageKey).toBe('proposal');
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(
      createCrmOpportunity('preview', {
        organizationId,
        contactId: contacts.items[0].id,
        productKey: 'blocked',
        name: 'Blocked',
        currency: 'EUR',
        idempotencyKey: 'local-opportunity-002',
      }),
    ).rejects.toThrow('read-only');
  });

  it('creates, lists, updates and completes local tasks without remote writes', async () => {
    resetCrmRuntime();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const organizationId = 'local-org-key';
    const contact = createCrmContact('sandbox', {
      organizationId,
      firstName: 'Task',
      email: 'task@example.com',
      phone: null,
    });
    const created = await createCrmTask('sandbox', {
      organizationId,
      title: 'Prepare local follow-up',
      description: null,
      priority: 'urgent',
      type: 'call',
      assignedUserId: null,
      dueAt: '2026-02-02T10:00:00.000Z',
      relationType: 'contact',
      relationId: contact.id,
      idempotencyKey: 'local-task-001',
    });
    const listed = await crmTasks('sandbox', { organizationId, limit: 100 });
    expect(listed.items.some((task) => task.id === created.id)).toBe(true);
    const updated = await updateCrmTask('sandbox', {
      organizationId,
      taskId: created.id,
      title: 'Prepare updated follow-up',
      expectedVersion: created.version,
      idempotencyKey: 'local-task-002',
    });
    const completed = await completeCrmTask('sandbox', {
      organizationId,
      taskId: updated.id,
      expectedVersion: updated.version,
      idempotencyKey: 'local-task-003',
    });
    expect(completed).toMatchObject({ title: 'Prepare updated follow-up', status: 'completed' });
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(
      createCrmTask('preview', {
        organizationId,
        title: 'Blocked',
        priority: 'normal',
        assignedUserId: null,
        dueAt: null,
        relationType: 'contact',
        relationId: contact.id,
        idempotencyKey: 'local-task-004',
      }),
    ).rejects.toThrow('read-only');
  });
});
