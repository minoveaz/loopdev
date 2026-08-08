import { describe, expect, it } from 'vitest';
import { mapCrmContactRow, mapCrmLeadRow } from './crm';

const timestamp = '2026-08-07T00:00:00.000Z';
const ids = { id: '00000000-0000-4000-9000-000000000001', organization: '00000000-0000-4000-9000-000000000002', contact: '00000000-0000-4000-9000-000000000003' };

describe('CRM database mappers', () => {
  it('maps database snake_case to the validated contact contract', () => {
    expect(mapCrmContactRow({ id: ids.contact, organization_id: ids.organization, first_name: 'Ana', last_name: null, email: null, phone: null, company_name: null, created_at: timestamp, updated_at: timestamp }).organizationId).toBe(ids.organization);
  });

  it('rejects invalid database lead values at the boundary', () => {
    expect(() => mapCrmLeadRow({ id: ids.id, organization_id: ids.organization, contact_id: ids.contact, brand_id: null, workspace_id: null, stage: 'unknown', status: 'active', source: null, campaign: null, assigned_to_user_id: null, created_at: timestamp, updated_at: timestamp })).toThrow();
  });
});
