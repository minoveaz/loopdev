import { describe, expect, it } from 'vitest';
import { CrmCaptureLeadCommandSchema } from '../../../../../packages/contracts/src/crm/crm';

describe('CRM lead capture', () => {
  it('accepts a first-contact campaign payload with attribution', () => {
    const result = CrmCaptureLeadCommandSchema.parse({ organizationId: '00000000-0000-4000-9000-000000000001', firstName: 'Ana', source: 'facebook', utm: { source: 'facebook', medium: 'paid_social', campaign: 'salud' } });
    expect(result.utm.campaign).toBe('salud');
  });

  it('keeps attribution distinct for two brands in one organization', () => {
    const vitablue = CrmCaptureLeadCommandSchema.parse({
      organizationId: '00000000-0000-4000-9000-000000000001',
      brandId: '00000000-0000-4000-9000-000000000011',
      firstName: 'Ana',
      source: 'facebook',
      campaign: 'vitablue-verano',
      utm: { source: 'facebook', campaign: 'vitablue-verano' },
    });
    const protegeTuSalud = CrmCaptureLeadCommandSchema.parse({
      organizationId: vitablue.organizationId,
      brandId: '00000000-0000-4000-9000-000000000012',
      firstName: 'Luis',
      source: 'facebook',
      campaign: 'protege-tu-salud-verano',
      utm: { source: 'facebook', campaign: 'protege-tu-salud-verano' },
    });

    expect(vitablue.brandId).not.toBe(protegeTuSalud.brandId);
    expect(vitablue.utm.campaign).not.toBe(protegeTuSalud.utm.campaign);
  });
});
