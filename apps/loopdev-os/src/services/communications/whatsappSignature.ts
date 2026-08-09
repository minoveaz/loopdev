import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyWhatsAppSignature(rawBody: string, header: string | null, appSecret: string) {
  if (!header?.startsWith('sha256=')) return false;
  const received = Buffer.from(header.slice('sha256='.length), 'hex');
  const expected = createHmac('sha256', appSecret).update(rawBody).digest();
  return received.length === expected.length && timingSafeEqual(received, expected);
}
