import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyWhatsAppSignature } from './whatsappSignature';

describe('WhatsApp webhook signature', () => {
  it('accepts a valid HMAC signature and rejects a forged one', () => {
    const body = JSON.stringify({ object: 'whatsapp_business_account' });
    const secret = 'dev-app-secret';
    const digest = createHmac('sha256', secret).update(body).digest('hex');
    expect(verifyWhatsAppSignature(body, `sha256=${digest}`, secret)).toBe(true);
    expect(verifyWhatsAppSignature(body, 'sha256=forged', secret)).toBe(false);
  });

  it('rejects missing, malformed and body-mismatched signatures', () => {
    const body = JSON.stringify({ object: 'whatsapp_business_account' });
    const secret = 'dev-app-secret';
    const digest = createHmac('sha256', secret).update(body).digest('hex');
    expect(verifyWhatsAppSignature(body, null, secret)).toBe(false);
    expect(verifyWhatsAppSignature(body, 'invalid', secret)).toBe(false);
    expect(verifyWhatsAppSignature(`${body}!`, `sha256=${digest}`, secret)).toBe(false);
  });
});
