import { describe, expect, it } from 'vitest';
import { CrmCaptureLeadCommandSchema } from '../../../../../packages/contracts/src/crm/crm';

describe('CRM lead capture', () => {
  it('accepts a first-contact campaign payload with attribution', () => {
    const result = CrmCaptureLeadCommandSchema.parse({ organizationId: '00000000-0000-4000-9000-000000000001', firstName: 'Ana', source: 'facebook', utm: { source: 'facebook', medium: 'paid_social', campaign: 'salud' } });
    expect(result.utm.campaign).toBe('salud');
  });
});
