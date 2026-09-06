import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createWhatsAppCloudProvider,
  normalizeWhatsAppPhone,
  normalizeWhatsAppTemplate,
  parseWhatsAppWebhook,
  resolveWhatsAppTemplateParameters,
  sendWhatsAppTemplate,
  sendWhatsAppText,
  WhatsAppProviderError,
} from './whatsapp';

describe('WhatsApp webhook parser', () => {
  afterEach(() => vi.restoreAllMocks());

  it('normalizes phone numbers to E.164-like values', () => {
    expect(normalizeWhatsAppPhone('+34 600-123-456')).toBe('+34600123456');
  });

  it('parses messages and delivery statuses across webhook changes', () => {
    const events = parseWhatsAppWebhook({
      object: 'whatsapp_business_account',
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { phone_number_id: 'phone-1' },
                contacts: [{ profile: { name: 'Ana' } }],
                messages: [
                  {
                    id: 'wamid-1',
                    from: '34600123456',
                    type: 'image',
                    timestamp: '1700000000',
                    image: { id: 'media-1', mime_type: 'image/jpeg', caption: 'Documento' },
                  },
                ],
                statuses: [{ id: 'wamid-2', status: 'delivered', timestamp: '1700000001' }],
              },
            },
          ],
        },
      ],
    });
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({ kind: 'status', status: 'delivered' });
    expect(events[1]).toMatchObject({
      kind: 'message',
      fromPhone: '+34600123456',
      media: { providerMediaId: 'media-1' },
    });
  });

  it('returns no events for unrelated webhook objects', () => {
    expect(parseWhatsAppWebhook({ object: 'instagram' })).toEqual([]);
  });

  it('keeps the account identifier attached to every event in a multi-account payload', () => {
    const events = parseWhatsAppWebhook({
      object: 'whatsapp_business_account',
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { phone_number_id: 'phone-a' },
                messages: [
                  { id: 'message-a', from: '34600123456', type: 'text', text: { body: 'A' } },
                ],
              },
            },
            {
              value: {
                metadata: { phone_number_id: 'phone-b' },
                statuses: [{ id: 'message-b', status: 'read', timestamp: '1700000000' }],
              },
            },
          ],
        },
      ],
    });
    expect(events).toMatchObject([
      { kind: 'message', phoneNumberId: 'phone-a', externalMessageId: 'message-a' },
      { kind: 'status', phoneNumberId: 'phone-b', externalMessageId: 'message-b' },
    ]);
  });

  it('ignores malformed message and status entries without throwing', () => {
    expect(
      parseWhatsAppWebhook({
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                value: {
                  metadata: { phone_number_id: 'phone-1' },
                  messages: [{ from: '34600123456' }, { id: 'missing-from', type: 'text' }],
                  statuses: [{ status: 'delivered' }, { id: 'missing-status' }],
                },
              },
            ],
          },
        ],
      }),
    ).toEqual([]);
  });

  it('sends text through the Meta Cloud API adapter and returns the provider id', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ messages: [{ id: 'wamid.outbound' }] }), { status: 200 }),
        ),
    );
    await expect(
      sendWhatsAppText({
        phoneNumberId: 'phone-1',
        accessToken: 'token',
        to: '+34 600 123 456',
        body: 'Hola',
      }),
    ).resolves.toEqual({ providerMessageId: 'wamid.outbound', status: 'accepted' });
    expect(fetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v20.0/phone-1/messages',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('surfaces provider errors from the Meta Cloud API adapter', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: { message: 'Invalid token' } }), { status: 401 }),
        ),
    );
    await expect(
      sendWhatsAppText({
        phoneNumberId: 'phone-1',
        accessToken: 'token',
        to: '34600123456',
        body: 'Hola',
      }),
    ).rejects.toMatchObject({
      code: 'PROVIDER_REJECTED',
      message: 'Invalid token',
    } satisfies Partial<WhatsAppProviderError>);
  });

  it('sends a template and resolves credentials only through the account resolver', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ messages: [{ id: 'wamid.template' }] }), { status: 200 }),
        ),
    );
    const resolveCredentials = vi
      .fn()
      .mockResolvedValue({ phoneNumberId: 'phone-1', accessToken: 'token' });
    const provider = createWhatsAppCloudProvider(resolveCredentials);
    await expect(
      provider.sendTemplate({
        accountId: 'account-1',
        recipient: '+34600123456',
        templateId: 'welcome',
        parameterNames: ['firstName'],
        parameters: { firstName: 'Ana' },
        idempotencyKey: 'key-1',
      }),
    ).resolves.toEqual({ providerMessageId: 'wamid.template' });
    expect(resolveCredentials).toHaveBeenCalledWith('account-1');
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: expect.stringContaining('"type":"template"') }),
    );
  });

  it('normalizes approved templates and rejects incomplete provider payloads', () => {
    expect(
      normalizeWhatsAppTemplate({
        id: 'template-1',
        name: 'welcome',
        language: 'es',
        category: 'UTILITY',
        status: 'APPROVED',
        components: [{ type: 'BODY', text: 'Hola {{firstName}}' }],
      }),
    ).toMatchObject({ status: 'approved', parameterNames: ['firstName'] });
    expect(normalizeWhatsAppTemplate({ id: 'template-1', name: 'welcome' })).toBeNull();
  });

  it('classifies provider rate limits and unavailability', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: { message: 'Rate limit' } }), { status: 429 }),
        ),
    );
    await expect(
      sendWhatsAppTemplate({
        phoneNumberId: 'phone-1',
        accessToken: 'token',
        to: '+34600123456',
        templateName: 'welcome',
        language: 'es',
        parameters: [],
      }),
    ).rejects.toMatchObject({
      code: 'PROVIDER_RATE_LIMITED',
    } satisfies Partial<WhatsAppProviderError>);
  });

  it('preserves approved parameter order and rejects a mismatched parameter set', () => {
    expect(
      resolveWhatsAppTemplateParameters(['firstName', 'policyNumber'], {
        policyNumber: 'P-1',
        firstName: 'Ana',
      }),
    ).toEqual(['Ana', 'P-1']);
    expect(() => resolveWhatsAppTemplateParameters(['firstName'], { unexpected: 'Ana' })).toThrow(
      'parameters do not match',
    );
  });
});
