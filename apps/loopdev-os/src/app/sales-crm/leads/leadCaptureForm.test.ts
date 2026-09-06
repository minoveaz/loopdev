import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LEAD_CAPTURE_VALUES,
  buildCaptureLeadCommand,
  leadCaptureFormSchema,
} from '@/suites/sales-crm/leads/leadCaptureForm';

const organizationId = '00000000-0000-4000-9000-000000000001';
const contactId = '00000000-0000-4000-9000-000000000002';

describe('leadCaptureFormSchema', () => {
  it('requires a selected contact when capturing for an existing contact', () => {
    const result = leadCaptureFormSchema.safeParse({
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'existing',
      interest: 'Seguro de hogar',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.contactId).toContain(
        'Select an existing contact or create a new one.',
      );
    }
  });

  it('accepts an existing contact selection with a required interest and source', () => {
    const result = leadCaptureFormSchema.safeParse({
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'existing',
      contactId,
      interest: 'Seguro de hogar',
      sourceKind: 'manual',
    });
    expect(result.success).toBe(true);
  });

  it('requires a first name and a contact channel for a new contact', () => {
    const result = leadCaptureFormSchema.safeParse({
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'new',
      interest: 'Seguro de hogar',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.firstName).toContain('First name is required for a new contact.');
      expect(fieldErrors.email).toContain('Enter at least one email address or phone number.');
    }
  });

  it('accepts a new contact with only a phone channel', () => {
    const result = leadCaptureFormSchema.safeParse({
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'new',
      firstName: 'Ana',
      phone: '+34600000000',
      interest: 'Seguro de hogar',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an incomplete phone number', () => {
    const result = leadCaptureFormSchema.safeParse({
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'new',
      firstName: 'Ana',
      phone: '123',
      interest: 'Seguro de hogar',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed assignedUserId', () => {
    const result = leadCaptureFormSchema.safeParse({
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'existing',
      contactId,
      interest: 'Seguro de hogar',
      assignedUserId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('requires a non-empty interest', () => {
    const result = leadCaptureFormSchema.safeParse({
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'existing',
      contactId,
      interest: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('buildCaptureLeadCommand', () => {
  it('builds a command for an existing contact without contact-creation fields', () => {
    const command = buildCaptureLeadCommand(organizationId, {
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'existing',
      contactId,
      interest: 'Seguro de hogar',
      sourceKind: 'manual',
    });
    expect(command).toMatchObject({
      organizationId,
      contactId,
      interest: 'Seguro de hogar',
      assignedUserId: null,
      source: { kind: 'manual', provider: null, externalId: null, campaign: null, utm: {} },
    });
    expect(command).not.toHaveProperty('firstName');
  });

  it('builds a command with new-contact fields and no contactId', () => {
    const command = buildCaptureLeadCommand(organizationId, {
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'new',
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@example.test',
      companyName: 'Acme',
      interest: 'Seguro de hogar',
      sourceKind: 'campaign',
      provider: 'meta',
      externalId: 'meta-lead-1',
      campaign: 'salud-abril',
      utmMedium: 'social',
    });
    expect(command).toMatchObject({
      organizationId,
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@example.test',
      phone: null,
      companyName: 'Acme',
      interest: 'Seguro de hogar',
      source: {
        kind: 'campaign',
        provider: 'meta',
        externalId: 'meta-lead-1',
        campaign: 'salud-abril',
        utm: { medium: 'social' },
      },
    });
    expect(command).not.toHaveProperty('contactId');
  });

  it('defaults assignedUserId to null when left empty', () => {
    const command = buildCaptureLeadCommand(organizationId, {
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'existing',
      contactId,
      interest: 'Seguro de hogar',
    });
    expect(command.assignedUserId).toBeNull();
  });

  it('passes through an explicit assignedUserId', () => {
    const assignedUserId = '00000000-0000-4000-9000-000000000009';
    const command = buildCaptureLeadCommand(organizationId, {
      ...DEFAULT_LEAD_CAPTURE_VALUES,
      contactMode: 'existing',
      contactId,
      interest: 'Seguro de hogar',
      assignedUserId,
    });
    expect(command.assignedUserId).toBe(assignedUserId);
  });
});
