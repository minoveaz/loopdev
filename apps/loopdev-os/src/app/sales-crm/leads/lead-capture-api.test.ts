import { afterEach, describe, expect, it, vi } from 'vitest';
import { CrmContactSchema, CrmLeadSchema, NoteReadSchema } from '@loopdev/contracts';
import {
  captureLead,
  createLeadNote,
  LeadApiError,
  searchLeadContacts,
} from '@/suites/sales-crm/leads/api';

const organizationId = '00000000-0000-4000-9000-000000000001';
const contactId = '00000000-0000-4000-9000-000000000002';
const leadId = '00000000-0000-4000-9000-000000000003';
const timestamp = '2026-08-24T00:00:00.000Z';

const contact = CrmContactSchema.parse({
  id: contactId,
  organizationId,
  firstName: 'Ana',
  lastName: null,
  email: 'ana@example.test',
  phone: null,
  companyName: null,
  createdAt: timestamp,
  updatedAt: timestamp,
});

const lead = CrmLeadSchema.parse({
  id: leadId,
  organizationId,
  contactId,
  status: 'nuevo',
  interest: 'Seguro de hogar',
  assignedUserId: null,
  source: { kind: 'manual', provider: null, externalId: null, campaign: null, utm: {} },
  duplicateReviewId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
});

afterEach(() => vi.unstubAllGlobals());

describe('captureLead', () => {
  const command = {
    organizationId,
    contactId,
    interest: 'Seguro de hogar',
    assignedUserId: null,
    source: { kind: 'manual' as const, provider: null, externalId: null, campaign: null, utm: {} },
  };

  it('posts the capture command and parses a fresh (201) capture result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ contact, lead, attribution: null, reused: false }), {
        status: 201,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await captureLead(command);

    expect(fetchMock).toHaveBeenCalledWith('/api/crm/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
      signal: undefined,
    });
    expect(result).toMatchObject({ contact, lead, reused: false });
  });

  it('parses a reused (200) capture result without treating it as an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ contact, lead, attribution: null, reused: true }), {
          status: 200,
        }),
      ),
    );

    const result = await captureLead(command);
    expect(result.reused).toBe(true);
  });

  it('maps a forbidden capture to a safe typed error without leaking details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'Unauthorized', code: 'FORBIDDEN' }), {
          status: 403,
        }),
      ),
    );

    await expect(captureLead(command)).rejects.toEqual(
      expect.objectContaining<Partial<LeadApiError>>({ code: 'FORBIDDEN', status: 403 }),
    );
  });

  it('maps a CONTACT_REQUIRED conflict from the nested service error envelope', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: { code: 'CONTACT_REQUIRED', message: 'CRM contact required for lead capture' },
          }),
          { status: 400 },
        ),
      ),
    );

    await expect(captureLead(command)).rejects.toEqual(
      expect.objectContaining<Partial<LeadApiError>>({ code: 'CONTACT_REQUIRED', status: 400 }),
    );
  });

  it('allows a safe retry after a failure: the same command can be resubmitted', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Network error' }), { status: 500 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact, lead, attribution: null, reused: false }), {
          status: 201,
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(captureLead(command)).rejects.toThrow();
    const result = await captureLead(command);
    expect(result.reused).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('maps an invalid/unparseable capture response to a safe UNKNOWN error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 201 })));

    await expect(captureLead(command)).rejects.toEqual(
      expect.objectContaining<Partial<LeadApiError>>({ code: 'UNKNOWN', status: 502 }),
    );
  });
});

describe('searchLeadContacts', () => {
  it('builds a bounded typed GET request against the Contacts endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [contact], nextCursor: null, hasMore: false }), {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const page = await searchLeadContacts({ organizationId, query: 'ana', limit: 10 });

    expect(page.items[0]?.id).toBe(contactId);
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/crm/contacts?organizationId=${organizationId}&limit=10&query=ana`,
      { signal: undefined },
    );
  });

  it('maps forbidden contact search responses to a safe typed error', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 }),
        ),
    );

    await expect(searchLeadContacts({ organizationId, query: 'ana', limit: 10 })).rejects.toEqual(
      expect.objectContaining<Partial<LeadApiError>>({ code: 'FORBIDDEN', status: 403 }),
    );
  });
});

describe('createLeadNote', () => {
  it('uses the existing idempotent lead-note API and validates its response', async () => {
    const note = NoteReadSchema.parse({
      id: '00000000-0000-4000-9000-000000000004',
      organizationId,
      tenantId: organizationId,
      workspaceId: null,
      brandId: null,
      relationType: 'lead',
      relationId: leadId,
      authorId: '00000000-0000-4000-9000-000000000005',
      body: 'Llamar después de las 18:00.',
      permissions: { canEdit: true, canModerate: false },
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const command = {
      organizationId,
      relationType: 'lead' as const,
      relationId: leadId,
      body: note.body as string,
      idempotencyKey: `lead-capture-note-${leadId}`,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(note), { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createLeadNote(command)).resolves.toEqual(note);
    expect(fetchMock).toHaveBeenCalledWith('/api/crm/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    });
  });
});
