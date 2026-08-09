import { describe, expect, it } from 'vitest';
import { normalizeWhatsAppPhone, parseWhatsAppWebhook } from './whatsapp';

describe('WhatsApp webhook parser', () => {
  it('normalizes phone numbers to E.164-like values', () => {
    expect(normalizeWhatsAppPhone('+34 600-123-456')).toBe('+34600123456');
  });

  it('parses messages and delivery statuses across webhook changes', () => {
    const events = parseWhatsAppWebhook({
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            metadata: { phone_number_id: 'phone-1' },
            contacts: [{ profile: { name: 'Ana' } }],
            messages: [{ id: 'wamid-1', from: '34600123456', type: 'image', timestamp: '1700000000', image: { id: 'media-1', mime_type: 'image/jpeg', caption: 'Documento' } }],
            statuses: [{ id: 'wamid-2', status: 'delivered', timestamp: '1700000001' }],
          },
        }],
      }],
    });
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({ kind: 'status', status: 'delivered' });
    expect(events[1]).toMatchObject({ kind: 'message', fromPhone: '+34600123456', media: { providerMediaId: 'media-1' } });
  });

  it('returns no events for unrelated webhook objects', () => {
    expect(parseWhatsAppWebhook({ object: 'instagram' })).toEqual([]);
  });
});
