import { describe, expect, it } from 'vitest';
import { CreateCommunicationMessageCommandSchema } from '../../../../../packages/contracts/src/communications/communications';

describe('Communications Core contracts', () => {
  it('requires a body or approved template reference for messages', () => {
    expect(() => CreateCommunicationMessageCommandSchema.parse({
      organizationId: '00000000-0000-4000-9000-000000000001',
      conversationId: '00000000-0000-4000-9000-000000000002',
      direction: 'outbound',
    })).toThrow();
  });

  it('accepts an inbound message with an external provider id', () => {
    const result = CreateCommunicationMessageCommandSchema.parse({
      organizationId: '00000000-0000-4000-9000-000000000001',
      conversationId: '00000000-0000-4000-9000-000000000002',
      externalId: 'wamid.example',
      direction: 'inbound',
      status: 'delivered',
      body: 'Hola',
    });
    expect(result.externalId).toBe('wamid.example');
  });
});
