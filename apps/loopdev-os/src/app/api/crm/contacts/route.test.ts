import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, createContact, listContacts, updateContact } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  createContact: vi.fn(),
  listContacts: vi.fn(),
  updateContact: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/core', () => ({ createContact, listContacts, updateContact }));

import { GET, PATCH, POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const contactId = '00000000-0000-4000-9000-000000000002';
const timestamp = '2026-08-18T00:00:00.000Z';

describe('CRM contacts API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
    listContacts.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    createContact.mockResolvedValue({ id: contactId });
    updateContact.mockResolvedValue({ id: contactId });
  });

  it('lists contacts with an authorized bounded query', async () => {
    const response = await GET(
      new Request(
        `http://localhost/api/crm/contacts?organizationId=${organizationId}&query=Ana&limit=20`,
      ),
    );
    expect(response.status).toBe(200);
    expect(authorizeCrm).toHaveBeenCalledWith(organizationId, 'crm.read');
    expect(listContacts).toHaveBeenCalledWith({
      organizationId,
      query: 'Ana',
      limit: 20,
    });
  });

  it('returns the contact authorization status without calling the listing service', async () => {
    authorizeCrm.mockResolvedValue({ allowed: false, status: 403 });
    const response = await GET(
      new Request(`http://localhost/api/crm/contacts?organizationId=${organizationId}`),
    );
    expect(response.status).toBe(403);
    expect(listContacts).not.toHaveBeenCalled();
  });

  it('rejects contact creation without a channel', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/contacts', {
        method: 'POST',
        body: JSON.stringify({ organizationId, firstName: 'Ana' }),
      }),
    );
    expect(response.status).toBe(400);
    expect(createContact).not.toHaveBeenCalled();
  });

  it('forwards an authorized contact creation command', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/contacts', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          firstName: 'Ana',
          email: 'ana@example.test',
        }),
      }),
    );
    expect(response.status).toBe(201);
    expect(createContact).toHaveBeenCalledWith({
      organizationId,
      firstName: 'Ana',
      email: 'ana@example.test',
    });
  });

  it('requires the expected contact version for optimistic updates', async () => {
    const response = await PATCH(
      new Request('http://localhost/api/crm/contacts', {
        method: 'PATCH',
        body: JSON.stringify({
          organizationId,
          contactId,
          firstName: 'Updated',
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(updateContact).not.toHaveBeenCalled();
  });

  it('forwards an authorized contact optimistic update', async () => {
    const response = await PATCH(
      new Request('http://localhost/api/crm/contacts', {
        method: 'PATCH',
        body: JSON.stringify({
          organizationId,
          contactId,
          firstName: 'Updated',
          expectedUpdatedAt: timestamp,
        }),
      }),
    );
    expect(response.status).toBe(200);
    expect(updateContact).toHaveBeenCalledWith({
      organizationId,
      contactId,
      firstName: 'Updated',
      expectedUpdatedAt: timestamp,
    });
  });

  it('returns a conflict when the contact changed or no longer exists', async () => {
    updateContact.mockRejectedValue(new Error('CRM contact update conflict or not found'));
    const response = await PATCH(
      new Request('http://localhost/api/crm/contacts', {
        method: 'PATCH',
        body: JSON.stringify({
          organizationId,
          contactId,
          firstName: 'Updated',
          expectedUpdatedAt: timestamp,
        }),
      }),
    );
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'Contact not found or has changed' });
  });
});
