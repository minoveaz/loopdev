import { describe, expect, it } from 'vitest';
import { GET, POST } from './route';

describe('retired Next.js WhatsApp webhook', () => {
  it('rejects GET and POST so Meta has one canonical receiver', async () => {
    await expect(
      GET(new Request('https://loopdev.test/api/webhooks/whatsapp')),
    ).resolves.toMatchObject({ status: 410 });
    await expect(
      POST(new Request('https://loopdev.test/api/webhooks/whatsapp')),
    ).resolves.toMatchObject({ status: 410 });
  });
});
